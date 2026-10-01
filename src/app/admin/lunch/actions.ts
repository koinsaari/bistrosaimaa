'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_TTL_MS } from '@/lib/auth';

export async function login(_prevState: { error: boolean }, formData: FormData): Promise<{ error: boolean }> {
  const password = String(formData.get('password') ?? '');
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!expected || !secret || !verifyPassword(password, expected)) {
    return { error: true };
  }

  (await cookies()).set(SESSION_COOKIE_NAME, createSessionToken(secret, SESSION_TTL_MS), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/admin',
    maxAge: SESSION_TTL_MS / 1000,
  });

  redirect('/admin/lunch');
}
