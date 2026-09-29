import LoginForm from './LoginForm';

export default function AdminLunchLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-xl font-semibold">Lunch menu admin</h1>
      <LoginForm />
    </main>
  );
}
