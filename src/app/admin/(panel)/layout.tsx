import Link from 'next/link';
import { logout } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
          <nav className="flex gap-4 text-sm font-medium" data-testid="admin-nav">
            <Link href="/admin/lunch">Lounas</Link>
            <Link href="/admin/dishes">Ruoat</Link>
          </nav>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm" data-testid="admin-logout">
              Kirjaudu ulos
            </Button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
