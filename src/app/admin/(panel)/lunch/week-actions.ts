'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { parseWeek, saveWeek, setWeekPublished } from '@/lib/lunchWeek';

export type WeekFormState = { ok: true } | { ok: false; error: string } | null;

const DAYS = [1, 2, 3, 4, 5, 6, 7];

export async function saveWeekAction(_prev: WeekFormState, formData: FormData): Promise<WeekFormState> {
  await requireAdmin();
  const parsed = parseWeek({
    isoYear: formData.get('isoYear'),
    isoWeek: formData.get('isoWeek'),
    days: DAYS.map((day) => ({
      day: String(day),
      dishIds: formData.getAll(`day-${day}-dish`),
      note: formData.get(`day-${day}-note`),
    })),
  });
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const result = await saveWeek(parsed.data);
  if (!result.ok) return result;
  revalidatePath('/admin/lunch');
  return { ok: true };
}

export async function setWeekPublishedAction(_prev: WeekFormState, formData: FormData): Promise<WeekFormState> {
  await requireAdmin();
  const parsed = parseWeek({ isoYear: formData.get('isoYear'), isoWeek: formData.get('isoWeek'), days: [] });
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const result = await setWeekPublished(parsed.data.isoYear, parsed.data.isoWeek, formData.get('published') === 'true');
  if (!result.ok) return result;
  revalidatePath('/admin/lunch');
  return { ok: true };
}
