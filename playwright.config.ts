import { defineConfig, devices } from '@playwright/test';

const browserProjects = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
] as const;

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
  projects: browserProjects.flatMap(({ name, device }) => [
    {
      name: `${name}-production`,
      testMatch: 'browser/**/*.spec.ts',
      use: { ...device, baseURL: 'http://127.0.0.1:4322' },
    },
    {
      name: `${name}-fixtures`,
      testMatch: 'fixtures/**/*.spec.ts',
      use: { ...device, baseURL: 'http://127.0.0.1:4321' },
    },
  ]),
});
