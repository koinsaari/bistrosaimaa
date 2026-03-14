import { test } from '@playwright/test';
import { PrivacyPage } from './pages/PrivacyPage';

test.describe('Privacy Page', () => {
  test('title is visible', async ({ page }) => {
    const privacy = new PrivacyPage(page);
    await privacy.goto();
    await privacy.expectTitleVisible();
  });

  test('all 7 sections are visible', async ({ page }) => {
    const privacy = new PrivacyPage(page);
    await privacy.goto();
    await privacy.expectAllSectionsVisible();
  });

  test('contact email is visible', async ({ page }) => {
    const privacy = new PrivacyPage(page);
    await privacy.goto();
    await privacy.expectContactEmailVisible();
  });
});
