import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminLunchPage } from './pages/AdminLunchPage';
import { FIXTURE_DISHES } from './fixtures/lunch';

const MONDAY = 1;

test.describe('Admin lunch composer on a phone', () => {
  test.skip(!process.env.DATABASE_URL, 'no DB');

  let lunch: AdminLunchPage;

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': randomUUID() });
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
    lunch = new AdminLunchPage(page);
    await lunch.openEmptyWeek();
  });

  test('the week fits the screen width and the last day is not hidden under the save bar', async () => {
    await lunch.expectNoHorizontalScroll();
    await lunch.expectLastDayClearOfSaveBar();
    await lunch.expectSaveBarTouchTargets();
  });

  test('a day with many dishes still fits the sheet, with Valmis in reach and big touch targets', async () => {
    for (const dish of FIXTURE_DISHES) await lunch.addDish(MONDAY, dish);
    await lunch.expectDaySheetFits(MONDAY);
  });
});
