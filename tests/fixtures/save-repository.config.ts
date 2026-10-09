import { defineConfig } from '@playwright/test';
import foundation from '../../playwright.config';
import { fileURLToPath } from 'node:url';

const verificationRoot = process.env.REPOSITORY_VERIFY_ROOT;
if (!verificationRoot) throw new Error('Set REPOSITORY_VERIFY_ROOT to a private temporary directory.');

// Focused local storage suite; no change to the publication matrix or harness.
export default defineConfig({
  ...foundation,
  testDir: '../browser',
  outputDir: `${verificationRoot}/playwright`,
  use: { ...foundation.use, baseURL: 'http://127.0.0.1:5179/playtest/' },
  reporter: [['list'], ['json', { outputFile: `${verificationRoot}/results.json` }]],
  globalTeardown: './save-repository-teardown.ts',
  workers: 1,
  projects: [
    { name: 'repository-chromium', testMatch: 'save-repository.spec.ts', use: { browserName: 'chromium' } },
    { name: 'repository-edge', testMatch: 'save-repository.spec.ts', use: { browserName: 'chromium', channel: 'msedge' } },
    { name: 'repository-webkit', testMatch: 'save-repository.spec.ts', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/save-repository.vite.config.ts --configLoader runner --port 5179 --strictPort',
    url: 'http://127.0.0.1:5179/playtest/',
    reuseExistingServer: false,
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-repository' },
  },
});
