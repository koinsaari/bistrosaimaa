import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { AdminDishesPage } from './pages/AdminDishesPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminLunchPage } from './pages/AdminLunchPage';
import { FIXTURE_DISHES, NEXT_WEEK, RETIRED_DISH } from './fixtures/lunch';
import { addWeeks, currentIsoWeek, formatWeekLabel } from '../src/lib/isoWeek';

const [LOHIKEITTO, JAUHELIHA, KASVISPATA] = FIXTURE_DISHES;
const MONDAY = 1;
const WEDNESDAY = 3;

test.describe('Admin lunch composer', () => {
  test.skip(!process.env.DATABASE_URL, 'no DB');

  let lunch: AdminLunchPage;
  const emptyWeek = () => lunch.openEmptyWeek();

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': randomUUID() });
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
    lunch = new AdminLunchPage(page);
  });

  test('composes a week, reorders and removes dishes, and keeps it after a reload', async () => {
    const week = await emptyWeek();

    await lunch.addDish(MONDAY, LOHIKEITTO);
    await lunch.addDish(MONDAY, JAUHELIHA);
    await lunch.addDish(MONDAY, KASVISPATA);
    await lunch.moveDishUp(MONDAY, KASVISPATA);
    await lunch.moveDishUp(MONDAY, KASVISPATA);
    await lunch.removeDish(MONDAY, JAUHELIHA);
    await lunch.setNote(MONDAY, 'E2E sisältää pähkinää');
    await lunch.addDish(WEDNESDAY, JAUHELIHA);
    await lunch.expectDayDishes(MONDAY, [KASVISPATA, LOHIKEITTO]);
    await lunch.save();
    await lunch.expectSaved();

    await lunch.goto(week);
    await lunch.expectDayDishes(MONDAY, [KASVISPATA, LOHIKEITTO]);
    await lunch.expectNote(MONDAY, 'E2E sisältää pähkinää');
    await lunch.expectDayDishes(WEDNESDAY, [JAUHELIHA]);
  });

  test('the picker offers only active dishes that are not already on the day', async () => {
    await emptyWeek();
    await lunch.expectPickerOffers(MONDAY, LOHIKEITTO, true);
    await lunch.expectPickerOffers(MONDAY, RETIRED_DISH, false);

    await lunch.addDish(MONDAY, LOHIKEITTO);
    await lunch.expectPickerOffers(MONDAY, LOHIKEITTO, false);
    await lunch.expectPickerOffers(WEDNESDAY, LOHIKEITTO, true);
  });

  test('a week can only be published after it is saved', async () => {
    await emptyWeek();
    await lunch.expectStatus('Ei tallennettu');
    await lunch.expectPublishButton('Julkaise', false);

    await lunch.addDish(MONDAY, LOHIKEITTO);
    await lunch.save();
    await lunch.expectSaved();
    await lunch.expectStatus('Ei julkaistu');
    await lunch.expectPublishButton('Julkaise', true);

    await lunch.publish();
    await lunch.expectStatus('Julkaistu');
    await lunch.expectPublishButton('Piilota', true);

    await lunch.publish();
    await lunch.expectStatus('Ei julkaistu');
  });

  test('publishing is blocked while there are unsaved edits', async () => {
    await emptyWeek();
    await lunch.addDish(MONDAY, LOHIKEITTO);
    await lunch.save();
    await lunch.expectSaved();
    await lunch.expectPublishButton('Julkaise', true);
    await lunch.expectUnsavedHint(false);

    await lunch.addDish(MONDAY, JAUHELIHA);
    await lunch.expectPublishButton('Julkaise', false);
    await lunch.expectUnsavedHint(true);
    await lunch.expectNotShownAsSaved();

    await lunch.save();
    await lunch.expectPublishButton('Julkaise', true);
    await lunch.expectUnsavedHint(false);
  });

  test('a note saved with surrounding spaces does not leave the week looking unsaved', async () => {
    await emptyWeek();
    await lunch.addDish(MONDAY, LOHIKEITTO);
    await lunch.setNote(MONDAY, ' huomautus ');
    await lunch.save();
    await lunch.expectSaved();
    await lunch.expectUnsavedHint(false);
    await lunch.expectPublishButton('Julkaise', true);
  });

  test('a note that is too long shows an error and keeps what was typed', async () => {
    await emptyWeek();
    const note = 'a'.repeat(301);
    await lunch.addDish(MONDAY, LOHIKEITTO);
    await lunch.setNote(WEDNESDAY, note);
    await lunch.save();

    await lunch.expectError('Huomautus on liian pitkä');
    await lunch.expectDayDishes(MONDAY, [LOHIKEITTO]);
    await lunch.expectNote(WEDNESDAY, note);
  });

  test('a retired dish stays in a week that uses it, but cannot be added again', async ({ page }) => {
    const dishes = new AdminDishesPage(page);
    const dish = `e2e-ruoka-${randomUUID().slice(0, 8)}`;
    await dishes.goto();
    await dishes.searchDishes(dish);
    await dishes.addDish({ name: dish });
    await dishes.expectDishFormClosed();
    await dishes.expectDish(dish);

    const week = await emptyWeek();
    await lunch.addDish(MONDAY, dish);
    await lunch.save();
    await lunch.expectSaved();

    await dishes.goto();
    await dishes.searchDishes(dish);
    await dishes.toggleDishActive(dish);
    await dishes.expectNoDish(dish);

    await lunch.goto(week);
    await lunch.expectDayDishes(MONDAY, [dish]);
    await lunch.expectRetiredBadge(MONDAY, dish);
    await lunch.expectPickerOffers(WEDNESDAY, dish, false);

    await lunch.setNote(MONDAY, 'muokattu');
    await lunch.save();
    await lunch.expectSaved();
    await lunch.goto(week);
    await lunch.expectDayDishes(MONDAY, [dish]);
  });

  test('the week selector loads the chosen week', async () => {
    const next = addWeeks(currentIsoWeek(new Date(), 'Europe/Helsinki'), 1);
    const label = formatWeekLabel(next);
    await lunch.goto();
    await lunch.selectWeek(label);

    await lunch.expectSelectedWeek(label);
    await lunch.expectDayDishes(MONDAY, NEXT_WEEK.monday!.dishes);
    await lunch.expectStatus('Ei julkaistu');
  });
});
