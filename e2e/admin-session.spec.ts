import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

test.skip(!process.env.DATABASE_URL, 'no DB');

test('logging out ends every admin session, not just the current one', async ({ browser, baseURL }) => {
  const signIn = async () => {
    // Own client ID so the login never shares a throttle bucket with another test.
    const context = await browser.newContext({ baseURL, extraHTTPHeaders: { 'x-forwarded-for': randomUUID() } });
    const page = await context.newPage();
    const login = new AdminLoginPage(page);
    await login.goto();
    await login.loginAsAdmin();
    const panel = new AdminPanelPage(page);
    await panel.expectLoaded();
    return { context, page, login, panel };
  };

  const first = await signIn();
  const second = await signIn();

  await first.panel.logout();
  await first.login.expectOnLoginPage();

  await second.panel.goto();
  await second.login.expectOnLoginPage();

  await first.context.close();
  await second.context.close();
});
