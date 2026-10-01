import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  requireAdmin,
} from '@/lib/auth';

const cookieJar = vi.hoisted(() => ({ value: undefined as string | undefined }));

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

  it('verifies a freshly created token', () => {
    const token = createSessionToken(secret, 7 * 24 * 60 * 60 * 1000);
    expect(verifySessionToken(token, secret)).toBe(true);
  });

  it('rejects a tampered token', () => {
    const token = createSessionToken(secret, 7 * 24 * 60 * 60 * 1000);
    const tampered = `${token.slice(0, -1)}${token.slice(-1) === 'a' ? 'b' : 'a'}`;
    expect(verifySessionToken(tampered, secret)).toBe(false);
  });

  it('rejects a token verified with the wrong secret', () => {
    const token = createSessionToken(secret, 7 * 24 * 60 * 60 * 1000);
    expect(verifySessionToken(token, 'other-secret')).toBe(false);
  });

  it('rejects an expired token', () => {
    const token = createSessionToken(secret, -1000);
    expect(verifySessionToken(token, secret)).toBe(false);
  });

  it('rejects a malformed token', () => {
    expect(verifySessionToken('not-a-real-token', secret)).toBe(false);
  });
});

describe('requireAdmin', () => {
  beforeEach(() => {
    cookieJar.value = undefined;
    vi.stubEnv('SESSION_SECRET', 'test-secret');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('redirects to the login page without a session cookie', async () => {
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
  });

  it('redirects when the session token is invalid', async () => {
    cookieJar.value = 'not-a-real-token';
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
  });

  it('redirects when SESSION_SECRET is not configured', async () => {
    cookieJar.value = createSessionToken('test-secret', 60_000);
    vi.stubEnv('SESSION_SECRET', '');
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/admin/login');
  });

  it('resolves for a valid session', async () => {
    cookieJar.value = createSessionToken('test-secret', 60_000);
    await expect(requireAdmin()).resolves.toBeUndefined();
  });
});
