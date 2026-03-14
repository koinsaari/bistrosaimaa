import { Page, expect } from '@playwright/test';

export class NavigationPage {
  private desktopNav = this.page.locator('[data-testid="nav-desktop"]');

  constructor(private page: Page) {}

  async clickLogo() {
    await this.page.locator('[data-testid="nav-logo"]').click();
  }

  async clickMenu() {
    await this.desktopNav.locator('[data-testid="nav-link-menu"]').click();
  }

  async clickGallery() {
    await this.desktopNav.locator('[data-testid="nav-link-gallery"]').click();
  }

  async clickContact() {
    await this.desktopNav.locator('[data-testid="nav-link-contact"]').click();
  }

  async expectLinksVisible() {
    await expect(this.desktopNav.locator('[data-testid="nav-link-menu"]')).toBeVisible();
    await expect(this.desktopNav.locator('[data-testid="nav-link-gallery"]')).toBeVisible();
    await expect(this.desktopNav.locator('[data-testid="nav-link-contact"]')).toBeVisible();
  }
}
