import { DateTime } from 'luxon';

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

/** "Viikko 41 (5.–11.10.)": the week number and its Monday–Sunday span. */
export function formatWeekLabel(week: IsoWeek): string {
  const monday = mondayOf(week);
  const sunday = monday.plus({ days: 6 });
  const start = `${monday.day}.${monday.month === sunday.month ? '' : `${monday.month}.`}`;
  return `Viikko ${week.isoWeek} (${start}–${sunday.day}.${sunday.month}.)`;
}
