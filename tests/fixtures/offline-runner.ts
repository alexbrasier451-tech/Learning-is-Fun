import { defineConfig } from '@playwright/test';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Shared actual-production launch contract; this module performs no build or launch. */
export function offlineConfig(output: string | undefined, run?: string) {
  if (!output || !isAbsolute(output)) throw new Error('Set OFFLINE_OUTPUT to an absolute private output directory.');
  const root = fileURLToPath(new URL('../..', import.meta.url));
  output = resolve(output);
  const outside = (path: string) => path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path);
  if (!outside(relative(root, output)) || !outside(relative(output, root))) {
    throw new Error('OFFLINE_OUTPUT must be outside the repository and cannot contain it.');
  }
  if (run && !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(run)) throw new Error('OFFLINE_RUN must be a bounded filename suffix.');
  const suffix = run ? `-${run}` : '';
  return defineConfig({
    testDir: '../platform', testMatch: 'offline-update.spec.ts',
    outputDir: `${output}/playwright${suffix}`,
    reporter: [['list'], ['json', { outputFile: `${output}/results${suffix}.json` }]],
    globalTeardown: './offline-teardown.ts',
    fullyParallel: false, forbidOnly: true, workers: 1, retries: 0, timeout: 90_000,
    use: { baseURL: 'http://127.0.0.1:5196/playtest/', trace: 'on', screenshot: 'on' },
    webServer: {
      command: 'node tests/fixtures/offline-build.mjs && node tests/fixtures/offline-server.mjs',
      cwd: root, url: 'http://127.0.0.1:5196/playtest/',
      reuseExistingServer: false, timeout: 180_000,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
      env: { OFFLINE_OUTPUT: output },
    },
  });
}
