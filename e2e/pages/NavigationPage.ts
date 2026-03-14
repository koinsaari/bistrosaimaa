import { Page, expect } from '@playwright/test';

export class NavigationPage {
  constructor(private page: Page) {}

  async clickLogo() {
    await this.page.locator('nav a[href="/"]').click();
  }

  async clickMenu() {
    await this.page.locator('nav .hidden.md\\:flex a[href="/menu"]').click();
  }

  async clickGallery() {
    await this.page.locator('nav .hidden.md\\:flex a[href="/gallery"]').click();
  }

  async clickContact() {
    await this.page.locator('nav .hidden.md\\:flex a[href="/contact"]').click();
  }

  async expectLinksVisible() {
    const nav = this.page.locator('nav .hidden.md\\:flex');
    await expect(nav.locator('a[href="/menu"]')).toBeVisible();
    await expect(nav.locator('a[href="/gallery"]')).toBeVisible();
    await expect(nav.locator('a[href="/contact"]')).toBeVisible();
  }
}
