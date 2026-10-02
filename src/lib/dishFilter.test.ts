import { describe, expect, it } from 'vitest';
import { filterDishes } from '@/lib/dishFilter';

const dishes = [
  { name: 'Lohikeitto', description: 'kermainen', categoryId: 'a', isActive: true },
  { name: 'Pannukakku', description: null, categoryId: 'b', isActive: true },
  { name: 'Vanha ruoka', description: 'Lohi', categoryId: null, isActive: false },
];
const all = { query: '', categoryId: 'all', status: 'all' } as const;

describe('filterDishes', () => {
  it('returns everything with no filters', () => {
    expect(filterDishes(dishes, all)).toHaveLength(3);
  });

  it('searches name and description, case-insensitively', () => {
    expect(filterDishes(dishes, { ...all, query: 'LOHI' }).map((d) => d.name)).toEqual(['Lohikeitto', 'Vanha ruoka']);
  });

  it('filters by category, including uncategorized', () => {
    expect(filterDishes(dishes, { ...all, categoryId: 'b' }).map((d) => d.name)).toEqual(['Pannukakku']);
    expect(filterDishes(dishes, { ...all, categoryId: 'none' }).map((d) => d.name)).toEqual(['Vanha ruoka']);
  });

  it('filters by status', () => {
    expect(filterDishes(dishes, { ...all, status: 'active' })).toHaveLength(2);
    expect(filterDishes(dishes, { ...all, status: 'retired' }).map((d) => d.name)).toEqual(['Vanha ruoka']);
  });
});
