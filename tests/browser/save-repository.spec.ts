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
  expect(await page.evaluate(() => window.saveRepositoryFixture.observations().every(item => !item.duringCompletion))).toBe(true);
  expect(await page.evaluate(async () => {
    const a = await window.saveRepositoryFixture.snapshot(); const b = await window.saveRepositoryFixture.snapshot();
    return a === b && Object.isFrozen(a) && Object.isFrozen(a.save.installation.audio);
  })).toBe(true);
  await page.reload();
  const reload = ready(await page.evaluate(suffix => window.saveRepositoryFixture.open(suffix), info.testId));
  expect(reload).toEqual(after.snapshot);
  await evidence(info, { namespace: await page.evaluate(() => window.saveRepositoryFixture.namespace), before, after, raw, reload });
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
