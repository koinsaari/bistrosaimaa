import { beforeEach, describe, expect, it, vi } from 'vitest';

const ID = '3f2b8f0e-6a52-4a44-9a3e-1c1f3c2d9a10';

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn<() => Promise<void>>(),
  writes: {
    createDish: vi.fn(),
    updateDish: vi.fn(),
    setDishActive: vi.fn(),
    duplicateDish: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    saveWeek: vi.fn(),
    setWeekPublished: vi.fn(),
  },
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth')>()),
  requireAdmin: mocks.requireAdmin,
}));
vi.mock('@/lib/dishes', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/dishes')>()),
  createDish: mocks.writes.createDish,
  updateDish: mocks.writes.updateDish,
  setDishActive: mocks.writes.setDishActive,
  duplicateDish: mocks.writes.duplicateDish,
}));
vi.mock('@/lib/categories', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/categories')>()),
  createCategory: mocks.writes.createCategory,
  updateCategory: mocks.writes.updateCategory,
  deleteCategory: mocks.writes.deleteCategory,
}));
vi.mock('@/lib/lunchWeek', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/lunchWeek')>()),
  saveWeek: mocks.writes.saveWeek,
  setWeekPublished: mocks.writes.setWeekPublished,
}));

const dish = await import('./dishes/dish-actions');
const category = await import('./dishes/category-actions');
const week = await import('./lunch/week-actions');

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

// Server actions are public HTTP endpoints and layouts don't guard them, so each must check the session itself.
// The input is valid, so a missing guard would reach the database write.
const actions: [string, () => Promise<unknown>][] = [
  ['createDishAction', () => dish.createDishAction(null, form({ name: 'A', categoryId: 'none' }))],
  ['updateDishAction', () => dish.updateDishAction(null, form({ id: ID, name: 'A', categoryId: 'none' }))],
  ['setDishActiveAction', () => dish.setDishActiveAction(form({ id: ID, isActive: 'true' }))],
  ['duplicateDishAction', () => dish.duplicateDishAction(form({ id: ID }))],
  ['createCategoryAction', () => category.createCategoryAction(null, form({ name: 'A', sortOrder: '1' }))],
  ['updateCategoryAction', () => category.updateCategoryAction(null, form({ id: ID, name: 'A', sortOrder: '1' }))],
  ['deleteCategoryAction', () => category.deleteCategoryAction(form({ id: ID }))],
  ['saveWeekAction', () => week.saveWeekAction(null, form({ isoYear: '2026', isoWeek: '10' }))],
  ['setWeekPublishedAction', () => week.setWeekPublishedAction(null, form({ isoYear: '2026', isoWeek: '10', published: 'true' }))],
];

describe('admin server actions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    for (const write of Object.values(mocks.writes)) write.mockResolvedValue({ ok: true });
  });

  it.each(actions)('%s does nothing without an admin session', async (_name, run) => {
    mocks.requireAdmin.mockRejectedValue(new Error('REDIRECT:/admin/login'));
    await expect(run()).rejects.toThrow('REDIRECT:/admin/login');
    for (const write of Object.values(mocks.writes)) expect(write).not.toHaveBeenCalled();
  });

  it.each(actions)('%s writes once the session is valid', async (_name, run) => {
    mocks.requireAdmin.mockResolvedValue();
    await run();
    expect(Object.values(mocks.writes).some((write) => write.mock.calls.length > 0)).toBe(true);
  });
});
