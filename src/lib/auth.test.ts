import { describe, expect, it } from 'vitest';
import { verifyPassword, createSessionToken, verifySessionToken } from '@/lib/auth';

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
