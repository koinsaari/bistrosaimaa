'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_TTL_MS } from '@/lib/auth';
import { clearAttempts, getClientIp, hashIp, registerAttempt, type ThrottleStatus } from '@/lib/loginThrottle';

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

  (await cookies()).set(SESSION_COOKIE_NAME, createSessionToken(secret, SESSION_TTL_MS), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: COOKIE_PATH,
    maxAge: SESSION_TTL_MS / 1000,
  });

  redirect('/admin/lunch');
}

export async function logout(): Promise<void> {
  (await cookies()).delete({ name: SESSION_COOKIE_NAME, path: COOKIE_PATH });
  redirect('/admin/login');
}
