import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { platform, release } from 'node:os';
import { QUESTS, SCENES } from '../../src/experience/catalogue';
import { QUEST_TITLES } from '../../src/experience/world';
import { QUEST_ACTIVITY_BINDINGS, getRequiredBindingIds } from '../../src/content/quest-bindings';
import { recordCheckpoint } from './helpers/evidence';
import type { CheckpointRecord, MatrixCase } from './helpers/evidence';

// Bounded D2/D3 smoke. Full M2 journeys remain persistent agent-directed work.
// No candidate is read at discovery: execution requires the publisher's real M2 record.
test.use({ timezoneId: 'Europe/London' });

test('M2 published bounded entry, starter gates, workshop matching draft, adult, Hall and project reload smoke', async ({ page, browser, browserName }, info) => {
  test.setTimeout(120_000);
  page.setDefaultTimeout(10_000);
  const matrix: MatrixCase = info.project.name === 'D2-Edge' ? 'D2'
    : info.project.name === 'D3-Firefox' ? 'D3'
      : (() => { throw new Error('M2 bounded smoke requires actual D2-Edge or D3-Firefox.'); })();
  expect(browserName).toBe(matrix === 'D3' ? 'firefox' : 'chromium');
  if (matrix === 'D2') expect(info.project.use.channel).toBe('msedge');
  expect(page.viewportSize()).toEqual(matrix === 'D3' ? { width: 1280, height: 720 } : { width: 1920, height: 1080 });
  expect(process.env.PLAYTEST_MODE).toBe('published');
  const bytes = await readFile(new URL('../../docs/release/M2/CANDIDATE.json', import.meta.url));
  const value: unknown = JSON.parse(bytes.toString('utf8'));
  const fields = ['release', 'url', 'basePath', 'buildId', 'commit', 'deploymentRun', 'requiredInventoryLocation'];
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).length !== fields.length
    || fields.some(key => typeof (value as Record<string, unknown>)[key] !== 'string' || !(value as Record<string, unknown>)[key])) {
    throw new Error('Actual M2 candidate requires exactly seven nonempty publisher metadata fields.');
  }
  const candidate = value as Record<string, string>;
  const build = /^([a-f0-9]{40})-pages-([0-9]+)-([0-9]+)$/.exec(candidate.buildId);
  expect(candidate.release).toBe('M2');
  expect(candidate.url).toBe('https://alexbrasier451-tech.github.io/Learning-is-Fun/');
  expect(candidate.basePath).toBe('/Learning-is-Fun/');
  expect(build, 'Actual deployed commit/Pages run/attempt build identity').not.toBeNull();
  expect(candidate.commit).toBe(build![1]);
  expect(candidate.deploymentRun).toBe('https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/' + build![2]);
  expect(process.env.PLAYTEST_BASE_URL).toBe(candidate.url);
  const ciSourceCommit = process.env.GITHUB_SHA ?? process.env.PLAYTEST_CI_SOURCE_COMMIT ?? null;
  if (process.env.CI) expect(ciSourceCommit).toMatch(/^[a-f0-9]{40}$/);
  const metadataSha256 = createHash('sha256').update(bytes).digest('hex');
  const gates = QUESTS.filter(q => q.milestone === 'M1');
  expect(gates.map(q => q.id)).toEqual(['Q1', 'Q2', 'Q3']);
  const workshop = SCENES.find(s => s.id === 'tinkers-workshop')!;
  const quest = QUESTS.find(q => q.sceneId === workshop.id && q.milestone === 'M2')!;
  expect(quest.requiresAll).toEqual(['Q3']);
  const required = getRequiredBindingIds(QUEST_ACTIVITY_BINDINGS, quest.id, 'M2');
  expect(required).toHaveLength(1);
  const binding = QUEST_ACTIVITY_BINDINGS.find(b => b.bindingId === required[0])!;
  expect(binding.responseKind).toBe('matching');
  const nickname = matrix + ' M2 Smoke';
  const start = Date.now();
  const row = (id: string, actions: string[], expected: string, observed: string, status: CheckpointRecord['status'] = 'passed'): CheckpointRecord => ({
    scenarioId: id, release: 'M2', candidateUrl: candidate.url, candidateBuildId: candidate.buildId,
    matrixCase: matrix, browserVersion: browser.version(), viewport: page.viewportSize()!, inputMode: 'mouse',
    seededOrUnseeded: 'unseeded', setupRef: 'Fresh profile; normal UI starter gates then manifest-defined workshop matching draft. No import, fixture API or answer injection.',
    actions, expected, observed, status, evidenceLinks: [], acousticStatus: 'not-applicable',
    defectOwner: status === 'failed' ? 'Controller to route original trace to causal owner' : null,
    retestedBuildId: null, finalBuildApplicability: candidate.buildId,
  });
  const checkpoint = async (id: string, actions: string[], expected: string, observed: string) => {
    await recordCheckpoint(page, info, row(id, actions, expected, observed));
  };
  const button = (name: string) => page.getByRole('button', { name, exact: true });
  const savedCheck = async () => {
    await button('Check my idea').click();
    await expect(page.getByRole('heading', { name: 'Your idea worked!', exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Feedback from your saved Check' })).toContainText('That saved Check added 40 lifetime points and 20 weekly points.');
    await expect(page.getByText('Saved on this device.', { exact: true })).toBeVisible();
    await button('Leave activity').click();
  };
  try {
    await page.goto(candidate.url);
    await expect(page.getByRole('heading', { name: 'Who’s exploring today?', exact: true })).toBeVisible();
    await button('Help').click();
    await expect(page.getByRole('dialog').getByText('Game version: ' + candidate.buildId, { exact: true })).toBeVisible();
    const identity = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return await new Promise<{ scope: string; activeScript: string | null; controller: string | null; reply: { buildId: string } }>((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => { channel.port1.close(); reject(Error('Native M2 identity probe timeout')); }, 5000);
        channel.port1.onmessage = event => {
          clearTimeout(timer); channel.port1.close();
          resolve({ scope: registration.scope, activeScript: registration.active?.scriptURL ?? null,
            controller: navigator.serviceWorker.controller?.scriptURL ?? null, reply: event.data });
        };
        registration.active?.postMessage({ type: 'OFFLINE_INVENTORY_PROBE', requestId: 'm2-journey-smoke-identity' }, [channel.port2]);
      });
    });
    expect(identity.reply.buildId).toBe(candidate.buildId);
    expect(identity.scope).toBe(candidate.url);
    await info.attach('session-header', { contentType: 'application/json', body: Buffer.from(JSON.stringify({
      os: platform() + ' ' + release(), deviceClass: 'desktop', timezone: 'Europe/London',
      engine: browser.browserType().name(), browserVersion: browser.version(), viewport: page.viewportSize(),
      fixtureOrPublished: 'published', ciSourceCommit, deployedCandidate: candidate, metadataSha256,
      identityObservation: 'Actual M2 Help and native active-worker build before profile input; initially null controller remains disclosed.',
      workerIdentity: identity, listenerOrCaptureRoute: null, startedAt: new Date(start).toISOString(),
      manifest: { starterGates: gates.map(q => q.id), questId: quest.id, bindingId: binding.bindingId, responseKind: binding.responseKind },
    }, null, 2)) });
    console.log(info.project.name + ': actual ' + browser.browserType().name() + ' ' + browser.version() + ' deployed M2 ' + candidate.buildId + '; CI source ' + ciSourceCommit);
    await checkpoint('M2-SMOKE-IDENTITY', ['Open exact project entry', 'Help and native worker before profile input'], 'Actual frozen M2 page/worker identity.', 'Both match M2 metadata; actual engine and separate CI/deployment identities retained.');
    await page.keyboard.press('Escape');
    await button('Add an explorer').click();
    await page.getByRole('textbox', { name: 'Nickname', exact: true }).fill(nickname);
    await button('Save explorer').click();
    await button(nickname + ' Choose explorer').click();
    await button('Meet Pip at the bridge').click();
    await button(QUEST_TITLES[gates[0].id]!).click();
    for (let n = 0; n < 2; n++) {
      await button('Choose 6 metre plank').click();
      await expect(button('Choose 6 metre plank')).toHaveAttribute('aria-pressed', 'true');
      await button('Place selected plank at the end').click();
    }
    await savedCheck();
    await button('Whispering Library').click();
    await button(QUEST_TITLES[gates[1].id]!).click();
    for (const [mark, slot] of [['?', 'question'], ['.', 'discovery']]) {
      await button('Choose ' + mark).click();
      await expect(button('Choose ' + mark)).toHaveAttribute('aria-pressed', 'true');
      await button('Place selected mark in ' + slot).click();
    }
    await savedCheck();
    await button('Market Square').click();
    await button(QUEST_TITLES[gates[2].id]!).click();
    for (let n = 0; n < 6; n++) await button('Add one apple').click();
    for (let n = 0; n < 3; n++) await button('Add one pear').click();
    await savedCheck();
    await checkpoint('M2-SMOKE-GATES', ['Normal Q1 6+6 Check', 'Q2 ?/period Check', 'Q3 6apples/3pears Check'], 'Q3 unlocks workshop without imported progression.', 'Three saved first-success gates; workshop navigation available.');
    await button(workshop.title).click();
    await button(QUEST_TITLES[quest.id]!).click();
    const board = page.getByRole('region', { name: 'Matching construction', exact: true });
    await expect(board).toBeVisible();
    await expect(page.getByRole('heading', { name: workshop.title, exact: true })).toBeVisible();
    await expect(page.locator('.adventure-scene-art')).toHaveAttribute('data-scene', workshop.id);
    const item = board.getByRole('button', { name: /^Choose / }).first();
    const target = board.getByRole('button', { name: /^Place selected item with / }).first();
    const itemName = (await item.getAttribute('aria-label'))!;
    const targetName = (await target.getAttribute('aria-label'))!;
    await item.click();
    await expect(item).toHaveAttribute('aria-pressed', 'true');
    await target.click();
    await expect(board.getByRole('status')).toContainText('1 of ');
    await expect(page.getByText('Your scoring turn has not started', { exact: true })).toBeVisible();
    await checkpoint('M2-SMOKE-WORKSHOP-DRAFT', ['Open manifest-defined new M2 workshop activity', itemName, targetName, 'No Check'], 'One editable unscored matching assignment.', 'Rendered item/target labels retained; no assertion that this exploratory assignment is correct.');
    await button('Leave activity').click();
    await expect(button('Resume ' + QUEST_TITLES[quest.id])).toBeVisible();
    await page.goto(candidate.url);
    expect(page.url()).toBe(candidate.url);
    await button(nickname + ' Choose explorer').click();
    await button('Resume ' + QUEST_TITLES[quest.id]).click();
    await expect(board).toBeVisible();
    await expect(page.getByRole('heading', { name: workshop.title, exact: true })).toBeVisible();
    await expect(board.getByRole('list', { name: targetName.replace('Place selected item with ', '') + ' assignments', exact: true })).toContainText(itemName.replace('Choose ', ''));
    await expect(board.getByRole('status')).toContainText('1 of ');
    await expect(page.getByText('Your scoring turn has not started', { exact: true })).toBeVisible();
    const scene = page.locator('.adventure-scene-art');
    await expect(scene).toHaveAttribute('data-scene', workshop.id);
    await expect.poll(async () => scene.locator('img').evaluateAll(images => images.length > 0 && images.every(i => i instanceof HTMLImageElement && i.complete && i.naturalWidth > 0))).toBe(true);
    await checkpoint('M2-SMOKE-WORKSHOP-RESUME', ['Leave normally', 'Reload exact project entry', 'Choose same explorer', 'Resume named workshop'], 'Retained same matching assignment beneath actually loaded workshop scene; no Check.', 'Exact rendered item/target membership and one assignment retained; source images decoded; new quest unscored.');
    await button('Leave activity').click();
    await button('Grown-ups').click();
    await button('For grown-ups').click();
    await button('Continue to adult area').click();
    await expect(page.getByRole('heading', { name: 'Stories, practice and care', exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Practice evidence for ' + nickname })).toContainText('Missing totals');
    await checkpoint('M2-SMOKE-ADULT', ['Deliberate two-step adult entry'], 'Readable notebook after normal starter gates and unscored workshop draft.', 'Local practice evidence visible; no upgrade-fixture or curriculum claim.');
    await page.getByRole('navigation', { name: 'Your story', exact: true }).getByRole('button', { name: 'Hall of Champions', exact: true }).click();
    const standings = page.getByRole('list', { name: 'Provisional weekly standings' });
    await expect(standings).toContainText(nickname);
    await expect(standings.locator('dd')).toHaveText(['60', '120', '3 / 30']);
    await checkpoint('M2-SMOKE-HALL', ['Open local Hall'], '120 lifetime/60 weekly/3 turns from three gates only.', 'Unscored workshop draft added no points/turn; bounded smoke complete, not Q4 or ten-quest completion.');
  } catch (error) {
    await recordCheckpoint(page, info, row('M2-SMOKE-FAILURE', ['Preserve original bounded normal UI failure'], 'Original smoke assertions pass.', error instanceof Error ? error.message : String(error), 'failed')).catch(() => {});
    throw error;
  }
});
