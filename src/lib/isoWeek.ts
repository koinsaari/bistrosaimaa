export type IsoWeek = { isoYear: number; isoWeek: number };

export function currentIsoWeek(date: Date, timeZone: string): IsoWeek {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const get = (type: 'year' | 'month' | 'day') => Number(parts.find((p) => p.type === type)?.value);

  // Calendar date in the target zone, as a UTC midnight so the arithmetic below is DST-free.
  const local = new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
  const weekday = local.getUTCDay() || 7;
  // The Thursday of this week decides which ISO year the week belongs to.
  local.setUTCDate(local.getUTCDate() + 4 - weekday);
  const isoYear = local.getUTCFullYear();
  const dayOfYear = (local.getTime() - Date.UTC(isoYear, 0, 1)) / 86_400_000 + 1;
  return { isoYear, isoWeek: Math.ceil(dayOfYear / 7) };
}
