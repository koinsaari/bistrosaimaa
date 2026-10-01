import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';

test.describe('Admin auth', () => {
  // Own client ID per test so failed logins never share a throttle bucket across tests, projects or reruns.
  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': randomUUID() });
  });

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

  test.describe('login throttle', () => {
    test.skip(
      !process.env.DATABASE_URL || !process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET,
      'needs DB, ADMIN_PASSWORD and SESSION_SECRET',
    );

    test('blocks after 5 wrong passwords, even for the correct one', async ({ page }) => {
      const login = new AdminLoginPage(page);
      await login.goto();
      for (let i = 0; i < 5; i++) {
        await login.login(`wrong-${i}`);
        await login.expectWrongPasswordError();
      }
      await login.login('wrong-again');
      await login.expectThrottledError();
      await login.login(process.env.ADMIN_PASSWORD!);
      await login.expectThrottledError();
    });
  });
});
