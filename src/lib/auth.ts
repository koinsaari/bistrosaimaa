import { timingSafeEqual, createHash, createHmac } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionVersion } from '@/lib/sessionVersion';

export const SESSION_COOKIE_NAME = 'admin_session';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Timing-safe password compare. Hashes both sides to a fixed length first
 * so length differences don't short-circuit the comparison.
 */
export function verifyPassword(input: string, expected: string): boolean {
  const inputHash = createHash('sha256').update(input).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(inputHash, expectedHash);
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/** HMAC-signed session token: `<base64url payload>.<base64url signature>`. Payload holds the expiry and session version. */
export function createSessionToken(secret: string, ttlMs: number, version: number): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ttlMs, v: version })).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

/** Checks signature and expiry only; the caller compares the returned version with the current one. */
export function parseSessionToken(token: string, secret: string): { version: number } | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload, secret);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (signatureBuf.length !== expectedBuf.length || !timingSafeEqual(signatureBuf, expectedBuf)) {
    return null;
  }

  try {
    const { exp, v } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof exp !== 'number' || Date.now() >= exp || typeof v !== 'number') return null;
    return { version: v };
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return false;

  const claims = parseSessionToken(token, secret);
  if (!claims) return false;

  try {
    return claims.version === (await getSessionVersion());
  } catch (err) {
    console.error('reading session version failed', err);
    return false;
  }
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) redirect('/admin/login');
}
