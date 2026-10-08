import { describe, expect, it } from 'vitest';
import type { ActivityResponse, EvaluationResult, TaskDefinition } from '../../src/learning/contracts';
import { canonicalQuestionId } from '../../src/learning/identity';
import { buildBridgeTasks, buildMerchantTasks, STARTER_MATHS_MANIFEST } from '../../src/content/starter-maths';
import { evaluateStarterMaths, validateStarterMathsTask } from '../../src/learning/evaluators/starter-maths';

const bridges = buildBridgeTasks(); const merchants = buildMerchantTasks();
const tasks = [...bridges, ...merchants];
const bridge = bridges[6]; const merchant = merchants[2];
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const issueCodes = (result: EvaluationResult) => result.status === 'judged' ? result.feedback.issues.map(i => i.code) : [];
// Independently specified finite inventory: no production solver supplies these answers.
const bridgeAnswers = [[6], [3, 4], [4, 4], [3, 3, 3], [5, 5], [5, 6], [4, 4, 4], [3, 5, 5], [4, 5, 5], [5, 5, 5], [4, 6, 6], [5, 6, 6]];
const merchantAnswers = [
  [2, 1, 3], [4, 2, 6], [6, 3, 9], [8, 4, 12], [10, 5, 15], [12, 6, 18],
  [3, 1, 4], [6, 2, 8], [9, 3, 12], [12, 4, 16], [15, 5, 20], [18, 6, 24],
] as const;

describe('starter maths inventory and reviewed help', () => {
  it('has exactly 12 + 12 reproducible canonical records in the specified order', () => {
    expect(bridges.map(t => t.canonicalQuestionId)).toEqual(Array.from({ length: 12 }, (_, i) => `lif.math.bridge.r1.total-${i + 6}`));
    expect(merchants.map(t => t.canonicalQuestionId)).toEqual([2, 3].flatMap(m => [1, 2, 3, 4, 5, 6].map(p => `lif.math.merchant.r1.mult-${m}.pears-${p}`)));
    expect(new Set(tasks.map(t => t.canonicalQuestionId)).size).toBe(24);
    expect(buildBridgeTasks()).toEqual(bridges); expect(buildMerchantTasks()).toEqual(merchants);
    for (const task of tasks) {
      expect(validateStarterMathsTask(task)).toEqual([]);
      expect(clone(task)).toEqual(task);
      expect(canonicalQuestionId(clone(task.descriptor))).toBe(task.canonicalQuestionId);
      expect(task.band).toBe('support'); expect(task.review.status).toBe('approved');
      expect(task.hints).toHaveLength(2);
      expect(new Set([...task.hints.map(h => h.id), task.workedSupport.id]).size).toBe(3);
      expect(task.narration.neutralText).toBe(task.instructionText);
      expect(task.narration.neutralText).not.toMatch(/solution| = |\b(?:nine|twice|span)\b/i);
      expect(task.hints.map(h => h.text).join(' ')).not.toMatch(/solution| = |\d+ pears and \d+ apples/);
    }
    expect(bridge.assessedText).toBe('The bridge must span 12 metres. Make the chosen plank lengths add up to 12 metres.');
    expect(merchant.assessedText).toBe('Please pack twice as many apples as pears. I need nine pieces of fruit altogether.');
    expect(merchant.skillId).toBe('M04'); expect(merchant.contextualSkillIds).toEqual(['M02', 'E08']);
    expect(merchant.demandRationale).toContain('mixed-task M04');
    expect(bridge.contextualSkillIds).toEqual(['M07']);
  });
  it('checks an independent reachable solution and complete wrong answer for every record', () => {
    bridges.forEach((task, i) => {
      expect(bridgeAnswers[i].reduce((a, b) => a + b, 0)).toBe(i + 6);
      expect(evaluateStarterMaths(task, { kind: 'bridge', planks: bridgeAnswers[i] })).toMatchObject({ status: 'judged', correct: true });
      const wrong = evaluateStarterMaths(task, { kind: 'bridge', planks: [1] });
      expect(wrong).toMatchObject({ status: 'judged', correct: false }); expect(issueCodes(wrong)).toEqual(['sum-under']);
    });
    merchants.forEach((task, i) => {
      const [apples, pears, total] = merchantAnswers[i];
      expect(apples + pears).toBe(total);
      expect(apples / pears).toBe(i < 6 ? 2 : 3);
      expect(task.answerRule).toEqual({ kind: 'merchant-constraints', multiplier: i < 6 ? 2 : 3, total });
      expect(evaluateStarterMaths(task, { kind: 'merchant', apples, pears })).toMatchObject({ status: 'judged', correct: true });
      const wrong = evaluateStarterMaths(task, { kind: 'merchant', apples: 1, pears: 0 });
      expect(wrong).toMatchObject({ status: 'judged', correct: false }); expect(issueCodes(wrong)).toEqual(['total-mismatch', 'relationship-mismatch']);
      expect(task.workedSupport.text).toContain(`${pears} ${pears === 1 ? 'pear' : 'pears'} and ${apples} apples`);
    });
  });
  it('hands over every manifest case through the actual evaluator', () => {
    expect(STARTER_MATHS_MANIFEST.taskIds).toEqual(tasks.map(t => t.canonicalQuestionId));
    expect(STARTER_MATHS_MANIFEST.retainedTaskIds).toEqual([]);
    expect(new Set(STARTER_MATHS_MANIFEST.cases.map(c => c.caseId)).size).toBe(52);
    for (const item of STARTER_MATHS_MANIFEST.cases) {
      const task = tasks.find(t => t.canonicalQuestionId === item.canonicalQuestionId)!;
      const result = evaluateStarterMaths(task, item.response);
      expect(result.status, item.caseId).toBe(item.expectedStatus);
      if (result.status === 'judged') expect(result.correct, item.caseId).toBe(item.expectedCorrect);
      expect(issueCodes(result), item.caseId).toEqual(item.expectedIssueCodes);
    }
    expect(clone(STARTER_MATHS_MANIFEST)).toEqual(STARTER_MATHS_MANIFEST);
  });
});

describe('bridge mathematical constraints', () => {
  it.each([[6, 6], [4, 4, 4], [1, 2, 3, 6], [6, 3, 2, 1]])('accepts anchor construction %s', (...planks) => {
    expect(evaluateStarterMaths(bridge, { kind: 'bridge', planks })).toMatchObject({ status: 'judged', correct: true, canonicalQuestionId: 'lif.math.bridge.r1.total-12' });
  });
  it('exhausts every ordered legal 1–6 plank response against all 12 targets', () => {
    let responses = 0; let judgements = 0;
    // The oracle total is accumulated while enumerating; it is not obtained
    // from the production answer rule, worked example or evaluation output.
    const visit = (planks: number[], total: number) => {
      if (planks.length) {
        responses++;
        for (let index = 0; index < bridges.length; index++) {
          const target = index + 6;
          const result = evaluateStarterMaths(bridges[index], { kind: 'bridge', planks });
          const expectedCode = total < target ? 'sum-under' : 'sum-over';
          if (result.status !== 'judged' || result.correct !== (total === target)
            || issueCodes(result).join(',') !== (total === target ? '' : expectedCode)) {
            throw new Error(`Bridge target ${target}, [${planks}]: expected total ${total}`);
          }
          judgements++;
        }
      }
      if (planks.length < 6) for (let length = 1; length <= 6; length++) visit([...planks, length], total + length);
    };
    visit([], 0);
    expect(responses).toBe(55986); expect(judgements).toBe(671832);
  }, 30000);
  it.each([
    [{ kind: 'bridge', planks: [] }, 'incomplete'],
    [{ kind: 'bridge', planks: [1, 1, 1, 1, 1, 1] }, 'judged'],
    [{ kind: 'bridge', planks: [1, 1, 1, 1, 1, 1, 6] }, 'invalid-response'],
    [{ kind: 'bridge', planks: [6, 6, 1] }, 'judged'],
    [{ kind: 'bridge', planks: [0] }, 'invalid-response'],
    [{ kind: 'bridge', planks: [7] }, 'invalid-response'],
    [{ kind: 'bridge', planks: [1.5] }, 'invalid-response'],
    [{ kind: 'bridge', planks: ['6'] }, 'invalid-response'],
    [{ kind: 'bridge', planks: [NaN] }, 'invalid-response'],
    [{ kind: 'bridge', planks: [Infinity] }, 'invalid-response'],
    [{ kind: 'bridge', planks: Array(2) }, 'invalid-response'],
    [{ kind: 'bridge', planks: null }, 'invalid-response'],
    [{ kind: 'bridge' }, 'invalid-response'],
    [{ kind: 'bridge', planks: [6, 6], x: 10 }, 'invalid-response'],
    [{ kind: 'merchant', apples: 6, pears: 3 }, 'invalid-response'],
    [null, 'invalid-response'],
  ] as const)('classifies bridge boundary %s as %s', (response, status) => {
    const result = evaluateStarterMaths(bridge, response); expect(result.status).toBe(status);
    if (status !== 'judged') expect(result).not.toHaveProperty('correct');
  });
  it('gives observed under/over facts without a preferred arrangement or diagnosis', () => {
    const under = evaluateStarterMaths(bridge, { kind: 'bridge', planks: [5, 6] });
    const over = evaluateStarterMaths(bridge, { kind: 'bridge', planks: [6, 6, 1] });
    expect(issueCodes(under)).toEqual(['sum-under']); expect(issueCodes(over)).toEqual(['sum-over']);
    if (under.status !== 'judged' || over.status !== 'judged') throw new Error('Expected judgements');
    expect(under.feedback.issues[0]).toMatchObject({ constraintId: 'target', observed: '11 metres' });
    expect(over.feedback.issues[0].explanation).toContain('1 metre over');
    expect(under.feedback.explanation).toContain('Any arrangement');
  });
});

describe('merchant mathematical constraints', () => {
  it.each([
    [6, 3, true, []], [5, 4, false, ['relationship-mismatch']],
    [4, 2, false, ['total-mismatch']], [2, 2, false, ['total-mismatch', 'relationship-mismatch']],
  ] as const)('judges anchor (%s,%s) against both constraints', (apples, pears, correct, codes) => {
    const result = evaluateStarterMaths(merchant, { kind: 'merchant', apples, pears });
    expect(result).toMatchObject({ status: 'judged', correct, skillId: 'M04', objectiveId: 'M04-integer-scaling' });
    expect(issueCodes(result)).toEqual(codes);
  });
  it('exhausts all 325 legal counter pairs against all 12 requests', () => {
    let checked = 0;
    merchants.forEach((task, index) => {
      const [expectedApples, expectedPears, total] = merchantAnswers[index];
      const multiplier = index < 6 ? 2 : 3;
      for (let apples = 0; apples <= 24; apples++) for (let pears = 0; pears <= 24 - apples; pears++) {
        const result = evaluateStarterMaths(task, { kind: 'merchant', apples, pears });
        if (apples + pears === 0) expect(result.status).toBe('incomplete');
        else {
          expect(result).toMatchObject({ status: 'judged', correct: apples === expectedApples && pears === expectedPears });
          expect(issueCodes(result)).toEqual([...(apples + pears !== total ? ['total-mismatch'] : []), ...(apples !== multiplier * pears ? ['relationship-mismatch'] : [])]);
        }
        checked++;
      }
    });
    expect(checked).toBe(3900);
  });
  it.each([
    [{ kind: 'merchant', apples: null, pears: 3 }, 'incomplete'],
    [{ kind: 'merchant', apples: 6, pears: null }, 'incomplete'],
    [{ kind: 'merchant', apples: null, pears: null }, 'incomplete'],
    [{ kind: 'merchant', apples: 0, pears: 0 }, 'incomplete'],
    [{ kind: 'merchant', apples: 0, pears: 3 }, 'judged'],
    [{ kind: 'merchant', apples: 6, pears: 0 }, 'judged'],
    [{ kind: 'merchant', apples: 18, pears: 6 }, 'judged'],
    [{ kind: 'merchant', apples: 22, pears: 3 }, 'invalid-response'],
    [{ kind: 'merchant', apples: 25, pears: null }, 'invalid-response'],
    [{ kind: 'merchant', apples: 6.5, pears: 3 }, 'invalid-response'],
    [{ kind: 'merchant', apples: -1, pears: 3 }, 'invalid-response'],
    [{ kind: 'merchant', apples: '6', pears: 3 }, 'invalid-response'],
    [{ kind: 'merchant', apples: true, pears: 3 }, 'invalid-response'],
    [{ kind: 'merchant', apples: NaN, pears: 3 }, 'invalid-response'],
    [{ kind: 'merchant', apples: Infinity, pears: 3 }, 'invalid-response'],
    [{ kind: 'merchant', apples: 6 }, 'invalid-response'],
    [{ kind: 'merchant', apples: 6, pears: 3, correct: true }, 'invalid-response'],
    [{ kind: 'bridge', planks: [6, 6] }, 'invalid-response'],
    [[], 'invalid-response'],
  ] as const)('classifies basket boundary %s as %s', (response, status) => {
    const result = evaluateStarterMaths(merchant, response); expect(result.status).toBe(status);
    if (status !== 'judged') expect(result).not.toHaveProperty('correct');
  });
});

describe('content faults, purity and canonical compatibility', () => {
  it.each([
    ['canonical ID', { ...bridge, canonicalQuestionId: 'lif.math.bridge.r1.total-13' }],
    ['unreachable target', { ...bridge, descriptor: { ...bridge.descriptor, parameters: { target: 37 } } }],
    ['extra identity input', { ...bridge, descriptor: { ...bridge.descriptor, parameters: { target: 12, seed: 3 } } }],
    ['unsupported family', { ...bridge, descriptor: { ...bridge.descriptor, familyId: 'math.other' } }],
    ['unreviewed equivalence', { ...bridge, descriptor: { ...bridge.descriptor, equivalenceVersion: 'r2' } }],
    ['wrong sum rule', { ...bridge, answerRule: { kind: 'bridge-total', target: 11 } }],
    ['wrong prompt', { ...bridge, assessedText: 'Make 13 metres.' }],
    ['wrong objective', { ...merchant, skillId: 'M02' }],
    ['invented band', { ...bridge, band: 'core' }],
    ['too many planks', { ...bridge, responseSpec: { ...bridge.responseSpec, cardinality: { min: 1, max: 7 } } }],
    ['basket spec', { ...merchant, responseSpec: { kind: 'merchant', countBounds: { min: 0, max: 25 }, maxTotal: 25 } }],
    ['wrong basket rule', { ...merchant, answerRule: { kind: 'merchant-constraints', total: 10, multiplier: 2 } }],
    ['unreachable merchant', { ...merchant, descriptor: { ...merchant.descriptor, parameters: { multiplier: 4, pears: 3 } } }],
    ['missing hints', { ...bridge, hints: [] }],
    ['duplicate help IDs', { ...bridge, workedSupport: { ...bridge.workedSupport, id: bridge.hints[0].id } }],
    ['withheld review', { ...bridge, review: { ...bridge.review, status: 'withheld' } }],
    ['missing source', { ...bridge, curriculum: null }],
    ['unsafe narration', { ...merchant, narration: { ...merchant.narration, neutralText: 'Pack six apples and three pears.' } }],
    ['missing task', null],
    ['malformed descriptor value', { ...merchant, descriptor: { ...merchant.descriptor, parameters: { multiplier: Symbol('bad'), pears: 3 } } }],
  ])('makes %s unavailable before considering the response', (_name, candidate) => {
    const task = candidate as TaskDefinition;
    expect(validateStarterMathsTask(task).length).toBeGreaterThan(0);
    const result = evaluateStarterMaths(task, { kind: 'bridge', planks: [] });
    expect(result.status).toBe('unavailable-content'); expect(result).not.toHaveProperty('correct');
  });
  it('does not mutate task/response and preserves canonical identity through revisions and alternative arrangements', () => {
    const response: ActivityResponse = { kind: 'bridge', planks: [1, 2, 3, 6] };
    const taskBefore = clone(bridge); const responseBefore = clone(response);
    expect(evaluateStarterMaths(bridge, response)).toMatchObject({ status: 'judged', correct: true });
    expect(bridge).toEqual(taskBefore); expect(response).toEqual(responseBefore);
    expect(evaluateStarterMaths({ ...bridge, contentRevision: 'compatible-copy' }, { kind: 'bridge', planks: [6, 3, 2, 1] })).toMatchObject({ canonicalQuestionId: bridge.canonicalQuestionId, correct: true });
    expect(canonicalQuestionId(bridges[7].descriptor)).toBe('lif.math.bridge.r1.total-13');
    expect(canonicalQuestionId(merchants[3].descriptor)).toBe('lif.math.merchant.r1.mult-2.pears-4');
    expect(bridges[7].canonicalQuestionId).not.toBe(bridge.canonicalQuestionId);
    expect(merchants[3].canonicalQuestionId).not.toBe(merchant.canonicalQuestionId);
  });
});
