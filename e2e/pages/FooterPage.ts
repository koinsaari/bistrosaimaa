import { Page, expect } from '@playwright/test';

export class FooterPage {
  private footer = this.page.locator('footer');

  constructor(private page: Page) {}

  async expectContentVisible() {
    await expect(this.footer.getByText('Bistro Saimaa', { exact: true })).toBeVisible();
    await expect(this.footer.getByText('Brahentie 42, 52300 Ristiina')).toBeVisible();
    await expect(this.footer.locator('a[href="tel:+358504499322"]')).toBeVisible();
    await expect(this.footer.locator('a[href="mailto:bistrosaimaa@gmail.com"]')).toBeVisible();
  }

  async expectPrivacyLinkVisible() {
    await expect(this.footer.locator('a[href="/privacy"]')).toBeVisible();
  }

  async expectFacebookLinkVisible() {
    await expect(this.footer.locator('a[href="https://www.facebook.com/bistrosaimaaoy"]')).toBeVisible();
  }

  async expectCopyrightVisible() {
    await expect(this.footer.getByText('Bistro Saimaa Oy')).toBeVisible();
  }
}
