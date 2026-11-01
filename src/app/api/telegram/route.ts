import { after } from 'next/server';
import { getBot, type Bot } from '@/lib/bot/chat';
import { describeError } from '@/lib/bot/describeError';
import { isBotEnabled } from '@/lib/bot/env';

// The handler runs in after() and may chain several model calls.
export const maxDuration = 300;

export async function POST(request: Request): Promise<Response> {
  if (!isBotEnabled()) return new Response(null, { status: 404 });

  let bot: Bot;
  try {
    bot = getBot();
  } catch (error) {
    console.error(`bot misconfigured: ${describeError(error)}. Check the TELEGRAM_* and DATABASE_URL environment variables`);
    return new Response(null, { status: 500 }); // fail closed
  }
  return bot.webhooks.telegram(request, { waitUntil: (task) => after(() => task) });
}
