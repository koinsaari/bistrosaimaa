'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  verifyPassword,
  createSessionToken,
  isAuthenticated,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
} from '@/lib/auth';
import { DAY_KEYS, type LunchRecord } from '@/lib/lunch';
import { writeLunchRecord } from '@/lib/lunch-write';

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

export type SaveLunchMenuState = { error: boolean; record: LunchRecord | null };

export async function saveLunchMenu(
  _prevState: SaveLunchMenuState,
  formData: FormData,
): Promise<SaveLunchMenuState> {
  if (!(await isAuthenticated())) {
    redirect('/admin/lunch/login');
  }

  const record = {
    ...(Object.fromEntries(
      DAY_KEYS.map((day) => [day, String(formData.get(day) ?? '')]),
    ) as Record<(typeof DAY_KEYS)[number], string>),
    updatedAt: new Date().toISOString(),
  } satisfies LunchRecord;

  try {
    await writeLunchRecord(record);
  } catch {
    return { error: true, record: null };
  }

  return { error: false, record };
}
