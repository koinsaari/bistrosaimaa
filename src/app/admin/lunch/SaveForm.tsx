'use client';

import { useActionState } from 'react';
import { saveLunchMenu, type SaveLunchMenuState } from './actions';
import { DAY_KEYS, formatUpdatedAt, type LunchRecord } from '@/lib/lunch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DAY_LABELS: Record<(typeof DAY_KEYS)[number], string> = {
  monday: 'Maanantai',
  tuesday: 'Tiistai',
  wednesday: 'Keskiviikko',
  thursday: 'Torstai',
  friday: 'Perjantai',
  saturday: 'Lauantai',
  sunday: 'Sunnuntai',
};

export default function SaveForm({ initialRecord }: { initialRecord: LunchRecord | null }) {
  const [state, formAction, pending] = useActionState<SaveLunchMenuState, FormData>(saveLunchMenu, {
    error: false,
    record: null,
  });

  const record = state.record ?? initialRecord;

  return (
    <>
      {state.error && <p className="text-sm text-destructive">Tallennus epäonnistui. Yritä uudelleen.</p>}
      {state.record && !state.error && (
        <p className="text-sm text-green-700">Tallennettu.</p>
      )}
      {record && (
        <p className="text-sm text-muted-foreground">Päivitetty {formatUpdatedAt(record.updatedAt)}</p>
      )}
      <form action={formAction} className="flex flex-col gap-4">
        {DAY_KEYS.map((day) => (
          <div key={day} className="flex flex-col gap-1.5">
            <Label htmlFor={day}>{DAY_LABELS[day]}</Label>
            <Input id={day} type="text" name={day} defaultValue={record?.[day] ?? ''} />
          </div>
        ))}
        <Button type="submit" disabled={pending} className="mt-2 self-start">
          {pending ? 'Tallennetaan…' : 'Tallenna'}
        </Button>
      </form>
    </>
  );
}
