import { createHmac } from 'node:crypto';
import { and, eq, gt, lt } from 'drizzle-orm';
import { getDb, loginAttempts } from '@/db';

export const MAX_ATTEMPTS = 5;
export const WINDOW_MS = 5 * 60 * 1000;
const RETENTION_MS = 24 * 60 * 60 * 1000;

export type ThrottleStatus = { blocked: false } | { blocked: true; retryAfterSeconds: number };

/**
 * `attempts` includes the one being decided: it is recorded before it is counted, so concurrent
 * requests can't all slip under the limit. Blocked once more than MAX_ATTEMPTS fall in the sliding
 * window; lifts when enough of them expire.
 */
export function throttleStatus(attempts: Date[], now: Date): ThrottleStatus {
  const cutoff = now.getTime() - WINDOW_MS;
  const inWindow = attempts
    .map((d) => d.getTime())
    .filter((t) => t > cutoff)
    .sort((a, b) => a - b);

  if (inWindow.length <= MAX_ATTEMPTS) return { blocked: false };

  const unblockAt = inWindow[inWindow.length - MAX_ATTEMPTS - 1] + WINDOW_MS;
  return { blocked: true, retryAfterSeconds: Math.ceil((unblockAt - now.getTime()) / 1000) };
}

// Vercel overwrites x-forwarded-for, so the first entry is the real client and locally it is client-set.
export function getClientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

/** Keyed hash so raw IPs are never stored. */
export function hashIp(ip: string, secret: string): string {
  return createHmac('sha256', secret).update(ip).digest('hex');
}

/**
 * Decides whether this attempt may check the password. Already-blocked clients add no rows, so a
 * flood can't grow the table. Otherwise the attempt is recorded and then counted in separate
 * statements: every concurrent request sees the others' attempts, so at most MAX_ATTEMPTS pass.
 */
export async function registerAttempt(ipHash: string, now = new Date()): Promise<ThrottleStatus> {
  const db = getDb();
  const since = new Date(now.getTime() - WINDOW_MS);
  const recentAttempts = async () =>
    (
      await db
        .select({ attemptedAt: loginAttempts.attemptedAt })
        .from(loginAttempts)
        .where(and(eq(loginAttempts.ipHash, ipHash), gt(loginAttempts.attemptedAt, since)))
    ).map((r) => r.attemptedAt);

  const early = throttleStatus([...(await recentAttempts()), now], now);
  if (early.blocked) return early;

  await db.insert(loginAttempts).values({ ipHash, attemptedAt: now });
  const status = throttleStatus(await recentAttempts(), now);
  // Only the attempt that trips the limit reaches here blocked, so this is one line per lockout.
  if (status.blocked) console.warn(`login throttled: client ${ipHash.slice(0, 8)}`);

  // Housekeeping only; a failure here must not affect the login decision.
  try {
    await db.delete(loginAttempts).where(lt(loginAttempts.attemptedAt, new Date(now.getTime() - RETENTION_MS)));
  } catch (err) {
    console.error('pruning login attempts failed', err);
  }
  return status;
}

export async function clearAttempts(ipHash: string): Promise<void> {
  await getDb().delete(loginAttempts).where(eq(loginAttempts.ipHash, ipHash));
}
