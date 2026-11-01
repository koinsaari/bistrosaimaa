// Points Telegram at the production webhook. Run by hand once after the first deploy (or when the URL or secret changes):
//   TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=... npm run bot:set-webhook [-- https://bistrosaimaa.fi/api/telegram]
// The token and secret come from the environment only, and are never printed.
const DEFAULT_URL = 'https://bistrosaimaa.fi/api/telegram';

type ApiResponse<T> = { ok: true; result: T } | { ok: false; error_code?: number };

// Method name and status only
async function call<T>(token: string, method: string, params: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
  });
  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !body?.ok) {
    throw new Error(`telegram ${method} failed with ${body && !body.ok ? (body.error_code ?? response.status) : response.status}`);
  }
  return body.result;
}

async function main() {
  const url = process.argv[2] ?? DEFAULT_URL;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret) {
    throw new Error('Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in the environment.');
  }
  if (!url.startsWith('https://')) throw new Error('Telegram only delivers to https URLs.');
  await call(token, 'setWebhook', {
    url,
    secret_token: secret,
    allowed_updates: ['message'],
    drop_pending_updates: true,
    max_connections: 10,
  });
  const info = await call<{ url: string; pending_update_count: number; last_error_message?: string }>(token, 'getWebhookInfo');
  console.log(`webhook url: ${info.url}`);
  console.log(`pending updates: ${info.pending_update_count}`);
  console.log(`last error: ${info.last_error_message ?? 'none'}`);
}

main().catch((error) => {
  // Our own errors carry the method and status only; anything else prints its name.
  console.error(error instanceof Error ? `${error.name}: ${error.message}` : 'failed');
  process.exit(1);
});
