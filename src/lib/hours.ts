export type TodayHoursKey = 'monFriHours' | 'saturdayHours' | 'sundayHours';

/**
 * Returns the Footer-namespace key for today's opening hours.
 * Reads weekday from the supplied date (defaults to now).
 */
export function getTodayHoursKey(date: Date = new Date()): TodayHoursKey {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  if (day === 0) return 'sundayHours';
  if (day === 6) return 'saturdayHours';
  return 'monFriHours';
}
