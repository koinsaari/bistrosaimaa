import { timingSafeEqual, createHash, createHmac } from 'node:crypto';
import { cookies } from 'next/headers';

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

/** HMAC-signed session token: `<base64url payload>.<base64url signature>`. Payload holds the expiry. */
export function createSessionToken(secret: string, ttlMs: number): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ttlMs })).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string, secret: string): boolean {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expectedSignature = sign(payload, secret);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (signatureBuf.length !== expectedBuf.length || !timingSafeEqual(signatureBuf, expectedBuf)) {
    return false;
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && Date.now() < exp;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return false;
  return verifySessionToken(token, secret);
}
