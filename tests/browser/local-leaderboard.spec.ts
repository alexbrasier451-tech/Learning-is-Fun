import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { LeaderboardReadModel } from '../../src/rewards/contracts';
import type { CommitResult, CommittedSnapshot, EncounterSave, StateCommand } from '../../src/state/contracts';
import type { RealHallApi } from '../fixtures/local-leaderboard-api';

// Erased JSON ports only: Node never imports a fixture/browser runtime.
type FixturePort = { model(): LeaderboardReadModel; select(name: string): void; status(value: string): void; history(profileId: string): void; events(): unknown[]; teardown(): void };
type ElementProbe = { scrollWidth: number; clientWidth: number; style: { fontSize: string }; complete?: boolean; naturalWidth?: number;
  getBoundingClientRect(): { width: number; height: number }; };
type BrowserProbe = { hallFixture: FixturePort; document: { documentElement: ElementProbe; querySelectorAll(selector: string): ElementProbe[] };
  getComputedStyle(element: ElementProbe): { fontSize: string; outlineWidth: string } };
declare const window: { realHall: RealHallApi };
const scenario = async (page: Page, name: string) => { await page.selectOption('#scenario', name); };
const model = (page: Page) => page.evaluate(() => (globalThis as unknown as BrowserProbe).hallFixture.model());
async function capture(page: Page, name: string) {
  const data = await model(page);
  await test.info().attach(`${name}-read-model`, { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
  await test.info().attach(`${name}-render`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
}
test.beforeEach(async ({ page }, info) => {
  if (info.title.startsWith('real facade')) return;
  await page.goto('tests/fixtures/local-leaderboard.html'); await expect(page.getByRole('heading', { name: 'Hall of Champions' })).toBeVisible();
});
test.beforeAll(async ({ browser }, info) => { console.log(`${info.project.name}: running ${browser.version()}`); });

test('empty, unscored and single player contain only actual results', async ({ page }) => {
  await scenario(page, 'empty'); await expect(page.getByText('No profiles are saved', { exact: false })).toBeVisible();
  await expect(page.locator('.hall-player')).toHaveCount(0); await expect(page.getByText('No closed results yet.', { exact: false })).toBeVisible(); await capture(page, 'empty');
  await scenario(page, 'unscored'); await expect(page.locator('.hall-player')).toHaveCount(1); await expect(page.getByText('Not yet scored this week')).toBeVisible(); await capture(page, 'unscored');
  await scenario(page, 'single'); const row = page.locator('.hall-player');
  await expect(row.locator('dd')).toHaveText(['20', '20', '1 / 30']); await expect(row.getByText('Provisional rank 1')).toBeVisible(); await capture(page, 'single');
  await row.getByRole('button').click(); await expect(page.getByText('No closed personal best yet')).toBeVisible();
  await expect(page.getByText('No displayed closed results yet')).toBeVisible(); await expect(page.locator('.hall-medal-totals dd')).toHaveText(['0', '0', '0']);
});

test('20/20/10/0 ties and historical names remain exact', async ({ page }) => {
  const before = await model(page);
  expect(before.profiles.map(p => [p.competitivePoints, p.rank])).toEqual([[20, 1], [20, 1], [10, 3], [0, null]]);
  await expect(page.locator('.hall-rank')).toHaveText(['Provisional rank 1', 'Provisional rank 1', 'Provisional rank 3', 'Not yet scored this week']);
  await expect(page.locator('.hall-results .hall-medal')).toHaveText(['Gold medal', 'Gold medal', 'Bronze medal']);
  await expect(page.locator('.hall-results li')).toHaveCount(3); await expect(page.locator('.hall-results')).toContainText('Mira before rename');
  await expect(page.locator('[data-profile="a"] h3')).toHaveText('Amira');
  await expect(page.getByText('2026-10-05 – 2026-10-11 (Europe/London)')).toBeVisible();
  await page.getByText('How points and shared ranks work').click(); await expect(page.getByText('Choosing them never spends points.', { exact: false })).toBeVisible();
  await capture(page, 'ties'); await expect.poll(() => model(page)).toEqual(before);
});

test('30-slot cap separates weekly and lifetime progress', async ({ page }) => {
  await scenario(page, 'cap'); await expect(page.locator('.hall-player dd')).toHaveText(['600', '620', '30 / 30']);
  await expect(page.getByText('All 30 weekly slots used.', { exact: false })).toContainText('lifetime points and adventure progress can continue'); await capture(page, 'cap');
});

test('selected personal records remain separate and unavailable profile is honest', async ({ page }) => {
  const before = await model(page);
  await page.getByRole('button', { name: 'See Cleo’s history' }).click();
  await expect(page.locator('.hall-medal-totals dd')).toHaveText(['0', '0', '1']);
  await expect(page.locator('.hall-personal-stats')).toContainText('40');
  await page.getByRole('button', { name: 'Back to Hall' }).click();
  await page.getByRole('button', { name: 'See Dev’s history' }).click();
  await expect(page.locator('.hall-medal-totals dd')).toHaveText(['0', '0', '0']);
  await expect(page.getByText('No closed personal best yet')).toBeVisible();
  await page.evaluate(() => (globalThis as unknown as BrowserProbe).hallFixture.history('removed-profile'));
  await expect(page.getByRole('heading', { name: 'Profile unavailable' })).toBeFocused();
  await expect(page.getByText('This profile is no longer available.', { exact: false })).toBeVisible();
  await capture(page, 'unavailable-profile'); await expect.poll(() => model(page)).toEqual(before);
});

test('closed deletion omissions preserve rank gaps and empty retained week', async ({ page }) => {
  await scenario(page, 'omitted'); await expect(page.locator('.hall-results li')).toHaveCount(1);
  await expect(page.locator('.hall-results')).toContainText('Rank 3 · 10 weekly points'); await expect(page.locator('.hall-results')).toContainText('Bronze medal');
  await expect(page.getByText('Deleted profiles are omitted.', { exact: false })).toBeVisible(); await capture(page, 'omitted');
  await page.getByRole('button', { name: 'See Cleo’s history' }).click(); await expect(page.locator('.hall-personal-weeks')).toContainText('Rank 3');
  await page.getByRole('button', { name: 'Back to Hall' }).click(); await scenario(page, 'deleted');
  await expect(page.getByText('No entries remain for this closed week.')).toBeVisible(); await expect(page.locator('.hall-closed-week')).toContainText('2026-09-28'); await capture(page, 'deleted');
});

test('52 displayed archives retain 53 lifetime medals and older personal best', async ({ page }) => {
  await scenario(page, 'archive'); const before = await model(page); expect(before.recentClosedResults).toHaveLength(52);
  await expect(page.locator('.hall-older-week')).toHaveCount(51);
  await page.getByRole('button', { name: 'See Amira’s history' }).click(); await expect(page.locator('.hall-medal-totals dd')).toHaveText(['53', '0', '0']);
  await expect(page.locator('.hall-personal-weeks > li')).toHaveCount(52);
  await expect(page.locator('.hall-personal-stats')).toContainText(before.personalRecordsByProfile.a.best!.week);
  expect(before.recentClosedResults.some(result => result.week === before.personalRecordsByProfile.a.best!.week)).toBe(false);
  await capture(page, 'personal-archive'); await expect.poll(() => model(page)).toEqual(before);
});

test('calendar rollback, loading and failed refresh retain honest prior rows', async ({ page }) => {
  await scenario(page, 'clock'); await expect(page.getByRole('note')).toContainText('clock is earlier'); await capture(page, 'clock');
  const before = await model(page); await page.getByRole('button', { name: 'Check calendar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('last committed results'); await expect(page.getByRole('button', { name: 'Checking calendar…' })).toBeDisabled();
  await expect(page.locator('.hall-player')).toHaveCount(4); await capture(page, 'refreshing');
  await page.evaluate(() => (globalThis as unknown as BrowserProbe).hallFixture.status('failed'));
  await expect(page.getByRole('status')).toContainText('new week or closed result has not been confirmed'); await capture(page, 'failed');
  await page.evaluate(() => (globalThis as unknown as BrowserProbe).hallFixture.status('loading')); await expect(page.getByRole('status')).toContainText('Loading saved results'); await capture(page, 'loading');
  await page.evaluate(() => (globalThis as unknown as BrowserProbe).hallFixture.status('stale')); await expect(page.getByRole('status')).toContainText('Check the calendar to confirm'); await capture(page, 'stale');
  await expect.poll(() => model(page)).toEqual(before);
});

test('keyboard and touch history/back routes restore focus without awards', async ({ page, hasTouch }) => {
  const before = await model(page); await expect(page.getByRole('heading', { name: 'Hall of Champions' })).toBeFocused();
  const open = page.getByRole('button', { name: 'See Amira’s history' });
  await open.focus(); expect(await open.evaluate(element => (globalThis as unknown as BrowserProbe).getComputedStyle(element as unknown as ElementProbe).outlineWidth)).toBe('3px');
  await open.press('Enter'); await expect(page.getByRole('heading', { name: 'Amira’s history' })).toBeFocused();
  await page.getByRole('heading', { name: 'Amira’s history' }).press('Escape'); await expect(open).toBeFocused();
  if (hasTouch) { await open.tap(); await page.getByRole('button', { name: 'Back to Hall' }).tap(); await expect(open).toBeFocused(); }
  await page.getByRole('button', { name: 'Back to adventure' }).focus(); await page.keyboard.press('Escape'); await expect(page.locator('#scenario')).toBeFocused();
  await expect.poll(() => model(page)).toEqual(before);
  await page.evaluate(() => (globalThis as unknown as BrowserProbe).hallFixture.teardown()); await expect(page.locator('.hall')).toHaveCount(0);
});

test('rendered art, targets, 200 percent text reflow and rotation', async ({ page }) => {
  await expect.poll(() => page.locator('.hall img').evaluateAll(images => images.every(image => (image as unknown as ElementProbe).complete && (image as unknown as ElementProbe).naturalWidth! > 0))).toBe(true);
  const inspect = () => page.locator('.hall').evaluate(element => {
    const probe = globalThis as unknown as BrowserProbe;
    const targets = Array.from(probe.document.querySelectorAll('.hall button, .hall summary')).map(target => target.getBoundingClientRect());
    return { overflow: probe.document.documentElement.scrollWidth > probe.document.documentElement.clientWidth,
      font: probe.getComputedStyle(element as unknown as ElementProbe).fontSize,
      targets: targets.every(target => target.width >= 44 && target.height >= 44) };
  });
  expect(await inspect()).toMatchObject({ overflow: false, font: '18px', targets: true }); await capture(page, 'layout-baseline');
  await page.evaluate(() => { (globalThis as unknown as BrowserProbe).document.documentElement.style.fontSize = '32px'; });
  await page.setViewportSize({ width: 683, height: 768 }); expect(await inspect()).toMatchObject({ overflow: false, font: '36px', targets: true }); await capture(page, 'text-200-reflow');
  await page.getByRole('button', { name: 'See Amira’s history' }).click(); expect(await inspect()).toMatchObject({ overflow: false, targets: true });
  await page.setViewportSize({ width: 1024, height: 768 }); expect(await inspect()).toMatchObject({ overflow: false, targets: true }); await capture(page, 'text-200-history-landscape');
  await page.setViewportSize({ width: 768, height: 1024 }); expect(await inspect()).toMatchObject({ overflow: false, targets: true });
  await page.getByRole('button', { name: 'Back to Hall' }).click(); await expect(page.getByRole('button', { name: 'See Amira’s history' })).toBeFocused();
});

async function realBoot(page: Page, namespace?: string) {
  await page.goto(`tests/fixtures/local-leaderboard.html?mode=real${namespace ? `&namespace=${namespace}` : ''}`);
  await page.waitForFunction(() => !!window.realHall);
  const loaded = await page.evaluate(() => window.realHall.ready());
  expect(['new', 'ready']).toContain(loaded.status);
  await expect(page.getByRole('button', { name: 'Open Hall' })).toBeVisible();
}
const realSnapshot = (page: Page) => page.evaluate(() => window.realHall.snapshot()!);
const realModel = (page: Page) => page.evaluate(() => window.realHall.model()!);
async function realSend(page: Page, kind: StateCommand['kind'], payload: unknown, profileId?: string): Promise<CommitResult> {
  return page.evaluate(({ kind, payload, profileId }) => window.realHall.send(kind, payload, profileId), { kind, payload, profileId });
}
async function realScore(page: Page) {
  expect(await realSend(page, 'CreateProfile', { newProfileId: 'hall-player', nickname: 'Amira', avatarId: 'pip' })).toMatchObject({ status: 'committed' });
  expect(await realSend(page, 'OpenEncounter', { route: { kind: 'quest', questId: 'Q1' }, suppressDueReviewForVisit: true }, 'hall-player')).toMatchObject({ status: 'committed' });
  const e: EncounterSave = Object.values((await realSnapshot(page)).save.profiles['hall-player'].encounters)[0];
  expect(await realSend(page, 'SubmitCheck', { encounterId: e.encounterId, learningEpisodeOrdinal: e.learningEpisode.ordinal, submissionId: 'hall-check',
    checkSequence: e.validChecks + 1, response: { kind: 'bridge', planks: [6, 6] } }, 'hall-player')).toMatchObject({ status: 'committed',
    changes: { earnedPoints: { lifetimeDelta: 40, competitiveDelta: 20 } } });
  const saved = await realSnapshot(page);
  expect(saved.save.competition.currentScores).toEqual({ 'hall-player': 20 });
  expect(saved.save.profiles['hall-player'].rewards.lifetimePoints).toBe(40);
  await page.getByRole('button', { name: 'Open Hall' }).click();
  await expect(page.getByRole('status')).toContainText('Calendar checked');
  await expect(page.locator('.hall-player dd')).toHaveText(['20', '40', '1 / 30']);
  return saved;
}
async function realEvidence(page: Page, name: string) {
  const data = await page.evaluate(async () => ({ model: window.realHall.model(), status: window.realHall.status(), snapshot: window.realHall.snapshot(),
    native: await window.realHall.nativeRoot(), lastRefresh: window.realHall.lastRefresh(), events: window.realHall.events(), clockReads: window.realHall.clockReads(), lifecycle: window.realHall.lifecycle() }));
  await test.info().attach(`${name}-native-facade-model`, { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
  await test.info().attach(`${name}-render`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
}
function expectClosed(saved: CommittedSnapshot) {
  expect(saved.save.competition).toMatchObject({ latestOpenedWeek: '2026-10-12', currentScores: {}, currentSlots: {} });
  expect(saved.save.competition.archives).toHaveLength(1);
  expect(saved.save.competition.archives[0]).toMatchObject({ week: '2026-10-05', entries: [{ profileId: 'hall-player', points: 20, rank: 1, medal: 'gold' }] });
  expect(saved.save.profiles['hall-player'].personalRecords).toEqual({ best: { points: 20, week: '2026-10-05' }, medals: { gold: 1, silver: 0, bronze: 0 } });
  expect(saved.save.profiles['hall-player'].rewards.lifetimePoints).toBe(40);
}

test('real facade opening refreshes native committed rollover once before displaying new closed results', async ({ page }) => {
  await realBoot(page); const old = await realScore(page), oldModel = await realModel(page);
  await realEvidence(page, 'real-positive-before-rollover');
  await page.getByRole('button', { name: 'Back to adventure' }).click();
  await expect(page.getByRole('button', { name: 'Open Hall' })).toBeFocused();
  const clocks = await page.evaluate(() => window.realHall.clockReads());
  await page.evaluate(() => { window.realHall.setNow('2026-10-12T12:00:00Z'); window.realHall.hold(); });
  await page.getByRole('button', { name: 'Open Hall' }).click();
  await expect.poll(() => page.evaluate(() => window.realHall.held())).toBe(true);
  await expect(page.getByRole('status')).toContainText('last committed results');
  expect(await realModel(page)).toEqual(oldModel); await expect(page.locator('.hall-results li')).toHaveCount(0);
  expect(await page.evaluate(() => window.realHall.nativeRoot())).toEqual({ ...old.token, save: old.save });
  expect(await page.evaluate(() => window.realHall.clockReads())).toBe(clocks + 1);
  await realEvidence(page, 'real-pending-prior-display');
  await page.evaluate(() => window.realHall.release()); await expect(page.getByRole('status')).toContainText('Calendar checked');
  const closed = await realSnapshot(page); expectClosed(closed); expect(closed.token.revision).toBe(old.token.revision + 1);
  expect(await page.evaluate(() => window.realHall.nativeRoot())).toEqual({ ...closed.token, save: closed.save });
  await expect(page.locator('.hall-player dd')).toHaveText(['0', '40', '0 / 30']); await expect(page.locator('.hall-results')).toContainText('Gold medal');
  await expect(page.getByText('2026-10-12 – 2026-10-18 (Europe/London)')).toBeVisible(); await realEvidence(page, 'real-acknowledged-closed');
  await page.getByRole('button', { name: 'See Amira’s history' }).click(); await expect(page.locator('.hall-medal-totals dd')).toHaveText(['1', '0', '0']);
  await page.getByRole('button', { name: 'Back to Hall' }).click(); await page.getByRole('button', { name: 'Back to adventure' }).click();
  await page.getByRole('button', { name: 'Open Hall' }).click(); await expect(page.getByRole('status')).toContainText('Calendar checked');
  expect(await page.evaluate(() => window.realHall.lastRefresh()!.status)).toBe('already-applied'); expect(await realSnapshot(page)).toEqual(closed);
  expectClosed(await realSnapshot(page)); await realEvidence(page, 'real-repeat-open-no-second-medal');
});

test('real facade aborted calendar write retains failed prior display until acknowledged retry', async ({ page }) => {
  await realBoot(page); const old = await realScore(page), oldModel = await realModel(page);
  await page.evaluate(() => { window.realHall.setNow('2026-10-12T12:00:00Z'); window.realHall.abort(); });
  await page.getByRole('button', { name: 'Check calendar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('calendar check failed');
  expect(await page.evaluate(() => window.realHall.lastRefresh()!.status)).toBe('save-failed');
  expect(await realSnapshot(page)).toEqual(old); expect(await realModel(page)).toEqual(oldModel);
  expect(await page.evaluate(() => window.realHall.nativeRoot())).toEqual({ ...old.token, save: old.save });
  await expect(page.locator('.hall-player dd')).toHaveText(['20', '40', '1 / 30']); await expect(page.locator('.hall-results li')).toHaveCount(0);
  await realEvidence(page, 'real-aborted-calendar-prior-results');
  await page.getByRole('button', { name: 'Check calendar', exact: true }).click(); await expect(page.getByRole('status')).toContainText('Calendar checked');
  const closed = await realSnapshot(page); expectClosed(closed); expect(closed.token.revision).toBe(old.token.revision + 1);
  expect(await page.evaluate(() => window.realHall.nativeRoot())).toEqual({ ...closed.token, save: closed.save });
  await realEvidence(page, 'real-calendar-retry-one-closure');
});

test('real facade two-tab revision conflict retains visibly stale acknowledged model', async ({ page, context }) => {
  const namespace = `conflict-${Date.now()}`;
  await realBoot(page, namespace); const old = await realScore(page), oldModel = await realModel(page);
  const other = await context.newPage(); await realBoot(other, namespace);
  await page.evaluate(() => window.realHall.hold()); await page.getByRole('button', { name: 'Check calendar', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.realHall.held())).toBe(true);
  expect(await realSend(other, 'RenameProfile', { nickname: 'Mira' }, 'hall-player')).toMatchObject({ status: 'committed' });
  const winner = await realSnapshot(other); expect(winner.token.revision).toBe(old.token.revision + 1);
  await page.evaluate(() => window.realHall.release()); await expect(page.getByRole('status')).toContainText('Check the calendar to confirm');
  expect(await page.evaluate(() => window.realHall.lastRefresh()!.status)).toBe('conflict'); expect(await realModel(page)).toEqual(oldModel);
  await expect(page.locator('.hall-player h3')).toHaveText('Amira'); expect(await realSnapshot(page)).toEqual(winner);
  expect(await page.evaluate(() => window.realHall.nativeRoot())).toEqual({ ...winner.token, save: winner.save });
  await realEvidence(page, 'real-revision-conflict-stale-prior-model');
  await page.getByRole('button', { name: 'Check calendar', exact: true }).click(); await expect(page.getByRole('status')).toContainText('Calendar checked');
  await expect(page.locator('.hall-player h3')).toHaveText('Mira'); expect(await realSnapshot(page)).toEqual(winner);
  expect((await realSnapshot(page)).save.profiles['hall-player'].personalRecords.medals).toEqual({ gold: 0, silver: 0, bronze: 0 });
  await realEvidence(page, 'real-explicit-refresh-accepts-winner'); await other.close();
});

test('real facade later presentation observation stays stale without reconstructing a new week', async ({ page }) => {
  await realBoot(page); const old = await realScore(page), oldModel = await realModel(page);
  const reads = await page.evaluate(() => window.realHall.clockReads());
  await page.evaluate(() => window.realHall.setObservation('2026-10-12T12:00:00Z'));
  await page.getByRole('button', { name: 'Check calendar', exact: true }).click(); await expect(page.getByRole('status')).toContainText('Check the calendar to confirm');
  expect(await page.evaluate(() => window.realHall.lastRefresh()!.status)).toBe('already-applied');
  expect(await realSnapshot(page)).toEqual(old); expect(await realModel(page)).toEqual(oldModel);
  expect(await page.evaluate(() => window.realHall.clockReads())).toBe(reads + 1);
  await realEvidence(page, 'real-later-presentation-keeps-prior');
  await page.evaluate(() => { window.realHall.setNow('2026-10-12T12:00:00Z'); window.realHall.setObservation(null); });
  await page.getByRole('button', { name: 'Check calendar', exact: true }).click(); await expect(page.getByRole('status')).toContainText('Calendar checked');
  expectClosed(await realSnapshot(page)); await realEvidence(page, 'real-new-observation-after-acknowledgement');
});

test('real facade rollback displays actual notice and disposal removes subscription without changing history', async ({ page }) => {
  await realBoot(page); await realScore(page);
  await page.evaluate(() => window.realHall.setNow('2026-10-12T12:00:00Z'));
  await page.getByRole('button', { name: 'Check calendar', exact: true }).click(); await expect(page.getByRole('status')).toContainText('Calendar checked');
  const closed = await realSnapshot(page); expectClosed(closed);
  await page.evaluate(() => window.realHall.setNow('2026-10-09T12:00:00Z'));
  await page.getByRole('button', { name: 'Check calendar', exact: true }).click(); await expect(page.getByRole('note')).toContainText('clock is earlier than the active London week (2026-10-12)');
  expect(await realSnapshot(page)).toEqual(closed); expect(await page.evaluate(() => window.realHall.lastRefresh()!.status)).toBe('already-applied');
  expect((await realModel(page)).activeWeek).toBe('2026-10-12'); await realEvidence(page, 'real-rollback-keeps-committed-closed-week');
  const subscribed = await page.evaluate(() => window.realHall.lifecycle()); expect(subscribed.subscriptionActive).toBe(true); expect(subscribed.notifications).toBeGreaterThan(0);
  await page.evaluate(() => { window.realHall.teardown(); window.realHall.teardown(); }); await expect(page.locator('.hall')).toHaveCount(0);
  expect(await page.evaluate(() => window.realHall.lifecycle())).toEqual({ ...subscribed, subscriptionActive: false, disposed: true });
  expect(await realSend(page, 'RenameProfile', { nickname: 'Must not save' }, 'hall-player')).toMatchObject({ status: 'save-failed' });
  expect(await page.evaluate(() => window.realHall.nativeRoot())).toEqual({ ...closed.token, save: closed.save });
  expect(await page.evaluate(() => window.realHall.lifecycle())).toEqual({ ...subscribed, subscriptionActive: false, disposed: true });
});
