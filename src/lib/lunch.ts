import { get } from '@vercel/edge-config';

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_KEYS: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export type LunchRecord = Record<DayKey, string> & { updatedAt: string };

export type DayDisplay =
  | { day: DayKey; status: 'content'; text: string }
  | { day: DayKey; status: 'placeholder' };

export type LunchDisplay =
  | { status: 'fallback' }
  | { status: 'available'; updatedAt: string; days: DayDisplay[] };

export function resolveLunchDisplay(record: LunchRecord | null): LunchDisplay {
  if (!record) return { status: 'fallback' };

  return {
    status: 'available',
    updatedAt: record.updatedAt,
    days: DAY_KEYS.map((day) => {
      const text = String(record[day] ?? '').trim();
      return text ? { day, status: 'content', text } : { day, status: 'placeholder' };
    }),
  };
}

export function formatUpdatedAt(isoDate: string): string {
  const date = new Date(isoDate);
  const parts = new Intl.DateTimeFormat('fi-FI', {
    timeZone: 'Europe/Helsinki',
    day: 'numeric',
    month: 'numeric',
  }).formatToParts(date);
  const day = parts.find((p) => p.type === 'day')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  return `${day}.${month}.`;
}

export async function getLunchRecord(): Promise<LunchRecord | null> {
  const key = process.env.LUNCH_MENU_KEY ?? 'lunchMenu';
  try {
    const record = await get<LunchRecord>(key);
    return record ?? null;
  } catch {
    return null;
  }
}

export async function getLunchDisplay(): Promise<LunchDisplay> {
  return resolveLunchDisplay(await getLunchRecord());
}
