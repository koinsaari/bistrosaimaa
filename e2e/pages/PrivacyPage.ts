import { Page, expect } from '@playwright/test';

export class PrivacyPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/privacy');
  }

  async expectTitleVisible() {
    await expect(this.page.getByRole('heading', { level: 1 })).toBeVisible();
  }

  async expectAllSectionsVisible() {
    for (let i = 1; i <= 7; i++) {
      await expect(this.page.locator(`[data-testid="privacy-section-${i}"]`)).toBeVisible();
    }
  }

  async expectContactEmailVisible() {
    await expect(this.page.getByText('bistrosaimaa@gmail.com').first()).toBeVisible();
  }
}
