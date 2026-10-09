import { defineConfig } from '@playwright/test';
import adult from './adult-profiles.config';
import hall from './local-leaderboard.config';
import audio from './audio.config';
import creative from './creative.config';

// Keep each owner's server, private output paths and teardown together.
const fixtures = { adult, hall, audio, creative };
const selection = process.env.D3_FIXTURE;
if (!selection || !Object.hasOwn(fixtures, selection)) {
  throw new Error('Set D3_FIXTURE to adult, hall, audio or creative.');
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
}[fixture];
const base = fixtures[fixture];

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
