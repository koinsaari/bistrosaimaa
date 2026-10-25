import { describe, expect, it } from 'vitest';
import {
  addWeeks,
  currentIsoWeek,
  formatWeekDates,
  formatWeekLabel,
  isLaterWeek,
  shownLunchWeek,
  shownWeekSwitchLabel,
  weekRange,
  weeksInIsoYear,
} from '@/lib/isoWeek';

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

describe('weekRange', () => {
  it('returns Monday and Sunday as UTC midnights', () => {
    expect(weekRange({ isoYear: 2026, isoWeek: 42 })).toEqual({
      start: new Date('2026-10-12T00:00:00Z'),
      end: new Date('2026-10-18T00:00:00Z'),
    });
  });

  it('spans the new year', () => {
    expect(weekRange({ isoYear: 2026, isoWeek: 53 })).toEqual({
      start: new Date('2026-12-28T00:00:00Z'),
      end: new Date('2027-01-03T00:00:00Z'),
    });
  });
});

describe('shownLunchWeek', () => {
  // Lunch closes at 15:00, so the rollover is 15:30. Week 42 of 2026 is Mon 12.10.–Sun 18.10.; Helsinki is UTC+3 until 25.10.
  it('shows the calendar week until Sunday 15:30 Helsinki time', () => {
    expect(shownLunchWeek(new Date('2026-10-12T00:00:00+03:00'))).toEqual({ isoYear: 2026, isoWeek: 42 });
    expect(shownLunchWeek(new Date('2026-10-18T15:29:59+03:00'))).toEqual({ isoYear: 2026, isoWeek: 42 });
  });

  it('shows the next week from Sunday 15:30 on', () => {
    expect(shownLunchWeek(new Date('2026-10-18T15:30:00+03:00'))).toEqual({ isoYear: 2026, isoWeek: 43 });
    expect(shownLunchWeek(new Date('2026-10-18T23:59:00+03:00'))).toEqual({ isoYear: 2026, isoWeek: 43 });
  });

  it('uses Helsinki time, not UTC', () => {
    expect(shownLunchWeek(new Date('2026-10-18T12:30:00Z'))).toEqual({ isoYear: 2026, isoWeek: 43 });
  });

  it('rolls over into the next ISO year', () => {
    // Sunday 3.1.2027 ends week 53 of 2026.
    expect(shownLunchWeek(new Date('2027-01-03T16:00:00+02:00'))).toEqual({ isoYear: 2027, isoWeek: 1 });
  });
});

describe('shownWeekSwitchLabel', () => {
  it('names the moment shownLunchWeek moves on: Sunday, 30 minutes after lunch closes', () => {
    expect(shownWeekSwitchLabel()).toBe('sunnuntaina klo 15.30');
  });
});

describe('isLaterWeek', () => {
  it('compares year first, then week', () => {
    expect(isLaterWeek({ isoYear: 2026, isoWeek: 44 }, { isoYear: 2026, isoWeek: 43 })).toBe(true);
    expect(isLaterWeek({ isoYear: 2027, isoWeek: 1 }, { isoYear: 2026, isoWeek: 53 })).toBe(true);
    expect(isLaterWeek({ isoYear: 2026, isoWeek: 43 }, { isoYear: 2026, isoWeek: 43 })).toBe(false);
    expect(isLaterWeek({ isoYear: 2026, isoWeek: 42 }, { isoYear: 2026, isoWeek: 43 })).toBe(false);
  });
});

describe('formatWeekDates', () => {
  // Intl puts thin spaces (U+2009) around the dash when either side has a space.
  it('formats the span in Finnish and English', () => {
    expect(formatWeekDates({ isoYear: 2026, isoWeek: 43 }, 'fi')).toBe('19.–25. lokakuuta');
    expect(formatWeekDates({ isoYear: 2026, isoWeek: 43 }, 'en')).toBe('October 19\u2009–\u200925');
  });

  it('names both months when the week spans two', () => {
    expect(formatWeekDates({ isoYear: 2026, isoWeek: 44 }, 'fi')).toBe('26. lokakuuta\u2009–\u20091. marraskuuta');
    expect(formatWeekDates({ isoYear: 2026, isoWeek: 44 }, 'en')).toBe('October 26\u2009–\u2009November 1');
  });
});
