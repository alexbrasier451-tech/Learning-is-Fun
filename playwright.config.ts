import { defineConfig } from '@playwright/test';

const published = process.env.PLAYTEST_MODE === 'published';
if (process.env.PLAYTEST_MODE && !['local', 'published'].includes(process.env.PLAYTEST_MODE)) {
  throw new Error('PLAYTEST_MODE must be local or published.');
}
if (!published && process.env.PLAYTEST_BASE_URL) {
  throw new Error('Use PLAYTEST_MODE=published with PLAYTEST_BASE_URL.');
}
let baseURL = 'http://127.0.0.1:4173/playtest/';
if (published) {
  if (!process.env.PLAYTEST_BASE_URL) throw new Error('Published observations require PLAYTEST_BASE_URL.');
  const url = new URL(process.env.PLAYTEST_BASE_URL);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('PLAYTEST_BASE_URL must be an explicit HTTPS deployment entry URL.');
  }
  if (!url.pathname.endsWith('/')) throw new Error('PLAYTEST_BASE_URL must end in /.');
  baseURL = url.href;
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: published ? [
    { name: 'D1-Chrome', testMatch: '**/*.published.spec.ts', use: { browserName: 'chromium', channel: 'chrome', viewport: { width: 1366, height: 768 } } },
    { name: 'D2-Edge', testMatch: '**/*.published.spec.ts', use: { browserName: 'chromium', channel: 'msedge', viewport: { width: 1920, height: 1080 } } },
    { name: 'D3-Firefox', testMatch: '**/*.published.spec.ts', use: { browserName: 'firefox', viewport: { width: 1280, height: 720 } } },
    { name: 'T1-Chromium-touch', testMatch: '**/*.published.spec.ts', use: { browserName: 'chromium', viewport: { width: 1024, height: 768 }, hasTouch: true } },
    { name: 'T2-WebKit-touch', testMatch: '**/*.published.spec.ts', use: { browserName: 'webkit', viewport: { width: 768, height: 1024 }, hasTouch: true } },
  ] : [
    { name: 'local-fixture', testMatch: '**/*.local.spec.ts', use: { browserName: 'chromium', viewport: { width: 1366, height: 768 } } },
  ],
  webServer: published ? undefined : {
    command: 'pnpm dev --port 4173 --strictPort',
    url: baseURL,
    reuseExistingServer: false,
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-fixtures' },
  },
});
