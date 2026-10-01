import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default async function AdminLunchPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/lunch/login');
  }

  // TODO
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold">Viikon lounas</h1>
    </main>
  );
}
