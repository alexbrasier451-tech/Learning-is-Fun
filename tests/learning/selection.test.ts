import { describe, expect, it } from 'vitest';
import { resolveBindingIntent, selectNextActivity } from '../../src/learning/select';
import { applyLearningObservation } from '../../src/learning/evidence';
import { canonicalQuestionId } from '../../src/learning/identity';
import { summarizeLearning } from '../../src/learning/summarize';
import { SKILLS } from '../../src/content/skills';
import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { createStateController, selectCommittedActivity } from '../../src/state/controller';
import { createInitialSave } from '../../src/state/transition';
import { decodeBackup, validateSave } from '../../src/state/backup';
import type { SaveRepository } from '../../src/state/repository';
import type { ActivityResponse } from '../../src/learning/contracts';
import type { EncounterSave, StateCommand, StoredRoot } from '../../src/state/contracts';
import type { CanonicalLearningHistory, DifficultyBand, LearningAssistance, LearningObservation,
  LearningRouteIntent, QuestActivityBinding, ResolvedSelectionIntent, SelectionEncounter,
  SelectionRequest, SkillEvidence, SkillId, TaskDefinition } from '../../src/learning/contracts';

const neutral: LearningAssistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' };
const hinted = { ...neutral, answerHintUsed: true };
function task(key: string, band: DifficultyBand = 'core', skillId: SkillId = 'M01'): TaskDefinition {
  const descriptor = { familyId: 'fixture', equivalenceVersion: 'r1', authoredKey: key, parameters: {} };
  return { canonicalQuestionId: canonicalQuestionId(descriptor), descriptor, contentRevision: '1', skillId,
    objectiveId: SKILLS.find(skill => skill.skillId === skillId)!.objectiveId, band, contextualSkillIds: [],
    curriculum: { sourceUrl: 'fixture', section: 'fixture', programmeBand: 'fixture' }, demandRationale: 'fixture',
    instructionText: 'Choose a tile.', assessedText: 'fixture', responseSpec: { kind: 'choice', slots: [], requiredSlotIds: [] },
    answerRule: { kind: 'accepted-responses', responses: [] }, explanation: 'fixture', hints: [{ id: 'h1', text: 'help' }, { id: 'h2', text: 'help' }],
    workedSupport: { id: 'w', text: 'support' }, narration: { neutralText: 'Choose a tile.', assessedTextMayBeSpokenBeforeCheck: false },
    review: { status: 'approved', reviewer: 'test fixture', rationale: 'synthetic fixture', evidenceRef: 'test' } };
}
// A/B/C/D are four distinct core tasks; S/T are support/stretch, P a distinct skill.
const A = task('A'), B = task('B'), C = task('C'), D = task('D'), S = task('S', 'support'), T = task('T', 'stretch');
const P = task('P', 'core', 'E06');
const bank = [A, B, C, D, S, T, P];
function observation(t: TaskDefinition, encounterId = t.descriptor.authoredKey!, patch: Partial<LearningObservation> = {}): LearningObservation {
  return { kind: 'check', eventId: encounterId, submissionId: encounterId, profileId: 'child', encounterId,
    learningEpisodeOrdinal: 1, canonicalQuestionId: t.canonicalQuestionId, skillId: t.skillId, objectiveId: t.objectiveId,
    band: t.band, selectionReason: 'adaptive-practice', localDate: '2026-10-23', competitionWeekId: '2026-10-19',
    familiar: false, reviewReference: null, assistance: neutral, episodeCheckIndex: 1, encounterCheckIndex: 1,
    firstCheckCorrect: true, correct: true, issues: [], episodeCompletion: 'success', ...patch } as LearningObservation;
}
const history = (t: TaskDefinition, patch: Partial<CanonicalLearningHistory> = {}): CanonicalLearningHistory => ({
  canonicalQuestionId: t.canonicalQuestionId, pendingEncounter: null, everChecked: false,
  previousSuccessLocalDate: null, previousSuccessWeek: null, checkedCompetitionWeekIds: [], assistance: neutral, ...patch,
});
const encounter = (t: TaskDefinition, patch: Partial<SelectionEncounter> = {}): SelectionEncounter => ({
  encounterId: 'retained-A', opportunityId: null, canonicalQuestionId: t.canonicalQuestionId, descriptor: t.descriptor,
  contentRevision: t.contentRevision, skillId: t.skillId, band: t.band, selectionReason: 'child-easier', bindingProvenance: null,
  familiar: false, reviewReference: null, learningEpisodeOrdinal: 1, episodeStatus: 'suspended', validChecks: 1,
  firstCheckCorrect: false, assistance: hinted, ...patch,
});
const intent: ResolvedSelectionIntent = { kind: 'adaptive-practice', skillId: 'M01', binding: null, provenance: null, previousCanonicalQuestionId: null };
const request = (patch: Partial<SelectionRequest> = {}): SelectionRequest => ({
  catalogue: bank, intent, evidence: {}, activeEncounter: null, canonicalHistory: [],
  calendar: { todayDate: '2026-10-23', competitionWeekId: '2026-10-19', reviewIn3DaysDate: '2026-10-26', reviewIn7DaysDate: '2026-10-30' },
  suppressDueReviewForVisit: false, ...patch,
});
function completed(rows: readonly [TaskDefinition, Partial<LearningObservation>?][]): SkillEvidence {
  return rows.reduce<SkillEvidence>((evidence, [t, patch], i) => applyLearningObservation(evidence, observation(t, `encounter-${i}`, patch)), {});
}
const binding = (bindingId: string, patch: Partial<QuestActivityBinding> = {}): QuestActivityBinding => ({
  bindingId, questId: 'Q1', availability: 'M1', role: 'story', skillId: 'M01', taskIds: [A.canonicalQuestionId],
  mechanic: 'consequential-selection', responseKind: 'choice', sourceBindingId: null, ...patch,
});
const story = binding('story');
const second = binding('second', { taskIds: [B.canonicalQuestionId] });
const transfer = binding('transfer', { role: 'optional-transfer', sourceBindingId: 'story', taskIds: [B.canonicalQuestionId, C.canonicalQuestionId] });
const revisit = binding('revisit', { role: 'revisit', taskIds: [A.canonicalQuestionId, B.canonicalQuestionId] });
const bindings = [story, second, transfer, revisit];
function resolve(route: LearningRouteIntent, patch: Partial<Parameters<typeof resolveBindingIntent>[0]> = {}) {
  return resolveBindingIntent({ route, milestone: 'M1', bindings, catalogue: bank, accessibleQuestIds: ['Q1', 'Q2'], completedStoryBindingIds: [], ...patch });
}
function resolved(route: LearningRouteIntent, patch: Partial<Parameters<typeof resolveBindingIntent>[0]> = {}): ResolvedSelectionIntent {
  const result = resolve(route, patch);
  if (result.status !== 'resolved') throw new Error(result.reason);
  return result.intent;
}
function frozen<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}

describe('route and binding intent', () => {
  it('uses ordered incomplete story rows and permits an explicit other incomplete row', () => {
    expect(resolve({ kind: 'quest', questId: 'Q1' })).toMatchObject({ status: 'resolved', intent: { binding: story, provenance: { bindingId: 'story', role: 'story', questId: 'Q1' } } });
    expect(resolved({ kind: 'quest', questId: 'Q1' }, { completedStoryBindingIds: ['story'] }).binding).toBe(second);
    expect(resolved({ kind: 'quest', questId: 'Q1', bindingId: 'second' }).binding).toBe(second);
  });
  it.each([
    [{ kind: 'quest', questId: 'Q1', bindingId: 'transfer' }, 'route-mismatch'],
    [{ kind: 'quest', questId: 'Q2', bindingId: 'story' }, 'route-mismatch'],
    [{ kind: 'quest', questId: 'Q1', bindingId: 'unknown' }, 'unknown-binding'],
    [{ kind: 'quest', questId: 'locked' }, 'quest-unavailable'],
    [{ kind: 'optional-transfer', bindingId: 'story' }, 'route-mismatch'],
    [{ kind: 'revisit', bindingId: 'story' }, 'route-mismatch'],
    [{ kind: 'optional-transfer', bindingId: 'transfer' }, 'source-incomplete'],
  ] as const)('rejects %j as %s', (route, reason) => expect(resolve(route)).toEqual({ status: 'unavailable', reason }));
  it('does not reopen completed story rows or invent a row after all are done', () => {
    expect(resolve({ kind: 'quest', questId: 'Q1', bindingId: 'story' }, { completedStoryBindingIds: ['story'] }))
      .toEqual({ status: 'unavailable', reason: 'already-completed' });
    expect(resolve({ kind: 'quest', questId: 'Q1' }, { completedStoryBindingIds: ['story', 'second'] }).status).toBe('unavailable');
  });
  it('gates M2 rows and does not scan undeclared content into M1 availability', () => {
    const expansion = binding('expansion', { availability: 'M2' });
    expect(resolve({ kind: 'quest', questId: 'Q1', bindingId: 'expansion' }, { bindings: [expansion] }))
      .toEqual({ status: 'unavailable', reason: 'milestone-unavailable' });
    expect(resolve({ kind: 'quest', questId: 'Q1', bindingId: 'expansion' }, { bindings: [expansion], milestone: 'M2' }).status).toBe('resolved');
    expect(resolve({ kind: 'practice', skillId: 'M02', mode: 'suggested' }).status).toBe('unavailable');
  });
  it.each([
    { taskIds: [] }, { taskIds: [A.canonicalQuestionId, A.canonicalQuestionId] }, { taskIds: ['missing'] },
    { skillId: 'M04' }, { responseKind: 'bridge' }, { sourceBindingId: 'story' },
  ] as const)('rejects inconsistent binding data %j', patch => {
    expect(resolve({ kind: 'quest', questId: 'Q1' }, { bindings: [binding('story', patch)] })).toEqual({ status: 'unavailable', reason: 'invalid-binding' });
  });
  it('rejects duplicate binding IDs and withheld task definitions', () => {
    expect(resolve({ kind: 'quest', questId: 'Q1' }, { bindings: [story, story] }).status).toBe('unavailable');
    expect(resolve({ kind: 'quest', questId: 'Q1' }, { catalogue: [{ ...A, review: { ...A.review, status: 'withheld' } }] }).status).toBe('unavailable');
  });
  it.each([
    ['M1', false, [S, A]], ['M1', true, [A, B]], ['M2', false, [S, A]], ['M2', true, [A, B]],
  ] as const)('rejects multi-task M1 story before selection (milestone=%s, explicit=%s)', (milestone, explicit, pool) => {
    const row = binding('malformed-story', { taskIds: pool.map(t => t.canonicalQuestionId) });
    const route: LearningRouteIntent = explicit ? { kind: 'quest', questId: 'Q1', bindingId: row.bindingId } : { kind: 'quest', questId: 'Q1' };
    const result = resolve(route, { bindings: [row], milestone });
    expect(result).toEqual({ status: 'unavailable', reason: 'invalid-binding' });
    // The caller cannot pass unavailable resolution into ordinary selection.
    const selection = result.status === 'resolved' ? selectNextActivity(request({ intent: result.intent })) : null;
    expect(selection).toBeNull();
  });
  it.each(['story', 'optional-transfer', 'revisit'] as const)('preserves legal multi-task %s pools through resolution and adaptive selection', role => {
    const source = binding('source', { taskIds: [S.canonicalQuestionId] });
    const row = binding('pool', { role, availability: role === 'story' ? 'M2' : 'M1',
      sourceBindingId: role === 'optional-transfer' ? source.bindingId : null, taskIds: [A.canonicalQuestionId, T.canonicalQuestionId] });
    const route: LearningRouteIntent = role === 'story' ? { kind: 'quest', questId: 'Q1', bindingId: row.bindingId }
      : { kind: role, bindingId: row.bindingId };
    const intent = resolved(route, { bindings: [source, row], milestone: 'M2', completedStoryBindingIds: ['source'] });
    expect(selectNextActivity(request({ intent, evidence: completed([[A], [B], [C]]) }))).toMatchObject({
      status: 'selected', canonicalQuestionId: T.canonicalQuestionId,
      reason: role === 'story' ? 'story-anchor' : role === 'optional-transfer' ? 'transfer' : 'adaptive-practice',
      bindingProvenance: { bindingId: 'pool', role },
    });
  });
  it('derives transfer exclusion from permanent source completion after source encounter compaction', () => {
    const transferIntent = resolved({ kind: 'optional-transfer', bindingId: 'transfer' }, { completedStoryBindingIds: ['story'] });
    expect(transferIntent.previousCanonicalQuestionId).toBe(A.canonicalQuestionId);
    expect(selectNextActivity(request({ intent: transferIntent, canonicalHistory: [] }))).toMatchObject({
      status: 'selected', canonicalQuestionId: B.canonicalQuestionId, reason: 'transfer', resumeEncounterId: null,
      bindingProvenance: { bindingId: 'transfer', questId: 'Q1', role: 'optional-transfer' }, rewardCandidate: 'first-encounter',
    });
  });
  it.each([
    [binding('story', { taskIds: [A.canonicalQuestionId, D.canonicalQuestionId] }), transfer],
    [binding('story', { questId: 'Q2' }), transfer],
    [binding('story', { availability: 'M2' }), transfer],
    [story, binding('transfer', { ...transfer, taskIds: [A.canonicalQuestionId, B.canonicalQuestionId] })],
    [story, binding('transfer', { ...transfer, sourceBindingId: 'transfer' })],
  ])('rejects invalid singleton transfer linkage %#', (source, destination) => {
    expect(resolve({ kind: 'optional-transfer', bindingId: 'transfer' }, { bindings: [source, destination], completedStoryBindingIds: ['story'] }).status).toBe('unavailable');
  });
  it('keeps revisit provenance and pool rather than converting reused tasks to story', () => {
    const result = selectNextActivity(request({ intent: resolved({ kind: 'revisit', bindingId: 'revisit' }) }));
    expect(result).toMatchObject({ canonicalQuestionId: A.canonicalQuestionId, reason: 'adaptive-practice', bindingProvenance: { role: 'revisit', bindingId: 'revisit' } });
  });
  it.each([['suggested', 'adaptive-practice'], ['easier', 'child-easier'], ['repeat', 'repeat-practice']] as const)('maps practice %s', (mode, kind) => {
    expect(resolve({ kind: 'practice', mode })).toMatchObject({ status: 'resolved', intent: { kind, skillId: null, binding: null, provenance: null } });
  });
});

describe('finite adaptive selection', () => {
  it('starts at core, orders skills by registry, then unseen canonical ID, independent of catalogue order', () => {
    expect(selectNextActivity(request({ catalogue: [...bank].reverse(), intent: { ...intent, skillId: null } })))
      .toMatchObject({ status: 'selected', canonicalQuestionId: A.canonicalQuestionId, band: 'core', reason: 'adaptive-practice', rewardCandidate: 'first-encounter' });
    expect(selectNextActivity(request({ canonicalHistory: [history(A, { everChecked: true })] }))).toMatchObject({ canonicalQuestionId: B.canonicalQuestionId });
  });
  it('A/B/C independently among four completed episodes (helped D) advances to available stretch', () => {
    const evidence = completed([[A], [D, { assistance: hinted }], [B], [C]]);
    expect(selectNextActivity(request({ evidence }))).toMatchObject({ canonicalQuestionId: T.canonicalQuestionId, band: 'stretch' });
  });
  it('A/A/A independent first Checks cannot supply three distinct identities', () => {
    expect(selectNextActivity(request({ evidence: completed([[A], [A], [A]]) }))).toMatchObject({ band: 'core' });
  });
  it('three familiar first-Check successes cannot supply transfer evidence for promotion', () => {
    expect(selectNextActivity(request({ evidence: completed([[A, { familiar: true }], [B, { familiar: true }], [C, { familiar: true }]]) }))).toMatchObject({ band: 'core' });
  });
  it('counts retries within A as one completed episode, and an open wrong Check does not become a struggle episode', () => {
    let evidence: SkillEvidence = {};
    for (const index of [1, 2, 3]) evidence = applyLearningObservation(evidence, observation(A, 'A', {
      correct: false, firstCheckCorrect: false, episodeCompletion: null, episodeCheckIndex: index, encounterCheckIndex: index,
    }));
    expect(evidence.M01?.bands.core.completedEpisodes).toBe(0);
    expect(selectNextActivity(request({ evidence }))).toMatchObject({ band: 'core' });
    evidence = applyLearningObservation(evidence, observation(A, 'A', { firstCheckCorrect: false, episodeCheckIndex: 4, encounterCheckIndex: 4 }));
    expect(evidence.M01?.bands.core.completedEpisodes).toBe(1);
    expect(selectNextActivity(request({ evidence }))).toMatchObject({ band: 'core' });
  });
  it('uses only the last four completed episodes', () => {
    const evidence = completed([[A], [B], [C], [D, { assistance: hinted }], [D, { assistance: hinted }], [D, { assistance: hinted }]]);
    expect(selectNextActivity(request({ evidence }))).toMatchObject({ band: 'support' });
  });
  it('two completed helped episodes suggest support; one helped episode plus open wrong does not', () => {
    const evidence = completed([[A, { assistance: hinted }], [B, { assistance: hinted }]]);
    expect(selectNextActivity(request({ evidence }))).toMatchObject({ band: 'support', canonicalQuestionId: S.canonicalQuestionId });
    const open = applyLearningObservation(completed([[A, { assistance: hinted }]]), observation(B, 'open', { correct: false, firstCheckCorrect: false, episodeCompletion: null }));
    expect(selectNextActivity(request({ evidence: open }))).toMatchObject({ band: 'core' });
  });
  it('two deliberately unsuccessful Check-bearing episodes suggest support', () => {
    let evidence: SkillEvidence = {};
    for (const t of [A, B]) {
      const o = observation(t, t.descriptor.authoredKey!, { correct: false, firstCheckCorrect: false, episodeCompletion: null });
      evidence = applyLearningObservation(evidence, o);
      const { submissionId: _submission, episodeCheckIndex: _episode, encounterCheckIndex: _encounter, ...facts } = o as Extract<LearningObservation, { kind: 'check' }>;
      evidence = applyLearningObservation(evidence, { ...facts, kind: 'finished-unsuccessfully', episodeCompletion: 'deliberate-unsuccessful' });
    }
    expect(selectNextActivity(request({ evidence }))).toMatchObject({ band: 'support' });
  });
  it('does not let M01 struggle change E06 selection', () => {
    const evidence = completed([[A, { assistance: hinted }], [B, { assistance: hinted }]]);
    expect(selectNextActivity(request({ evidence, intent: { ...intent, skillId: 'E06' } }))).toMatchObject({ canonicalQuestionId: P.canonicalQuestionId, band: 'core' });
  });
  it('retains practice and an honest suggestion when harder content is unavailable', () => {
    const result = selectNextActivity(request({ catalogue: [A, B, C, D], evidence: completed([[A], [B], [C]]) }));
    expect(result).toMatchObject({ status: 'selected', band: 'core', unavailableSuggestion: {
      kind: 'unavailable-band', band: 'stretch', explanation: 'Harder practice is not available yet; continue distinct practice or review.',
    } });
  });
  it('uses next available band across a gap; highest-band success never invents another band', () => {
    const S2 = task('S2', 'support'), S3 = task('S3', 'support');
    expect(selectNextActivity(request({ catalogue: [S, S2, S3, T], evidence: completed([[S], [S2], [S3]]) }))).toMatchObject({ band: 'stretch' });
    const T2 = task('T2', 'stretch'), T3 = task('T3', 'stretch');
    expect(selectNextActivity(request({ catalogue: [T, T2, T3], evidence: completed([[T], [T2], [T3]]) })))
      .toMatchObject({ band: 'stretch', unavailableSuggestion: { band: null, kind: 'unavailable-band' } });
  });
  it('uses honest introductory fallback when core is missing', () => {
    expect(selectNextActivity(request({ catalogue: [S, T] }))).toMatchObject({ band: 'support', unavailableSuggestion: { band: 'core' } });
  });
  it.each([false, true])('offers prerequisite information at lowest band (delivered=%s) without leaving a bound pool', delivered => {
    const M = task('M', 'support', 'M04'), N = task('N', 'support', 'M04'), prerequisite = task('prerequisite', 'core', 'M02');
    const catalogue = delivered ? [M, N, prerequisite] : [M, N];
    const row = binding('merchant', { role: 'revisit', skillId: 'M04', taskIds: [M.canonicalQuestionId, N.canonicalQuestionId] });
    const merchantIntent = resolved({ kind: 'revisit', bindingId: 'merchant' }, { bindings: [row], catalogue });
    const result = selectNextActivity(request({ catalogue, intent: merchantIntent, evidence: completed([[M, { assistance: hinted }], [N, { assistance: hinted }]]) }));
    expect(result).toMatchObject({ canonicalQuestionId: M.canonicalQuestionId, bindingProvenance: { bindingId: 'merchant' },
      unavailableSuggestion: { kind: 'prerequisite', prerequisiteSkillId: 'M02' } });
    if (result.status === 'selected') expect(result.unavailableSuggestion?.explanation).toContain(delivered ? 'This practice is available' : 'not available yet');
  });
  it('offers worked support at the lowest band when no prerequisite exists', () => {
    const S2 = task('S2', 'support');
    expect(selectNextActivity(request({ catalogue: [S, S2], evidence: completed([[S, { assistance: hinted }], [S2, { assistance: hinted }]]) })))
      .toMatchObject({ band: 'support', unavailableSuggestion: { kind: 'unavailable-band', prerequisiteSkillId: null } });
  });
  it('exhaustion yields labelled familiar repeat practice; explicit easier/repeat are noncompetitive', () => {
    const canonicalHistory = [A, B].map(t => history(t, { everChecked: true, previousSuccessWeek: '2026-10-12' }));
    expect(selectNextActivity(request({ catalogue: [A, B], canonicalHistory }))).toMatchObject({ reason: 'repeat-practice', familiar: true, rewardCandidate: 'none' });
    expect(selectNextActivity(request({ intent: { ...intent, kind: 'child-easier' } }))).toMatchObject({ band: 'support', reason: 'child-easier', rewardCandidate: 'none' });
    expect(selectNextActivity(request({ canonicalHistory: [history(B, { everChecked: true })], intent: { ...intent, kind: 'repeat-practice' } })))
      .toMatchObject({ canonicalQuestionId: B.canonicalQuestionId, reason: 'repeat-practice', rewardCandidate: 'none' });
  });
  it('a fixed introductory story anchor overrides adaptive promotion and due review', () => {
    const anchor = binding('intro', { taskIds: [S.canonicalQuestionId] });
    expect(selectNextActivity(request({ intent: resolved({ kind: 'quest', questId: 'Q1' }, { bindings: [anchor] }),
      evidence: completed([[A], [B], [C]]), calendar: { ...request().calendar, todayDate: '2026-11-01' } })))
      .toMatchObject({ canonicalQuestionId: S.canonicalQuestionId, reason: 'story-anchor', band: 'support' });
  });
  it('uses adaptive bands inside an M2 story pool, without falling into unrelated content', () => {
    const row = binding('m2', { availability: 'M2', taskIds: [A.canonicalQuestionId, T.canonicalQuestionId] });
    const bound = resolved({ kind: 'quest', questId: 'Q1' }, { bindings: [row], milestone: 'M2' });
    expect(selectNextActivity(request({ intent: bound, evidence: completed([[A], [B], [C]]) }))).toMatchObject({ canonicalQuestionId: T.canonicalQuestionId, reason: 'story-anchor' });
    expect(selectNextActivity(request({ intent: bound, catalogue: [P] }))).toMatchObject({ status: 'no-suitable-task' });
  });
});

describe('review, reward advisory boundary and retained encounters', () => {
  const evidence = completed([[A]]);
  const known = history(A, { everChecked: true, previousSuccessLocalDate: '2026-10-23', previousSuccessWeek: '2026-10-19', checkedCompetitionWeekIds: ['2026-10-19'] });
  const nextWeek = { todayDate: '2026-10-26', competitionWeekId: '2026-10-26', reviewIn3DaysDate: '2026-10-29', reviewIn7DaysDate: '2026-11-02' };
  it('preserves canonical ID for familiar later-week review with only an advisory candidate', () => {
    expect(selectNextActivity(request({ catalogue: [A], evidence, canonicalHistory: [known], calendar: nextWeek }))).toEqual({
      status: 'selected', canonicalQuestionId: A.canonicalQuestionId, band: 'core', reason: 'due-review', bindingProvenance: null,
      familiar: true, reviewReference: { canonicalQuestionId: A.canonicalQuestionId, dueLocalDate: '2026-10-26', previousSuccessWeek: '2026-10-19' },
      resumeEncounterId: null, rewardCandidate: 'later-week-due-review', unavailableSuggestion: null,
    });
  });
  it('same-week due review remains educational practice with no candidate', () => {
    const sameWeekEvidence = completed([[A, { localDate: '2026-10-19' }]]);
    expect(selectNextActivity(request({ catalogue: [A], evidence: sameWeekEvidence, canonicalHistory: [known] })))
      .toMatchObject({ reason: 'due-review', familiar: true, rewardCandidate: 'none' });
  });
  it('late success uses its actual success week rather than the old earning week', () => {
    const late = history(A, { ...known, previousSuccessLocalDate: '2026-10-26', previousSuccessWeek: '2026-10-26', checkedCompetitionWeekIds: ['2026-10-19'] });
    expect(selectNextActivity(request({ catalogue: [A], evidence, canonicalHistory: [late], calendar: nextWeek })))
      .toMatchObject({ reason: 'due-review', rewardCandidate: 'none' });
  });
  it('calendar rollover alone opens no review or candidate for previously successful work', () => {
    expect(selectNextActivity(request({ catalogue: [A], canonicalHistory: [known], calendar: nextWeek })))
      .toMatchObject({ reason: 'repeat-practice', rewardCandidate: 'none' });
  });
  it('offers genuine canonical review before unseen practice; skipping review restores unseen-first choice', () => {
    expect(selectNextActivity(request({ catalogue: [A, B], evidence, canonicalHistory: [known], calendar: nextWeek })))
      .toMatchObject({ canonicalQuestionId: A.canonicalQuestionId, reason: 'due-review', familiar: true,
        reviewReference: { canonicalQuestionId: A.canonicalQuestionId, dueLocalDate: '2026-10-26', previousSuccessWeek: '2026-10-19' }, rewardCandidate: 'later-week-due-review' });
    expect(selectNextActivity(request({ catalogue: [A, B], evidence, canonicalHistory: [known], calendar: nextWeek, suppressDueReviewForVisit: true })))
      .toMatchObject({ canonicalQuestionId: B.canonicalQuestionId, reason: 'adaptive-practice', familiar: false, reviewReference: null, rewardCandidate: 'first-encounter' });
  });
  it.each([
    { canonicalHistory: [] }, { canonicalHistory: [history(A, { everChecked: true })] },
    { canonicalHistory: [{ ...known, previousSuccessLocalDate: null }] },
  ])('never manufactures review provenance without a usable previous success: $canonicalHistory', ({ canonicalHistory }) => {
    const result = selectNextActivity(request({ catalogue: [A, B], evidence, canonicalHistory, calendar: nextWeek }));
    expect(result).toMatchObject({ reason: 'adaptive-practice', reviewReference: null, rewardCandidate: 'first-encounter' });
  });
  it('keeps educational same-week review while unseen work exists, without a new reward candidate', () => {
    const sameWeekEvidence = completed([[A, { localDate: '2026-10-19' }]]);
    expect(selectNextActivity(request({ catalogue: [A, B], evidence: sameWeekEvidence,
      canonicalHistory: [{ ...known, previousSuccessLocalDate: '2026-10-19' }] })))
      .toMatchObject({ canonicalQuestionId: A.canonicalQuestionId, reason: 'due-review', familiar: true,
        reviewReference: { canonicalQuestionId: A.canonicalQuestionId, previousSuccessWeek: '2026-10-19', dueLocalDate: '2026-10-22' }, rewardCandidate: 'none' });
  });
  it('oldest due skill wins when unspecified; explicit skill, bound routes and visit suppression constrain review', () => {
    const twoSkills = { ...completed([[P, { localDate: '2026-10-20' }]]), ...evidence };
    const canonicalHistory = [known, history(P, { everChecked: true, previousSuccessLocalDate: '2026-10-20', previousSuccessWeek: '2026-10-19' })];
    expect(selectNextActivity(request({ evidence: twoSkills, canonicalHistory, calendar: nextWeek, intent: { ...intent, skillId: null } })))
      .toMatchObject({ canonicalQuestionId: P.canonicalQuestionId, reason: 'due-review' });
    expect(selectNextActivity(request({ evidence: twoSkills, canonicalHistory, calendar: nextWeek }))).toMatchObject({ reason: 'due-review', canonicalQuestionId: A.canonicalQuestionId });
    const before = JSON.stringify(twoSkills);
    for (let visitRequest = 0; visitRequest < 2; visitRequest++) expect(selectNextActivity(request({ evidence: twoSkills, calendar: nextWeek, suppressDueReviewForVisit: true }))).toMatchObject({ reason: 'adaptive-practice' });
    expect(JSON.stringify(twoSkills)).toBe(before);
    expect(selectNextActivity(request({ evidence: twoSkills, calendar: nextWeek, intent: resolved({ kind: 'revisit', bindingId: 'revisit' }) })))
      .toMatchObject({ reason: 'adaptive-practice', bindingProvenance: { role: 'revisit' } });
  });
  it('supported genuine canonical review suggests support', () => {
    const reviewed = applyLearningObservation(evidence, observation(A, 'review', { selectionReason: 'due-review', assistance: hinted, localDate: '2026-10-26', familiar: true,
      reviewReference: { canonicalQuestionId: A.canonicalQuestionId, dueLocalDate: '2026-10-26', previousSuccessWeek: '2026-10-19' } }));
    expect(selectNextActivity(request({ evidence: reviewed, calendar: nextWeek }))).toMatchObject({ band: 'support' });
  });
  it.each(['open', 'suspended', 'completed-unsuccessful'] as const)('resumes %s original work, retaining reason/provenance across another route/week', episodeStatus => {
    const saved = encounter(A, { episodeStatus, bindingProvenance: { bindingId: 'revisit', questId: 'Q1', role: 'revisit' } });
    const req = frozen(request({ intent: resolved({ kind: 'quest', questId: 'Q1' }), activeEncounter: saved, calendar: nextWeek }));
    const before = JSON.stringify(req);
    expect(selectNextActivity(req)).toMatchObject({ canonicalQuestionId: A.canonicalQuestionId, reason: 'child-easier', resumeEncounterId: saved.encounterId,
      bindingProvenance: { role: 'revisit', bindingId: 'revisit' }, rewardCandidate: 'none' });
    expect(JSON.stringify(req)).toBe(before);
    expect(req.activeEncounter?.assistance.answerHintUsed).toBe(true);
    expect(req.activeEncounter?.validChecks).toBe(1);
  });
  it('canonical pending free practice wins before unseen tasks, preserving help on reroute and JSON reload', () => {
    const saved = encounter(B, { validChecks: 0, firstCheckCorrect: null });
    const req = request({ canonicalHistory: [history(B, { pendingEncounter: saved, assistance: hinted })], calendar: nextWeek });
    const result = selectNextActivity(JSON.parse(JSON.stringify(req)));
    expect(result).toMatchObject({ canonicalQuestionId: B.canonicalQuestionId, resumeEncounterId: 'retained-A', reason: 'child-easier', rewardCandidate: 'none', bindingProvenance: null });
  });
  it('once prior practice succeeds, a fresh required story selection retains story provenance but cannot renew reward', () => {
    const result = selectNextActivity(request({ intent: resolved({ kind: 'quest', questId: 'Q1' }), activeEncounter: encounter(A, { episodeStatus: 'completed-success' }), canonicalHistory: [known] }));
    expect(result).toMatchObject({ reason: 'story-anchor', resumeEncounterId: null, rewardCandidate: 'none', bindingProvenance: { role: 'story' } });
  });
  it('checked free practice cannot become a fresh first attempt even with absent prior success', () => {
    expect(selectNextActivity(request({ catalogue: [A], canonicalHistory: [history(A, { everChecked: true, checkedCompetitionWeekIds: ['2026-10-19'], assistance: hinted })] })))
      .toMatchObject({ rewardCandidate: 'none', familiar: true });
  });
  it('a same-week Check blocks a later-week review candidate, including prior free practice', () => {
    expect(selectNextActivity(request({ catalogue: [A], evidence, canonicalHistory: [{ ...known, checkedCompetitionWeekIds: ['2026-10-19', '2026-10-26'] }], calendar: nextWeek })))
      .toMatchObject({ reason: 'due-review', rewardCandidate: 'none' });
  });
  it.each([
    { contentRevision: 'missing' }, { descriptor: { ...A.descriptor, authoredKey: 'wrong' } },
    { descriptor: { ...A.descriptor, equivalenceVersion: 'invalid' } }, { skillId: 'M04' },
  ] as const)('invalid retained descriptor/content is recoverably unavailable: %j', patch => {
    expect(selectNextActivity(request({ activeEncounter: encounter(A, patch) }))).toMatchObject({ status: 'no-suitable-task' });
  });
  it('a requested resume without retained work never selects a replacement', () => {
    expect(selectNextActivity(request({ intent: { ...intent, kind: 'resume' } }))).toMatchObject({ status: 'no-suitable-task' });
  });
  it('serializes immutable results and leaves binding completion and histories unchanged', () => {
    const input = frozen(request({ intent: resolved({ kind: 'quest', questId: 'Q1' }), evidence, canonicalHistory: [known] }));
    const before = JSON.stringify(input);
    const output = selectNextActivity(input);
    expect(JSON.parse(JSON.stringify(output))).toEqual(output);
    expect(JSON.stringify(input)).toBe(before);
    expect(Object.keys(output)).not.toContain('points');
    expect(Object.keys(output)).not.toContain('completedStoryBindingIds');
  });
  it('fresh E08 path: select, listening success, distinct independent success, later familiar review and factual summary', () => {
    const K = task('K', 'core', 'E08'), L = task('L', 'core', 'E08'), catalogue = [L, K];
    const readingIntent = resolved({ kind: 'practice', skillId: 'E08', mode: 'suggested' }, { catalogue });
    expect(selectNextActivity(request({ catalogue, intent: readingIntent }))).toMatchObject({ canonicalQuestionId: K.canonicalQuestionId, rewardCandidate: 'first-encounter' });
    let readingEvidence = applyLearningObservation({}, observation(K, 'K', {
      assistance: { ...neutral, assessedTextReadAloud: true, evidenceMode: 'listening-supported' },
    }));
    const histories = [history(K, { everChecked: true, previousSuccessLocalDate: '2026-10-23', previousSuccessWeek: '2026-10-19' })];
    expect(selectNextActivity(request({ catalogue, intent: readingIntent, evidence: readingEvidence, canonicalHistory: histories })))
      .toMatchObject({ canonicalQuestionId: L.canonicalQuestionId, familiar: false });
    readingEvidence = applyLearningObservation(readingEvidence, observation(L, 'L', { localDate: '2026-10-24' }));
    expect(summarizeLearning(readingEvidence, catalogue, '2026-10-24')[0]).toMatchObject({ validChecks: 2, completedEpisodes: 2,
      independentSuccesses: 1, supportedSuccesses: 1, laterDistinctSuccesses: 1, reviewDueLocalDate: '2026-10-27' });
    histories.push(history(L, { everChecked: true, previousSuccessLocalDate: '2026-10-24', previousSuccessWeek: '2026-10-19' }));
    const review = selectNextActivity(request({ catalogue, intent: readingIntent, evidence: readingEvidence, canonicalHistory: histories,
      calendar: { todayDate: '2026-10-27', competitionWeekId: '2026-10-26', reviewIn3DaysDate: '2026-10-30', reviewIn7DaysDate: '2026-11-03' } }));
    expect(review).toMatchObject({ canonicalQuestionId: K.canonicalQuestionId, reason: 'due-review', familiar: true, rewardCandidate: 'later-week-due-review' });
    if (review.status !== 'selected') throw new Error('Expected review');
    readingEvidence = applyLearningObservation(readingEvidence, observation(K, 'K-review', { selectionReason: review.reason,
      familiar: review.familiar, reviewReference: review.reviewReference, localDate: '2026-10-27', competitionWeekId: '2026-10-26' }));
    expect(summarizeLearning(readingEvidence, catalogue, '2026-10-27')[0]).toMatchObject({ validChecks: 3, completedEpisodes: 3,
      independentSuccesses: 2, supportedSuccesses: 1, laterDistinctSuccesses: 1, label: 'practising', reviewDueLocalDate: '2026-11-03',
      latestReview: { outcome: 'independent-success', familiar: true } });
  });
});

/** Actual facade/reducer/decoder with an isolated in-memory repository port.
 * This tests producer integration, not IndexedDB persistence or browser reload. */
async function reviewFacadeHarness(startDate = '2026-10-09') {
  const catalogue = listTasks();
  let root: StoredRoot = { epoch: 'review-integration', revision: 0, save: createInitialSave() };
  let sequence = 0, writes = 0, now = Date.parse(`${startDate}T12:00:00Z`);
  const snapshot = () => structuredClone({ token: { epoch: root.epoch, revision: root.revision }, save: root.save });
  const repository: SaveRepository = {
    async loadRoot() { return { status: 'ready', snapshot: snapshot() }; },
    async commitCommand(command, ports) {
      if (command.expected.epoch !== root.epoch || command.expected.revision !== root.revision) return { status: 'conflict', snapshot: snapshot() };
      const decision = ports.reduce(root, command, ports.context);
      if (decision.status === 'already-applied') return { status: 'already-applied', snapshot: snapshot() };
      if (decision.status !== 'changed') return { status: decision.status, reason: decision.reason };
      const checked = validateSave(decision.save, catalogue);
      if (checked.status !== 'valid') return { status: checked.status, reason: checked.issues[0] };
      root = { ...root, revision: root.revision + 1, save: checked.save }; writes++;
      return { status: 'committed', snapshot: snapshot(), changes: decision.changes };
    },
    async readExportSnapshot() { return snapshot(); },
    async readRecoveryExport() { return { status: 'unavailable', cause: 'absent-database', message: 'In-memory fixture only.' }; },
    async replaceSave() { throw new Error('Not used in this producer fixture.'); },
    subscribeInvalidation() { return () => {}; }, notifySilence() {}, close() {},
  };
  const controller = createStateController({ repository, catalogue, questBindings: QUEST_ACTIVITY_BINDINGS,
    milestone: 'M1', clock: { nowEpochMs: () => now }, allocateId: () => `review-id-${++sequence}`,
    preferenceGate: { applyLiveIntent() {} }, readTransientReadiness: () => ({ dirty: false, pending: false, failed: false }) });
  expect((await controller.ready).status).toBe('ready');
  const act = (kind: StateCommand['kind'], payload: unknown, profileId: string | null = 'ada') =>
    controller.dispatch({ kind, payload, actionId: `review-action-${++sequence}`, expected: controller.getSnapshot().token,
      ...(profileId ? { profileId } : {}) } as StateCommand);
  const profile = () => controller.getSnapshot().save.profiles.ada;
  const active = () => Object.values(profile().encounters).reverse().find(e => e.learningEpisode.status === 'open')!;
  const check = (e: EncounterSave, response: ActivityResponse) => act('SubmitCheck', { encounterId: e.encounterId,
    learningEpisodeOrdinal: e.learningEpisode.ordinal, submissionId: `review-submission-${++sequence}`, checkSequence: e.validChecks + 1, response });
  expect((await act('CreateProfile', { newProfileId: 'ada', nickname: 'Ada', avatarId: 'pip' }, null)).status).toBe('committed');
  expect((await act('OpenEncounter', { route: { kind: 'quest', questId: 'Q1' }, suppressDueReviewForVisit: false })).status).toBe('committed');
  expect(active().canonicalQuestionId).toBe('lif.math.bridge.r1.total-12');
  expect((await check(active(), { kind: 'bridge', planks: [6, 6] })).status).toBe('committed');
  return { controller, catalogue, act, profile, active, check, writes: () => writes,
    setDate: (date: string) => { now = Date.parse(`${date}T12:00:00Z`); } };
}

describe('review producer through the actual facade and decoder', () => {
  it('9 October Q1 success → 12 October genuine review opens, completes, exports and decodes', async () => {
    const h = await reviewFacadeHarness();
    try {
      h.setDate('2026-10-12');
      const opened = await h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'M01', mode: 'suggested' }, suppressDueReviewForVisit: false });
      expect(opened).toMatchObject({ status: 'committed' });
      const e = h.active();
      expect(e).toMatchObject({ canonicalQuestionId: 'lif.math.bridge.r1.total-12', selectionReason: 'due-review', familiar: true,
        reviewReference: { canonicalQuestionId: 'lif.math.bridge.r1.total-12', dueLocalDate: '2026-10-12', previousSuccessWeek: '2026-10-05' },
        eligibility: { kind: 'eligible-review' } });
      expect(selectCommittedActivity(h.controller.getSnapshot(), h.catalogue, { profileId: 'ada', encounterId: e.encounterId }))
        .toMatchObject({ status: 'ready', activity: { selectionReason: 'due-review', reviewReference: e.reviewReference } });
      expect(validateSave(h.controller.getSnapshot().save, h.catalogue).status).toBe('valid');
      expect(await h.check(e, { kind: 'bridge', planks: [6, 6] })).toMatchObject({ status: 'committed',
        changes: { earnedPoints: { lifetimeDelta: 20, competitiveDelta: 20 } } });
      expect(h.profile().learning.evidence.M01?.bands.support).toMatchObject({ validChecks: 2, completedEpisodes: 2,
        independentSuccesses: 2, laterDistinctSuccesses: 0, reviewDueLocalDate: '2026-10-19' });
      const exported = await h.controller.backupActions.export('flushed');
      expect(exported.status).toBe('ready');
      if (exported.status !== 'ready') throw new Error('Expected valid backup');
      const decoded = decodeBackup(exported.backup.json, h.catalogue);
      expect(decoded.status).toBe('valid');
      if (decoded.status === 'valid') expect(decoded.envelope.save).toEqual(h.controller.getSnapshot().save);
    } finally { h.controller.dispose(); }
  });
  it('skip-review selects unseen total-10 as ordinary practice and preserves the due date through Check/export', async () => {
    const h = await reviewFacadeHarness();
    try {
      h.setDate('2026-10-12');
      expect((await h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'M01', mode: 'suggested' }, suppressDueReviewForVisit: true })).status).toBe('committed');
      const e = h.active();
      expect(e).toMatchObject({ canonicalQuestionId: 'lif.math.bridge.r1.total-10', selectionReason: 'adaptive-practice', familiar: false, reviewReference: null });
      expect((await h.check(e, { kind: 'bridge', planks: [6, 4] })).status).toBe('committed');
      expect(h.profile().learning.evidence.M01?.bands.support.reviewDueLocalDate).toBe('2026-10-12');
      const exported = await h.controller.backupActions.export('flushed');
      expect(exported.status).toBe('ready');
      if (exported.status === 'ready') expect(decodeBackup(exported.backup.json, h.catalogue).status).toBe('valid');
    } finally { h.controller.dispose(); }
  });
  it('same-week educational review completes with zero award and export/decode equality', async () => {
    const h = await reviewFacadeHarness('2026-10-05');
    try {
      h.setDate('2026-10-08');
      expect((await h.act('OpenEncounter', { route: { kind: 'practice', skillId: 'M01', mode: 'suggested' }, suppressDueReviewForVisit: false })).status).toBe('committed');
      const e = h.active();
      expect(e).toMatchObject({ canonicalQuestionId: 'lif.math.bridge.r1.total-12', selectionReason: 'due-review', familiar: true,
        reviewReference: { canonicalQuestionId: 'lif.math.bridge.r1.total-12', dueLocalDate: '2026-10-08', previousSuccessWeek: '2026-10-05' },
        opportunityId: null, eligibility: { kind: 'practice-only' } });
      expect(validateSave(h.controller.getSnapshot().save, h.catalogue).status).toBe('valid');
      const before = h.controller.getSnapshot(), writes = h.writes();
      expect(await h.check(e, { kind: 'bridge', planks: [6, 6] })).toMatchObject({ status: 'committed',
        changes: { earnedPoints: { lifetimeDelta: 0, competitiveDelta: 0, newReceiptKeys: [] } } });
      expect(h.controller.getSnapshot()).not.toBe(before);
      expect(h.writes()).toBe(writes + 1);
      expect(h.profile().rewards.lifetimePoints).toBe(40);
      expect(h.controller.getSnapshot().save.competition.currentScores.ada).toBe(20);
      expect(h.controller.getSnapshot().save.competition.currentSlots.ada).toHaveLength(1);
      expect(h.profile().rewards.tracksByCanonical[e.canonicalQuestionId].lastAllocatedOrdinal).toBe(1);
      expect(h.profile().learning.evidence.M01?.bands.support).toMatchObject({ validChecks: 2, completedEpisodes: 2,
        independentSuccesses: 2, laterDistinctSuccesses: 0, reviewDueLocalDate: '2026-10-15' });
      expect(h.profile().learning.evidence.M01?.bands.support.reviewResults.at(-1)).toMatchObject({
        canonicalQuestionId: e.canonicalQuestionId, localDate: '2026-10-08', competitionWeekId: '2026-10-05',
        outcome: 'independent-success', familiar: true });
      expect(h.profile().encounters[e.encounterId]).toMatchObject({ selectionReason: 'due-review',
        reviewReference: e.reviewReference, opportunityId: null, learningEpisode: { status: 'completed-success' } });
      const exported = await h.controller.backupActions.export('flushed');
      expect(exported.status).toBe('ready');
      if (exported.status !== 'ready') throw new Error('Expected valid same-week backup');
      const decoded = decodeBackup(exported.backup.json, h.catalogue);
      expect(decoded.status).toBe('valid');
      if (decoded.status === 'valid') expect(decoded.envelope.save).toEqual(h.controller.getSnapshot().save);
    } finally { h.controller.dispose(); }
  });
});
