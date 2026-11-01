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

export function isBotEnabled(): boolean {
  return !!process.env.TELEGRAM_BOT_TOKEN;
}
