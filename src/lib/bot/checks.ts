import { DateTime } from 'luxon';
import type { IsoWeek } from '@/lib/isoWeek';
import { isPastWeek, isValidIsoWeek, parseWeekDocument, type WeekDocumentResult } from '@/lib/lunchWeek';

export type CheckResult = { ok: true } | { ok: false; error: string };

export function checkDocument(input: unknown): WeekDocumentResult {
  return parseWeekDocument(input);
}

export function checkWeekEditable(week: IsoWeek, now: Date): CheckResult {
  if (!isValidIsoWeek(week)) {
    return { ok: false, error: `Viikkoa ${week.isoWeek}/${week.isoYear} ei ole olemassa, ei muutettu.` };
  }
  if (isPastWeek(week, now)) return { ok: false, error: `Vko ${week.isoWeek} on jo mennyt, ei muutettu.` };
  return { ok: true };
}

export type WeekRangeResult = { ok: true; week: IsoWeek } | { ok: false; error: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function checkWeekRange(isoWeek: number | null, range: { start: string; end: string } | null): WeekRangeResult {
  const unreadable = { ok: false, error: 'En löytänyt listasta viikon numeroa ja päivämääriä, ei muutettu.' } as const;
  if (isoWeek === null || !range) return unreadable;

  const parse = (value: string) => (ISO_DATE.test(value) ? DateTime.fromISO(value, { zone: 'utc' }) : null);
  const start = parse(range.start);
  const end = parse(range.end);
  if (!start?.isValid || !end?.isValid) return unreadable;

  if (start.weekday !== 1 || !end.equals(start.plus({ days: 6 }))) {
    return { ok: false, error: 'Listan päivämäärät eivät ole maanantaista sunnuntaihin, ei muutettu.' };
  }
  if (start.weekNumber !== isoWeek) {
    return {
      ok: false,
      error: `Listassa lukee viikko ${isoWeek}, mutta päivämäärät (${start.day}.${start.month}.–${end.day}.${end.month}.) ovat viikolla ${start.weekNumber}, ei muutettu.`,
    };
  }
  return { ok: true, week: { isoYear: start.weekYear, isoWeek: start.weekNumber } };
}
