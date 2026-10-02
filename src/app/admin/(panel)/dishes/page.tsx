import { requireAdmin } from '@/lib/auth';
import { listCategories } from '@/lib/categories';
import { listDishes } from '@/lib/dishes';
import CategoriesSection from './CategoriesSection';
import DishesSection from './DishesSection';

export default async function AdminDishesPage() {
  await requireAdmin();
  const [categories, dishes] = await Promise.all([listCategories(), listDishes()]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <h1 className="text-xl font-semibold">Ruoat</h1>
      <DishesSection dishes={dishes} categories={categories} />
      <CategoriesSection categories={categories} />
    </main>
  );
}
