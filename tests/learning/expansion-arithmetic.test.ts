import { describe, expect, it } from 'vitest';
import type { ActivityResponse, TaskDefinition } from '../../src/learning/contracts';
import { ARITHMETIC_TASKS as tasks, ARITHMETIC_MANIFEST as manifest, ARITHMETIC_BINDING_PROPOSALS as bindings } from '../../src/content/expansion-maths/arithmetic';
import { evaluateExpansionArithmetic as evaluate, validateArithmeticTask as validate } from '../../src/learning/evaluators/expansion-arithmetic';
import { canonicalQuestionId } from '../../src/learning/identity';
import { buildBridgeTasks, buildMerchantTasks } from '../../src/content/starter-maths';
import { evaluateStarterMaths } from '../../src/learning/evaluators/starter-maths';

const count = (values: Record<string, number>): ActivityResponse => ({ kind: 'quantity', values: Object.fromEntries(Object.entries(values).map(([id, numerator]) => [id, { numerator, denominator: 1, unit: 'count' }])) });
// Manually calculated before evaluating the content. No production answer rule,
// generator or manifest supplied these forty expected numeric/map outcomes.
const oracle: readonly ActivityResponse[] = [
  count({ answer: 43 }), count({ answer: 36 }), count({ answer: 43 }), count({ answer: 4443 }), count({ answer: 2322 }),
  count({ answer: 3154 }), count({ answer: 1555 }), count({ answer: 845 }), count({ answer: 855 }), count({ answer: 1865 }),
  { kind: 'matching', pairs: { displayed: 'forward' } }, count({ answer: 12 }), count({ answer: 32 }),
  { kind: 'matching', pairs: { first: 't-first', second: 't-second', third: 't-third' } },
  { kind: 'matching', pairs: { first: 't-first', second: 't-second', third: 't-third' } },
  { kind: 'matching', pairs: { first: 't-first', second: 't-second', third: 't-third' } },
  count({ answer: 49 }), count({ answer: 12 }),
  { kind: 'sorting', groups: { a: 'left', b: 'left', c: 'left', d: 'right', e: 'right', f: 'right' } }, count({ answer: 36 }),
  count({ answer: 6 }), count({ answer: 4 }), count({ answer: 4 }), count({ answer: 12 }), count({ answer: 11 }),
  { kind: 'matching', pairs: { 'by-a': 'b', 'by-b': 'a' } }, { kind: 'matching', pairs: { 'by-a': 'b', 'by-b': 'a' } },
  count({ answer: 4 }), count({ answer: 8 }), count({ answer: 12 }),
  count({ answer: 8 }), count({ answer: 15 }), count({ answer: 24 }), count({ large: 24, total: 32 }), count({ large: 48, total: 72 }),
  count({ answer: 12 }), count({ answer: 56 }), count({ small: 12, large: 48 }), count({ small: 9, large: 27 }), count({ small: 12, large: 24 }),
];
const inverse = (task: TaskDefinition, response: ActivityResponse) => {
  const p = task.descriptor.parameters;
  const n = (key: string) => Number(p[key]);
  const q = (key: string) => response.kind === 'quantity' ? response.values[key]!.numerator : NaN;
  switch (p.operation) {
    case 'add': return q('answer') - n('a') === n('b');
    case 'subtract': return q('answer') + n('b') === n('a');
    case 'missing-addend': return q('answer') + n('a') === n('total');
    case 'balance': return q('answer') + n('c') === n('a') + n('b');
    case 'reverse-change': return q('answer') + n('added') - n('removed') === n('final');
    case 'missing-delivery': return n('start') + q('answer') - n('used') === n('final');
    case 'two-deliveries': return n('start') + n('first') + q('answer') - n('used') === n('final');
    case 'array-total': return q('answer') / n('groups') === n('items');
    case 'missing-factor': return q('answer') * n('factor') === n('total');
    case 'continue-pattern': return q('answer') - (n('start') + 2) * n('step') === n('step');
    case 'missing-pattern': return q('answer') + n('step') === (n('start') + 2) * n('step');
    case 'array-share': return q('answer') * n('divisor') === n('groups') * n('items');
    case 'divide': return q('answer') * n('divisor') === n('total');
    case 'regroup': return q('answer') * n('divisor') === n('groups') * n('items');
    case 'remove-share': return q('answer') * n('divisor') + n('removed') === n('total');
    case 'combine-share': return q('answer') * n('divisor') === n('first') + n('second');
    case 'represented-scale': return q('answer') / n('multiplier') === n('base');
    case 'scale-total': return q('large') === n('base') * n('multiplier') && q('total') - q('large') === n('base');
    case 'undo-scale': return q('answer') * n('multiplier') === n('scaled');
    case 'scale-extra': return (q('answer') - n('extra')) / n('multiplier') === n('base');
    case 'total-constraints': return q('small') + q('large') === n('total') && q('large') === q('small') * n('multiplier');
    case 'difference-constraints': return q('large') - q('small') === n('difference') && q('large') === q('small') * n('multiplier');
    case 'after-removal': return q('small') + q('large') - n('removed') === n('remaining') && q('large') === q('small') * n('multiplier');
    default: return true; // Matching/sorting checked by independent numeric label oracles below.
  }
};
const judged = (task: TaskDefinition, response: unknown, correct: boolean) => {
  const result = evaluate(task, response);
  expect(result.status).toBe('judged');
  if (result.status === 'judged') expect(result.correct).toBe(correct);
};

describe('reviewed finite arithmetic bank', () => {
  it('delivers forty distinct complete reviewed tuples, with actual 4/3/3 demand and binding pools', () => {
    expect(tasks).toHaveLength(40); expect(oracle).toHaveLength(40);
    expect(new Set(tasks.map(task => task.canonicalQuestionId)).size).toBe(40);
    for (const skill of ['M01', 'M02', 'M03', 'M04']) {
      expect(tasks.filter(task => task.skillId === skill && task.band === 'core')).toHaveLength(4);
      expect(tasks.filter(task => task.skillId === skill && task.band === 'support')).toHaveLength(3);
      expect(tasks.filter(task => task.skillId === skill && task.band === 'stretch')).toHaveLength(3);
      expect(bindings.some(row => row.skillId === skill)).toBe(true);
    }
    for (const row of bindings) {
      expect(row.availability).toBe('M2'); expect(row.sourceBindingId).toBeNull();
      expect(row.taskIds.length).toBeGreaterThan(0);
      expect(['Q1', 'Q3'].includes(row.questId) && row.role === 'story').toBe(false);
      for (const id of row.taskIds) {
        const task = tasks.find(task => task.canonicalQuestionId === id)!;
        expect(task.skillId).toBe(row.skillId); expect(task.responseSpec.kind).toBe(row.responseKind);
      }
    }
    const story = bindings.filter(row => row.role === 'story');
    expect(story.map(row => row.bindingId)).toEqual(['q4-story-m02-match']);
    expect(story[0].taskIds.some(id => tasks.find(task => task.canonicalQuestionId === id)!.band === 'support')).toBe(true);
    tasks.forEach((task, i) => {
      expect(validate(task)).toEqual([]); expect(validate(JSON.parse(JSON.stringify(task)))).toEqual([]);
      expect(inverse(task, oracle[i])).toBe(true); judged(task, oracle[i], true);
      expect(task.hints).toHaveLength(2); expect(task.hints[0].id).not.toBe(task.hints[1].id);
      expect(task.hints[1].text).not.toBe(task.workedSupport.text);
      expect(task.demandRationale.length).toBeGreaterThan(80); expect(task.review.status).toBe('approved');
      expect(task.curriculum.sourceUrl).toContain('gov.uk');
    });
  });

  it('uses independent product and inverse numeric labels, including maximum 12×12 and equivalent targets', () => {
    const productRows = [[42, 72, 132], [54, 56, 48], [88, 144, 49]];
    for (let i = 0; i < 3; i++) {
      const task = tasks[13 + i];
      if (task.responseSpec.kind !== 'matching') throw new Error('Expected product matching');
      expect(task.responseSpec.targets.map(row => row.label)).toEqual([...productRows[i].map(n => `${n} counters`), `${productRows[i][0]} in total`]);
      judged(task, { kind: 'matching', pairs: { first: 't-equivalent', second: 't-second', third: 't-third' } }, true);
      judged(task, { kind: 'matching', pairs: { first: 't-second', second: 't-first', third: 't-third' } }, false);
    }
    expect(tasks[25].assessedText).toContain('8 × 9 = 72');
    expect(tasks[26].assessedText).toContain('7 × 12 = 84');
    const sorting = tasks[18];
    if (sorting.responseSpec.kind !== 'sorting') throw new Error('Expected sorting');
    expect(sorting.responseSpec.groups.map(row => row.label)).toEqual(['48 counters', '63 counters']);
    expect(sorting.responseSpec.items.map(row => row.label)).toEqual(['6 × 8', '8 × 6', '(5 × 8) + 8', '7 × 9', '9 × 7', '(6 × 9) + 9']);
  });

  it('keeps array source-data aligned with given groups, without substituting requested products', () => {
    const arrayOracle = [[10, 2, 5], [11, 3, 4], [12, 4, 8], [20, 1, 12], [21, 1, 12], [22, 2, 10], [30, 1, 4], [31, 1, 5], [32, 1, 6]];
    expect(tasks.filter(task => task.stimulus !== null)).toHaveLength(9);
    for (const [index, groups, itemsPerGroup] of arrayOracle) {
      expect(tasks[index].stimulus).toEqual({ kind: 'array', groups, itemsPerGroup, labels: [`${groups} equal groups`, `${itemsPerGroup} counters in each group`], accessibleDescription: `${groups} equal groups are shown. Each group contains ${itemsPerGroup} counters.` });
      expect(tasks[index].stimulus!.accessibleDescription).not.toMatch(/altogether|answer|product|total/);
      if (oracle[index].kind === 'quantity') expect(tasks[index].stimulus!.accessibleDescription).not.toMatch(new RegExp(`\\b${oracle[index].values.answer!.numerator}\\b`));
    }
  });

  it('validates every manifest case and preserves unscored tags', () => {
    expect(manifest.taskIds).toEqual(tasks.map(task => task.canonicalQuestionId));
    expect(manifest.cases).toHaveLength(164);
    for (const fixture of manifest.cases) {
      const result = evaluate(tasks.find(task => task.canonicalQuestionId === fixture.canonicalQuestionId)!, fixture.response);
      expect(result.status, fixture.caseId).toBe(fixture.expectedStatus);
      if (result.status === 'judged') { expect(result.correct, fixture.caseId).toBe(fixture.expectedCorrect); expect(result.feedback.issues.map(issue => issue.code), fixture.caseId).toEqual(fixture.expectedIssueCodes); }
      else expect(result).not.toHaveProperty('correct');
    }
  });
});

describe('classification and complete-domain comparison', () => {
  it('exhausts all single-count controls using the independent oracle, including 0/10000/12/24/144 boundaries', () => {
    let checked = 0;
    tasks.forEach((task, i) => {
      if (task.responseSpec.kind !== 'quantity' || task.responseSpec.slots.length !== 1 || oracle[i].kind !== 'quantity') return;
      const slot = task.responseSpec.slots[0];
      const answer = oracle[i].values.answer!.numerator;
      for (let value = slot.numeratorBounds.min; value <= slot.numeratorBounds.max; value++) {
        checked++;
        const result = evaluate(task, count({ answer: value }));
        if (result.status !== 'judged' || result.correct !== (value === answer)) throw new Error(`Unexpected verdict ${i + 1}/${value}`);
      }
    });
    expect(checked).toBe(71444);
  });

  it('exhausts matching choices with duplicate-target structural rejection and all equivalent cards', () => {
    for (const task of tasks) {
      if (task.responseSpec.kind !== 'matching') continue;
      const spec = task.responseSpec;
      const walk = (pairs: Record<string, string>, index: number) => {
        if (index < spec.items.length) { for (const target of spec.targets) walk({ ...pairs, [spec.items[index].id]: target.id }, index + 1); return; }
        const result = evaluate(task, { kind: 'matching', pairs });
        if (new Set(Object.values(pairs)).size !== Object.keys(pairs).length) expect(result.status).toBe('invalid-response');
        else {
          const expected = task.descriptor.parameters.operation === 'array-expression' ? ['forward', 'reverse'].includes(pairs.displayed)
            : task.skillId === 'M02' ? ['t-first', 't-equivalent'].includes(pairs.first) && pairs.second === 't-second' && pairs.third === 't-third' : pairs['by-a'] === 'b' && pairs['by-b'] === 'a';
          expect(result.status).toBe('judged'); if (result.status === 'judged') expect(result.correct).toBe(expected);
        }
      };
      walk({}, 0);
    }
    for (let mask = 0; mask < 64; mask++) {
      const groups = Object.fromEntries(['a', 'b', 'c', 'd', 'e', 'f'].map((id, index) => [id, mask & (1 << index) ? 'right' : 'left']));
      judged(tasks[18], { kind: 'sorting', groups }, mask === 56);
    }
  });

  it('separates wrong constraints from empty drafts and malformed counts/maps', () => {
    const totalTask = tasks[37];
    judged(totalTask, count({ small: 15, large: 45 }), false); // total 60, wrong multiplier
    judged(totalTask, count({ small: 10, large: 40 }), false); // multiplier 4, wrong total
    judged(totalTask, count({ small: 0, large: 0 }), false); // real complete zero counts
    expect(evaluate(totalTask, { kind: 'quantity', values: { small: null, large: null } }).status).toBe('incomplete');
    expect(evaluate(totalTask, { kind: 'quantity', values: { small: { numerator: 97, denominator: 1, unit: 'count' } } }).status).toBe('invalid-response');
    const difference = tasks[38]; judged(difference, count({ small: 6, large: 24 }), false); judged(difference, count({ small: 6, large: 18 }), false);
    const after = tasks[39]; judged(after, count({ small: 12, large: 17 }), false);
    for (const malformed of [undefined, null, [], {}, { kind: 'merchant', apples: 6, pears: 3 }, { kind: 'quantity', values: {}, extra: true },
      ...[NaN, Infinity, 1.5, -1, 10001, '43', undefined].map(numerator => ({ kind: 'quantity', values: { answer: { numerator, denominator: 1, unit: 'count' } } })),
      { kind: 'quantity', values: { answer: { numerator: 43, denominator: 2, unit: 'count' } } },
      { kind: 'quantity', values: { answer: { numerator: 43, denominator: 1, unit: 'apples' } } },
      { kind: 'quantity', values: { answer: { numerator: 43, denominator: 1, unit: 'count', extra: true } } },
      { kind: 'quantity', values: { answer: null, unknown: null } },
    ]) expect(evaluate(tasks[0], malformed).status).toBe('invalid-response');
    expect(evaluate(tasks[13], { kind: 'matching', pairs: { first: 't-first', second: 't-first' } }).status).toBe('invalid-response');
    expect(evaluate(tasks[13], { kind: 'matching', pairs: { first: 't-first', second: null } }).status).toBe('incomplete');
    expect(evaluate(tasks[18], { kind: 'sorting', groups: { a: 'left' } }).status).toBe('incomplete');
    expect(evaluate(tasks[18], { kind: 'sorting', groups: { a: 'bogus' } }).status).toBe('invalid-response');
  });

  it('checks every two-count control combination independently, including all permitted wrong alternatives', () => {
    let checked = 0;
    for (const [index, task] of tasks.entries()) {
      if (task.responseSpec.kind !== 'quantity' || task.responseSpec.slots.length !== 2) continue;
      const [left, right] = task.responseSpec.slots;
      for (let a = 0; a <= left.numeratorBounds.max; a++) for (let b = 0; b <= right.numeratorBounds.max; b++) {
        checked++;
        const result = evaluate(task, count({ [left.id]: a, [right.id]: b }));
        const expected = oracle[index];
        if (expected.kind !== 'quantity') throw new Error('Expected count oracle');
        if (result.status !== 'judged' || result.correct !== (a === expected.values[left.id]!.numerator && b === expected.values[right.id]!.numerator)) throw new Error(`Unexpected two-count verdict ${index + 1}/${a}/${b}`);
      }
    }
    expect(checked).toBe(57509);
  });
});

describe('content faults, immutable starter compatibility and purity', () => {
  it.each([NaN, Infinity, -Infinity])('rejects reviewer non-finite stimulus %s before scoring the original correct response', stimulus => {
    const task = { ...tasks[0], stimulus } as unknown as TaskDefinition;
    const issues = validate(task);
    const result = evaluate(task, count({ answer: 43 }));
    // Assert the full original input path even if either gate regresses.
    expect({ contentRejected: issues.length > 0, status: result.status }).toEqual({ contentRejected: true, status: 'unavailable-content' });
    expect(issues.some(issue => issue.field === 'stimulus')).toBe(true);
    expect(result).not.toHaveProperty('correct');
  });

  it('preserves valid reconstructed null/array content while rejecting undeclared JSON values and malformed responses separately', () => {
    for (const stimulus of [undefined, () => null, Object(NaN), { toJSON: () => null }, Symbol('stimulus'), 1n]) {
      const task = { ...tasks[0], stimulus } as unknown as TaskDefinition;
      expect(validate(task).length).toBeGreaterThan(0);
      expect(evaluate(task, count({ answer: 43 })).status).toBe('unavailable-content');
    }
    for (const value of [NaN, Infinity, -Infinity]) {
      const represented = tasks[10];
      if (represented.stimulus?.kind !== 'array') throw new Error('Expected represented array');
      const task = { ...represented, stimulus: { ...represented.stimulus, groups: value } };
      expect(validate(task).length).toBeGreaterThan(0);
      expect(evaluate(task, oracle[10]).status).toBe('unavailable-content');
      expect(evaluate(tasks[0], count({ answer: value })).status).toBe('invalid-response');
    }
    tasks.forEach((task, index) => {
      const reconstructed = JSON.parse(JSON.stringify(task)) as TaskDefinition;
      expect(validate(reconstructed)).toEqual([]);
      judged(reconstructed, oracle[index], true);
    });
  });

  it('rejects altered source/representation/answers/help/domain before judging a response', () => {
    const base = tasks[10];
    const mutations: TaskDefinition[] = [
      { ...base, skillId: 'M03' }, { ...base, band: 'stretch' }, { ...base, stimulus: null },
      { ...base, stimulus: { kind: 'array', groups: 0, itemsPerGroup: 5, labels: [], accessibleDescription: '10 counters altogether.' } },
      { ...base, assessedText: 'How many counters? Answer 10.' }, { ...base, review: { ...base.review, status: 'withheld' } },
      { ...base, hints: [{ id: 'answer', text: 'Use 10.' }, base.hints[1]] }, { ...base, answerRule: { kind: 'accepted-responses', responses: [count({ answer: 11 })] } },
      { ...base, descriptor: { ...base.descriptor, parameters: { operation: 'array-total', groups: 0, items: 5 } } },
      { ...base, descriptor: { ...base.descriptor, parameters: { ...base.descriptor.parameters, seed: 1 } } },
      { ...base, curriculum: { ...base.curriculum, sourceUrl: 'https://example.com' } },
      { ...base, responseSpec: { kind: 'quantity', slots: [], requiredSlotIds: [] } },
    ];
    for (const changed of mutations) { expect(validate(changed).length).toBeGreaterThan(0); expect(evaluate(changed, oracle[10]).status).toBe('unavailable-content'); }
    for (const changed of [null, {}, { ...base, descriptor: {} }]) expect(evaluate(changed as TaskDefinition, null).status).toBe('unavailable-content');
    const p = { ...tasks[23].descriptor.parameters, divisor: 0 };
    const descriptor = { ...tasks[23].descriptor, parameters: p };
    expect(evaluate({ ...tasks[23], descriptor, canonicalQuestionId: canonicalQuestionId(descriptor) }, count({ answer: 12 })).status).toBe('unavailable-content');
    const nonexact = { ...tasks[23].descriptor, parameters: { operation: 'divide', total: 85, divisor: 7 } };
    expect(evaluate({ ...tasks[23], descriptor: nonexact, canonicalQuestionId: canonicalQuestionId(nonexact) }, count({ answer: 12 })).status).toBe('unavailable-content');
  });

  it('accepts key/presentation order and independent content revision without changing equivalence', () => {
    const task = tasks[13];
    if (task.responseSpec.kind !== 'matching') throw new Error('Expected matching');
    const reordered = { ...task, contentRevision: '2', descriptor: { ...task.descriptor, parameters: Object.fromEntries(Object.entries(task.descriptor.parameters).reverse()) }, responseSpec: { ...task.responseSpec, items: [...task.responseSpec.items].reverse(), targets: [...task.responseSpec.targets].reverse(), requiredItemIds: [...task.responseSpec.requiredItemIds].reverse() } };
    expect(canonicalQuestionId(reordered.descriptor)).toBe(task.canonicalQuestionId); expect(validate(reordered)).toEqual([]);
    judged(reordered, { kind: 'matching', pairs: { third: 't-third', second: 't-second', first: 't-equivalent' } }, true);
    const before = JSON.stringify(task); const response = oracle[13]; const responseBefore = JSON.stringify(response);
    evaluate(task, response); expect(JSON.stringify(task)).toBe(before); expect(JSON.stringify(response)).toBe(responseBefore);
    expect(Object.isFrozen(task.descriptor.parameters)).toBe(true);
  });

  it('retains all 24 starter IDs and the exact bridge/merchant controls and anchor alternatives', () => {
    const starter = [...buildBridgeTasks(), ...buildMerchantTasks()];
    expect(manifest.retainedTaskIds).toEqual(starter.map(task => task.canonicalQuestionId)); expect(manifest.retainedTaskIds).toHaveLength(24);
    expect(tasks.some(task => manifest.retainedTaskIds.includes(task.canonicalQuestionId))).toBe(false);
    const bridge = starter.find(task => task.canonicalQuestionId === 'lif.math.bridge.r1.total-12')!;
    expect(bridge.responseSpec).toEqual({ kind: 'bridge', plankLengths: [1, 2, 3, 4, 5, 6], cardinality: { min: 1, max: 6 } });
    for (const planks of [[6, 6], [4, 4, 4], [1, 2, 3, 6]]) {
      const result = evaluateStarterMaths(bridge, { kind: 'bridge', planks }); expect(result.status === 'judged' && result.correct).toBe(true);
    }
    const merchant = starter.find(task => task.canonicalQuestionId === 'lif.math.merchant.r1.mult-2.pears-3')!;
    expect(merchant.responseSpec).toEqual({ kind: 'merchant', countBounds: { min: 0, max: 24 }, maxTotal: 24 });
    const result = evaluateStarterMaths(merchant, { kind: 'merchant', apples: 6, pears: 3 }); expect(result.status === 'judged' && result.correct).toBe(true);
    expect(evaluateStarterMaths(merchant, { kind: 'merchant', apples: 25, pears: 0 }).status).toBe('invalid-response');
    expect(evaluate(merchant, { kind: 'merchant', apples: 6, pears: 3 }).status).toBe('unavailable-content');
  });
});
