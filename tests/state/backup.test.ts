import { describe, expect, it } from 'vitest';
import { BACKUP_FORMAT, createImportSession, decodeBackup, decodeBackupFile, exportBackup, exportFromController, measureBackupBudget, prepareImport, confirmPreparedImport, validateSave } from '../../src/state/backup';
import type { BackupEnvelopeV1 } from '../../src/state/backup';
import { migrateSupportedSave } from '../../src/state/migrations';
import type { SaveDataV1 } from '../../src/state/contracts';
import { SAVE_LIMITS } from '../../src/state/contracts';
import { BACKUP_CATALOGUE, BACKUP_DATE, compactCapacityBackupSave, emptyBackupSave, multiProfileBackupSave, resumedTransferBackupSave } from '../fixtures/backup-data';
import { resolveBindingIntent } from '../../src/learning/select';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { continueFreshWrongBackupSave, evictedPriorSuccessBackupSave, freshLearningBackupSave } from '../fixtures/backup-learning-regressions';

type Mutable<T> = T extends readonly (infer E)[] ? Mutable<E>[] : T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T;
const snapshot = (save = multiProfileBackupSave(), revision = 0) => ({ save, token: { epoch: 'local-epoch', revision } });
const envelope = (save: SaveDataV1 = multiProfileBackupSave()): BackupEnvelopeV1 => ({ format: BACKUP_FORMAT, schemaVersion: 1, exportedAt: BACKUP_DATE, save });
const decode = (v: unknown) => decodeBackup(JSON.stringify(v), BACKUP_CATALOGUE);
const mutable = () => structuredClone(envelope()) as Mutable<BackupEnvelopeV1>;
function valid(v: unknown) { const result = decode(v); expect(result).toMatchObject({ status: 'valid' }); if (result.status !== 'valid') throw new Error(JSON.stringify(result)); return result.envelope; }

describe('independent decoder findings F01/F02', () => {
  it.each([[true], [false, false], [false, true], [true, false], [true, true]].map(hints => ({ hints })))('F01: accepts original and mixed success hints $hints', ({ hints }) => {
    const save = freshLearningBackupSave(hints.map(hinted => ({ hinted })));
    const band = save.profiles.ben.learning.evidence.M01!.bands.support;
    expect(band.correctChecks).toBe(hints.length); expect(band.laterDistinctSuccesses).toBe(hints.length - 1);
    const decoded = valid(envelope(save)); expect(decoded.save).toEqual(save);
    const out = exportBackup(snapshot(save), BACKUP_DATE); expect(valid(JSON.parse(out.json)).save).toEqual(save);
    expect(migrateSupportedSave(envelope(save), 'm1')).toMatchObject({ status: 'valid' });
    const compacted: SaveDataV1 = { ...save, profiles: { ben: { ...save.profiles.ben, encounters: {} } } };
    expect(valid(envelope(compacted)).save).toEqual(compacted);
  });
  it('F01: retains true prior supported success after its ID expires from the four-completion window', () => {
    const save = evictedPriorSuccessBackupSave(), band = save.profiles.ben.learning.evidence.M01!.bands.support;
    expect(band).toMatchObject({ correctChecks: 2, independentSuccesses: 0, supportedSuccesses: 2, laterDistinctSuccesses: 1 });
    expect(band.recentCompletedEpisodes).toHaveLength(4);
    expect(band.recentCompletedEpisodes.some(e => e.canonicalQuestionId.endsWith('total-12'))).toBe(false);
    expect(valid(envelope(save)).save).toEqual(save); expect(exportBackup(snapshot(save), BACKUP_DATE).byteLength).toBeLessThan(SAVE_LIMITS.backupBytes);
  });
  it('F01: rejects later-distinct counts without a preceding success', () => {
    const save = freshLearningBackupSave([{ hinted: true }]) as Mutable<SaveDataV1>;
    save.profiles.ben.learning.evidence.M01!.bands.support.laterDistinctSuccesses = 1;
    expect(validateSave(save, BACKUP_CATALOGUE).status).toBe('invalid');
  });
  it.each([true, false])('F02: imports and continues suspended hinted=%s wrong producer work', hinted => {
    const original = freshLearningBackupSave([{ hinted, wrong: true }]);
    const restored = valid(envelope(original)); const next = continueFreshWrongBackupSave(restored.save);
    expect(next.learningAdvanced).toBe(true); expect(next.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: null });
    expect(next.save.profiles.ben.learning.evidence.M01!.bands.support).toMatchObject({ validChecks: 2, correctChecks: 1, completedEpisodes: 1, supportedSuccesses: 1, retrySuccesses: 1 });
    expect(valid(envelope(next.save)).save).toEqual(next.save);
  });
  it('F02: rejects the exact one-field active first-Check contradiction before preview', () => {
    const original = freshLearningBackupSave([{ hinted: true, wrong: true }]);
    const corrupt = structuredClone(original) as Mutable<SaveDataV1>;
    corrupt.profiles.ben.learning.evidence.M01!.activeEpisodes['fresh-0'].firstCheckCorrect = true;
    expect(validateSave(corrupt, BACKUP_CATALOGUE).status).toBe('invalid'); expect(decode(envelope(corrupt)).status).toBe('invalid');
    expect(continueFreshWrongBackupSave(corrupt).learningAdvanced).toBe(false);
  });
});

describe('actual M1 producer backups', () => {
  it('restores two profiles, compact sums, archived medals, helped unfinished closure, cosmetics and audio exactly', () => {
    const original = envelope(); const result = valid(original);
    expect(result).toEqual(original); expect(result.save).not.toBe(original.save);
    expect(Object.isFrozen(result.save.profiles.ada.encounters.transfer.assistance)).toBe(true);
    expect(result.save.profiles.ada.encounters.source).toBeUndefined();
    const p = result.save.profiles.ada;
    expect(p.rewards.tracksByCanonical['lif.math.bridge.r1.total-12']).toMatchObject({ completedThroughOrdinal: 1, closedAwardTotal: 20 });
    expect(p.encounters.transfer).toMatchObject({ validChecks: 1, firstCheckCorrect: false, learningEpisode: { ordinal: 1, status: 'completed-unsuccessful', completionActionId: 'finish-transfer' } });
    expect(resolveBindingIntent({ route: { kind: 'optional-transfer', bindingId: 'q1-transfer-m01' }, milestone: 'M1', catalogue: BACKUP_CATALOGUE,
      bindings: QUEST_ACTIVITY_BINDINGS, accessibleQuestIds: ['Q1', 'Q2'], completedStoryBindingIds: p.world.completedStoryBindingIds }).status).toBe('resolved');
    expect(exportBackup(snapshot(result.save), BACKUP_DATE)).toEqual(exportBackup(snapshot(original.save), BACKUP_DATE));
  });
  it('self-exports/imports a compact sixteen-profile household within measured budgets', () => {
    const save = compactCapacityBackupSave(); const out = exportBackup(snapshot(save), BACKUP_DATE);
    const decoded = valid(JSON.parse(out.json)); expect(decoded.save).toEqual(save);
    const budget = measureBackupBudget(decoded);
    expect(budget.byteLength).toBe(out.byteLength); expect(budget.visitedValues).toBeLessThan(250000); expect(budget.nesting).toBeLessThanOrEqual(32);
    console.info('WP04-03A compact16 budget', JSON.stringify(budget));
  });
  it('accepts a clean empty root and shared immutable constants without retaining aliases', () => {
    const input = emptyBackupSave(); expect(validateSave(input, BACKUP_CATALOGUE).status).toBe('valid');
    const v = mutable(); v.save.profiles.ben.preferences = v.save.profiles.ada.preferences;
    expect(validateSave(v.save, BACKUP_CATALOGUE).status).toBe('valid');
  });
  it('preserves legitimate deleted-archive rank gaps and older aggregates', () => {
    const v = mutable(); const a = v.save.competition.archives[0];
    a.omittedDeletedProfiles = true; a.entries[0].rank = 2; a.entries[0].medal = 'silver';
    v.save.profiles.ada.personalRecords.medals = { gold: 0, silver: 1, bronze: 0 };
    expect(decode(v).status).toBe('valid');
  });
  it('accepts suspended wrong work and a new zero-Check episode without renewing opportunity', () => {
    const v = mutable(), e = v.save.profiles.ada.encounters.transfer;
    e.learningEpisode = { ordinal: 2, status: 'suspended', validChecks: 0, firstCheckSequence: null, completionActionId: null };
    const result = valid(v); expect(result.save.profiles.ada.encounters.transfer.opportunityId).toBe(e.opportunityId);
    expect(result.save.profiles.ada.encounters.transfer.lastCommittedCheck?.learningEpisodeOrdinal).toBe(1);
  });
  it('validates a fresh original finish → resume → correct path without renewing first-Check rewards', () => {
    const original = valid(envelope(resumedTransferBackupSave()));
    const p = original.save.profiles.ada, e = p.encounters.transfer;
    expect(e).toMatchObject({ opportunityId: 'op-transfer', validChecks: 2, firstCheckCorrect: false,
      learningEpisode: { ordinal: 2, validChecks: 1, firstCheckSequence: 2, status: 'completed-success' },
      lastCommittedCheck: { delta: { lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: null } } });
    expect(p.learning.evidence.M01!.bands.support).toMatchObject({ validChecks: 4, completedEpisodes: 4, independentSuccesses: 1, supportedSuccesses: 2, retrySuccesses: 1 });
    expect(p.rewards.lifetimePoints).toBe(60); expect(original.save.competition.currentScores.ada).toBe(20);
    expect(p.world.completedStoryBindingIds).toEqual(['q1-story-m01']);
  });
  it('joins all three actual M1 response families and validates stricter family drafts', () => {
    const v = structuredClone(envelope(multiProfileBackupSave(false, true))) as Mutable<BackupEnvelopeV1>;
    expect(valid(v).save.profiles.ada.rewards.lifetimePoints).toBe(95);
    v.save.profiles.ada.encounters.transfer.responseDraft = { kind: 'bridge', planks: [] };
    expect(decode(v).status).toBe('valid');
    v.save.profiles.ada.encounters.merchant.responseDraft = { kind: 'merchant', apples: 100, pears: 3 };
    expect(decode(v).status).toBe('invalid');
    v.save.profiles.ada.encounters.merchant.responseDraft = { kind: 'merchant', apples: 6, pears: 3 };
    v.save.profiles.ada.encounters.punctuation.responseDraft = { kind: 'punctuation', slots: { question: '??', discovery: '!' } };
    expect(decode(v).status).toBe('invalid');
  });
  it('accepts unchecked free practice before the producer creates first-Check counters', () => {
    const v = mutable(), ben = v.save.profiles.ben, template = v.save.profiles.ada.encounters.transfer;
    const assistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' as const };
    ben.encounters.unchecked = { ...template, encounterId: 'unchecked', opportunityId: null, selectionReason: 'child-easier', bindingProvenance: null,
      validChecks: 0, firstCheckCorrect: null, assistance, learningEpisode: { ordinal: 1, status: 'suspended', validChecks: 0, firstCheckSequence: null, completionActionId: null },
      responseDraft: { kind: 'bridge', planks: [] }, revealedAssistanceIds: [], lastCommittedCheck: null, eligibility: { kind: 'practice-only', reason: 'child-practice' } };
    ben.learning.canonicalHistory = [{ canonicalQuestionId: template.canonicalQuestionId, pendingEncounterId: 'unchecked', everChecked: false,
      previousSuccessLocalDate: null, previousSuccessWeek: null, checkedCompetitionWeekIds: [], assistance }];
    expect(decode(v).status).toBe('valid');
    ben.encounters.unchecked.validChecks = 1; expect(decode(v).status).toBe('invalid');
  });
  it('preserves older hinted completion when a later independent review replaces canonical help history', () => {
    const result = valid(envelope(multiProfileBackupSave(true, false, true)));
    const p = result.save.profiles.ada;
    expect(p.encounters.source.assistance.answerHintUsed).toBe(true);
    expect(p.encounters.review.assistance.answerHintUsed).toBe(false);
    expect(p.rewards.tracksByCanonical['lif.math.bridge.r1.total-12'].closedAwardTotal).toBe(10);
    expect(p.learning.canonicalHistory[0].assistance.answerHintUsed).toBe(false);
  });
});

describe('untrusted fixed-format boundaries', () => {
  it.each(['{', '{"x":', 'not JSON', '[1,]', '', '\ufeff{}'])('rejects malformed/truncated text %j', source => expect(decodeBackup(source, BACKUP_CATALOGUE).status).toBe('invalid'));
  it('checks file.size before reading and repeats the UTF-8 bound for text callers', async () => {
    let reads = 0; const result = await decodeBackupFile({ size: SAVE_LIMITS.backupBytes + 1, text: async () => { reads++; return '{}'; } }, BACKUP_CATALOGUE);
    expect(result.status).toBe('invalid'); expect(reads).toBe(0);
    expect(decodeBackup(' '.repeat(SAVE_LIMITS.backupBytes + 1), BACKUP_CATALOGUE).status).toBe('invalid');
    expect(decodeBackup('é'.repeat(SAVE_LIMITS.backupBytes / 2 + 1), BACKUP_CATALOGUE).status).toBe('invalid');
  });
  it('counts actual containers while ignoring quoted braces/escapes', () => {
    expect(decodeBackup('['.repeat(33) + '0' + ']'.repeat(33), BACKUP_CATALOGUE)).toMatchObject({ status: 'invalid', issues: [{ code: 'capacity-exceeded' }] });
    const v = mutable(); v.save.profiles.ada.identity.nickname = '"\\{}[]'; expect(decode(v).status).toBe('valid');
  });
  it('rejects duplicate member names and dangerous escaped keys before parse', () => {
    expect(decodeBackup('{"a":1,"a":2}', BACKUP_CATALOGUE).status).toBe('invalid');
    for (const key of ['__proto__', 'constructor', 'prototype', '\\u005f_proto__']) expect(decodeBackup(`{"${key}":{}}`, BACKUP_CATALOGUE).status).toBe('invalid');
  });
  it('rejects oversized value trees, strings, non-JSON numbers, getters and cycles before decoding', () => {
    const v = mutable(); const before = JSON.stringify(v);
    expect(validateSave({ ...v.save, extra: Array(250001).fill(0) }, BACKUP_CATALOGUE)).toMatchObject({ status: 'invalid', issues: [{ code: 'capacity-exceeded' }] });
    expect(validateSave({ ...v.save, extra: 'x'.repeat(4097) }, BACKUP_CATALOGUE).status).toBe('invalid');
    expect(validateSave({ ...v.save, extra: NaN }, BACKUP_CATALOGUE).status).toBe('invalid');
    let gets = 0; const accessor = Object.defineProperty({}, 'extra', { enumerable: true, get() { gets++; return 1; } });
    expect(validateSave(accessor, BACKUP_CATALOGUE).status).toBe('invalid'); expect(gets).toBe(0);
    const cycle: Record<string, unknown> = {}; cycle.self = cycle; expect(validateSave(cycle, BACKUP_CATALOGUE).status).toBe('invalid');
    expect(JSON.stringify(v)).toBe(before);
  });
  it('accepts exact byte/value/depth/text budgets and rejects their next value', () => {
    const source = JSON.stringify(envelope(emptyBackupSave()));
    expect(decodeBackup(source + ' '.repeat(SAVE_LIMITS.backupBytes - new TextEncoder().encode(source).byteLength), BACKUP_CATALOGUE).status).toBe('valid');
    expect(measureBackupBudget(Array(249999).fill(0) as unknown as BackupEnvelopeV1).visitedValues).toBe(250000);
    expect(() => measureBackupBudget(Array(250000).fill(0) as unknown as BackupEnvelopeV1)).toThrow();
    const nested = (n: number) => { let value: unknown = 0; while (n--) value = [value]; return value as BackupEnvelopeV1; };
    expect(measureBackupBudget(nested(32)).nesting).toBe(32); expect(() => measureBackupBudget(nested(33))).toThrow();
    expect(() => measureBackupBudget(['x'.repeat(4096)] as unknown as BackupEnvelopeV1)).not.toThrow();
    expect(() => measureBackupBudget(['x'.repeat(4097)] as unknown as BackupEnvelopeV1)).toThrow();
    const v = mutable(); const longId = 'i'.repeat(160); const ben = v.save.profiles.ben;
    delete v.save.profiles.ben; ben.identity.profileId = longId; ben.identity.nickname = 'n'.repeat(24); v.save.profiles[longId] = ben;
    expect(decode(v).status).toBe('valid');
  });
  it('rejects sparse/custom arrays and a serialized over-budget object before shape decoding', () => {
    const sparse = Array(1); Object.assign(sparse, { x: 0 });
    expect(validateSave({ extra: sparse }, BACKUP_CATALOGUE).status).toBe('invalid');
    expect(validateSave({ extra: Array(4100).fill('x'.repeat(4096)) }, BACKUP_CATALOGUE)).toMatchObject({ status: 'invalid', issues: [{ code: 'capacity-exceeded' }] });
  });
  const faults: readonly [string, (v: Mutable<BackupEnvelopeV1>) => void][] = [
    ['seventeenth profile', v => { for (let n = 0; n < 15; n++) v.save.profiles[`extra${n}`] = v.save.profiles.ben; }],
    ['empty nickname', v => { v.save.profiles.ada.identity.nickname = ''; }],
    ['long nickname', v => { v.save.profiles.ada.identity.nickname = 'x'.repeat(25); }],
    ['long ID', v => { v.save.profiles.ada.encounters.transfer.encounterId = 'x'.repeat(161); }],
    ['extra root field', v => { Object.assign(v.save, { epoch: 'imported-epoch' }); }],
    ['extra profile field', v => { Object.assign(v.save.profiles.ada, { score: 500 }); }],
    ['extra nested field', v => { Object.assign(v.save.profiles.ada.encounters.transfer.lastCommittedCheck!.delta, { grants: [] }); }],
    ['bad timestamp', v => { v.exportedAt = '2026-02-30T12:00:00.000Z'; }],
    ['negative counter', v => { v.save.profiles.ada.rewards.lifetimePoints = -1; }],
    ['fractional counter', v => { v.save.profiles.ada.encounters.transfer.validChecks = 1.2; }],
    ['unsafe counter', v => { v.save.profiles.ada.encounters.transfer.validChecks = Number.MAX_SAFE_INTEGER + 1; }],
    ['bad volume', v => { v.save.installation.audio.music.volume = 1.01; }],
    ['bad avatar', v => { Object.assign(v.save.profiles.ada.identity, { avatarId: 'missing' }); }],
    ['bad motion', v => { Object.assign(v.save.profiles.ada.preferences, { motion: 'fast' }); }],
    ['bad date', v => { v.save.profiles.ada.learning.canonicalHistory[0].previousSuccessLocalDate = '2026-02-30'; }],
    ['not Monday', v => { v.save.competition.latestOpenedWeek = '2026-10-13'; }],
    ['identity mismatch', v => { v.save.profiles.ada.identity.profileId = 'ben'; }],
    ['duplicate history', v => { v.save.profiles.ada.learning.canonicalHistory.push(v.save.profiles.ada.learning.canonicalHistory[0]); }],
    ['dangling pending', v => { v.save.profiles.ada.learning.canonicalHistory[1].pendingEncounterId = 'gone'; }],
    ['binding role', v => { v.save.profiles.ada.encounters.transfer.bindingProvenance!.role = 'story'; }],
    ['binding quest', v => { v.save.profiles.ada.encounters.transfer.bindingProvenance!.questId = 'Q2'; }],
    ['binding task', v => { v.save.profiles.ada.encounters.transfer.bindingProvenance!.bindingId = 'q2-transfer-e06'; }],
    ['optional permanent ID', v => { v.save.profiles.ada.world.completedStoryBindingIds.push('q1-transfer-m01'); }],
    ['lost permanent source', v => { v.save.profiles.ada.world.completedStoryBindingIds = []; }],
    ['quest reward mismatch', v => { v.save.profiles.ada.rewards.questReceipts = []; }],
    ['missing prerequisite', v => { v.save.profiles.ada.world.completedQuestIds.push('Q3'); }],
    ['task revision mismatch', v => { v.save.profiles.ada.encounters.transfer.taskContentRevision = 'unknown'; }],
    ['bad draft', v => { v.save.profiles.ada.encounters.transfer.responseDraft = { kind: 'bridge', planks: [7] }; }],
    ['extra response field', v => { Object.assign(v.save.profiles.ada.encounters.transfer.responseDraft!, { html: '<script>' }); }],
    ['forged judgement', v => { v.save.profiles.ada.encounters.transfer.lastCommittedCheck!.evaluation.correct = true; }],
    ['Check mismatch', v => { v.save.profiles.ada.encounters.transfer.lastCommittedCheck!.checkSequence = 2; }],
    ['last Check delta omission', v => { const d = v.save.profiles.ada.encounters.transfer.lastCommittedCheck!.delta; d.lifetimeDelta = 0; d.competitiveDelta = 0; d.newReceiptKeys = []; }],
    ['episode renewal', v => { v.save.profiles.ada.encounters.transfer.learningEpisode.firstCheckSequence = 2; }],
    ['first Check renewal', v => { v.save.profiles.ada.encounters.transfer.firstCheckCorrect = true; }],
    ['completion missing', v => { v.save.profiles.ada.encounters.transfer.learningEpisode.completionActionId = null; }],
    ['help lost', v => { v.save.profiles.ada.encounters.transfer.assistance.answerHintUsed = false; }],
    ['unknown revealed assistance', v => { v.save.profiles.ada.encounters.transfer.revealedAssistanceIds.push('unknown-hint'); }],
    ['exclusive component violation', v => { v.save.profiles.ada.rewards.tracksByCanonical['lif.math.bridge.r1.total-12'].recentCompletedOpportunity!.components.independentSuccess = true; }],
    ['lifetime sum', v => { v.save.profiles.ada.rewards.lifetimePoints += 5; }],
    ['compact mark', v => { v.save.profiles.ada.rewards.tracksByCanonical['lif.math.bridge.r1.total-12'].completedThroughOrdinal = 2; }],
    ['entitlement', v => { v.save.profiles.ada.rewards.entitlementIds = []; }],
    ['duplicate slot', v => { v.save.competition.currentSlots.ada[1].slot = 1; }],
    ['weekly sum', v => { v.save.competition.currentScores.ada += 5; }],
    ['weekly cap', v => { v.save.competition.currentScores.ada = 601; }],
    ['archive order', v => { v.save.competition.archives.push(v.save.competition.archives[0]); }],
    ['archive capacity', v => { v.save.competition.archives = Array(53).fill(v.save.competition.archives[0]); }],
    ['archive dangling identity', v => { v.save.competition.archives[0].entries[0].profileId = 'gone'; }],
    ['aggregate impossible', v => { v.save.profiles.ada.learning.evidence.M01!.bands.support.correctChecks = 999; }],
    ['retained completion mismatch', v => { const b = v.save.profiles.ada.learning.evidence.M01!.bands.support; b.recentCompletedEpisodes[2].outcome = 'success'; b.correctChecks++; b.supportedSuccesses++; b.distinctSuccessfulCanonicalQuestionIds.push('lif.math.bridge.r1.total-10'); }],
    ['recent evidence capacity', v => { const b = v.save.profiles.ada.learning.evidence.M01!.bands.support; b.recentCompletedEpisodes = Array(5).fill(b.recentCompletedEpisodes[0]); }],
    ['unearned cosmetic', v => { v.save.profiles.ben.creative.scarfPatternId = 'scarf-leaf'; }],
    ['unavailable socket', v => { v.save.profiles.ada.creative.placements['plot-6'] = 'planter'; }],
  ];
  it.each(faults)('rejects %s without altering caller state', (_name, mutate) => {
    const v = mutable(); mutate(v); const before = JSON.stringify(v); const result = decode(v);
    expect(result.status).toBe('invalid'); expect(JSON.stringify(v)).toBe(before);
    if (result.status !== 'valid') expect(result.issues[0].message.length).toBeGreaterThan(0);
  });
  it.each(['schema', 'content', 'policy', 'canonical'])('preserves unsupported %s for compatible recovery', kind => {
    const v = mutable();
    if (kind === 'schema') Object.assign(v, { schemaVersion: 2 });
    if (kind === 'content') v.save.contentVersion = 'm2';
    if (kind === 'policy') v.save.rewardPolicyVersion = '2';
    if (kind === 'canonical') v.save.profiles.ada.learning.canonicalHistory[0].canonicalQuestionId = 'unknown-task';
    const before = JSON.stringify(v); expect(decode(v).status).toBe('unsupported'); expect(JSON.stringify(v)).toBe(before);
  });
});

describe('private confirmation and pure v1 identity', () => {
  it('previews only exact decoder-issued envelopes and exposes no saved payload', () => {
    const session = createImportSession(), decoded = valid(envelope());
    expect(() => session.prepareImport(envelope(), snapshot())).toThrow();
    const preview = session.prepareImport(decoded, snapshot()); expect(Object.keys(preview).sort()).toEqual(['expected', 'exportedAt', 'preparedImportId', 'profileCount', 'profileNames']);
    expect(preview.profileNames).toEqual(['Ada', 'Ben']); expect(preview.profileCount).toBe(2); expect(Object.isFrozen(preview.expected)).toBe(true);
    const confirmed = session.confirmImport(preview.preparedImportId, snapshot()); expect(confirmed.status).toBe('ready');
    if (confirmed.status === 'ready') expect(confirmed.preparedImport.save).toBe(decoded.save);
    expect(session.confirmImport(preview.preparedImportId, snapshot()).status).toBe('expired');
  });
  it('cancel/reload/reissue and intervening revision/epoch invalidate old previews', () => {
    const session = createImportSession(), decoded = valid(envelope()); const current = snapshot();
    let preview = session.prepareImport(decoded, current); session.cancelImport(preview.preparedImportId); expect(session.confirmImport(preview.preparedImportId, current).status).toBe('expired');
    preview = session.prepareImport(decoded, current); session.clear(); expect(session.confirmImport(preview.preparedImportId, current).status).toBe('expired');
    preview = session.prepareImport(decoded, current); expect(session.confirmImport(preview.preparedImportId, snapshot(current.save, 1)).status).toBe('conflict');
    preview = session.prepareImport(decoded, current); expect(session.confirmImport(preview.preparedImportId, { ...current, token: { epoch: 'new', revision: 0 } }).status).toBe('conflict');
    preview = session.prepareImport(decoded, current); const replacement = session.prepareImport(decoded, current);
    expect(session.confirmImport(preview.preparedImportId, current).status).toBe('expired'); expect(session.confirmImport(replacement.preparedImportId, current).status).toBe('ready');
  });
  it('migrates v1 only by validated identity, preserving weeks and input bytes', () => {
    const original = envelope(), before = JSON.stringify(original); const result = migrateSupportedSave(original, 'm1');
    expect(result.status).toBe('valid'); if (result.status === 'valid') { expect(result.envelope).toEqual(original); expect(result.envelope).not.toBe(original); }
    expect(JSON.stringify(original)).toBe(before); expect(migrateSupportedSave(original, 'm2').status).toBe('unsupported');
    expect(migrateSupportedSave({ ...original, schemaVersion: 0 } as unknown as BackupEnvelopeV1, 'm1').status).toBe('unsupported');
  });
  it('uses the exact private standalone preview pairing rather than a reconstructed preview', () => {
    const decoded = valid(envelope()); const preview = prepareImport(decoded, snapshot());
    expect(confirmPreparedImport({ ...preview }, snapshot()).status).toBe('expired');
    expect(confirmPreparedImport(preview, snapshot()).status).toBe('ready');
    expect(confirmPreparedImport(preview, snapshot()).status).toBe('expired');
  });
  it('flushes ordinary export and labels explicit last-committed recovery when pending/failed preferences block', async () => {
    const original = snapshot(); const ready = { ready: true, pendingCommands: 0, pendingPreferences: false, failedCommand: false, failedPreferences: false, unsavedTransition: false };
    let flushes = 0, reads = 0;
    const controller = { flush: async () => { flushes++; return ready; }, getSnapshot: () => { reads++; expect(flushes).toBeGreaterThan(0); return original; } };
    const fresh = await exportFromController(controller, BACKUP_DATE); expect(fresh).toMatchObject({ status: 'ready', source: 'committed' }); expect(flushes).toBe(1); expect(reads).toBe(1);
    for (const blockers of [{ pendingPreferences: true }, { failedPreferences: true }, { unsavedTransition: true }]) {
      const blocked = await exportFromController({ ...controller, flush: async () => ({ ...ready, ready: false, ...blockers }) }, BACKUP_DATE);
      expect(blocked.status).toBe('blocked'); expect(reads).toBe(1);
    }
    const recovery = await exportFromController({ ...controller, flush: async () => { throw new Error('Recovery must not imply a successful flush'); } }, BACKUP_DATE, 'last-committed-recovery');
    expect(recovery).toMatchObject({ status: 'ready', source: 'last-committed-recovery' }); expect(reads).toBe(2);
  });
  it('allows the complete Check plus once-only quest receipt delta and rejects wrong component amounts', () => {
    const v = structuredClone(envelope(multiProfileBackupSave(true))) as Mutable<BackupEnvelopeV1>, e = v.save.profiles.ada.encounters.source;
    expect(e.lastCommittedCheck!.delta.lifetimeDelta).toBe(40);
    expect(e.lastCommittedCheck!.delta.newReceiptKeys).toHaveLength(3);
    expect(decode(v).status).toBe('valid');
    e.lastCommittedCheck!.delta.lifetimeDelta++; expect(decode(v).status).toBe('invalid');
  });
});
