import { Page, expect } from '@playwright/test';

export class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact');
  }

  async expectTitleVisible() {
    await expect(this.page.locator('#contact-hero h1')).toBeVisible();
  }

  async expectContactInfoVisible() {
    await expect(this.page.getByText('Brahentie 42')).toBeVisible();
    await expect(this.page.locator('[data-testid="contact-phone"]')).toBeVisible();
    await expect(this.page.locator('[data-testid="contact-email"]')).toBeVisible();
  }

  async expectMapsLinkVisible() {
    await expect(this.page.locator('[data-testid="contact-maps-link"]')).toBeVisible();
  }

  async expectFacebookLinkVisible() {
    await expect(this.page.locator('[data-testid="contact-facebook"]')).toBeVisible();
  }

  async expectFormVisible() {
    await expect(this.page.locator('form')).toBeVisible();
  }
}
