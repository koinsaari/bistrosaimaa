import { describe, expect, it } from 'vitest';
import { parseAllowedUserIds } from '@/lib/bot/env';

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
