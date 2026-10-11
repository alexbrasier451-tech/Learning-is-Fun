import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
const root = process.env.EXPANDED_VERIFY_ROOT;
if (!root) throw new Error('EXPANDED_VERIFY_ROOT must name private output.');
const vite = resolve(dirname(createRequire(import.meta.url).resolve('vite/package.json')), 'bin/vite.js');
export default defineConfig({ testDir: '../browser', testMatch: 'expanded-save.spec.ts', workers: 1, retries: 0, timeout: 120000,
  outputDir: `${root}/playwright`, reporter: [['list'], ['json', { outputFile: `${root}/results.json` }]],
  globalTeardown: './expanded-save-teardown.ts',
  use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:5247/playtest/', trace: 'retain-on-failure' },
  webServer: { command: `"${process.execPath}" "${vite}" --config tests/fixtures/expanded-save.vite.config.ts --configLoader runner --port 5247 --strictPort`,
    cwd: fileURLToPath(new URL('../..', import.meta.url)), url: 'http://127.0.0.1:5247/playtest/', reuseExistingServer: false,
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-wp04-07a' } } });
