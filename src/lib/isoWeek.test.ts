import { describe, expect, it } from 'vitest';
import { addWeeks, currentIsoWeek, formatWeekLabel, weeksInIsoYear } from '@/lib/isoWeek';

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

describe('weeksInIsoYear', () => {
  it.each([
    [2026, 53],
    [2025, 52],
    [2020, 53],
    [2021, 52],
  ])('%i has %i weeks', (year, weeks) => {
    expect(weeksInIsoYear(year)).toBe(weeks);
  });
});

describe('addWeeks', () => {
  it('moves within a year', () => {
    expect(addWeeks({ isoYear: 2026, isoWeek: 41 }, 2)).toEqual({ isoYear: 2026, isoWeek: 43 });
    expect(addWeeks({ isoYear: 2026, isoWeek: 41 }, -1)).toEqual({ isoYear: 2026, isoWeek: 40 });
  });

  it('rolls over a 53-week year', () => {
    expect(addWeeks({ isoYear: 2026, isoWeek: 52 }, 1)).toEqual({ isoYear: 2026, isoWeek: 53 });
    expect(addWeeks({ isoYear: 2026, isoWeek: 53 }, 1)).toEqual({ isoYear: 2027, isoWeek: 1 });
  });

  it('rolls over a 52-week year, backwards too', () => {
    expect(addWeeks({ isoYear: 2025, isoWeek: 52 }, 1)).toEqual({ isoYear: 2026, isoWeek: 1 });
    expect(addWeeks({ isoYear: 2026, isoWeek: 1 }, -1)).toEqual({ isoYear: 2025, isoWeek: 52 });
  });
});

describe('formatWeekLabel', () => {
  it('shows the week number and Monday–Sunday within a month', () => {
    expect(formatWeekLabel({ isoYear: 2026, isoWeek: 41 })).toBe('Viikko 41 (5.–11.10.)');
  });

  it('shows both months when the week spans two', () => {
    expect(formatWeekLabel({ isoYear: 2026, isoWeek: 40 })).toBe('Viikko 40 (28.9.–4.10.)');
  });

  it('handles a week spanning the new year', () => {
    expect(formatWeekLabel({ isoYear: 2026, isoWeek: 53 })).toBe('Viikko 53 (28.12.–3.1.)');
    expect(formatWeekLabel({ isoYear: 2025, isoWeek: 1 })).toBe('Viikko 1 (30.12.–5.1.)');
  });
});
