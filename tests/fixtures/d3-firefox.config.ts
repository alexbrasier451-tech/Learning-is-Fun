import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import adult from './adult-profiles.config';
import hall from './local-leaderboard.config';
import audio from './audio.config';
import creative from './creative.config';
import { offlineConfig } from './offline-runner';

function publishedCandidate() {
  let bytes: Buffer;
  let value: Record<string, unknown>;
  try {
    bytes = readFileSync(new URL('../../docs/release/M1/CANDIDATE.json', import.meta.url));
    value = JSON.parse(bytes.toString('utf8')) as Record<string, unknown>;
  } catch { throw new Error('Cannot read valid M1 candidate metadata.'); }
  const fields = ['release', 'url', 'basePath', 'buildId', 'commit', 'deploymentRun', 'requiredInventoryLocation'];
  if (!value || Array.isArray(value) || Object.keys(value).length !== fields.length ||
      fields.some(key => typeof value[key] !== 'string' || !value[key])) {
    throw new Error('M1 candidate requires its seven nonempty metadata fields.');
  }
  const candidate = value as Record<string, string>;
  const identity = /^([a-f0-9]{40})-pages-([0-9]+)-([0-9]+)$/.exec(candidate.buildId);
  if (candidate.release !== 'M1' || candidate.url !== 'https://alexbrasier451-tech.github.io/Learning-is-Fun/' ||
      candidate.basePath !== '/Learning-is-Fun/' || !identity || candidate.commit !== identity[1] ||
      candidate.deploymentRun !== `https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/${identity[2]}`) {
    throw new Error('M1 candidate must identify the HTTPS project deployment and matching build/commit/run.');
  }
  return { release: candidate.release, url: candidate.url, basePath: candidate.basePath,
    buildId: candidate.buildId, commit: candidate.commit, deploymentRun: candidate.deploymentRun,
    metadataSha256: createHash('sha256').update(bytes).digest('hex') };
}

// Keep each owner's server, private output paths and teardown together.
const adventureRoot = process.env.ADVENTURE_VERIFY_ROOT;
const adventure = adventureRoot ? defineConfig({
  testDir: '../browser', testMatch: 'experience.spec.ts', outputDir: `${adventureRoot}/playwright`,
  timeout: 45_000,
  reporter: [['list'], ['json', { outputFile: `${adventureRoot}/results.json` }]],
  globalTeardown: './adventure-teardown.ts',
  use: { baseURL: 'http://127.0.0.1:5194/playtest/' },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/adventure.vite.config.ts --configLoader runner --port 5194 --strictPort',
    url: 'http://127.0.0.1:5194/playtest/', reuseExistingServer: false,
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-adventure', ADVENTURE_VERIFY_ROOT: adventureRoot },
  },
}) : undefined;
const shellRoot = process.env.SHELL_VERIFY_ROOT;
const shell = shellRoot ? defineConfig({
  testDir: '../platform', testMatch: 'shell.spec.ts', outputDir: `${shellRoot}/playwright`,
  timeout: 40_000,
  reporter: [['list'], ['json', { outputFile: `${shellRoot}/results.json` }]],
  globalTeardown: './shell-teardown.ts',
  use: { baseURL: 'http://127.0.0.1:5195/playtest/' },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --config tests/fixtures/shell.vite.config.ts --configLoader runner --port 5195 --strictPort',
    url: 'http://127.0.0.1:5195/playtest/', reuseExistingServer: false,
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { APP_BASE: '/playtest/', APP_BUILD_ID: 'local-wp01-02a', SHELL_VERIFY_ROOT: shellRoot },
  },
}) : undefined;
const offline = process.env.OFFLINE_OUTPUT ? offlineConfig(process.env.OFFLINE_OUTPUT) : undefined;
const publishedRoot = process.env.PUBLISHED_VERIFY_ROOT;
let published;
if (process.env.D3_FIXTURE === 'published') {
  if (process.env.PLAYTEST_MODE !== 'published') throw new Error('D3 published requires PLAYTEST_MODE=published.');
  const candidate = publishedCandidate();
  if (process.env.PLAYTEST_BASE_URL !== candidate.url) throw new Error('D3 published requires PLAYTEST_BASE_URL to match validated M1 candidate metadata.');
  if (publishedRoot) published = defineConfig({
    testDir: '../playtest', testMatch: 'starter.spec.ts', timeout: 90_000,
    outputDir: `${publishedRoot}/playwright`,
    reporter: [['list'], ['json', { outputFile: `${publishedRoot}/results.json` }]],
    use: { baseURL: candidate.url },
    metadata: { ciSourceCommit: process.env.GITHUB_SHA ?? null, deployedCandidate: candidate },
  });
}
const fixtures = { adult, hall, audio, creative, adventure, shell, offline, published };
const selection = process.env.D3_FIXTURE;
if (!selection || !Object.hasOwn(fixtures, selection)) {
  throw new Error('Set D3_FIXTURE to adult, hall, audio, creative, adventure, shell, offline or published.');
}
const fixture = selection as keyof typeof fixtures;
if (fixture === 'adult' && process.env.ADULT_REAL_RELEASE !== 'yes') {
  throw new Error('D3 adult smoke requires ADULT_REAL_RELEASE=yes for the released real binding.');
}
const grep = {
  adult: /two-step adult entry|producer evidence separates|actual facade four-profile/,
  hall: /20\/20\/10\/0 ties|keyboard and touch history\/back|real facade opening refreshes/,
  audio: /first visit is silent; keyboard controls|real facade profiles and visibility hook/,
  creative: /scarf: free preview|approved help remains hidden/,
  adventure: /.*/,
  shell: /.*/,
  offline: /.*/,
  published: /M1 published bounded entry, profile resume, bridge, adult, Hall and project reload smoke$/,
}[fixture];
const base = fixtures[fixture];
if (!base) {
  const variable = fixture === 'offline' ? 'OFFLINE_OUTPUT' : `${fixture.toUpperCase()}_VERIFY_ROOT`;
  throw new Error(`D3 ${fixture} requires ${variable} to be a private temporary directory.`);
}

export default defineConfig({
  ...base,
  grep,
  fullyParallel: false,
  forbidOnly: true,
  workers: 1,
  retries: 0,
  globalTimeout: fixture === 'offline' ? 600_000 : 300_000,
  use: { ...base.use, trace: 'on', screenshot: 'on' },
  // Replace the owned project array: no Chromium, Edge or touch project runs here.
  projects: [{
    name: 'D3-Firefox',
    use: {
      browserName: 'firefox',
      viewport: { width: 1280, height: 720 },
      hasTouch: false,
      isMobile: false,
    },
  }],
});
