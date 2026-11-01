import { createTelegramAdapter, type TelegramAdapter } from '@chat-adapter/telegram';
import { createPostgresState } from '@chat-adapter/state-pg';
import { attachDatabasePool } from '@vercel/functions';
import { Chat, ConsoleLogger, Message, type SerializedMessage } from 'chat';
import pg from 'pg';
import { AGENT_MODEL, FAILURE_REPLY, runAgent } from '@/lib/bot/agent';
import { describeError } from '@/lib/bot/describeError';
import { parseAllowedUserIds } from '@/lib/bot/env';
import { historyToModelMessages, HISTORY_MAX_AGE_MS, HISTORY_MAX_MESSAGES, turnToModelMessage } from '@/lib/bot/turn';

export const READING_NOTICE = 'Luen listaa…';

export const HELP_TEXT = `Hei! Kirjoita minulle suomeksi, niin muokkaan viikon lounaslistaa.

Esimerkkejä:
- "Mitä listalla on tällä viikolla?"
- "Vaihda tiistain keitto lohikeitoksi"
- "Lisää torstaille huomautus: pähkinää"
- "Hinnat ovat 13,50 ja 14,50"

Voit myös lähettää viikon listan kuvana tai PDF-tiedostona. Kirjoita "kumoa", niin peruutan viimeisimmän muutoksen.`;

export type Bot = Chat<{ telegram: TelegramAdapter }>;

// Lazy, like getDb(), so `next build` doesn't need the environment.
let bot: Bot | undefined;

function createBot(): Bot {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const databaseUrl = process.env.DATABASE_URL;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  if (!secret) throw new Error('TELEGRAM_WEBHOOK_SECRET is not set');
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');
  const allowedUserIds = parseAllowedUserIds(process.env.TELEGRAM_ALLOWED_USER_IDS);
  if (!allowedUserIds.size) throw new Error('TELEGRAM_ALLOWED_USER_IDS is empty');
  const logger = new ConsoleLogger('info');
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 5 });
  attachDatabasePool(pool);

  const instance: Bot = new Chat({
    userName: 'bistrosaimaa',
    adapters: {
      telegram: createTelegramAdapter({
        botToken: token,
        secretToken: secret,
        allowedUserIds: [...allowedUserIds],
        mode: 'webhook',
        logger: logger.child('telegram'),
      }),
    },
    state: createPostgresState({ client: pool, logger: logger.child('state') }),
    // Queued messages must outlive the longest turn (maxDuration), or they are dropped while a file is read.
    concurrency: { strategy: 'burst', queueEntryTtlMs: 300_000 },
    history: { thread: { maxMessages: HISTORY_MAX_MESSAGES, ttlMs: HISTORY_MAX_AGE_MS } },
    logger,
  });

  // The Telegram adapter handles slash commands itself, so /start and /help never reach onDirectMessage.
  instance.onSlashCommand(['/start', '/help'], (event) => event.channel.post(HELP_TEXT).then(() => undefined));

  instance.onDirectMessage(async (thread, message, _channel, context) => {
    try {
      const now = new Date();
      const turn = [...(context?.skipped ?? []), message];
      const chatId = Number(instance.getAdapter('telegram').decodeThreadId(thread.id).chatId);
      const userId = Number(message.author.userId);

      // Chat SDK internal key (ThreadHistoryCache in `chat`): check it when updating Chat SDK.
      const stored = await instance.getState().getList<SerializedMessage>(`msg-history:${thread.id}`);
      const history = historyToModelMessages(stored.map((entry) => Message.fromJSON(entry)), turn, now);
      // Read after the history so the notice isn't taken for the previous reply. Typing shows for only ~5 s and reading
      // a file takes much longer; without this, staff send the file again.
      if (turn.some((m) => m.attachments.length)) await thread.post(READING_NOTICE);
      const current = await turnToModelMessage(turn);
      await thread.post(await runAgent(AGENT_MODEL, { chatId, userId, now, messages: [...history, current] }));
    } catch (error) {
      console.error(`bot message failed: ${describeError(error)}`);
      try {
        await thread.post(FAILURE_REPLY);
      } catch {
        // The apology is best effort
      }
    }
  });
  return instance;
}

export function getBot(): Bot {
  bot ??= createBot();
  return bot;
}
