import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const root = process.env.HALL_VERIFY_ROOT;
if (!root) throw new Error('Set HALL_VERIFY_ROOT to a private temporary directory.');
export default defineConfig({ testDir: '../browser', testMatch: 'local-leaderboard.spec.ts', outputDir: `${root}/playwright`,
  workers: 1, retries: 0, timeout: 30000, reporter: [['list'], ['json', { outputFile: `${root}/results.json` }]], globalTeardown: './local-leaderboard-teardown.ts',
  projects: [
    { name: 'hall-edge-D2', use: { browserName: 'chromium', channel: 'msedge', viewport: { width: 1920, height: 1080 } } },
    { name: 'hall-chromium-support', use: { browserName: 'chromium', viewport: { width: 1366, height: 768 } } },
    { name: 'hall-chromium-T1', use: { browserName: 'chromium', viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true } },
    { name: 'hall-webkit-T2', use: { browserName: 'webkit', viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true } },
  ],
  use: { baseURL: 'http://127.0.0.1:5185/playtest/', trace: 'retain-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/local-leaderboard.vite.config.ts --configLoader runner --port 5185 --strictPort',
    url: 'http://127.0.0.1:5185/playtest/', reuseExistingServer: false, cwd: fileURLToPath(new URL('../..', import.meta.url)), env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-hall' } },
});
