import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { TaskDefinition } from '../../src/learning/contracts';
import { canonicalQuestionId } from '../../src/learning/identity';
import { STARTER_PUNCTUATION_MANIFEST as manifest, STARTER_PUNCTUATION_TASKS as tasks } from '../../src/content/starter-english';
import { evaluateStarterPunctuation as evaluate, validateStarterPunctuationTask as validate } from '../../src/learning/evaluators/starter-punctuation';

// Independent editorial oracle: authored from the scenes, not from answerRule,
// options, the manifest, or evaluator results. Complete matrix order is . ? !.
const oracle = [
  { key: 'spellbook-anchor', ids: ['question', 'discovery'], accepted: ['?.', '?!'], perSlot: ['?', '.!'] },
  { key: 'spellbook-01', ids: ['record'], accepted: ['.'], perSlot: ['.'] },
  { key: 'spellbook-02', ids: ['lantern'], accepted: ['?'], perSlot: ['?'] },
  { key: 'spellbook-03', ids: ['request'], accepted: ['?'], perSlot: ['?'] },
  { key: 'spellbook-04', ids: ['thought'], accepted: ['.'], perSlot: ['.'] },
  { key: 'spellbook-05', ids: ['admiration'], accepted: ['.', '!'], perSlot: ['.!'] },
  { key: 'spellbook-06', ids: ['warning'], accepted: ['!'], perSlot: ['!'] },
  { key: 'spellbook-07', ids: ['direction'], accepted: ['.'], perSlot: ['.'] },
  { key: 'spellbook-08', ids: ['door', 'key'], accepted: ['.?', '!?'], perSlot: ['.!', '?'] },
  { key: 'spellbook-09', ids: ['confirmation'], accepted: ['?'], perSlot: ['?'] },
  { key: 'spellbook-10', ids: ['path', 'crossing'], accepted: ['??'], perSlot: ['?', '?'] },
  { key: 'spellbook-11', ids: ['cheer', 'log'], accepted: ['!.'], perSlot: ['!', '.'] },
] as const;
const taskFor = (key: string) => tasks.find(task => task.descriptor.authoredKey === key)!;
const anchor = taskFor('spellbook-anchor');
const copy = (task: TaskDefinition = anchor): TaskDefinition => JSON.parse(JSON.stringify(task));
const response = (slots: Record<string, unknown>) => ({ kind: 'punctuation', slots });
const complete = oracle.flatMap(row => (row.ids.length === 1 ? ['.', '?', '!']
  : ['..', '.?', '.!', '?.', '??', '?!', '!.', '!?', '!!']).map(marks => ({
  key: row.key, marks, slots: Object.fromEntries(row.ids.map((id, i) => [id, marks[i]])),
  correct: (row.accepted as readonly string[]).includes(marks),
  issueIds: row.ids.filter((_, i) => !row.perSlot[i].includes(marks[i])),
})));

describe('reviewed finite punctuation bank', () => {
  it('has exactly the twelve authored identities, conservative bands and provenance', () => {
    expect(tasks).toHaveLength(12);
    expect(tasks.map(task => task.descriptor.authoredKey)).toEqual(oracle.map(row => row.key));
    expect(new Set(tasks.map(task => task.canonicalQuestionId)).size).toBe(12);
    expect(anchor.canonicalQuestionId).toBe('lif.english.punctuation.r1.spellbook-anchor');
    expect(taskFor('spellbook-01').canonicalQuestionId).toBe('lif.english.punctuation.r1.authored-%5B%22spellbook-01%22%2C%5B%5D%5D');
    for (const task of tasks) {
      expect(validate(task)).toEqual([]);
      expect(task).toMatchObject({ skillId: 'E06', objectiveId: 'E06-punctuation', band: 'support', contextualSkillIds: [], review: { status: 'approved' } });
      expect(task.descriptor).toMatchObject({ familyId: 'english.punctuation', equivalenceVersion: 'r1', parameters: {} });
      expect(task.curriculum.section).toContain('Year 1');
      expect(task.curriculum.section).toContain('English Appendix 2');
      expect(task.curriculum.programmeBand).toBe('Year 1 end-punctuation consolidated in Years 3–4');
      expect(task.review.reviewer).toContain('not a qualified educator');
      expect(task.review.evidenceRef).toBe('docs/content-review/starter-punctuation.md');
    }
    expect(Object.isFrozen(tasks)).toBe(true);
    expect(Object.isFrozen(anchor.answerRule)).toBe(true);
  });

  it.each(complete)('$key: complete $marks matches the independent editorial oracle', ({ key, slots, correct, issueIds }) => {
    const task = taskFor(key);
    const before = JSON.stringify(task);
    const result = evaluate(task, response(slots));
    expect(result).toMatchObject({ status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId, skillId: 'E06', objectiveId: 'E06-punctuation', band: 'support' });
    if (result.status !== 'judged') throw new Error('Expected a judged complete map');
    expect(result.feedback.explanation).toBe(task.explanation);
    expect(result.feedback.issues.map(issue => issue.slotId)).toEqual(issueIds);
    expect(result.feedback.issues.map(issue => issue.code)).toEqual(issueIds.map(() => 'punctuation-context'));
    for (const issue of result.feedback.issues) {
      expect(issue.constraintId).toBeNull();
      expect(issue.observed).toBe(slots[issue.slotId!]);
      expect(issue.explanation).toContain(task.explanation);
    }
    expect(JSON.stringify(task)).toBe(before);
  });

  it('pins the exhaustive totals and approved answer maps independently', () => {
    expect(complete).toHaveLength(60);
    expect(complete.filter(item => item.correct)).toHaveLength(15);
    expect(complete.filter(item => !item.correct)).toHaveLength(45);
    for (const row of oracle) {
      const rule = taskFor(row.key).answerRule;
      if (rule.kind !== 'accepted-responses') throw new Error('Expected explicit accepted maps');
      expect(rule.responses.map(item => {
        if (item.kind !== 'punctuation') throw new Error('Expected punctuation');
        expect(Object.keys(item.slots).sort()).toEqual([...row.ids].sort());
        return row.ids.map(id => item.slots[id]).join('');
      }).sort()).toEqual([...row.accepted].sort());
    }
  });

  it('gives both anchor endings identical credit and one canonical identity', () => {
    const calm = evaluate(anchor, response({ question: '?', discovery: '.' }));
    const excited = evaluate(anchor, response({ discovery: '!', question: '?' }));
    expect(calm).toEqual(excited);
    expect(calm).toMatchObject({ status: 'judged', correct: true, feedback: { issues: [] } });
    expect(complete.filter(row => row.key === 'spellbook-anchor' && row.correct)).toHaveLength(2);
    expect(anchor.assessedText).toContain('Where are my magic books ___\nLook, there they are ___');
  });

  it('retains identity, outcome and feedback when slot/options/map ordering and revision change', () => {
    const reordered = copy();
    if (reordered.responseSpec.kind !== 'punctuation' || reordered.answerRule.kind !== 'accepted-responses') throw new Error('Fixture invariant');
    const task: TaskDefinition = {
      ...reordered, contentRevision: 'cosmetic-reprint-2',
      responseSpec: { ...reordered.responseSpec, slots: [...reordered.responseSpec.slots].reverse().map(slot => ({ ...slot, options: [...slot.options].reverse() })), requiredSlotIds: [...reordered.responseSpec.requiredSlotIds].reverse() },
      answerRule: { ...reordered.answerRule, responses: [...reordered.answerRule.responses].reverse() },
    };
    expect(validate(task)).toEqual([]);
    for (const item of complete.filter(row => row.key === 'spellbook-anchor')) expect(evaluate(task, response(item.slots))).toEqual(evaluate(anchor, response(item.slots)));
    for (const week of ['2026-10-05', '2026-10-12']) {
      const presentation = { descriptor: task.descriptor, week, slotOrder: ['discovery', 'question'] };
      expect(canonicalQuestionId(presentation.descriptor)).toBe(anchor.canonicalQuestionId);
    }
  });
});

describe('drafts and malformed input remain unscored', () => {
  // All six states per slot: absent, null, empty string, and each legal mark.
  // 8 * 3 + 4 * (36 - 9) = 132 partial maps; known wrong filled slots still draft.
  const states = [undefined, null, '', '.', '?', '!'] as const;
  const partials = oracle.flatMap(row => (row.ids.length === 1 ? states.map(value => [value])
    : states.flatMap(first => states.map(second => [first, second])))
    .filter(values => values.some(value => value === undefined || value === null || value === ''))
    .map((values, i) => ({ key: row.key, i, slots: Object.fromEntries(row.ids.flatMap((id, index) => values[index] === undefined ? [] : [[id, values[index]]])),
      missing: row.ids.filter((_, index) => values[index] === undefined || values[index] === null || values[index] === '') })));
  it('covers all 132 permitted partial states', () => { expect(partials).toHaveLength(132); });
  it.each(partials)('$key partial $i', ({ key, slots, missing }) => {
    expect(evaluate(taskFor(key), response(slots))).toEqual({ status: 'incomplete', missing });
  });
  it.each(oracle)('$key rejects malformed/extra/unknown data before checking completeness', row => {
    const task = taskFor(row.key);
    const firstId = row.ids[0];
    const valid = Object.fromEntries(row.ids.map((id, index) => [id, row.accepted[0][index]]));
    const invalid: unknown[] = [null, undefined, [], '.', {}, { kind: 'choice', choices: valid },
      { kind: 'punctuation' }, { slots: valid }, { kind: 'punctuation', slots: null },
      { kind: 'punctuation', slots: [] }, { kind: 'punctuation', slots: valid, extra: true },
      response({ ...valid, extra: null }), response({ unknown: null }),
      response(Object.create({ [firstId]: '?' })), response({ ...valid, [Symbol('extra')]: '.' }),
      ...[undefined, 1, false, {}, [], ' ', ' ?', '? ', '!!', '？！', 'question', 'The books?', '\n.'].map(value => response({ [firstId]: value })),
    ];
    for (const value of invalid) {
      const result = evaluate(task, value);
      expect(result, JSON.stringify(value)).toMatchObject({ status: 'invalid-response' });
      expect(Object.keys(result).sort()).toEqual(['reason', 'status']);
    }
  });
  it('accepts a freshly decoded null-prototype map without changing either input', () => {
    const task = JSON.parse(JSON.stringify(taskFor('spellbook-08'))) as TaskDefinition;
    const slots = Object.assign(Object.create(null), { key: '?', door: '!' });
    const input = Object.freeze({ kind: 'punctuation', slots: Object.freeze(slots) });
    expect(evaluate(task, input)).toMatchObject({ status: 'judged', correct: true });
    expect(Reflect.ownKeys(slots)).toEqual(['key', 'door']);
  });
});

describe('content faults are unavailable, never learner wrongness', () => {
  const changed = (patch: Record<string, unknown>) => ({ ...copy(), ...patch }) as TaskDefinition;
  const cases: readonly [string, TaskDefinition, string][] = [
    ['null task', null as unknown as TaskDefinition, 'descriptor-invalid'],
    ['missing descriptor', changed({ descriptor: null }), 'descriptor-invalid'],
    ['wrong canonical ID', changed({ canonicalQuestionId: 'wrong' }), 'identity-mismatch'],
    ['unknown key', changed({ descriptor: { ...anchor.descriptor, authoredKey: 'spellbook-12' } }), 'unreviewed-task'],
    ['extra identity parameter', changed({ descriptor: { ...anchor.descriptor, parameters: { week: '2026-10-12' } } }), 'descriptor-invalid'],
    ['empty revision', changed({ contentRevision: '' }), 'revision-invalid'],
    ['withheld', changed({ review: { ...anchor.review, status: 'withheld' } }), 'review-unapproved'],
    ['changed context', changed({ assessedText: 'Where are my books?' }), 'reviewed-content-mismatch'],
    ['core claim', changed({ band: 'core' }), 'reviewed-content-mismatch'],
    ['wrong objective', changed({ objectiveId: 'E07-direct-speech' }), 'reviewed-content-mismatch'],
    ['wrong source', changed({ curriculum: null }), 'reviewed-content-mismatch'],
    ['missing help', changed({ hints: [] }), 'reviewed-content-mismatch'],
    ['sparse help', changed({ hints: new Array(2) }), 'reviewed-content-mismatch'],
    ['answer in neutral speech', changed({ narration: { neutralText: 'Choose a question mark.', assessedTextMayBeSpokenBeforeCheck: false } }), 'unsafe-narration'],
    ['modelled assessed text', changed({ narration: { ...anchor.narration, assessedTextMayBeSpokenBeforeCheck: true } }), 'unsafe-narration'],
    ['extra stimulus', changed({ stimulus: {} }), 'unexpected-stimulus'],
    ['missing spec', changed({ responseSpec: null }), 'slot-domain-mismatch'],
    ['wrong response kind', changed({ responseSpec: { kind: 'choice', slots: [], requiredSlotIds: [] } }), 'slot-domain-mismatch'],
    ['no accepted responses', changed({ answerRule: { kind: 'accepted-responses', responses: [] } }), 'answer-domain-mismatch'],
    ['only one anchor ending', changed({ answerRule: { kind: 'accepted-responses', responses: [response({ question: '?', discovery: '.' })] } }), 'answer-domain-mismatch'],
    ['unreviewed ending', changed({ answerRule: { kind: 'accepted-responses', responses: [response({ question: '?', discovery: '?' })] } }), 'answer-domain-mismatch'],
    ['partial accepted map', changed({ answerRule: { kind: 'accepted-responses', responses: [response({ question: '?' })] } }), 'answer-domain-mismatch'],
    ['duplicate accepted map', changed({ answerRule: { kind: 'accepted-responses', responses: [response({ question: '?', discovery: '.' }), response({ question: '?', discovery: '.' })] } }), 'answer-domain-mismatch'],
  ];
  it.each(cases)('%s', (_label, task, code) => {
    expect(validate(task).map(issue => issue.code)).toContain(code);
    expect(evaluate(task, response({ question: '?', discovery: '.' }))).toEqual({ status: 'unavailable-content', issues: validate(task) });
    expect(evaluate(task, null).status).toBe('unavailable-content');
  });
  it('rejects duplicate/extra/missing slots, requirements and glyphs even if marked approved', () => {
    if (anchor.responseSpec.kind !== 'punctuation') throw new Error('Fixture invariant');
    const spec = anchor.responseSpec;
    const altered = [
      { ...spec, slots: [spec.slots[0], spec.slots[0]] },
      { ...spec, slots: [spec.slots[0]] },
      { ...spec, slots: [...spec.slots, { ...spec.slots[0], id: 'extra' }] },
      { ...spec, requiredSlotIds: ['question', 'question'] },
      { ...spec, requiredSlotIds: ['question'] },
      { ...spec, slots: [{ ...spec.slots[0], label: 'Where are my magic books?' }, spec.slots[1]] },
      ...[
        [{ id: '.', label: '.' }, { id: '?', label: '?' }],
        [{ id: '.', label: '.' }, { id: '?', label: '?' }, { id: '?', label: '?' }],
        [{ id: '.', label: '.' }, { id: '?', label: '?' }, { id: '!', label: 'Correct!' }],
      ].map(options => ({ ...spec, slots: [{ ...spec.slots[0], options }, spec.slots[1]] })),
    ];
    for (const responseSpec of altered) expect(validate({ ...anchor, responseSpec }).map(issue => issue.code)).toContain('slot-domain-mismatch');
  });
});

describe('independent-review malformed control regressions', () => {
  function withControlChange(change: (spec: Record<string, unknown>) => void): TaskDefinition {
    const task = copy();
    change(task.responseSpec as unknown as Record<string, unknown>);
    return task;
  }
  function expectUnavailable(task: TaskDefinition) {
    // Both exported entry points traverse real content validation; an exception
    // fails the case rather than being converted to a synthetic content issue.
    const issues = validate(task);
    expect(issues.map(issue => issue.code)).toEqual(['slot-domain-mismatch']);
    expect(evaluate(task, response({ question: '?', discovery: '!' })))
      .toEqual({ status: 'unavailable-content', issues });
  }
  const optionCases = [0, 1].flatMap(slotIndex => [0, 1, 2].flatMap(optionIndex =>
    ['hole', 'null', 'undefined'].map(kind => ({ slotIndex, optionIndex, kind }))));
  it.each(optionCases)('F01 slot $slotIndex option $optionIndex: $kind is unavailable', ({ slotIndex, optionIndex, kind }) => {
    const task = withControlChange(spec => {
      const slots = spec.slots as { options: unknown[] }[];
      if (kind === 'hole') delete slots[slotIndex].options[optionIndex];
      else slots[slotIndex].options[optionIndex] = kind === 'null' ? null : undefined;
    });
    expectUnavailable(task);
    // In-memory and decoded representations must both fail closed.
    expectUnavailable(JSON.parse(JSON.stringify(task)) as TaskDefinition);
  });
  const malformedIds: readonly [string, unknown][] = [
    ['null', null], ['undefined', undefined], ['number', 0], ['boolean', false],
    ['object', {}], ['array', []], ['JSON non-coercible object', JSON.parse('{"toString":null}')],
    ['symbol', Symbol('not-a-slot-id')],
  ];
  it.each([0, 1].flatMap(index => malformedIds.map(([label, value]) => ({ index, label, value }))))
    ('F02 required slot $index: $label is unavailable without coercion', ({ index, value }) => {
      expectUnavailable(withControlChange(spec => { (spec.requiredSlotIds as unknown[])[index] = value; }));
    });
  it.each([0, 1])('F02 required slot %i: a hole is unavailable', index => {
    expectUnavailable(withControlChange(spec => { delete (spec.requiredSlotIds as unknown[])[index]; }));
  });
  it('F02 exact JSON reproduction returns issues and unavailable, not exceptions', () => {
    expectUnavailable(withControlChange(spec => {
      spec.requiredSlotIds = JSON.parse('[{"toString":null},"discovery"]');
    }));
  });
  it.each([
    [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0],
  ])('preserves glyph permutation %i/%i/%i with reordered requirements', (first, second, third) => {
    const task = copy();
    if (task.responseSpec.kind !== 'punctuation') throw new Error('Fixture invariant');
    const reordered: TaskDefinition = { ...task, responseSpec: {
      ...task.responseSpec, requiredSlotIds: ['discovery', 'question'],
      slots: [...task.responseSpec.slots].reverse().map(slot => ({ ...slot,
        options: [slot.options[first], slot.options[second], slot.options[third]],
      })),
    } };
    expect(validate(reordered)).toEqual([]);
    for (const item of complete.filter(row => row.key === 'spellbook-anchor')) {
      expect(evaluate(reordered, response(item.slots))).toEqual(evaluate(anchor, response(item.slots)));
    }
  });
});

describe('narration, help and downstream manifest', () => {
  it('offers only the exact reviewed neutral script before Check', () => {
    const script = 'Read the scene and each line. Choose an ending for every space. You can change your choices. When every space is filled, choose Check.';
    for (const task of tasks) {
      expect(task.narration).toEqual({ neutralText: script, assessedTextMayBeSpokenBeforeCheck: false });
      expect(task.instructionText).toBe(script);
      expect(task.hints).toHaveLength(2);
      expect(new Set([...task.hints.map(hint => hint.id), task.workedSupport.id]).size).toBe(3);
      for (const hint of task.hints) {
        expect(hint.text).not.toMatch(/[?!]|question mark|full stop|exclamation mark|choose [.!?]/i);
        expect(hint.text.length).toBeGreaterThan(25);
      }
      expect(task.workedSupport.text.length).toBeGreaterThan(90);
    }
  });
  it('supplies runnable manifest cases and retains all identities', () => {
    expect(manifest.familyIds).toEqual(['english.punctuation']);
    expect(manifest.taskIds).toEqual(tasks.map(task => task.canonicalQuestionId));
    expect(manifest.retainedTaskIds).toEqual(manifest.taskIds);
    expect(manifest.cases).toHaveLength(65);
    expect(new Set(manifest.cases.map(item => item.caseId)).size).toBe(65);
    expect(new Set(manifest.cases.filter(item => item.expectedCorrect).map(item => item.canonicalQuestionId)).size).toBe(12);
    for (const item of manifest.cases) {
      const result = evaluate(tasks.find(task => task.canonicalQuestionId === item.canonicalQuestionId)!, item.response);
      expect(result.status).toBe(item.expectedStatus);
      if (result.status === 'judged') {
        expect(result.correct).toBe(item.expectedCorrect);
        expect(result.feedback.issues.map(issue => issue.code)).toEqual(item.expectedIssueCodes);
      }
    }
  });
  it('has only pure learning/content imports; audio preferences are not evaluator inputs', () => {
    for (const path of ['src/content/starter-english.ts', 'src/learning/evaluators/starter-punctuation.ts']) {
      const source = readFileSync(path, 'utf8');
      expect(source).not.toMatch(/from ['"].*(?:state|rewards|experience|audio|react)/);
      expect(source).not.toMatch(/\b(?:window|document|speechSynthesis|indexedDB|fetch|localStorage)\b/);
    }
  });
});
