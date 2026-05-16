import { LUNCH_ANCHOR, LUNCH_WEEKS, type LunchWeek } from '@/data/lunch-weeks';

/**
 * ISO 8601 week number for the given date.
 * Week 1 is the week containing the first Thursday of the year.
 */
export function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

export type CurrentLunch = {
  isoWeek: number;
  week: LunchWeek;
  weekIndex: number;
};

/**
 * Returns the lunch menu for the week containing `date`.
 * Pure: same input → same output. Server-only usage is preferred.
 */
export function getCurrentLunchWeek(date: Date = new Date()): CurrentLunch {
  const { week } = getISOWeek(date);
  const deltaWeeks = week - LUNCH_ANCHOR.week;
  const len = LUNCH_WEEKS.length;
  const weekIndex = ((deltaWeeks % len) + len) % len;
  return {
    isoWeek: week,
    week: LUNCH_WEEKS[weekIndex],
    weekIndex,
  };
}
