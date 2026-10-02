import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminLunchPage } from './pages/AdminLunchPage';
import { LunchSectionPage } from './pages/LunchSectionPage';
import { CURRENT_WEEK } from './fixtures/lunch';

const TUESDAY = 2;

// These edit the shared current week that the public lunch specs read, so they run alone (see playwright.config.ts)
// and put the week back the way they found it.
test.describe('Admin lunch on the public site', () => {
  test.skip(!process.env.DATABASE_URL, 'no DB');
  test.describe.configure({ mode: 'serial' });

  let lunch: AdminLunchPage;
  let site: LunchSectionPage;

  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': randomUUID() });
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
    lunch = new AdminLunchPage(page);
    site = new LunchSectionPage(page);
    await lunch.goto();
  });

  test('a saved note shows on the FI and EN pages, and the updated date moves to today', async () => {
    const note = `E2E uusi huomautus ${randomUUID().slice(0, 8)}`;
    await lunch.setNote(TUESDAY, note);
    await lunch.save();
    await lunch.expectSaved();

    try {
      await site.goto('/');
      await site.expectNote('tuesday', note);
      await site.expectUpdatedToday();
      // Friday still has a retired dish: saving must not reject a dish the week already used.
      await site.expectDayDishes('friday', CURRENT_WEEK.friday!.dishes);

      // Dish and note text is Finnish-only content, shown as-is under English headings.
      await site.goto('/en');
      await site.expectNote('tuesday', note);
      await site.expectDayDishes('monday', CURRENT_WEEK.monday!.dishes);
    } finally {
      await lunch.goto();
      await lunch.setNote(TUESDAY, CURRENT_WEEK.tuesday!.note!);
      await lunch.save();
      await lunch.expectSaved();
    }
    await site.goto('/');
    await site.expectNote('tuesday', CURRENT_WEEK.tuesday!.note!);
  });

  test('hiding the week shows the fallback and publishing brings it back', async () => {
    await lunch.expectStatus('Julkaistu');
    await lunch.publish();
    await lunch.expectStatus('Ei julkaistu');

    try {
      await site.goto('/');
      await site.expectFallback();
    } finally {
      await lunch.goto();
      await lunch.publish();
      await lunch.expectStatus('Julkaistu');
    }
    await site.goto('/');
    await site.expectDayDishes('monday', CURRENT_WEEK.monday!.dishes);
  });
});
