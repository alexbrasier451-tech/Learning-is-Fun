import { describe, expect, it } from 'vitest';
import { listTasks } from '../../src/content/catalogue';
import { areRequiredBindingsComplete, QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import type { ActivityResponse } from '../../src/learning/contracts';
import type { CommitChanges, EncounterSave, StateCommand, StoredRoot, TransitionContext } from '../../src/state/contracts';
import { createInitialSave, recognizeDuplicate, reduceCommand } from '../../src/state/transition';
import { selectCommittedActivity } from '../../src/state/controller';
import { validateSave } from '../../src/state/backup';

const catalogue = listTasks();
const monday = Date.parse('2026-10-12T12:00:00Z');
function harness() {
  let root: StoredRoot = { epoch: 'initial', revision: 0, save: createInitialSave() }, sequence = 0;
  let now = Date.parse('2026-10-09T12:00:00Z');
  const context = (): TransitionContext => ({ nowEpochMs: now, catalogue, questBindings: QUEST_ACTIVITY_BINDINGS, milestone: 'M1',
    allocatedIds: { encounterId: `encounter-${sequence}`, opportunityId: `opportunity-${sequence}` } });
  function command(kind: StateCommand['kind'], payload: unknown, profileId?: string): StateCommand {
    return { actionId: `action-${++sequence}`, expected: { epoch: root.epoch, revision: root.revision }, kind, payload, ...(profileId ? { profileId } : {}) } as StateCommand;
  }
  function run(c: StateCommand) {
    const before = JSON.stringify(root);
    const decision = reduceCommand(root, c, context());
    expect(JSON.stringify(root)).toBe(before);
    if (decision.status === 'changed') {
      expect(validateSave(decision.save, catalogue)).toMatchObject({ status: 'valid' });
      root = { epoch: root.epoch, revision: root.revision + 1, save: decision.save };
    }
    return decision;
  }
  function act(kind: StateCommand['kind'], payload: unknown, profileId?: string) { return run(command(kind, payload, profileId)); }
  const create = (profileId = 'ada') => expect(act('CreateProfile', { newProfileId: profileId, nickname: profileId, avatarId: 'pip' }).status).toBe('changed');
  const profile = (profileId = 'ada') => root.save.profiles[profileId];
  function open(route: unknown, profileId = 'ada') {
    const result = act('OpenEncounter', { route, suppressDueReviewForVisit: true }, profileId);
    expect(result, JSON.stringify(result)).toMatchObject({ status: 'changed' });
    return Object.values(profile(profileId).encounters).reverse().find(e => e.learningEpisode.status === 'open')!;
  }
  const checkCommand = (e: EncounterSave, response: ActivityResponse, profileId = 'ada') => command('SubmitCheck', { encounterId: e.encounterId,
    learningEpisodeOrdinal: e.learningEpisode.ordinal, submissionId: `submission-${sequence + 1}`, checkSequence: e.validChecks + 1, response }, profileId);
  function check(e: EncounterSave, response: ActivityResponse, profileId = 'ada') {
    const cmd = checkCommand(e, response, profileId), result = run(cmd);
    expect(result, JSON.stringify(result)).toMatchObject({ status: 'changed' });
    return { cmd, result: result as Extract<typeof result, { status: 'changed' }> };
  }
  const snapshot = () => ({ token: { epoch: root.epoch, revision: root.revision }, save: root.save });
  return { act, run, create, profile, open, check, checkCommand, command, context, snapshot, root: () => root, setNow: (value: number) => { now = value; } };
}
const bridge: ActivityResponse = { kind: 'bridge', planks: [6, 6] };
const wrong: ActivityResponse = { kind: 'bridge', planks: [1] };
const punctuation: ActivityResponse = { kind: 'punctuation', slots: { question: '?', discovery: '!' } };
const merchant: ActivityResponse = { kind: 'merchant', apples: 6, pears: 3 };

describe('one atomic M1 transition', () => {
  it('real required-set helper rejects missing/partial sets and retains two completed IDs through JSON reload (helper scope only)', () => {
    // Already specified WP03-13A Q9 identities, solely as helper contract input.
    // Actual delivered M2 tasks/full-save persistence belong to WP04-07A.
    const original = QUEST_ACTIVITY_BINDINGS[0];
    const bindings = ['q9-story-m08-clock', 'q9-story-m08-sequence'].map(bindingId => ({ ...original, questId: 'Q9', availability: 'M2' as const, bindingId }));
    const complete = (completedStoryBindingIds: readonly string[], rows = bindings) => areRequiredBindingsComplete({ bindings: rows, questId: 'Q9', milestone: 'M2', completedStoryBindingIds });
    expect(complete([], [])).toBe(false); expect(complete([])).toBe(false); expect(complete(['q9-story-m08-clock'])).toBe(false);
    const durableSet: string[] = JSON.parse(JSON.stringify(['q9-story-m08-clock', 'q9-story-m08-sequence']));
    expect(complete(durableSet)).toBe(true);
    expect(complete(durableSet, [])).toBe(false);
    expect(complete(JSON.parse(JSON.stringify([])))).toBe(false);
    expect(complete(JSON.parse(JSON.stringify(['q9-story-m08-clock'])))).toBe(false);
    // This synthetic registry is deliberately not claimed to be a compatible M1 save.
  });
  it('original bridge hint → spellbook first → merchant retry has independent 100/40/3 oracle', () => {
    const h = harness(); h.create();
    const deltas: CommitChanges[] = [];
    let e = h.open({ kind: 'quest', questId: 'Q1' });
    expect(e.canonicalQuestionId).toBe('lif.math.bridge.r1.total-12');
    const task = catalogue.find(t => t.canonicalQuestionId === e.canonicalQuestionId)!;
    expect(h.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'answer-hint', hintId: task.hints[0].id }, 'ada').status).toBe('changed');
    deltas.push(h.check(h.profile().encounters[e.encounterId], bridge).result.changes);
    e = h.open({ kind: 'quest', questId: 'Q2' });
    expect(e.canonicalQuestionId).toBe('lif.english.punctuation.r1.spellbook-anchor');
    deltas.push(h.check(e, punctuation).result.changes);
    e = h.open({ kind: 'quest', questId: 'Q3' });
    expect(e.canonicalQuestionId).toBe('lif.math.merchant.r1.mult-2.pears-3');
    deltas.push(h.check(e, { kind: 'merchant', apples: 3, pears: 6 }).result.changes);
    const final = h.check(h.profile().encounters[e.encounterId], merchant); deltas.push(final.result.changes);
    expect(deltas.map(d => [d.earnedPoints.lifetimeDelta, d.earnedPoints.competitiveDelta])).toEqual([[30, 10], [40, 20], [5, 5], [25, 5]]);
    expect(h.profile().rewards).toMatchObject({ lifetimePoints: 100, entitlementIds: ['scarf-leaf', 'planter-rim'], questReceipts: [
      { profileId: 'ada', questId: 'Q1' }, { profileId: 'ada', questId: 'Q2' }, { profileId: 'ada', questId: 'Q3' }] });
    expect(h.root().save.competition.currentScores).toEqual({ ada: 40 });
    expect(h.root().save.competition.currentSlots.ada).toHaveLength(3);
    expect(h.profile().world).toEqual({ completedQuestIds: ['Q1', 'Q2', 'Q3'], completedStoryBindingIds: ['q1-story-m01', 'q2-story-e06', 'q3-story-m04'] });
    expect(h.run(final.cmd).status).toBe('already-applied');
    expect(h.profile().learning.evidence.M04!.bands[e.band].validChecks).toBe(2);
  });

  it('retained exact duplicate compares profile/encounter/episode/sequence/submission and full response without reduction', () => {
    const h = harness(); h.create(); h.create('ben'); const e = h.open({ kind: 'quest', questId: 'Q1' }); const { cmd } = h.check(e, wrong);
    const recognitionContext = { ...h.context(), get nowEpochMs(): number { throw new Error('No clock read during recognition'); } };
    expect(recognizeDuplicate(h.root(), cmd, recognitionContext)).toBe(true);
    for (const patch of [{ profileId: 'ben' }, { payload: { ...cmd.payload, encounterId: 'other' } }, { payload: { ...cmd.payload, learningEpisodeOrdinal: 2 } },
      { payload: { ...cmd.payload, checkSequence: 2 } }, { payload: { ...cmd.payload, submissionId: 'different' } }, { payload: { ...cmd.payload, response: bridge } },
      { payload: { ...cmd.payload, response: { ...wrong, forged: true } } }]) expect(recognizeDuplicate(h.root(), { ...cmd, ...patch } as StateCommand, recognitionContext)).toBe(false);
    expect(h.run({ ...cmd, payload: { ...cmd.payload, response: bridge } } as StateCommand)).toMatchObject({ status: 'invalid', reason: { code: 'submission-mismatch' } });
  });

  it('invalid/incomplete Checks do not close a week or consume any evidence/sequence', () => {
    const h = harness(); h.create(); const e = h.open({ kind: 'quest', questId: 'Q1' }); h.check(e, wrong); h.setNow(monday);
    const before = h.root();
    for (const response of [{ kind: 'bridge', planks: [] }, { kind: 'bridge', planks: [99] }]) expect(h.run(h.checkCommand(h.profile().encounters[e.encounterId], response as ActivityResponse)).status).toBe('invalid');
    expect(h.root()).toBe(before);
    const result = h.check(h.profile().encounters[e.encounterId], bridge).result;
    expect(result.changes).toMatchObject({ closedWeekIds: ['2026-10-05'], earnedPoints: { lifetimeDelta: 25, competitiveDelta: 0 } });
    expect(h.profile().personalRecords).toEqual({ best: { points: 5, week: '2026-10-05' }, medals: { gold: 1, silver: 0, bronze: 0 } });
    expect(h.root().save.competition).toMatchObject({ latestOpenedWeek: '2026-10-12', currentScores: {}, currentSlots: {} });
    const o = Object.values(h.profile().rewards.tracksByCanonical)[0].recentCompletedOpportunity!;
    expect(o).toMatchObject({ earningWeek: '2026-10-05', firstSuccessWeek: '2026-10-12', slot: 1, validChecks: 2 });
  });

  it('suspension is observation-free; deliberate finish is once; resume advances only episode and eventual success adds remaining five', () => {
    const h = harness(); h.create(); let e = h.open({ kind: 'quest', questId: 'Q1' });
    expect(h.act('FinishPractice', { encounterId: e.encounterId, learningEpisodeOrdinal: 1 }, 'ada')).toMatchObject({ status: 'invalid', reason: { code: 'episode-not-finishable' } });
    h.check(e, wrong); e = h.profile().encounters[e.encounterId];
    const evidence = h.profile().learning.evidence;
    h.act('SuspendEncounter', { encounterId: e.encounterId, learningEpisodeOrdinal: 1, responseDraft: { kind: 'bridge', planks: [6] } }, 'ada');
    expect(h.profile().learning.evidence).toEqual(evidence);
    const finish = h.command('FinishPractice', { encounterId: e.encounterId, learningEpisodeOrdinal: 1 }, 'ada');
    expect(h.run(finish).status).toBe('changed'); expect(h.run(finish).status).toBe('already-applied');
    expect(h.profile().learning.evidence.M01!.bands[e.band]).toMatchObject({ validChecks: 1, completedEpisodes: 1, correctChecks: 0 });
    const reward = h.profile().rewards;
    h.act('OpenEncounter', { resumeEncounterId: e.encounterId, suppressDueReviewForVisit: true }, 'ada');
    e = h.profile().encounters[e.encounterId];
    expect(e).toMatchObject({ validChecks: 1, opportunityId: e.opportunityId, learningEpisode: { ordinal: 2, validChecks: 0 } });
    expect(h.profile().rewards).toEqual(reward);
    expect(h.run(finish)).toMatchObject({ status: 'invalid', reason: { code: 'stale-episode' } });
    const result = h.check(e, bridge).result;
    expect(result.changes.earnedPoints).toMatchObject({ lifetimeDelta: 25, competitiveDelta: 5 });
    expect(h.profile().learning.evidence.M01!.bands[e.band]).toMatchObject({ validChecks: 2, completedEpisodes: 2, supportedSuccesses: 1, retrySuccesses: 1 });
  });

  it('fresh story intent resumes unresolved general practice without relabelling; later story earns only quest', () => {
    const h = harness(); h.create();
    // Work through unseen support tasks until the released support anchor.
    let e = h.open({ kind: 'practice', skillId: 'M01', mode: 'easier' });
    while (e.canonicalQuestionId !== 'lif.math.bridge.r1.total-12') {
      const task = catalogue.find(t => t.canonicalQuestionId === e.canonicalQuestionId)!;
      const target = task.answerRule.kind === 'bridge-total' ? task.answerRule.target : 0;
      h.check(e, { kind: 'bridge', planks: [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])] });
      e = h.open({ kind: 'practice', skillId: 'M01', mode: 'easier' });
    }
    expect(e.canonicalQuestionId).toBe('lif.math.bridge.r1.total-12');
    h.check(e, wrong);
    h.act('FinishPractice', { encounterId: e.encounterId, learningEpisodeOrdinal: 1 }, 'ada');
    const resumed = h.open({ kind: 'quest', questId: 'Q1' });
    expect(resumed).toMatchObject({ encounterId: e.encounterId, bindingProvenance: null, selectionReason: 'child-easier', learningEpisode: { ordinal: 2 } });
    h.check(resumed, bridge); expect(h.profile().world.completedQuestIds).toEqual([]);
    e = h.open({ kind: 'quest', questId: 'Q1' }); expect(e.eligibility.kind).toBe('practice-only');
    expect(h.check(e, bridge).result.changes.earnedPoints).toMatchObject({ lifetimeDelta: 20, competitiveDelta: 0 });
    expect(h.profile().world.completedQuestIds).toEqual(['Q1']);
    expect(h.profile().encounters[resumed.encounterId]).toBeUndefined();
    expect(h.act('OpenEncounter', { resumeEncounterId: resumed.encounterId, suppressDueReviewForVisit: true }, 'ada')).toMatchObject({ status: 'invalid', reason: { code: 'encounter-expired' } });
  });

  it('completed source encounter compacts; a distinct transfer resolves from permanent singleton binding', () => {
    const h = harness(); h.create(); const source = h.open({ kind: 'quest', questId: 'Q1' }); const original = h.check(source, bridge);
    h.setNow(monday);
    const repeat = h.open({ kind: 'practice', skillId: 'M01', mode: 'repeat' });
    expect(repeat.canonicalQuestionId).toBe(source.canonicalQuestionId); h.check(repeat, bridge);
    expect(h.profile().encounters[source.encounterId]).toBeUndefined();
    expect(h.run(original.cmd)).toMatchObject({ status: 'invalid', reason: { code: 'encounter-expired' } });
    const transfer = h.open({ kind: 'optional-transfer', bindingId: 'q1-transfer-m01' });
    expect(transfer.canonicalQuestionId).not.toBe(source.canonicalQuestionId);
    const task = catalogue.find(t => t.canonicalQuestionId === transfer.canonicalQuestionId)!;
    expect(task.answerRule.kind).toBe('bridge-total');
    const target = task.answerRule.kind === 'bridge-total' ? task.answerRule.target : 0;
    const response: ActivityResponse = { kind: 'bridge', planks: [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])] };
    expect(h.check(transfer, response).result.changes.earnedPoints.lifetimeDelta).toBe(20);
    expect(h.profile().world.completedStoryBindingIds).toEqual(['q1-story-m01']); expect(h.profile().rewards.questReceipts).toHaveLength(1);
  });

  it('original due-review reproduction selects the successful canonical task and compacts its source reward', () => {
    const h = harness(); h.create(); h.check(h.open({ kind: 'quest', questId: 'Q1' }), bridge); h.setNow(monday);
    const result = h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'M01', mode: 'suggested' }, suppressDueReviewForVisit: false }, 'ada');
    expect(result, JSON.stringify(result)).toMatchObject({ status: 'changed' });
    const e = Object.values(h.profile().encounters).find(e => e.learningEpisode.status === 'open')!;
    expect(e).toMatchObject({ canonicalQuestionId: 'lif.math.bridge.r1.total-12', selectionReason: 'due-review',
      reviewReference: { canonicalQuestionId: 'lif.math.bridge.r1.total-12', previousSuccessWeek: '2026-10-05' } });
    expect(h.check(e, bridge).result.changes.earnedPoints).toMatchObject({ lifetimeDelta: 20, competitiveDelta: 20 });
    expect(h.profile().rewards.tracksByCanonical[e.canonicalQuestionId]).toMatchObject({ closedAwardTotal: 20, completedThroughOrdinal: 1, lastAllocatedOrdinal: 2 });
  });

  it('Monday success → Thursday educational review is zero-award practice but retains valid learning completion', () => {
    const h = harness(); h.setNow(Date.parse('2026-10-05T12:00:00Z')); h.create();
    h.check(h.open({ kind: 'quest', questId: 'Q1' }), bridge);
    h.setNow(Date.parse('2026-10-08T12:00:00Z'));
    const result = h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'M01', mode: 'suggested' }, suppressDueReviewForVisit: false }, 'ada');
    expect(result, JSON.stringify(result)).toMatchObject({ status: 'changed' });
    const e = Object.values(h.profile().encounters).find(e => e.learningEpisode.status === 'open')!;
    expect(e).toMatchObject({ selectionReason: 'due-review', opportunityId: null, reviewReference: { previousSuccessWeek: '2026-10-05' } });
    expect(h.check(e, bridge).result.changes.earnedPoints).toMatchObject({ lifetimeDelta: 0, competitiveDelta: 0 });
    expect(h.profile().learning.evidence.M01!.bands.support.reviewResults.at(-1)).toMatchObject({ localDate: '2026-10-08', competitionWeekId: '2026-10-05', outcome: 'independent-success' });
    expect(h.profile().rewards.lifetimePoints).toBe(40);
  });

  it('eligible due review after all unseen tasks are completed folds real reward ordinals', () => {
    const h = harness(); h.create();
    const count = catalogue.filter(t => t.skillId === 'M01').length;
    for (let i = 0; i < count; i++) {
      const e = h.open({ kind: 'practice', skillId: 'M01', mode: 'suggested' });
      const task = catalogue.find(t => t.canonicalQuestionId === e.canonicalQuestionId)!;
      const target = task.answerRule.kind === 'bridge-total' ? task.answerRule.target : 0;
      h.check(e, { kind: 'bridge', planks: [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])] });
    }
    h.setNow(monday);
    const result = h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'M01', mode: 'suggested' }, suppressDueReviewForVisit: false }, 'ada');
    expect(result, JSON.stringify(result)).toMatchObject({ status: 'changed' });
    const e = Object.values(h.profile().encounters).find(e => e.learningEpisode.status === 'open')!;
    expect(e.canonicalQuestionId).toBe('lif.math.bridge.r1.total-10'); expect(e.selectionReason).toBe('due-review');
    h.check(e, { kind: 'bridge', planks: [6, 4] });
    expect(h.profile().rewards.tracksByCanonical[e.canonicalQuestionId]).toMatchObject({ closedAwardTotal: 20, completedThroughOrdinal: 1, lastAllocatedOrdinal: 2 });
  });

  it('free practice preserves wrong Checks and help across unsuccessful episodes without new reward', () => {
    const h = harness(); h.create(); const e = h.open({ kind: 'practice', skillId: 'M01', mode: 'easier' });
    expect(e.opportunityId).toBeNull();
    h.check(e, wrong);
    const task = catalogue.find(t => t.canonicalQuestionId === e.canonicalQuestionId)!;
    h.act('RecordAssistance', { encounterId: e.encounterId, assistanceKind: 'worked-support', hintId: task.workedSupport.id }, 'ada');
    h.act('FinishPractice', { encounterId: e.encounterId, learningEpisodeOrdinal: 1 }, 'ada');
    h.act('OpenEncounter', { resumeEncounterId: e.encounterId, suppressDueReviewForVisit: true }, 'ada');
    const next = h.profile().encounters[e.encounterId];
    const target = task.answerRule.kind === 'bridge-total' ? task.answerRule.target : 0;
    h.check(next, { kind: 'bridge', planks: [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])] });
    expect(h.profile().rewards.lifetimePoints).toBe(0); expect(h.root().save.competition.currentSlots).toEqual({});
    expect(h.profile().learning.evidence.M01!.bands.support).toMatchObject({ validChecks: 2, completedEpisodes: 2, supportedSuccesses: 1 });
  });

  it('projection keeps actual attributed Check when draft or episode changes; missing/revised content is unavailable', () => {
    const h = harness(); h.create(); const e = h.open({ kind: 'quest', questId: 'Q1' });
    const key = { profileId: 'ada', encounterId: e.encounterId };
    expect(selectCommittedActivity(h.snapshot(), catalogue, key)).toMatchObject({ status: 'ready', activity: { responseDraft: null, lastCheck: null, lastEvaluation: null } });
    const { cmd } = h.check(e, wrong);
    h.act('SaveDraft', { encounterId: e.encounterId, responseDraft: { kind: 'bridge', planks: [] } }, 'ada');
    const projection = selectCommittedActivity(h.snapshot(), catalogue, key);
    expect(projection).toMatchObject({ status: 'ready', activity: { responseDraft: { kind: 'bridge', planks: [] }, lastEvaluation: { correct: false },
      lastCheck: { submissionId: 'submissionId' in cmd.payload ? cmd.payload.submissionId : '', response: wrong }, rewardDisplay: { lastCommittedDelta: { lifetimeDelta: 5 } } } });
    expect(Object.isFrozen(projection)).toBe(true);
    for (const tasks of [[], catalogue.map(t => ({ ...t, contentRevision: 'changed' })), catalogue.map(t => ({ ...t, review: { ...t.review, status: 'withheld' as const } }))]) {
      expect(selectCommittedActivity(h.snapshot(), tasks, key)).toMatchObject({ status: 'unavailable', reason: 'content-unavailable' });
    }
  });

  it('rejects injected fields, incompatible route/resume, foreign encounters and unavailable world choices', () => {
    const h = harness(); h.create(); h.create('ben'); const e = h.open({ kind: 'quest', questId: 'Q1' });
    for (const payload of [{ resumeEncounterId: e.encounterId, route: { kind: 'quest', questId: 'Q2' }, suppressDueReviewForVisit: true },
      { route: { kind: 'quest', questId: 'Q1', role: 'story' }, suppressDueReviewForVisit: true }]) expect(h.act('OpenEncounter', payload, 'ada')).toMatchObject({ status: 'invalid', reason: { code: 'invalid-command' } });
    expect(h.act('OpenEncounter', { resumeEncounterId: e.encounterId, suppressDueReviewForVisit: true }, 'ben')).toMatchObject({ status: 'invalid', reason: { code: 'cross-profile-encounter' } });
    expect(h.act('ChooseCosmetic', { choice: { kind: 'appearance', value: { ...h.profile().creative, scarfPatternId: 'scarf-leaf' } } }, 'ada')).toMatchObject({ status: 'invalid', reason: { code: 'not-entitled' } });
    expect(h.act('OpenEncounter', { route: { kind: 'quest', questId: 'Q3' }, suppressDueReviewForVisit: true }, 'ada')).toMatchObject({ status: 'invalid', reason: { code: 'quest-unavailable' } });
    expect(h.act('OpenEncounter', { route: { kind: 'quest', questId: 'Q4' }, suppressDueReviewForVisit: true }, 'ada').status).toBe('invalid');
  });

  it('deletion strips current/archive identity without reranking survivors or reissuing medals; start over uses a new ID', () => {
    const h = harness(); h.create(); h.create('ben');
    h.check(h.open({ kind: 'quest', questId: 'Q1' }), bridge);
    h.check(h.open({ kind: 'quest', questId: 'Q1' }, 'ben'), bridge, 'ben');
    h.setNow(monday); h.act('ReconcileCalendar', {});
    const ben = h.profile('ben');
    expect(h.act('DeleteProfile', {}, 'ada').status).toBe('changed'); expect(h.profile('ada')).toBeUndefined(); expect(h.profile('ben')).toEqual(ben);
    expect(h.root().save.competition.archives[0]).toMatchObject({ omittedDeletedProfiles: true, entries: [{ profileId: 'ben', rank: 1, medal: 'gold', points: 20 }] });
    expect(h.act('StartOver', { newProfileId: 'ben-new', nickname: 'Ben', avatarId: 'rowan' }, 'ben').status).toBe('changed');
    expect(h.profile('ben-new').rewards.lifetimePoints).toBe(0); expect(h.root().save.competition.archives[0].entries).toEqual([]);
  });

  it('clock rollback keeps the active week while learning records the actual observed London date', () => {
    const h = harness(); h.create(); h.check(h.open({ kind: 'quest', questId: 'Q1' }), bridge);
    h.setNow(monday); h.act('ReconcileCalendar', {}); h.setNow(Date.parse('2026-10-09T12:00:00Z'));
    const transfer = h.open({ kind: 'optional-transfer', bindingId: 'q1-transfer-m01' });
    h.check(transfer, { kind: 'bridge', planks: [6, 4] });
    expect(h.root().save.competition.latestOpenedWeek).toBe('2026-10-12');
    expect(h.profile().learning.evidence.M01!.bands.support.recentCompletedEpisodes.at(-1)).toMatchObject({ localDate: '2026-10-09', competitionWeekId: '2026-10-12' });
    expect(h.profile().personalRecords.medals.gold).toBe(1);
  });
});
