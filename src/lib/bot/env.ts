import { createHash, timingSafeEqual } from 'node:crypto';

/** Strict: every entry must be a plain positive integer, so a typo fails loudly instead of locking someone out. */
export function parseAllowedUserIds(raw: string | undefined): Set<number> {
  if (!raw?.trim()) return new Set();
  const ids = raw.split(',').map((part) => {
    const entry = part.trim();
    const id = Number(entry);
    if (!/^[1-9]\d*$/.test(entry) || !Number.isSafeInteger(id)) {
      throw new Error('TELEGRAM_ALLOWED_USER_IDS must be a comma-separated list of numeric Telegram user ids');
    }
    return id;
  });
  return new Set(ids);
}

/** Constant-time compare. Hashing first makes the buffers equal length, so the length doesn't leak either. */
export function secretMatches(given: string | null | undefined, expected: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value).digest();
  const matches = timingSafeEqual(digest(given ?? ''), digest(expected));
  return matches && !!given;
}

export type BotEnv = {
  token: string;
  webhookSecret: string;
  allowedUserIds: Set<number>;
  /** fixture is for e2e */
  model: 'gateway' | 'fixture';
  /** log is for e2e */
  transport: 'telegram' | 'log';
};

export function isBotEnabled(): boolean {
  return !!process.env.TELEGRAM_BOT_TOKEN;
}

export function botEnv(): BotEnv {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  if (!webhookSecret) throw new Error('TELEGRAM_WEBHOOK_SECRET is not set');
  return {
    token,
    webhookSecret,
    allowedUserIds: parseAllowedUserIds(process.env.TELEGRAM_ALLOWED_USER_IDS),
    model: process.env.BOT_MODEL === 'fixture' ? 'fixture' : 'gateway',
    transport: process.env.TELEGRAM_TRANSPORT === 'log' ? 'log' : 'telegram',
  };
}
