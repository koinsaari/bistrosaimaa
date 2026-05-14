import { test, expect } from '@playwright/test';

test.describe('i18n URL routing', () => {
  test('FI homepage at / has html lang="fi"', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fi');
  });

  test('EN homepage at /en has html lang="en"', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('/fi/menu redirects to /menu (as-needed prefix strips default locale)', async ({ page }) => {
    await page.goto('/fi/menu');
    await expect(page).toHaveURL('/menu');
  });

  test('FI menu page has html lang="fi" and Finnish title', async ({ page }) => {
    await page.goto('/menu');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fi');
    await expect(page).toHaveTitle(/Bistro Saimaa/);
  });

  test('EN menu page has html lang="en"', async ({ page }) => {
    await page.goto('/en/menu');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('hreflang alternates are present on FI homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="alternate"][hreflang="fi"]')).toHaveAttribute(
      'href',
      'https://bistrosaimaa.fi',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      'https://bistrosaimaa.fi/en',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://bistrosaimaa.fi',
    );
  });

  test('hreflang alternates are present on EN menu', async ({ page }) => {
    await page.goto('/en/menu');
    await expect(page.locator('link[rel="alternate"][hreflang="fi"]')).toHaveAttribute(
      'href',
      'https://bistrosaimaa.fi/menu',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      'https://bistrosaimaa.fi/en/menu',
    );
  });

  test('sitemap includes both FI and EN URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<loc>https://bistrosaimaa.fi/menu</loc>');
    expect(body).toContain('<loc>https://bistrosaimaa.fi/en/menu</loc>');
    expect(body).toContain('hreflang="fi"');
    expect(body).toContain('hreflang="en"');
    expect(body).toContain('hreflang="x-default"');
  });

  test('FI 404 page has Finnish lang and 404 heading', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fi');
    await expect(page.locator('[data-testid="not-found-heading"]')).toBeVisible();
  });

  test('EN 404 page has English lang and 404 heading', async ({ page }) => {
    await page.goto('/en/this-does-not-exist');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-testid="not-found-heading"]')).toBeVisible();
  });

  test('switching FI -> EN on /menu navigates to /en/menu', async ({ page, isMobile }) => {
    await page.goto('/menu');
    if (isMobile) {
      await page.locator('[data-testid="nav-mobile-toggle"]').click();
    }
    await page.getByRole('button', { name: 'EN', exact: true }).first().click();
    await expect(page).toHaveURL('/en/menu');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('switching EN -> FI on /en/gallery navigates to /gallery', async ({ page, isMobile }) => {
    await page.goto('/en/gallery');
    if (isMobile) {
      await page.locator('[data-testid="nav-mobile-toggle"]').click();
    }
    await page.getByRole('button', { name: 'FI', exact: true }).first().click();
    await expect(page).toHaveURL('/gallery');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fi');
  });

  test('internal navbar links from EN home stay in EN locale', async ({ page }) => {
    await page.goto('/en');
    const menuLink = page.locator('[data-testid="nav-link-menu"]').first();
    // Desktop links use data-testid; on mobile they are inside the mobile menu.
    if (await menuLink.isVisible().catch(() => false)) {
      await expect(menuLink).toHaveAttribute('href', '/en/menu');
    } else {
      // Mobile: open the menu and check the mobile link.
      await page.locator('[data-testid="nav-mobile-toggle"]').click();
      await expect(page.locator('[data-testid="nav-mobile-link-menu"]')).toHaveAttribute(
        'href',
        '/en/menu',
      );
    }
  });
});
