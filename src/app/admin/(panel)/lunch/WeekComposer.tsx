'use client';

import { startTransition, useActionState, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveWeekAction, setWeekPublishedAction, type WeekFormState } from './week-actions';

type Category = { id: string; name: string };
type Dish = { id: string; name: string; categoryId: string | null; isActive: boolean };
type DayState = { dishIds: string[]; note: string };

const DAY_NAMES = ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'];

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

function DayEditor({
  index,
  state,
  dishes,
  categories,
  onChange,
}: {
  index: number;
  state: DayState;
  dishes: Dish[];
  categories: Category[];
  onChange: (next: DayState) => void;
}) {
  const day = index + 1;
  const byId = new Map(dishes.map((d) => [d.id, d]));
  // Only active dishes not already on this day can be added.
  const available = dishes.filter((d) => d.isActive && !state.dishIds.includes(d.id));
  const groups = [
    ...categories.map((c) => ({ key: c.id, name: c.name, dishes: available.filter((d) => d.categoryId === c.id) })),
    { key: 'none', name: 'Ei kategoriaa', dishes: available.filter((d) => d.categoryId === null) },
  ].filter((g) => g.dishes.length);

  return (
    <section className="flex flex-col gap-2 border-b pb-4" data-testid={`day-${day}`}>
      <h2 className="font-semibold">{DAY_NAMES[index]}</h2>
      <ol className="flex flex-col gap-1">
        {state.dishIds.map((id, position) => {
          const dish = byId.get(id);
          return (
            <li key={id} className="flex items-center gap-2" data-testid="day-dish">
              <input type="hidden" name={`day-${day}-dish`} value={id} />
              <span className="flex-1">
                <span data-testid="day-dish-name">{dish?.name ?? id}</span>
                {dish && !dish.isActive && (
                  <Badge variant="secondary" className="ml-2">
                    Poistettu käytöstä
                  </Badge>
                )}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Siirrä ylös"
                data-testid="dish-up"
                onClick={() => onChange({ ...state, dishIds: move(state.dishIds, position, position - 1) })}
              >
                ▲
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Siirrä alas"
                data-testid="dish-down"
                onClick={() => onChange({ ...state, dishIds: move(state.dishIds, position, position + 1) })}
              >
                ▼
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Poista"
                data-testid="dish-remove"
                onClick={() => onChange({ ...state, dishIds: state.dishIds.filter((d) => d !== id) })}
              >
                ✕
              </Button>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`add-${day}`}>Lisää ruoka</Label>
        <Select value="" onValueChange={(id) => id && onChange({ ...state, dishIds: [...state.dishIds, id] })}>
          <SelectTrigger id={`add-${day}`} className="w-64" data-testid="day-add">
            <SelectValue placeholder="Valitse ruoka" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectGroup key={group.key}>
                <SelectLabel>{group.name}</SelectLabel>
                {group.dishes.map((dish) => (
                  <SelectItem key={dish.id} value={dish.id}>
                    {dish.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`note-${day}`}>Huomautus</Label>
        <Input
          id={`note-${day}`}
          name={`day-${day}-note`}
          value={state.note}
          onChange={(e) => onChange({ ...state, note: e.target.value })}
          data-testid="day-note"
        />
      </div>
    </section>
  );
}

export default function WeekComposer({
  isoYear,
  isoWeek,
  initialDays,
  stored,
  published,
  dishes,
  categories,
}: {
  isoYear: number;
  isoWeek: number;
  initialDays: Record<number, DayState>;
  stored: boolean;
  published: boolean;
  dishes: Dish[];
  categories: Category[];
}) {
  const [days, setDays] = useState<DayState[]>(() =>
    DAY_NAMES.map((_, i) => initialDays[i + 1] ?? { dishIds: [], note: '' }),
  );
  const [saveState, saveAction, saving] = useActionState(saveWeekAction, null as WeekFormState);
  const [publishState, publishAction, publishing] = useActionState(setWeekPublishedAction, null as WeekFormState);
  const [lastAction, setLastAction] = useState<'save' | 'publish'>('save');
  const lastState = lastAction === 'save' ? saveState : publishState;
  const error = lastState && !lastState.ok ? lastState : null;
  // The server trims notes, so compare trimmed.
  const snapshot = (list: DayState[]) => JSON.stringify(list.map((d) => ({ ...d, note: d.note.trim() })));
  const dirty = snapshot(days) !== snapshot(DAY_NAMES.map((_, i) => initialDays[i + 1] ?? { dishIds: [], note: '' }));

  return (
    <div className="flex flex-col gap-4">
      {/* Not `action={...}`: React resets the form after the action and would drop typed notes. */}
      <form
        className="flex flex-col gap-4"
        data-testid="week-form"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setLastAction('save');
          startTransition(() => saveAction(formData));
        }}
      >
        <input type="hidden" name="isoYear" value={isoYear} />
        <input type="hidden" name="isoWeek" value={isoWeek} />
        {days.map((state, index) => (
          <DayEditor
            key={index}
            index={index}
            state={state}
            dishes={dishes}
            categories={categories}
            onChange={(next) => setDays((prev) => prev.map((d, i) => (i === index ? next : d)))}
          />
        ))}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving} data-testid="week-save">
            Tallenna
          </Button>
          {saveState?.ok && !dirty && <span data-testid="week-saved">Tallennettu</span>}
        </div>
      </form>
      <form
        className="flex items-center gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setLastAction('publish');
          startTransition(() => publishAction(formData));
        }}
      >
        <input type="hidden" name="isoYear" value={isoYear} />
        <input type="hidden" name="isoWeek" value={isoWeek} />
        <input type="hidden" name="published" value={String(!published)} />
        <Button type="submit" variant="outline" disabled={publishing || !stored || dirty} data-testid="week-publish">
          {published ? 'Piilota' : 'Julkaise'}
        </Button>
        <span data-testid="week-status">{published ? 'Julkaistu' : stored ? 'Ei julkaistu' : 'Ei tallennettu'}</span>
        {dirty && stored && <span data-testid="week-dirty">Tallenna muutokset ennen julkaisua</span>}
      </form>
      {error && (
        <p className="text-sm text-destructive" data-testid="week-error">
          {error.error}
        </p>
      )}
    </div>
  );
}
