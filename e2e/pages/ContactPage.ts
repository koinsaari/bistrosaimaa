import { Page, expect } from '@playwright/test';

export class ContactPage {
  private main = this.page.getByRole('main');

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact');
  }

  async expectTitleVisible() {
    await expect(this.page.locator('#contact-hero h1')).toBeVisible();
  }

  async expectContactInfoVisible() {
    await expect(this.main.getByText('Brahentie 42')).toBeVisible();
    await expect(this.main.locator('a[href="tel:+358504499322"]')).toBeVisible();
    await expect(this.main.locator('a[href="mailto:bistrosaimaa@gmail.com"]')).toBeVisible();
  }

  async expectMapsLinkVisible() {
    await expect(this.main.locator('a[href*="maps.google.com"]').first()).toBeVisible();
  }

  async expectFacebookLinkVisible() {
    await expect(this.main.locator('a[href*="facebook.com/bistrosaimaaoy"]')).toBeVisible();
  }

  async expectFormVisible() {
    await expect(this.page.locator('form')).toBeVisible();
  }
}
