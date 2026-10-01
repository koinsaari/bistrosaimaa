import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LoginForm from './LoginForm';

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect('/admin/lunch');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-xl font-semibold">Lounaslistan hallinta</h1>
      <LoginForm />
    </main>
  );
}
