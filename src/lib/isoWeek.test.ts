import { describe, expect, it } from 'vitest';
import { currentIsoWeek } from '@/lib/isoWeek';

const HELSINKI = 'Europe/Helsinki';

describe('currentIsoWeek', () => {
  it('returns the ISO week for a mid-year date', () => {
    expect(currentIsoWeek(new Date('2026-10-01T12:00:00Z'), HELSINKI)).toEqual({ isoYear: 2026, isoWeek: 40 });
  });

  it('puts 29.12. into week 1 of the next ISO year', () => {
    expect(currentIsoWeek(new Date('2025-12-29T12:00:00Z'), HELSINKI)).toEqual({ isoYear: 2026, isoWeek: 1 });
  });

  it('puts 1.1. into week 53 of the previous ISO year', () => {
    expect(currentIsoWeek(new Date('2027-01-01T12:00:00Z'), HELSINKI)).toEqual({ isoYear: 2026, isoWeek: 53 });
  });

  it('puts 1.1. into week 52 of the previous ISO year', () => {
    expect(currentIsoWeek(new Date('2022-01-01T12:00:00Z'), HELSINKI)).toEqual({ isoYear: 2021, isoWeek: 52 });
  });

  it('rolls over at Monday 00:00 Helsinki, not UTC (summer time)', () => {
    // Sunday 21:30 UTC is already Monday 00:30 in Helsinki (UTC+3)
    const instant = new Date('2026-10-04T21:30:00Z');
    expect(currentIsoWeek(instant, HELSINKI)).toEqual({ isoYear: 2026, isoWeek: 41 });
    expect(currentIsoWeek(instant, 'UTC')).toEqual({ isoYear: 2026, isoWeek: 40 });
  });

  it('rolls over at Monday 00:00 Helsinki, not UTC (winter time)', () => {
    // Sunday 22:30 UTC is Monday 00:30 in Helsinki (UTC+2)
    expect(currentIsoWeek(new Date('2026-12-27T22:30:00Z'), HELSINKI)).toEqual({ isoYear: 2026, isoWeek: 53 });
  });
});
