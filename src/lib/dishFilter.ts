export type DishStatusFilter = 'all' | 'active' | 'retired';

export type DishFilters = {
  query: string;
  /** A category id, `none` for uncategorized, or `all`. */
  categoryId: string;
  status: DishStatusFilter;
};

type Filterable = { name: string; description: string | null; categoryId: string | null; isActive: boolean };

export function filterDishes<T extends Filterable>(dishes: T[], { query, categoryId, status }: DishFilters): T[] {
  const needle = query.trim().toLowerCase();
  return dishes.filter((dish) => {
    if (needle && !`${dish.name} ${dish.description ?? ''}`.toLowerCase().includes(needle)) return false;
    if (categoryId === 'none' ? dish.categoryId !== null : categoryId !== 'all' && dish.categoryId !== categoryId) {
      return false;
    }
    if (status === 'active') return dish.isActive;
    if (status === 'retired') return !dish.isActive;
    return true;
  });
}
