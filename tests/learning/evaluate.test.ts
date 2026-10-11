import { describe, expect, it } from 'vitest';
import type { TaskDefinition } from '../../src/learning/contracts';
import { ALL_TASKS, EXPANSION_MANIFESTS, STARTER_TASKS, getTask } from '../../src/content/catalogue';
import { WORD_HANDOFF_CASES } from '../../src/content/expansion-english/words';
import { GRAMMAR_HANDOFF_CASES } from '../../src/content/expansion-english/grammar';
import { READING_WRITING_HANDOFF_CASES } from '../../src/content/expansion-english/reading-writing';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { createDraft, toResponse } from '../../src/interaction/draft';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TaskStimulus } from '../../src/interaction/TaskStimulus';
import { STARTER_MATHS_MANIFEST } from '../../src/content/starter-maths';
import { STARTER_PUNCTUATION_MANIFEST } from '../../src/content/starter-english';
import { evaluateResponse } from '../../src/learning/evaluate';

const bridge = getTask('lif.math.bridge.r1.total-12')!;
const spellbook = getTask('lif.english.punctuation.r1.spellbook-anchor')!;
const merchant = getTask('lif.math.merchant.r1.mult-2.pears-3')!;
// One case per family/response/status/result, taken from the accepted owner oracle.
const representative = EXPANSION_MANIFESTS.flatMap(manifest => {
  const seen = new Set<string>();
  return manifest.cases.filter(item => {
    const key = `${getTask(item.canonicalQuestionId)?.descriptor.familyId}/${item.response.kind}/${item.expectedStatus}/${item.expectedCorrect}`;
    if (seen.has(key)) return false; seen.add(key); return true;
  });
});
describe('aggregate expansion dispatch and source contract', () => {
  it.each(EXPANSION_MANIFESTS)('returns unreviewed $moduleId metadata to the owner', manifest => {
    const task = getTask(manifest.taskIds[0])!;
    if (task.answerRule.kind !== 'accepted-responses') throw new Error('Expected reviewed response');
    for (const candidate of [{ ...task, review: { ...task.review, status: 'withheld' as const } },
      { ...task, objectiveId: '' }, { ...task, hints: [{ ...task.hints[0], text: 'Unreviewed answer advice.' }, task.hints[1]] }]) {
      expect(evaluateResponse(candidate as TaskDefinition, task.answerRule.responses[0])).toMatchObject({ status: 'unavailable-content' });
    }
  });
  it.each(representative)('dispatches accepted representative $caseId', item => {
    const task = getTask(item.canonicalQuestionId)!;
    const result = evaluateResponse(task, item.response);
    expect(result.status).toBe(item.expectedStatus);
    if (result.status === 'judged') {
      expect(result.correct).toBe(item.expectedCorrect);
      expect(result.feedback.issues.map(issue => issue.code)).toEqual(item.expectedIssueCodes);
      expect(toResponse(createDraft(task.responseSpec, item.response))).toEqual(item.response);
    } else expect(result).not.toHaveProperty('correct');
  });
  it.each([...WORD_HANDOFF_CASES, ...GRAMMAR_HANDOFF_CASES, ...READING_WRITING_HANDOFF_CASES])('preserves downstream case $caseId', item => {
    const binding = QUEST_ACTIVITY_BINDINGS.find(row => row.bindingId === item.bindingId)!;
    expect(binding.taskIds).toContain(item.canonicalQuestionId);
    const result = evaluateResponse(getTask(item.canonicalQuestionId)!, item.response);
    expect(result.status).toBe(item.expectedStatus);
    if (result.status === 'judged') expect(result.correct).toBe(item.expectedCorrect);
    expect(['independent', 'mixed', 'listening-supported']).toContain(item.expectedEvidenceMode);
  });
  it('validates all five delivered stimulus shapes against the frozen WP02 source contract', () => {
    const stimuli = ALL_TASKS.flatMap(task => task.stimulus ? [task.stimulus] : []);
    expect(new Set(stimuli.map(s => s.kind))).toEqual(new Set(['array', 'fraction', 'clock', 'diagram', 'data']));
    for (const s of stimuli) {
      expect(s.accessibleDescription.trim()).toBeTruthy(); expect(s.labels.every(label => typeof label === 'string')).toBe(true);
      switch (s.kind) {
        case 'array': expect(Number.isSafeInteger(s.groups) && s.groups > 0 && s.groups <= 12).toBe(true);
          expect(Number.isSafeInteger(s.itemsPerGroup) && s.itemsPerGroup > 0 && s.itemsPerGroup <= 12).toBe(true); break;
        case 'fraction': expect(Number.isSafeInteger(s.denominator) && s.denominator > 0).toBe(true);
          expect(Number.isSafeInteger(s.wholeCount) && s.wholeCount > 0).toBe(true);
          expect(Number.isSafeInteger(s.numerator) && s.numerator >= 0 && s.numerator <= s.denominator * s.wholeCount).toBe(true); break;
        case 'clock': expect(Number.isSafeInteger(s.minutes) && s.minutes >= 0 && s.minutes <= 1439).toBe(true);
          expect([0, 1]).toContain(s.dayOffset); expect(['12-hour', '24-hour']).toContain(s.display);
          expect(['analogue', 'digital']).toContain(s.face); expect(s.face === 'analogue' && s.display === '24-hour').toBe(false); break;
        case 'diagram': {
          expect(new Set(s.points.map(p => p.id)).size).toBe(s.points.length);
          expect(new Set(s.edges.map(e => e.id)).size).toBe(s.edges.length);
          for (const p of s.points) expect(Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100).toBe(true);
          for (const e of s.edges) { expect(s.points.some(p => p.id === e.from)).toBe(true); expect(s.points.some(p => p.id === e.to)).toBe(true); }
          if (s.closed) {
            expect(s.edges.length).toBe(s.points.length);
            for (const p of s.points) expect(s.edges.filter(e => e.from === p.id || e.to === p.id)).toHaveLength(2);
          }
          break;
        }
        case 'data': expect(['table', 'bar', 'line']).toContain(s.display);
          expect(Number.isSafeInteger(s.scaleStep) && s.scaleStep > 0).toBe(true);
          expect(s.xLabel.trim() && s.yLabel.trim()).toBeTruthy(); expect(new Set(s.rows.map(row => row.id)).size).toBe(s.rows.length);
          expect(s.rows.length > 0 && s.rows.length <= 6).toBe(true);
          for (const row of s.rows) { expect(row.label.trim()).toBeTruthy(); expect(Number.isSafeInteger(row.value) && row.value >= 0).toBe(true); } break;
      }
    }
  });
  it.each(ALL_TASKS.filter(task => task.skillId === 'M09' && task.stimulus?.kind === 'diagram'))('actual WP02 renderer accepts source $descriptor.authoredKey', task => {
    expect(() => renderToStaticMarkup(createElement(TaskStimulus, { stimulus: task.stimulus })), task.canonicalQuestionId).not.toThrow();
  });
  it.each(['array', 'fraction', 'clock', 'diagram', 'data'])('returns broken %s source to its owner before judging', kind => {
    const task = ALL_TASKS.find(task => task.stimulus?.kind === kind)!;
    if (task.answerRule.kind !== 'accepted-responses') throw new Error('Expected authored oracle');
    const mutations = [undefined, null, { ...task.stimulus!, kind: 'unsupported' },
      { ...task.stimulus!, accessibleDescription: '' }, { ...task.stimulus!, labels: [NaN] },
      kind === 'array' ? { ...task.stimulus!, groups: Infinity } : kind === 'fraction' ? { ...task.stimulus!, denominator: 0 }
        : kind === 'clock' ? { ...task.stimulus!, minutes: 1440 } : kind === 'diagram' ? { ...task.stimulus!, edges: [{ id: 'bad', from: 'absent', to: 'absent' }], closed: true }
          : { ...task.stimulus!, scaleStep: 0, rows: [{ id: 'bad', label: '', value: NaN }] }];
    for (const stimulus of mutations) {
      const result = evaluateResponse({ ...task, stimulus } as TaskDefinition, task.answerRule.responses[0]);
      expect(result.status).toBe('unavailable-content'); expect(result).not.toHaveProperty('correct');
      if (result.status === 'unavailable-content') expect(result.issues.some(issue => issue.field === 'stimulus')).toBe(true);
    }
    expect(evaluateResponse(task, task.answerRule.responses[0])).toMatchObject({ status: 'judged', correct: true });
  });
});
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
