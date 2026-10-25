import type { Message, Update } from '@grammyjs/types';
import { FAILURE_REPLY, runAgent } from '@/lib/bot/agent';
import { parseCallbackData, undoCallbackData } from '@/lib/bot/callbackData';
import { undoChange } from '@/lib/bot/changes';
import type { BotDeps } from '@/lib/bot/deps';
import { importMenu } from '@/lib/bot/importMenu';
import { appendMessage } from '@/lib/bot/memory';
import { chatIdOf } from '@/lib/bot/updates';

export const HELP_TEXT = `Hei! Kirjoita minulle suomeksi, niin muokkaan viikon lounaslistaa.

Esimerkkejä:
- "Mitä listalla on tällä viikolla?"
- "Vaihda tiistain keitto lohikeitoksi"
- "Lisää torstaille huomautus: pähkinää"
- "Hinnat ovat 13,50 ja 14,50"

Muutoksen alla on Kumoa-painike, jolla perut sen.`;

const HELP_COMMAND = /^\/(start|help)(@\w+)?(\s|$)/i;

function senderOf(update: Update): number | undefined {
  return update.message?.from?.id ?? update.callback_query?.from.id;
}

function isAllowedSender(deps: BotDeps, update: Update): boolean {
  const sender = senderOf(update);
  return sender !== undefined && deps.allowedUserIds.has(sender);
}

async function reply(deps: BotDeps, chatId: number, text: string, changeId?: string): Promise<void> {
  await appendMessage(chatId, 'assistant', text);
  await deps.telegram.sendMessage(
    chatId,
    text,
    changeId ? { inline_keyboard: [[{ text: 'Kumoa', callback_data: undoCallbackData(changeId) }]] } : undefined,
  );
}

async function handleText(deps: BotDeps, chatId: number, userId: number, text: string): Promise<void> {
  await appendMessage(chatId, 'user', text);
  const { reply: answer, changeIds } = await runAgent(deps.agentModel, { chatId, userId });
  await reply(deps, chatId, answer, changeIds.at(-1));
}

async function handleImage(deps: BotDeps, message: Message, userId: number): Promise<void> {
  const chatId = message.chat.id;
  await appendMessage(chatId, 'user', message.caption?.trim() || '[kuva]');
  const { reply: answer, changeId } = await importMenu(deps, { chatId, userId, message });
  await reply(deps, chatId, answer, changeId);
}

async function handleMessage(deps: BotDeps, message: Message): Promise<void> {
  const chatId = message.chat.id;
  const userId = message.from!.id;
  if (message.text !== undefined) {
    if (HELP_COMMAND.test(message.text)) await deps.telegram.sendMessage(chatId, HELP_TEXT);
    else if (!message.text.startsWith('/')) await handleText(deps, chatId, userId, message.text);
  } else if (message.photo || message.document) {
    await handleImage(deps, message, userId);
  }
}

async function handleCallback(deps: BotDeps, update: Update): Promise<void> {
  const query = update.callback_query!;
  const chatId = chatIdOf(update);
  try {
    const action = parseCallbackData(query.data);
    if (!action || chatId === null) return;
    const result = await undoChange(action.changeId);
    await reply(
      deps,
      chatId,
      result.ok
        ? result.removed
          ? `Kumottu: vko ${result.week.isoWeek} poistettu.`
          : `Kumottu: vko ${result.week.isoWeek} on palautettu ennalleen.`
        : result.error,
    );
  } finally {
    await deps.telegram.answerCallback(query.id);
  }
}

async function handleUpdate(deps: BotDeps, update: Update): Promise<void> {
  if (!isAllowedSender(deps, update)) return;
  if (update.callback_query) await handleCallback(deps, update);
  else if (update.message) await handleMessage(deps, update.message);
}

export function describeError(error: unknown): string {
  if (!(error instanceof Error)) return typeof error;
  const status = (error as { statusCode?: unknown; status?: unknown }).statusCode ?? (error as { status?: unknown }).status;
  return [error.name, typeof status === 'number' ? String(status) : undefined].filter(Boolean).join(' ');
}

export async function processUpdate(deps: BotDeps, update: Update): Promise<void> {
  try {
    await handleUpdate(deps, update);
  } catch (error) {
    console.error(`bot update failed: ${describeError(error)}`);
    try {
      const chatId = chatIdOf(update);
      if (chatId !== null && isAllowedSender(deps, update)) await deps.telegram.sendMessage(chatId, FAILURE_REPLY);
    } catch {
      // The apology is best effort
    }
  }
}
