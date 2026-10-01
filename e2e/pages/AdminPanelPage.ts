import { Page, expect } from '@playwright/test';

export class AdminPanelPage {
  private nav = this.page.getByTestId('admin-nav');
  private logoutButton = this.page.getByTestId('admin-logout');

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/lunch');
  }

  async logout() {
    await this.logoutButton.click();
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/admin\/lunch$/);
    await expect(this.nav).toBeVisible();
    await expect(this.logoutButton).toHaveText('Kirjaudu ulos');
  }
}
