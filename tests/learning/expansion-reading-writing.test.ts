import { describe, expect, it } from 'vitest';
import type { ActivityResponse, LearningAssistance, LearningObservation, TaskDefinition } from '../../src/learning/contracts';
import type { CanonicalRewardTrack, RewardSelectionFacts } from '../../src/rewards/contracts';
import { READING_WRITING_BINDING_PROPOSALS, READING_WRITING_HANDOFF_CASES, READING_WRITING_MANIFEST, READING_WRITING_TASKS } from '../../src/content/expansion-english/reading-writing';
import { evaluateExpansionReadingWriting as evaluate, validateReadingWritingTask } from '../../src/learning/evaluators/expansion-reading-writing';
import { canonicalQuestionId } from '../../src/learning/identity';
import { applyLearningObservation } from '../../src/learning/evidence';
import { applyCheckRewards } from '../../src/rewards/scoring';

const get = (key: string) => READING_WRITING_TASKS.find(task => task.descriptor.authoredKey === key)!;
const chosen = (slot: string, id: string): ActivityResponse => ({ kind: 'choice', choices: { [slot]: id } });
const paired = (inference: string, clue: string): ActivityResponse => ({ kind: 'choice', choices: { inference, clue } });

// Separately authored textual-evidence and answer matrices. Neither reads
// answerRule, production dispositions, nor the manifest cases to find answers.
// Closed sets below disposition EVERY offered choice/pair, not one happy path.
const retrievalOracle = [
  ['bench-note', 'box', 'box beneath the bench', 'The shelf belongs to books; on top is not beneath.'],
  ['repair-kit', 'string-cloth', 'contains string and a cloth', 'Glue is stored separately.'],
  ['path-flag', 'blue', 'blue flag marks the drinking-water stop', 'Bottles go to water, not tools.'],
  ['wet-path', 'raised', 'Today the ground is wet', 'The wet-ground exception rules out low/either.'],
  ['lantern-card', 'off', 'Before opening the case, switch the lantern off', 'Wipe and on occur later.'],
  ['return-desk', 'tray', 'except maps with a torn edge', 'Rolled shape does not override the exception.'],
  ['seed-delivery', 'striped', 'beans in the striped packet', 'Plain holds peas and must stay behind.'],
  ['updated-route', 'west-desk', 'This update changes the gate only', 'Glass changes east to west; desk remains.'],
  ['archive-slip', 'white-k', 'an original on shelf K', 'Original implies white; M is a copy.'],
  ['bell-delivery', 'rack', 'damp parcels to the covered rack', 'After-bell damp rule applies; urgent affects collection order only.'],
] as const;
const inferenceOracle = [
  { key: 'wet-cloak', inference: 'rain', clues: ['paving'], evidence: ['Water dripped from her cloak', 'raindrops were striking the paving stones'], rejects: 'Basket and yard alone do not distinguish rain from other wetting; neither river nor washing is evidenced.' },
  { key: 'cold-wait', inference: 'cold', clues: ['warmth'], evidence: ['rubbed his hands for warmth'], rejects: 'Basket/path do not show physical temperature; hunger and sleepiness are not established.' },
  { key: 'tilting-cup', inference: 'fall', clues: ['sliding'], evidence: ['sliding towards the lowered edge'], rejects: 'Water/board alone give no movement; staying/uphill contradict the stated motion.' },
  { key: 'first-reading', inference: 'worried', clues: ['words', 'hands'], evidence: ['What if I forget the words?', 'Her hands trembled'], rejects: 'Curtain colour gives no feeling; boredom and anger have no support.' },
  { key: 'early-baker', inference: 'already', clues: ['loaves', 'tray'], evidence: ['Six warm loaves were cooling', 'another tray from the oven'], rejects: 'Sign colour gives no timing; completed bread does not establish all-night work and contradicts no bread.' },
  { key: 'quiet-repair', inference: 'sleep', clues: ['latch', 'door'], evidence: ['its rattle was muffled', 'closed the workroom door gently'], rejects: 'Toolbox colour does not show motive; no hiding or breaking is evidenced.' },
  { key: 'seed-tray', inference: 'window', clues: ['leaves'], evidence: ['Each new leaf had opened on the brighter side'], rejects: 'Date/watering do not support direction; no evidence of blue leaves or a certain halt.' },
  { key: 'sheltered-gauge', inference: 'doubt', clues: ['canopy', 'puddles', 'morning'], evidence: ['canopy covered the gauge', 'puddles filled the open path', 'not visited that path since morning'], rejects: 'All three clues limit the sweeping claim; none establishes intent to deceive or proves whole-garden dryness.' },
  { key: 'waiting-chair', inference: 'waiting', clues: ['cups', 'steps'], evidence: ['two cups beside the window, though only he sat there', 'he turned towards the door'], rejects: 'A missing name does not itself establish expectation; sister is invented and dislike conflicts with preparation.' },
  { key: 'muddy-threshold', inference: 'entry', clues: ['prints'], evidence: ['muddy bootprints ran from the open doorway'], rejects: 'Undisturbed shelf and common boot size do not establish entry themselves; theft and exact identity are unsupported.' },
];
const editOracle = [
  { key: 'clear-owner', accepted: ['tess'], evidence: 'Tess carried her own bag', rejects: 'Noor changes ownership; she leaves two referents.' },
  { key: 'past-account', accepted: ['past'], evidence: 'past-tense account of a finished journey', rejects: 'Present and future alternatives break the requested time consistency.' },
  { key: 'two-lanterns', accepted: ['brass-first', 'cracked-first'], evidence: 'A brass lantern was cracked', rejects: 'Wooden and both falsely attribute damage to the sound lantern.' },
  { key: 'uncertain-visitor', accepted: ['might', 'wonder'], evidence: 'He guessed it might be the courier', rejects: 'Must/knew and denial both invent certainty.' },
  { key: 'cause-and-contrast', accepted: ['although', 'but'], evidence: 'The room stayed draught-free and wet', rejects: 'Because and both alternatives falsely leave the room dry.' },
];
// Partial-order constraints are independently derived from the narrative. The
// evaluator instead uses explicit authored full orders. All permutations run.
const sequenceOracle = [
  { key: 'planted-seed', tiles: ['plant', 'water', 'sprout'], before: [['plant', 'water'], ['water', 'sprout']], validCount: 1, evidence: 'After that watering' },
  { key: 'found-note', tiles: ['find', 'read', 'return'], before: [['find', 'read'], ['read', 'return']], validCount: 1, evidence: 'Using the name she had just read' },
  { key: 'kite-rescue', tiles: ['spot', 'fetch', 'lift', 'return'], before: [['spot', 'fetch'], ['fetch', 'lift'], ['lift', 'return']], validCount: 1, evidence: 'Using the pole' },
  { key: 'picnic-preparation', tiles: ['open', 'fruit', 'cloth', 'close'], before: [['open', 'fruit'], ['open', 'cloth'], ['fruit', 'close'], ['cloth', 'close']], validCount: 2, evidence: 'Both happen after the basket is opened and before it is shut' },
  { key: 'puppet-show', tiles: ['frame', 'curtain', 'needle', 'mend', 'show'], before: [['frame', 'curtain'], ['needle', 'mend'], ['curtain', 'show'], ['mend', 'show']], validCount: 6, evidence: 'Using that needle' },
];
function permutations(ids: readonly string[]): string[][] {
  return ids.length ? ids.flatMap((id, index) => permutations(ids.filter((_, i) => i !== index)).map(rest => [id, ...rest])) : [[]];
}
function drafts(ids: readonly string[]): string[][] {
  return [[], ...ids.flatMap((id, index) => drafts(ids.filter((_, i) => i !== index)).map(rest => [id, ...rest]))];
}
function judged(task: TaskDefinition, response: ActivityResponse, correct: boolean) {
  const result = evaluate(task, response);
  expect(result).toMatchObject({ status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band });
  if (result.status !== 'judged') throw new Error('Expected a judged response');
  expect(result.feedback.issues.length).toBe(correct ? 0 : 1);
  result.feedback.issues.forEach(issue => expect(issue.explanation.length).toBeGreaterThan(20));
  expect(Object.keys(result).sort()).toEqual(['status', 'correct', 'canonicalQuestionId', 'skillId', 'objectiveId', 'band', 'feedback'].sort());
  return result;
}

describe('separate textual-evidence matrices cover the complete finite answer space', () => {
  for (const [key, answer, evidence] of retrievalOracle) it(`retrieval ${key}: every answer`, () => {
    const task = get(key);
    expect(task.assessedText).toContain(evidence);
    if (task.responseSpec.kind !== 'choice') throw new Error('choice expected');
    for (const option of task.responseSpec.slots[0].options) judged(task, chosen('answer', option.id), option.id === answer);
  });
  for (const row of inferenceOracle) it(`inference ${row.key}: every inference/clue combination`, () => {
    const task = get(row.key);
    row.evidence.forEach(text => expect(task.assessedText).toContain(text));
    if (task.responseSpec.kind !== 'choice') throw new Error('choice expected');
    const inferences = task.responseSpec.slots.find(slot => slot.id === 'inference')!.options;
    const clues = task.responseSpec.slots.find(slot => slot.id === 'clue')!.options;
    for (const i of inferences) for (const c of clues) {
      const correct = i.id === row.inference && row.clues.includes(c.id);
      const result = judged(task, paired(i.id, c.id), correct);
      if (!correct) expect(result.feedback.issues[0].code).toBe(i.id === row.inference ? 'unsupported-clue' : 'unsupported-inference');
    }
    for (const i of inferences) expect(evaluate(task, chosen('inference', i.id))).toEqual({ status: 'incomplete', missing: ['clue'] });
    for (const c of clues) expect(evaluate(task, chosen('clue', c.id))).toEqual({ status: 'incomplete', missing: ['inference'] });
  });
  for (const row of editOracle) it(`editing ${row.key}: all complete alternatives`, () => {
    const task = get(row.key);
    expect(task.assessedText).toContain(row.evidence);
    if (task.responseSpec.kind !== 'choice') throw new Error('choice expected');
    for (const option of task.responseSpec.slots[0].options) judged(task, chosen('edit', option.id), row.accepted.includes(option.id));
  });
  for (const row of sequenceOracle) it(`sequence ${row.key}: all permutations and all ordered partial subsets`, () => {
    const task = get(row.key);
    if (task.responseSpec.kind !== 'sequence') throw new Error('sequence expected');
    expect(task.responseSpec.tiles.map(tile => tile.id).sort()).toEqual([...row.tiles].sort());
    expect([task.assessedText, ...task.responseSpec.tiles.map(tile => tile.label)].join(' ')).toContain(row.evidence);
    let correctCount = 0;
    for (const orderedIds of permutations(row.tiles)) {
      const correct = row.before.every(([a, b]) => orderedIds.indexOf(a) < orderedIds.indexOf(b));
      correctCount += Number(correct);
      judged(task, { kind: 'sequence', orderedIds }, correct);
    }
    expect(correctCount).toBe(row.validCount);
    for (const orderedIds of drafts(row.tiles).filter(ids => ids.length < row.tiles.length)) {
      expect(evaluate(task, { kind: 'sequence', orderedIds })).toEqual({ status: 'incomplete', missing: task.responseSpec.tiles.filter(tile => !orderedIds.includes(tile.id)).map(tile => tile.id) });
    }
  });
});

describe('inventory, sources, identity, control bounds and help', () => {
  it('contains only thirty individually meaningful E08–E10 identities and the exact 4/3/3 floors', () => {
    const oracleKeys = [...retrievalOracle.map(row => row[0]), ...inferenceOracle.map(row => row.key), ...editOracle.map(row => row.key), ...sequenceOracle.map(row => row.key)];
    expect(READING_WRITING_TASKS).toHaveLength(30);
    expect(READING_WRITING_TASKS.map(t => t.descriptor.authoredKey).sort()).toEqual(oracleKeys.sort());
    expect(new Set(READING_WRITING_TASKS.map(t => t.assessedText)).size).toBe(30);
    expect(new Set(READING_WRITING_MANIFEST.taskIds).size).toBe(30);
    expect(READING_WRITING_MANIFEST.retainedTaskIds).toEqual([]);
    for (const skill of ['E08', 'E09', 'E10']) for (const [band, count] of [['support', 3], ['core', 4], ['stretch', 3]] as const)
      expect(READING_WRITING_TASKS.filter(task => task.skillId === skill && task.band === band)).toHaveLength(count);
  });
  for (const task of READING_WRITING_TASKS) it(`${task.descriptor.authoredKey}: source, reviewed fields, help, finite bounds`, () => {
    expect(validateReadingWritingTask(task)).toEqual([]);
    expect(validateReadingWritingTask(JSON.parse(JSON.stringify(task)))).toEqual([]);
    expect(task.canonicalQuestionId).toBe(canonicalQuestionId(task.descriptor));
    expect(Object.isFrozen(task)).toBe(true);
    expect(Object.isFrozen(task.responseSpec)).toBe(true);
    expect(task.assessedText.trim().split(/\s+/).length).toBeLessThanOrEqual(120);
    expect(task.curriculum.sourceUrl).toContain('gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study');
    expect(task.curriculum.section).toMatch(/comprehension|composition/);
    expect(task.curriculum.programmeBand).toMatch(/^Years (3–4|5–6)/);
    expect(task.demandRationale.length).toBeGreaterThan(50);
    expect(task.review.evidenceRef).toBe(`docs/content-review/expansion-reading-writing.md#${task.descriptor.authoredKey}`);
    expect(task.hints).toHaveLength(2);
    expect(new Set([...task.hints.map(h => h.id), task.workedSupport.id]).size).toBe(3);
    expect(task.hints.every(h => h.text.length > 20 && h.text !== task.explanation)).toBe(true);
    expect(task.workedSupport.text).toContain(task.explanation);
    expect(task.narration).toEqual({ neutralText: task.instructionText, assessedTextMayBeSpokenBeforeCheck: true });
    expect(task.stimulus).toBeNull();
    if (task.responseSpec.kind === 'choice') {
      for (const slot of task.responseSpec.slots) { expect(slot.options.length).toBeLessThanOrEqual(4); expect(new Set(slot.options.map(o => o.id)).size).toBe(slot.options.length); }
      expect(task.responseSpec.requiredSlotIds).toEqual(task.skillId === 'E08' ? ['answer'] : task.skillId === 'E09' ? ['inference', 'clue'] : ['edit']);
    } else if (task.responseSpec.kind === 'sequence') {
      expect(task.responseSpec.tiles.length).toBeLessThanOrEqual(5);
      expect(task.responseSpec.cardinality).toEqual({ min: task.responseSpec.tiles.length, max: task.responseSpec.tiles.length });
      // Even counting the tiles as assessed source, the passage budget holds.
      expect([task.assessedText, ...task.responseSpec.tiles.map(t => t.label)].join(' ').split(/\s+/).length).toBeLessThanOrEqual(120);
    } else throw new Error('Undeclared control');
  });
  it('provides real support-accessible story pools and optional Q7/Q8/Q10 routes', () => {
    expect(READING_WRITING_BINDING_PROPOSALS.map(b => b.bindingId)).toEqual(['q7-story-e10-sequence', 'q8-story-e08-clue', 'q7-revisit-e10-choice', 'q8-revisit-e09-choice', 'q10-revisit-e10-choice']);
    for (const binding of READING_WRITING_BINDING_PROPOSALS) {
      expect(binding.taskIds.length).toBeGreaterThan(0);
      expect(binding.availability).toBe('M2'); expect(binding.sourceBindingId).toBeNull();
      const tasks = binding.taskIds.map(id => READING_WRITING_TASKS.find(t => t.canonicalQuestionId === id)!);
      expect(tasks.every(t => t.skillId === binding.skillId && t.responseSpec.kind === binding.responseKind)).toBe(true);
      expect(tasks.some(t => t.band === 'support')).toBe(true);
      if (binding.role === 'revisit') expect(binding.bindingId).toBe(`${binding.questId.toLowerCase()}-revisit-${binding.skillId.toLowerCase()}-${binding.responseKind}`);
    }
  });
  it('manifest examples are accurate exports, independently of the exhaustive oracles', () => {
    for (const fixture of READING_WRITING_MANIFEST.cases) {
      const result = evaluate(READING_WRITING_TASKS.find(t => t.canonicalQuestionId === fixture.canonicalQuestionId)!, fixture.response);
      expect(result.status).toBe(fixture.expectedStatus);
      if (result.status === 'judged') { expect(result.correct).toBe(fixture.expectedCorrect); expect(result.feedback.issues.map(i => i.code)).toEqual(fixture.expectedIssueCodes); }
    }
  });
  it('downstream handoff cases resolve to the exact proposed bindings and semantic responses', () => {
    for (const fixture of READING_WRITING_HANDOFF_CASES) {
      const binding = READING_WRITING_BINDING_PROPOSALS.find(b => b.bindingId === fixture.bindingId)!;
      expect(binding.taskIds).toContain(fixture.canonicalQuestionId);
      const task = READING_WRITING_TASKS.find(t => t.canonicalQuestionId === fixture.canonicalQuestionId)!;
      const result = evaluate(task, fixture.response);
      expect(result.status).toBe(fixture.expectedStatus);
      if (result.status === 'judged') expect(result.correct).toBe(fixture.expectedCorrect);
      expect(fixture.expectedEvidenceMode).toBe(fixture.expectedAssistance.evidenceMode);
    }
  });
});

describe('unscored boundaries and lossless content comparison', () => {
  for (const task of READING_WRITING_TASKS) it(`${task.descriptor.authoredKey}: partial/invalid precedence`, () => {
    for (const response of [null, undefined, [], {}, { kind: 'essay', text: 'my answer' }, { kind: task.responseSpec.kind, extra: true }])
      expect(evaluate(task, response).status).toBe('invalid-response');
    if (task.responseSpec.kind === 'choice') {
      expect(evaluate(task, { kind: 'choice', choices: {} }).status).toBe('incomplete');
      for (const slot of task.responseSpec.slots) {
        expect(evaluate(task, { kind: 'choice', choices: { [slot.id]: null } }).status).toBe('incomplete');
        for (const bad of ['unknown', 1, undefined, NaN, {}, ['box']]) expect(evaluate(task, { kind: 'choice', choices: { [slot.id]: bad } }).status).toBe('invalid-response');
      }
      expect(evaluate(task, { kind: 'choice', choices: { unknown: null } }).status).toBe('invalid-response');
    } else if (task.responseSpec.kind === 'sequence') {
      const id = task.responseSpec.tiles[0].id;
      for (const orderedIds of [[id, id], ['unknown'], [null], [1], new Array(1), [id, ...task.responseSpec.tiles.map(t => t.id)]])
        expect(evaluate(task, { kind: 'sequence', orderedIds }).status).toBe('invalid-response');
    }
  });
  it('rejects changed meaning, metadata, answers and all lossy or extra data before judging', () => {
    const original = get('bench-note');
    const mutate = (change: (t: Record<string, any>) => void) => { const task = structuredClone(original); change(task); expect(evaluate(task, chosen('answer', 'box')).status).toBe('unavailable-content'); };
    for (const field of ['assessedText', 'instructionText', 'explanation', 'objectiveId', 'skillId', 'band', 'demandRationale']) mutate(t => { t[field] = 'different'; });
    mutate(t => { t.answerRule.responses = [chosen('answer', 'shelf')]; });
    mutate(t => { t.hints[0].text = 'Choose box'; });
    mutate(t => { t.workedSupport.text = ''; });
    mutate(t => { t.narration.assessedTextMayBeSpokenBeforeCheck = false; });
    mutate(t => { t.curriculum.section = 'Year 4 attainment'; });
    mutate(t => { t.review.status = 'withheld'; });
    mutate(t => { t.responseSpec.slots[0].options.push(t.responseSpec.slots[0].options[0]); });
    mutate(t => { t.responseSpec.requiredSlotIds = []; });
    mutate(t => { t.contentRevision = '0'; });
    mutate(t => { t.descriptor.authoredKey = 'new-key'; t.canonicalQuestionId = canonicalQuestionId(t.descriptor); });
    for (const bad of [NaN, Infinity, -Infinity, undefined, () => null, 1n, -0, Number.MAX_SAFE_INTEGER + 1, new Date(), new Number(0)]) mutate(t => { t.stimulus = bad; });
    mutate(t => { t.responseSpec.slots[0].options[0].extra = undefined; });
    mutate(t => { t.responseSpec.slots[0].options.extra = 1; });
    mutate(t => { delete t.responseSpec.slots[0].options[0]; });
    mutate(t => { t.stimulus = t; });
    mutate(t => { Object.defineProperty(t, 'secret', { value: 1, enumerable: false }); });
    mutate(t => { Object.defineProperty(t, Symbol('hidden'), { value: 1, enumerable: true }); });
    mutate(t => { Object.defineProperty(t, 'stimulus', { get: () => null, enumerable: true }); });
    for (const bad of [null, undefined, [], {}]) expect(evaluate(bad as TaskDefinition, null).status).toBe('unavailable-content');
  });
  it('preserves identity across cosmetic revision and control presentation order', () => {
    for (const original of READING_WRITING_TASKS) {
      const clone = structuredClone(original);
      const spec = clone.responseSpec;
      const reordered = spec.kind === 'choice' ? { ...spec, requiredSlotIds: [...spec.requiredSlotIds].reverse(), slots: [...spec.slots].reverse().map(s => ({ ...s, options: [...s.options].reverse() })) }
        : spec.kind === 'sequence' ? { ...spec, tiles: [...spec.tiles].reverse() } : spec;
      expect(validateReadingWritingTask({ ...clone, contentRevision: '2', responseSpec: reordered })).toEqual([]);
      expect(clone.canonicalQuestionId).toBe(original.canonicalQuestionId);
    }
  });
  it('fresh reconstructed clue task remains semantic after JSON round-trip and independent slot/option order', () => {
    const original = get('sheltered-gauge');
    const copy = JSON.parse(JSON.stringify(original)) as TaskDefinition;
    if (copy.responseSpec.kind !== 'choice') throw new Error('choice expected');
    const task = { ...copy, contentRevision: '17', responseSpec: { ...copy.responseSpec, slots: [...copy.responseSpec.slots].reverse().map(s => ({ ...s, options: [...s.options].reverse() })) } };
    judged(task, { kind: 'choice', choices: { clue: 'morning', inference: 'doubt' } }, true);
    judged(task, { kind: 'choice', choices: { clue: 'morning', inference: 'liar' } }, false);
  });
});

const neutral: LearningAssistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' };
function observe(task: TaskDefinition, assistance: LearningAssistance, correct = true, index = 1): LearningObservation {
  return { kind: 'check', eventId: `check-${index}`, submissionId: `check-${index}`, profileId: 'reader', encounterId: 'reading-encounter', learningEpisodeOrdinal: 1,
    canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band, selectionReason: 'story-anchor',
    localDate: '2026-10-11', competitionWeekId: '2026-10-05', familiar: false, reviewReference: null, assistance,
    episodeCheckIndex: index, encounterCheckIndex: index, firstCheckCorrect: index === 1 && correct,
    correct, issues: [], episodeCompletion: correct ? 'success' : null } as LearningObservation;
}
function award(task: TaskDefinition, response: ActivityResponse, assistance: LearningAssistance) {
  const evaluation = evaluate(task, response);
  if (evaluation.status !== 'judged') throw new Error('judged expected');
  const selection: RewardSelectionFacts = { profileId: 'reader', encounterId: 'reading-encounter', canonicalQuestionId: task.canonicalQuestionId, selectionReason: 'story', candidate: 'first-encounter', band: task.band };
  const track: CanonicalRewardTrack = { lastAllocatedOrdinal: 1, completedThroughOrdinal: 0, closedAwardTotal: 0, freePractice: { validChecks: 0, answerHintUsed: false },
    currentOpportunity: { opportunityId: 'reading-opportunity', profileId: 'reader', canonicalQuestionId: task.canonicalQuestionId, ordinal: 1, selectionFacts: selection,
      earningWeek: null, slot: null, validChecks: 0, answerHintUsed: assistance.answerHintUsed || assistance.workedSupportUsed,
      components: { answer: false, independentSuccess: false, supportedSuccess: false } } };
  return applyCheckRewards({ profileId: 'reader', encounterId: 'reading-encounter', opportunityId: 'reading-opportunity', submissionId: 'check-1', checkSequence: 1, validChecks: 0,
    track, rewards: { lifetimePoints: 0, tracksByCanonical: { [task.canonicalQuestionId]: track }, questReceipts: [], entitlementIds: [] }, evaluation, assistance, selection,
    competition: { timezone: 'Europe/London', latestOpenedWeek: '2026-10-05', currentScores: {}, currentSlots: {}, archives: [], policyVersion: '1' },
    context: { observedLocalDate: '2026-10-11', activeWeek: '2026-10-05', clockRollback: false } });
}
describe('pure consumer expectations: one task, listening, neutral narration and sticky help', () => {
  for (const [key, response] of [
    ['bench-note', chosen('answer', 'box')], ['first-reading', paired('worried', 'hands')],
    ['found-note', { kind: 'sequence', orderedIds: ['find', 'read', 'return'] }], ['uncertain-visitor', chosen('edit', 'wonder')],
  ] as const) it(`${key}: listening qualifies evidence but preserves ordinary points`, () => {
    const task = get(key);
    const listening: LearningAssistance = { ...neutral, assessedTextReadAloud: true, evidenceMode: 'listening-supported' };
    for (const help of [neutral, listening, { ...neutral, answerHintUsed: true }, { ...neutral, workedSupportUsed: true }]) {
      judged(task, response, true);
      const result = applyLearningObservation({}, observe(task, help));
      expect(Object.keys(result)).toEqual([task.skillId]);
      const band = result[task.skillId]!.bands[task.band];
      expect(band.correctChecks).toBe(1); expect(band.completedEpisodes).toBe(1);
      expect(band.independentSuccesses).toBe(help === neutral ? 1 : 0);
      expect(band.supportedSuccesses).toBe(help === neutral ? 0 : 1);
      const reward = award(task, response, help);
      expect(reward.delta.lifetimeDelta).toBe(help.answerHintUsed || help.workedSupportUsed ? 10 : 20);
      expect(reward.delta.newReceiptKeys).toHaveLength(2); // answer + ONE success; never a clue component
    }
    // Neutral instructions have no assistance flag and are the same neutral
    // observation. No runtime narration or durable adapter is claimed here.
    const first = applyLearningObservation({}, observe(task, { ...neutral, answerHintUsed: true }, false));
    const continued = applyLearningObservation(first, observe(task, neutral, true, 2));
    const band = continued[task.skillId]!.bands[task.band];
    expect(band.recentCompletedEpisodes[0].assistance.answerHintUsed).toBe(true);
    expect(band.independentSuccesses).toBe(0); expect(band.supportedSuccesses).toBe(1);
  });
});
