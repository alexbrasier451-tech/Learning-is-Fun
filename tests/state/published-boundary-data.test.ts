import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { QUEST_ACTIVITY_BINDINGS, validateBindings } from '../../src/content/quest-bindings';
import { QUESTS } from '../../src/experience/catalogue';
import { addCalendarDays, localDateAt, weekKeyFor } from '../../src/rewards/calendar';
import { createImportSession, decodeBackup, decodeBackupFile, validateSave } from '../../src/state/backup';
import type { StoredRoot } from '../../src/state/contracts';
import { createInitialSave, recognizeDuplicate, reduceCommand } from '../../src/state/transition';
import { BOUNDARY_CLOCKS, BoundaryHistory, boundaryCatalogue, buildPublishedBoundaryFixtures, exercisePublishedBoundary, PUBLISHED_BOUNDARY_BUILD } from '../fixtures/published-boundary-data';

const fixtures = buildPublishedBoundaryFixtures();
const byId = (id: string) => { const found = fixtures.find(f => f.id === id); if (!found) throw new Error(id); return found; };
const sha = (text: string | Uint8Array) => createHash('sha256').update(text).digest('hex');
const directory = resolve('artifacts/playtests/M1/producer-fixtures');

describe('published M1 whole-save boundary inputs', () => {
  it('has 36 delivered canonical tasks and needs no fabricated cap identity', () => {
    expect(boundaryCatalogue).toHaveLength(36);
    expect(new Set(boundaryCatalogue.map(t => t.canonicalQuestionId)).size).toBe(36);
    for (const skillId of ['M01', 'M04', 'E06']) expect(boundaryCatalogue.filter(t => t.skillId === skillId)).toHaveLength(12);
    expect(validateBindings(QUEST_ACTIVITY_BINDINGS, boundaryCatalogue, QUESTS.map(q => q.id))).toEqual([]);
  });

  it('replays every whole history through production and accepts exact bytes through the normal decoder/private preview', async () => {
    expect(fixtures).toHaveLength(6);
    for (const fixture of fixtures) {
      let root: StoredRoot = { epoch: `producer-${fixture.group}`, revision: 0, save: createInitialSave() };
      for (const row of fixture.trace) {
        expect(row.command.expected).toEqual({ epoch: root.epoch, revision: root.revision });
        const decision = reduceCommand(root, row.command, { nowEpochMs: Date.parse(row.clock), catalogue: boundaryCatalogue,
          questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1', allocatedIds: row.allocatedIds });
        expect(decision.status).toBe(row.status);
        if (decision.status === 'changed') {
          expect(decision.changes).toEqual(row.changes);
          expect(validateSave(decision.save, boundaryCatalogue).status).toBe('valid');
          root = { ...root, revision: root.revision + 1, save: decision.save };
        }
        expect(row.resultingToken).toEqual({ epoch: root.epoch, revision: root.revision });
      }
      expect(root.save).toEqual(fixture.snapshot.save);
      expect(validateSave(root.save, boundaryCatalogue).status).toBe('valid');
      expect(new TextEncoder().encode(fixture.json).byteLength).toBe(fixture.byteLength);
      const decoded = decodeBackup(fixture.json, boundaryCatalogue);
      expect(decoded.status).toBe('valid'); if (decoded.status !== 'valid') throw new Error('Invalid backup');
      expect(decoded.envelope.save).toEqual(root.save);
      expect(await decodeBackupFile({ size: fixture.byteLength, text: async () => fixture.json }, boundaryCatalogue)).toEqual(decoded);
      const session = createImportSession(), preview = session.prepareImport(decoded.envelope, fixture.snapshot);
      const confirmed = session.confirmImport(preview.preparedImportId, fixture.snapshot);
      expect(confirmed).toMatchObject({ status: 'ready', preparedImport: { save: root.save, expected: fixture.snapshot.token } });
      expect(session.confirmImport(preview.preparedImportId, fixture.snapshot)).toEqual({ status: 'expired' });
      expect(root.save.profiles[fixture.otherProfileId]).toMatchObject({ rewards: { lifetimePoints: 0, tracksByCanonical: {}, questReceipts: [] },
        world: { completedQuestIds: [], completedStoryBindingIds: [] }, encounters: {}, personalRecords: { best: null, medals: { gold: 0, silver: 0, bronze: 0 } } });
    }
  });

  it('pins reachable 29→30→31 arithmetic separately from three once-only quest bonuses', () => {
    const a = byId('cap-before-30'), b = byId('cap-before-31');
    expect(a.snapshot.save.profiles[a.profileId].rewards.lifetimePoints).toBe(640); // 29×20 + 3×20
    expect(a.snapshot.save.competition.currentScores[a.profileId]).toBe(580);
    expect(a.snapshot.save.competition.currentSlots[a.profileId]).toHaveLength(29);
    expect(new Set(a.snapshot.save.competition.currentSlots[a.profileId].map(s => s.canonicalQuestionId)).size).toBe(29);
    expect(a.next.canonicalQuestionId).toBe('lif.english.punctuation.r1.authored-%5B%22spellbook-05%22%2C%5B%5D%5D');
    expect(a.next.response).toEqual({ kind: 'punctuation', slots: { admiration: '.' } });
    expect(b.next.canonicalQuestionId).toBe('lif.english.punctuation.r1.authored-%5B%22spellbook-06%22%2C%5B%5D%5D');
    expect(b.next.response).toEqual({ kind: 'punctuation', slots: { warning: '!' } });
    expect(b.snapshot.save.profiles[b.profileId].rewards.lifetimePoints).toBe(660);
    expect(b.snapshot.save.competition.currentScores[b.profileId]).toBe(600);
    expect(b.snapshot.save.competition.currentSlots[b.profileId]).toHaveLength(30);
    for (const [fixture, lifetime, competitiveDelta, consumedSlot] of [[a, 660, 20, 30], [b, 680, 0, null]] as const) {
      const exercised = exercisePublishedBoundary(fixture);
      expect(exercised.result).toMatchObject({ status: 'changed', changes: { earnedPoints: { lifetimeDelta: 20, competitiveDelta, consumedSlot }, restorationIds: [] } });
      const p = exercised.snapshot.save.profiles[fixture.profileId];
      expect(p.rewards.lifetimePoints).toBe(lifetime); expect(p.rewards.questReceipts).toHaveLength(3);
      expect(exercised.snapshot.save.competition.currentScores[fixture.profileId]).toBe(600);
      expect(exercised.snapshot.save.competition.currentSlots[fixture.profileId]).toHaveLength(30);
      if (fixture === b) expect(exercised.snapshot.save.competition).toEqual(b.snapshot.save.competition);
      expect(p.rewards.tracksByCanonical[fixture.next.canonicalQuestionId].recentCompletedOpportunity).toMatchObject({ earningWeek: '2026-06-29', slot: consumedSlot,
        validChecks: 1, components: { answer: true, independentSuccess: true, supportedSuccess: false } });
      const last = exercised.trace.at(-1)!;
      expect(recognizeDuplicate({ ...exercised.snapshot.token, save: exercised.snapshot.save }, last.command, {
        catalogue: boundaryCatalogue, questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1', allocatedIds: {},
        get nowEpochMs(): number { throw new Error('Duplicate recognition must not read time'); },
      })).toBe(true);
    }
  });

  it('pins the BST Sunday/Monday boundary and preserves the closed five-point result on late success', () => {
    expect(localDateAt(Date.parse(BOUNDARY_CLOCKS.sunday))).toBe('2026-07-05');
    expect(localDateAt(Date.parse(BOUNDARY_CLOCKS.mondayBoundary))).toBe('2026-07-06');
    expect(weekKeyFor('2026-07-05')).toBe('2026-06-29'); expect(weekKeyFor('2026-07-06')).toBe('2026-07-06');
    expect(Date.parse(BOUNDARY_CLOCKS.mondayBoundary) - Date.parse(BOUNDARY_CLOCKS.sunday)).toBe(1000);
    const fresh = byId('summer-sunday-before-check'), wrong = byId('summer-sunday-wrong');
    expect(exercisePublishedBoundary(fresh).result).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: 1 } } });
    const saved = wrong.snapshot.save.profiles[wrong.profileId].encounters[wrong.next.encounterId!];
    expect(saved).toMatchObject({ validChecks: 1, firstCheckCorrect: false, learningEpisode: { ordinal: 1, validChecks: 1, status: 'suspended' } });
    const h = new BoundaryHistory('summer', BOUNDARY_CLOCKS.mondayBoundary, wrong.snapshot.save), resumed = h.resume(saved.encounterId);
    const closed = structuredClone(h.snapshot.save.competition.archives);
    expect(closed).toMatchObject([{ week: '2026-06-29', entries: [{ profileId: wrong.profileId, points: 5, rank: 1, medal: 'gold' }] }]);
    expect(h.check(resumed, { kind: 'bridge', planks: [6, 6] })).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 25, competitiveDelta: 0, consumedSlot: null } } });
    expect(h.snapshot.save.competition.archives).toEqual(closed);
    expect(h.snapshot.save.competition).toMatchObject({ latestOpenedWeek: '2026-07-06', currentScores: {}, currentSlots: {} });
    expect(h.profile.rewards.lifetimePoints).toBe(30);
    expect(h.profile.rewards.tracksByCanonical[saved.canonicalQuestionId].recentCompletedOpportunity).toMatchObject({
      opportunityId: saved.opportunityId, earningWeek: '2026-06-29', slot: 1, validChecks: 2, firstSuccessWeek: '2026-07-06',
      components: { answer: true, independentSuccess: false, supportedSuccess: true } });
    expect(h.profile.personalRecords).toEqual({ best: { points: 5, week: '2026-06-29' }, medals: { gold: 1, silver: 0, bronze: 0 } });
  });

  it('selects actual prior successes at +3 and +7 civil days with new later-week opportunities', () => {
    expect(addCalendarDays('2026-07-03', 3)).toBe('2026-07-06'); expect(addCalendarDays('2026-07-06', 7)).toBe('2026-07-13');
    for (const [id, priorDate, priorWeek, dueDate, ordinal, lifetime] of [
      ['review-plus-3-ready', '2026-07-03', '2026-06-29', '2026-07-06', 2, 140],
      ['review-plus-7-ready', '2026-07-06', '2026-07-06', '2026-07-13', 3, 200],
    ] as const) {
      const fixture = byId(id), before = fixture.snapshot.save.profiles[fixture.profileId];
      expect(before.learning.evidence.M01!.bands.support.reviewDueLocalDate).toBe(dueDate);
      const old = before.rewards.tracksByCanonical[fixture.next.canonicalQuestionId].recentCompletedOpportunity!;
      expect(old).toMatchObject({ firstSuccessLocalDate: priorDate, firstSuccessWeek: priorWeek, components: { independentSuccess: true } });
      const { selected, snapshot, result } = exercisePublishedBoundary(fixture);
      expect(selected).toMatchObject({ canonicalQuestionId: fixture.next.canonicalQuestionId, selectionReason: 'due-review',
        eligibility: { kind: 'eligible-review' }, familiar: true, bindingProvenance: null,
        reviewReference: { canonicalQuestionId: fixture.next.canonicalQuestionId, dueLocalDate: dueDate, previousSuccessWeek: priorWeek } });
      expect(selected.opportunityId).not.toBe(old.opportunityId);
      expect(result).toMatchObject({ changes: { earnedPoints: { lifetimeDelta: 20, competitiveDelta: 20, consumedSlot: 1 }, restorationIds: [] } });
      const after = snapshot.save.profiles[fixture.profileId];
      expect(after.rewards.lifetimePoints).toBe(lifetime); expect(after.rewards.questReceipts).toHaveLength(3);
      expect(after.rewards.tracksByCanonical[fixture.next.canonicalQuestionId].recentCompletedOpportunity).toMatchObject({ ordinal, earningWeek: dueDate });
      expect(after.learning.evidence.M01!.bands.support.reviewDueLocalDate).toBe(addCalendarDays(dueDate, 7));
      expect(snapshot.save.competition.currentScores[fixture.profileId]).toBe(20);
    }
  });

  it('retains deterministic ordinary-import files and full command provenance', () => {
    expect(buildPublishedBoundaryFixtures()).toEqual(fixtures);
    if (process.env.PUBLISHED_BOUNDARY_WRITE === '1') {
      mkdirSync(directory, { recursive: true });
      for (const f of fixtures) writeFileSync(resolve(directory, f.filename), f.json, 'utf8');
      const sources = ['src/state/transition.ts', 'src/state/backup.ts', 'src/learning/select.ts', 'src/learning/evidence.ts',
        'src/rewards/scoring.ts', 'src/rewards/calendar.ts', 'src/rewards/standings.ts', 'src/content/catalogue.ts',
        'src/content/starter-maths.ts', 'src/content/starter-english.ts', 'src/content/quest-bindings.ts',
        'tests/fixtures/published-boundary-data.ts', 'tests/state/published-boundary-data.test.ts'];
      const provenance = {
        kind: 'producer-generated-fixture-provenance-not-an-import-backup', targetPublishedBuild: PUBLISHED_BOUNDARY_BUILD,
        construction: 'Reachable histories from createInitialSave through production reduceCommand; every changed root validated. Local logical producer evidence, not a claim of published UI observation.',
        sourceSha256: Object.fromEntries(sources.map(path => [path, sha(readFileSync(path))])),
        catalogueCanonicalIds: boundaryCatalogue.map(t => t.canonicalQuestionId),
        files: fixtures.map(f => ({ id: f.id, group: f.group, filename: f.filename, sha256: sha(f.json), byteLength: f.byteLength,
          importClock: f.importClock, profileId: f.profileId, otherProfileId: f.otherProfileId, setupToken: f.snapshot.token,
          next: f.next, setup: f.trace, expectedAfterNext: exercisePublishedBoundary(f).snapshot.save })),
      };
      writeFileSync(resolve(directory, 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`, 'utf8');
    }
    for (const f of fixtures) expect(readFileSync(resolve(directory, f.filename), 'utf8')).toBe(f.json);
    const saved = JSON.parse(readFileSync(resolve(directory, 'provenance.json'), 'utf8'));
    expect(saved.targetPublishedBuild).toBe(PUBLISHED_BOUNDARY_BUILD);
    expect(saved.files.map((f: { filename: string; sha256: string }) => [f.filename, f.sha256])).toEqual(fixtures.map(f => [f.filename, sha(f.json)]));
  });
});
