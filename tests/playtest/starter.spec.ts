import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { platform, release } from 'node:os';
import { recordCheckpoint } from './helpers/evidence';
import type { CheckpointRecord, MatrixCase } from './helpers/evidence';

// Bounded D2/D3 smoke only. Full D1/T1 evidence comes from retained persistent
// agent observation/choice sessions, never from this fixed script.
test.use({ timezoneId: 'Europe/London' });

test('M1 published bounded entry, profile resume, bridge, adult, Hall and project reload smoke', async ({ page, browser, browserName }, testInfo) => {
  test.setTimeout(90000);
  page.setDefaultTimeout(10000);
  const matrix: MatrixCase = testInfo.project.name === 'D2-Edge' ? 'D2'
    : testInfo.project.name === 'D3-Firefox' ? 'D3'
      : (() => { throw new Error('This bounded smoke requires D2-Edge or D3-Firefox, not a substitute journey.'); })();
  expect(browserName).toBe(matrix === 'D3' ? 'firefox' : 'chromium');
  if (matrix === 'D2') expect(testInfo.project.use.channel).toBe('msedge');
  expect(page.viewportSize()).toEqual(matrix === 'D3' ? { width: 1280, height: 720 } : { width: 1920, height: 1080 });
  expect(process.env.PLAYTEST_MODE).toBe('published');
  const candidate = JSON.parse(await readFile(new URL('../../docs/release/M1/CANDIDATE.json', import.meta.url), 'utf8')) as { url: string; buildId: string; commit: string };
  expect(process.env.PLAYTEST_BASE_URL).toBe(candidate.url);
  const nickname = `${matrix} Smoke`;
  const start = Date.now();
  const row = (id: string, actions: string[], expected: string, observed: string, status: CheckpointRecord['status'] = 'passed'): CheckpointRecord => ({
    scenarioId: id, release: 'M1', candidateUrl: candidate.url, candidateBuildId: candidate.buildId,
    matrixCase: matrix, browserVersion: browser.version(), viewport: page.viewportSize()!, inputMode: 'mouse',
    seededOrUnseeded: 'unseeded', setupRef: 'Fresh runner context; normal create/select/leave/resume UI only. Reviewed Q1 total-12 [6,6] anchor.',
    actions, expected, observed, status, evidenceLinks: [], acousticStatus: 'not-applicable',
    defectOwner: status === 'failed' ? 'Controller to classify original trace' : null,
    retestedBuildId: null, finalBuildApplicability: candidate.buildId,
  });
  const checkpoint = async (id: string, actions: string[], expected: string, observed: string) => {
    await recordCheckpoint(page, testInfo, row(id, actions, expected, observed));
  };
  try {
    await page.goto(candidate.url);
    await expect(page.getByRole('heading', { name: 'Who’s exploring today?', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Help', exact: true }).click();
    await expect(page.getByRole('dialog').getByText(`Game version: ${candidate.buildId}`, { exact: true })).toBeVisible();
    const identity = await page.evaluate(`(async () => {
      const registration = await navigator.serviceWorker.ready;
      return await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => reject(Error('Native worker identity timeout')), 5000);
        channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close();
          resolve({scope: registration.scope, activeScript: registration.active?.scriptURL,
            controller: navigator.serviceWorker.controller?.scriptURL ?? null, reply: event.data}); };
        registration.active.postMessage({type:'OFFLINE_INVENTORY_PROBE',requestId:'journey-smoke-identity'},[channel.port2]);
      });
    })()`) as { scope: string; activeScript: string; controller: string | null; reply: { buildId: string } };
    expect(identity.reply.buildId).toBe(candidate.buildId);
    expect(identity.scope).toBe(candidate.url);
    await testInfo.attach('session-header', { contentType: 'application/json', body: Buffer.from(JSON.stringify({
      os: `${platform()} ${release()}`, deviceClass: 'desktop', timezone: 'Europe/London',
      engine: browser.browserType().name(), browserVersion: browser.version(), viewport: page.viewportSize(),
      fixtureOrPublished: 'published', candidate, identityObservation: 'Exact visible Help version and native active worker reply before profile input.',
      workerIdentity: identity, listenerOrCaptureRoute: null, startedAt: new Date(start).toISOString(),
    }, null, 2)) });
    console.log(`${testInfo.project.name}: actual ${browser.browserType().name()} ${browser.version()} published ${candidate.buildId}`);
    await checkpoint('M1-SMOKE-IDENTITY', ['Open published URL', 'Visible Help version', 'Native read-only worker identity probe'], 'Frozen page/worker candidate identity before play.', 'Both exact identities match the candidate; actual browser/OS retained.');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Add an explorer', exact: true }).click();
    await page.getByRole('textbox', { name: 'Nickname', exact: true }).fill(nickname);
    await page.getByRole('button', { name: 'Save explorer', exact: true }).click();
    await page.getByRole('button', { name: `${nickname} Choose explorer`, exact: true }).click();
    await page.getByRole('button', { name: 'Meet Pip at the bridge', exact: true }).click();
    await page.getByRole('button', { name: 'A Bridge Back Home', exact: true }).click();
    await page.getByRole('button', { name: 'Choose 6 metre plank', exact: true }).click();
    await page.getByRole('button', { name: 'Place selected plank at the end', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Bridge construction' }).getByRole('status')).toContainText('1 planks · 6 metres');
    await expect(page.getByText('Your scoring turn has not started', { exact: true })).toBeVisible();
    await checkpoint('M1-SMOKE-DRAFT', ['Normal UI create/select profile', 'Open required Q1', 'Select/place6m without Check'], 'Draft [6], zero Checks/scoring before Check.', '6m draft; scoring turn not started; explicit unsaved-draft status.');
    await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true })).toBeVisible();
    await page.goto(candidate.url);
    expect(page.url()).toBe(candidate.url);
    await page.getByRole('button', { name: `${nickname} Choose explorer`, exact: true }).click();
    await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Bridge construction' }).getByRole('status')).toContainText('1 planks · 6 metres');
    await expect(page.getByText('Your scoring turn has not started', { exact: true })).toBeVisible();
    await checkpoint('M1-SMOKE-RESUME', ['Leave normally', 'Reload exact project path', 'Select same explorer', 'Resume named saved activity'], 'Retain draft and zero Checks after reload.', '[6] retained with no scoring turn; project entry reloaded rather than localhost.');
    await page.getByRole('button', { name: 'Choose 6 metre plank', exact: true }).click();
    await page.getByRole('button', { name: 'Place selected plank at the end', exact: true }).click();
    await page.getByRole('button', { name: 'Check my idea', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your idea worked!', exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Feedback from your saved Check' })).toContainText('That saved Check added 40 lifetime points and 20 weekly points.');
    await checkpoint('M1-SMOKE-CHECK', ['UI addsecond6m', 'Explicit Check[6,6]'], 'Unassisted Q1 success+40lifetime20weekly, once-only restoration.', 'Saved Check1/session1 and correct exact reward; Q1 Restored.');
    await page.getByRole('button', { name: 'Continue without the extra challenge', exact: true }).click();
    await page.getByRole('button', { name: 'Grown-ups', exact: true }).click();
    await page.getByRole('button', { name: 'For grown-ups', exact: true }).click();
    await page.getByRole('button', { name: 'Continue to adult area', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Stories, practice and care', exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: `Practice evidence for ${nickname}` })).toContainText('Missing totals');
    await checkpoint('M1-SMOKE-ADULT', ['Deliberate two-step adult entry'], 'Readable local notebook and preferences.', 'Adult notebook present with recorded Q1 practice and evidence limitations.');
    await page.getByRole('navigation', { name: 'Your story', exact: true }).getByRole('button', { name: 'Hall of Champions', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'This week', exact: true })).toBeVisible();
    const standings = page.getByRole('list', { name: 'Provisional weekly standings' });
    await expect(standings).toContainText(nickname);
    await expect(standings.locator('dd')).toHaveText(['20', '40', '1 / 30']);
    await checkpoint('M1-SMOKE-HALL', ['Open Hall after saved Q1'], '40lifetime20weekly1turn; local board.', 'Exact totals verified and local scope visible. Bounded one-activity smoke complete.');
  } catch (error) {
    const observed = error instanceof Error ? error.message : String(error);
    await recordCheckpoint(page, testInfo, row('M1-SMOKE-FAILURE', ['Run bounded normal UI smoke; preserve original failure'], 'All original smoke assertions pass.', observed, 'failed')).catch(() => {});
    throw error;
  }
});
