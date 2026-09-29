'use client';

import { useActionState } from 'react';
import { login } from '@/app/admin/lunch/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: false });

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" required autoFocus />
      </div>
      {state.error && <p className="text-sm text-destructive">Wrong password.</p>}
      <Button type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
