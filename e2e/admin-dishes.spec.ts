import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { AdminDishesPage } from './pages/AdminDishesPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

test.describe('Admin dishes', () => {
  test.skip(!process.env.DATABASE_URL, 'no DB');

  let admin: AdminDishesPage;
  // Unique per test so parallel runs and reruns never collide on the unique name.
  const uniqueName = () => `e2e-ruoka-${randomUUID().slice(0, 8)}`;

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': randomUUID() });
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
    admin = new AdminDishesPage(page);
    await admin.goto();
    await admin.expectLoaded();
  });

  test('creates, edits, duplicates, retires and restores a dish', async () => {
    const name = uniqueName();
    const renamed = `${name}-b`;
    const category = `e2e-kat-${randomUUID().slice(0, 8)}`;
    await admin.addCategory(category, '900');
    await admin.expectCategory(category, '900');

    await admin.searchDishes(name);
    await admin.addDish({ name, description: 'kuvaus', category, allergens: ['G', 'L'] });
    await admin.expectDishFormClosed();
    await admin.expectDish(name, { category, allergens: 'G, L', retired: false });

    await admin.openEditDish(name);
    await admin.fillDish({ name: renamed, allergens: ['VL'] });
    await admin.saveDish();
    await admin.expectDishFormClosed();
    await admin.searchDishes(renamed);
    await admin.expectDish(renamed, { allergens: 'G, L, VL' });
    await admin.expectNoDish(name);

    await admin.duplicateDish(renamed);
    await admin.expectDish(`${renamed} (kopio)`, { category, allergens: 'G, L, VL', retired: false });

    await admin.toggleDishActive(renamed);
    await admin.expectNoDish(renamed);
    await admin.filterStatus('Poistettu käytöstä');
    await admin.expectDish(renamed, { retired: true });

    await admin.toggleDishActive(renamed);
    await admin.expectNoDish(renamed);
    await admin.filterStatus('Käytössä');
    await admin.expectDish(renamed, { retired: false });

    await admin.deleteCategory(category);
    await admin.expectNoCategory(category);
  });

  test('a duplicate name is rejected case-insensitively and the form keeps the typed input', async () => {
    const name = uniqueName();
    await admin.searchDishes(name);
    await admin.addDish({ name });
    await admin.expectDishFormClosed();
    await admin.expectDish(name);

    await admin.addDish({ name: name.toUpperCase() });
    await admin.expectDishError('Samanniminen ruoka on jo olemassa', name.toUpperCase());
  });

  test('an empty name is rejected and the picked category is kept', async () => {
    const category = `e2e-kat-${randomUUID().slice(0, 8)}`;
    await admin.addCategory(category, '900');
    await admin.expectCategory(category, '900');

    await admin.addDish({ name: '  ', category });
    await admin.expectDishError('Nimi vaaditaan', '  ');
    await admin.expectDishFormCategory(category);

    await admin.closeDishForm();
    await admin.deleteCategory(category);
    await admin.expectNoCategory(category);
  });

  test('deleting a category leaves its dishes uncategorized', async () => {
    const name = uniqueName();
    const category = `e2e-kat-${randomUUID().slice(0, 8)}`;
    await admin.addCategory(category, '900');
    await admin.expectCategory(category, '900');
    await admin.searchDishes(name);
    await admin.addDish({ name, category });
    await admin.expectDish(name, { category });

    await admin.deleteCategory(category);
    await admin.expectNoCategory(category);
    await admin.expectDish(name, { category: '' });
  });

  test('editing to a name another dish has is rejected and the form keeps the typed name', async () => {
    const first = uniqueName();
    const second = uniqueName();
    await admin.searchDishes('e2e-ruoka-');
    await admin.addDish({ name: first });
    await admin.expectDishFormClosed();
    await admin.addDish({ name: second });
    await admin.expectDishFormClosed();
    await admin.expectDish(second);

    await admin.openEditDish(second);
    await admin.fillDish({ name: first });
    await admin.saveDish();
    await admin.expectDishError('Samanniminen ruoka on jo olemassa', first);
  });

  test('copying a dish twice numbers the second copy', async () => {
    const name = uniqueName();
    await admin.searchDishes(name);
    await admin.addDish({ name });
    await admin.expectDishFormClosed();

    await admin.duplicateDish(name);
    await admin.expectDish(`${name} (kopio)`);
    await admin.duplicateDish(name);
    await admin.expectDish(`${name} (kopio 2)`);
  });

  test('editing can clear the category and untick an allergen', async () => {
    const name = uniqueName();
    const category = `e2e-kat-${randomUUID().slice(0, 8)}`;
    await admin.addCategory(category, '900');
    await admin.expectCategory(category, '900');
    await admin.searchDishes(name);
    await admin.addDish({ name, category, allergens: ['G', 'L'] });
    await admin.expectDishFormClosed();
    await admin.expectDish(name, { category, allergens: 'G, L' });

    await admin.openEditDish(name);
    await admin.fillDish({ category: 'Ei kategoriaa', allergens: ['G'] });
    await admin.saveDish();
    await admin.expectDishFormClosed();
    await admin.expectDish(name, { category: '', allergens: 'L' });

    await admin.deleteCategory(category);
    await admin.expectNoCategory(category);
  });

  test('search and category filter narrow the list', async () => {
    const token = `e2e-ruoka-${randomUUID().slice(0, 8)}`;
    const inCategory = `${token}-a`;
    const outside = `${token}-b`;
    const category = `e2e-kat-${randomUUID().slice(0, 8)}`;
    await admin.addCategory(category, '900');
    await admin.expectCategory(category, '900');
    await admin.searchDishes(token);
    await admin.addDish({ name: inCategory, category });
    await admin.expectDishFormClosed();
    await admin.addDish({ name: outside });
    await admin.expectDishFormClosed();
    await admin.expectDish(inCategory);
    await admin.expectDish(outside);

    await admin.searchDishes(`${token}-a`);
    await admin.expectDish(inCategory);
    await admin.expectNoDish(outside);

    await admin.searchDishes(token);
    await admin.filterCategory(category);
    await admin.expectDish(inCategory);
    await admin.expectNoDish(outside);

    await admin.filterCategory('Ei kategoriaa');
    await admin.expectDish(outside);
    await admin.expectNoDish(inCategory);

    await admin.deleteCategory(category);
    await admin.expectNoCategory(category);
  });
});
