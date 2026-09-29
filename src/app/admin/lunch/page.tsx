import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getLunchRecord } from '@/lib/lunch';
import SaveForm from './SaveForm';

export default async function AdminLunchPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/lunch/login');
  }

  const record = await getLunchRecord();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-12">
      <h1 className="text-xl font-semibold">Viikon lounas</h1>
      <SaveForm initialRecord={record} />
    </main>
  );
}
