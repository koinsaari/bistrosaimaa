'use client';

import { useActionState } from 'react';
import { login } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: false });

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Salasana</Label>
        <Input id="password" type="password" name="password" required autoFocus data-testid="admin-password" />
      </div>
      {state.error && <p className="text-sm text-destructive" data-testid="admin-login-error">Väärä salasana.</p>}
      <Button type="submit" disabled={pending} data-testid="admin-login-submit">
        {pending ? 'Kirjaudutaan…' : 'Kirjaudu'}
      </Button>
    </form>
  );
}
