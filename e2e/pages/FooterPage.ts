import { Page, expect } from '@playwright/test';

export class FooterPage {
  private footer = this.page.locator('[data-testid="footer"]');

  constructor(private page: Page) {}

  async expectContentVisible() {
    await expect(this.footer.getByText('Bistro Saimaa', { exact: true })).toBeVisible();
    await expect(this.footer.getByText('Brahentie 42, 52300 Ristiina')).toBeVisible();
    await expect(this.footer.locator('[data-testid="footer-phone"]')).toBeVisible();
    await expect(this.footer.locator('[data-testid="footer-email"]')).toBeVisible();
  }

  async expectPrivacyLinkVisible() {
    await expect(this.footer.locator('[data-testid="footer-privacy-link"]')).toBeVisible();
  }

  async expectFacebookLinkVisible() {
    await expect(this.footer.locator('[data-testid="footer-facebook"]')).toBeVisible();
  }

  async expectCopyrightVisible() {
    await expect(this.footer.locator('[data-testid="footer-copyright"]')).toBeVisible();
  }
}
