import { test, expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import type { ActivityResponse } from '../../src/learning/contracts';
import type { EncounterSave, StateCommand } from '../../src/state/contracts';
import type { StateIntegrationApi } from '../fixtures/state-integration-api';

// Module-local: callbacks execute in the browser; the Node compiler has no DOM.
declare const window: { stateIntegration: StateIntegrationApi };

const bridge: ActivityResponse = { kind: 'bridge', planks: [6, 6] };
const wrong: ActivityResponse = { kind: 'bridge', planks: [1] };
async function boot(page: Page, namespace = randomUUID(), future = false) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`tests/fixtures/state-integration.html?namespace=${namespace}${future ? '&future=yes' : ''}`);
  await page.waitForFunction(() => !!window.stateIntegration);
  const load = await page.evaluate(() => window.stateIntegration.controller().ready);
  expect(load.status).toBe(future ? 'unsupported' : 'new');
  return { namespace, errors };
}
const snapshot = (page: Page) => page.evaluate(() => window.stateIntegration.snapshot()!);
async function send(page: Page, kind: StateCommand['kind'], payload: unknown, profileId?: string) {
  return page.evaluate(({ kind, payload, profileId }) => window.stateIntegration.send(kind, payload, profileId), { kind, payload, profileId });
}
async function create(page: Page, profileId = 'ada') {
  expect(await send(page, 'CreateProfile', { newProfileId: profileId, nickname: profileId, avatarId: 'pip' })).toMatchObject({ status: 'committed' });
}
async function open(page: Page, route: unknown, profileId = 'ada', suppress = true): Promise<EncounterSave> {
  const result = await send(page, 'OpenEncounter', { route, suppressDueReviewForVisit: suppress }, profileId);
  expect(result, JSON.stringify(result)).toMatchObject({ status: 'committed' });
  return Object.values((await snapshot(page)).save.profiles[profileId].encounters).reverse().find(e => e.learningEpisode.status === 'open')!;
}
async function check(page: Page, e: EncounterSave, response: ActivityResponse, profileId = 'ada') {
  const payload = { encounterId: e.encounterId, learningEpisodeOrdinal: e.learningEpisode.ordinal, submissionId: randomUUID(), checkSequence: e.validChecks + 1, response };
  const command = await page.evaluate(({ payload, profileId }) => window.stateIntegration.make('SubmitCheck', payload, profileId), { payload, profileId });
  const result = await page.evaluate(command => window.stateIntegration.dispatch(command), command);
  expect(result, JSON.stringify(result)).toMatchObject({ status: 'committed' });
  return { command, result };
}
async function evidence(page: Page, info: TestInfo, name: string) {
  const data = await page.evaluate(async () => ({ snapshot: window.stateIntegration.snapshot(), native: await window.stateIntegration.nativeRoot(),
    events: window.stateIntegration.events(), celebrations: window.stateIntegration.celebrations(), readiness: window.stateIntegration.controller().getUpdateReadiness() }));
  await info.attach(name, { body: JSON.stringify({ browserVersion: page.context().browser()?.version(), ...data }, null, 2), contentType: 'application/json' });
}

test('command host original anchor flow commits exactly 100 lifetime / 40 weekly / 3 slots and reloads', async ({ page }, info) => {
  const { errors } = await boot(page);
  await page.getByLabel('Command JSON').fill(JSON.stringify({ kind: 'CreateProfile', payload: { newProfileId: 'ada', nickname: 'Ada', avatarId: 'pip' } }));
  await page.getByRole('button', { name: 'Dispatch command' }).click();
  await expect(page.getByTestId('command-status')).toHaveText('committed');
  let e = await open(page, { kind: 'quest', questId: 'Q1' });
  const hintId = await page.evaluate(id => window.stateIntegration.catalogue.find(t => t.canonicalQuestionId === id)!.hints[0].id, e.canonicalQuestionId);
  expect(await send(page, 'RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'answer-hint', hintId }, 'ada')).toMatchObject({ status: 'committed' });
  expect((await check(page, e, bridge)).result).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 30, competitiveDelta: 10 } } });
  e = await open(page, { kind: 'quest', questId: 'Q2' });
  expect((await check(page, e, { kind: 'punctuation', slots: { question: '?', discovery: '!' } })).result).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 40, competitiveDelta: 20 } } });
  e = await open(page, { kind: 'quest', questId: 'Q3' });
  await check(page, e, { kind: 'merchant', apples: 3, pears: 6 });
  e = (await snapshot(page)).save.profiles.ada.encounters[e.encounterId];
  const final = await check(page, e, { kind: 'merchant', apples: 6, pears: 3 });
  const saved = await snapshot(page);
  expect(saved.save.profiles.ada.rewards).toMatchObject({ lifetimePoints: 100, entitlementIds: ['scarf-leaf', 'planter-rim'] });
  expect(saved.save.profiles.ada.rewards.questReceipts).toHaveLength(3);
  expect(saved.save.profiles.ada.world).toEqual({ completedQuestIds: ['Q1', 'Q2', 'Q3'], completedStoryBindingIds: ['q1-story-m01', 'q2-story-e06', 'q3-story-m04'] });
  expect(saved.save.competition.currentScores).toEqual({ ada: 40 }); expect(saved.save.competition.currentSlots.ada).toHaveLength(3);
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), final.command)).toMatchObject({ status: 'already-applied' });
  expect(await page.evaluate(() => window.stateIntegration.celebrations().length)).toBe(4);
  await evidence(page, info, 'original-100-40-3-before-reload');
  await page.reload(); await page.waitForFunction(() => !!window.stateIntegration); await page.evaluate(() => window.stateIntegration.controller().ready);
  expect(await snapshot(page)).toEqual(saved);
  expect(await page.evaluate(id => window.stateIntegration.projection('ada', id), e.encounterId)).toMatchObject({ status: 'ready', activity: { lastEvaluation: { correct: true }, nextCheckSequence: 3 } });
  expect(errors).toEqual([]);
});

test('abort after candidate put publishes nothing; exact retry then stale duplicate commits one Check', async ({ page }, info) => {
  const { errors } = await boot(page); await create(page); const e = await open(page, { kind: 'quest', questId: 'Q1' });
  const before = await snapshot(page);
  const command = await page.evaluate(({ encounterId, response }) => window.stateIntegration.make('SubmitCheck', { encounterId, response, learningEpisodeOrdinal: 1, submissionId: 'abort-check', checkSequence: 1 }, 'ada'), { encounterId: e.encounterId, response: bridge });
  await page.evaluate(() => window.stateIntegration.abort());
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), command)).toMatchObject({ status: 'save-failed', snapshot: before });
  expect(await snapshot(page)).toEqual(before);
  expect(await page.evaluate(() => window.stateIntegration.nativeRoot())).toEqual({ ...before.token, save: before.save });
  expect(await page.evaluate(() => window.stateIntegration.celebrations())).toEqual([]);
  expect(await page.evaluate(() => window.stateIntegration.controller().getUpdateReadiness())).toMatchObject({ ready: false, failedCommand: true });
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), command)).toMatchObject({ status: 'committed', changes: { earnedPoints: { lifetimeDelta: 40, competitiveDelta: 20 } } });
  const after = await snapshot(page);
  expect(after.token.revision).toBe(before.token.revision + 1);
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), command)).toMatchObject({ status: 'already-applied' });
  expect(await page.evaluate(() => window.stateIntegration.celebrations().length)).toBe(1);
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: true });
  await evidence(page, info, 'abort-and-exact-retry'); expect(errors).toEqual([]);
});

test('four profiles capture profile, response, epoch and one operation clock before asynchronous queue wait', async ({ page }, info) => {
  await boot(page); for (const id of ['ada', 'ben', 'cy', 'dee']) await create(page, id);
  const ada = await open(page, { kind: 'quest', questId: 'Q1' });
  const result = await page.evaluate(async ({ encounterId, response }) => {
    const api = window.stateIntegration, c = api.controller(), before = api.clockReads();
    const command = api.make('SubmitCheck', { encounterId, response, learningEpisodeOrdinal: 1, submissionId: 'captured-check', checkSequence: 1 }, 'ada');
    api.hold(); const pending = api.dispatch(command);
    // Mutate caller-owned data immediately after dispatch; captured data must win.
    Object.assign(command, { profileId: 'ben' }); Object.assign(command.payload, { response: { kind: 'bridge', planks: [1] } });
    await new Promise(resolve => setTimeout(resolve, 0));
    api.setNow('2026-10-12T12:00:00Z');
    const waiting = c.getUpdateReadiness(); api.release(); const saved = await pending;
    return { waiting, saved, clockReads: api.clockReads() - before };
  }, { encounterId: ada.encounterId, response: bridge });
  expect(result).toMatchObject({ waiting: { pendingCommands: 1, ready: false }, saved: { status: 'committed' }, clockReads: 1 });
  let saved = await snapshot(page); expect(saved.save.profiles.ada.rewards.lifetimePoints).toBe(40); expect(saved.save.profiles.ben.rewards.lifetimePoints).toBe(0);
  expect(saved.save.competition.latestOpenedWeek).toBe('2026-10-05');
  await send(page, 'RenameProfile', { nickname: 'Ada renamed' }, 'ada');
  const ben = await open(page, { kind: 'quest', questId: 'Q1' }, 'ben'); await check(page, ben, wrong, 'ben');
  saved = await snapshot(page);
  expect(saved.save.profiles.ada.identity.nickname).toBe('Ada renamed'); expect(saved.save.profiles.ada.rewards.lifetimePoints).toBe(40);
  expect(saved.save.profiles.ben.rewards.lifetimePoints).toBe(5);
  expect(saved.save.profiles.cy.rewards.lifetimePoints).toBe(0); expect(saved.save.profiles.dee.rewards.lifetimePoints).toBe(0);
  await evidence(page, info, 'four-profiles-captured-operation');
});

test('two real tabs reject stale edits, recognize identical retained Check, and reject mismatched or old-epoch replay', async ({ page, context }, info) => {
  const { namespace } = await boot(page); await create(page); const e = await open(page, { kind: 'quest', questId: 'Q1' });
  const other = await context.newPage();
  await other.goto(`tests/fixtures/state-integration.html?namespace=${namespace}`); await other.waitForFunction(() => !!window.stateIntegration); await other.evaluate(() => window.stateIntegration.controller().ready);
  const stale = await other.evaluate(() => window.stateIntegration.make('RenameProfile', { nickname: 'stale' }, 'ada'));
  const checked = await check(page, e, wrong);
  expect(await other.evaluate(c => window.stateIntegration.dispatch(c), stale)).toMatchObject({ status: 'conflict' });
  expect(await other.evaluate(c => window.stateIntegration.dispatch(c), checked.command)).toMatchObject({ status: 'already-applied' });
  const mismatch = { ...checked.command, actionId: randomUUID(), payload: { ...checked.command.payload, response: bridge } } as StateCommand;
  expect(await other.evaluate(c => window.stateIntegration.dispatch(c), mismatch)).toMatchObject({ status: 'conflict' });
  const currentMismatch = await other.evaluate(c => window.stateIntegration.dispatch({ ...c, actionId: crypto.randomUUID(), expected: window.stateIntegration.controller().getSnapshot().token }), mismatch);
  expect(currentMismatch).toMatchObject({ status: 'invalid', reason: { code: 'submission-mismatch' } });
  const reset = await send(page, 'ResetSave', {}); expect(reset).toMatchObject({ status: 'committed' });
  expect((await snapshot(page)).token.epoch).not.toBe(checked.command.expected.epoch);
  expect(await other.evaluate(c => window.stateIntegration.dispatch(c), checked.command)).toMatchObject({ status: 'conflict' });
  expect((await snapshot(page)).save.profiles).toEqual({}); await evidence(page, info, 'two-tabs-token-order');
  await other.close();
});

test('wrong before Monday, finish/reload/resume, late success commits closure and personal records together', async ({ page }, info) => {
  await boot(page); await create(page); let e = await open(page, { kind: 'quest', questId: 'Q1' }); await check(page, e, wrong);
  const finishPayload = { encounterId: e.encounterId, learningEpisodeOrdinal: 1 };
  await send(page, 'SuspendEncounter', { ...finishPayload, responseDraft: { kind: 'bridge', planks: [6] } }, 'ada');
  expect((await snapshot(page)).save.profiles.ada.learning.evidence.M01!.bands.support.completedEpisodes).toBe(0);
  const finish = await page.evaluate(payload => window.stateIntegration.make('FinishPractice', payload, 'ada'), finishPayload);
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), finish)).toMatchObject({ status: 'committed' });
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), finish)).toMatchObject({ status: 'already-applied' });
  const previous = (await snapshot(page)).save.profiles.ada.encounters[e.encounterId];
  await page.reload(); await page.waitForFunction(() => !!window.stateIntegration); await page.evaluate(() => window.stateIntegration.controller().ready);
  await page.evaluate(() => window.stateIntegration.setNow('2026-10-12T12:00:00Z'));
  // Resume itself can reconcile time, so perform it with the old clock; the Check
  // is the sole new-week triggering mutation in the atomic closure assertion.
  await page.evaluate(() => window.stateIntegration.setNow('2026-10-09T12:00:00Z'));
  await send(page, 'OpenEncounter', { resumeEncounterId: e.encounterId, suppressDueReviewForVisit: true }, 'ada');
  e = (await snapshot(page)).save.profiles.ada.encounters[e.encounterId];
  expect(e).toMatchObject({ encounterId: previous.encounterId, opportunityId: previous.opportunityId, validChecks: 1, learningEpisode: { ordinal: 2, validChecks: 0 } });
  expect(await send(page, 'FinishPractice', finishPayload, 'ada')).toMatchObject({ status: 'invalid', reason: { code: 'stale-episode' } });
  await page.evaluate(() => window.stateIntegration.setNow('2026-10-12T12:00:00Z'));
  const before = await snapshot(page);
  const result = await check(page, e, bridge);
  expect(result.result).toMatchObject({ changes: { closedWeekIds: ['2026-10-05'], earnedPoints: { lifetimeDelta: 25, competitiveDelta: 0 } } });
  const after = await snapshot(page); expect(after.token.revision).toBe(before.token.revision + 1);
  expect(after.save.profiles.ada.personalRecords).toEqual({ best: { points: 5, week: '2026-10-05' }, medals: { gold: 1, silver: 0, bronze: 0 } });
  expect(after.save.competition.currentScores).toEqual({}); expect(after.save.competition.archives[0].entries[0].points).toBe(5);
  expect(after.save.profiles.ada.rewards.tracksByCanonical[e.canonicalQuestionId].recentCompletedOpportunity).toMatchObject({ earningWeek: '2026-10-05', slot: 1, firstSuccessWeek: '2026-10-12' });
  await evidence(page, info, 'late-success-closure-records');
});

test('committed projection, edited draft, failed Check and backup restore never rejudge or celebrate', async ({ page }, info) => {
  await boot(page); await create(page); const e = await open(page, { kind: 'quest', questId: 'Q1' });
  expect(await page.evaluate(id => window.stateIntegration.projection('ada', id), e.encounterId)).toMatchObject({ activity: { lastCheck: null, responseDraft: null } });
  const first = await check(page, e, wrong);
  await send(page, 'SaveDraft', { encounterId: e.encounterId, responseDraft: { kind: 'bridge', planks: [] } }, 'ada');
  const projected = await page.evaluate(id => window.stateIntegration.projection('ada', id), e.encounterId);
  expect(projected).toMatchObject({ status: 'ready', activity: { lastEvaluation: { correct: false }, responseDraft: { kind: 'bridge', planks: [] }, lastCheck: { response: wrong } } });
  const backup = await page.evaluate(() => window.stateIntegration.controller().backupActions.export('flushed'));
  expect(backup.status).toBe('ready'); if (backup.status !== 'ready') return;
  await page.evaluate(() => window.stateIntegration.abort());
  const failedCheck = await send(page, 'SubmitCheck', { encounterId: e.encounterId, learningEpisodeOrdinal: 1, checkSequence: 2, submissionId: 'failed-success', response: bridge }, 'ada');
  expect(failedCheck.status).toBe('save-failed');
  expect(await page.evaluate(id => window.stateIntegration.projection('ada', id), e.encounterId)).toEqual(projected);
  expect(await page.evaluate(() => window.stateIntegration.controller().backupActions.export('flushed'))).toMatchObject({ status: 'blocked' });
  expect(await page.evaluate(() => window.stateIntegration.controller().backupActions.export('last-committed'))).toMatchObject({ status: 'ready', source: 'last-committed-recovery' });
  const restored = await page.evaluate(async json => {
    const c = window.stateIntegration.controller(), before = c.getSnapshot();
    const preview = await c.backupActions.prepare(new File([json], 'save.json', { type: 'application/json' }));
    if (preview.status !== 'ready') return preview;
    const result = await c.backupActions.confirm(preview.preview.preparedImportId);
    return { result, before: before.token, after: c.getSnapshot().token, second: await c.backupActions.confirm(preview.preview.preparedImportId) };
  }, backup.backup.json);
  expect(restored).toMatchObject({ result: { status: 'committed' }, second: { status: 'invalid', reason: { code: 'prepared-import-expired' } } });
  const projectionAfter = await page.evaluate(id => window.stateIntegration.projection('ada', id), e.encounterId);
  expect(projectionAfter).toMatchObject({ status: 'ready', activity: { lastEvaluation: { correct: false }, responseDraft: { kind: 'bridge', planks: [] } } });
  expect(await page.evaluate(() => window.stateIntegration.celebrations().length)).toBe(1);
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), first.command)).toMatchObject({ status: 'conflict' });
  await evidence(page, info, 'projection-backup-and-epoch');
});

test('suspension failure is owned by current panel; discard cannot clear a failed Check or failed preference', async ({ page }, info) => {
  await boot(page); await create(page); const e = await open(page, { kind: 'quest', questId: 'Q1' });
  await page.evaluate(() => { window.stateIntegration.readiness({ dirty: true, pending: false, failed: false }); window.stateIntegration.abort(); });
  expect(await send(page, 'SuspendEncounter', { encounterId: e.encounterId, learningEpisodeOrdinal: 1, responseDraft: wrong }, 'ada')).toMatchObject({ status: 'save-failed' });
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: false, failedCommand: false, unsavedTransition: true });
  await page.evaluate(() => window.stateIntegration.readiness({ dirty: false, pending: false, failed: false }));
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: true });
  const current = await page.evaluate(async encounterId => {
    const api = window.stateIntegration, c = api.controller(); api.hold(); api.readiness({ dirty: true, pending: true, failed: false });
    const pending = api.send('SuspendEncounter', { encounterId, learningEpisodeOrdinal: 1, responseDraft: wrongResponse() }, 'ada');
    await new Promise(resolve => setTimeout(resolve, 0));
    // New registered panel replaces the old panel during its deferred completion.
    api.readiness({ dirty: false, pending: false, failed: true }); api.release();
    const result = await pending; return { result, readiness: await c.flush() };
    function wrongResponse() { return { kind: 'bridge', planks: [1] }; }
  }, e.encounterId);
  expect(current).toMatchObject({ result: { status: 'committed' }, readiness: { ready: false, unsavedTransition: true, failedCommand: false } });
  await page.evaluate(() => window.stateIntegration.readiness({ dirty: false, pending: false, failed: false }));
  await send(page, 'OpenEncounter', { resumeEncounterId: e.encounterId, suppressDueReviewForVisit: true }, 'ada');
  await page.evaluate(() => window.stateIntegration.abort());
  const c = await page.evaluate(id => window.stateIntegration.make('SubmitCheck', { encounterId: id, learningEpisodeOrdinal: 1, submissionId: 'pending-failed-check', checkSequence: 1, response: { kind: 'bridge', planks: [1] } }, 'ada'), e.encounterId);
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), c)).toMatchObject({ status: 'save-failed' });
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: false, failedCommand: true, unsavedTransition: false });
  await page.evaluate(c => window.stateIntegration.dispatch(c), c);
  const silence = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(); api.abort();
    c.preferences.setAudioPreferences({ kind: 'silence-all' });
    const immediate = c.preferences.getStatus(); const gates = api.events(); const readiness = await c.flush();
    return { immediate, gates, readiness, saved: c.getSnapshot().save.installation.audio };
  });
  expect(silence).toMatchObject({ immediate: { requestedAudio: { silenceAll: true } }, readiness: { ready: false, failedPreferences: true }, saved: { silenceAll: false } });
  expect(silence.gates).toContainEqual({ stage: 'gate', intent: { kind: 'silence-all' } });
  expect(await page.evaluate(async () => { const c = window.stateIntegration.controller(); c.preferences.retry(); return c.flush(); })).toMatchObject({ ready: true });
  await page.evaluate(() => window.stateIntegration.readiness({ dirty: false, pending: false, failed: false }, true));
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: false, unsavedTransition: true });
  await evidence(page, info, 'current-panel-preference-readiness');
});

test('flush waits through reentrant preference queues; silence is immediate while IDB writer is delayed', async ({ page }) => {
  await boot(page); await create(page);
  const pending = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(); api.hold();
    c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .1 });
    await new Promise(resolve => setTimeout(resolve, 0));
    c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'effects', volume: .8 });
    c.preferences.setAudioPreferences({ kind: 'silence-all' });
    let settled = false; const flushing = c.flush().then(r => { settled = true; return r; });
    await new Promise(resolve => setTimeout(resolve, 0));
    const before = { settled, readiness: c.getUpdateReadiness(), requested: c.preferences.getStatus().requestedAudio, committed: c.getSnapshot().save.installation.audio };
    api.release(); const readiness = await flushing;
    return { before, readiness, final: c.getSnapshot().save.installation.audio };
  });
  expect(pending).toMatchObject({ before: { settled: false, readiness: { ready: false, pendingPreferences: true }, requested: { silenceAll: true }, committed: { silenceAll: false } },
    readiness: { ready: true }, final: { silenceAll: true, music: { volume: .1 }, effects: { volume: .8 } } });
});

test('compacted source IDs expire; optional transfer is a fresh task without another quest receipt', async ({ page }, info) => {
  await boot(page); await create(page); const source = await open(page, { kind: 'quest', questId: 'Q1' }); const original = await check(page, source, bridge);
  const repeat = await open(page, { kind: 'practice', skillId: 'M01', mode: 'repeat' }); await check(page, repeat, bridge);
  expect((await snapshot(page)).save.profiles.ada.encounters[source.encounterId]).toBeUndefined();
  const staleFreshToken = await page.evaluate(c => window.stateIntegration.dispatch({ ...c, actionId: crypto.randomUUID(), expected: window.stateIntegration.controller().getSnapshot().token }), original.command);
  expect(staleFreshToken).toMatchObject({ status: 'invalid', reason: { code: 'encounter-expired' } });
  await page.reload(); await page.waitForFunction(() => !!window.stateIntegration); await page.evaluate(() => window.stateIntegration.controller().ready);
  const transfer = await open(page, { kind: 'optional-transfer', bindingId: 'q1-transfer-m01' });
  expect(transfer.canonicalQuestionId).toBe('lif.math.bridge.r1.total-10');
  expect((await check(page, transfer, { kind: 'bridge', planks: [6, 4] })).result).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 20, competitiveDelta: 20 }, restorationIds: [] } });
  const p = (await snapshot(page)).save.profiles.ada;
  expect(p.world.completedStoryBindingIds).toEqual(['q1-story-m01']); expect(p.rewards.questReceipts).toEqual([{ profileId: 'ada', questId: 'Q1' }]);
  expect(p.rewards.lifetimePoints).toBe(60); await evidence(page, info, 'compacted-source-fresh-transfer');
});

test('unsupported readable storage exposes honest load state and separate raw recovery without fabricated snapshot', async ({ page }, info) => {
  const { errors } = await boot(page, randomUUID(), true);
  expect(await page.evaluate(() => window.stateIntegration.snapshot())).toBeNull();
  expect(await page.evaluate(() => window.stateIntegration.controller().getUpdateReadiness())).toMatchObject({ ready: false, failedCommand: true, failedPreferences: true });
  const before = await page.evaluate(() => window.stateIntegration.nativeRoot());
  expect(await page.evaluate(() => window.stateIntegration.controller().backupActions.export('last-committed'))).toMatchObject({ status: 'unavailable' });
  const raw = await page.evaluate(() => window.stateIntegration.rawRecovery());
  expect(raw).toMatchObject({ status: 'available', structuralVersion: 7, representation: 'raw-indexeddb-root-json', filename: 'learning-is-fun.recovery.json' });
  if (raw.status === 'available') expect(JSON.parse(raw.json)).toEqual(before);
  expect(await page.evaluate(() => window.stateIntegration.nativeRoot())).toEqual(before);
  expect(await page.evaluate(() => window.stateIntegration.controller().getLoadState())).toMatchObject({ status: 'unsupported' });
  await expect(page.getByText('Saved data could not be loaded.', { exact: false })).toBeVisible();
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download raw recovery data' }).click();
  expect((await download).suggestedFilename()).toBe('learning-is-fun.recovery.json');
  await info.attach('raw-recovery', { body: JSON.stringify({ before, raw }), contentType: 'application/json' }); expect(errors).toEqual([]);
});

test('preview cancellation and intervening save invalidate backup confirmation, without replacing newer progress', async ({ page }) => {
  await boot(page); await create(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(); const output = await c.backupActions.export('flushed');
    if (output.status !== 'ready') return output;
    const file = new File([output.backup.json], 'backup.json');
    const cancelled = await c.backupActions.prepare(file); if (cancelled.status !== 'ready') return cancelled;
    c.backupActions.cancel(cancelled.preview.preparedImportId);
    const cancelResult = await c.backupActions.confirm(cancelled.preview.preparedImportId);
    const prepared = await c.backupActions.prepare(file); if (prepared.status !== 'ready') return prepared;
    await api.send('RenameProfile', { nickname: 'newer' }, 'ada');
    const before = c.getSnapshot(); const conflict = await c.backupActions.confirm(prepared.preview.preparedImportId);
    return { cancelResult, conflict, unchanged: before === c.getSnapshot(), nickname: c.getSnapshot().save.profiles.ada.identity.nickname };
  });
  expect(result).toMatchObject({ cancelResult: { status: 'invalid', reason: { code: 'prepared-import-expired' } }, conflict: { status: 'conflict' }, unchanged: true, nickname: 'newer' });
});

test('facade allocates immutable profile/submission commands and keeps stable snapshots until acknowledgement', async ({ page }) => {
  await boot(page);
  const created = await page.evaluate(async () => {
    const c = window.stateIntegration.controller(), command = c.prepareCommand({ kind: 'CreateProfile', payload: { nickname: 'Prepared learner', avatarId: 'iona' } });
    const before = c.getSnapshot(); const sameBefore = before === c.getSnapshot(); const result = await c.dispatch(command);
    return { command, sameBefore, result, frozen: Object.isFrozen(command) && Object.isFrozen(command.payload), newReference: c.getSnapshot() !== before };
  });
  expect(created).toMatchObject({ sameBefore: true, frozen: true, newReference: true, result: { status: 'committed' } });
  const profileId = 'newProfileId' in created.command.payload ? created.command.payload.newProfileId : '';
  expect(profileId).toMatch(/^[0-9a-f-]{36}$/);
  const e = await open(page, { kind: 'quest', questId: 'Q1' }, profileId);
  const result = await page.evaluate(async ({ profileId, encounterId }) => {
    const c = window.stateIntegration.controller(), command = c.prepareCommand({ kind: 'SubmitCheck', profileId, payload: {
      encounterId, learningEpisodeOrdinal: 1, checkSequence: 1, response: { kind: 'bridge', planks: [6, 6] } } });
    window.stateIntegration.abort(); const first = await c.dispatch(command); const second = await c.dispatch(command); const third = await c.dispatch(command);
    return { command, first, second, third };
  }, { profileId, encounterId: e.encounterId });
  expect(result).toMatchObject({ first: { status: 'save-failed' }, second: { status: 'committed' }, third: { status: 'already-applied' } });
  expect('submissionId' in result.command.payload && result.command.payload.submissionId).toMatch(/^[0-9a-f-]{36}$/);
});

test('real deletion/start-over retains surviving archive rank/medal and reset leaves another namespace intact', async ({ page }, info) => {
  await boot(page); await create(page); await create(page, 'ben');
  await check(page, await open(page, { kind: 'quest', questId: 'Q1' }), bridge);
  const ben = await open(page, { kind: 'quest', questId: 'Q1' }, 'ben'); await check(page, ben, wrong, 'ben');
  await page.evaluate(() => window.stateIntegration.setNow('2026-10-12T12:00:00Z'));
  expect(await page.evaluate(() => window.stateIntegration.controller().refresh())).toMatchObject({ status: 'committed' });
  const before = await snapshot(page);
  await send(page, 'DeleteProfile', {}, 'ada');
  const deleted = await snapshot(page); expect(deleted.save.profiles.ben).toEqual(before.save.profiles.ben);
  expect(deleted.save.competition.archives[0]).toMatchObject({ omittedDeletedProfiles: true, entries: [{ profileId: 'ben', rank: 2, medal: 'silver', points: 5 }] });
  expect(deleted.save.profiles.ben.personalRecords.medals).toEqual({ gold: 0, silver: 1, bronze: 0 });
  expect(await send(page, 'StartOver', { newProfileId: 'ben-new', nickname: 'Ben', avatarId: 'nessa' }, 'ben')).toMatchObject({ status: 'committed' });
  expect((await snapshot(page)).save.profiles['ben-new'].rewards.lifetimePoints).toBe(0);
  const other = await page.evaluate(() => window.stateIntegration.sentinel());
  const oldToken = (await snapshot(page)).token;
  expect(await send(page, 'ResetSave', {})).toMatchObject({ status: 'committed' });
  const reset = await snapshot(page); expect(reset.token.epoch).not.toBe(oldToken.epoch); expect(reset.token.revision).toBe(0); expect(reset.save.profiles).toEqual({});
  expect(await page.evaluate(name => window.stateIntegration.readSentinel(name), other)).toEqual({ keep: 'unrelated' });
  await evidence(page, info, 'deletion-start-over-namespace-reset');
});

test('failed assistance reveals nothing, invalid Check cannot roll the week, and retained payload mismatch is rejected', async ({ page }, info) => {
  await boot(page); await create(page); const e = await open(page, { kind: 'quest', questId: 'Q1' });
  const before = await snapshot(page), hintId = await page.evaluate(id => window.stateIntegration.catalogue.find(t => t.canonicalQuestionId === id)!.hints[0].id, e.canonicalQuestionId);
  await page.evaluate(() => window.stateIntegration.abort());
  const command = await page.evaluate(({ encounterId, hintId }) => window.stateIntegration.make('RecordAssistance', { encounterId, assistanceKind: 'answer-hint', hintId }, 'ada'), { encounterId: e.encounterId, hintId });
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), command)).toMatchObject({ status: 'save-failed' });
  expect(await page.evaluate(id => window.stateIntegration.projection('ada', id), e.encounterId)).toMatchObject({ activity: { revealedAssistanceIds: [] } });
  expect(await snapshot(page)).toEqual(before);
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), command)).toMatchObject({ status: 'committed' });
  const wrongResult = await check(page, e, wrong);
  await page.evaluate(() => window.stateIntegration.setNow('2026-10-12T12:00:00Z'));
  const oldWeek = await snapshot(page);
  expect(await send(page, 'SubmitCheck', { encounterId: e.encounterId, learningEpisodeOrdinal: 1, checkSequence: 2, submissionId: 'incomplete', response: { kind: 'bridge', planks: [] } }, 'ada'))
    .toMatchObject({ status: 'invalid', reason: { code: 'incomplete-response' } });
  expect(await snapshot(page)).toEqual(oldWeek);
  expect(await page.evaluate(c => window.stateIntegration.dispatch({ ...c, actionId: crypto.randomUUID(), expected: window.stateIntegration.controller().getSnapshot().token,
    payload: { ...c.payload, response: { kind: 'bridge', planks: [6, 6] } } } as StateCommand), wrongResult.command)).toMatchObject({ status: 'invalid', reason: { code: 'submission-mismatch' } });
  expect(await snapshot(page)).toEqual(oldWeek);
  await evidence(page, info, 'failed-hint-invalid-check');
});

test('free practice closes and resumes an unsuccessful episode through reload with sticky help and no reward', async ({ page }, info) => {
  await boot(page); await create(page); let e = await open(page, { kind: 'practice', skillId: 'M01', mode: 'easier' });
  expect(e.canonicalQuestionId).toBe('lif.math.bridge.r1.total-10'); expect(e.opportunityId).toBeNull();
  await check(page, e, wrong);
  const hintId = await page.evaluate(id => window.stateIntegration.catalogue.find(t => t.canonicalQuestionId === id)!.workedSupport.id, e.canonicalQuestionId);
  await send(page, 'RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'worked-support', hintId }, 'ada');
  await send(page, 'FinishPractice', { encounterId: e.encounterId, learningEpisodeOrdinal: 1 }, 'ada');
  await page.reload(); await page.waitForFunction(() => !!window.stateIntegration); await page.evaluate(() => window.stateIntegration.controller().ready);
  await send(page, 'OpenEncounter', { resumeEncounterId: e.encounterId, suppressDueReviewForVisit: true }, 'ada');
  e = (await snapshot(page)).save.profiles.ada.encounters[e.encounterId];
  expect(e).toMatchObject({ opportunityId: null, validChecks: 1, assistance: { workedSupportUsed: true }, learningEpisode: { ordinal: 2 } });
  expect((await check(page, e, { kind: 'bridge', planks: [6, 4] })).result).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0 } } });
  const p = (await snapshot(page)).save.profiles.ada;
  expect(p.learning.evidence.M01!.bands.support).toMatchObject({ completedEpisodes: 2, validChecks: 2, supportedSuccesses: 1 });
  expect(p.world.completedQuestIds).toEqual([]); expect(p.rewards.lifetimePoints).toBe(0); await evidence(page, info, 'free-practice-reload-episode');
});

test('real IDB review compaction and 53 closures preserve records beyond 52 displayed archives', async ({ page }, info) => {
  await boot(page); await create(page); const source = await open(page, { kind: 'quest', questId: 'Q1' }); const original = await check(page, source, bridge);
  for (let week = 0; week < 53; week++) {
    await page.evaluate(week => window.stateIntegration.setNow(new Date(Date.parse('2026-10-12T12:00:00Z') + week * 7 * 86400000).toISOString()), week);
    const review = await open(page, { kind: 'practice', skillId: 'M01', mode: 'suggested' }, 'ada', false);
    expect(review).toMatchObject({ canonicalQuestionId: source.canonicalQuestionId, selectionReason: 'due-review' });
    expect((await check(page, review, bridge)).result).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 20, competitiveDelta: 20 } } });
  }
  const saved = await snapshot(page), p = saved.save.profiles.ada;
  expect(saved.save.competition.archives).toHaveLength(52);
  expect(p.personalRecords).toEqual({ best: { points: 20, week: '2026-10-05' }, medals: { gold: 53, silver: 0, bronze: 0 } });
  expect(p.rewards).toMatchObject({ lifetimePoints: 1100, questReceipts: [{ profileId: 'ada', questId: 'Q1' }] });
  expect(p.rewards.tracksByCanonical[source.canonicalQuestionId]).toMatchObject({ completedThroughOrdinal: 53, lastAllocatedOrdinal: 54, closedAwardTotal: 1060 });
  expect(Object.keys(p.encounters)).toHaveLength(1);
  const stale = await page.evaluate(c => window.stateIntegration.dispatch({ ...c, actionId: crypto.randomUUID(), expected: window.stateIntegration.controller().getSnapshot().token }), original.command);
  expect(stale).toMatchObject({ status: 'invalid', reason: { code: 'encounter-expired' } });
  expect(await snapshot(page)).toEqual(saved);
  await evidence(page, info, 'archive-expiry-53-medals-52-archives');
});

test('subscriber-generated profile preference is drained before flush reports its late write failure', async ({ page }, info) => {
  await boot(page); await create(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(); let injected = false;
    const unsubscribe = c.subscribe(() => {
      const status = c.preferences.getStatus();
      if (!injected && status.savedGeneration === 1) {
        injected = true; api.abort(); c.preferences.setProfilePreferences('ada', { motion: 'reduced' });
      }
    });
    c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .7 });
    const failed = await c.flush(); unsubscribe();
    const beforeRetry = { saved: c.getSnapshot(), requested: c.preferences.getStatus() };
    c.preferences.retry(); const retried = await c.flush();
    return { injected, failed, beforeRetry, retried, final: c.getSnapshot(), status: c.preferences.getStatus() };
  });
  expect(result).toMatchObject({ injected: true, failed: { ready: false, failedPreferences: true, pendingCommands: 0 },
    beforeRetry: { saved: { save: { installation: { audio: { music: { volume: .7 } } }, profiles: { ada: { preferences: { motion: 'system' } } } } },
      requested: { savedGeneration: 1, generation: 2, requestedProfileById: { ada: { motion: 'reduced' } } } },
    retried: { ready: true }, final: { save: { profiles: { ada: { preferences: { motion: 'reduced' } } } } }, status: { savedGeneration: 2, failed: false } });
  await evidence(page, info, 'subscriber-late-failure-flush');
});

test('successful replacement Check resolves that failed Check blocker while unrelated failed work remains blocked', async ({ page }) => {
  await boot(page); await create(page); const e = await open(page, { kind: 'quest', questId: 'Q1' });
  const failed = await page.evaluate(id => window.stateIntegration.make('SubmitCheck', { encounterId: id, learningEpisodeOrdinal: 1,
    checkSequence: 1, submissionId: 'not-saved-response', response: { kind: 'bridge', planks: [1] } }, 'ada'), e.encounterId);
  await page.evaluate(() => window.stateIntegration.abort());
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), failed)).toMatchObject({ status: 'save-failed' });
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: false, failedCommand: true });
  // The learner edits the unsaved response and deliberately submits its new Check.
  await check(page, e, bridge);
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: true, failedCommand: false });
  const rename = await page.evaluate(() => window.stateIntegration.make('RenameProfile', { nickname: 'pending rename' }, 'ada'));
  await page.evaluate(() => window.stateIntegration.abort());
  expect(await page.evaluate(c => window.stateIntegration.dispatch(c), rename)).toMatchObject({ status: 'save-failed' });
  await send(page, 'SetAvatar', { avatarId: 'rowan' }, 'ada');
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: false, failedCommand: true });
  await send(page, 'RenameProfile', { nickname: 'replacement rename' }, 'ada');
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: true, failedCommand: false });
});

test('same-week educational review commits without question awards and survives real backup/replace/reload', async ({ page }, info) => {
  await boot(page); await page.evaluate(() => window.stateIntegration.setNow('2026-10-05T12:00:00Z')); await create(page);
  const e = await open(page, { kind: 'quest', questId: 'Q1' }); await check(page, e, bridge);
  await page.evaluate(() => window.stateIntegration.setNow('2026-10-08T12:00:00Z'));
  const review = await open(page, { kind: 'practice', skillId: 'M01', mode: 'suggested' }, 'ada', false);
  expect(review).toMatchObject({ canonicalQuestionId: e.canonicalQuestionId, opportunityId: null, selectionReason: 'due-review',
    eligibility: { kind: 'practice-only', reason: 'same-week-used' } });
  expect((await check(page, review, bridge)).result).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0 }, restorationIds: [] } });
  const before = await snapshot(page);
  expect(before.save.profiles.ada.learning.evidence.M01!.bands.support.reviewResults).toHaveLength(1);
  const restored = await page.evaluate(async () => {
    const c = window.stateIntegration.controller(), output = await c.backupActions.export('flushed');
    if (output.status !== 'ready') return output;
    const preview = await c.backupActions.prepare(new File([output.backup.json], 'review-backup.json'));
    return preview.status === 'ready' ? c.backupActions.confirm(preview.preview.preparedImportId) : preview;
  });
  expect(restored).toMatchObject({ status: 'committed' });
  expect((await snapshot(page)).save).toEqual(before.save);
  await page.reload(); await page.waitForFunction(() => !!window.stateIntegration); await page.evaluate(() => window.stateIntegration.controller().ready);
  expect((await snapshot(page)).save).toEqual(before.save);
  await evidence(page, info, 'same-week-review-backup');
});

test('unavailable binding registry blocks initialization before any database write', async ({ page }) => {
  await page.goto(`tests/fixtures/state-integration.html?namespace=${randomUUID()}&missingBindings=yes`);
  await page.waitForFunction(() => !!window.stateIntegration);
  expect(await page.evaluate(() => window.stateIntegration.controller().ready)).toMatchObject({ status: 'unsupported', reason: { code: 'unsupported-content' } });
  expect(await page.evaluate(() => window.stateIntegration.snapshot())).toBeNull();
  expect(await page.evaluate(() => window.stateIntegration.controller().refresh())).toMatchObject({ status: 'unsupported' });
  expect(await page.evaluate(() => window.stateIntegration.rawRecovery())).toMatchObject({ status: 'unavailable', cause: 'absent-database' });
  expect(await page.evaluate(() => window.stateIntegration.controller().flush())).toMatchObject({ ready: false, failedCommand: true, failedPreferences: true });
});

test('failed Open retains allocated IDs and operation clock beyond many completed unrelated commands', async ({ page }) => {
  await boot(page); await create(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller();
    const command = api.make('OpenEncounter', { route: { kind: 'quest', questId: 'Q1' }, suppressDueReviewForVisit: true }, 'ada');
    api.abort(); const failed = await api.dispatch(command);
    const event = api.events().find((v): v is { stage: string; candidate: { save: { profiles: { ada: { encounters: Record<string, { opportunityId: string }> } } } } } =>
      typeof v === 'object' && v !== null && 'stage' in v && v.stage === 'abort-after-put')!;
    const allocated = Object.keys(event.candidate.save.profiles.ada.encounters)[0];
    const opportunity = event.candidate.save.profiles.ada.encounters[allocated].opportunityId;
    for (let i = 0; i < 130; i++) await api.send('ReconcileCalendar', {});
    api.setNow('2026-10-12T12:00:00Z'); const retry = await api.dispatch(command);
    return { failed, allocated, opportunity, retry, snapshot: c.getSnapshot() };
  });
  expect(result).toMatchObject({ failed: { status: 'save-failed' }, retry: { status: 'committed' } });
  expect(Object.keys(result.snapshot.save.profiles.ada.encounters)).toEqual([result.allocated]);
  expect(result.snapshot.save.profiles.ada.encounters[result.allocated].opportunityId).toBe(result.opportunity);
  expect(result.snapshot.save.competition.latestOpenedWeek).toBe('2026-10-05');
  const capacity = await page.evaluate(async () => {
    const api = window.stateIntegration; let first: StateCommand | undefined;
    for (let i = 0; i < 128; i++) {
      const c = api.make('RenameProfile', { nickname: `pending-${i}` }, 'ada'); first ??= c; api.abort(); await api.dispatch(c);
    }
    const excess = await api.send('SetAvatar', { avatarId: 'rowan' }, 'ada');
    // Retrying an already reserved operation must remain possible at capacity.
    const retry = await api.dispatch(first!);
    return { excess, retry, ready: await api.controller().flush() };
  });
  expect(capacity).toMatchObject({ excess: { status: 'invalid', reason: { code: 'capacity-exceeded' } }, retry: { status: 'committed' }, ready: { ready: true } });
});

test('recovered preference failures release retry reservations beyond 128 operations', async ({ page }, info) => {
  const { errors } = await boot(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(); let recovered = 0;
    for (let cycle = 0; cycle < 130; cycle++) {
      const volume = cycle % 2 ? .3 : .7, before = c.getSnapshot();
      api.abort(); c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume });
      const failed = await c.flush();
      if (!failed.failedPreferences || c.getSnapshot() !== before) return { recovered, cycle, phase: 'abort', failed };
      c.preferences.retry(); const retry = await c.flush();
      if (!retry.ready || c.getSnapshot().save.installation.audio.music.volume !== volume) {
        return { recovered, cycle, phase: 'retry', retry, status: c.preferences.getStatus() };
      }
      recovered++;
    }
    const next = await api.send('CreateProfile', { newProfileId: 'ada', nickname: 'Ada', avatarId: 'pip' });
    return { recovered, next, ready: await c.flush(), snapshot: c.getSnapshot(), native: await api.nativeRoot() };
  });
  await info.attach('preference-reservation-recovery', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result).toMatchObject({ recovered: 130, next: { status: 'committed' }, ready: { ready: true } });
  if ('snapshot' in result) expect(result.native).toEqual({ ...result.snapshot!.token, save: result.snapshot!.save });
  expect(errors).toEqual([]);
});

test('one preference generation recovers after 128 consecutive native write failures', async ({ page }, info) => {
  const { errors } = await boot(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(), before = c.getSnapshot();
    api.abort(); c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .7 });
    await c.flush();
    for (let i = 1; i < 128; i++) { api.abort(); c.preferences.retry(); await c.flush(); }
    const duringOutage = { status: c.preferences.getStatus(), snapshot: c.getSnapshot(), native: await api.nativeRoot(),
      aborts: api.events().filter(v => typeof v === 'object' && v !== null && 'stage' in v && v.stage === 'abort-after-put').length };
    c.preferences.retry(); const recovered = await c.flush(), afterRecovery = c.getSnapshot();
    const next = await api.send('CreateProfile', { newProfileId: 'ada', nickname: 'Ada', avatarId: 'pip' });
    return { before, duringOutage, recovered, afterRecovery, next, final: c.getSnapshot(), native: await api.nativeRoot() };
  });
  await info.attach('one-preference-consecutive-outage', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result.duringOutage).toMatchObject({ aborts: 128, status: { generation: 1, savedGeneration: 0, failed: true,
    requestedAudio: { music: { volume: .7 } } } });
  expect(result.duringOutage.snapshot).toEqual(result.before);
  expect(result.duringOutage.native).toEqual({ ...result.before.token, save: result.before.save });
  expect(result.recovered).toMatchObject({ ready: true, failedPreferences: false });
  expect(result.afterRecovery.save.installation.audio.music.volume).toBe(.7);
  expect(result.afterRecovery.token).toEqual({ epoch: result.before.token.epoch, revision: result.before.token.revision + 1 });
  expect(result.next).toMatchObject({ status: 'committed' });
  expect(result.native).toEqual({ ...result.final.token, save: result.final.save }); expect(errors).toEqual([]);
});

test('helper retry supersedes only its own failed scope at full reservation capacity', async ({ page }, info) => {
  await boot(page); await create(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller();
    const educational = api.make('OpenEncounter', { route: { kind: 'quest', questId: 'Q1' }, suppressDueReviewForVisit: true }, 'ada');
    api.abort(); await api.dispatch(educational);
    const original = (api.events().find((v): v is { stage: string; candidate: { save: { profiles: { ada: { encounters: Record<string, { opportunityId: string }> } } } } } =>
      typeof v === 'object' && v !== null && 'stage' in v && v.stage === 'abort-after-put'))!.candidate;
    for (let i = 0; i < 126; i++) {
      api.abort(); if ((await api.send('SetAudioPreferences', { patch: { music: { volume: .4 } } })).status !== 'save-failed') throw new Error('Public reservation missing');
    }
    api.abort(); c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .7 }); await c.flush();
    // Every helper retry must reach IDB, even with 127 unrelated reservations.
    for (let i = 0; i < 130; i++) {
      api.abort(); c.preferences.retry(); await c.flush();
      if (c.preferences.getStatus().errorCode === 'capacity-exceeded') throw new Error(`Helper blocked at capacity ${i}`);
    }
    api.hold(); c.preferences.retry(); const pending = c.flush();
    await new Promise(resolve => setTimeout(resolve, 0));
    if (!api.held()) throw new Error('Helper write must still own its pending reservation');
    const publicAtCapacity = await api.send('SetAudioPreferences', { patch: { music: { volume: .7 } } });
    api.abort(); api.release(); await pending;
    const requested = c.preferences.getStatus(), before = c.getSnapshot(); api.setNow('2026-10-12T12:00:00Z');
    const educationalRetry = await api.dispatch(educational), afterEducational = c.getSnapshot();
    c.preferences.retry(); const recovered = await c.flush();
    return { original, publicAtCapacity, requested, before, educationalRetry, afterEducational, recovered,
      final: c.getSnapshot(), native: await api.nativeRoot(), aborts: api.events().filter(v => typeof v === 'object' && v !== null && 'stage' in v && v.stage === 'abort-after-put').length };
  });
  await info.attach('helper-capacity-and-distinct-ownership', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result).toMatchObject({ publicAtCapacity: { status: 'invalid', reason: { code: 'capacity-exceeded' } },
    requested: { generation: 1, savedGeneration: 0, pending: true, failed: true }, educationalRetry: { status: 'committed' }, recovered: { ready: true }, aborts: 259 });
  const encounterId = Object.keys(result.original.save.profiles.ada.encounters)[0];
  expect(Object.keys(result.afterEducational.save.profiles.ada.encounters)).toEqual([encounterId]);
  expect(result.afterEducational.save.profiles.ada.encounters[encounterId].opportunityId).toBe(result.original.save.profiles.ada.encounters[encounterId].opportunityId);
  expect(result.afterEducational.save.competition.latestOpenedWeek).toBe('2026-10-05');
  expect(result.before.save.installation.audio.music.volume).toBe(.25);
  expect(result.final.save.installation.audio.music.volume).toBe(.7);
  expect(result.native).toEqual({ ...result.final.token, save: result.final.save });
});

test('helper scope change at capacity retires inaccessible attempts without releasing public work', async ({ page }, info) => {
  await boot(page); await create(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(), before = c.getSnapshot();
    for (let i = 0; i < 127; i++) { api.abort(); await api.send('SetAudioPreferences', { patch: { music: { volume: .4 } } }); }
    api.abort(); c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .7 }); await c.flush();
    c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .25 });
    c.preferences.setProfilePreferences('ada', { motion: 'reduced' });
    api.abort(); c.preferences.retry(); const partialFailure = await c.flush(), status = c.preferences.getStatus();
    if (status.errorCode === 'capacity-exceeded') return { phase: 'scope-change', partialFailure, status };
    const unchanged = before === c.getSnapshot(), nativeDuringOutage = await api.nativeRoot();
    c.preferences.retry(); const recovered = await c.flush(), afterRecovery = c.getSnapshot();
    const lastPublic = api.make('SetAudioPreferences', { patch: { music: { volume: .9 } } });
    api.abort(); const lastFailure = await api.dispatch(lastPublic);
    const stillReserved = await api.send('SetAvatar', { avatarId: 'rowan' }, 'ada');
    const cleanup = await api.dispatch(lastPublic);
    return { before, unchanged, nativeDuringOutage, partialFailure, recovered, afterRecovery, lastFailure, stillReserved, cleanup,
      final: c.getSnapshot(), native: await api.nativeRoot(), ready: await c.flush() };
  });
  await info.attach('helper-scope-change-at-capacity', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result).toMatchObject({ unchanged: true, partialFailure: { failedPreferences: true }, recovered: { ready: true },
    afterRecovery: { save: { profiles: { ada: { preferences: { motion: 'reduced' } } }, installation: { audio: { music: { volume: .25 } } } } },
    lastFailure: { status: 'save-failed' }, stillReserved: { status: 'invalid', reason: { code: 'capacity-exceeded' } },
    cleanup: { status: 'committed' }, ready: { ready: true } });
  if ('before' in result) {
    expect(result.nativeDuringOutage).toEqual({ ...result.before!.token, save: result.before!.save });
    expect(result.native).toEqual({ ...result.final!.token, save: result.final!.save });
  }
});

test('outage retries preserve changed partial dirty leaves and separate profile scopes', async ({ page }, info) => {
  const { errors } = await boot(page); await create(page); await create(page, 'ben');
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(), before = c.getSnapshot();
    api.abort(); c.preferences.setProfilePreferences('ada', { motion: 'reduced', instructionReadAloud: true }); await c.flush();
    c.preferences.setProfilePreferences('ada', { instructionReadAloud: false });
    c.preferences.setProfilePreferences('ben', { motion: 'reduced' });
    c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'effects', volume: .8 });
    for (let i = 0; i < 130; i++) {
      if (i === 64) c.preferences.setProfilePreferences('ada', { motion: 'system' });
      if (i === 100) c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'effects', volume: .6 });
      api.abort(); c.preferences.retry(); await c.flush();
      if (c.preferences.getStatus().errorCode === 'capacity-exceeded') throw new Error(`Partial-leaf retry blocked ${i}`);
    }
    const candidates = api.events().filter((v): v is { stage: string; candidate: { save: { profiles: Record<string, { preferences: { instructionReadAloud: boolean; motion: string } }> } } } =>
      typeof v === 'object' && v !== null && 'stage' in v && v.stage === 'abort-after-put');
    const duringOutage = { unchanged: before === c.getSnapshot(), status: c.preferences.getStatus(), native: await api.nativeRoot(),
      aborts: candidates.length, partial: candidates[1].candidate, last: candidates[candidates.length - 1].candidate };
    c.preferences.retry(); const recovered = await c.flush();
    return { before, duringOutage, recovered, status: c.preferences.getStatus(), final: c.getSnapshot(), native: await api.nativeRoot() };
  });
  await info.attach('outage-partial-leaves-and-scopes', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result.duringOutage).toMatchObject({ unchanged: true, aborts: 131, status: { generation: 6, failed: true, pending: true },
    partial: { save: { profiles: { ada: { preferences: { motion: 'reduced', instructionReadAloud: false } } } } },
    last: { save: { profiles: { ada: { preferences: { motion: 'system', instructionReadAloud: false } }, ben: { preferences: { motion: 'reduced' } } } } } });
  expect(result.duringOutage.native).toEqual({ ...result.before.token, save: result.before.save });
  expect(result).toMatchObject({ recovered: { ready: true }, status: { generation: 6, savedGeneration: 6, failed: false, pending: false },
    final: { save: { profiles: { ada: { preferences: { motion: 'system', instructionReadAloud: false } }, ben: { preferences: { motion: 'reduced' } } },
      installation: { audio: { effects: { volume: .6 }, music: { volume: .25 } } } } } });
  expect(result.native).toEqual({ ...result.final.token, save: result.final.save }); expect(errors).toEqual([]);
});

test('aborted backup replacement retries the exact confirmed command and fresh epoch', async ({ page }, info) => {
  const { errors } = await boot(page); await create(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(), output = await c.backupActions.export('flushed');
    if (output.status !== 'ready') throw new Error('Backup unavailable');
    await api.send('RenameProfile', { nickname: 'newer' }, 'ada');
    const preview = await c.backupActions.prepare(new File([output.backup.json], 'backup.json'));
    if (preview.status !== 'ready') throw new Error('Preview unavailable');
    const command = api.make('ReplaceSave', { preparedImportId: preview.preview.preparedImportId });
    const before = c.getSnapshot(); api.abort(); const failed = await api.dispatch(command);
    const afterAbort = c.getSnapshot(), nativeAfterAbort = await api.nativeRoot();
    const candidate = (api.events().find((v): v is { stage: string; candidate: { epoch: string } } =>
      typeof v === 'object' && v !== null && 'stage' in v && v.stage === 'abort-after-put'))!.candidate;
    api.setNow('2026-10-12T12:00:00Z');
    const retry = await api.dispatch(command), after = c.getSnapshot();
    return { before, failed, afterAbort, nativeAfterAbort, candidate, retry, after, native: await api.nativeRoot(),
      ready: await c.flush(), replay: await api.dispatch(command) };
  });
  await info.attach('backup-replacement-retry', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result.failed).toMatchObject({ status: 'save-failed', retryable: true });
  expect(result.afterAbort).toEqual(result.before);
  expect(result.nativeAfterAbort).toEqual({ ...result.before.token, save: result.before.save });
  expect(result.retry).toMatchObject({ status: 'committed' });
  expect(result.after.token).toEqual({ epoch: result.candidate.epoch, revision: 0 });
  expect(result.after.token.epoch).not.toBe(result.before.token.epoch);
  expect(result.after.save.profiles.ada.identity.nickname).toBe('ada');
  expect(result.native).toEqual({ ...result.after.token, save: result.after.save });
  expect(result.ready).toMatchObject({ ready: true });
  expect(['invalid', 'conflict']).toContain(result.replay.status);
  await page.reload(); await page.waitForFunction(() => !!window.stateIntegration); await page.evaluate(() => window.stateIntegration.controller().ready);
  expect((await snapshot(page)).save.profiles.ada.identity.nickname).toBe('ada'); expect(errors).toEqual([]);
});

test('preference reservations retire only acknowledged leaves in the same scope', async ({ page }) => {
  await boot(page); await create(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller();
    for (let i = 0; i < 127; i++) {
      api.abort(); const failed = await api.send('SetAudioPreferences', { patch: { music: { volume: .7 }, effects: { volume: .8 } } });
      if (failed.status !== 'save-failed') throw new Error(`Unexpected attempt ${i}: ${failed.status}`);
    }
    const firstLeaf = await api.send('SetAudioPreferences', { patch: { music: { volume: .3 } } });
    const unrelated = api.make('RenameProfile', { nickname: 'Recovered' }, 'ada'); api.abort(); await api.dispatch(unrelated);
    const stillOwned = await api.send('SetProfilePreferences', { patch: { motion: 'reduced' } }, 'ada');
    const recoverUnrelated = await api.dispatch(unrelated);
    const lastLeaf = await api.send('SetAudioPreferences', { patch: { effects: { volume: .9 } } });
    const profile = await api.send('SetProfilePreferences', { patch: { motion: 'reduced' } }, 'ada');
    for (let i = 0; i < 130; i++) {
      api.abort(); c.preferences.setProfilePreferences('ada', { motion: i % 2 ? 'reduced' : 'system' });
      if (!(await c.flush()).failedPreferences) throw new Error('Expected failed profile preference');
      c.preferences.retry(); if (!(await c.flush()).ready) throw new Error(`Unrecovered profile preference ${i}`);
    }
    return { firstLeaf, stillOwned, recoverUnrelated, lastLeaf, profile, ready: await c.flush(), saved: c.getSnapshot() };
  });
  expect(result).toMatchObject({ firstLeaf: { status: 'committed' }, stillOwned: { status: 'invalid', reason: { code: 'capacity-exceeded' } },
    recoverUnrelated: { status: 'committed' }, lastLeaf: { status: 'committed' }, profile: { status: 'committed' }, ready: { ready: true },
    saved: { save: { installation: { audio: { music: { volume: .3 }, effects: { volume: .9 } } } } } });
});

test('preference recovery back to the saved value releases reservations without an extra write', async ({ page }, info) => {
  await boot(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(), before = c.getSnapshot(); let recovered = 0;
    for (let i = 0; i < 130; i++) {
      api.abort(); c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: .9 });
      const failed = await c.flush();
      if (!failed.failedPreferences) return { recovered, phase: 'abort', failed };
      c.preferences.setAudioPreferences({ kind: 'channel-volume', channel: 'music', volume: before.save.installation.audio.music.volume });
      c.preferences.retry(); const retry = await c.flush();
      if (!retry.ready) return { recovered, phase: 'retry', retry, status: c.preferences.getStatus() };
      recovered++;
    }
    const unchanged = before === c.getSnapshot(), native = await api.nativeRoot();
    const next = await api.send('CreateProfile', { newProfileId: 'ada', nickname: 'Ada', avatarId: 'pip' });
    const abortCount = api.events().filter(v => typeof v === 'object' && v !== null && 'stage' in v && v.stage === 'abort-after-put').length;
    return { recovered, abortCount, unchanged, before, native, next, ready: await c.flush() };
  });
  await info.attach('preference-no-write-recovery', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result).toMatchObject({ recovered: 130, abortCount: 130, unchanged: true, next: { status: 'committed' }, ready: { ready: true } });
  if ('before' in result) expect(result.native).toEqual({ ...result.before!.token, save: result.before!.save });
});

for (const kind of ['SaveDraft', 'SuspendEncounter'] as const) {
  test(`${kind} replacement and explicit panel discard release only draft reservations`, async ({ page }) => {
    await boot(page); await create(page); const e = await open(page, { kind: 'quest', questId: 'Q1' });
    const result = await page.evaluate(async ({ kind, encounterId }) => {
      const api = window.stateIntegration, c = api.controller();
      api.readiness({ dirty: true, pending: false, failed: true });
      const payload = (n: number) => ({ encounterId, responseDraft: { kind: 'bridge', planks: [n % 3 + 1] },
        ...(kind === 'SuspendEncounter' ? { learningEpisodeOrdinal: 1 } : {}) });
      for (let i = 0; i < 130; i++) {
        api.abort(); if ((await api.send(kind, payload(i * 2), 'ada')).status !== 'save-failed') throw new Error(`Expected draft abort ${i}`);
        if ((await api.send(kind, payload(i * 2 + 1), 'ada')).status !== 'committed') throw new Error(`Draft replacement blocked ${i}`);
      }
      // An independent durable failure must survive every subsequent discard.
      const rename = api.make('RenameProfile', { nickname: 'retained' }, 'ada'); api.abort(); await api.dispatch(rename);
      for (let i = 0; i < 130; i++) {
        api.readiness({ dirty: true, pending: false, failed: true }); api.abort();
        if ((await api.send(kind, { ...payload(0), responseDraft: { kind: 'bridge', planks: [6] } }, 'ada')).status !== 'save-failed') throw new Error(`Discard allocation blocked ${i}`);
        api.readiness({ dirty: false, pending: false, failed: false });
        if ((await api.send('ReconcileCalendar', {})).status !== 'already-applied') throw new Error('No-op changed the save');
      }
      const blocked = await c.flush(), recovered = await api.dispatch(rename), ready = await c.flush();
      return { blocked, recovered, ready, saved: c.getSnapshot(), native: await api.nativeRoot() };
    }, { kind, encounterId: e.encounterId });
    expect(result).toMatchObject({ blocked: { ready: false, failedCommand: true, unsavedTransition: false }, recovered: { status: 'committed' }, ready: { ready: true } });
    expect(result.native).toEqual({ ...result.saved.token, save: result.saved.save });
    expect(result.saved.save.profiles.ada.rewards.lifetimePoints).toBe(0);
  });
}

test('public backup confirm retries its private payload and invalidates cancel stale and replaced sessions', async ({ page }, info) => {
  const { errors } = await boot(page); await create(page);
  const result = await page.evaluate(async () => {
    const api = window.stateIntegration, c = api.controller(), output = await c.backupActions.export('flushed');
    if (output.status !== 'ready') throw new Error('Backup unavailable');
    const file = new File([output.backup.json], 'backup.json');
    const prepare = async () => { const value = await c.backupActions.prepare(file); if (value.status !== 'ready') throw new Error('Preview unavailable'); return value.preview; };
    const first = await prepare(), clocks = api.clockReads(); api.abort(); const failed = await c.backupActions.confirm(first.preparedImportId);
    const afterFailedClocks = api.clockReads();
    const forged = await api.send('ReplaceSave', { preparedImportId: first.preparedImportId });
    const retry = await c.backupActions.confirm(first.preparedImportId), afterRetryClocks = api.clockReads();
    const replay = await c.backupActions.confirm(first.preparedImportId);
    const cancelled = await prepare(), cancelledCommand = api.make('ReplaceSave', { preparedImportId: cancelled.preparedImportId });
    api.abort(); await api.dispatch(cancelledCommand); c.backupActions.cancel(cancelled.preparedImportId);
    const beforeCancel = c.getSnapshot(), cancelExact = await api.dispatch(cancelledCommand), cancelPublic = await c.backupActions.confirm(cancelled.preparedImportId);
    const afterCancel = c.getSnapshot(), cancelReady = await c.flush();
    const stale = await prepare(); api.abort(); await c.backupActions.confirm(stale.preparedImportId);
    await api.send('RenameProfile', { nickname: 'newer' }, 'ada'); const beforeStale = c.getSnapshot();
    const conflict = await c.backupActions.confirm(stale.preparedImportId), afterStale = c.getSnapshot();
    const renewed = await prepare(), renewedResult = await c.backupActions.confirm(renewed.preparedImportId);
    const replaced = await prepare(); api.abort(); await c.backupActions.confirm(replaced.preparedImportId);
    const newPreview = await prepare(), expired = await c.backupActions.confirm(replaced.preparedImportId);
    const newResult = await c.backupActions.confirm(newPreview.preparedImportId);
    const resetPreview = await prepare(); api.abort(); await c.backupActions.confirm(resetPreview.preparedImportId);
    const reset = await api.send('ResetSave', {}), afterReset = c.getSnapshot();
    const resetExpired = await c.backupActions.confirm(resetPreview.preparedImportId);
    const disposedPreview = await prepare(); api.abort(); await c.backupActions.confirm(disposedPreview.preparedImportId);
    await api.reload(); const afterReload = api.controller().getSnapshot(), disposedExpired = await api.controller().backupActions.confirm(disposedPreview.preparedImportId);
    const invalidFile = await api.controller().backupActions.prepare(new File(['{}'], 'invalid.json'));
    return { failed, clocksUsed: afterFailedClocks - clocks, forged, retry, retryClockReads: afterRetryClocks - afterFailedClocks - 1, replay,
      beforeCancel, cancelExact, cancelPublic, afterCancel, cancelReady, beforeStale, conflict, afterStale, renewedResult,
      expired, newResult, reset, afterReset, afterReload, resetExpired, disposedExpired, invalidFile, ready: await api.controller().flush(), native: await api.nativeRoot() };
  });
  await info.attach('public-backup-recovery-ownership', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result).toMatchObject({ failed: { status: 'save-failed', retryable: true }, clocksUsed: 1,
    forged: { status: 'invalid', reason: { code: 'prepared-import-expired' } }, retry: { status: 'committed' }, retryClockReads: 0,
    replay: { status: 'invalid' }, cancelExact: { status: 'invalid' }, cancelPublic: { status: 'invalid' }, cancelReady: { ready: true },
    conflict: { status: 'conflict' }, renewedResult: { status: 'committed' }, expired: { status: 'invalid' }, newResult: { status: 'committed' },
    reset: { status: 'committed' }, resetExpired: { status: 'invalid' }, disposedExpired: { status: 'invalid' }, invalidFile: { status: 'invalid' }, ready: { ready: true } });
  expect(result.afterCancel).toEqual(result.beforeCancel); expect(result.afterStale).toEqual(result.beforeStale);
  expect(result.afterReset.save.profiles).toEqual({});
  expect(result.afterReload.token).toEqual({ epoch: result.afterReset.token.epoch, revision: result.afterReset.token.revision + 1 });
  expect(result.afterReload.save.competition.latestOpenedWeek).toBe('2026-10-05');
  expect(result.native).toEqual({ ...result.afterReload.token, save: result.afterReload.save }); expect(errors).toEqual([]);
});
