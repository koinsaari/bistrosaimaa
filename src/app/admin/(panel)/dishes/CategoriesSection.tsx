'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  type CategoryFormState,
} from './category-actions';

type Category = { id: string; name: string; sortOrder: number };

function errorOf(state: CategoryFormState) {
  return state && !state.ok ? state.error : null;
}

function CategoryRow({ category }: { category: Category }) {
  const [state, formAction, pending] = useActionState(updateCategoryAction, null);
  const values = state && !state.ok ? state.values : null;
  const error = errorOf(state);

  return (
    <li className="flex flex-col gap-1" data-testid="category-row" data-category={category.name}>
      <div className="flex items-end gap-2">
        <form action={formAction} className="flex items-end gap-2">
          <input type="hidden" name="id" value={category.id} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`name-${category.id}`}>Nimi</Label>
            <Input
              id={`name-${category.id}`}
              name="name"
              defaultValue={values?.name ?? category.name}
              data-testid="category-name"
            />
          </div>
          <div className="flex w-24 flex-col gap-1.5">
            <Label htmlFor={`order-${category.id}`}>Järjestys</Label>
            <Input
              id={`order-${category.id}`}
              name="sortOrder"
              inputMode="numeric"
              defaultValue={values?.sortOrder ?? String(category.sortOrder)}
              data-testid="category-order"
            />
          </div>
          <Button type="submit" disabled={pending} data-testid="category-save">
            Tallenna
          </Button>
        </form>
        <form action={deleteCategoryAction}>
          <input type="hidden" name="id" value={category.id} />
          <Button type="submit" variant="outline" data-testid="category-delete">
            Poista
          </Button>
        </form>
      </div>
      {error && (
        <p className="text-sm text-destructive" data-testid="category-error">
          {error}
        </p>
      )}
    </li>
  );
}

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(createCategoryAction, null);
  const values = state && !state.ok ? state.values : null;
  const error = errorOf(state);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Kategoriat</h2>
      <ul className="flex flex-col gap-3">
        {categories.map((category) => (
          <CategoryRow key={`${category.id}-${category.name}-${category.sortOrder}`} category={category} />
        ))}
      </ul>
      <form action={formAction} className="flex items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-category-name">Uusi kategoria</Label>
          <Input id="new-category-name" name="name" defaultValue={values?.name} data-testid="category-new-name" />
        </div>
        <div className="flex w-24 flex-col gap-1.5">
          <Label htmlFor="new-category-order">Järjestys</Label>
          <Input
            id="new-category-order"
            name="sortOrder"
            inputMode="numeric"
            defaultValue={values?.sortOrder ?? '0'}
            data-testid="category-new-order"
          />
        </div>
        <Button type="submit" disabled={pending} data-testid="category-add">
          Lisää
        </Button>
      </form>
      {error && (
        <p className="text-sm text-destructive" data-testid="category-add-error">
          {error}
        </p>
      )}
    </section>
  );
}
