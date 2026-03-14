import { Page, expect } from '@playwright/test';

export class NotFoundPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/this-does-not-exist');
  }

  async expect404Visible() {
    await expect(this.page.locator('[data-testid="not-found-heading"]')).toBeVisible();
  }

  async clickBackToHome() {
    await this.page.locator('[data-testid="not-found-back-home"]').click();
  }
}
