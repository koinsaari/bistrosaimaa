import { after } from 'next/server';
import type { Update } from '@grammyjs/types';
import { createBotDeps } from '@/lib/bot/deps';
import { botEnv, isBotEnabled, secretMatches, type BotEnv } from '@/lib/bot/env';
import { describeError, processUpdate } from '@/lib/bot/handleUpdate';
import { chatIdOf, drainChat, recordUpdate } from '@/lib/bot/updates';

// The drain runs in after() and may chain several model calls.
export const maxDuration = 300;

const reply = (status: number) => new Response(null, { status });

/**
 * Telegram webhook. Anything but 2xx makes Telegram retry, so: duplicates and handled errors answer 200, and only a
 * failure to store the update answers 500. The work happens after the response, one chat at a time, in order.
 */
export async function POST(request: Request): Promise<Response> {
  if (!isBotEnabled()) return reply(404);

  let env: BotEnv;
  try {
    env = botEnv();
  } catch {
    console.error('bot misconfigured: check the TELEGRAM_* environment variables');
    return reply(500); // fail closed
  }
  if (!secretMatches(request.headers.get('x-telegram-bot-api-secret-token'), env.webhookSecret)) return reply(401);

  const update = (await request.json().catch(() => null)) as Update | null;
  if (!update || !Number.isSafeInteger(update.update_id)) return reply(400);

  const chatId = chatIdOf(update);
  if (chatId === null) return reply(200); // an update type the bot doesn't handle

  try {
    if (!(await recordUpdate(update, chatId))) return reply(200); // redelivery
  } catch (error) {
    console.error(`bot update not stored: ${describeError(error)}`);
    return reply(500);
  }

  after(() =>
    createBotDeps(env)
      .then((deps) => drainChat(chatId, (next) => processUpdate(deps, next)))
      .catch((error) => console.error(`bot drain failed: ${describeError(error)}`)),
  );
  return reply(200);
}
