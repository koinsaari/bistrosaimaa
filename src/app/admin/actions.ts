'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyPassword, createSessionToken, isAuthenticated, SESSION_COOKIE_NAME, SESSION_TTL_MS } from '@/lib/auth';
import { clearAttempts, getClientIp, hashIp, registerAttempt, type ThrottleStatus } from '@/lib/loginThrottle';
import { bumpSessionVersion, getSessionVersion } from '@/lib/sessionVersion';

const COOKIE_PATH = '/admin';

export type LoginState =
  | { error: null }
  | { error: 'invalid' }
  | { error: 'unavailable' }
  | { error: 'throttled'; retryAfterSeconds: number };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get('password') ?? '');
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!expected || !secret) return { error: 'invalid' };

  const ipHash = hashIp(getClientIp(await headers()), secret);
  let status: ThrottleStatus;
  try {
    status = await registerAttempt(ipHash);
  } catch (err) {
    console.error('login throttle check failed', err);
    return { error: 'unavailable' };
  }
  if (status.blocked) return { error: 'throttled', retryAfterSeconds: status.retryAfterSeconds };

  if (!verifyPassword(password, expected)) return { error: 'invalid' };

  try {
    await clearAttempts(ipHash);
  } catch (err) {
    console.error('clearing login attempts failed', err);
  }

  let version: number;
  try {
    version = await getSessionVersion();
  } catch (err) {
    console.error('reading session version failed', err);
    return { error: 'unavailable' };
  }

  (await cookies()).set(SESSION_COOKIE_NAME, createSessionToken(secret, SESSION_TTL_MS, version), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: COOKIE_PATH,
    maxAge: SESSION_TTL_MS / 1000,
  });

  redirect('/admin/lunch');
}

export async function logout(): Promise<void> {
  // Only an authenticated caller may bump the version, or anyone could force-logout the admin.
  const authenticated = await isAuthenticated();
  (await cookies()).delete({ name: SESSION_COOKIE_NAME, path: COOKIE_PATH });
  if (authenticated) {
    try {
      await bumpSessionVersion();
    } catch (err) {
      console.error('revoking sessions on logout failed', err);
    }
  }
  redirect('/admin/login');
}
