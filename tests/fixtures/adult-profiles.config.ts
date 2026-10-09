import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const root = process.env.ADULT_VERIFY_ROOT;
if (!root) throw new Error('Set ADULT_VERIFY_ROOT to a private temporary directory.');
export default defineConfig({ testDir: '../browser', testMatch: 'adult-profiles.spec.ts', outputDir: `${root}/playwright`, workers: 1, retries: 0, timeout: 30000,
  reporter: [['list'], ['json', { outputFile: `${root}/results.json` }]], globalTeardown: './adult-profiles-teardown.ts',
  projects: [
    { name: 'adult-edge-D2', use: { browserName: 'chromium', channel: 'msedge', viewport: { width: 1920, height: 1080 } } },
    { name: 'adult-chromium-support', use: { browserName: 'chromium', viewport: { width: 1366, height: 768 } } },
    { name: 'adult-chromium-T1', use: { browserName: 'chromium', viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true } },
    { name: 'adult-webkit-T2', use: { browserName: 'webkit', viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true } },
  ],
  use: { baseURL: 'http://127.0.0.1:5186/playtest/', trace: 'retain-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/adult-profiles.vite.config.ts --configLoader runner --port 5186 --strictPort',
    url: 'http://127.0.0.1:5186/playtest/', reuseExistingServer: false, cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-adult', VITE_ADULT_REAL_RELEASE: process.env.ADULT_REAL_RELEASE ?? 'no' } },
});
