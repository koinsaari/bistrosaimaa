'use client';

import { startTransition, useActionState, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    <div className="flex flex-col gap-5 overflow-y-auto px-4 pb-2" data-testid="day-editor">
      <div className="flex flex-col gap-2">
        {state.dishIds.length === 0 && <p className="text-sm text-muted-foreground">Ei ruokia vielä.</p>}
        {state.dishIds.map((id, position) => {
          const dish = byId.get(id);
          return (
            <Card key={id} className="flex-row items-center gap-2 p-2 shadow-none" data-testid="day-dish">
              <span className="min-w-0 flex-1 break-words">
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
                className="size-11"
                aria-label="Siirrä ylös"
                data-testid="dish-up"
                disabled={position === 0}
                onClick={() => onChange({ ...state, dishIds: move(state.dishIds, position, position - 1) })}
              >
                ▲
              </Button>
              <Button
                type="button"
                variant="outline"
                className="size-11"
                aria-label="Siirrä alas"
                data-testid="dish-down"
                disabled={position === state.dishIds.length - 1}
                onClick={() => onChange({ ...state, dishIds: move(state.dishIds, position, position + 1) })}
              >
                ▼
              </Button>
              <Button
                type="button"
                variant="outline"
                className="size-11"
                aria-label="Poista"
                data-testid="dish-remove"
                onClick={() => onChange({ ...state, dishIds: state.dishIds.filter((d) => d !== id) })}
              >
                ✕
              </Button>
            </Card>
          );
        })}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`add-${day}`}>Lisää ruoka</Label>
        <Select value="" onValueChange={(id) => id && onChange({ ...state, dishIds: [...state.dishIds, id] })}>
          <SelectTrigger id={`add-${day}`} className="w-full data-[size=default]:h-11" data-testid="day-add">
            <SelectValue placeholder="Valitse ruoka" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectGroup key={group.key}>
                <SelectLabel>{group.name}</SelectLabel>
                {group.dishes.map((dish) => (
                  <SelectItem key={dish.id} value={dish.id} className="py-3">
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
          value={state.note}
          onChange={(e) => onChange({ ...state, note: e.target.value })}
          className="h-11"
          data-testid="day-note"
        />
      </div>
    </div>
  );
}

function DayRow({
  index,
  state,
  dishes,
  onOpen,
}: {
  index: number;
  state: DayState;
  dishes: Dish[];
  onOpen: () => void;
}) {
  const day = index + 1;
  const byId = new Map(dishes.map((d) => [d.id, d]));
  const note = state.note.trim();

  return (
    <TableRow className="cursor-pointer align-top" onClick={onOpen} data-testid={`day-${day}`}>
      <TableCell className="w-28 py-3 font-semibold whitespace-normal">
        {state.dishIds.map((id) => (
          <input key={id} type="hidden" name={`day-${day}-dish`} value={id} />
        ))}
        <input type="hidden" name={`day-${day}-note`} value={state.note} />
        {DAY_NAMES[index]}
      </TableCell>
      <TableCell className="py-3 whitespace-normal">
        <div className="flex flex-col gap-0.5">
          {state.dishIds.length === 0 ? (
            <span className="text-muted-foreground">Ei ruokia</span>
          ) : (
            state.dishIds.map((id) => (
              <span key={id} data-testid="day-dish-name" className="break-words">
                {byId.get(id)?.name ?? id}
              </span>
            ))
          )}
          {note && <span className="break-words text-sm italic text-muted-foreground">{note}</span>}
        </div>
      </TableCell>
      <TableCell className="w-12 px-1 py-1.5 text-right">
        <Button type="button" variant="ghost" className="size-11" aria-label={`Muokkaa: ${DAY_NAMES[index]}`}>
          <ChevronRight className="size-5" aria-hidden />
        </Button>
      </TableCell>
    </TableRow>
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
  const [editing, setEditing] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<'save' | 'publish'>('save');
  const lastState = lastAction === 'save' ? saveState : publishState;
  const error = lastState && !lastState.ok ? lastState : null;
  // The server trims notes, so compare trimmed.
  const snapshot = (list: DayState[]) => JSON.stringify(list.map((d) => ({ ...d, note: d.note.trim() })));
  const dirty = snapshot(days) !== snapshot(DAY_NAMES.map((_, i) => initialDays[i + 1] ?? { dishIds: [], note: '' }));

  const updateDay = (index: number, next: DayState) => setDays((prev) => prev.map((d, i) => (i === index ? next : d)));

  return (
    <div className="flex flex-col gap-4">
      {/* Not `action={...}`: React resets the form after the action and would drop typed notes. */}
      <form
        id="week-form"
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
        <Card className="gap-0 overflow-hidden py-0 shadow-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Päivä</TableHead>
                <TableHead>Ruoat</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Muokkaa</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((state, index) => (
                <DayRow key={index} index={index} state={state} dishes={dishes} onOpen={() => setEditing(index)} />
              ))}
            </TableBody>
          </Table>
        </Card>
      </form>
      <form
        id="publish-form"
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
      </form>

      <div data-testid="week-bar" className="fixed inset-x-0 bottom-0 z-40 bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Separator className="absolute inset-x-0 top-0" />
        <div className="mx-auto flex max-w-4xl flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-3 text-sm">
            <span className="font-medium" data-testid="week-status">
              {published ? 'Julkaistu' : stored ? 'Ei julkaistu' : 'Ei tallennettu'}
            </span>
            {saveState?.ok && !dirty && <span data-testid="week-saved">Tallennettu</span>}
            {dirty && stored && <span data-testid="week-dirty">Tallenna muutokset ennen julkaisua</span>}
          </div>
          {error && (
            <p className="text-sm text-destructive" data-testid="week-error">
              {error.error}
            </p>
          )}
          <div className="flex gap-3">
            <Button type="submit" form="week-form" className="h-12 flex-1 text-base" disabled={saving} data-testid="week-save">
              Tallenna
            </Button>
            <Button
              type="submit"
              form="publish-form"
              variant="outline"
              className="h-12 flex-1 text-base"
              disabled={publishing || !stored || dirty}
              data-testid="week-publish"
            >
              {published ? 'Piilota' : 'Julkaise'}
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent side="bottom" showCloseButton={false} className="max-h-[92dvh] rounded-t-xl">
          {editing !== null && (
            <>
              <SheetHeader>
                <SheetTitle>{DAY_NAMES[editing]}</SheetTitle>
                <SheetDescription>Muutokset tallennetaan vasta kun painat Tallenna.</SheetDescription>
              </SheetHeader>
              <DayEditor
                index={editing}
                state={days[editing]}
                dishes={dishes}
                categories={categories}
                onChange={(next) => updateDay(editing, next)}
              />
              <SheetFooter className="pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button type="button" className="h-12 text-base" onClick={() => setEditing(null)} data-testid="day-done">
                  Valmis
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
