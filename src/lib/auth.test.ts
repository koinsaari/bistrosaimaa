import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  verifyPassword,
  createSessionToken,
  parseSessionToken,
  requireAdmin,
} from '@/lib/auth';

const cookieJar = vi.hoisted(() => ({ value: undefined as string | undefined }));
const sessionVersion = vi.hoisted(() => ({ get: vi.fn<() => Promise<number>>() }));

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === 'admin_session' && cookieJar.value ? { name, value: cookieJar.value } : undefined,
  }),
}));

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

vi.mock('@/lib/sessionVersion', () => ({
  getSessionVersion: sessionVersion.get,
}));

describe('verifyPassword', () => {
  it('returns true when input matches expected', () => {
    expect(verifyPassword('correct-horse', 'correct-horse')).toBe(true);
  });

  it('returns false when input does not match expected', () => {
    expect(verifyPassword('wrong', 'correct-horse')).toBe(false);
  });

  it('returns false when input and expected have different lengths', () => {
    expect(verifyPassword('short', 'a-much-longer-password')).toBe(false);
  });
});

describe('session token', () => {
  const secret = 'test-secret';
  const week = 7 * 24 * 60 * 60 * 1000;

  it('parses a freshly created token', () => {
    expect(parseSessionToken(createSessionToken(secret, week, 3), secret)).toEqual({ version: 3 });
  });

  it('rejects a correctly signed legacy token without a version claim', () => {
    const payload = Buffer.from(JSON.stringify({ exp: Date.now() + week })).toString('base64url');
    const signature = createHmac('sha256', secret).update(payload).digest('base64url');
    expect(parseSessionToken(`${payload}.${signature}`, secret)).toBeNull();
  });

  it('rejects a tampered token', () => {
    const token = createSessionToken(secret, week, 1);
    const tampered = `${token.slice(0, -1)}${token.slice(-1) === 'a' ? 'b' : 'a'}`;
    expect(parseSessionToken(tampered, secret)).toBeNull();
  });

  it('rejects a token parsed with the wrong secret', () => {
    expect(parseSessionToken(createSessionToken(secret, week, 1), 'other-secret')).toBeNull();
  });

  it('rejects an expired token', () => {
    expect(parseSessionToken(createSessionToken(secret, -1000, 1), secret)).toBeNull();
  });

  it('rejects a malformed token', () => {
    expect(parseSessionToken('not-a-real-token', secret)).toBeNull();
  });
});

describe('requireAdmin', () => {
  beforeEach(() => {
    cookieJar.value = undefined;
    sessionVersion.get.mockResolvedValue(1);
    vi.stubEnv('SESSION_SECRET', 'test-secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('redirects to the login page without a session cookie', async () => {
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
  });

  it('redirects when the session token is invalid, without a DB lookup', async () => {
    cookieJar.value = 'not-a-real-token';
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
    expect(sessionVersion.get).not.toHaveBeenCalled();
  });

  it('does not hit the DB for an expired or wrongly signed token', async () => {
    cookieJar.value = createSessionToken('test-secret', -1000, 1);
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
    cookieJar.value = createSessionToken('other-secret', 60_000, 1);
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
    expect(sessionVersion.get).not.toHaveBeenCalled();
  });

  it('redirects when SESSION_SECRET is not configured', async () => {
    cookieJar.value = createSessionToken('test-secret', 60_000, 1);
    vi.stubEnv('SESSION_SECRET', '');
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
  });

  it('resolves for a valid session', async () => {
    cookieJar.value = createSessionToken('test-secret', 60_000, 1);
    await expect(requireAdmin()).resolves.toBeUndefined();
  });

  it('redirects once all sessions have been revoked', async () => {
    cookieJar.value = createSessionToken('test-secret', 60_000, 1);
    sessionVersion.get.mockResolvedValue(2);
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
  });

  it('redirects for a token from a newer session version', async () => {
    cookieJar.value = createSessionToken('test-secret', 60_000, 3);
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
  });

  it('fails closed when the session version cannot be read', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    cookieJar.value = createSessionToken('test-secret', 60_000, 1);
    sessionVersion.get.mockRejectedValue(new Error('db down'));
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
  });
});
