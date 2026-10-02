import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { categories, getDb } from '@/db';
import { isUniqueViolation } from '@/lib/dbErrors';

const SORT_ORDER_ERROR = 'Järjestysnumero on kokonaisluku 0–9999';

const categoryInputSchema = z.object({
  name: z.string({ error: 'Nimi vaaditaan' }).trim().min(1, 'Nimi vaaditaan').max(60, 'Nimi on liian pitkä'),
  sortOrder: z
    .string({ error: SORT_ORDER_ERROR })
    .trim()
    .regex(/^\d{1,4}$/, SORT_ORDER_ERROR)
    .transform(Number),
});

export type CategoryInput = z.output<typeof categoryInputSchema>;
export type CategoryResult = { ok: true } | { ok: false; error: string };

export function parseCategory(input: {
  name: unknown;
  sortOrder: unknown;
}): { ok: true; data: CategoryInput } | { ok: false; error: string } {
  const result = categoryInputSchema.safeParse(input);
  return result.success ? { ok: true, data: result.data } : { ok: false, error: result.error.issues[0].message };
}

/** Ids come from form fields, and Postgres throws on a malformed uuid. */
export function parseCategoryId(value: unknown): string | null {
  const result = z.uuid().safeParse(value);
  return result.success ? result.data : null;
}

const DUPLICATE_ERROR = 'Samanniminen kategoria on jo olemassa';

export async function listCategories() {
  return getDb().select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function createCategory(input: CategoryInput): Promise<CategoryResult> {
  try {
    await getDb().insert(categories).values(input);
    return { ok: true };
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, error: DUPLICATE_ERROR };
    throw err;
  }
}

export async function updateCategory(id: string, input: CategoryInput): Promise<CategoryResult> {
  try {
    const updated = await getDb().update(categories).set(input).where(eq(categories.id, id)).returning({ id: categories.id });
    return updated.length ? { ok: true } : { ok: false, error: 'Kategoriaa ei löytynyt' };
  } catch (err) {
    if (isUniqueViolation(err)) return { ok: false, error: DUPLICATE_ERROR };
    throw err;
  }
}

/** Dishes in the category keep existing with no category (on delete set null). */
export async function deleteCategory(id: string): Promise<void> {
  await getDb().delete(categories).where(eq(categories.id, id));
}
