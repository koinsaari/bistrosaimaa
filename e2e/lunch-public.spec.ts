import { test } from '@playwright/test';
import { LunchSectionPage } from './pages/LunchSectionPage';
import { CURRENT_WEEK } from './fixtures/lunch';

test.describe('Lunch section', () => {
  test.describe('without a published week', () => {
    test.skip(!!process.env.DATABASE_URL, 'seeded DB has a published week');

    test('shows the fallback', async ({ page }) => {
      const lunch = new LunchSectionPage(page);
      await lunch.goto();
      await lunch.expectFallback();
    });
  });

  test.describe('with the seeded current week', () => {
    test.skip(!process.env.DATABASE_URL, 'no DB');

    test('shows dishes in order', async ({ page }) => {
      const lunch = new LunchSectionPage(page);
      await lunch.goto();
      await lunch.expectDayDishes('monday', CURRENT_WEEK.monday!.dishes);
      await lunch.expectNoNote('monday');
    });

    test('shows a note alone and a note below dishes', async ({ page }) => {
      const lunch = new LunchSectionPage(page);
      await lunch.goto();
      await lunch.expectDayDishes('tuesday', []);
      await lunch.expectNote('tuesday', CURRENT_WEEK.tuesday!.note!);
      await lunch.expectDayDishes('wednesday', CURRENT_WEEK.wednesday!.dishes);
      await lunch.expectNote('wednesday', CURRENT_WEEK.wednesday!.note!);
    });

    test('shows the placeholder for a day with nothing on it', async ({ page }) => {
      const lunch = new LunchSectionPage(page);
      await lunch.goto();
      await lunch.expectPlaceholder('thursday');
    });

    test('English shows the same Finnish dishes', async ({ page }) => {
      const lunch = new LunchSectionPage(page);
      await lunch.goto('/en');
      await lunch.expectDayDishes('monday', CURRENT_WEEK.monday!.dishes);
    });
  });
});
