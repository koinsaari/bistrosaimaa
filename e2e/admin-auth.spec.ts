import { test } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';

test.describe('Admin auth', () => {
  test('login page renders the Finnish form', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.expectOnLoginPage();
  });

  for (const path of ['/admin', '/admin/lunch']) {
    test(`unauthenticated ${path} redirects to login`, async ({ page }) => {
      const login = new AdminLoginPage(page);
      await login.gotoPath(path);
      await login.expectOnLoginPage();
    });
  }

  test('wrong password shows an error and stays on login', async ({ page }) => {
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.login('definitely-not-the-password');
    await login.expectWrongPasswordError();
  });
});
