export type TodayHoursKey = 'monFriHours' | 'saturdayHours' | 'sundayHours';

/**
 * Returns the Footer-namespace key for today's opening hours.
 * Reads weekday from the supplied date (defaults to now).
 */
export function getTodayHoursKey(date: Date = new Date()): TodayHoursKey {
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Helsinki',
    weekday: 'short',
  })
    .formatToParts(date)
    .find((p) => p.type === 'weekday')?.value;
  if (day === 'Sun') return 'sundayHours';
  if (day === 'Sat') return 'saturdayHours';
  return 'monFriHours';
}
