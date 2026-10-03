import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Local runs hit the Neon ci branch (fixture data), not .env.local's dev branch. CI sets DATABASE_URL itself.
if (!process.env.DATABASE_URL && existsSync('.env.e2e')) {
  process.loadEnvFile('.env.e2e');
}

// Throwaway credentials for the E2E server only. They override the shell and .env.local, so tests never use real ones.
process.env.ADMIN_PASSWORD = 'e2e-admin-password';
process.env.SESSION_SECRET = 'e2e-session-secret';

// Own port so a running `npm run dev` (dev DB) is never reused.
const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  timeout: 30_000,

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [
        '**/navigation-mobile.spec.ts',
        '**/admin-lunch-mobile.spec.ts',
        '**/admin-session.spec.ts',
        '**/admin-lunch-public.spec.ts',
      ],
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
      testIgnore: ['**/navigation.spec.ts', '**/admin-session.spec.ts', '**/admin-lunch-public.spec.ts'],
    },
    {
      // Edits the shared current week the public lunch specs read, so it runs alone after the parallel projects.
      name: 'admin-public',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/admin-lunch-public.spec.ts',
      dependencies: ['desktop', 'mobile'],
      fullyParallel: false,
    },
    {
      // Logout ends every admin session, so it runs alone after the parallel projects rather than kicking their logins.
      name: 'admin-session',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/admin-session.spec.ts',
      dependencies: ['desktop', 'mobile', 'admin-public'],
      fullyParallel: false,
    },
  ],

  webServer: {
    command: `${process.env.CI ? 'npm run start' : 'npm run dev'} -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
