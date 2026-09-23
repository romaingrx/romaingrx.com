import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  use: { trace: 'retain-on-failure' },
  webServer: [
    {
      command: 'pnpm exec wrangler dev --ip 127.0.0.1 --port 4322',
      url: 'http://127.0.0.1:4322',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'pnpm start --host 127.0.0.1 --port 4321 --strictPort',
      url: 'http://127.0.0.1:4321/design',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium-production',
      testMatch: 'browser/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4322' },
    },
    {
      name: 'chromium-fixtures',
      testMatch: 'fixtures/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4321' },
    },
  ],
});
