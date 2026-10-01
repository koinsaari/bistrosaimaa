import { requireAdmin } from '@/lib/auth';

export default async function AdminLunchPage() {
  await requireAdmin();

  // TODO
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold">Viikon lounas</h1>
    </main>
  );
}
