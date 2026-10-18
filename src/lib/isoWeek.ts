import { DateTime } from 'luxon';
import { BUSINESS } from '@/lib/business';

export type IsoWeek = { isoYear: number; isoWeek: number };

function toIsoWeek(date: DateTime): IsoWeek {
  return { isoYear: date.weekYear, isoWeek: date.weekNumber };
}

function mondayOf({ isoYear, isoWeek }: IsoWeek): DateTime {
  return DateTime.fromObject({ weekYear: isoYear, weekNumber: isoWeek, weekday: 1 }, { zone: 'utc' });
}

export function currentIsoWeek(date: Date, timeZone: string): IsoWeek {
  return toIsoWeek(DateTime.fromJSDate(date, { zone: timeZone }));
}

export function weeksInIsoYear(isoYear: number): number {
  return DateTime.fromObject({ weekYear: isoYear }, { zone: 'utc' }).weeksInWeekYear;
}

export function addWeeks(week: IsoWeek, weeks: number): IsoWeek {
  return toIsoWeek(mondayOf(week).plus({ weeks }));
}

/** Monday and Sunday of the week, as UTC midnights: format them with `timeZone: 'UTC'`. */
export function weekRange(week: IsoWeek): { start: Date; end: Date } {
  const monday = mondayOf(week);
  return { start: monday.toJSDate(), end: monday.plus({ days: 6 }).toJSDate() };
}

export function formatWeekDates(week: IsoWeek, locale: string): string {
  const { start, end } = weekRange(week);
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', timeZone: 'UTC' }).formatRange(start, end);
}

const LUNCH_TIME_ZONE = 'Europe/Helsinki';
const ROLLOVER_AFTER_CLOSE_MINUTES = 30;

export function shownLunchWeek(now: Date): IsoWeek {
  const current = currentIsoWeek(now, LUNCH_TIME_ZONE);
  const local = DateTime.fromJSDate(now, { zone: LUNCH_TIME_ZONE });
  const { hour, minute } = BUSINESS.lunch.closes;
  const pastSundayLunch =
    local.weekday === 7 && local.hour * 60 + local.minute >= hour * 60 + minute + ROLLOVER_AFTER_CLOSE_MINUTES;
  return pastSundayLunch ? addWeeks(current, 1) : current;
}

/** "Viikko 41 (5.–11.10.)": the week number and its Monday–Sunday span. */
export function formatWeekLabel(week: IsoWeek): string {
  const monday = mondayOf(week);
  const sunday = monday.plus({ days: 6 });
  const start = `${monday.day}.${monday.month === sunday.month ? '' : `${monday.month}.`}`;
  return `Viikko ${week.isoWeek} (${start}–${sunday.day}.${sunday.month}.)`;
}
