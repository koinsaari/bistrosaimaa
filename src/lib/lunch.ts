import { and, asc, eq } from 'drizzle-orm';
import { dishes, getDb, lunchDays, lunchDishes, lunchWeeks } from '@/db';
import { ALLERGENS, type Allergen } from '@/lib/allergens';
import { BUSINESS } from '@/lib/business';
import type { IsoWeek } from '@/lib/isoWeek';

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_KEYS: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export type LunchDish = { name: string; allergens: Allergen[] };

export type LunchDay = { dishes: LunchDish[]; note: string | null };

export type LunchRecord = { updatedAt: string; days: Partial<Record<DayKey, LunchDay>> };

export type DayDisplay =
  | { day: DayKey; status: 'content'; dishes: LunchDish[]; note: string | null }
  | { day: DayKey; status: 'placeholder' };

export type LunchDisplay =
  | { status: 'fallback' }
  | { status: 'available'; updatedAt: string; days: DayDisplay[] };

export function formatLunchInfo(locale: string) {
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' });
  const at = ({ hour, minute }: { hour: number; minute: number }) => time.format(Date.UTC(2000, 0, 1, hour, minute));
  const price = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
  const { opens, closes, price: prices } = BUSINESS.lunch;
  return {
    opens: at(opens),
    closes: at(closes),
    weekdayPrice: price.format(prices.weekday),
    weekendPrice: price.format(prices.weekend),
  };
}

export function resolveLunchDisplay(record: LunchRecord | null): LunchDisplay {
  if (!record) return { status: 'fallback' };

  const days: DayDisplay[] = DAY_KEYS.map((day) => {
    const entry = record.days[day];
    const dishNames = entry?.dishes ?? [];
    const note = entry?.note?.trim() || null;
    return dishNames.length || note
      ? { day, status: 'content', dishes: dishNames, note }
      : { day, status: 'placeholder' };
  });

  // A published week with nothing on any day says nothing useful; the fallback sentence does.
  if (days.every((d) => d.status === 'placeholder')) return { status: 'fallback' };
  return { status: 'available', updatedAt: record.updatedAt, days };
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

export async function getLunchRecord(week: IsoWeek): Promise<LunchRecord | null> {
  const { isoYear, isoWeek } = week;
  try {
    const rows = await getDb()
      .select({
        updatedAt: lunchWeeks.updatedAt,
        day: lunchDays.day,
        note: lunchDays.note,
        dish: dishes.name,
        allergens: dishes.allergens,
      })
      .from(lunchWeeks)
      .leftJoin(lunchDays, eq(lunchDays.weekId, lunchWeeks.id))
      .leftJoin(lunchDishes, and(eq(lunchDishes.weekId, lunchDays.weekId), eq(lunchDishes.day, lunchDays.day)))
      .leftJoin(dishes, eq(dishes.id, lunchDishes.dishId))
      .where(and(eq(lunchWeeks.isoYear, isoYear), eq(lunchWeeks.isoWeek, isoWeek), eq(lunchWeeks.published, true)))
      .orderBy(asc(lunchDays.day), asc(lunchDishes.position));

    if (rows.length === 0) return null;

    const days: LunchRecord['days'] = {};
    for (const row of rows) {
      if (row.day === null) continue;
      const key = DAY_KEYS[row.day - 1];
      const entry = (days[key] ??= { dishes: [], note: row.note });
      if (row.dish !== null) {
        const allergens = ALLERGENS.filter((a) => row.allergens?.includes(a));
        entry.dishes.push({ name: row.dish, allergens });
      }
    }
    return { updatedAt: rows[0].updatedAt.toISOString(), days };
  } catch (err) {
    console.error('Failed to load lunch menu', err);
    return null;
  }
}

export async function getLunchDisplay(week: IsoWeek): Promise<LunchDisplay> {
  return resolveLunchDisplay(await getLunchRecord(week));
}
