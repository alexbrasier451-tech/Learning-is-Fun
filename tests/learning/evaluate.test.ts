import { describe, expect, it } from 'vitest';
import type { TaskDefinition } from '../../src/learning/contracts';
import { STARTER_TASKS, getTask } from '../../src/content/catalogue';
import { STARTER_MATHS_MANIFEST } from '../../src/content/starter-maths';
import { STARTER_PUNCTUATION_MANIFEST } from '../../src/content/starter-english';
import { evaluateResponse } from '../../src/learning/evaluate';

const bridge = getTask('lif.math.bridge.r1.total-12')!;
const spellbook = getTask('lif.english.punctuation.r1.spellbook-anchor')!;
const merchant = getTask('lif.math.merchant.r1.mult-2.pears-3')!;
describe('delivered M1 aggregate evaluator', () => {
  it.each([...STARTER_MATHS_MANIFEST.cases, ...STARTER_PUNCTUATION_MANIFEST.cases])('dispatches producer case $caseId', item => {
    const result = evaluateResponse(getTask(item.canonicalQuestionId)!, item.response);
    expect(result.status).toBe(item.expectedStatus);
    if (result.status === 'judged') {
      expect(result.correct).toBe(item.expectedCorrect);
      expect(result.feedback.issues.map(issue => issue.code)).toEqual(item.expectedIssueCodes);
    } else { expect(result).not.toHaveProperty('correct'); expect(result).not.toHaveProperty('points'); }
  });
  it.each([[6, 6], [4, 4, 4], [1, 2, 3, 6]])('M1-BRIDGE accepts every alternative %s', (...planks) => {
    expect(evaluateResponse(bridge, { kind: 'bridge', planks })).toMatchObject({ status: 'judged', correct: true });
  });
  it('M1-SPELLBOOK gives both legitimate endings the same whole-task result', () => {
    expect(evaluateResponse(spellbook, { kind: 'punctuation', slots: { question: '?', discovery: '.' } }))
      .toEqual(evaluateResponse(spellbook, { kind: 'punctuation', slots: { discovery: '!', question: '?' } }));
  });
  it.each([[6, 3, []], [5, 4, ['relationship-mismatch']], [4, 2, ['total-mismatch']], [2, 2, ['total-mismatch', 'relationship-mismatch']]])('M1-MERCHANT checks (%s,%s)', (apples, pears, codes) => {
    const result = evaluateResponse(merchant, { kind: 'merchant', apples, pears });
    expect(result.status).toBe('judged');
    if (result.status === 'judged') { expect(result.correct).toBe(codes.length === 0); expect(result.feedback.issues.map(issue => issue.code)).toEqual(codes); }
  });
  it.each([
    ['unknown family', { ...bridge, descriptor: { ...bridge.descriptor, familyId: 'undelivered.family' } }],
    ['withheld', { ...merchant, review: { ...merchant.review, status: 'withheld' } }],
    ['wrong rule', { ...merchant, answerRule: { kind: 'merchant-constraints', multiplier: 2, total: 10 } }],
    ['unreviewed prose', { ...bridge, explanation: 'Only two 6 metre planks can work.' }],
    ['leaking neutral instruction', { ...bridge, instructionText: 'Choose six and six.', narration: { neutralText: 'Choose six and six.', assessedTextMayBeSpokenBeforeCheck: true } }],
    ['malformed supply', { ...bridge, responseSpec: { ...bridge.responseSpec, plankLengths: [JSON.parse('{"toString":null}')] } }],
    ['malformed contextual ID', { ...bridge, contextualSkillIds: [JSON.parse('{"toString":null}')] }],
    ['missing task', undefined],
  ])('makes %s unavailable before response grading', (_name, candidate) => {
    const result = evaluateResponse(candidate as TaskDefinition, { kind: 'bridge', planks: [6, 6] });
    expect(result.status).toBe('unavailable-content'); expect(result).not.toHaveProperty('correct');
  });
  it('preserves missing, invalid and judged distinctions using real records', () => {
    expect(evaluateResponse(bridge, { kind: 'bridge', planks: [] }).status).toBe('incomplete');
    expect(evaluateResponse(bridge, { kind: 'bridge', planks: [7] }).status).toBe('invalid-response');
    expect(evaluateResponse(bridge, { kind: 'bridge', planks: [1] })).toMatchObject({ status: 'judged', correct: false });
    expect(evaluateResponse(spellbook, { kind: 'punctuation', slots: { question: '?', discovery: null } }).status).toBe('incomplete');
    expect(evaluateResponse(spellbook, { kind: 'punctuation', slots: { unknown: '?' } }).status).toBe('invalid-response');
    expect(evaluateResponse(merchant, { kind: 'merchant', apples: null, pears: 3 }).status).toBe('incomplete');
    expect(evaluateResponse(merchant, { kind: 'merchant', apples: 22, pears: 3 }).status).toBe('invalid-response');
  });
  it('allows compatible revision and semantic punctuation presentation order without changing identity', () => {
    const copy = JSON.parse(JSON.stringify(spellbook)) as TaskDefinition;
    if (copy.responseSpec.kind !== 'punctuation') throw new Error('Fixture invariant');
    const changed = { ...copy, contentRevision: 'compatible-copy', responseSpec: { ...copy.responseSpec,
      slots: [...copy.responseSpec.slots].reverse().map(slot => ({ ...slot, options: [...slot.options].reverse() })),
      requiredSlotIds: [...copy.responseSpec.requiredSlotIds].reverse() } };
    const before = JSON.stringify(STARTER_TASKS);
    expect(evaluateResponse(changed, { kind: 'punctuation', slots: { discovery: '.', question: '?' } }))
      .toEqual(evaluateResponse(spellbook, { kind: 'punctuation', slots: { question: '?', discovery: '.' } }));
    expect(JSON.stringify(STARTER_TASKS)).toBe(before);
  });
});
