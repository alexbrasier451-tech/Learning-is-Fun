import { defineConfig } from '@playwright/test';
import { join } from 'node:path';
import { contextSettings, evidenceRoot, projectName, publishedCandidate, scenarioFile, sourceCommit } from './published-webkit-evidence';

const deployedCandidate = publishedCandidate();
if (process.env.PLAYTEST_MODE !== 'published' || process.env.PLAYTEST_BASE_URL !== deployedCandidate.url) {
  throw new Error('Published WebKit requires published mode and the validated M2 candidate URL.');
}
const root = evidenceRoot();

export default defineConfig({
  testDir: '../playtest', testMatch: scenarioFile,
  grep: /^\s*T2-WebKit-touch published-webkit\.spec\.ts Published M2 WebKit touch and scene transport observation$/,
  fullyParallel: false, forbidOnly: true, workers: 1, retries: 0, repeatEach: 1,
  timeout: 600_000, globalTimeout: 900_000, preserveOutput: 'always',
  outputDir: join(root, 'playwright'),
  reporter: [['list'], ['json', { outputFile: join(root, 'results.json') }]],
  metadata: { ciSourceCommit: sourceCommit(), deployedCandidate },
  // The observer starts and stops its own per-context traces.
  use: { ...contextSettings, baseURL: deployedCandidate.url, trace: 'off', screenshot: 'on' },
  projects: [{ name: projectName }],
});
