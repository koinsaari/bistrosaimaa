import { asc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { dishes, getDb } from '@/db';
import { ALLERGENS } from '@/lib/allergens';
import { isUniqueViolation, parseCategoryId } from '@/lib/categories';

export function isForeignKeyViolation(err: unknown): boolean {
  const codeOf = (e: unknown) => (typeof e === 'object' && e !== null ? (e as { code?: unknown }).code : undefined);
  const cause = typeof err === 'object' && err !== null ? (err as { cause?: unknown }).cause : undefined;
  return codeOf(err) === '23503' || codeOf(cause) === '23503';
}

const NAME_MAX = 100;
const DESCRIPTION_MAX = 300;

const dishInputSchema = z.object({
  name: z.string({ error: 'Nimi vaaditaan' }).trim().min(1, 'Nimi vaaditaan').max(NAME_MAX, 'Nimi on liian pitkä'),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, 'Kuvaus on liian pitkä')
    .nullish()
    .transform((value) => value || null),
  categoryId: z
    .union([z.literal(''), z.null(), z.undefined(), z.uuid('Kategoriaa ei löytynyt')])
    .transform((value) => value || null),
  allergens: z
    .array(z.enum(ALLERGENS, 'Tuntematon allergeeni'), { error: 'Tuntematon allergeeni' })
    .transform((picked) => ALLERGENS.filter((a) => picked.includes(a))),
  // present means on, absent means off.
  isActive: z.unknown().transform(Boolean),
});

export type DishInput = z.output<typeof dishInputSchema>;
export type DishResult = { ok: true } | { ok: false; error: string };

export function parseDish(input: {
  name: unknown;
  description: unknown;
  categoryId: unknown;
  allergens: unknown;
  isActive: unknown;
}): { ok: true; data: DishInput } | { ok: false; error: string } {
  const result = dishInputSchema.safeParse(input);
  return result.success ? { ok: true, data: result.data } : { ok: false, error: result.error.issues[0].message };
}

export const parseDishId = parseCategoryId;

const COPY_SUFFIX = 'kopio';

/** First free "<name> (kopio)", "<name> (kopio 2)", … ; names compare case-insensitively like the unique index. */
export function copyName(name: string, existing: string[]): string {
  const taken = new Set(existing.map((n) => n.toLowerCase()));
  for (let n = 1; ; n++) {
    const suffix = ` (${COPY_SUFFIX}${n > 1 ? ` ${n}` : ''})`;
    const candidate = `${name.slice(0, NAME_MAX - suffix.length).trimEnd()}${suffix}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
}

const DUPLICATE_ERROR = 'Samanniminen ruoka on jo olemassa';
const NOT_FOUND_ERROR = 'Ruokaa ei löytynyt';
const CATEGORY_GONE_ERROR = 'Kategoriaa ei löytynyt';

export async function listDishes() {
  return getDb().select().from(dishes).orderBy(asc(sql`lower(${dishes.name})`));
}

export async function createDish(input: DishInput): Promise<DishResult> {
  try {
    await getDb().insert(dishes).values(input);
    return { ok: true };
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, error: DUPLICATE_ERROR };
    // The category was deleted after the form was opened.
    if (isForeignKeyViolation(err)) return { ok: false, error: CATEGORY_GONE_ERROR };
    throw err;
  }
}

export async function updateDish(id: string, input: DishInput): Promise<DishResult> {
  try {
    const updated = await getDb().update(dishes).set(input).where(eq(dishes.id, id)).returning({ id: dishes.id });
    return updated.length ? { ok: true } : { ok: false, error: NOT_FOUND_ERROR };
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, error: DUPLICATE_ERROR };
    // The category was deleted after the form was opened.
    if (isForeignKeyViolation(err)) return { ok: false, error: CATEGORY_GONE_ERROR };
    throw err;
  }
}

/** Dishes in a week can't be deleted, so retiring is the way to hide one. */
export async function setDishActive(id: string, isActive: boolean): Promise<void> {
  await getDb().update(dishes).set({ isActive }).where(eq(dishes.id, id));
}

/** The copy is created active, so it can be edited and used straight away. */
export async function duplicateDish(id: string): Promise<DishResult> {
  const db = getDb();
  const [source] = await db.select().from(dishes).where(eq(dishes.id, id));
  if (!source) return { ok: false, error: NOT_FOUND_ERROR };

  // A concurrent copy can take the free name between the read and the insert, so re-read and retry.
  let result: DishResult = { ok: false, error: DUPLICATE_ERROR };
  for (let attempt = 0; attempt < 3 && !result.ok && result.error === DUPLICATE_ERROR; attempt++) {
    const names = (await db.select({ name: dishes.name }).from(dishes)).map((d) => d.name);
    result = await createDish({
      name: copyName(source.name, names),
      description: source.description,
      categoryId: source.categoryId,
      allergens: source.allergens as DishInput['allergens'],
      isActive: true,
    });
  }
  return result;
}
