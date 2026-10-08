import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SKILLS, PREREQUISITE_SUGGESTIONS } from '../../src/content/skills';
import type {
  ActivityResponse, BindingResolution, EvaluationResult, FeedbackIssue, LearningObservation, LearningRouteIntent,
  QuestActivityBinding, SelectionRequest, SelectionResult, TaskDefinition, TaskFamilyManifest, TaskStimulus,
} from '../../src/learning/contracts';

const roundTrip = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const record = (x: unknown): x is Record<string, unknown> => x !== null && typeof x === 'object' && !Array.isArray(x);
const integer = (x: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): x is number =>
  typeof x === 'number' && Number.isSafeInteger(x) && x >= min && x <= max;

/** Bounded fixture probes only. Production structural/domain validators are
 * deliberately deferred to the owning families; these do not grade answers. */
function responseFixtureIsValid(value: unknown): boolean {
  if (!record(value)) return false;
  const mapping = (x: unknown, keys: readonly string[], allowed: readonly string[]) =>
    record(x) && Object.keys(x).every(key => keys.includes(key))
    && Object.values(x).every(v => v === null || (typeof v === 'string' && allowed.includes(v)));
  switch (value.kind) {
    case 'bridge': return Array.isArray(value.planks) && value.planks.length <= 6 && value.planks.every(v => integer(v, 1, 6));
    case 'merchant': return (value.apples === null || integer(value.apples, 0, 24))
      && (value.pears === null || integer(value.pears, 0, 24))
      && Number(value.apples) + Number(value.pears) <= 24;
    case 'punctuation': return mapping(value.slots, ['question', 'discovery'], ['.', '?', '!']);
    case 'choice': return mapping(value.choices, ['answer'], ['a', 'b']);
    case 'sequence': return Array.isArray(value.orderedIds) && value.orderedIds.length <= 2
      && new Set(value.orderedIds).size === value.orderedIds.length && value.orderedIds.every(v => ['a', 'b'].includes(v));
    case 'sorting': return mapping(value.groups, ['item'], ['group']);
    case 'matching': return mapping(value.pairs, ['item'], ['target']);
    case 'quantity': return record(value.values) && Object.keys(value.values).every(k => k === 'amount')
      && Object.values(value.values).every(v => v === null || (record(v) && integer(v.numerator, 0, 10000)
        && integer(v.denominator, 1, 100) && v.unit === 'GBP'));
    case 'clock': return value.minutes === null || integer(value.minutes, 0, 1439);
    default: return false;
  }
}
const responseCases: readonly Readonly<{ good: ActivityResponse; bad: unknown }>[] = [
  { good: { kind: 'bridge', planks: [6, 6] }, bad: { kind: 'bridge', planks: [7] } },
  { good: { kind: 'merchant', apples: 6, pears: 3 }, bad: { kind: 'merchant', apples: '6', pears: 3 } },
  { good: { kind: 'punctuation', slots: { question: '?', discovery: '!' } }, bad: { kind: 'punctuation', slots: { unknown: '?' } } },
  { good: { kind: 'choice', choices: { answer: 'a' } }, bad: { kind: 'choice', choices: { answer: 'unlisted' } } },
  { good: { kind: 'sequence', orderedIds: ['a', 'b'] }, bad: { kind: 'sequence', orderedIds: ['a', 'a'] } },
  { good: { kind: 'sorting', groups: { item: 'group' } }, bad: { kind: 'sorting', groups: { item: 'unlisted' } } },
  { good: { kind: 'matching', pairs: { item: 'target' } }, bad: { kind: 'matching', pairs: { unlisted: 'target' } } },
  { good: { kind: 'quantity', values: { amount: { numerator: 125, denominator: 100, unit: 'GBP' } } }, bad: { kind: 'quantity', values: { amount: { numerator: 1, denominator: 0, unit: 'GBP' } } } },
  { good: { kind: 'clock', minutes: 780 }, bad: { kind: 'clock', minutes: 1440 } },
];

const stimuli: readonly TaskStimulus[] = [
  { kind: 'array', groups: 2, itemsPerGroup: 3, labels: [], accessibleDescription: '2 groups with 3 objects in each group.' },
  { kind: 'fraction', numerator: 3, denominator: 4, wholeCount: 1, labels: [], accessibleDescription: '1 whole divided into 4 equal parts; 3 parts are shaded.' },
  { kind: 'clock', minutes: 180, dayOffset: 0, display: '12-hour', face: 'analogue', labels: ['AM'], accessibleDescription: 'AM: minute hand at 12; hour hand at 3.' },
  { kind: 'diagram', points: [{ id: 'a', x: 10, y: 10, label: 'A' }, { id: 'b', x: 50, y: 10, label: 'B' }], edges: [{ id: 'ab', from: 'a', to: 'b', label: '4 cm' }], closed: false, labels: [], accessibleDescription: 'A straight path from A to B labelled 4 cm.' },
  { kind: 'data', display: 'bar', xLabel: 'Day', yLabel: 'Books', unit: 'books', scaleStep: 1, rows: [{ id: 'mon', label: 'Monday', value: 2 }, { id: 'tue', label: 'Tuesday', value: 3 }], labels: [], accessibleDescription: 'Books: Monday 2; Tuesday 3. Axis starts at zero; tick step 1.' },
];
function stimulusFixtureIsValid(value: unknown): boolean {
  if (!record(value) || !Array.isArray(value.labels) || !value.labels.every(v => typeof v === 'string')
    || typeof value.accessibleDescription !== 'string' || !value.accessibleDescription.trim()) return false;
  switch (value.kind) {
    case 'array': return integer(value.groups, 1, 12) && integer(value.itemsPerGroup, 1, 12);
    case 'fraction': return integer(value.denominator, 1) && integer(value.wholeCount, 1)
      && integer(value.numerator, 0, value.denominator * value.wholeCount);
    case 'clock': return integer(value.minutes, 0, 1439) && [0, 1].includes(Number(value.dayOffset))
      && ['12-hour', '24-hour'].includes(String(value.display)) && ['analogue', 'digital'].includes(String(value.face))
      && !(value.face === 'analogue' && value.display === '24-hour');
    case 'diagram': {
      if (!Array.isArray(value.points) || !Array.isArray(value.edges) || typeof value.closed !== 'boolean') return false;
      const ids = value.points.map(p => record(p) ? p.id : null);
      const edgeIds = value.edges.map(e => record(e) ? e.id : null);
      return new Set(ids).size === ids.length && new Set(edgeIds).size === edgeIds.length
        && value.points.every(p => record(p) && typeof p.id === 'string' && typeof p.x === 'number'
          && Number.isFinite(p.x) && p.x >= 0 && p.x <= 100 && typeof p.y === 'number' && Number.isFinite(p.y) && p.y >= 0 && p.y <= 100)
        && value.edges.every(e => record(e) && typeof e.id === 'string' && ids.includes(e.from) && ids.includes(e.to));
    }
    case 'data': return ['table', 'bar', 'line'].includes(String(value.display))
      && [value.xLabel, value.yLabel, value.unit].every(v => typeof v === 'string') && integer(value.scaleStep, 1)
      && Array.isArray(value.rows) && value.rows.length >= 1 && value.rows.length <= 6
      && new Set(value.rows.map(r => record(r) ? r.id : null)).size === value.rows.length
      && value.rows.every(r => record(r) && typeof r.id === 'string' && typeof r.label === 'string' && integer(r.value, 0, 100));
    default: return false;
  }
}

const task: TaskDefinition = {
  canonicalQuestionId: 'lif.math.bridge.r1.total-12', descriptor: { familyId: 'math.bridge', equivalenceVersion: 'r1', authoredKey: null, parameters: { target: 12 } },
  contentRevision: 'fixture-1', skillId: 'M01', objectiveId: 'M01-addition-subtraction', band: 'support', contextualSkillIds: ['M07'],
  curriculum: SKILLS[0].curriculum[0], demandRationale: 'Contract fixture only.', instructionText: 'Build a bridge.', assessedText: 'Span 12 metres.',
  responseSpec: { kind: 'bridge', plankLengths: [1, 2, 3, 4, 5, 6], cardinality: { min: 1, max: 6 } }, answerRule: { kind: 'bridge-total', target: 12 },
  explanation: 'Combine lengths to make the total.', hints: [{ id: 'h1', text: 'Look at the span.' }, { id: 'h2', text: 'Add the lengths.' }], workedSupport: { id: 'worked', text: 'Two 6 m planks span 12 m.' },
  narration: { neutralText: 'Choose planks, then Check.', assessedTextMayBeSpokenBeforeCheck: true },
  review: { status: 'withheld', reviewer: 'Codex WP03-01A', rationale: 'Construction fixture, not reviewed bank content.', evidenceRef: 'tests/learning/contracts.test.ts' },
};
const assistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' } as const;
const observationFacts = { eventId: 'submission-1', profileId: 'profile-1', encounterId: 'encounter-1', learningEpisodeOrdinal: 1,
  canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
  selectionReason: 'story-anchor', localDate: '2026-10-08', competitionWeekId: '2026-10-05', familiar: false, reviewReference: null, assistance } as const;
const binding: QuestActivityBinding = { bindingId: 'q1-bridge', questId: 'Q1', availability: 'M1', role: 'story', skillId: 'M01', taskIds: [task.canonicalQuestionId], mechanic: 'drag', responseKind: 'bridge', sourceBindingId: null };
const provenance = { bindingId: binding.bindingId, questId: binding.questId, role: binding.role };
const firstSelection: SelectionResult = { status: 'selected', canonicalQuestionId: task.canonicalQuestionId, band: task.band, reason: 'story-anchor', bindingProvenance: provenance, familiar: false, reviewReference: null, resumeEncounterId: null, rewardCandidate: 'first-encounter', unavailableSuggestion: null };
const laterReview: SelectionResult = { ...firstSelection, reason: 'due-review', bindingProvenance: null, familiar: true, reviewReference: { canonicalQuestionId: task.canonicalQuestionId, dueLocalDate: '2026-10-11', previousSuccessWeek: '2026-10-05' }, rewardCandidate: 'later-week-due-review' };

describe('readonly JSON learning contracts and bounded construction fixtures', () => {
  it.each(responseCases)('serializes $good.kind and rejects its structural counterexample', ({ good, bad }) => {
    expect(roundTrip(good)).toEqual(good);
    expect(responseFixtureIsValid(good)).toBe(true);
    expect(responseFixtureIsValid(bad)).toBe(false);
  });
  it('permits semantic empty drafts without counting or scoring them', () => {
    const drafts: readonly ActivityResponse[] = [{ kind: 'bridge', planks: [] }, { kind: 'merchant', apples: null, pears: null },
      { kind: 'punctuation', slots: { question: null } }, { kind: 'choice', choices: {} }, { kind: 'sequence', orderedIds: [] },
      { kind: 'sorting', groups: {} }, { kind: 'matching', pairs: {} }, { kind: 'quantity', values: { amount: null } }, { kind: 'clock', minutes: null }];
    expect(drafts.every(responseFixtureIsValid)).toBe(true);
    expect(responseFixtureIsValid({ kind: 'coordinates', x: 10, y: 20 })).toBe(false);
  });
  it('keeps every result tag serializable and nonjudged outcomes unscored', () => {
    const results: readonly EvaluationResult[] = [
      { status: 'incomplete', missing: ['planks'] }, { status: 'invalid-response', reason: 'out-of-range' },
      { status: 'unavailable-content', issues: [{ canonicalQuestionId: task.canonicalQuestionId, field: 'descriptor', code: 'unreachable', detail: 'Fixture only.' }] },
      { status: 'judged', correct: true, canonicalQuestionId: task.canonicalQuestionId, skillId: 'M01', objectiveId: task.objectiveId, band: 'support', feedback: { explanation: '12 metres.', issues: [] } },
    ];
    const valid = (v: unknown) => record(v) && (v.status === 'judged'
      ? typeof v.correct === 'boolean' && typeof v.canonicalQuestionId === 'string' && typeof v.skillId === 'string'
        && typeof v.objectiveId === 'string' && ['support', 'core', 'stretch'].includes(String(v.band)) && record(v.feedback)
      : !('correct' in v) && !('points' in v) && (v.status === 'incomplete' ? Array.isArray(v.missing)
        : v.status === 'invalid-response' ? typeof v.reason === 'string'
        : v.status === 'unavailable-content' && Array.isArray(v.issues)));
    const bad = [{ status: 'incomplete', missing: 'planks' }, { status: 'invalid-response', reason: 1 },
      { status: 'unavailable-content', issues: null }, { status: 'judged', correct: true }];
    results.forEach((r, i) => { expect(roundTrip(r)).toEqual(r); expect(valid(r)).toBe(true); expect(valid(bad[i])).toBe(false); });
  });
  it.each(stimuli)('serializes the $kind source stimulus', stimulus => {
    expect(roundTrip(stimulus)).toEqual(stimulus);
    expect(stimulusFixtureIsValid(stimulus)).toBe(true);
  });
  it('pins source-data alternatives without computed answers', () => {
    expect(stimuli.map(s => s.accessibleDescription)).toEqual([
      '2 groups with 3 objects in each group.', '1 whole divided into 4 equal parts; 3 parts are shaded.',
      'AM: minute hand at 12; hour hand at 3.', 'A straight path from A to B labelled 4 cm.',
      'Books: Monday 2; Tuesday 3. Axis starts at zero; tick step 1.',
    ]);
    expect(roundTrip(task)).not.toHaveProperty('stimulus');
    expect(roundTrip({ ...task, stimulus: null }).stimulus).toBeNull();
  });
  it.each([
    { ...stimuli[0], groups: 0 }, { ...stimuli[1], denominator: 0 },
    { ...stimuli[2], display: '24-hour' },
    { ...stimuli[3], edges: [{ id: 'ab', from: 'a', to: 'missing' }] },
    { ...stimuli[4], scaleStep: 0 }, { ...stimuli[4], scaleStep: 1.5 },
    { ...stimuli[0], kind: 'canvas' }, { ...stimuli[0], accessibleDescription: '' },
  ])('rejects fixture discriminant, bounds or reference error %s', stimulus => {
    expect(stimulusFixtureIsValid(stimulus)).toBe(false);
  });
  it('constructs state, experience and reward consumer projections without their modules', () => {
    const route: LearningRouteIntent = { kind: 'quest', questId: 'Q1', bindingId: binding.bindingId };
    const resolution: BindingResolution = { status: 'resolved', intent: { kind: 'story-anchor', skillId: 'M01', binding, provenance, previousCanonicalQuestionId: null } };
    const request: SelectionRequest = { catalogue: [], intent: resolution.intent, evidence: {}, activeEncounter: null, canonicalHistory: [], suppressDueReviewForVisit: false,
      calendar: { todayDate: '2026-10-08', competitionWeekId: '2026-10-05', reviewIn3DaysDate: '2026-10-11', reviewIn7DaysDate: '2026-10-15' } };
    const manifest: TaskFamilyManifest = { moduleId: 'fixture', familyIds: ['math.bridge'], taskIds: [], retainedTaskIds: [task.canonicalQuestionId], domainDescription: 'Fixture only', reviewEvidenceRef: 'tests/learning/contracts.test.ts', cases: [{ caseId: 'bridge', canonicalQuestionId: task.canonicalQuestionId, response: responseCases[0].good, expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] }] };
    expect(roundTrip({ route, resolution, request, task, manifest })).toEqual({ route, resolution, request, task, manifest });
    expect(firstSelection.canonicalQuestionId).toBe(laterReview.canonicalQuestionId);
    const opportunities = [{ opportunityId: 'opportunity-1', encounterId: 'encounter-1', selection: firstSelection }, { opportunityId: 'opportunity-2', encounterId: 'encounter-2', selection: laterReview }];
    expect(roundTrip(opportunities)[1].selection.rewardCandidate).toBe('later-week-due-review');
    expect(opportunities[0].opportunityId).not.toBe(opportunities[1].opportunityId);
    expect(new Set([task.canonicalQuestionId, 'encounter-1', 'opportunity-1', 'submission-1']).size).toBe(4);
    expect(request.catalogue).toHaveLength(0); // Registry declarations cannot supply content.
  });
  it('distinguishes open wrong Checks, Check-bearing finish and cumulative retry success', () => {
    const issue: FeedbackIssue = { code: 'sum-under', slotId: null, constraintId: 'target', observed: '11 metres', explanation: 'The span is 12 metres; the chosen lengths total 11 metres.' };
    const wrong: LearningObservation = { ...observationFacts, kind: 'check', submissionId: 'submission-1', episodeCheckIndex: 1, encounterCheckIndex: 1, firstCheckCorrect: false, correct: false, issues: [issue], episodeCompletion: null };
    const finish: LearningObservation = { ...observationFacts, eventId: 'action-finish', assistance: { ...assistance, answerHintUsed: true }, kind: 'finished-unsuccessfully', episodeCompletion: 'deliberate-unsuccessful' };
    const retry: LearningObservation = { ...observationFacts, eventId: 'submission-2', learningEpisodeOrdinal: 2, assistance: finish.assistance, kind: 'check', submissionId: 'submission-2', episodeCheckIndex: 1, encounterCheckIndex: 2, firstCheckCorrect: false, correct: true, issues: [], episodeCompletion: 'success' };
    expect(roundTrip([wrong, finish, retry])).toEqual([wrong, finish, retry]);
    expect(wrong.episodeCompletion).toBeNull();
    expect(finish).not.toHaveProperty('submissionId');
    expect(finish).not.toHaveProperty('encounterCheckIndex');
    expect(retry.firstCheckCorrect).toBe(false);
    expect(retry.assistance.answerHintUsed).toBe(true);
    // Static contract rejections; validators/commit semantics are downstream.
    // @ts-expect-error completion-only observations cannot recount Checks
    const invalidFinish: LearningObservation = { ...finish, encounterCheckIndex: 2 };
    // @ts-expect-error a wrong Check cannot claim successful completion
    const invalidCheck: LearningObservation = { ...wrong, episodeCompletion: 'success' };
    // @ts-expect-error unscored results cannot carry correctness
    const invalidResult: EvaluationResult = { status: 'incomplete', missing: [], correct: true };
    // @ts-expect-error a feedback issue must identify a slot or constraint
    const invalidIssue: FeedbackIssue = { code: 'wrong', slotId: null, constraintId: null, observed: 'x', explanation: 'x' };
    void [invalidFinish, invalidCheck, invalidResult, invalidIssue];
  });
  it('keeps listening, mixed assessment and answer help as separate facts', () => {
    const listening = { ...assistance, assessedTextReadAloud: true, evidenceMode: 'listening-supported' } as const;
    const mixed = { ...assistance, evidenceMode: 'mixed' } as const;
    const hint = { ...assistance, answerHintUsed: true };
    expect(roundTrip([assistance, listening, mixed, hint])).toEqual([assistance, listening, mixed, hint]);
    expect(listening.answerHintUsed).toBe(false);
    expect(mixed.workedSupportUsed).toBe(false);
    expect(hint.answerHintUsed).toBe(true);
  });
});

describe('selected curriculum registry and import directions', () => {
  it('has exactly 20 unique IDs, distinct objective mappings and staged availability', () => {
    expect(SKILLS.map(s => s.skillId)).toEqual(['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10']);
    expect(new Set(SKILLS.map(s => s.objectiveId)).size).toBe(20);
    expect(SKILLS.filter(s => s.availability === 'M1').map(s => s.skillId)).toEqual(['M01', 'M04', 'E06']);
    expect(SKILLS.find(s => s.skillId === 'M08')?.curriculum[1]).toEqual({
      sourceUrl: 'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study',
      section: 'Statistics: tables, including timetables', programmeBand: 'Year 5 (selected stretch)',
    });
    expect(roundTrip(SKILLS)).toEqual(SKILLS);
    SKILLS.forEach(s => { expect(s.demandRationale).not.toBe(''); expect(s.curriculum.every(c => c.sourceUrl.startsWith('https://www.gov.uk/') && c.section && c.programmeBand)).toBe(true); });
    expect(SKILLS.filter(s => s.skillId.startsWith('E')).every(s => s.curriculum.every(c => c.programmeBand.includes('Years 3–4') || c.programmeBand.includes('Years 5–6')))).toBe(true);
  });
  it('pins all eight suggested edges and proves an acyclic graph with known endpoints', () => {
    expect(PREREQUISITE_SUGGESTIONS.map(e => `${e.prerequisiteSkillId}->${e.skillId}`)).toEqual(['M02->M03', 'M02->M04', 'M03->M05', 'M06->M07', 'E04->E05', 'E06->E07', 'E08->E09', 'E08->E10']);
    const ids: readonly string[] = SKILLS.map(s => s.skillId);
    const visiting = new Set<string>(); const visited = new Set<string>();
    const visit = (id: string) => {
      expect(visiting.has(id)).toBe(false);
      if (visited.has(id)) return;
      visiting.add(id);
      PREREQUISITE_SUGGESTIONS.filter(e => e.prerequisiteSkillId === id).forEach(e => { expect(ids).toContain(e.skillId); visit(e.skillId); });
      visiting.delete(id); visited.add(id);
    };
    PREREQUISITE_SUGGESTIONS.forEach(e => expect(ids).toContain(e.prerequisiteSkillId));
    ids.forEach(visit);
    expect(visited.size).toBe(20);
  });
  it('keeps the three leaf modules independent of counterpart runtimes and browser globals', () => {
    for (const file of ['src/learning/contracts.ts', 'src/learning/identity.ts', 'src/content/skills.ts']) {
      const source = readFileSync(file, 'utf8');
      const imports = [...source.matchAll(/^import .* from ['"]([^'"]+)['"]/gm)].map(m => m[1]);
      expect(imports.every(path => path === './contracts' || path === '../learning/contracts')).toBe(true);
      expect(source).not.toMatch(/\b(?:window|document|indexedDB|localStorage|Date\.now)\b/);
    }
  });
});
