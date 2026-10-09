import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import adult from './adult-profiles.config';
import hall from './local-leaderboard.config';
import audio from './audio.config';
import creative from './creative.config';

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
const fixtures = { adult, hall, audio, creative, adventure, shell };
const selection = process.env.D3_FIXTURE;
if (!selection || !Object.hasOwn(fixtures, selection)) {
  throw new Error('Set D3_FIXTURE to adult, hall, audio, creative, adventure or shell.');
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
}[fixture];
const base = fixtures[fixture];
if (!base) throw new Error(`D3 ${fixture} requires ${fixture.toUpperCase()}_VERIFY_ROOT to be a private temporary directory.`);

export default defineConfig({
  ...base,
  grep,
  fullyParallel: false,
  forbidOnly: true,
  workers: 1,
  retries: 0,
  globalTimeout: 300_000,
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
