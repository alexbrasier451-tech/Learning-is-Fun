import { describe, expect, it } from 'vitest';
import type { CanonicalLearningHistory, LearningAssistance, LearningObservation, LearningRouteIntent,
  QuestActivityBinding, SelectionEncounter, SelectionRequest, SkillEvidence, TaskDefinition } from '../../src/learning/contracts';
import { ALL_TASKS, EXPANSION_MANIFESTS, STARTER_TASKS, getTask, listTasks, validateCatalogue } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS as expandedBindings, validateBindings, getRequiredBindingIds, areRequiredBindingsComplete } from '../../src/content/quest-bindings';
import { SKILLS, PREREQUISITE_SUGGESTIONS } from '../../src/content/skills';
import { buildBridgeTasks, buildMerchantTasks } from '../../src/content/starter-maths';
import { STARTER_PUNCTUATION_TASKS } from '../../src/content/starter-english';
import { canonicalQuestionId } from '../../src/learning/identity';
import { createDraft, toResponse } from '../../src/interaction/draft';
import { QUESTS } from '../../src/experience/catalogue';
import { STARTER_MATHS_MANIFEST } from '../../src/content/starter-maths';
import { STARTER_PUNCTUATION_MANIFEST } from '../../src/content/starter-english';
import { applyLearningObservation } from '../../src/learning/evidence';
import { resolveBindingIntent, selectNextActivity } from '../../src/learning/select';
import { summarizeLearning } from '../../src/learning/summarize';
import { evaluateResponse } from '../../src/learning/evaluate';

const questIds = QUESTS.map(quest => quest.id);
// Keep the original M1 compatibility oracle operating on the original pool.
const QUEST_ACTIVITY_BINDINGS = expandedBindings.filter(row => row.availability === 'M1');
const bridge = getTask('lif.math.bridge.r1.total-12')!;
const merchant = getTask('lif.math.merchant.r1.mult-2.pears-3')!;
const bridgePool = STARTER_TASKS.filter(task => task.skillId === 'M01');
const neutral: LearningAssistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' };
const hinted = { ...neutral, answerHintUsed: true };
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const requiredM2 = {
  Q4: ['q4-story-m02-match'], Q5: ['q5-story-m05-quantity'], Q6: ['q6-story-e04-sort', 'q6-story-e02-clue'],
  Q7: ['q7-story-e10-sequence'], Q8: ['q8-story-e08-clue', 'q8-story-m07-path'],
  Q9: ['q9-story-m08-clock', 'q9-story-m08-sequence'],
  Q10: ['q10-story-m07-goods', 'q10-story-m10-data', 'q10-story-e05-meaning'],
};

describe('reviewed expansion assembly', () => {
  it('counts primary identities once, preserves every starter signature and meets exactly twenty skill floors', () => {
    expect(ALL_TASKS).toHaveLength(236); expect(validateCatalogue(ALL_TASKS)).toEqual([]);
    expect(new Set(ALL_TASKS.map(task => task.canonicalQuestionId)).size).toBe(236);
    const added = ALL_TASKS.filter(task => !STARTER_TASKS.some(old => old.canonicalQuestionId === task.canonicalQuestionId));
    expect(added).toHaveLength(200); expect(SKILLS).toHaveLength(20);
    expect(new Set(added.map(task => task.skillId))).toEqual(new Set(SKILLS.map(skill => skill.skillId)));
    for (const skill of SKILLS) {
      expect(added.filter(task => task.skillId === skill.skillId)).toHaveLength(10);
      for (const [band, count] of [['core', 4], ['support', 3], ['stretch', 3]] as const) {
        expect(added.filter(task => task.skillId === skill.skillId && task.band === band)).toHaveLength(count);
        expect(listTasks({ skillId: skill.skillId, band })).toEqual(ALL_TASKS.filter(task => task.skillId === skill.skillId && task.band === band));
      }
    }
    for (const task of ALL_TASKS) {
      expect(canonicalQuestionId(task.descriptor)).toBe(task.canonicalQuestionId);
      expect(task.review.status).toBe('approved'); expect(Object.isFrozen(task)).toBe(true);
      expect(getTask(task.canonicalQuestionId)).toBe(task);
    }
    for (const starter of STARTER_TASKS) expect(getTask(starter.canonicalQuestionId)).toEqual(starter);
    const declared = EXPANSION_MANIFESTS.flatMap(manifest => manifest.taskIds);
    expect(new Set(declared).size).toBe(200); expect(new Set(declared)).toEqual(new Set(added.map(task => task.canonicalQuestionId)));
    for (const manifest of EXPANSION_MANIFESTS) {
      expect(manifest.reviewEvidenceRef).toBeTruthy();
      for (const id of [...manifest.taskIds, ...manifest.retainedTaskIds]) expect(getTask(id)).toBeDefined();
    }
    const visit = (id: string, ancestors: readonly string[] = []) => {
      expect(ancestors).not.toContain(id);
      for (const edge of PREREQUISITE_SUGGESTIONS.filter(edge => edge.skillId === id)) visit(edge.prerequisiteSkillId, [...ancestors, id]);
    };
    SKILLS.forEach(skill => visit(skill.skillId));
  });
  it.each(['Q1', 'Q2', 'Q3'])('runs the unchanged required M1 %s path against the expanded catalogue', questId => {
    const resolved = resolveBindingIntent({ route: { kind: 'quest', questId }, milestone: 'M1', bindings: expandedBindings,
      catalogue: ALL_TASKS, accessibleQuestIds: ['Q1', 'Q2', 'Q3'], completedStoryBindingIds: [] });
    if (resolved.status !== 'resolved') throw new Error('Expected retained M1 intent');
    const selected = selectNextActivity({ ...request({ kind: 'quest', questId }), catalogue: ALL_TASKS, intent: resolved.intent });
    const anchor = QUEST_ACTIVITY_BINDINGS.find(row => row.questId === questId && row.role === 'story')!;
    expect(selected).toMatchObject({ status: 'selected', canonicalQuestionId: anchor.taskIds[0], reason: 'story-anchor', bindingProvenance: { bindingId: anchor.bindingId } });
    const oracle = [...STARTER_MATHS_MANIFEST.cases, ...STARTER_PUNCTUATION_MANIFEST.cases].find(item => item.canonicalQuestionId === anchor.taskIds[0] && item.expectedCorrect)!;
    expect(evaluateResponse(getTask(anchor.taskIds[0])!, oracle.response)).toMatchObject({ status: 'judged', correct: true });
  });
  it('retains the released M1 rows and adds ordered, support-accessible M2 story pools plus all assessed routes', () => {
    expect(validateBindings(expandedBindings, ALL_TASKS, questIds)).toEqual([]);
    expect(expandedBindings).toHaveLength(57);
    expect(new Set(expandedBindings.map(row => row.skillId))).toEqual(new Set(SKILLS.map(skill => skill.skillId)));
    expect(new Set(expandedBindings.map(row => row.mechanic))).toEqual(new Set(['drag', 'matching', 'sequencing', 'sorting', 'object-manipulation', 'consequential-selection']));
    for (const [questId, ids] of Object.entries(requiredM2)) {
      expect(getRequiredBindingIds(expandedBindings, questId, 'M1')).toEqual([]);
      expect(getRequiredBindingIds(expandedBindings, questId, 'M2')).toEqual(ids);
      for (const id of ids) {
        const row = expandedBindings.find(row => row.bindingId === id)!;
        expect(row.sourceBindingId).toBeNull();
        expect(row.taskIds.some(taskId => getTask(taskId)?.band === 'support')).toBe(true);
      }
    }
    for (const questId of ['Q1', 'Q2', 'Q3']) expect(getRequiredBindingIds(expandedBindings, questId, 'M2'))
      .toEqual(getRequiredBindingIds(QUEST_ACTIVITY_BINDINGS, questId, 'M1'));
    for (const row of expandedBindings.filter(row => row.availability === 'M2' && row.role === 'revisit')) {
      expect(row.bindingId).toBe(`${row.questId.toLowerCase()}-revisit-${row.skillId.toLowerCase()}-${row.responseKind}`);
      expect(row.sourceBindingId).toBeNull();
    }
    for (const task of ALL_TASKS) expect(expandedBindings.some(row => row.taskIds.includes(task.canonicalQuestionId))).toBe(true);
  });
  it.each(Object.values(requiredM2).flat())('resolves, selects, adapts and evaluates actual required pool %s, including support selection', bindingId => {
    const row = expandedBindings.find(row => row.bindingId === bindingId)!;
    const resolved = resolveBindingIntent({ route: { kind: 'quest', questId: row.questId, bindingId }, milestone: 'M2',
      bindings: expandedBindings, catalogue: ALL_TASKS, accessibleQuestIds: questIds, completedStoryBindingIds: [] });
    expect(resolved.status).toBe('resolved'); if (resolved.status !== 'resolved') throw new Error('Expected M2 intent');
    const base = { ...request({ kind: 'practice', skillId: 'M01', mode: 'suggested' }), catalogue: ALL_TASKS, intent: resolved.intent };
    const check = (input: SelectionRequest, support = false) => {
      const selected = selectNextActivity(input);
      expect(selected).toMatchObject({ status: 'selected', bindingProvenance: { bindingId, questId: row.questId, role: 'story' } });
      if (selected.status !== 'selected') throw new Error('Expected M2 selection');
      expect(row.taskIds).toContain(selected.canonicalQuestionId); if (support) expect(selected.band).toBe('support');
      const task = getTask(selected.canonicalQuestionId)!;
      if (task.answerRule.kind !== 'accepted-responses') throw new Error('Expected expansion reviewed response');
      const response = task.answerRule.responses[0];
      expect(toResponse(createDraft(task.responseSpec, response))).toEqual(response);
      expect(evaluateResponse(task, response)).toMatchObject({ status: 'judged', correct: true, skillId: row.skillId });
      const evidence = applyLearningObservation({}, observation(task, bindingId));
      expect(evidence[row.skillId]?.bands[task.band]).toMatchObject({ validChecks: 1, completedEpisodes: 1, independentSuccesses: 1 });
    };
    check(base);
    let evidence: SkillEvidence = {};
    const core = ALL_TASKS.find(task => task.skillId === row.skillId && task.band === 'core')!;
    for (let i = 0; i < 2; i++) evidence = applyLearningObservation(evidence, observation(core, `${bindingId}-help-${i}`, { assistance: hinted }));
    check({ ...base, evidence }, true);
  });
  it('keeps Q9 incomplete after clock success or optional work and resolves the remaining required sequence', () => {
    const base = { bindings: expandedBindings, questId: 'Q9', milestone: 'M2' as const };
    const clock = ['q9-story-m08-clock'];
    expect(areRequiredBindingsComplete({ ...base, completedStoryBindingIds: [...clock, 'q9-revisit-m08-quantity'] })).toBe(false);
    expect(areRequiredBindingsComplete({ ...base, completedStoryBindingIds: requiredM2.Q9 })).toBe(true);
    expect(resolveBindingIntent({ route: { kind: 'quest', questId: 'Q9' }, milestone: 'M2', bindings: expandedBindings,
      catalogue: ALL_TASKS, accessibleQuestIds: questIds, completedStoryBindingIds: clock })).toMatchObject({ status: 'resolved', intent: { binding: { bindingId: 'q9-story-m08-sequence' } } });
  });
  it('rejects missing, reordered, invented, malformed and mismatched expansion binding declarations', () => {
    const mutations = [
      expandedBindings.filter(row => row.bindingId !== 'q9-story-m08-sequence'),
      [...expandedBindings.filter(row => row.bindingId !== 'q6-story-e04-sort'), expandedBindings.find(row => row.bindingId === 'q6-story-e04-sort')!],
      [...expandedBindings, { ...expandedBindings[9], bindingId: 'unknown-m2' }],
      expandedBindings.map(row => row.bindingId === 'q4-story-m02-match' ? { ...row, mechanic: 'sorting' as const } : row),
      expandedBindings.map(row => row.bindingId === 'q8-story-e08-clue' ? { ...row, taskIds: [] } : row),
    ];
    for (const rows of mutations) expect(validateBindings(rows, ALL_TASKS, questIds).length).toBeGreaterThan(0);
  });
  it.each(expandedBindings.filter(row => row.availability === 'M2' && row.role === 'revisit'))('selects and evaluates optional assessed route $bindingId', row => {
    const resolved = resolveBindingIntent({ route: { kind: 'revisit', bindingId: row.bindingId }, milestone: 'M2', bindings: expandedBindings,
      catalogue: ALL_TASKS, accessibleQuestIds: questIds, completedStoryBindingIds: [] });
    if (resolved.status !== 'resolved') throw new Error(`Unresolved ${row.bindingId}`);
    const selected = selectNextActivity({ ...request({ kind: 'practice', skillId: 'M01', mode: 'suggested' }), catalogue: ALL_TASKS, intent: resolved.intent });
    expect(selected).toMatchObject({ status: 'selected', bindingProvenance: { bindingId: row.bindingId, role: 'revisit' } });
    if (selected.status !== 'selected') throw new Error(`Unselected ${row.bindingId}`);
    const task = getTask(selected.canonicalQuestionId)!;
    if (task.answerRule.kind !== 'accepted-responses') throw new Error('Expected reviewed response');
    expect(evaluateResponse(task, toResponse(createDraft(task.responseSpec, task.answerRule.responses[0])))).toMatchObject({ status: 'judged', correct: true, skillId: row.skillId });
  });
  it.each([
    ['neutral reading', 'E08', neutral, 1, 0],
    ['listening reading', 'E08', { ...neutral, assessedTextReadAloud: true, evidenceMode: 'listening-supported' as const }, 0, 1],
    ['hinted reading', 'E09', hinted, 0, 1],
    ['worked editing', 'E10', { ...neutral, workedSupportUsed: true }, 0, 1],
    ['mixed merchant', 'M04', { ...neutral, evidenceMode: 'mixed' as const }, 0, 1],
  ] as const)('uses supplied objective evidence for %s without fabricating persistence', (_name, skill, assistance, independentSuccesses, supportedSuccesses) => {
    const task = skill === 'M04' ? merchant : ALL_TASKS.find(task => task.skillId === skill && task.band === 'support')!;
    const evidence = applyLearningObservation({}, observation(task, `mode-${skill}`, { assistance }));
    expect(evidence[skill]?.bands[task.band]).toMatchObject({ validChecks: 1, completedEpisodes: 1, independentSuccesses, supportedSuccesses });
    expect(Object.keys(evidence)).toEqual([skill]);
  });
  it('retains expanded helped resume, familiar practice and later due-review identities and provenance', () => {
    const row = expandedBindings.find(row => row.bindingId === 'q8-revisit-e09-choice')!;
    const task = getTask(row.taskIds.find(id => getTask(id)?.band === 'core')!)!;
    const resolved = resolveBindingIntent({ route: { kind: 'revisit', bindingId: row.bindingId }, milestone: 'M2', bindings: expandedBindings,
      catalogue: ALL_TASKS, accessibleQuestIds: questIds, completedStoryBindingIds: [] });
    if (resolved.status !== 'resolved') throw new Error('Expected revisit');
    const base = { ...request({ kind: 'practice', skillId: 'M01', mode: 'suggested' }), catalogue: ALL_TASKS, intent: resolved.intent };
    const saved = { ...pending(task), skillId: task.skillId, band: task.band, assistance: { ...hinted, assessedTextReadAloud: true, evidenceMode: 'listening-supported' as const },
      bindingProvenance: { bindingId: row.bindingId, questId: row.questId, role: row.role } };
    const before = JSON.stringify(saved);
    expect(selectNextActivity({ ...base, canonicalHistory: [history(task, { pendingEncounter: saved, assistance: saved.assistance })] }))
      .toMatchObject({ status: 'selected', canonicalQuestionId: task.canonicalQuestionId, resumeEncounterId: saved.encounterId, rewardCandidate: 'none', bindingProvenance: saved.bindingProvenance });
    expect(JSON.stringify(saved)).toBe(before);
    const pool = row.taskIds.map(id => getTask(id)!);
    const previous = pool.map(task => history(task, { everChecked: true, previousSuccessLocalDate: '2026-10-23', previousSuccessWeek: '2026-10-19', checkedCompetitionWeekIds: ['2026-10-19'] }));
    const evidence = applyLearningObservation({}, observation(task, 'expanded-success'));
    expect(selectNextActivity({ ...base, evidence, canonicalHistory: previous, suppressDueReviewForVisit: true }))
      .toMatchObject({ status: 'selected', familiar: true, rewardCandidate: 'none' });
    const practice = resolveBindingIntent({ route: { kind: 'practice', skillId: 'E09', mode: 'suggested' }, milestone: 'M2', bindings: expandedBindings,
      catalogue: ALL_TASKS, accessibleQuestIds: questIds, completedStoryBindingIds: [] });
    if (practice.status !== 'resolved') throw new Error('Expected unbound practice');
    const due = selectNextActivity({ ...base, intent: practice.intent, evidence, canonicalHistory: previous,
      calendar: { todayDate: '2026-10-26', competitionWeekId: '2026-10-26', reviewIn3DaysDate: '2026-10-29', reviewIn7DaysDate: '2026-11-02' } });
    expect(due).toMatchObject({ status: 'selected', familiar: true, reason: 'due-review', rewardCandidate: 'later-week-due-review', bindingProvenance: null });
    if (due.status !== 'selected') throw new Error('Expected due review');
    expect(row.taskIds).toContain(due.canonicalQuestionId); expect(due.reviewReference?.canonicalQuestionId).toBe(due.canonicalQuestionId);
  });
});
function intent(route: LearningRouteIntent, completedStoryBindingIds: readonly string[] = []) {
  const result = resolveBindingIntent({ route, milestone: 'M1', bindings: QUEST_ACTIVITY_BINDINGS, catalogue: STARTER_TASKS,
    accessibleQuestIds: ['Q1', 'Q2', 'Q3'], completedStoryBindingIds });
  if (result.status !== 'resolved') throw new Error(result.reason);
  return result.intent;
}
function request(route: LearningRouteIntent, patch: Partial<SelectionRequest> = {}, completed: readonly string[] = []): SelectionRequest {
  return { catalogue: STARTER_TASKS, intent: intent(route, completed), evidence: {}, activeEncounter: null, canonicalHistory: [],
    calendar: { todayDate: '2026-10-23', competitionWeekId: '2026-10-19', reviewIn3DaysDate: '2026-10-26', reviewIn7DaysDate: '2026-10-30' }, suppressDueReviewForVisit: false, ...patch };
}
function history(task: TaskDefinition, patch: Partial<CanonicalLearningHistory> = {}): CanonicalLearningHistory {
  return { canonicalQuestionId: task.canonicalQuestionId, pendingEncounter: null, everChecked: false,
    previousSuccessLocalDate: null, previousSuccessWeek: null, checkedCompetitionWeekIds: [], assistance: neutral, ...patch };
}
function observation(task: TaskDefinition, encounterId: string, patch: Partial<LearningObservation> = {}): LearningObservation {
  return { kind: 'check', eventId: `${encounterId}-check`, submissionId: `${encounterId}-check`, profileId: 'child', encounterId,
    learningEpisodeOrdinal: 1, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId,
    band: task.band, selectionReason: 'adaptive-practice', localDate: '2026-10-23', competitionWeekId: '2026-10-19',
    familiar: false, reviewReference: null, assistance: neutral, episodeCheckIndex: 1, encounterCheckIndex: 1,
    firstCheckCorrect: true, correct: true, issues: [], episodeCompletion: 'success', ...patch } as LearningObservation;
}
function pending(task = bridge): SelectionEncounter {
  return { encounterId: 'saved-bridge', opportunityId: 'saved-opportunity', canonicalQuestionId: task.canonicalQuestionId,
    descriptor: task.descriptor, contentRevision: task.contentRevision, skillId: task.skillId, band: task.band,
    selectionReason: 'adaptive-practice', bindingProvenance: { bindingId: 'q1-revisit-m01', questId: 'Q1', role: 'revisit' },
    familiar: false, reviewReference: null, learningEpisodeOrdinal: 1, episodeStatus: 'suspended', validChecks: 1,
    firstCheckCorrect: false, assistance: hinted };
}

describe('36-task delivered catalogue', () => {
  it('validates real producer records, IDs, manifests, help and delivery bands', () => {
    expect(STARTER_TASKS).toHaveLength(36); expect(validateCatalogue(STARTER_TASKS)).toEqual([]);
    expect(new Set(STARTER_TASKS.map(task => task.canonicalQuestionId)).size).toBe(36);
    expect(STARTER_TASKS).toEqual([...buildBridgeTasks(), ...buildMerchantTasks(), ...STARTER_PUNCTUATION_TASKS]);
    expect(listTasks()).toEqual(ALL_TASKS);
    for (const skillId of ['M01', 'M04', 'E06'] as const) {
      expect(STARTER_TASKS.filter(task => task.skillId === skillId)).toHaveLength(12);
      expect(STARTER_TASKS.filter(task => task.skillId === skillId && task.band === 'support')).toHaveLength(12);
    }
    expect(getTask('unknown')).toBeUndefined();
    for (const manifest of [STARTER_MATHS_MANIFEST, STARTER_PUNCTUATION_MANIFEST]) {
      for (const id of [...manifest.taskIds, ...manifest.retainedTaskIds]) expect(getTask(id)).toBeDefined();
    }
    for (const task of STARTER_TASKS) {
      expect(task.review.status).toBe('approved'); expect(task.hints).toHaveLength(2);
      expect(task.workedSupport.text.length).toBeGreaterThan(0); expect(task.curriculum.sourceUrl.startsWith('https://www.gov.uk/')).toBe(true);
      expect(Object.isFrozen(task)).toBe(true); expect(Object.isFrozen(task.hints)).toBe(true);
    }
    expect(clone(STARTER_TASKS)).toEqual(STARTER_TASKS);
  });
  it('rejects duplicate IDs, empty/sparse banks, mismatched descriptors and unreviewed help', () => {
    expect(validateCatalogue([bridge, bridge]).map(issue => issue.code)).toContain('duplicate-canonical');
    expect(validateCatalogue([]).map(issue => issue.code)).toContain('empty-catalogue');
    expect(validateCatalogue(Array(1)).map(issue => issue.code)).toContain('malformed-task');
    expect(validateCatalogue([{ ...bridge, descriptor: { ...bridge.descriptor, parameters: { target: 13 } } }]).length).toBeGreaterThan(0);
    expect(validateCatalogue([{ ...bridge, workedSupport: { ...bridge.workedSupport, text: 'Use 99 metres.' } }]).map(issue => issue.code)).toContain('reviewed-content-mismatch');
  });
});

describe('nine released M1 quest bindings', () => {
  it('pins all nine rows, singleton anchors, other-eleven transfers and all-twelve revisits', () => {
    expect(QUEST_ACTIVITY_BINDINGS.map(row => row.bindingId)).toEqual(['q1-story-m01', 'q1-transfer-m01', 'q1-revisit-m01', 'q2-story-e06', 'q2-transfer-e06', 'q2-revisit-e06', 'q3-story-m04', 'q3-transfer-m04', 'q3-revisit-m04']);
    expect(validateBindings(QUEST_ACTIVITY_BINDINGS, STARTER_TASKS, questIds)).toEqual([]);
    expect(QUESTS.filter(quest => quest.milestone === 'M1').map(quest => [quest.id, quest.requiresAll])).toEqual([['Q1', []], ['Q2', ['Q1']], ['Q3', ['Q2']]]);
    const expectedAnchors = [bridge.canonicalQuestionId, 'lif.english.punctuation.r1.spellbook-anchor', merchant.canonicalQuestionId];
    for (let index = 0; index < 3; index++) {
      const [story, transfer, revisit] = QUEST_ACTIVITY_BINDINGS.slice(index * 3, index * 3 + 3);
      expect(story.taskIds).toEqual([expectedAnchors[index]]); expect(story.availability).toBe('M1');
      expect(transfer.taskIds).toHaveLength(11); expect(transfer.taskIds).not.toContain(story.taskIds[0]);
      expect(transfer.sourceBindingId).toBe(story.bindingId); expect(revisit.taskIds).toHaveLength(12);
      expect(revisit.taskIds).toEqual(STARTER_TASKS.filter(task => task.skillId === story.skillId).map(task => task.canonicalQuestionId));
      expect(Object.isFrozen(story)).toBe(true); expect(Object.isFrozen(transfer.taskIds)).toBe(true);
    }
  });
  it.each([
    ['duplicate', (rows: QuestActivityBinding[]) => [...rows, rows[0]]],
    ['missing source', (rows: QuestActivityBinding[]) => rows.filter(row => row.bindingId !== 'q1-story-m01')],
    ['cyclic source', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-transfer-m01' ? { ...row, sourceBindingId: 'q1-transfer-m01' } : row)],
    ['wrong quest', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-transfer-m01' ? { ...row, questId: 'Q2' } : row)],
    ['unknown quest', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-story-m01' ? { ...row, questId: 'Q99' } : row)],
    ['role changed', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-story-m01' ? { ...row, role: 'revisit' as const } : row)],
    ['source included', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-transfer-m01' ? { ...row, taskIds: [...row.taskIds, bridge.canonicalQuestionId] } : row)],
    ['wrong primary skill', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-story-m01' ? { ...row, skillId: 'M04' as const } : row)],
    ['unknown task', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-story-m01' ? { ...row, taskIds: ['unknown'] } : row)],
    ['wrong mechanic', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q3-story-m04' ? { ...row, mechanic: 'drag' as const } : row)],
    ['multiple M1 anchors', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-story-m01' ? { ...row, taskIds: [bridge.canonicalQuestionId, bridgePool[0].canonicalQuestionId] } : row)],
    ['duplicate task', (rows: QuestActivityBinding[]) => rows.map(row => row.bindingId === 'q1-transfer-m01' ? { ...row, taskIds: [row.taskIds[0], row.taskIds[0]] } : row)],
    ['empty required set', (rows: QuestActivityBinding[]) => rows.filter(row => row.role !== 'story')],
    ['retrospective M2 requirement', (rows: QuestActivityBinding[]) => [...rows, { ...rows[0], bindingId: 'new-required', availability: 'M2' as const }]],
  ] as const)('fails closed for %s', (_name, mutate) => {
    expect(validateBindings(mutate(clone(QUEST_ACTIVITY_BINDINGS) as QuestActivityBinding[]), STARTER_TASKS, questIds).length).toBeGreaterThan(0);
  });
  it('never completes an empty set, optional work or missing required binding', () => {
    expect(getRequiredBindingIds(QUEST_ACTIVITY_BINDINGS, 'Q1', 'M1')).toEqual(['q1-story-m01']);
    const base = { bindings: QUEST_ACTIVITY_BINDINGS, questId: 'Q1', milestone: 'M1' as const };
    expect(areRequiredBindingsComplete({ ...base, completedStoryBindingIds: ['q1-transfer-m01', 'q1-revisit-m01'] })).toBe(false);
    expect(areRequiredBindingsComplete({ ...base, completedStoryBindingIds: ['q1-story-m01'] })).toBe(true);
    expect(areRequiredBindingsComplete({ ...base, bindings: [], completedStoryBindingIds: ['q1-story-m01'] })).toBe(false);
    expect(areRequiredBindingsComplete({ ...base, questId: 'Q4', completedStoryBindingIds: [] })).toBe(false);
    const m2: QuestActivityBinding = { ...QUEST_ACTIVITY_BINDINGS[0], questId: 'Q4', bindingId: 'm2-required', availability: 'M2', taskIds: [bridgePool[0].canonicalQuestionId, bridgePool[1].canonicalQuestionId] };
    const second = { ...m2, bindingId: 'm2-required-second' };
    const future = [...QUEST_ACTIVITY_BINDINGS, m2, second];
    expect(getRequiredBindingIds(future, 'Q1', 'M2')).toEqual(['q1-story-m01']);
    expect(getRequiredBindingIds(future, 'Q4', 'M1')).toEqual([]);
    expect(getRequiredBindingIds(future, 'Q4', 'M2')).toEqual(['m2-required', 'm2-required-second']);
    expect(areRequiredBindingsComplete({ bindings: future, questId: 'Q4', milestone: 'M2', completedStoryBindingIds: ['m2-required'] })).toBe(false);
    expect(areRequiredBindingsComplete({ bindings: future, questId: 'Q4', milestone: 'M2', completedStoryBindingIds: ['m2-required', 'm2-required-second'] })).toBe(true);
  });
});

describe('actual catalogue → resolver → selector → evaluator/evidence handoff', () => {
  it.each(['Q1', 'Q2', 'Q3'])('resolves fresh required %s to its actual fixed anchor and story provenance', questId => {
    const result = selectNextActivity(request({ kind: 'quest', questId }));
    const binding = QUEST_ACTIVITY_BINDINGS.find(row => row.questId === questId && row.role === 'story')!;
    expect(result).toMatchObject({ status: 'selected', canonicalQuestionId: binding.taskIds[0], reason: 'story-anchor', rewardCandidate: 'first-encounter', bindingProvenance: { bindingId: binding.bindingId, questId, role: 'story' } });
  });
  it.each(['q1-transfer-m01', 'q2-transfer-e06', 'q3-transfer-m04'])('M1-TRANSFER: %s survives source encounter compaction', bindingId => {
    const row = QUEST_ACTIVITY_BINDINGS.find(binding => binding.bindingId === bindingId)!;
    const source = QUEST_ACTIVITY_BINDINGS.find(binding => binding.bindingId === row.sourceBindingId)!;
    const input = request({ kind: 'optional-transfer', bindingId }, { canonicalHistory: [] }, [source.bindingId]);
    expect(input.intent.previousCanonicalQuestionId).toBe(source.taskIds[0]);
    const result = selectNextActivity(input);
    expect(result).toMatchObject({ status: 'selected', reason: 'transfer', bindingProvenance: { bindingId, role: 'optional-transfer', questId: row.questId } });
    if (result.status !== 'selected') throw new Error('Expected transfer');
    expect(row.taskIds).toContain(result.canonicalQuestionId); expect(result.canonicalQuestionId).not.toBe(source.taskIds[0]);
    const expected = row.questId === 'Q1' ? { id: 'lif.math.bridge.r1.total-10', response: { kind: 'bridge', planks: [5, 5] } }
      : row.questId === 'Q2' ? { id: STARTER_TASKS.find(task => task.descriptor.authoredKey === 'spellbook-01')!.canonicalQuestionId, response: { kind: 'punctuation', slots: { record: '.' } } }
        : { id: 'lif.math.merchant.r1.mult-2.pears-1', response: { kind: 'merchant', apples: 2, pears: 1 } };
    expect(result.canonicalQuestionId).toBe(expected.id);
    expect(evaluateResponse(getTask(result.canonicalQuestionId)!, expected.response)).toMatchObject({ status: 'judged', correct: true });
    expect(input.canonicalHistory).toEqual([]); expect(input.activeEncounter).toBeNull();
    expect(areRequiredBindingsComplete({ bindings: QUEST_ACTIVITY_BINDINGS, questId: row.questId, milestone: 'M1', completedStoryBindingIds: [bindingId] })).toBe(false);
  });
  it('rejects explicit role/quest mismatch and transfer before source success', () => {
    const resolve = (route: LearningRouteIntent) => resolveBindingIntent({ route, milestone: 'M1', bindings: QUEST_ACTIVITY_BINDINGS, catalogue: STARTER_TASKS, accessibleQuestIds: ['Q1', 'Q2', 'Q3'], completedStoryBindingIds: [] });
    expect(resolve({ kind: 'quest', questId: 'Q1', bindingId: 'q1-transfer-m01' })).toEqual({ status: 'unavailable', reason: 'route-mismatch' });
    expect(resolve({ kind: 'quest', questId: 'Q2', bindingId: 'q1-story-m01' })).toEqual({ status: 'unavailable', reason: 'route-mismatch' });
    expect(resolve({ kind: 'optional-transfer', bindingId: 'q1-transfer-m01' })).toEqual({ status: 'unavailable', reason: 'source-incomplete' });
    expect(resolve({ kind: 'quest', questId: 'Q1', bindingId: 'unknown' })).toEqual({ status: 'unavailable', reason: 'unknown-binding' });
  });
  it('offers fresh, struggling, ready-without-harder-band and exhausted real starter practice honestly', () => {
    const route: LearningRouteIntent = { kind: 'practice', skillId: 'M01', mode: 'suggested' };
    const fresh = selectNextActivity(request(route));
    expect(fresh).toMatchObject({ status: 'selected', band: 'support', familiar: false, unavailableSuggestion: { kind: 'unavailable-band', band: 'core' } });
    let evidence: SkillEvidence = {};
    for (let i = 0; i < 2; i++) evidence = applyLearningObservation(evidence, observation(bridgePool[i], `helped-${i}`, { assistance: hinted }));
    expect(selectNextActivity(request(route, { evidence }))).toMatchObject({ status: 'selected', band: 'support', unavailableSuggestion: { band: 'support' } });
    evidence = {};
    for (let i = 0; i < 3; i++) evidence = applyLearningObservation(evidence, observation(bridgePool[i], `ready-${i}`));
    expect(selectNextActivity(request(route, { evidence, suppressDueReviewForVisit: true }))).toMatchObject({ status: 'selected', band: 'support', unavailableSuggestion: { band: 'core' } });
    const exhausted = selectNextActivity(request(route, { evidence, suppressDueReviewForVisit: true,
      canonicalHistory: bridgePool.map(task => history(task, { everChecked: true, previousSuccessWeek: '2026-10-19', previousSuccessLocalDate: '2026-10-23', checkedCompetitionWeekIds: ['2026-10-19'] })) }));
    expect(exhausted).toMatchObject({ status: 'selected', reason: 'repeat-practice', familiar: true, rewardCandidate: 'none' });
    expect(selectNextActivity(request({ kind: 'revisit', bindingId: 'q1-revisit-m01' }))).toMatchObject({ status: 'selected', bindingProvenance: { role: 'revisit' } });
  });
  it.each([0, 1])('M1-HELP-RESUME preserves help with %s prior Checks and provenance when required work is requested', validChecks => {
    const encounter = { ...clone(pending()), validChecks, firstCheckCorrect: validChecks ? false : null }; const before = JSON.stringify(encounter);
    const result = selectNextActivity(request({ kind: 'quest', questId: 'Q1' }, { canonicalHistory: [history(bridge, { pendingEncounter: encounter, everChecked: true, assistance: hinted })] }));
    expect(result).toMatchObject({ status: 'selected', canonicalQuestionId: bridge.canonicalQuestionId, resumeEncounterId: 'saved-bridge', reason: 'adaptive-practice', rewardCandidate: 'none', bindingProvenance: encounter.bindingProvenance });
    expect(JSON.stringify(encounter)).toBe(before); expect(encounter.assistance.answerHintUsed).toBe(true); expect(encounter.validChecks).toBe(validChecks);
  });
  it('M1-FINISH-RESUME distinguishes Check-bearing finish from navigation and supported cumulative retry', () => {
    const wrongResult = evaluateResponse(bridge, { kind: 'bridge', planks: [1] });
    if (wrongResult.status !== 'judged') throw new Error('Expected wrong Check');
    const wrong = observation(bridge, 'finish-A', { correct: false, firstCheckCorrect: false, episodeCompletion: null, assistance: hinted, issues: wrongResult.feedback.issues });
    let evidence = applyLearningObservation({}, wrong);
    expect(evidence.M01?.bands.support).toMatchObject({ validChecks: 1, completedEpisodes: 0 });
    const finish: LearningObservation = { kind: 'finished-unsuccessfully', eventId: 'finish-action', profileId: 'child', encounterId: 'finish-A', learningEpisodeOrdinal: 1,
      canonicalQuestionId: bridge.canonicalQuestionId, skillId: bridge.skillId, objectiveId: bridge.objectiveId, band: bridge.band, selectionReason: 'adaptive-practice',
      localDate: '2026-10-23', competitionWeekId: '2026-10-19', familiar: false, reviewReference: null, assistance: hinted, episodeCompletion: 'deliberate-unsuccessful' };
    evidence = applyLearningObservation(evidence, finish);
    expect(evidence.M01?.bands.support).toMatchObject({ validChecks: 1, completedEpisodes: 1 });
    const resumed = { ...pending(), encounterId: 'finish-A', learningEpisodeOrdinal: 2, episodeStatus: 'completed-unsuccessful' as const };
    expect(selectNextActivity(request({ kind: 'quest', questId: 'Q1' }, { activeEncounter: resumed }))).toMatchObject({ status: 'selected', resumeEncounterId: 'finish-A', bindingProvenance: resumed.bindingProvenance, rewardCandidate: 'none' });
    expect(evaluateResponse(bridge, { kind: 'bridge', planks: [6, 6] })).toMatchObject({ status: 'judged', correct: true });
    evidence = applyLearningObservation(evidence, observation(bridge, 'finish-A', { learningEpisodeOrdinal: 2, episodeCheckIndex: 1, encounterCheckIndex: 2, firstCheckCorrect: false, assistance: hinted }));
    expect(summarizeLearning(evidence, STARTER_TASKS, '2026-10-23').find(row => row.skillId === 'M01')).toMatchObject({ validChecks: 2, completedEpisodes: 2, independentSuccesses: 0, supportedSuccesses: 1, retrySuccesses: 1 });
  });
  it('M1-DUE-REVIEW retains canonical identity, same/later-week candidate and skippable civil dates', () => {
    const chosen = bridgePool.find(task => task.canonicalQuestionId.endsWith('total-10'))!;
    let evidence = applyLearningObservation({}, observation(chosen, 'initial'));
    expect(evidence.M01?.bands.support.reviewDueLocalDate).toBe('2026-10-26');
    const previous = bridgePool.map(task => history(task, { everChecked: true, previousSuccessLocalDate: '2026-10-23', previousSuccessWeek: '2026-10-19' }));
    const calendar = { todayDate: '2026-10-26', competitionWeekId: '2026-10-26', reviewIn3DaysDate: '2026-10-29', reviewIn7DaysDate: '2026-11-02' };
    const route: LearningRouteIntent = { kind: 'practice', skillId: 'M01', mode: 'suggested' };
    const result = selectNextActivity(request(route, { evidence, canonicalHistory: previous, calendar }));
    expect(result).toMatchObject({ status: 'selected', reason: 'due-review', canonicalQuestionId: chosen.canonicalQuestionId, familiar: true, rewardCandidate: 'later-week-due-review', bindingProvenance: null });
    const sameWeekEvidence = applyLearningObservation({}, observation(chosen, 'same-week', { localDate: '2026-10-19' }));
    expect(sameWeekEvidence.M01?.bands.support.reviewDueLocalDate).toBe('2026-10-22');
    expect(selectNextActivity(request(route, { evidence: sameWeekEvidence, canonicalHistory: previous.map(row => ({ ...row, previousSuccessLocalDate: '2026-10-19' })) }))).toMatchObject({ status: 'selected', reason: 'due-review', rewardCandidate: 'none' });
    const before = JSON.stringify(evidence);
    expect(selectNextActivity(request(route, { evidence, canonicalHistory: previous, calendar, suppressDueReviewForVisit: true }))).toMatchObject({ status: 'selected', reason: 'repeat-practice', rewardCandidate: 'none' });
    expect(JSON.stringify(evidence)).toBe(before);
    if (result.status !== 'selected') throw new Error('Expected review');
    evidence = applyLearningObservation(evidence, observation(chosen, 'review', { localDate: '2026-10-26', competitionWeekId: '2026-10-26', familiar: true, selectionReason: 'due-review', reviewReference: result.reviewReference }));
    expect(evidence.M01?.bands.support.reviewDueLocalDate).toBe('2026-11-02');
    expect(summarizeLearning(evidence, STARTER_TASKS, '2026-10-26').find(row => row.skillId === 'M01')?.latestReview).toMatchObject({ outcome: 'independent-success', familiar: true });
  });
});
