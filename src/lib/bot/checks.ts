import type { IsoWeek } from '@/lib/isoWeek';
import { isPastWeek, isValidIsoWeek } from '@/lib/lunchWeek';

export type CheckResult = { ok: true } | { ok: false; error: string };

export function checkWeekEditable(week: IsoWeek, now: Date): CheckResult {
  if (!isValidIsoWeek(week)) {
    return { ok: false, error: `Viikkoa ${week.isoWeek}/${week.isoYear} ei ole olemassa, ei muutettu.` };
  }
  if (isPastWeek(week, now)) return { ok: false, error: `Vko ${week.isoWeek} on jo mennyt, ei muutettu.` };
  return { ok: true };
}
