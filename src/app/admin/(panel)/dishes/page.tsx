import { requireAdmin } from '@/lib/auth';
import { listCategories } from '@/lib/categories';
import CategoriesSection from './CategoriesSection';

export default async function AdminDishesPage() {
  await requireAdmin();
  const categories = await listCategories();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
      <h1 className="text-xl font-semibold">Ruoat</h1>
      <CategoriesSection categories={categories} />
    </main>
  );
}
