import { Page, expect } from '@playwright/test';

export class NotFoundPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/this-does-not-exist');
  }

  async expect404Visible() {
    await expect(this.page.getByRole('heading', { name: '404', exact: true })).toBeVisible();
  }

  async clickBackToHome() {
    await this.page.getByRole('link').filter({ hasText: /etusivu|home/i }).click();
  }
}
