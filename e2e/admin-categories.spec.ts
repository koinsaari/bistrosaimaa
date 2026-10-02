import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { AdminDishesPage } from './pages/AdminDishesPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

test.describe('Admin categories', () => {
  test.skip(!process.env.DATABASE_URL, 'no DB');

  let dishes: AdminDishesPage;
  // Unique per test so parallel runs and reruns never collide on the unique name.
  const uniqueName = () => `e2e-${randomUUID().slice(0, 8)}`;

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': randomUUID() });
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
    dishes = new AdminDishesPage(page);
    await dishes.goto();
    await dishes.expectLoaded();
  });

  test('adds, edits and deletes a category', async () => {
    const name = uniqueName();
    const renamed = `${name}-b`;

    await dishes.addCategory(name, '900');
    await dishes.expectCategory(name, '900');

    await dishes.editCategory(name, { name: renamed, sortOrder: '901' });
    await dishes.expectCategory(renamed, '901');
    await dishes.expectNoCategory(name);

    await dishes.deleteCategory(renamed);
    await dishes.expectNoCategory(renamed);
  });

  test('cancelling the delete confirmation keeps the category', async () => {
    const name = uniqueName();
    await dishes.addCategory(name, '900');
    await dishes.expectCategory(name, '900');

    await dishes.cancelCategoryDelete(name);
    await dishes.expectCategory(name, '900');

    await dishes.deleteCategory(name);
    await dishes.expectNoCategory(name);
  });

  test('a duplicate name is rejected and the typed name is kept', async () => {
    const name = uniqueName();
    await dishes.addCategory(name, '900');
    await dishes.expectCategory(name, '900');

    await dishes.addCategory(name, '901');
    await dishes.expectAddError('Samanniminen kategoria on jo olemassa', name);

    await dishes.deleteCategory(name);
    await dishes.expectNoCategory(name);
  });

  test('an invalid sort order is rejected', async () => {
    const name = uniqueName();
    await dishes.addCategory(name, 'abc');
    await dishes.expectAddError('Järjestysnumero on kokonaisluku 0–9999', name);
  });

  test('renaming to an existing name shows an error on that row', async () => {
    const first = uniqueName();
    const second = uniqueName();
    await dishes.addCategory(first, '900');
    await dishes.expectCategory(first, '900');
    await dishes.addCategory(second, '901');
    await dishes.expectCategory(second, '901');

    await dishes.editCategory(second, { name: first, sortOrder: '901' });
    await dishes.expectRowError(second, 'Samanniminen kategoria on jo olemassa');

    await dishes.deleteCategory(first);
    await dishes.deleteCategory(second);
    await dishes.expectNoCategory(first);
  });
});
