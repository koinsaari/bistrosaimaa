import { describe, expect, it } from 'vitest';
import { isForeignKeyViolation, isUniqueViolation } from '@/lib/dbErrors';

describe('isUniqueViolation', () => {
  it('detects a Postgres unique violation', () => {
    expect(isUniqueViolation({ code: '23505' })).toBe(true);
  });

  it('detects one wrapped as the cause of a query error', () => {
    expect(isUniqueViolation(Object.assign(new Error('Failed query'), { cause: { code: '23505' } }))).toBe(true);
  });

  it('ignores other errors', () => {
    expect(isUniqueViolation({ code: '23503' })).toBe(false);
    expect(isUniqueViolation(new Error('boom'))).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation('23505')).toBe(false);
  });
});

describe('isForeignKeyViolation', () => {
  it('matches code 23503 on the error or its cause only', () => {
    expect(isForeignKeyViolation({ code: '23503' })).toBe(true);
    expect(isForeignKeyViolation(Object.assign(new Error('Failed query'), { cause: { code: '23503' } }))).toBe(true);
    expect(isForeignKeyViolation({ code: '23505' })).toBe(false);
    expect(isForeignKeyViolation(null)).toBe(false);
  });
});
