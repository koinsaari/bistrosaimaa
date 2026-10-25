import { and, eq } from 'drizzle-orm';
import { getDb, lunchWeeks } from '@/db';
import { ALLERGENS, type Allergen } from '@/lib/allergens';
import { BUSINESS } from '@/lib/business';
import type { IsoWeek } from '@/lib/isoWeek';

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_KEYS: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export type LunchDish = { name: string; allergens: Allergen[] };

export type LunchDay = { dishes: LunchDish[]; note: string | null };

export type LunchPrices = { weekdayCents: number; weekendCents: number };

export type LunchRecord = { updatedAt: string; prices: LunchPrices | null; days: Partial<Record<DayKey, LunchDay>> };

export type DayDisplay =
  | { day: DayKey; status: 'content'; dishes: LunchDish[]; note: string | null }
  | { day: DayKey; status: 'placeholder' };

export type LunchDisplay =
  | { status: 'fallback' }
  | { status: 'available'; updatedAt: string; prices: LunchPrices | null; days: DayDisplay[] };

export function formatLunchInfo(locale: string, prices: LunchPrices | null) {
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' });
  const at = ({ hour, minute }: { hour: number; minute: number }) => time.format(Date.UTC(2000, 0, 1, hour, minute));
  const euro = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' });
  const { opens, closes } = BUSINESS.lunch;
  return {
    opens: at(opens),
    closes: at(closes),
    prices: prices && {
      weekdayPrice: euro.format(prices.weekdayCents / 100),
      weekendPrice: euro.format(prices.weekendCents / 100),
    },
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
  return { status: 'available', updatedAt: record.updatedAt, prices: record.prices, days };
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
    const [row] = await getDb()
      .select({ updatedAt: lunchWeeks.updatedAt, days: lunchWeeks.days, prices: lunchWeeks.prices })
      .from(lunchWeeks)
      .where(and(eq(lunchWeeks.isoYear, isoYear), eq(lunchWeeks.isoWeek, isoWeek), eq(lunchWeeks.published, true)))
      .limit(1);
    if (!row) return null;

    const days: LunchRecord['days'] = {};
    for (const key of DAY_KEYS) {
      const entry = row.days[key];
      if (!entry) continue;
      days[key] = {
        dishes: entry.dishes.map((d) => ({ name: d.name, allergens: ALLERGENS.filter((a) => d.allergens.includes(a)) })),
        note: entry.note,
      };
    }
    return { updatedAt: row.updatedAt.toISOString(), prices: row.prices, days };
  } catch (err) {
    console.error('Failed to load lunch menu', err);
    return null;
  }
}

export async function getLunchDisplay(week: IsoWeek): Promise<LunchDisplay> {
  return resolveLunchDisplay(await getLunchRecord(week));
}
