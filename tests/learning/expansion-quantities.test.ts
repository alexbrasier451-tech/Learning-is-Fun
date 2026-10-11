import { describe, expect, it } from 'vitest';
import type { ActivityResponse, TaskDefinition } from '../../src/learning/contracts';
import { canonicalQuestionId } from '../../src/learning/identity';
import { QUANTITY_BINDING_PROPOSALS, QUANTITY_MANIFEST, QUANTITY_TASKS } from '../../src/content/expansion-maths/quantities';
import { evaluateExpansionQuantities as evaluate, validateQuantityTask } from '../../src/learning/evaluators/expansion-quantities';

const task = (key: string) => QUANTITY_TASKS.find(row => row.descriptor.authoredKey === key)!;
const q = (n: number, d = 1, u = 'whole'): ActivityResponse => ({ kind: 'quantity', values: { answer: { numerator: n, denominator: d, unit: u } } });
const c = (index: number): ActivityResponse => ({ kind: 'choice', choices: { answer: `option-${index}` } });
const m = (...indices: number[]): ActivityResponse => ({ kind: 'matching', pairs: Object.fromEntries(indices.map((value, i) => [`item-${i + 1}`, `target-${value}`])) });
// Independent literal solution/demand table. Never read answerRule to produce
// an oracle. Decimal quantities here are rationals; money values are pence.
const oracle = [
  ['shaded-half', 'M05', 'support', 3, q(1, 2), 'one of two equal parts'],
  ['shaded-quarters-form', 'M05', 'support', 3, q(2, 4), 'name drawn quarter partitions'],
  ['third-of-counters', 'M05', 'support', 3, q(4, 1, 'count'), '12 divided into three equal shares'],
  ['equivalent-sixths', 'M05', 'core', 4, q(4, 6), 'coordinate scaling to sixths'],
  ['three-quarters-of-beads', 'M05', 'core', 4, q(15, 1, 'count'), 'three of four shares of twenty'],
  ['add-eighths', 'M05', 'core', 4, q(5, 8), 'combine three and two eighths'],
  ['subtract-tenths', 'M05', 'core', 4, q(1, 2), 'remove four of nine tenths'],
  ['reverse-three-fifths', 'M05', 'stretch', 4, q(20, 1, 'count'), 'recover whole from twelve as three fifths'],
  ['improper-mixed-quarters', 'M05', 'stretch', 5, c(1), 'seven quarters as mixed number'],
  ['compare-thirds-sixths', 'M05', 'stretch', 5, c(2), 'four sixths compared with five sixths'],
  ['five-tenths-decimal', 'M06', 'support', 4, c(2), 'named tenths notation'],
  ['seven-hundredths-decimal', 'M06', 'support', 4, c(3), 'hundredths zero placeholder'],
  ['match-decimal-parts', 'M06', 'support', 4, m(3, 1), 'contrast same digit in two decimal places'],
  ['compare-decimal-lengths', 'M06', 'core', 4, c(1), '70 hundredths exceeds 65'],
  ['quarter-decimal-equivalence', 'M06', 'core', 4, c(2), 'three quarters is 75 hundredths'],
  ['round-decimal-whole', 'M06', 'core', 4, c(2), '2.6 is above 2.5 midpoint'],
  ['extend-decimal-pattern', 'M06', 'core', 4, q(65, 100), 'add fifteen hundredths to fifty'],
  ['missing-decimal-pattern', 'M06', 'stretch', 4, q(7, 10), 'subtract inferred 25 hundredths from 95'],
  ['decimal-digit-constraints', 'M06', 'stretch', 4, c(2), 'whole digit five then maximise tenths'],
  ['round-to-tenth', 'M06', 'stretch', 5, c(2), '2.46 above 2.45 midpoint; one-place form'],
  ['path-metres', 'M07', 'support', 3, q(5, 1, 'm'), 'two plus three measured metres'],
  ['goods-price-pence', 'M07', 'support', 4, m(3, 1), '120 p and 75 p price equivalents'],
  ['millimetres-to-centimetres', 'M07', 'support', 3, q(3, 1, 'cm'), 'three groups of ten millimetres'],
  ['path-mixed-lengths', 'M07', 'core', 4, q(275, 1, 'cm'), '200 plus 75 centimetres'],
  ['goods-change-pence', 'M07', 'core', 4, m(3, 1), '200 minus 125; 100 minus 40'],
  ['money-change-quantity', 'M07', 'core', 4, q(80, 1, 'p'), '200 p minus 120 p'],
  ['capacity-total', 'M07', 'core', 4, q(1250, 1, 'ml'), '1000 ml plus 250 ml'],
  ['path-remaining-length', 'M07', 'stretch', 4, q(175, 1, 'cm'), '300 plus 50 minus 175 centimetres'],
  ['goods-basket-change', 'M07', 'stretch', 4, m(2, 3), '500 minus 275; 500 minus 345'],
  ['mass-after-sharing', 'M07', 'stretch', 4, q(500, 1, 'g'), '2000 minus 750 minus three times 250 grams'],
] as const;
const expectedByKey = new Map<string, ActivityResponse>(oracle.map(row => [row[0], row[4]]));
const exactForms = new Set(['shaded-quarters-form', 'equivalent-sixths']);
function correct(key: string, response: ActivityResponse): boolean {
  const expected = expectedByKey.get(key)!;
  if (response.kind === 'quantity' && expected.kind === 'quantity') {
    const a = response.values.answer!; const b = expected.values.answer!;
    return a.unit === b.unit && (exactForms.has(key)
      ? a.numerator === b.numerator && a.denominator === b.denominator
      : BigInt(a.numerator) * BigInt(b.denominator) === BigInt(b.numerator) * BigInt(a.denominator));
  }
  if (response.kind === 'choice' && expected.kind === 'choice') return response.choices.answer === expected.choices.answer;
  if (response.kind === 'matching' && expected.kind === 'matching') return Object.keys(expected.pairs).every(id => response.pairs[id] === expected.pairs[id]);
  return false;
}
function judged(key: string, response: unknown, expected: boolean) {
  const result = evaluate(task(key), response);
  expect(result, key).toMatchObject({ status: 'judged', correct: expected, canonicalQuestionId: task(key).canonicalQuestionId });
  if (result.status === 'judged') {
    expect(result.feedback.issues.length === 0).toBe(expected);
    expect(result.feedback.explanation).toBe(task(key).explanation);
    for (const issue of result.feedback.issues) expect(issue).toMatchObject({ code: 'value-mismatch', constraintId: null });
  }
}

describe('reviewed finite quantities', () => {
  it('has exactly thirty meaningful authored identities with independent 3/4/3 demand/source fixtures', () => {
    expect(QUANTITY_TASKS).toHaveLength(30);
    expect(new Set(QUANTITY_TASKS.map(row => row.canonicalQuestionId)).size).toBe(30);
    expect(QUANTITY_MANIFEST.taskIds).toEqual(QUANTITY_TASKS.map(row => row.canonicalQuestionId));
    expect(QUANTITY_MANIFEST.retainedTaskIds).toEqual([]); // no M05–M07 starter inflation
    for (const skill of ['M05', 'M06', 'M07']) {
      expect(['support', 'core', 'stretch'].map(band => QUANTITY_TASKS.filter(row => row.skillId === skill && row.band === band).length)).toEqual([3, 4, 3]);
    }
    for (const [key, skill, band, year, response] of oracle) {
      const row = task(key);
      expect(row).toMatchObject({ skillId: skill, band, review: { status: 'approved' } });
      expect(row.canonicalQuestionId).toBe(canonicalQuestionId(row.descriptor));
      for (const value of Object.values(row.descriptor.parameters)) if (typeof value === 'number') {
        expect(Number.isSafeInteger(value)).toBe(true); expect(value).toBeGreaterThanOrEqual(0); expect(value).toBeLessThanOrEqual(10000);
      }
      expect(row.curriculum.programmeBand).toContain(`Year ${year}`);
      expect(row.curriculum.sourceUrl).toContain('gov.uk/government/publications/national-curriculum-in-england-mathematics');
      expect(row.curriculum.section).toBe(skill === 'M07' ? 'Measurement' : year === 3 ? 'Number — fractions' : year === 4 ? 'Number — fractions (including decimals)' : 'Number — fractions (including decimals and percentages)');
      expect(row.demandRationale.length).toBeGreaterThan(60);
      expect(row.hints).toHaveLength(2);
      expect(new Set([...row.hints.map(hint => hint.text), row.workedSupport.text]).size).toBe(3);
      expect(validateQuantityTask(row)).toEqual([]);
      expect(validateQuantityTask(structuredClone(row))).toEqual([]);
      expect(Object.isFrozen(row.responseSpec)).toBe(true);
      judged(key, response, true);
      if (row.answerRule.kind === 'accepted-responses') for (const answer of row.answerRule.responses) expect(correct(key, answer)).toBe(true);
    }
  });

  it('exhausts every permitted quantity value, including units/forms, against independent BigInt oracles', () => {
    let checked = 0;
    for (const row of QUANTITY_TASKS) {
      if (row.responseSpec.kind !== 'quantity') continue;
      const slot = row.responseSpec.slots[0]; const key = row.descriptor.authoredKey!;
      let reachable = 0;
      expect(slot.numeratorBounds.min).toBe(0);
      for (const unit of slot.units) for (const denominator of slot.allowedDenominators) {
        for (let numerator = slot.numeratorBounds.min; numerator <= slot.numeratorBounds.max; numerator++) {
          const response = q(numerator, denominator, unit);
          const wanted = correct(key, response);
          const result = evaluate(row, response);
          if (result.status !== 'judged' || result.correct !== wanted) throw new Error(`${key}: ${numerator}/${denominator} ${unit}: ${JSON.stringify(result)}`);
          checked++; if (wanted) reachable++;
        }
      }
      expect(reachable, key).toBeGreaterThan(0);
      expect(slot.numeratorBounds.max * 100).toBeLessThanOrEqual(250000);
    }
    // M05: 5 × 25 × 9 + 13 + 21 + 31 = 1190; M06: 2 × 151 × 3 = 906;
    // M07: 2 × (11 + 41 + 401 + 201 + 2001 + 401 + 2501) = 11114.
    expect(checked).toBe(13210);
  });

  it('exhausts every choice and matching map, preserving wrong complete answers and duplicate-target invalidity', () => {
    let choiceCount = 0; let matchingCount = 0;
    for (const row of QUANTITY_TASKS) {
      const key = row.descriptor.authoredKey!;
      if (row.responseSpec.kind === 'choice') {
        expect(row.responseSpec.slots[0].options.length).toBeLessThanOrEqual(4);
        for (const option of row.responseSpec.slots[0].options) {
          const response: ActivityResponse = { kind: 'choice', choices: { answer: option.id } };
          judged(key, response, correct(key, response)); choiceCount++;
        }
      }
      if (row.responseSpec.kind === 'matching') {
        const spec = row.responseSpec;
        expect(spec.items.length).toBeLessThanOrEqual(6);
        for (const first of spec.targets) for (const second of spec.targets) {
          const response: ActivityResponse = { kind: 'matching', pairs: { 'item-1': first.id, 'item-2': second.id } };
          if (first.id === second.id) expect(evaluate(row, response).status).toBe('invalid-response');
          else judged(key, response, correct(key, response));
          matchingCount++;
        }
      }
    }
    expect(choiceCount).toBe(31);
    expect(matchingCount).toBe(43);
  });

  it('retains deliberate quantity equivalence, requested denominator/unit and decimal-place distinctions', () => {
    for (const pair of [[1, 2], [2, 4], [3, 6], [4, 8], [5, 10], [6, 12]]) judged('shaded-half', q(pair[0], pair[1]), true);
    judged('shaded-quarters-form', q(1, 2), false);
    judged('shaded-quarters-form', q(4, 8), false);
    judged('equivalent-sixths', q(2, 3), false);
    judged('subtract-tenths', q(5, 10), true);
    judged('missing-decimal-pattern', q(70, 100), true);
    judged('missing-decimal-pattern', q(7, 10), true);
    judged('round-to-tenth', c(3), false); // 2.50 equals 2.5, wrong assessed form
    judged('improper-mixed-quarters', c(2), false); // 7/4 is not a mixed number
    judged('money-change-quantity', q(80, 1, 'GBP'), false);
    judged('path-mixed-lengths', q(275, 1, 'm'), false);
    judged('millimetres-to-centimetres', q(30, 1, 'mm'), false); // equal measure, requested cm
    expect(evaluate(task('money-change-quantity'), q(80, 1, 'dollars')).status).toBe('invalid-response');
  });

  it('keeps malformed/partial drafts unscored, including NaN/infinity and invalid-present-before-missing', () => {
    for (const row of QUANTITY_TASKS) {
      const field = row.responseSpec.kind === 'quantity' ? 'values' : row.responseSpec.kind === 'choice' ? 'choices' : 'pairs';
      const id = row.responseSpec.kind === 'matching' ? 'item-1' : 'answer';
      for (const response of [null, undefined, [], 3, {}, { kind: row.responseSpec.kind }, { kind: row.responseSpec.kind, [field]: [], }, { kind: row.responseSpec.kind, [field]: {}, extra: 1 }, { kind: row.responseSpec.kind, [field]: { unknown: null } }, { kind: row.responseSpec.kind, [field]: { [id]: undefined } }]) {
        expect(evaluate(row, response).status, row.descriptor.authoredKey!).toBe('invalid-response');
      }
      for (const map of [{}, { [id]: null }]) expect(evaluate(row, { kind: row.responseSpec.kind, [field]: map }).status).toBe('incomplete');
      if (row.responseSpec.kind === 'quantity') {
        const slot = row.responseSpec.slots[0];
        for (const bad of [-1, slot.numeratorBounds.max + 1, 0.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER, '2', null, undefined]) {
          expect(evaluate(row, { kind: 'quantity', values: { answer: { numerator: bad, denominator: slot.allowedDenominators[0], unit: slot.units[0] } } }).status).toBe('invalid-response');
        }
        for (const bad of [0, -1, 7, 101, 0.5, NaN, Infinity, '1', null]) expect(evaluate(row, { kind: 'quantity', values: { answer: { numerator: 0, denominator: bad, unit: slot.units[0] } } }).status).toBe('invalid-response');
        expect(evaluate(row, q(0, slot.allowedDenominators[0], slot.units[0])).status).toBe('judged');
      }
    }
    expect(evaluate(task('goods-price-pence'), { kind: 'matching', pairs: { 'item-1': null, 'item-2': 'unknown' } }).status).toBe('invalid-response');
  });

  it('rejects unreviewed/content mutations before looking at the response, without lossy null equivalence', () => {
    const original = task('money-change-quantity');
    const mutations: Record<string, unknown>[] = [
      { stimulus: NaN }, { stimulus: Infinity }, { stimulus: undefined }, { stimulus: -Infinity },
      { review: { ...original.review, status: 'withheld' } }, { assessedText: 'Changed question' },
      { hints: [] }, { workedSupport: null }, { demandRationale: '' }, { curriculum: null },
      { answerRule: { kind: 'accepted-responses', responses: [q(90, 1, 'p')] } },
      { responseSpec: { kind: 'quantity', slots: [], requiredSlotIds: [] } }, { contentRevision: '0' },
    ];
    for (const mutation of mutations) {
      const changed = { ...structuredClone(original), ...mutation } as TaskDefinition;
      expect(validateQuantityTask(changed).length).toBeGreaterThan(0);
      expect(evaluate(changed, null).status).toBe('unavailable-content');
      expect(evaluate(changed, q(80, 1, 'p')).status).toBe('unavailable-content');
    }
    for (const bad of [null, [], {}, { descriptor: {} }]) expect(evaluate(bad as TaskDefinition, null).status).toBe('unavailable-content');
    const descriptor = { ...task('third-of-counters').descriptor, parameters: { count: 10, 'fraction-numerator': 1, 'fraction-denominator': 3 } };
    const unreachable = { ...task('third-of-counters'), descriptor, canonicalQuestionId: canonicalQuestionId(descriptor) };
    expect(evaluate(unreachable, q(3, 1, 'count'))).toMatchObject({ status: 'unavailable-content', issues: [{ code: 'unreviewed-tuple' }] });
    const zero = { ...descriptor, parameters: { count: 12, 'fraction-numerator': 1, 'fraction-denominator': 0 } };
    expect(evaluate({ ...unreachable, descriptor: zero, canonicalQuestionId: canonicalQuestionId(zero) }, null).status).toBe('unavailable-content');
    const changedDiagram = structuredClone(task('path-metres')) as unknown as { stimulus: { edges: { label: unknown }[] } };
    changedDiagram.stimulus.edges[0].label = '200 m';
    expect(evaluate(changedDiagram as unknown as TaskDefinition, q(5, 1, 'm')).status).toBe('unavailable-content');
  });

  it('retains reviewed meaning across harmless object/card order and revision changes', () => {
    for (const row of QUANTITY_TASKS) {
      const copy = structuredClone(row);
      const spec = copy.responseSpec;
      if (spec.kind === 'choice') (spec.slots[0].options as unknown[]).reverse();
      if (spec.kind === 'matching') { (spec.items as unknown[]).reverse(); (spec.targets as unknown[]).reverse(); }
      if (spec.kind === 'quantity') { (spec.slots[0].units as unknown[]).reverse(); (spec.slots[0].allowedDenominators as unknown[]).reverse(); }
      const revised = { ...copy, contentRevision: '2' };
      expect(validateQuantityTask(revised)).toEqual([]);
      expect(evaluate(revised, expectedByKey.get(row.descriptor.authoredKey!))).toMatchObject({ status: 'judged', correct: true });
    }
  });

  it('matches every visual to independent source givens without deriving measurements from coordinates', () => {
    const expected = [
      ['shaded-half', 1, 2, 1], ['shaded-quarters-form', 2, 4, 1], ['improper-mixed-quarters', 7, 4, 2],
    ] as const;
    for (const [key, numerator, denominator, wholeCount] of expected) {
      const stimulus = task(key).stimulus!;
      expect(stimulus).toMatchObject({ kind: 'fraction', numerator, denominator, wholeCount });
      expect(stimulus.accessibleDescription).toBe(`${wholeCount} equal whole strips are shown. Each whole is partitioned into ${denominator} equal parts. Across the strips, ${numerator} parts are shaded.`);
      expect(numerator).toBeLessThanOrEqual(denominator * wholeCount);
    }
    for (const [key, first, second] of [['path-metres', '2 m', '3 m'], ['path-mixed-lengths', '2 m', '75 cm'], ['path-remaining-length', '3 m', '50 cm']]) {
      const stimulus = task(key).stimulus!;
      expect(stimulus.kind).toBe('diagram');
      if (stimulus.kind !== 'diagram') throw new Error('Expected path diagram.');
      expect(stimulus.edges.map(edge => edge.label)).toEqual([first, second]);
      expect(stimulus.accessibleDescription).toBe(`The route runs from Gate to Well, labelled ${first}, then from Well to Garden, labelled ${second}. The drawing is not to scale.`);
      expect(stimulus.edges.map(edge => [edge.from, edge.to])).toEqual([['a', 'b'], ['b', 'c']]);
    }
    expect(QUANTITY_TASKS.filter(row => row.stimulus !== null)).toHaveLength(6);
  });

  it('supplies exact support-accessible required pools and only prescribed optional revisits', () => {
    const expectedPools = {
      'q5-story-m05-quantity': ['shaded-half', 'shaded-quarters-form', 'third-of-counters', 'equivalent-sixths', 'three-quarters-of-beads', 'add-eighths', 'subtract-tenths', 'reverse-three-fifths'],
      'q8-story-m07-path': ['path-metres', 'path-mixed-lengths', 'path-remaining-length'],
      'q10-story-m07-goods': ['goods-price-pence', 'goods-change-pence', 'goods-basket-change'],
    };
    const stories = QUANTITY_BINDING_PROPOSALS.filter(row => row.role === 'story');
    expect(stories.map(row => row.bindingId)).toEqual(Object.keys(expectedPools));
    for (const [id, pool] of Object.entries(expectedPools)) {
      const row = stories.find(binding => binding.bindingId === id)!;
      expect(row.taskIds).toEqual(pool.map(key => task(key).canonicalQuestionId));
      expect(pool.some(key => task(key).band === 'support')).toBe(true);
    }
    for (const binding of QUANTITY_BINDING_PROPOSALS) {
      expect(binding).toMatchObject({ availability: 'M2', sourceBindingId: null });
      if (binding.role === 'revisit') expect(binding.bindingId).toBe(`${binding.questId.toLowerCase()}-revisit-${binding.skillId.toLowerCase()}-${binding.responseKind}`);
      expect(binding.taskIds.length).toBeGreaterThan(0);
      for (const id of binding.taskIds) expect(QUANTITY_TASKS.find(row => row.canonicalQuestionId === id)).toMatchObject({ skillId: binding.skillId, responseSpec: { kind: binding.responseKind } });
    }
    expect(new Set(QUANTITY_BINDING_PROPOSALS.flatMap(row => row.taskIds)).size).toBe(30);
    expect(QUANTITY_BINDING_PROPOSALS.some(row => ['Q1', 'Q2', 'Q3'].includes(row.questId) && row.role === 'story')).toBe(false);
  });

  it('runs every manifest case through the full family evaluation boundary', () => {
    for (const row of QUANTITY_MANIFEST.cases) {
      const definition = QUANTITY_TASKS.find(item => item.canonicalQuestionId === row.canonicalQuestionId)!;
      const result = evaluate(definition, row.response);
      expect(result.status, row.caseId).toBe(row.expectedStatus);
      if (result.status === 'judged') { expect(result.correct).toBe(row.expectedCorrect); expect(result.feedback.issues.map(issue => issue.code)).toEqual(row.expectedIssueCodes); }
    }
  });
});
