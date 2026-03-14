import { Page, expect } from '@playwright/test';

export class MobileNavigationPage {
  private toggle = this.page.locator('[data-testid="nav-mobile-toggle"]');
  private mobileMenu = this.page.locator('[data-testid="nav-mobile-menu"]');

  constructor(private page: Page) {}

  async openMenu() {
    await this.toggle.click();
    await expect(this.mobileMenu).toBeVisible();
  }

  async clickMenu() {
    await this.openMenu();
    await this.mobileMenu.locator('[data-testid="nav-mobile-link-menu"]').click();
  }

  async clickGallery() {
    await this.openMenu();
    await this.mobileMenu.locator('[data-testid="nav-mobile-link-gallery"]').click();
  }

  async clickContact() {
    await this.openMenu();
    await this.mobileMenu.locator('[data-testid="nav-mobile-link-contact"]').click();
  }

  async clickLogo() {
    await this.page.locator('[data-testid="nav-logo"]').click();
  }

  async expectMenuClosed() {
    await expect(this.mobileMenu).toBeHidden();
  }

  async expectDesktopNavHidden() {
    await expect(this.page.locator('[data-testid="nav-desktop"]')).toBeHidden();
  }
}
