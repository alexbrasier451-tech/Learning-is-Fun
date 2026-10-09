import { openSaveRepository } from '../../src/state/repository';
import { createImportSession, decodeBackup, exportBackup, measureBackupBudget, validateSave } from '../../src/state/backup';
import { migrateSupportedSave } from '../../src/state/migrations';
import { reconcileCompetitionWeek } from '../../src/rewards/calendar';
import { BACKUP_CATALOGUE, BACKUP_DATE, compactCapacityBackupSave, emptyBackupSave, multiProfileBackupSave } from './backup-data';
import type { CommitChanges, CommittedSnapshot, SaveDataV1, TransitionContext } from '../../src/state/contracts';
import { continueFreshWrongBackupSave, evictedPriorSuccessBackupSave, freshLearningBackupSave } from './backup-learning-regressions';
import { COSMETICS } from '../../src/experience/catalogue';
import { validateRewardState } from '../../src/rewards/scoring';
import { validateCompetitionState } from '../../src/rewards/standings';
const changes: CommitChanges = { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0, consumedSlot: null, newReceiptKeys: [], newEntitlementIds: [] }, unlockedIds: [], restorationIds: [], closedWeekIds: [] };
const context: TransitionContext = { nowEpochMs: Date.parse(BACKUP_DATE), catalogue: BACKUP_CATALOGUE, questBindings: [], milestone: 'M1', allocatedIds: {} };
const equal = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
  return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k)
    && equal((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
};
function assert(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }
async function rawRoot(namespace: string) {
  return new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open(`${namespace}:save`, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { const db = request.result, tx = db.transaction('records'), get = tx.objectStore('records').get('root');
      get.onerror = () => reject(get.error); tx.oncomplete = () => { db.close(); resolve(get.result); }; };
  });
}
function repository(initialSave: SaveDataV1, namespace: string) { return openSaveRepository({ appNamespace: namespace, initialSave, validateSave, catalogue: BACKUP_CATALOGUE }); }
function commit(repo: ReturnType<typeof repository>, current: CommittedSnapshot, next: SaveDataV1) {
  return repo.commitCommand({ kind: 'SetAudioPreferences', actionId: crypto.randomUUID(), expected: current.token, payload: { patch: { music: { volume: next.installation.audio.music.volume } } } },
    { context, reduce: () => ({ status: 'changed', save: next, changes }) });
}
export async function runBackupRoundtrip(capacity = false, populatedTarget = false) {
  const namespace = `learning-is-fun:backup-${crypto.randomUUID()}`, donorNamespace = `${namespace}-donor`;
  const logical = capacity ? compactCapacityBackupSave() : multiProfileBackupSave();
  const donor = repository(logical, donorNamespace), target = repository(populatedTarget ? multiProfileBackupSave() : emptyBackupSave(), namespace);
  const session = createImportSession();
  try {
    const initial = await target.readExportSnapshot(), exported = exportBackup(await donor.readExportSnapshot(), BACKUP_DATE);
    const decoded = decodeBackup(exported.json, BACKUP_CATALOGUE); assert(decoded.status === 'valid', 'Self backup must decode');
    const preview = session.prepareImport(decoded.envelope, initial);
    const before = await rawRoot(namespace); assert(equal(before, await rawRoot(namespace)), 'Preview changed root');
    const ready = session.confirmImport(preview.preparedImportId, initial); assert(ready.status === 'ready', 'Explicit confirmation must consume private payload');
    const replaced = await target.replaceSave({ expected: ready.preparedImport.expected, validatedSave: ready.preparedImport.save, replacementEpoch: crypto.randomUUID() });
    assert(replaced.status === 'committed', 'Replacement must commit'); assert(equal(replaced.snapshot.save, logical), 'Import must exactly replace logical state before calendar reconciliation');
    assert(replaced.snapshot.token.epoch !== initial.token.epoch && replaced.snapshot.token.revision === 0, 'Replacement must use a new local epoch');
    const oldEpoch = await commit(target, initial, emptyBackupSave()); assert(oldEpoch.status === 'conflict', 'Old epoch queued write must conflict');
    assert(equal((await target.readExportSnapshot()).save, logical), 'Old queued command changed imported save');
    const identical = exportBackup(replaced.snapshot, BACKUP_DATE); assert(identical.json === exported.json, 'Re-export must exactly equal donor JSON');
    const importedRaw = await rawRoot(namespace);
    const migrated = migrateSupportedSave(decoded.envelope, 'm1'); assert(migrated.status === 'valid' && equal(migrated.envelope, decoded.envelope), 'M1 update identity must preserve all logical state');
    target.close(); const reopened = repository(emptyBackupSave(), namespace);
    const load = await reopened.loadRoot(); assert(load.status === 'ready' && equal(load.snapshot, replaced.snapshot), 'Reload must preserve replacement');
    const recon = reconcileCompetitionWeek({ competition: load.snapshot.save.competition,
      profiles: Object.values(load.snapshot.save.profiles).map(p => ({ ...p.identity, lifetimePoints: p.rewards.lifetimePoints, personalRecords: p.personalRecords })) }, Date.parse('2026-10-20T12:00:00.000Z'));
    const next: SaveDataV1 = { ...load.snapshot.save, competition: recon.nextCompetition,
      profiles: Object.fromEntries(Object.entries(load.snapshot.save.profiles).map(([id, p]) => [id, { ...p, personalRecords: recon.nextPersonalRecordsByProfile[id] }])) };
    const rollover = await commit(reopened, load.snapshot, next); assert(rollover.status === 'committed', 'Separate normal resume reconciliation must commit');
    assert(rollover.snapshot.save.competition.latestOpenedWeek === '2026-10-19', 'Resume opens actual later week'); reopened.close();
    return { namespace, initialToken: initial.token, importedToken: replaced.snapshot.token, importBeforeReconcileEqual: true,
      reexportEqual: true, oldEpochStatus: oldEpoch.status, importedRaw, budget: measureBackupBudget(decoded.envelope),
      profileCount: preview.profileCount, restoredLifetime: Object.values(replaced.snapshot.save.profiles).map(p => p.rewards.lifetimePoints),
      nextWeek: rollover.snapshot.save.competition.latestOpenedWeek, rolloverToken: rollover.snapshot.token,
      archivesBefore: logical.competition.archives.length, archivesAfter: rollover.snapshot.save.competition.archives.length };
  } finally { donor.close(); target.close(); session.clear(); }
}
export async function runBackupRejections() {
  const namespace = `learning-is-fun:backup-reject-${crypto.randomUUID()}`;
  const target = repository(multiProfileBackupSave(), namespace), peer = repository(emptyBackupSave(), namespace), session = createImportSession();
  try {
    const current = await target.readExportSnapshot(), before = await rawRoot(namespace);
    const source = exportBackup({ ...current, save: compactCapacityBackupSave() }, BACKUP_DATE).json;
    const decoded = decodeBackup(source, BACKUP_CATALOGUE); assert(decoded.status === 'valid', 'Capacity source must decode');
    let preview = session.prepareImport(decoded.envelope, current); session.cancelImport(preview.preparedImportId);
    assert(session.confirmImport(preview.preparedImportId, current).status === 'expired' && equal(before, await rawRoot(namespace)), 'Cancel changed root');
    const rejected: string[] = [];
    const invalid = [source.slice(0, -1), ' '.repeat(16 * 1024 * 1024 + 1), '['.repeat(33) + '0' + ']'.repeat(33),
      source.replace('"schemaVersion":1', '"schemaVersion":2'), source.replace('"lifetimePoints":55', '"lifetimePoints":999'),
      source.replace('q1-transfer-m01', 'unknown-binding')];
    for (const text of invalid) { const result = decodeBackup(text, BACKUP_CATALOGUE); assert(result.status !== 'valid', 'Malformed backup passed'); rejected.push(result.status); assert(equal(before, await rawRoot(namespace)), 'Rejected decode changed root'); }
    preview = session.prepareImport(decoded.envelope, current);
    const ready = session.confirmImport(preview.preparedImportId, current); assert(ready.status === 'ready', 'Prepare confirm');
    const winner = await commit(peer, current, { ...current.save, installation: { ...current.save.installation, audio: { ...current.save.installation.audio, music: { muted: true, volume: .42 } } } });
    assert(winner.status === 'committed', 'Intervening peer play must commit'); const intervening = await rawRoot(namespace);
    const race = await target.replaceSave({ expected: ready.preparedImport.expected, validatedSave: ready.preparedImport.save, replacementEpoch: crypto.randomUUID() });
    assert(race.status === 'conflict' && equal(intervening, await rawRoot(namespace)), 'In-tx stale preview erased intervening play');
    preview = session.prepareImport(decoded.envelope, current); assert(session.confirmImport(preview.preparedImportId, winner.snapshot).status === 'conflict', 'Local stale preview should require reissue');
    const over = structuredClone(current.save) as unknown as { profiles: Record<string, unknown> };
    for (let n = 0; n < 15; n++) over.profiles[`extra${n}`] = current.save.profiles.ben;
    const refused = await commit(target, winner.snapshot, over as SaveDataV1); assert(refused.status === 'invalid' && refused.reason.code === 'capacity-exceeded' && equal(intervening, await rawRoot(namespace)), 'Capacity write must preserve root');
    preview = session.prepareImport(decoded.envelope, winner.snapshot); const reissued = session.confirmImport(preview.preparedImportId, winner.snapshot); assert(reissued.status === 'ready', 'Fresh preview should work');
    const replaced = await target.replaceSave({ expected: reissued.preparedImport.expected, validatedSave: reissued.preparedImport.save, replacementEpoch: crypto.randomUUID() }); assert(replaced.status === 'committed', 'Fresh confirmed replacement should commit');
    return { namespace, cancelUnchanged: true, rejected, beforeToken: current.token, interveningToken: winner.snapshot.token,
      raceStatus: race.status, capacityStatus: refused.status, capacityReason: refused.reason.code, reissuedStatus: replaced.status, replacementToken: replaced.snapshot.token };
  } finally { target.close(); peer.close(); session.clear(); }
}
export async function runUnsupportedRecovery() {
  const namespace = `learning-is-fun:backup-future-${crypto.randomUUID()}`;
  const repo = repository(multiProfileBackupSave(), namespace); const original = await repo.readExportSnapshot(); repo.close();
  const future = { epoch: original.token.epoch, revision: original.token.revision, save: { ...original.save, schemaVersion: 2 } };
  await new Promise<void>((resolve, reject) => { const request = indexedDB.open(`${namespace}:save`, 1);
    request.onerror = () => reject(request.error); request.onsuccess = () => { const db = request.result, tx = db.transaction('records', 'readwrite');
      tx.objectStore('records').put(future, 'root'); tx.oncomplete = () => { db.close(); resolve(); }; tx.onabort = () => reject(tx.error); }; });
  const before = await rawRoot(namespace), reopened = repository(emptyBackupSave(), namespace);
  try {
    const load = await reopened.loadRoot(); assert(load.status === 'unsupported', 'Future logical save must enter read-only recovery');
    let exportSucceeded = false; try { await reopened.readExportSnapshot(); exportSucceeded = true; } catch { /* Actual current producer limitation. */ }
    const after = await rawRoot(namespace); assert(equal(before, after), 'Unsupported load/export must never reset the root');
    return { namespace, loadStatus: load.status, reason: load.reason, before, after, preserved: true, normalValidatedExportAvailable: exportSucceeded };
  } finally { reopened.close(); }
}
export async function runSupportedSuccessRegression() {
  const variants = [[true], [false, false], [false, true], [true, false], [true, true]].map(hints => {
    const save = freshLearningBackupSave(hints.map(hinted => ({ hinted }))), p = save.profiles.ben;
    const decoded = decodeBackup(JSON.stringify({ format: 'learning-is-fun-save', schemaVersion: 1, exportedAt: BACKUP_DATE, save }), BACKUP_CATALOGUE);
    return { hints, band: p.learning.evidence.M01!.bands.support, lifetime: p.rewards.lifetimePoints,
      validation: validateSave(save, BACKUP_CATALOGUE), decodeStatus: decoded.status,
      rewardIssues: validateRewardState(p.rewards, save.competition, 'ben', COSMETICS),
      competitionIssues: validateCompetitionState(save.competition, [{ ...p.identity, lifetimePoints: p.rewards.lifetimePoints, personalRecords: p.personalRecords }]) };
  });
  const original = freshLearningBackupSave([{ hinted: true }, { hinted: true }]), first = freshLearningBackupSave([{ hinted: true }]);
  const namespace = `learning-is-fun:backup-supported-${crypto.randomUUID()}`, importNamespace = `${namespace}-import`;
  const repo = repository(first, namespace), imported = repository(emptyBackupSave(), importNamespace), session = createImportSession();
  try {
    const before = await repo.readExportSnapshot(), committed = await commit(repo, before, original), after = await repo.readExportSnapshot();
    let exported: ReturnType<typeof exportBackup> | null = null, exportError: string | null = null;
    try { exported = exportBackup({ save: original, token: after.token }, BACKUP_DATE); } catch (error) { exportError = error instanceof Error ? error.message : 'Export failed'; }
    const migration = migrateSupportedSave({ format: 'learning-is-fun-save', schemaVersion: 1, exportedAt: BACKUP_DATE, save: original }, 'm1');
    const compacted: SaveDataV1 = { ...original, profiles: { ben: { ...original.profiles.ben, encounters: {} } } };
    const compactedValidation = validateSave(compacted, BACKUP_CATALOGUE);
    let replacementStatus = 'not-attempted', importSnapshot: CommittedSnapshot | null = null;
    if (exported) {
      const decoded = decodeBackup(exported.json, BACKUP_CATALOGUE); assert(decoded.status === 'valid', 'Supported self-export must decode');
      const empty = await imported.readExportSnapshot(), preview = session.prepareImport(decoded.envelope, empty), ready = session.confirmImport(preview.preparedImportId, empty);
      assert(ready.status === 'ready', 'Supported preview must confirm');
      const replacement = await imported.replaceSave({ expected: ready.preparedImport.expected, validatedSave: ready.preparedImport.save, replacementEpoch: crypto.randomUUID() });
      replacementStatus = replacement.status; if (replacement.status === 'committed') { importSnapshot = replacement.snapshot; assert(equal(importSnapshot.save, original), 'Supported replacement must preserve every logical fact'); }
    }
    const fresh = evictedPriorSuccessBackupSave();
    return { namespace, importNamespace, variants, original, before, committedStatus: committed.status, after,
      expectedPersisted: equal(after.save, original), priorPreservedOnRefusal: equal(before, after), exportError,
      exportBytes: exported?.byteLength, decodeStatus: variants.at(-1)!.decodeStatus, migrationStatus: migration.status,
      compactedStatus: compactedValidation.status, replacementStatus, importSnapshot,
      fresh: { validationStatus: validateSave(fresh, BACKUP_CATALOGUE).status, band: fresh.profiles.ben.learning.evidence.M01!.bands.support } };
  } finally { repo.close(); imported.close(); session.clear(); }
}

export async function runActiveFirstCheckRegression() {
  const cases = [];
  for (const { corrupted, hinted } of [{ corrupted: false, hinted: true }, { corrupted: true, hinted: true }, { corrupted: false, hinted: false }]) {
    const original = freshLearningBackupSave([{ hinted, wrong: true }]), p = original.profiles.ben, skill = p.learning.evidence.M01!;
    const save: SaveDataV1 = corrupted ? { ...original, profiles: { ben: { ...p, learning: { ...p.learning,
      evidence: { ...p.learning.evidence, M01: { ...skill, activeEpisodes: { ...skill.activeEpisodes,
        'fresh-0': { ...skill.activeEpisodes['fresh-0'], firstCheckCorrect: true } } } } } } } } : original;
    const namespace = `learning-is-fun:backup-active-${crypto.randomUUID()}`, repo = repository(emptyBackupSave(), namespace), session = createImportSession();
    try {
      const before = await repo.readExportSnapshot(), decoded = decodeBackup(JSON.stringify({ format: 'learning-is-fun-save', schemaVersion: 1, exportedAt: BACKUP_DATE, save }), BACKUP_CATALOGUE);
      if (decoded.status !== 'valid') {
        // The normal facade cannot preview an invalid decoder result. Also
        // prove the authoritative writer refuses a caller bypass of that gate.
        const refused = await repo.replaceSave({ expected: before.token, validatedSave: save, replacementEpoch: crypto.randomUUID() });
        const after = await repo.readExportSnapshot();
        cases.push({ corrupted, hinted, namespace, decodeStatus: decoded.status, issues: decoded.issues, previewCreated: false,
          replacementStatus: refused.status, before, after, unchanged: equal(before, after) });
        continue;
      }
      const preview = session.prepareImport(decoded.envelope, before), ready = session.confirmImport(preview.preparedImportId, before);
      assert(ready.status === 'ready', 'Suspended control preview must confirm');
      const replaced = await repo.replaceSave({ expected: ready.preparedImport.expected, validatedSave: ready.preparedImport.save, replacementEpoch: crypto.randomUUID() });
      assert(replaced.status === 'committed', 'Suspended control must import');
      const continued = continueFreshWrongBackupSave(replaced.snapshot.save), nextValidation = validateSave(continued.save, BACKUP_CATALOGUE);
      const nextWrite = await commit(repo, replaced.snapshot, continued.save), after = await repo.readExportSnapshot();
      cases.push({ corrupted, hinted, namespace, decodeStatus: decoded.status, previewCreated: true, replacementStatus: replaced.status,
        before, replaced: replaced.snapshot, learningAdvanced: continued.learningAdvanced, delta: continued.delta,
        nextBand: continued.save.profiles.ben.learning.evidence.M01!.bands.support, nextValidationStatus: nextValidation.status,
        nextWriteStatus: nextWrite.status, after, expectedPersisted: equal(after.save, continued.save) });
    } finally { repo.close(); session.clear(); }
  }
  return cases;
}
declare global { interface Window { backupFixture: { runBackupRoundtrip: typeof runBackupRoundtrip; runBackupRejections: typeof runBackupRejections;
  runUnsupportedRecovery: typeof runUnsupportedRecovery; runSupportedSuccessRegression: typeof runSupportedSuccessRegression; runActiveFirstCheckRegression: typeof runActiveFirstCheckRegression } } }
window.backupFixture = { runBackupRoundtrip, runBackupRejections, runUnsupportedRecovery, runSupportedSuccessRegression, runActiveFirstCheckRegression };
