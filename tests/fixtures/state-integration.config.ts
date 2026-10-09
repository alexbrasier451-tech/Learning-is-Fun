import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const root = process.env.STATE_VERIFY_ROOT;
if (!root) throw new Error('Set STATE_VERIFY_ROOT to a private temporary directory.');
export default defineConfig({ testDir: '../browser', testMatch: 'local-save.spec.ts', outputDir: `${root}/playwright`,
  workers: 1, retries: 0, timeout: 45000, reporter: [['list'], ['json', { outputFile: `${root}/results.json` }]],
  globalTeardown: './state-integration-teardown.ts',
  projects: [
    { name: 'state-chromium', use: { browserName: 'chromium' } },
    { name: 'state-edge', use: { browserName: 'chromium', channel: 'msedge' } },
    { name: 'state-webkit', use: { browserName: 'webkit' } },
  ],
  use: { baseURL: 'http://127.0.0.1:5182/playtest/', trace: 'retain-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/state-integration.vite.config.ts --configLoader runner --port 5182 --strictPort',
    url: 'http://127.0.0.1:5182/playtest/', reuseExistingServer: false, cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-state-integration' } } });
