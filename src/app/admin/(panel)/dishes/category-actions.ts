'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import {
  createCategory,
  deleteCategory,
  parseCategory,
  parseCategoryId,
  updateCategory,
} from '@/lib/categories';

export type CategoryFormState =
  | { ok: true }
  | { ok: false; error: string; values: { name: string; sortOrder: string } }
  | null;

function readFields(formData: FormData) {
  return { name: formData.get('name'), sortOrder: formData.get('sortOrder') };
}

function failure(error: string, fields: ReturnType<typeof readFields>): CategoryFormState {
  return { ok: false, error, values: { name: String(fields.name ?? ''), sortOrder: String(fields.sortOrder ?? '') } };
}

export async function createCategoryAction(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireAdmin();
  const fields = readFields(formData);
  const parsed = parseCategory(fields);
  if (!parsed.ok) return failure(parsed.error, fields);

  const result = await createCategory(parsed.data);
  if (!result.ok) return failure(result.error, fields);
  revalidatePath('/admin/dishes');
  return { ok: true };
}

export async function updateCategoryAction(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireAdmin();
  const fields = readFields(formData);
  const id = parseCategoryId(formData.get('id'));
  if (!id) return failure('Kategoriaa ei löytynyt', fields);
  const parsed = parseCategory(fields);
  if (!parsed.ok) return failure(parsed.error, fields);

  const result = await updateCategory(id, parsed.data);
  if (!result.ok) return failure(result.error, fields);
  revalidatePath('/admin/dishes');
  return { ok: true };
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = parseCategoryId(formData.get('id'));
  if (!id) return;
  await deleteCategory(id);
  revalidatePath('/admin/dishes');
}
