import { describe, expect, it } from 'vitest';
import { parseAllowedUserIds, secretMatches } from '@/lib/bot/env';

describe('parseAllowedUserIds', () => {
  it('parses a comma-separated list of numeric ids, ignoring spaces', () => {
    expect(parseAllowedUserIds('1001, 2002 ,3003')).toEqual(new Set([1001, 2002, 3003]));
  });

  it('is empty when unset or blank, so nobody is allowed', () => {
    expect(parseAllowedUserIds(undefined)).toEqual(new Set());
    expect(parseAllowedUserIds('  ')).toEqual(new Set());
  });

  it('rejects anything that is not a plain positive integer', () => {
    for (const raw of ['abc', '1001,x', '1001,,2002', '-5', '1.5', '1e3', '0x10', '1001;2002']) {
      expect(() => parseAllowedUserIds(raw), raw).toThrow();
    }
  });

  it('rejects ids beyond the safe integer range', () => {
    expect(() => parseAllowedUserIds('99999999999999999999')).toThrow();
  });
});

describe('secretMatches', () => {
  it('accepts the exact secret', () => {
    expect(secretMatches('e2e-secret', 'e2e-secret')).toBe(true);
  });

  it('rejects a different, shorter, longer, empty or missing secret', () => {
    expect(secretMatches('e2e-secreT', 'e2e-secret')).toBe(false);
    expect(secretMatches('e2e', 'e2e-secret')).toBe(false);
    expect(secretMatches('e2e-secret-and-more', 'e2e-secret')).toBe(false);
    expect(secretMatches('', 'e2e-secret')).toBe(false);
    expect(secretMatches(null, 'e2e-secret')).toBe(false);
  });
});
