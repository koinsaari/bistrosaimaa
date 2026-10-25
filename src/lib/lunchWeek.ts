import { and, desc, eq, isNotNull, lt, or, sql } from 'drizzle-orm';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { getDb, lunchWeeks } from '@/db';
import { ALLERGENS } from '@/lib/allergens';
import { weeksInIsoYear, type IsoWeek } from '@/lib/isoWeek';
import { DAY_KEYS, type LunchDay, type LunchPrices } from '@/lib/lunch';

const MAX_DISHES_PER_DAY = 15;
const DISH_NAME_MAX = 120;
const NOTE_MAX = 300;
const PRICE_MAX_CENTS = 10000;
const LUNCH_TIME_ZONE = 'Europe/Helsinki';

const dishSchema = z.object({
  name: z
    .string({ error: 'Ruoan nimi puuttuu' })
    .trim()
    .min(1, 'Ruoan nimi puuttuu')
    .max(DISH_NAME_MAX, `Ruoan nimi on liian pitkä (enintään ${DISH_NAME_MAX} merkkiä)`),
  allergens: z
    .array(z.enum(ALLERGENS, { error: `Tuntematon allergeenikoodi (sallitut: ${ALLERGENS.join(', ')})` }), {
      error: 'Virheelliset allergeenit',
    })
    .default([])
    .transform((codes) => ALLERGENS.filter((code) => codes.includes(code))),
});

const daySchema = z.object({
  dishes: z
    .array(dishSchema, { error: 'Virheelliset ruoat' })
    .max(MAX_DISHES_PER_DAY, `Päivällä voi olla enintään ${MAX_DISHES_PER_DAY} ruokaa`)
    .default([]),
  note: z
    .string({ error: 'Virheellinen huomautus' })
    .trim()
    .max(NOTE_MAX, `Huomautus on liian pitkä (enintään ${NOTE_MAX} merkkiä)`)
    .nullish()
    .transform((value) => value || null),
});

const priceCents = z
  .number({ error: 'Hinta on virheellinen' })
  .int('Hinnan pitää olla kokonaisluku senttejä')
  .min(0, 'Hinta ei voi olla negatiivinen')
  .max(PRICE_MAX_CENTS, 'Hinta on liian suuri');

const pricesSchema = z.object(
  { weekdayCents: priceCents, weekendCents: priceCents },
  { error: 'Hinnat ovat virheelliset' },
);

export const weekDocumentSchema = z.object({
  days: z
    .partialRecord(z.enum(DAY_KEYS, { error: 'Virheellinen päivä' }), daySchema, { error: 'Virheelliset päivät' })
    // Empty days are not stored: the public page shows a placeholder for them anyway.
    .transform((days) => {
      const kept: Partial<Record<(typeof DAY_KEYS)[number], LunchDay>> = {};
      for (const key of DAY_KEYS) {
        const day = days[key];
        if (day && (day.dishes.length || day.note)) kept[key] = day;
      }
      return kept;
    }),
  prices: pricesSchema.nullable(),
});

export type WeekDocument = z.output<typeof weekDocumentSchema>;
export type WeekDocumentResult = { ok: true; data: WeekDocument } | { ok: false; error: string };

/** Input is `unknown`: it comes from a model or a chat message. The error is a Finnish sentence. */
export function parseWeekDocument(input: unknown): WeekDocumentResult {
  const result = weekDocumentSchema.safeParse(input);
  return result.success ? { ok: true, data: result.data } : { ok: false, error: result.error.issues[0].message };
}

export function isValidIsoWeek({ isoYear, isoWeek }: IsoWeek): boolean {
  return (
    Number.isInteger(isoYear) &&
    Number.isInteger(isoWeek) &&
    isoYear >= 2000 &&
    isoYear <= 2100 &&
    isoWeek >= 1 &&
    isoWeek <= weeksInIsoYear(isoYear)
  );
}

/** Given prices win, then the week's own stored prices, then the latest earlier week's. */
export function resolvePrices(
  given: LunchPrices | null,
  own: LunchPrices | null,
  previous: LunchPrices | null,
): LunchPrices | null {
  return given ?? own ?? previous ?? null;
}

/** True once the week's Sunday has ended in Helsinki. */
export function isPastWeek(week: IsoWeek, now: Date): boolean {
  const nextMonday = DateTime.fromObject(
    { weekYear: week.isoYear, weekNumber: week.isoWeek, weekday: 1 },
    { zone: LUNCH_TIME_ZONE },
  ).plus({ weeks: 1 });
  return now.getTime() >= nextMonday.toMillis();
}

export type StoredWeek = {
  published: boolean;
  updatedAt: Date;
  days: WeekDocument['days'];
  prices: LunchPrices | null;
};

export async function getWeek(week: IsoWeek): Promise<StoredWeek | null> {
  const [row] = await getDb()
    .select({
      published: lunchWeeks.published,
      updatedAt: lunchWeeks.updatedAt,
      days: lunchWeeks.days,
      prices: lunchWeeks.prices,
    })
    .from(lunchWeeks)
    .where(and(eq(lunchWeeks.isoYear, week.isoYear), eq(lunchWeeks.isoWeek, week.isoWeek)))
    .limit(1);
  return row ?? null;
}

async function previousPrices(week: IsoWeek): Promise<LunchPrices | null> {
  const [row] = await getDb()
    .select({ prices: lunchWeeks.prices })
    .from(lunchWeeks)
    .where(
      and(
        isNotNull(lunchWeeks.prices),
        or(
          lt(lunchWeeks.isoYear, week.isoYear),
          and(eq(lunchWeeks.isoYear, week.isoYear), lt(lunchWeeks.isoWeek, week.isoWeek)),
        ),
      ),
    )
    .orderBy(desc(lunchWeeks.isoYear), desc(lunchWeeks.isoWeek))
    .limit(1);
  return row?.prices ?? null;
}

/**
 * Callers pass the document through `parseWeekDocument` first: this doesn't validate again.
 */
export async function saveWeek(
  week: IsoWeek,
  doc: WeekDocument,
  opts: { published?: boolean } = {},
): Promise<{ prices: LunchPrices | null }> {
  let prices = doc.prices;
  if (!prices) {
    const own = (await getWeek(week))?.prices ?? null;
    prices = resolvePrices(null, own, own ? null : await previousPrices(week));
  }
  const published = opts.published;
  await getDb()
    .insert(lunchWeeks)
    .values({ ...week, days: doc.days, prices, published: published ?? false })
    .onConflictDoUpdate({
      target: [lunchWeeks.isoYear, lunchWeeks.isoWeek],
      set: {
        days: doc.days,
        prices,
        updatedAt: sql`now()`,
        ...(published === undefined ? {} : { published }),
      },
    });
  return { prices };
}

export async function setWeekPublished(week: IsoWeek, published: boolean): Promise<boolean> {
  const rows = await getDb()
    .update(lunchWeeks)
    .set({ published })
    .where(and(eq(lunchWeeks.isoYear, week.isoYear), eq(lunchWeeks.isoWeek, week.isoWeek)))
    .returning({ isoYear: lunchWeeks.isoYear });
  return rows.length > 0;
}
