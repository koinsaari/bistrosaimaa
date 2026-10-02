'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { createDish, duplicateDish, parseDish, parseDishId, setDishActive, updateDish } from '@/lib/dishes';

export type DishFormValues = {
  name: string;
  description: string;
  categoryId: string;
  allergens: string[];
  isActive: boolean;
};

export type DishFormState = { ok: true } | { ok: false; error: string; values: DishFormValues } | null;

/** The category Select has no empty item value, so "none" stands for no category. */
const NO_CATEGORY = 'none';

function readFields(formData: FormData) {
  const categoryId = formData.get('categoryId');
  return {
    name: formData.get('name'),
    description: formData.get('description'),
    categoryId: categoryId === NO_CATEGORY ? '' : categoryId,
    allergens: formData.getAll('allergens'),
    isActive: formData.get('isActive'),
  };
}

function failure(error: string, fields: ReturnType<typeof readFields>): DishFormState {
  return {
    ok: false,
    error,
    values: {
      name: String(fields.name ?? ''),
      description: String(fields.description ?? ''),
      categoryId: String(fields.categoryId || NO_CATEGORY),
      allergens: fields.allergens.map(String),
      isActive: Boolean(fields.isActive),
    },
  };
}

export async function createDishAction(_prev: DishFormState, formData: FormData): Promise<DishFormState> {
  await requireAdmin();
  const fields = readFields(formData);
  const parsed = parseDish(fields);
  if (!parsed.ok) return failure(parsed.error, fields);

  const result = await createDish(parsed.data);
  if (!result.ok) return failure(result.error, fields);
  revalidatePath('/admin/dishes');
  return { ok: true };
}

export async function updateDishAction(_prev: DishFormState, formData: FormData): Promise<DishFormState> {
  await requireAdmin();
  const fields = readFields(formData);
  const id = parseDishId(formData.get('id'));
  if (!id) return failure('Ruokaa ei löytynyt', fields);
  const parsed = parseDish(fields);
  if (!parsed.ok) return failure(parsed.error, fields);

  const result = await updateDish(id, parsed.data);
  if (!result.ok) return failure(result.error, fields);
  revalidatePath('/admin/dishes');
  return { ok: true };
}

export async function setDishActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseDishId(formData.get('id'));
  if (!id) return;
  await setDishActive(id, formData.get('isActive') === 'true');
  revalidatePath('/admin/dishes');
}

export async function duplicateDishAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseDishId(formData.get('id'));
  if (!id) return;
  await duplicateDish(id);
  revalidatePath('/admin/dishes');
}
