import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const root = process.env.CREATIVE_VERIFY_ROOT;
if (!root) throw new Error('Set CREATIVE_VERIFY_ROOT to a private temporary directory.');
export default defineConfig({ testDir: '../browser', testMatch: 'creative.spec.ts', outputDir: `${root}/playwright`,
  workers: 1, retries: 0, timeout: 45000, reporter: [['list'], ['json', { outputFile: `${root}/results.json` }]],
  globalTeardown: './creative-teardown.ts',
  projects: [
    { name: 'creative-chromium-support', use: { browserName: 'chromium', viewport: { width: 1366, height: 768 } } },
    { name: 'creative-edge-D2', use: { browserName: 'chromium', channel: 'msedge', viewport: { width: 1920, height: 1080 } } },
    { name: 'creative-chromium-T1', use: { browserName: 'chromium', viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true } },
    { name: 'creative-webkit-T2', use: { browserName: 'webkit', viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true } },
  ], use: { baseURL: 'http://127.0.0.1:5187/playtest/', trace: 'retain-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/creative.vite.config.ts --configLoader runner --port 5187 --strictPort',
    url: 'http://127.0.0.1:5187/playtest/', reuseExistingServer: false, cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-creative' } },
});
