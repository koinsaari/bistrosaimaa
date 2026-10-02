import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

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

  for (const path of ['/admin', '/admin/lunch', '/admin/dishes']) {
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

  // Everything below reads or writes the throttle and session-version tables.
  test.describe('with a database', () => {
    test.skip(!process.env.DATABASE_URL, 'no DB');

    test('correct password opens the admin panel', async ({ page }) => {
      const login = new AdminLoginPage(page);
      await login.goto();
      await login.loginAsAdmin();
      await new AdminPanelPage(page).expectLoaded();
    });

    test('a signed-in admin visiting the login page is sent to the panel', async ({ page }) => {
      const login = new AdminLoginPage(page);
      await login.goto();
      await login.loginAsAdmin();
      await new AdminPanelPage(page).expectLoaded();

      await login.goto();
      await new AdminPanelPage(page).expectLoaded();
    });


    test('blocks after 5 wrong passwords, even for the correct one', async ({ page }) => {
      const login = new AdminLoginPage(page);
      await login.goto();
      for (let i = 0; i < 5; i++) {
        await login.login(`wrong-${i}`);
        await login.expectWrongPasswordError();
      }
      await login.login('wrong-again');
      await login.expectThrottledError();
      await login.loginAsAdmin();
      await login.expectThrottledError();
    });
  });
});
