import { describe, expect, it } from 'vitest';
import type { ActivityResponse, TaskDefinition } from '../../src/learning/contracts';
import { canonicalQuestionId } from '../../src/learning/identity';
import { TIME_SPACE_DATA_BINDING_PROPOSALS, TIME_SPACE_DATA_MANIFEST, TIME_SPACE_DATA_TASKS } from '../../src/content/expansion-maths/time-space-data';
import { evaluateExpansionTimeSpaceData as evaluate, validateTimeSpaceDataTask as validate } from '../../src/learning/evaluators/expansion-time-space-data';

const task = (key: string) => TIME_SPACE_DATA_TASKS.find(row => row.descriptor.authoredKey === key)!;
const c = (answer: string): ActivityResponse => ({ kind: 'choice', choices: { answer } });
const q = (numerator: number, unit: string): ActivityResponse => ({ kind: 'quantity', values: { answer: { numerator, denominator: 1, unit } } });
const t = (minutes: number): ActivityResponse => ({ kind: 'clock', minutes });
const s = (...orderedIds: string[]): ActivityResponse => ({ kind: 'sequence', orderedIds });

// Independently entered demand/answer/rejection table. Never populated from
// answerRule, tuple authoring helpers, coordinates or the evaluator under test.
const oracle: readonly (readonly [string, string, string, ActivityResponse, ActivityResponse])[] = [
  ['morning-hands', 'M08', 'support', t(570), t(1290)],
  ['morning-event-order', 'M08', 'support', s('breakfast', 'gates', 'bell'), s('bell', 'breakfast', 'gates')],
  ['same-hour-duration', 'M08', 'support', q(30, 'minutes'), q(14, 'minutes')],
  ['afternoon-conversion', 'M08', 'core', t(925), t(205)],
  ['midnight-crossing', 'M08', 'core', q(20, 'minutes'), q(1400, 'minutes')],
  ['mixed-period-order', 'M08', 'core', s('unlock', 'lunch', 'repair', 'close'), s('repair', 'unlock', 'lunch', 'close')],
  ['elapsed-clock', 'M08', 'core', t(670), t(630)],
  ['latest-safe-service', 'M08', 'stretch', t(550), t(575)],
  ['journey-with-wait', 'M08', 'stretch', q(75, 'minutes'), q(60, 'minutes')],
  ['two-day-event-order', 'M08', 'stretch', s('lock', 'inspect', 'restart', 'open'), s('inspect', 'restart', 'open', 'lock')],
  ['triangle-boundary', 'M09', 'support', c('triangle'), c('quadrilateral')],
  ['north-quarter-clockwise', 'M09', 'support', c('east'), c('west')],
  ['rectangle-right-angles', 'M09', 'support', c('four'), c('two')],
  ['rectangle-symmetry', 'M09', 'core', c('two'), c('four')],
  ['triangle-side-angle-classification', 'M09', 'core', c('right-scalene'), c('right-isosceles')],
  ['two-turn-map', 'M09', 'core', c('south'), c('north')],
  ['rotated-square-symmetry', 'M09', 'core', c('four'), c('two')],
  ['reverse-turns', 'M09', 'stretch', c('north'), c('south')],
  ['alternating-turn-pattern', 'M09', 'stretch', c('west'), c('east')],
  ['square-diagonal-pieces', 'M09', 'stretch', c('right-isosceles'), c('equilateral')],
  ['read-attendance-table', 'M10', 'support', c('twelve'), c('eight')],
  ['joint-greatest-bar', 'M10', 'support', c('oak'), c('elm')],
  ['two-session-total', 'M10', 'support', q(10, 'visitors'), q(2, 'visitors')],
  ['bar-attendance-difference', 'M10', 'core', q(8, 'visitors'), q(40, 'visitors')],
  ['combined-versus-single', 'M10', 'core', c('three-more'), c('three-fewer')],
  ['target-shortfall', 'M10', 'core', q(15, 'tickets'), q(40, 'tickets')],
  ['five-session-total', 'M10', 'core', q(60, 'visitors'), q(50, 'visitors')],
  ['largest-line-increase', 'M10', 'stretch', c('wed-thu'), c('mon-tue')],
  ['equal-line-increases', 'M10', 'stretch', c('mon-tue'), c('wed-thu')],
  ['line-total-target', 'M10', 'stretch', q(15, 'tickets'), q(40, 'tickets')],
];

describe('reviewed finite bank and independent demand/answer table', () => {
  it('has exactly thirty unique tasks, each skill at 3/4/3 and no replaced starter IDs', () => {
    expect(TIME_SPACE_DATA_TASKS).toHaveLength(30);
    expect(new Set(TIME_SPACE_DATA_TASKS.map(row => row.canonicalQuestionId)).size).toBe(30);
    expect(TIME_SPACE_DATA_TASKS.map(row => row.descriptor.authoredKey)).toEqual(oracle.map(row => row[0]));
    for (const skill of ['M08', 'M09', 'M10']) for (const [band, count] of [['support', 3], ['core', 4], ['stretch', 3]] as const) {
      expect(TIME_SPACE_DATA_TASKS.filter(row => row.skillId === skill && row.band === band)).toHaveLength(count);
    }
    expect(TIME_SPACE_DATA_MANIFEST.retainedTaskIds).toEqual([]);
    expect(TIME_SPACE_DATA_MANIFEST.taskIds).toEqual(TIME_SPACE_DATA_TASKS.map(row => row.canonicalQuestionId));
  });
  it.each(oracle)('%s: full task → validation → evaluation agrees with independent oracle', (key, skill, band, answer, wrong) => {
    const row = task(key);
    expect(row.skillId).toBe(skill); expect(row.band).toBe(band);
    expect(validate(row)).toEqual([]);
    expect(validate(structuredClone(row))).toEqual([]);
    expect(canonicalQuestionId(row.descriptor)).toBe(row.canonicalQuestionId);
    expect(evaluate(row, answer)).toMatchObject({ status: 'judged', correct: true, skillId: skill, band });
    expect(evaluate(row, wrong)).toMatchObject({ status: 'judged', correct: false });
    const result = evaluate(row, wrong);
    if (result.status === 'judged') {
      expect(result.feedback.issues).toHaveLength(1);
      expect(result.feedback.issues[0].code).toBe(`${answer.kind === 'sequence' ? 'order' : answer.kind}-mismatch`);
      expect(result.feedback.issues[0].observed).not.toMatch(/misconception|you (?:forgot|confused|do not understand)/i);
    }
    expect(row.curriculum.sourceUrl).toContain('gov.uk');
    expect(row.demandRationale.length).toBeGreaterThan(35);
    expect(row.hints).toHaveLength(2);
    expect(new Set(row.hints.map(hint => hint.text)).size).toBe(2);
    expect(row.workedSupport.text).not.toBe(row.hints[1].text);
    expect(row.review.status).toBe('approved');
    expect(row.narration.assessedTextMayBeSpokenBeforeCheck).toBe(true);
    expect(Object.isFrozen(row)).toBe(true);
  });
  it('retains every legitimate choice alternative, with no extra accepted choices', () => {
    expect(evaluate(task('joint-greatest-bar'), c('ash'))).toMatchObject({ status: 'judged', correct: true });
    expect(evaluate(task('equal-line-increases'), c('tue-wed'))).toMatchObject({ status: 'judged', correct: true });
    for (const [key, , , answer] of oracle) {
      const row = task(key);
      if (row.responseSpec.kind !== 'choice' || answer.kind !== 'choice') continue;
      const allowed = key === 'joint-greatest-bar' ? ['oak', 'ash'] : key === 'equal-line-increases' ? ['mon-tue', 'tue-wed'] : [answer.choices.answer];
      for (const option of row.responseSpec.slots[0].options) expect(evaluate(row, c(option.id))).toMatchObject({ status: 'judged', correct: allowed.includes(option.id) });
    }
  });
  it('manifest responses all resolve the actual reviewed source/alternative', () => {
    expect(TIME_SPACE_DATA_MANIFEST.cases).toHaveLength(122);
    for (const example of TIME_SPACE_DATA_MANIFEST.cases) {
      const row = TIME_SPACE_DATA_TASKS.find(row => row.canonicalQuestionId === example.canonicalQuestionId)!;
      const result = evaluate(row, example.response);
      expect(result.status).toBe(example.expectedStatus);
      if (result.status === 'judged') {
        expect(result.correct).toBe(example.expectedCorrect);
        expect(result.feedback.issues.map(issue => issue.code)).toEqual(example.expectedIssueCodes);
      }
      expect(row.review.evidenceRef).toBe(TIME_SPACE_DATA_MANIFEST.reviewEvidenceRef);
    }
  });
});

describe('unscored drafts, exact domains and complete wrong answers', () => {
  it.each(TIME_SPACE_DATA_TASKS.map(row => [row.descriptor.authoredKey, row] as const))('%s rejects malformed controls and keeps partial inputs unscored', (_key, row) => {
    for (const response of [null, undefined, [], 0, {}, { kind: 'unsupported' }]) expect(evaluate(row, response).status).toBe('invalid-response');
    const spec = row.responseSpec;
    const partial = spec.kind === 'clock' ? { kind: 'clock', minutes: null } : spec.kind === 'sequence' ? s() : spec.kind === 'choice' ? { kind: 'choice', choices: {} } : { kind: 'quantity', values: {} };
    expect(evaluate(row, partial).status).toBe('incomplete');
    expect(evaluate(row, { ...partial, unknown: 1 }).status).toBe('invalid-response');
    if (spec.kind === 'choice') for (const value of [undefined, '', 'unknown', 1, ['east'], NaN]) expect(evaluate(row, { kind: 'choice', choices: { answer: value } }).status).toBe('invalid-response');
    if (spec.kind === 'sequence') {
      expect(evaluate(row, s(spec.tiles[0].id)).status).toBe('incomplete');
      expect(evaluate(row, s(spec.tiles[0].id, spec.tiles[0].id)).status).toBe('invalid-response');
      expect(evaluate(row, s('unknown')).status).toBe('invalid-response');
      expect(evaluate(row, { kind: 'sequence', orderedIds: Array(2) }).status).toBe('invalid-response');
    }
    if (spec.kind === 'clock') {
      for (const minutes of [-1, 1440, 1.5, NaN, Infinity, -Infinity, '570', undefined]) expect(evaluate(row, { kind: 'clock', minutes }).status).toBe('invalid-response');
      for (const minutes of [0, 1439]) expect(evaluate(row, t(minutes))).toMatchObject({ status: 'judged', correct: false });
      expect(evaluate(row, { kind: 'clock', minutes: 570, x: 0, y: 1 }).status).toBe('invalid-response');
    }
    if (spec.kind === 'quantity') {
      const slot = spec.slots[0]; const unit = slot.units[0];
      for (const numerator of [-1, slot.numeratorBounds.max + 1, 1.2, NaN, Infinity, '20', undefined]) expect(evaluate(row, { kind: 'quantity', values: { answer: { numerator, denominator: 1, unit } } }).status).toBe('invalid-response');
      for (const bad of [{ numerator: 20, denominator: 0, unit }, { numerator: 40, denominator: 2, unit }, { numerator: 20, denominator: 1, unit: 'hours' }, { numerator: 20, denominator: 1, unit, extra: 1 }]) expect(evaluate(row, { kind: 'quantity', values: { answer: bad } }).status).toBe('invalid-response');
      for (const numerator of [0, slot.numeratorBounds.max]) expect(evaluate(row, q(numerator, unit))).toMatchObject({ status: 'judged', correct: false });
      expect(evaluate(row, { kind: 'quantity', values: { answer: null, unknown: null } }).status).toBe('invalid-response');
    }
  });
  it('checks every clock minute against independent literal answers', () => {
    for (const [key, , , response] of oracle) if (response.kind === 'clock') {
      for (let minute = 0; minute < 1440; minute++) expect(evaluate(task(key), t(minute))).toMatchObject({ status: 'judged', correct: minute === response.minutes });
    }
  });
});

describe('representation source, labels, scale and accessible givens', () => {
  const dataOracle: readonly (readonly [string, string, number, readonly (readonly [string, number])[]])[] = [
    ['read-attendance-table', 'visitors', 1, [['Oak', 12], ['Elm', 8], ['Ash', 15]]],
    ['joint-greatest-bar', 'visitors', 5, [['Oak', 20], ['Elm', 10], ['Ash', 20]]],
    ['two-session-total', 'visitors', 1, [['Morning', 6], ['Afternoon', 4]]],
    ['bar-attendance-difference', 'visitors', 4, [['Oak', 24], ['Elm', 16], ['Ash', 12]]],
    ['combined-versus-single', 'visitors', 3, [['Oak', 15], ['Elm', 12], ['Ash', 24]]],
    ['target-shortfall', 'tickets', 5, [['Monday', 10], ['Tuesday', 25], ['Wednesday', 20]]],
    ['five-session-total', 'visitors', 2, [['Dawn', 8], ['Morning', 14], ['Noon', 16], ['Afternoon', 12], ['Evening', 10]]],
    ['largest-line-increase', 'visitors', 2, [['Monday', 8], ['Tuesday', 14], ['Wednesday', 12], ['Thursday', 22]]],
    ['equal-line-increases', 'visitors', 5, [['Monday', 10], ['Tuesday', 15], ['Wednesday', 20], ['Thursday', 18]]],
    ['line-total-target', 'tickets', 5, [['Monday', 10], ['Tuesday', 15], ['Wednesday', 20]]],
  ];
  it.each(dataOracle)('%s preserves independent exact source data and source-only alternatives', (key, unit, scale, values) => {
    const stimulus = task(key).stimulus;
    expect(stimulus?.kind).toBe('data');
    if (stimulus?.kind !== 'data') throw Error('missing represented data');
    expect(stimulus.rows.map(row => [row.label, row.value])).toEqual(values);
    expect(stimulus.rows.length).toBeLessThanOrEqual(6);
    expect(new Set(stimulus.rows.map(row => row.id)).size).toBe(stimulus.rows.length);
    expect(stimulus.scaleStep).toBe(scale); expect(stimulus.unit).toBe(unit);
    for (const [label, value] of values) {
      expect(Number.isInteger(value) && value >= 0 && value <= 100).toBe(true);
      expect(stimulus.accessibleDescription).toContain(`${label}: ${value} ${unit}`);
    }
    expect(stimulus.accessibleDescription).not.toMatch(/greatest|more than|increase of|altogether|answer|needs|total is/i);
    if (stimulus.display === 'line') expect(stimulus.accessibleDescription).toContain('equally spaced');
  });
  it('gives analogue hand positions without spelling out the requested time', () => {
    const source = task('morning-hands').stimulus;
    expect(source).toMatchObject({ kind: 'clock', minutes: 570, dayOffset: 0, face: 'analogue', display: '12-hour' });
    expect(source!.accessibleDescription).toContain('minute hand points to 6');
    expect(source!.accessibleDescription).not.toMatch(/09:30|9:30|570|half past/);
    expect(task('midnight-crossing').assessedText).toContain('Day 1 (the next day)');
    // Independent arithmetic: remaining day fraction plus next-day fraction.
    expect(1440 - 1430 + 10).toBe(20);
    expect(evaluate(task('midnight-crossing'), q(20, 'minutes'))).toMatchObject({ status: 'judged', correct: true });
  });
  it('validates every closed boundary and equal coordinate units without grading coordinates', () => {
    for (const row of TIME_SPACE_DATA_TASKS) {
      const stimulus = row.stimulus;
      if (stimulus?.kind !== 'diagram') continue;
      const ids = stimulus.points.map(point => point.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(stimulus.labels).toContain('Equal horizontal and vertical coordinate units');
      for (const point of stimulus.points) { expect(Number.isFinite(point.x)).toBe(true); expect(Number.isFinite(point.y)).toBe(true); expect(point.label).toBeTruthy(); }
      for (const edge of stimulus.edges) { expect(ids).toContain(edge.from); expect(ids).toContain(edge.to); expect(edge.from).not.toBe(edge.to); }
      if (stimulus.closed) {
        expect(stimulus.edges.length).toBe(stimulus.points.length);
        for (const id of ids) { expect(stimulus.edges.filter(edge => edge.from === id)).toHaveLength(1); expect(stimulus.edges.filter(edge => edge.to === id)).toHaveLength(1); }
        expect(stimulus.edges.at(-1)!.to).toBe(stimulus.edges[0].from);
      }
      expect(stimulus.accessibleDescription).not.toMatch(/isosceles|perpendicular|right angle|lines of symmetry|triangle|rectangle|square/);
      expect(evaluate(row, { kind: 'choice', choices: { answer: { x: 0, y: 0 } } }).status).toBe('invalid-response');
    }
    expect(task('triangle-side-angle-classification').stimulus).toMatchObject({ points: [{ id: 'A', x: 0, y: 0 }, { id: 'B', x: 4, y: 0 }, { id: 'C', x: 0, y: 3 }] });
    expect(task('rotated-square-symmetry').stimulus).toMatchObject({ points: [{ id: 'A', x: 0, y: -3 }, { id: 'B', x: 3, y: 0 }, { id: 'C', x: 0, y: 3 }, { id: 'D', x: -3, y: 0 }] });
  });
});

describe('content failures, identity and presentation alternatives', () => {
  it('F1 replacement classifies both independent properties and rejects every one-property distractor', () => {
    const row = task('triangle-side-angle-classification');
    expect(row.curriculum).toMatchObject({ programmeBand: 'Year 4', section: 'Geometry — properties of shapes: compare and classify geometric shapes based on properties and sizes' });
    expect(row.assessedText).toContain('BOTH its side lengths and its angles');
    expect(row.stimulus).toMatchObject({ kind: 'diagram', closed: true, edges: [{ id: 'A-B', from: 'A', to: 'B', label: '4 units' }, { id: 'B-C', from: 'B', to: 'C', label: '5 units' }, { id: 'C-A', from: 'C', to: 'A', label: '3 units' }] });
    // Independently specified source facts: distinct 3/4/5 sides, 3²+4²=5².
    // This is a review oracle, not production coordinate-derived grading.
    expect(new Set([3, 4, 5]).size).toBe(3); expect(3 * 3 + 4 * 4).toBe(5 * 5);
    for (const [answer, correct] of [['right-scalene', true], ['right-isosceles', false], ['acute-scalene', false], ['acute-isosceles', false]] as const) {
      expect(evaluate(structuredClone(row), c(answer))).toMatchObject({ status: 'judged', correct });
    }
    for (const text of [row.stimulus!.accessibleDescription, ...row.hints.map(hint => hint.text)]) expect(text).not.toMatch(/scalene|isosceles|right-angled|no equal sides|all three lengths differ/);
    expect(evaluate(row, c('ab-ac')).status).toBe('invalid-response');
  });
  it('F1 unpublished replacement has a new identity and removes the rejected tuple from every pool', () => {
    const oldDescriptor = { familyId: 'math.expansion.m09', equivalenceVersion: 'r1', authoredKey: 'triangle-perpendicular', parameters: { source: 'triangle-A-top-left-B-right4-C-down3; perpendicular-sides' } };
    const oldId = 'lif.math.expansion.m09.r1.authored-%5B%22triangle-perpendicular%22%2C%5B%5B%22source%22%2C%22triangle-A-top-left-B-right4-C-down3%3B%20perpendicular-sides%22%5D%5D%5D';
    expect(canonicalQuestionId(oldDescriptor)).toBe(oldId);
    const row = task('triangle-side-angle-classification');
    expect(row.canonicalQuestionId).not.toBe(oldId);
    expect(TIME_SPACE_DATA_MANIFEST.taskIds).not.toContain(oldId);
    expect(TIME_SPACE_DATA_MANIFEST.cases.some(example => example.canonicalQuestionId === oldId)).toBe(false);
    for (const binding of TIME_SPACE_DATA_BINDING_PROPOSALS) {
      expect(binding.taskIds).not.toContain(oldId);
      if (binding.skillId === 'M09') expect(binding.taskIds).toContain(row.canonicalQuestionId);
    }
    expect(evaluate({ ...row, canonicalQuestionId: oldId, descriptor: oldDescriptor }, c('ab-ac')).status).toBe('unavailable-content');
  });
  it.each(oracle)('%s rejects altered reviewed semantic fields before scoring', (key, _skill, _band, answer) => {
    const row = task(key);
    const mutations: unknown[] = [null, {}, { ...row, band: 'unknown' }, { ...row, stimulus: NaN }, { ...row, stimulus: Infinity }, { ...row, stimulus: undefined }, { ...row, explanation: '' }, { ...row, answerRule: { kind: 'accepted-responses', responses: [] } }, { ...row, review: { ...row.review, status: 'withheld' } }, { ...row, contentRevision: '0' }, { ...row, descriptor: { ...row.descriptor, parameters: { source: 'unreviewed' } } }];
    for (const changed of mutations) expect(evaluate(changed as TaskDefinition, answer).status).toBe('unavailable-content');
    expect(evaluate({ ...row, contentRevision: '2' }, answer)).toMatchObject({ status: 'judged', correct: true, canonicalQuestionId: row.canonicalQuestionId });
  });
  it('rejects invalid representation domains, missing endpoints and changed data order', () => {
    const midnight = task('midnight-crossing');
    for (const bad of [{ minutes: -1 }, { minutes: 1440 }, { minutes: 1430.5 }, { dayOffset: 2 }, { face: 'unknown' }, { display: 'unknown' }]) expect(evaluate({ ...midnight, stimulus: { ...midnight.stimulus!, ...bad } } as TaskDefinition, q(20, 'minutes')).status).toBe('unavailable-content');
    const chart = task('largest-line-increase');
    if (chart.stimulus?.kind !== 'data') throw Error('source');
    for (const bad of [{ scaleStep: 0 }, { scaleStep: -1 }, { scaleStep: 1.5 }, { rows: [...chart.stimulus.rows].reverse() }, { rows: [{ id: 'monday', label: 'Monday', value: 101 }] }, { rows: [{ id: 'monday', label: '', value: NaN }] }]) expect(evaluate({ ...chart, stimulus: { ...chart.stimulus, ...bad } } as TaskDefinition, c('wed-thu')).status).toBe('unavailable-content');
    const shape = task('triangle-boundary');
    expect(evaluate({ ...shape, stimulus: { ...shape.stimulus!, edges: [{ id: 'broken', from: 'A', to: 'missing' }] } } as TaskDefinition, c('triangle')).status).toBe('unavailable-content');
  });
  it('keeps option and tile presentation permutations equivalent', () => {
    for (const [key, , , answer] of oracle) {
      const row = task(key); const spec = row.responseSpec;
      const permuted = spec.kind === 'choice' ? { ...spec, slots: spec.slots.map(slot => ({ ...slot, options: [...slot.options].reverse() })) } : spec.kind === 'sequence' ? { ...spec, tiles: [...spec.tiles].reverse() } : spec;
      expect(evaluate({ ...row, responseSpec: permuted }, structuredClone(answer))).toMatchObject({ status: 'judged', correct: true, canonicalQuestionId: row.canonicalQuestionId });
    }
  });
});

describe('exact receiving binding proposals', () => {
  it('supplies only authorised Q4/Q8/Q9/Q10 rows and support-accessible required pools', () => {
    expect(TIME_SPACE_DATA_BINDING_PROPOSALS.map(row => row.bindingId).sort()).toEqual(['q9-story-m08-clock', 'q9-story-m08-sequence', 'q9-revisit-m08-quantity', 'q4-revisit-m09-choice', 'q8-revisit-m09-choice', 'q10-story-m10-data', 'q10-revisit-m10-quantity'].sort());
    for (const binding of TIME_SPACE_DATA_BINDING_PROPOSALS) {
      expect(binding.taskIds.length).toBeGreaterThan(0); expect(binding.sourceBindingId).toBeNull(); expect(binding.availability).toBe('M2');
      const pool = binding.taskIds.map(id => TIME_SPACE_DATA_TASKS.find(row => row.canonicalQuestionId === id)!);
      expect(pool.every(row => row && row.skillId === binding.skillId && row.responseSpec.kind === binding.responseKind)).toBe(true);
      expect(pool.some(row => row.band === 'support')).toBe(true);
      expect(binding.role).toBe(binding.bindingId.includes('-story-') ? 'story' : 'revisit');
    }
  });
});
