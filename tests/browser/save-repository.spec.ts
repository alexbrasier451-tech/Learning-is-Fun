import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import type { CommittedSnapshot, LoadResult } from '../../src/state/contracts';
import type { RepositoryFixture } from '../fixtures/save-repository-api';

// Module-local declaration: evaluate callbacks run in a real browser, while
// the shared Node tooling project intentionally has no DOM library.
declare const window: { saveRepositoryFixture: RepositoryFixture; dispatchEvent(event: Event): boolean };

const fixture = 'tests/fixtures/save-repository.html';
const ready = (result: LoadResult): CommittedSnapshot => {
  if (result.status !== 'new' && result.status !== 'ready') throw new Error(JSON.stringify(result));
  return result.snapshot;
};
async function open(page: Page, suffix: string, missing = false) {
  await page.goto(fixture);
  return ready(await page.evaluate(({ suffix, missing }) => window.saveRepositoryFixture.open(suffix, missing), { suffix, missing }));
}
test.afterEach(async ({ browser }, info) => {
  await info.attach('browser-version', { body: `${info.project.name}: ${browser.version()}`, contentType: 'text/plain' });
});
async function evidence(info: TestInfo, value: unknown) {
  await info.attach('paired-root-token', { body: JSON.stringify({
    appNamespace: 'learning-is-fun:/playtest/',
    repositoryNamespace: `learning-is-fun:/playtest/:repository-${info.testId}`,
    outcomes: value,
  }, null, 2), contentType: 'application/json' });
}

test('commit, acknowledgement, immutable snapshots and reload retain one complete root', async ({ page }, info) => {
  const before = await open(page, info.testId);
  const after = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'success'), before.token);
  expect(after.status).toBe('committed');
  if (after.status !== 'committed') throw new Error('Expected commit');
  expect(after.snapshot.token).toEqual({ epoch: before.token.epoch, revision: 1 });
  expect(after.snapshot.save.contentVersion).toBe('success');
  const raw = await page.evaluate(() => window.saveRepositoryFixture.rawRead());
  expect(raw).toEqual({ ...after.snapshot.token, save: after.snapshot.save });
  const recovery = await page.evaluate(() => window.saveRepositoryFixture.recoveryProbe());
  expect(recovery.result.status).toBe('available');
  if (recovery.result.status !== 'available') throw new Error('Expected raw export of an existing committed root');
  expect(JSON.parse(recovery.result.json)).toEqual(raw);
  expect(recovery.validationDelta).toBe(0); expect(recovery.signalsDelta).toBe(0);
  expect(await page.evaluate(() => window.saveRepositoryFixture.observations().every(item => !item.duringCompletion))).toBe(true);
  expect(await page.evaluate(async () => {
    const a = await window.saveRepositoryFixture.snapshot(); const b = await window.saveRepositoryFixture.snapshot();
    return a === b && Object.isFrozen(a) && Object.isFrozen(a.save.installation.audio);
  })).toBe(true);
  await page.reload();
  const reload = ready(await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), info.testId));
  expect(reload).toEqual(after.snapshot);
  await evidence(info, { namespace: await page.evaluate(() => window.saveRepositoryFixture.namespace), before, after, raw, recovery, reload });
});

test('reducer/validator rejection and faults after queued put preserve paired root/token and publish nothing', async ({ page }, info) => {
  const before = await open(page, info.testId);
  const outcomes = [];
  for (const mode of ['throw', 'invalid-next', 'throw-next', 'async-next', 'reducer-queued-throw', 'queue-and-throw', 'abort', 'throw-after-put', 'uncloneable', 'async'] as const) {
    await page.evaluate(mode => {
      window.saveRepositoryFixture.validator(mode === 'invalid-next' || mode === 'throw-next' || mode === 'async-next' || mode === 'queue-and-throw' ? mode : 'valid');
      if (mode === 'abort' || mode === 'throw-after-put' || mode === 'uncloneable') window.saveRepositoryFixture.fault(mode);
    }, mode);
    const result = await page.evaluate(({ token, mode }) => window.saveRepositoryFixture.commit(token, mode === 'throw' || mode === 'async' || mode === 'reducer-queued-throw' ? mode : 'rejected'), { token: before.token, mode });
    expect(result.status).toBe(mode === 'invalid-next' ? 'invalid' : 'save-failed');
    await page.evaluate(() => window.saveRepositoryFixture.validator('valid'));
    const raw = await page.evaluate(() => window.saveRepositoryFixture.rawRead());
    expect(raw).toEqual({ ...before.token, save: before.save });
    expect(await page.evaluate(() => window.saveRepositoryFixture.signals().length)).toBe(1);
    outcomes.push({ mode, result, raw });
  }
  const recovered = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'recovered'), before.token);
  expect(recovered.status).toBe('committed');
  if (recovered.status !== 'committed') throw new Error('Expected queue recovery');
  expect(recovered.snapshot.token).toEqual({ epoch: before.token.epoch, revision: 1 });
  await page.reload();
  expect(ready(await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), info.testId))).toEqual(recovered.snapshot);
  await evidence(info, { before, outcomes, recovered });
});

test('competing first opens and same-token tabs serialize without silent overwrite, even without broadcasts', async ({ context, page }, info) => {
  const second = await context.newPage();
  await Promise.all([page.goto(fixture), second.goto(fixture)]);
  const [a, b] = await Promise.all([page, second].map(tab => tab.evaluate(suffix => window.saveRepositoryFixture.open(suffix, true), info.testId)));
  expect([a.status, b.status].sort()).toEqual(['new', 'ready']);
  const first = ready(a); expect(ready(b)).toEqual(first);
  const results = await Promise.all([page, second].map((tab, index) => tab.evaluate(({ token, index }) => window.saveRepositoryFixture.commit(token, `winner-${index}`), { token: first.token, index })));
  expect(results.map(result => result.status).sort()).toEqual(['committed', 'conflict']);
  const winner = results.find(result => result.status === 'committed')!;
  const loser = results.find(result => result.status === 'conflict')!;
  if (winner.status !== 'committed' || loser.status !== 'conflict') throw new Error('Expected paired results');
  expect(loser.snapshot).toEqual(winner.snapshot);
  expect(winner.snapshot.token.revision).toBe(1);
  expect(await second.evaluate(() => window.saveRepositoryFixture.snapshot())).toEqual(winner.snapshot);
  await evidence(info, { before: first, results, raw: await page.evaluate(() => window.saveRepositoryFixture.rawRead()) });
});

test('retained identical retry precedes revision check, mismatch conflicts, replacement rejects old epoch', async ({ page }, info) => {
  const before = await open(page, info.testId);
  await page.evaluate(() => window.saveRepositoryFixture.sentinel());
  const receipt = await page.evaluate(token => window.saveRepositoryFixture.receipt(token, 'delivery'), before.token);
  if (receipt.status !== 'committed') throw new Error('Expected receipt');
  const intervening = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'intervening'), receipt.snapshot.token);
  if (intervening.status !== 'committed') throw new Error('Expected intervening');
  const retry = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'delivery', true), before.token);
  expect(retry.status).toBe('already-applied');
  expect(await page.evaluate(() => window.saveRepositoryFixture.reduceCalls())).toBe(1);
  const mismatch = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'different', true), before.token);
  expect(mismatch.status).toBe('conflict');
  const expired = await page.evaluate(token => window.saveRepositoryFixture.expired(token), intervening.snapshot.token);
  expect(expired.status).toBe('invalid');
  const invalidReplacement = await page.evaluate(token => window.saveRepositoryFixture.invalidReplacement(token), intervening.snapshot.token);
  expect(invalidReplacement.status).toBe('unsupported');
  const replacement = await page.evaluate(token => window.saveRepositoryFixture.replace(token, crypto.randomUUID(), 'replacement'), intervening.snapshot.token);
  if (replacement.status !== 'committed') throw new Error('Expected replacement');
  expect(replacement.snapshot.token.revision).toBe(0);
  expect(replacement.snapshot.token.epoch).not.toBe(before.token.epoch);
  const old = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'delivery', true), before.token);
  expect(old.status).toBe('conflict');
  const lostAckRetry = await page.evaluate(token => window.saveRepositoryFixture.replace(token, crypto.randomUUID(), 'retry'), intervening.snapshot.token);
  expect(lostAckRetry.status).toBe('conflict');
  const sentinel = await page.evaluate(() => window.saveRepositoryFixture.readSentinel());
  expect(sentinel).toEqual({ marker: 'untouched' });
  expect(await page.evaluate(() => window.saveRepositoryFixture.rawRead())).toEqual({ ...replacement.snapshot.token, save: replacement.snapshot.save });
  await evidence(info, { before, receipt, intervening, retry, mismatch, expired, invalidReplacement, replacement, old, lostAckRetry, sentinel });
});

test('channel carries tokens/silence only and focus refresh reads authority independently', async ({ context, page }, info) => {
  const first = await open(page, info.testId);
  const second = await context.newPage(); await open(second, info.testId);
  await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'broadcast-commit'), first.token);
  await expect.poll(() => second.evaluate(() => window.saveRepositoryFixture.signals().filter(signal => signal.kind === 'committed' && signal.token.revision === 1).length)).toBeGreaterThan(0);
  await page.evaluate(() => window.saveRepositoryFixture.silence());
  await expect.poll(() => second.evaluate(() => window.saveRepositoryFixture.signals().some(signal => signal.kind === 'silence'))).toBe(true);
  const signals = await second.evaluate(() => window.saveRepositoryFixture.signals());
  expect(signals.every(signal => Object.keys(signal).sort().join(',') === (signal.kind === 'silence' ? 'kind' : 'kind,token'))).toBe(true);
  await second.evaluate(() => window.dispatchEvent(new Event('focus')));
  expect((await second.evaluate(() => window.saveRepositoryFixture.snapshot())).token.revision).toBe(1);
  await evidence(info, { before: first, signals, after: await second.evaluate(() => window.saveRepositoryFixture.rawRead()) });
});

test('capacity, missing/unknown/unsupported store, close and versionchange recover without blank state', async ({ page }, info) => {
  const before = await open(page, info.testId);
  await page.evaluate(snapshot => window.saveRepositoryFixture.seed({ ...snapshot.token, revision: Number.MAX_SAFE_INTEGER, save: snapshot.save }), before);
  const capacityRoot = ready(await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), info.testId));
  const capacity = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'overflow'), capacityRoot.token);
  expect(capacity.status).toBe('unsupported');
  expect(await page.evaluate(() => window.saveRepositoryFixture.rawRead())).toEqual({ ...capacityRoot.token, save: capacityRoot.save });
  await page.evaluate(() => window.saveRepositoryFixture.close());
  expect((await page.evaluate(() => window.saveRepositoryFixture.load())).status).toBe('unreadable');
  await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), info.testId);
  await page.evaluate(() => window.saveRepositoryFixture.upgrade());
  const versionchange = await page.evaluate(() => window.saveRepositoryFixture.load());
  expect(versionchange.status).toBe('blocked');
  expect('reason' in versionchange && versionchange.reason.message).toBe('Close other game tabs and retry.');
  const unsupported = await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), info.testId);
  expect(unsupported.status).toBe('unsupported');
  expect(await page.evaluate(() => window.saveRepositoryFixture.rawRead())).toEqual({ ...capacityRoot.token, save: capacityRoot.save });
  const missingSuffix = `${info.testId}-missing`; await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), missingSuffix);
  await page.evaluate(() => window.saveRepositoryFixture.seed(null));
  const missing = await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), missingSuffix);
  expect(missing.status).toBe('unreadable');
  expect(await page.evaluate(() => window.saveRepositoryFixture.rawRead())).toBeUndefined();
  const unknownSuffix = `${info.testId}-unknown`; await page.evaluate(suffix => window.saveRepositoryFixture.unknownStore(suffix), unknownSuffix);
  const unknown = await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), unknownSuffix);
  expect(unknown.status).toBe('unreadable');
  await evidence(info, { before, capacityRoot, capacity, versionchange, unsupported, missing, unknown });
});

test('browser-forced connection termination suspends writes and reports recovery', async ({ context, page, browserName }, info) => {
  test.skip(browserName !== 'chromium', 'CDP forced-close probe is supported by Chromium/Edge only.');
  const before = await open(page, info.testId);
  const session = await context.newCDPSession(page);
  // Test-only browser data removal causes a genuine forced IDB close, rather
  // than invoking the adapter callback or a mocked connection.
  await session.send('Storage.clearDataForOrigin', { origin: new URL(page.url()).origin, storageTypes: 'indexeddb' });
  await expect.poll(() => page.evaluate(async () => (await window.saveRepositoryFixture.load()).status)).toBe('unreadable');
  const failed = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'terminated'), before.token);
  expect(failed.status).toBe('save-failed');
  expect(failed.status === 'save-failed' && failed.reason.code).toBe('storage-unreadable');
  expect(await page.evaluate(() => window.saveRepositoryFixture.signals().length)).toBe(1);
  await evidence(info, { before, failed, load: await page.evaluate(() => window.saveRepositoryFixture.load()) });
});

test('real blocked upgrade suspends writes until explicit reopen; destructive commands require fresh-epoch replacement', async ({ page }, info) => {
  const before = await open(page, info.testId);
  const reset = await page.evaluate(token => window.saveRepositoryFixture.destructiveCommand(token, 'ResetSave'), before.token);
  const replace = await page.evaluate(token => window.saveRepositoryFixture.destructiveCommand(token, 'ReplaceSave'), before.token);
  expect(reset.status).toBe('invalid'); expect(replace.status).toBe('invalid');
  expect(await page.evaluate(() => window.saveRepositoryFixture.rawRead())).toEqual({ ...before.token, save: before.save });
  expect(await page.evaluate(() => window.saveRepositoryFixture.blockUpgrade())).toBe('genuine blocked upgrade');
  const suspended = await page.evaluate(() => window.saveRepositoryFixture.load());
  expect(suspended.status).toBe('blocked');
  const failed = await page.evaluate(token => window.saveRepositoryFixture.commit(token, 'blocked'), before.token);
  expect(failed.status).toBe('save-failed');
  expect(failed.status === 'save-failed' && failed.reason.message).toBe('Close other game tabs and retry.');
  await page.evaluate(() => window.saveRepositoryFixture.releaseUpgrade());
  const raw = await page.evaluate(() => window.saveRepositoryFixture.rawRead());
  expect(raw).toEqual({ ...before.token, save: before.save });
  await evidence(info, { before, reset, replace, suspended, failed, raw });
});

for (const frozenParent of ['save', 'nested'] as const) {
  test(`shallow-frozen ${frozenParent} parent protects every returned snapshot and export`, async ({ page }, info) => {
    await page.goto(fixture);
    const probes = await page.evaluate(async ({ suffix, frozenParent }) => {
      const api = window.saveRepositoryFixture;
      const stages: Array<{
        stage: string; status: string; before: CommittedSnapshot; snapshot: CommittedSnapshot;
        exported: CommittedSnapshot; raw: Awaited<ReturnType<typeof api.rawRead>>;
        mutationThrew: boolean; deeplyFrozen: boolean; sameExportReference: boolean;
        mutationPrevented: boolean; exportMatchesNative: boolean; signalsUnchanged: boolean;
      }> = [];
      const getSnapshot = (result: Awaited<ReturnType<typeof api.load>> | Awaited<ReturnType<typeof api.commit>>) => {
        if (!('snapshot' in result) || !result.snapshot) throw new Error(`Snapshot expected: ${result.status}`);
        return result.snapshot;
      };
      const deeplyFrozen = (value: unknown): boolean => !value || typeof value !== 'object'
        || (Object.isFrozen(value) && Object.values(value).every(deeplyFrozen));
      async function probe(stage: string, status: string, snapshot: CommittedSnapshot) {
        const before = structuredClone(snapshot);
        const signalCount = api.signals().length;
        let mutationThrew = false;
        try { (snapshot.save.installation.audio.music as { volume: number }).volume = .9; }
        catch { mutationThrew = true; }
        const exported = await api.snapshot();
        const raw = await api.rawRead();
        stages.push({ stage, status, before, snapshot: structuredClone(snapshot), exported, raw, mutationThrew,
          deeplyFrozen: deeplyFrozen(snapshot), sameExportReference: exported === snapshot,
          mutationPrevented: snapshot.save.installation.audio.music.volume === .25,
          exportMatchesNative: JSON.stringify(exported) === JSON.stringify({ token: { epoch: raw?.epoch, revision: raw?.revision }, save: raw?.save }),
          signalsUnchanged: api.signals().length === signalCount,
        });
      }
      const initial = await api.open(suffix, false, frozenParent);
      const initialSnapshot = getSnapshot(initial);
      await probe('initial-load', initial.status, initialSnapshot);
      const loaded = await api.load();
      await probe('ready-load', loaded.status, getSnapshot(loaded));
      const committed = await api.commit(initialSnapshot.token, 'committed');
      const committedSnapshot = getSnapshot(committed);
      await probe('committed', committed.status, committedSnapshot);
      // Exact original post-commit flow includes export plus explicit close/reopen.
      api.close();
      const reopenedCommit = await api.open(suffix, false, frozenParent);
      await probe('committed-reopen', reopenedCommit.status, getSnapshot(reopenedCommit));
      const receipt = await api.receipt(committedSnapshot.token, 'delivery');
      const receiptSnapshot = getSnapshot(receipt);
      const duplicate = await api.commit(initialSnapshot.token, 'delivery', true);
      await probe('already-applied', duplicate.status, getSnapshot(duplicate));
      const conflict = await api.commit(initialSnapshot.token, 'stale');
      await probe('conflict', conflict.status, getSnapshot(conflict));
      const replacement = await api.replace(receiptSnapshot.token, crypto.randomUUID(), 'replacement');
      await probe('replacement', replacement.status, getSnapshot(replacement));
      api.close();
      const reopened = await api.open(suffix, false, frozenParent);
      await probe('replacement-reopen', reopened.status, getSnapshot(reopened));
      return stages;
    }, { suffix: info.testId, frozenParent });
    await evidence(info, { frozenParent, probes });
    expect(probes.map(probe => probe.status)).toEqual(['new', 'ready', 'committed', 'ready', 'already-applied', 'conflict', 'committed', 'ready']);
    for (const probe of probes) {
      expect(probe.deeplyFrozen, probe.stage).toBe(true);
      expect(probe.mutationPrevented, probe.stage).toBe(true);
      expect(probe.exportMatchesNative, probe.stage).toBe(true);
      expect(probe.sameExportReference, probe.stage).toBe(true);
      expect(probe.signalsUnchanged, probe.stage).toBe(true);
    }
  });
}

test('recovery gap: normal validated export refuses readable unsupported roots without changing them', async ({ page }, info) => {
  const initial = await open(page, info.testId);
  const outcomes = [];
  for (const unsupported of ['schema', 'content', 'policy'] as const) {
    const suffix = `${info.testId}-${unsupported}`;
    const raw = { ...initial.token, revision: 37, unknownRoot: { keep: ['future', null] }, save: {
      ...initial.save, schemaVersion: unsupported === 'schema' ? 2 : 1,
      contentVersion: unsupported === 'content' ? 'future-content' : initial.save.contentVersion,
      rewardPolicyVersion: unsupported === 'policy' ? 'future-policy' : initial.save.rewardPolicyVersion,
      unknownSave: { doNotStrip: true },
    } };
    await page.evaluate(({ suffix, raw }) => window.saveRepositoryFixture.seedUnknown(suffix, raw), { suffix, raw });
    const loaded = await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), suffix);
    expect(loaded.status).toBe('unsupported');
    const rejected = await page.evaluate(async () => {
      try { await window.saveRepositoryFixture.snapshot(); return 'unexpected export'; }
      catch (error) { return (error as Error).message; }
    });
    expect(rejected).toMatch(/Fixture unsupported/);
    expect(await page.evaluate(() => window.saveRepositoryFixture.rawRead())).toEqual(raw);
    outcomes.push({ unsupported, raw, loaded, rejected });
  }
  await evidence(info, { outcomes });
});

test('raw recovery exports unsupported schema/content/policy and newer structure without validation or mutation', async ({ page }, info) => {
  const initial = await open(page, info.testId);
  await page.evaluate(() => window.saveRepositoryFixture.sentinel());
  const outcomes = [];
  for (const unsupported of ['schema', 'content', 'policy', 'structure'] as const) {
    const suffix = `${info.testId}-${unsupported}`;
    const raw = { ...initial.token, revision: 37, unknownRoot: { keep: ['future', null], text: 'é🙂\n"\\' }, save: {
      ...initial.save, schemaVersion: unsupported === 'schema' ? 2 : 1,
      contentVersion: unsupported === 'content' ? 'future-content' : initial.save.contentVersion,
      rewardPolicyVersion: unsupported === 'policy' ? 'future-policy' : initial.save.rewardPolicyVersion,
      installation: { ...initial.save.installation, timezone: 'Etc/Future' },
      competition: { ...initial.save.competition, latestOpenedWeek: '3026-12-28', unknownCalendar: { retain: true } },
      unknownSave: { doNotStrip: true },
    } };
    const version = unsupported === 'structure' ? 7 : 1;
    await page.evaluate(({ suffix, raw, version }) => window.saveRepositoryFixture.seedUnknown(suffix, raw, version), { suffix, raw, version });
    const normal = await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), suffix);
    expect(normal.status).toBe('unsupported');
    const probe = await page.evaluate(() => window.saveRepositoryFixture.recoveryProbe());
    expect(probe.result.status).toBe('available');
    if (probe.result.status !== 'available') throw new Error('Expected raw recovery');
    expect(probe.result.representation).toBe('raw-indexeddb-root-json');
    expect(probe.result.structuralVersion).toBe(version);
    expect(probe.result.databaseName).toBe(`learning-is-fun:/playtest/:repository-${suffix}:save`);
    expect(JSON.parse(probe.result.json)).toEqual(raw);
    expect(probe.result.byteLength).toBe(Buffer.byteLength(probe.result.json, 'utf8'));
    expect(probe.validationDelta).toBe(0); expect(probe.signalsDelta).toBe(0);
    expect(probe.audit.map(event => event.kind)).toEqual(['open', 'transaction']);
    expect(probe.audit[0].requestedVersion).toBeUndefined();
    expect(probe.audit[1].mode).toBe('readonly');
    const after = await page.evaluate(() => window.saveRepositoryFixture.rawRead());
    expect(after).toEqual(raw);
    expect(await page.evaluate(() => window.saveRepositoryFixture.readSentinel())).toEqual({ marker: 'untouched' });
    expect((await page.evaluate(() => window.saveRepositoryFixture.load())).status).toBe('unsupported');
    outcomes.push({ unsupported, normal, before: raw, probe, after });
  }
  await evidence(info, { outcomes, sentinel: { marker: 'untouched' } });
});

test('raw recovery does not create missing databases or fill absent roots/stores', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(fixture);
  const absentSuffix = `${info.testId}-absent`;
  await page.evaluate(suffix => window.saveRepositoryFixture.prepareRecovery(suffix), absentSuffix);
  expect(await page.evaluate(() => window.saveRepositoryFixture.hasDatabase())).toBe(false);
  const absent = await page.evaluate(() => window.saveRepositoryFixture.recoveryProbe());
  expect(absent.result).toMatchObject({ status: 'unavailable', cause: 'absent-database' });
  expect(absent.validationDelta).toBe(0); expect(absent.signalsDelta).toBe(0);
  expect(absent.audit.map(event => event.kind)).toEqual(['open', 'upgrade']);
  expect(await page.evaluate(() => window.saveRepositoryFixture.hasDatabase())).toBe(false);
  const missingSuffix = `${info.testId}-missing-root`;
  await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), missingSuffix);
  await page.evaluate(() => window.saveRepositoryFixture.seed(null));
  await page.evaluate(suffix => window.saveRepositoryFixture.prepareRecovery(suffix), missingSuffix);
  const missing = await page.evaluate(() => window.saveRepositoryFixture.recoveryProbe());
  expect(missing.result).toMatchObject({ status: 'unavailable', cause: 'missing-root' });
  expect(await page.evaluate(() => window.saveRepositoryFixture.rawRead())).toBeUndefined();
  const unknownSuffix = `${info.testId}-missing-store`;
  await page.evaluate(suffix => window.saveRepositoryFixture.unknownStore(suffix), unknownSuffix);
  await page.evaluate(suffix => window.saveRepositoryFixture.prepareRecovery(suffix), unknownSuffix);
  const unknown = await page.evaluate(() => window.saveRepositoryFixture.recoveryProbe());
  expect(unknown.result).toMatchObject({ status: 'unavailable', cause: 'missing-store' });
  await page.evaluate(() => window.saveRepositoryFixture.close());
  const closed = await page.evaluate(() => window.saveRepositoryFixture.recoveryProbe());
  expect(closed.result).toMatchObject({ status: 'unavailable', cause: 'closed' });
  expect(closed.audit).toEqual([]);
  expect(errors).toEqual([]);
  await evidence(info, { absent, missing, unknown, closed });
});

test('raw recovery reports unreadable requests and retries without changing the native root', async ({ page }, info) => {
  const initial = await open(page, info.testId);
  const before = await page.evaluate(() => window.saveRepositoryFixture.rawRead());
  await page.evaluate(() => window.saveRepositoryFixture.failRecoveryRead());
  const failed = await page.evaluate(() => window.saveRepositoryFixture.recoveryProbe());
  expect(failed.result).toMatchObject({ status: 'unavailable', cause: 'unreadable' });
  expect(failed.validationDelta).toBe(0); expect(failed.signalsDelta).toBe(0);
  expect(failed.audit.map(event => event.kind)).toEqual(['open', 'transaction']);
  const retry = await page.evaluate(() => window.saveRepositoryFixture.recoveryProbe());
  expect(retry.result.status).toBe('available');
  if (retry.result.status !== 'available') throw new Error('Expected recovery retry');
  expect(JSON.parse(retry.result.json)).toEqual(before);
  const after = await page.evaluate(() => window.saveRepositoryFixture.rawRead());
  expect(after).toEqual(before);
  await evidence(info, { initial, before, failed, retry, after });
});

for (const mode of ['original', 'close', 'timeout'] as const) {
  test(`queued recovery settles ${mode} behind a genuinely blocked earlier upgrade and cleans up late connections`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(fixture);
    const result = await page.evaluate(({ suffix, mode }) => window.saveRepositoryFixture.queuedRecovery(suffix, mode), { suffix: info.testId, mode });
    await evidence(info, { mode, result });
    if (mode === 'close') {
      expect(result.beforeClose.settled).toBe(false);
      expect(result.afterClose).toMatchObject({ settled: true, cause: 'closed', queuedSettled: true });
      expect(result.result).toMatchObject({ status: 'unavailable', cause: 'closed' });
      expect(result.queuedResult).toMatchObject({ status: 'unavailable', cause: 'closed' });
      expect(result.closeSettlementMs).toBeLessThan(250);
    } else {
      expect(result.beforeClose).toMatchObject({ settled: true, cause: 'blocked' });
      expect(result.afterClose.settled).toBe(true);
      expect(result.result).toEqual({ status: 'unavailable', cause: 'blocked', message: 'Close other game tabs and retry the recovery export.' });
      expect(result.settlementMs).toBeLessThan(1500);
    }
    expect(result.rootAfter).toEqual(result.rootBefore);
    expect(result.retry).toMatchObject({ status: 'available', structuralVersion: 4 });
    if (result.retry.status !== 'available') throw new Error('Expected fresh recovery retry');
    expect(JSON.parse(result.retry.json)).toEqual(result.rootBefore);
    expect(result.validatorCalls).toBe(0);
    expect(result.signalCount).toBe(0);
    expect(result.audit.map(event => event.kind)).toEqual(['open']);
    // The version-4 upgrade is the already queued external probe; recovery
    // performs no transaction or publication when its own open arrives late.
    expect(result.lateAudit.filter(event => event.kind !== 'upgrade').map(event => event.kind)).toEqual(['open']);
    expect(result.lateConnectionClosed).toBe(true);
    expect(result.cleanupUpgradeMs).toBeLessThan(1500);
    expect(errors).toEqual([]);
  });
}

test('raw recovery reports non-JSON and bounded-capacity values without rewriting them', async ({ page }, info) => {
  await page.goto(fixture);
  const outcomes = await page.evaluate(async suffix => {
    const api = window.saveRepositoryFixture;
    const results = [];
    for (const kind of ['date', 'map', 'bigint', 'undefined', 'nonfinite', 'negative-zero', 'sparse-array', 'cycle', 'depth', 'values', 'bytes']) {
      const caseSuffix = `${suffix}-${kind}`;
      let extra: unknown;
      if (kind === 'date') extra = new Date('2026-10-09T00:00:00Z');
      if (kind === 'map') extra = new Map([['retain', 'unchanged']]);
      if (kind === 'bigint') extra = 9007199254740993n;
      if (kind === 'undefined') extra = undefined;
      if (kind === 'nonfinite') extra = Infinity;
      if (kind === 'negative-zero') extra = -0;
      if (kind === 'sparse-array') extra = new Array(2);
      if (kind === 'cycle') { const cycle: { self?: unknown } = {}; cycle.self = cycle; extra = cycle; }
      if (kind === 'depth') { extra = null; for (let depth = 0; depth < 34; depth++) extra = { child: extra }; }
      if (kind === 'values') extra = Array(250_001).fill(0);
      if (kind === 'bytes') extra = 'x'.repeat(16 * 1024 * 1024);
      const root = { epoch: `recovery-${kind}`, revision: 91, extra };
      await api.seedUnknown(caseSuffix, root);
      api.prepareRecovery(caseSuffix);
      const probe = await api.recoveryProbe();
      const after = await api.rawRead() as unknown as typeof root;
      const type = (value: unknown) => Object.prototype.toString.call(value);
      const preserved = after.epoch === root.epoch && after.revision === root.revision && type(after.extra) === type(extra)
        && (kind !== 'negative-zero' || Object.is(after.extra, -0))
        && (kind !== 'bigint' || after.extra === extra)
        && (kind !== 'cycle' || (after.extra as { self: unknown }).self === after.extra)
        && (kind !== 'values' || (after.extra as unknown[]).length === 250_001)
        && (kind !== 'bytes' || (after.extra as string).length === 16 * 1024 * 1024);
      results.push({ kind, probe, preserved, token: { epoch: after.epoch, revision: after.revision }, valueType: type(after.extra) });
    }
    return results;
  }, info.testId);
  await evidence(info, { outcomes });
  for (const outcome of outcomes) {
    expect(outcome.probe.result).toMatchObject({ status: 'unavailable', cause: ['depth', 'values', 'bytes'].includes(outcome.kind) ? 'capacity-exceeded' : 'non-json' });
    expect(outcome.preserved).toBe(true);
    expect(outcome.probe.validationDelta).toBe(0); expect(outcome.probe.signalsDelta).toBe(0);
    expect(outcome.probe.audit.map(event => event.kind)).toEqual(['open', 'transaction']);
    expect(outcome.probe.audit[1].mode).toBe('readonly');
  }
});
