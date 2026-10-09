import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const root = process.env.BACKUP_VERIFY_ROOT;
if (!root) throw new Error('Set BACKUP_VERIFY_ROOT to a private temporary directory.');
export default defineConfig({ testDir: '../browser', testMatch: 'backup-roundtrip.spec.ts', outputDir: `${root}/playwright`,
  workers: 1, retries: 0, reporter: [['list'], ['json', { outputFile: `${root}/results.json` }]],
  globalTeardown: './backup-roundtrip-teardown.ts',
  use: { baseURL: 'http://127.0.0.1:5181/playtest/', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/backup-roundtrip.vite.config.ts --configLoader runner --port 5181 --strictPort',
    url: 'http://127.0.0.1:5181/playtest/', reuseExistingServer: false, cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-backup' } } });
