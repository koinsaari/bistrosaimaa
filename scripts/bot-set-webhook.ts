// Points Telegram at the production webhook. Run by hand once after the first deploy (or when the URL or secret changes):
//   TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... npm run bot:set-webhook [-- https://bistrosaimaa.fi/api/telegram]
// The token and secret come from the environment only, and are never printed.
import { createTelegramClient } from '@/lib/bot/telegram';

const DEFAULT_URL = 'https://bistrosaimaa.fi/api/telegram';

async function main() {
  const url = process.argv[2] ?? DEFAULT_URL;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret) {
    throw new Error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in the environment.');
  }
  if (!url.startsWith('https://')) throw new Error('Telegram only delivers to https URLs.');
  const telegram = createTelegramClient(token);
  await telegram.setWebhook(url, secret);
  const info = await telegram.getWebhookInfo();
  console.log(`webhook url: ${info.url}`);
  console.log(`pending updates: ${info.pending_update_count}`);
  console.log(`last error: ${info.last_error_message ?? 'none'}`);
}

main().catch((error) => {
  // TelegramError messages carry the method and status only; anything else prints its name.
  console.error(error instanceof Error ? `${error.name}: ${error.message}` : 'failed');
  process.exit(1);
});
