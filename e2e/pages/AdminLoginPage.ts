import { Page, expect } from '@playwright/test';

export class AdminLoginPage {
  private passwordInput = this.page.getByTestId('admin-password');
  private submitButton = this.page.getByTestId('admin-login-submit');
  private error = this.page.getByTestId('admin-login-error');

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/admin/login');
  }

  async gotoPath(path: string) {
    await this.page.goto(path);
  }

  async login(password: string) {
    await this.passwordInput.fill(password);
    const actionResponse = this.page.waitForResponse(
      (r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/admin/login',
    );
    await this.submitButton.click();
    await actionResponse;
  }

  async loginAsAdmin() {
    await this.login(process.env.ADMIN_PASSWORD!);
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/admin\/login$/);
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toHaveText('Kirjaudu');
  }

  async expectThrottledError() {
    await expect(this.error).toContainText('Liian monta yritystä');
    await expect(this.passwordInput).toHaveValue('');
    await expect(this.page).toHaveURL(/\/admin\/login$/);
  }

  async expectWrongPasswordError() {
    await expect(this.error).toHaveText('Väärä salasana.');
    await expect(this.passwordInput).toHaveValue('');
    await expect(this.page).toHaveURL(/\/admin\/login$/);
  }
}
