'use client';

import { startTransition, useActionState, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { ALLERGENS } from '@/lib/allergens';
import { filterDishes, type DishStatusFilter } from '@/lib/dishFilter';
import {
  createDishAction,
  duplicateDishAction,
  setDishActiveAction,
  updateDishAction,
  type DishFormState,
} from './dish-actions';

type Category = { id: string; name: string };
type Dish = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  allergens: string[];
  isActive: boolean;
};

function DishForm({
  dish,
  categories,
  action,
  onDone,
}: {
  dish?: Dish;
  categories: Category[];
  action: (prev: DishFormState, formData: FormData) => Promise<DishFormState>;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(async (prev: DishFormState, formData: FormData) => {
    const next = await action(prev, formData);
    if (next?.ok) onDone();
    return next;
  }, null);
  const values = state && !state.ok ? state.values : null;
  const initial = {
    name: values?.name ?? dish?.name ?? '',
    description: values?.description ?? dish?.description ?? '',
    categoryId: values?.categoryId ?? dish?.categoryId ?? 'none',
    allergens: values?.allergens ?? dish?.allergens ?? [],
    isActive: values?.isActive ?? dish?.isActive ?? true,
  };

  return (
    // Not `action={formAction}`: React would reset the form after a failed save, and Radix Select
    // restores its mount value on reset, dropping what the user picked.
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="flex flex-col gap-4"
      data-testid="dish-form"
    >
      {dish && <input type="hidden" name="id" value={dish.id} />}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dish-name">Nimi</Label>
        <Input id="dish-name" name="name" defaultValue={initial.name} data-testid="dish-name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dish-description">Kuvaus</Label>
        <Textarea id="dish-description" name="description" defaultValue={initial.description} data-testid="dish-description" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dish-category">Kategoria</Label>
        <Select name="categoryId" defaultValue={initial.categoryId}>
          <SelectTrigger id="dish-category" data-testid="dish-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Ei kategoriaa</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <fieldset className="flex flex-wrap gap-4">
        <legend className="mb-1.5 text-sm font-medium">Allergeenit</legend>
        {ALLERGENS.map((allergen) => (
          <div key={allergen} className="flex items-center gap-2">
            <Checkbox
              id={`allergen-${allergen}`}
              name="allergens"
              value={allergen}
              defaultChecked={initial.allergens.includes(allergen)}
              data-testid={`dish-allergen-${allergen}`}
            />
            <Label htmlFor={`allergen-${allergen}`}>{allergen}</Label>
          </div>
        ))}
      </fieldset>
      <div className="flex items-center gap-2">
        <Checkbox id="dish-active" name="isActive" defaultChecked={initial.isActive} data-testid="dish-active" />
        <Label htmlFor="dish-active">Käytössä</Label>
      </div>
      {state && !state.ok && (
        <p className="text-sm text-destructive" data-testid="dish-error">
          {state.error}
        </p>
      )}
      <DialogFooter>
        <Button type="submit" disabled={pending} data-testid="dish-save">
          Tallenna
        </Button>
      </DialogFooter>
    </form>
  );
}

function DishDialog({
  dish,
  categories,
  trigger,
  title,
}: {
  dish?: Dish;
  categories: Category[];
  trigger: React.ReactNode;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DishForm
          dish={dish}
          categories={categories}
          action={dish ? updateDishAction : createDishAction}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function IdForm({
  id,
  action,
  isActive,
  children,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {isActive !== undefined && <input type="hidden" name="isActive" value={String(isActive)} />}
      {children}
    </form>
  );
}

export default function DishesSection({ dishes, categories }: { dishes: Dish[]; categories: Category[] }) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [status, setStatus] = useState<DishStatusFilter>('active');
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const visible = filterDishes(dishes, { query, categoryId, status });

  return (
    <section className="flex flex-col gap-4">
      <div>
        <DishDialog
          categories={categories}
          title="Uusi ruoka"
          trigger={<Button data-testid="dish-add">Lisää ruoka</Button>}
        />
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dish-search">Haku</Label>
          <Input id="dish-search" value={query} onChange={(e) => setQuery(e.target.value)} data-testid="dish-search" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dish-filter-category">Kategoria</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="dish-filter-category" data-testid="dish-filter-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Kaikki</SelectItem>
              <SelectItem value="none">Ei kategoriaa</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dish-filter-status">Tila</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as DishStatusFilter)}>
            <SelectTrigger id="dish-filter-status" data-testid="dish-filter-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Käytössä</SelectItem>
              <SelectItem value="retired">Poistettu käytöstä</SelectItem>
              <SelectItem value="all">Kaikki</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nimi</TableHead>
            <TableHead>Kategoria</TableHead>
            <TableHead>Allergeenit</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((dish) => (
            <TableRow key={dish.id} data-testid="dish-row" data-dish={dish.name}>
              <TableCell>
                {dish.name}
                {!dish.isActive && (
                  <Badge variant="secondary" className="ml-2">
                    Poistettu käytöstä
                  </Badge>
                )}
              </TableCell>
              <TableCell>{dish.categoryId ? (categoryName.get(dish.categoryId) ?? '') : ''}</TableCell>
              <TableCell>{dish.allergens.join(', ')}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <DishDialog
                    dish={dish}
                    categories={categories}
                    title="Muokkaa ruokaa"
                    trigger={
                      <Button variant="outline" size="sm" data-testid="dish-edit">
                        Muokkaa
                      </Button>
                    }
                  />
                  <IdForm id={dish.id} action={duplicateDishAction}>
                    <Button type="submit" variant="outline" size="sm" data-testid="dish-duplicate">
                      Kopioi
                    </Button>
                  </IdForm>
                  <IdForm id={dish.id} action={setDishActiveAction} isActive={!dish.isActive}>
                    <Button type="submit" variant="outline" size="sm" data-testid="dish-toggle-active">
                      {dish.isActive ? 'Poista käytöstä' : 'Palauta'}
                    </Button>
                  </IdForm>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
