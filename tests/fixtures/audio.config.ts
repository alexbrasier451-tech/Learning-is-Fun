import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const root = process.env.AUDIO_VERIFY_ROOT;
if (!root) throw new Error('Set AUDIO_VERIFY_ROOT to a private temporary directory.');
export default defineConfig({ testDir: '../browser', testMatch: 'audio-controls.spec.ts', outputDir: `${root}/playwright`,
  workers: 1, retries: 0, timeout: 45000, reporter: [['list'], ['json', { outputFile: `${root}/results.json` }]],
  globalTeardown: './audio-teardown.ts',
  projects: [
    { name: 'audio-chromium', use: { browserName: 'chromium', viewport: { width: 1366, height: 768 } } },
    { name: 'audio-edge', use: { browserName: 'chromium', channel: 'msedge', viewport: { width: 1920, height: 1080 } } },
    { name: 'audio-webkit', use: { browserName: 'webkit', viewport: { width: 768, height: 1024 }, hasTouch: true } },
  ],
  use: { baseURL: 'http://127.0.0.1:5184/playtest/', trace: 'retain-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/audio.vite.config.ts --configLoader runner --port 5184 --strictPort',
    url: 'http://127.0.0.1:5184/playtest/', reuseExistingServer: false, cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-audio' } } });
