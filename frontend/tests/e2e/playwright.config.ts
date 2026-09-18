import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  use: {
    baseURL: process.env.BASE_URL || 'https://border-built.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  reporter: [['html', { open: 'never' }], ['list']],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

