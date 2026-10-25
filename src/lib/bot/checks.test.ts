import { describe, expect, it } from 'vitest';
import { checkWeekRange } from '@/lib/bot/checks';

describe('checkWeekRange', () => {
  it('accepts a week whose number matches its Monday-Sunday range', () => {
    expect(checkWeekRange(44, { start: '2026-10-26', end: '2026-11-01' })).toEqual({
      ok: true,
      week: { isoYear: 2026, isoWeek: 44 },
    });
  });

  it('takes the ISO year from the range: week 1 starting in December', () => {
    expect(checkWeekRange(1, { start: '2025-12-29', end: '2026-01-04' })).toEqual({
      ok: true,
      week: { isoYear: 2026, isoWeek: 1 },
    });
  });

  it('takes the ISO year from the range: week 53 ending in January', () => {
    expect(checkWeekRange(53, { start: '2026-12-28', end: '2027-01-03' })).toEqual({
      ok: true,
      week: { isoYear: 2026, isoWeek: 53 },
    });
  });

  it('refuses a week number that does not match the dates', () => {
    const result = checkWeekRange(43, { start: '2026-10-26', end: '2026-11-01' });
    expect(result).toMatchObject({ ok: false });
    expect(result.ok === false && result.error).toContain('viikko 43');
    expect(result.ok === false && result.error).toContain('viikolla 44');
  });

  it('refuses week 1 printed on the last week of the old year', () => {
    expect(checkWeekRange(1, { start: '2026-12-21', end: '2026-12-27' })).toMatchObject({ ok: false });
  });

  it('refuses a range that does not start on Monday', () => {
    expect(checkWeekRange(44, { start: '2026-10-27', end: '2026-11-02' })).toMatchObject({ ok: false });
  });

  it('refuses a range that is not seven days', () => {
    expect(checkWeekRange(44, { start: '2026-10-26', end: '2026-10-31' })).toMatchObject({ ok: false });
    expect(checkWeekRange(44, { start: '2026-10-26', end: '2026-11-08' })).toMatchObject({ ok: false });
  });

  it('refuses unreadable input', () => {
    expect(checkWeekRange(null, { start: '2026-10-26', end: '2026-11-01' })).toMatchObject({ ok: false });
    expect(checkWeekRange(44, null)).toMatchObject({ ok: false });
    expect(checkWeekRange(44, { start: '26.10.2026', end: '1.11.2026' })).toMatchObject({ ok: false });
    expect(checkWeekRange(44, { start: '2026-02-30', end: '2026-03-08' })).toMatchObject({ ok: false });
  });
});
