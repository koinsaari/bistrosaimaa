import { and, asc, eq, sql } from 'drizzle-orm';
import type { BatchItem } from 'drizzle-orm/batch';
import { z } from 'zod';
import { getDb, lunchDays, lunchDishes, lunchWeeks } from '@/db';
import { isForeignKeyViolation } from '@/lib/dbErrors';
import { weeksInIsoYear } from '@/lib/isoWeek';

const WEEK_ERROR = 'Virheellinen viikko';
const DAY_ERROR = 'Virheellinen päivä';
const MAX_DISHES_PER_DAY = 15;
const NOTE_MAX = 300;

const digits = (pattern: RegExp, error: string) => z.string({ error }).trim().regex(pattern, error).transform(Number);

const daySchema = z.object({
  day: digits(/^[1-7]$/, DAY_ERROR),
  dishIds: z
    .array(z.uuid('Ruokaa ei löytynyt'), { error: 'Ruokaa ei löytynyt' })
    .max(MAX_DISHES_PER_DAY, 'Päivällä on liian monta ruokaa')
    .superRefine((ids, ctx) => {
      if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: 'Sama ruoka on päivällä kahdesti' });
    }),
  note: z
    .string()
    .trim()
    .max(NOTE_MAX, 'Huomautus on liian pitkä')
    .nullish()
    .transform((value) => value || null),
});

const weekInputSchema = z
  .object({
    isoYear: digits(/^\d{4}$/, WEEK_ERROR).refine((year) => year >= 2000 && year <= 2100, WEEK_ERROR),
    isoWeek: digits(/^\d{1,2}$/, WEEK_ERROR).refine((week) => week >= 1, WEEK_ERROR),
    days: z
      .array(daySchema, { error: DAY_ERROR })
      .max(7, DAY_ERROR)
      .superRefine((days, ctx) => {
        if (new Set(days.map((d) => d.day)).size !== days.length) {
          ctx.addIssue({ code: 'custom', message: 'Sama päivä on listalla kahdesti' });
        }
      })
      // Empty days have no row: the public page shows a placeholder for them anyway.
      .transform((days) => days.filter((d) => d.dishIds.length || d.note).sort((a, b) => a.day - b.day)),
  })
  // Zod still runs this when a field failed (with the raw value), and Luxon throws on junk.
  .refine((week) => !Number.isInteger(week.isoYear) || week.isoWeek <= weeksInIsoYear(week.isoYear), {
    message: WEEK_ERROR,
  });

export type WeekInput = z.output<typeof weekInputSchema>;
export type WeekResult = { ok: true } | { ok: false; error: string };

export function parseWeek(input: {
  isoYear: unknown;
  isoWeek: unknown;
  days: unknown;
}): { ok: true; data: WeekInput } | { ok: false; error: string } {
  const result = weekInputSchema.safeParse(input);
  return result.success ? { ok: true, data: result.data } : { ok: false, error: result.error.issues[0].message };
}

export type StoredWeek = {
  published: boolean;
  updatedAt: Date;
  days: { day: number; note: string | null; dishIds: string[] }[];
};

export async function getWeek(isoYear: number, isoWeek: number): Promise<StoredWeek | null> {
  const rows = await getDb()
    .select({
      published: lunchWeeks.published,
      updatedAt: lunchWeeks.updatedAt,
      day: lunchDays.day,
      note: lunchDays.note,
      dishId: lunchDishes.dishId,
    })
    .from(lunchWeeks)
    .leftJoin(lunchDays, eq(lunchDays.weekId, lunchWeeks.id))
    .leftJoin(lunchDishes, and(eq(lunchDishes.weekId, lunchDays.weekId), eq(lunchDishes.day, lunchDays.day)))
    .where(and(eq(lunchWeeks.isoYear, isoYear), eq(lunchWeeks.isoWeek, isoWeek)))
    .orderBy(asc(lunchDays.day), asc(lunchDishes.position));
  if (rows.length === 0) return null;

  const days: StoredWeek['days'] = [];
  for (const row of rows) {
    if (row.day === null) continue;
    let entry = days.at(-1);
    if (entry?.day !== row.day) {
      entry = { day: row.day, note: row.note, dishIds: [] };
      days.push(entry);
    }
    if (row.dishId !== null) entry.dishIds.push(row.dishId);
  }
  return { published: rows[0].published, updatedAt: rows[0].updatedAt, days };
}

/** Replaces the week's days and dishes. Publish state is left alone. */
export async function saveWeek(input: WeekInput): Promise<WeekResult> {
  const db = getDb();

  // No-op update so a new week and an existing one both hand back their id.
  const [week] = await db
    .insert(lunchWeeks)
    .values({ isoYear: input.isoYear, isoWeek: input.isoWeek })
    .onConflictDoUpdate({ target: [lunchWeeks.isoYear, lunchWeeks.isoWeek], set: { isoYear: input.isoYear } })
    .returning({ id: lunchWeeks.id });

  const dayRows = input.days.map((d) => ({ weekId: week.id, day: d.day, note: d.note }));
  const dishRows = input.days.flatMap((d) =>
    d.dishIds.map((dishId, position) => ({ weekId: week.id, day: d.day, dishId, position })),
  );

  // neon-http has no interactive transactions, so one batch keeps the replace atomic.
  // `$onUpdate` doesn't fire for child-only changes, hence the explicit updated_at.
  const rest: BatchItem<'pg'>[] = [
    ...(dayRows.length ? [db.insert(lunchDays).values(dayRows)] : []),
    ...(dishRows.length ? [db.insert(lunchDishes).values(dishRows)] : []),
    db.update(lunchWeeks).set({ updatedAt: sql`now()` }).where(eq(lunchWeeks.id, week.id)),
  ];
  try {
    await db.batch([db.delete(lunchDays).where(eq(lunchDays.weekId, week.id)), ...rest]);
  } catch (err) {
    // A dish id that doesn't exist (the picker only offers real ones, so this is a stale or forged request).
    if (isForeignKeyViolation(err)) return { ok: false, error: 'Ruokaa ei löytynyt' };
    throw err;
  }
  return { ok: true };
}

export async function setWeekPublished(isoYear: number, isoWeek: number, published: boolean): Promise<WeekResult> {
  const updated = await getDb()
    .update(lunchWeeks)
    .set({ published, updatedAt: sql`now()` })
    .where(and(eq(lunchWeeks.isoYear, isoYear), eq(lunchWeeks.isoWeek, isoWeek)))
    .returning({ id: lunchWeeks.id });
  return updated.length ? { ok: true } : { ok: false, error: 'Tallenna viikko ennen julkaisua' };
}
