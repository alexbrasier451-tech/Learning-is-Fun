import { defineConfig } from '@playwright/test';
import { offlineConfig } from './offline-runner';

export default defineConfig({
  ...offlineConfig(process.env.OFFLINE_OUTPUT, process.env.OFFLINE_RUN),
  projects: [
    { name: 'D1-Chrome', use: { browserName: 'chromium', channel: 'chrome', viewport: { width: 1366, height: 768 } } },
    { name: 'D2-Edge', use: { browserName: 'chromium', channel: 'msedge', viewport: { width: 1920, height: 1080 } } },
    { name: 'T1-Chromium-touch', use: { browserName: 'chromium', viewport: { width: 1024, height: 768 }, hasTouch: true } },
    { name: 'T2-WebKit-touch', use: { browserName: 'webkit', viewport: { width: 768, height: 1024 }, hasTouch: true } },
  ],
});
