import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { InlineKeyboardMarkup, Message, WebhookInfo } from '@grammyjs/types';

export const TELEGRAM_MESSAGE_LIMIT = 4096;
const MAX_RETRY_WAIT_SECONDS = 30;

export class TelegramError extends Error {
  constructor(
    readonly method: string,
    readonly status: number,
    readonly retryAfter?: number,
  ) {
    super(`telegram ${method} failed with ${status}`);
    this.name = 'TelegramError';
  }
}

export type TelegramClient = {
  sendMessage(chatId: number, text: string, replyMarkup?: InlineKeyboardMarkup): Promise<void>;
  answerCallback(callbackQueryId: string, text?: string): Promise<void>;
  downloadFile(fileId: string): Promise<Buffer>;
};

export function splitMessage(text: string, limit = TELEGRAM_MESSAGE_LIMIT): string[] {
  const parts: string[] = [];
  let rest = text;
  while (rest.length > limit) {
    const newline = rest.lastIndexOf('\n', limit);
    if (newline > 0) {
      parts.push(rest.slice(0, newline));
      rest = rest.slice(newline + 1);
      continue;
    }
    let end = limit;
    const last = rest.charCodeAt(end - 1);
    if (last >= 0xd800 && last <= 0xdbff) end -= 1;
    parts.push(rest.slice(0, end));
    rest = rest.slice(end);
  }
  parts.push(rest);
  return parts;
}

type ApiResponse<T> =
  | { ok: true; result: T }
  | { ok: false; error_code: number; parameters?: { retry_after?: number } };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The webhook setup is for `scripts/bot-set-webhook.ts` only */
export type TelegramAdminClient = TelegramClient & {
  setWebhook(url: string, secretToken: string): Promise<void>;
  getWebhookInfo(): Promise<WebhookInfo>;
};

export function createTelegramClient(token: string): TelegramAdminClient {
  async function call<T = true>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(params),
    });
    const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;
    if (!response.ok || !body?.ok) {
      throw new TelegramError(
        method,
        body && !body.ok ? body.error_code : response.status,
        body && !body.ok ? body.parameters?.retry_after : undefined,
      );
    }
    return body.result;
  }

  return {
    async sendMessage(chatId, text, replyMarkup) {
      const parts = splitMessage(text);
      for (const [index, part] of parts.entries()) {
        const params = {
          chat_id: chatId,
          text: part,
          ...(replyMarkup && index === parts.length - 1 ? { reply_markup: replyMarkup } : {}),
        };
        try {
          await call<Message>('sendMessage', params);
        } catch (error) {
          if (!(error instanceof TelegramError) || error.status !== 429) throw error;
          await sleep(Math.min(error.retryAfter ?? 1, MAX_RETRY_WAIT_SECONDS) * 1000);
          await call<Message>('sendMessage', params);
        }
      }
    },

    async answerCallback(callbackQueryId, text) {
      await call('answerCallbackQuery', { callback_query_id: callbackQueryId, ...(text ? { text } : {}) });
    },

    async downloadFile(fileId) {
      const file = await call<{ file_path?: string }>('getFile', { file_id: fileId });
      if (!file.file_path) throw new TelegramError('getFile', 404);
      const response = await fetch(`https://api.telegram.org/file/bot${token}/${file.file_path}`);
      if (!response.ok) throw new TelegramError('downloadFile', response.status);
      return Buffer.from(await response.arrayBuffer());
    },

    async setWebhook(url, secretToken) {
      await call('setWebhook', {
        url,
        secret_token: secretToken,
        allowed_updates: ['message', 'callback_query'],
        drop_pending_updates: true,
        max_connections: 10,
      });
    },

    getWebhookInfo: () => call<WebhookInfo>('getWebhookInfo'),
  };
}

/** E2E: sends nothing and logs the method name only. A file id names a fixture in `e2e/fixtures/menus`. */
export function createLogTelegramClient(): TelegramClient {
  const log = (method: string) => console.info(`telegram ${method} (log transport)`);
  return {
    sendMessage: async () => log('sendMessage'),
    answerCallback: async () => log('answerCallbackQuery'),
    downloadFile: async (fileId) => {
      log('downloadFile');
      return readFile(path.join(process.cwd(), 'e2e', 'fixtures', 'menus', path.basename(fileId)));
    },
  };
}
