import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { TaskDefinition } from '../../src/learning/contracts';
import { canonicalQuestionId } from '../../src/learning/identity';
import { PUNCTUATION_TASKS as tasks, PUNCTUATION_MANIFEST as manifest, PUNCTUATION_REVISIT_PROPOSALS as proposals } from '../../src/content/expansion-english/punctuation';
import { evaluateExpansionPunctuation as evaluate, validatePunctuationTask as validate } from '../../src/learning/evaluators/expansion-punctuation';
import { STARTER_PUNCTUATION_TASKS as starters, STARTER_PUNCTUATION_MANIFEST as starterManifest } from '../../src/content/starter-english';
import { evaluateStarterPunctuation } from '../../src/learning/evaluators/starter-punctuation';
import { createDraft, reduceDraft, toResponse } from '../../src/interaction/draft';
import { ChoiceTiles } from '../../src/interaction/ActivityWidgets';

// Independent editorial oracle: declared from each task's purpose/convention,
// never read from answerRule, manifest cases or evaluator output.
const oracle = [
  { key: 'list-separator', skill: 'E06', band: 'support', kind: 'punctuation', ids: ['list'], domains: [[',', '.', '?']], accepted: [[',']] },
  { key: 'contract-is-not', skill: 'E06', band: 'support', kind: 'punctuation', ids: ['omission'], domains: [["'", '’', ',']], accepted: [["'"], ['’']] },
  { key: 'one-fox-owner', skill: 'E06', band: 'support', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1']] },
  { key: 'fronted-time', skill: 'E06', band: 'core', kind: 'punctuation', ids: ['time'], domains: [[',', ';', ':']], accepted: [[',']] },
  { key: 'regular-plural-owners', skill: 'E06', band: 'core', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1']] },
  { key: 'irregular-plural-owners', skill: 'E06', band: 'core', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1']] },
  { key: 'its-and-it-is', skill: 'E06', band: 'core', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1']] },
  { key: 'address-not-food', skill: 'E06', band: 'stretch', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1']] },
  { key: 'paired-parenthesis', skill: 'E06', band: 'stretch', kind: 'punctuation', ids: ['open', 'close'], domains: [[',', '—', '(', ')'], [',', '—', '(', ')']], accepted: [[',', ','], ['—', '—'], ['(', ')']] },
  { key: 'combined-proofread', skill: 'E06', band: 'stretch', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1']] },
  { key: 'quote-boundaries', skill: 'E07', band: 'support', kind: 'punctuation', ids: ['open', 'close'], domains: [['"', "'"], ['"', "'"]], accepted: [['"', '"'], ["'", "'"]] },
  { key: 'reporting-clause-link', skill: 'E07', band: 'support', kind: 'punctuation', ids: ['link'], domains: [[',', '.', '?']], accepted: [[',']] },
  { key: 'spoken-question-end', skill: 'E07', band: 'support', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1']] },
  { key: 'speech-before-report', skill: 'E07', band: 'core', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1'], ['v2']] },
  { key: 'coordinate-report-first', skill: 'E07', band: 'core', kind: 'punctuation', ids: ['link', 'open', 'close'], domains: [[',', '.', '?'], ['"', "'"], ['"', "'"]], accepted: [[',', '"', '"'], [',', "'", "'"]] },
  { key: 'apostrophe-inside-speech', skill: 'E07', band: 'core', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1'], ['v2']] },
  { key: 'question-and-reply', skill: 'E07', band: 'core', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1']] },
  { key: 'interrupted-one-sentence', skill: 'E07', band: 'stretch', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1'], ['v2']] },
  { key: 'two-spoken-sentences', skill: 'E07', band: 'stretch', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1'], ['v2']] },
  { key: 'quotation-within-speech', skill: 'E07', band: 'stretch', kind: 'choice', ids: ['version'], domains: [['v1', 'v2', 'v3', 'v4']], accepted: [['v1'], ['v2']] },
] as const;
const product = <T,>(domains: readonly (readonly T[])[]): T[][] => domains.reduce<T[][]>((rows, domain) => rows.flatMap(row => domain.map(value => [...row, value])), [[]]);
const taskFor = (key: string) => tasks.find(task => task.descriptor.authoredKey === key)!;
const responseFor = (row: typeof oracle[number], tuple: readonly unknown[]) => ({ kind: row.kind,
  [row.kind === 'punctuation' ? 'slots' : 'choices']: Object.fromEntries(row.ids.flatMap((id, i) => tuple[i] === undefined ? [] : [[id, tuple[i]]])),
});
const complete = oracle.flatMap(row => product<string>(row.domains).map((tuple, index) => ({
  row, tuple, key: row.key, index, correct: row.accepted.some(answer => answer.every((value, i) => value === tuple[i])),
})));

describe('independent full finite answer oracle', () => {
  it('pins the independently enumerated complete-space totals', () => {
    expect(complete).toHaveLength(96);
    expect(complete.filter(item => item.correct)).toHaveLength(30);
    expect(complete.filter(item => !item.correct)).toHaveLength(66);
  });
  it.each(complete)('$key complete map $index', ({ row, tuple, correct }) => {
    const task = taskFor(row.key);
    expect(validate(task)).toEqual([]);
    const result = evaluate(task, responseFor(row, tuple));
    expect(result).toMatchObject({ status: 'judged', correct, skillId: row.skill, band: row.band, canonicalQuestionId: task.canonicalQuestionId });
    if (result.status !== 'judged') throw new Error('Expected complete judgement');
    const wrongIds = row.ids.filter((_, i) => !row.accepted.some(answer => answer[i] === tuple[i]));
    expect(result.feedback.issues.map(issue => issue.code)).toEqual(correct ? [] : wrongIds.length ? wrongIds.map(() => 'punctuation-context') : ['punctuation-combination']);
    expect(result.feedback.issues.map(issue => issue.slotId)).toEqual(correct ? [] : wrongIds.length ? wrongIds : [null]);
    expect(result.feedback.explanation).toBe(task.explanation);
    for (const issue of result.feedback.issues) {
      expect(issue.explanation).toBe(task.explanation);
      if (issue.slotId) expect(issue.observed).toBe(tuple[row.ids.indexOf(issue.slotId as never)]);
    }
  });
  it.each(oracle)('$key has exactly the independently reviewed answers and controls', row => {
    const task = taskFor(row.key);
    const spec = task.responseSpec;
    if (spec.kind !== 'punctuation' && spec.kind !== 'choice') throw new Error('Wrong response form');
    expect(spec.kind).toBe(row.kind);
    expect(spec.slots.map(slot => slot.id)).toEqual(row.ids);
    expect(spec.slots.map(slot => slot.options.map(option => option.id).sort())).toEqual(row.domains.map(domain => [...domain].sort()));
    if (task.answerRule.kind !== 'accepted-responses') throw new Error('Wrong rule form');
    expect(task.answerRule.responses).toEqual(row.accepted.map(tuple => responseFor(row, tuple)));
    const successes = row.accepted.map(tuple => evaluate(task, responseFor(row, tuple)));
    successes.forEach(result => expect(result).toEqual(successes[0]));
  });
});

describe('partial versus invalid input', () => {
  const partials = oracle.flatMap(row => product<unknown>(row.domains.map(domain => [...domain, undefined, null, '']))
    .filter(tuple => tuple.some(value => value === undefined || value === null || value === ''))
    .map((tuple, index) => ({ row, tuple, key: row.key, index })));
  it.each(partials)('$key permitted partial $index', ({ row, tuple }) => {
    expect(evaluate(taskFor(row.key), responseFor(row, tuple))).toEqual({ status: 'incomplete',
      missing: row.ids.filter((_, i) => tuple[i] === undefined || tuple[i] === null || tuple[i] === '') });
  });
  it.each(oracle)('$key rejects malformed and unknown values before completeness', row => {
    const task = taskFor(row.key); const mapField = row.kind === 'choice' ? 'choices' : 'slots';
    const valid = responseFor(row, row.accepted[0]);
    const invalid: unknown[] = [null, undefined, [], {}, 'v1', { ...valid, extra: true }, { ...valid, kind: 'quantity' },
      { kind: row.kind, [mapField]: null }, { kind: row.kind, [mapField]: [] },
      { kind: row.kind, [mapField]: { unknown: null } },
      { kind: row.kind, [mapField]: Object.create({ [row.ids[0]]: row.domains[0][0] }) },
      ...[undefined, false, 0, {}, [], ' ', ' v1', 'v1 ', 'not-an-option', '\u200b', '，'].map(value => ({ kind: row.kind, [mapField]: { [row.ids[0]]: value } })),
      { kind: row.kind, [mapField]: { [row.ids[0]]: row.domains[0][0], [Symbol('extra')]: null } },
    ];
    for (const input of invalid) {
      const result = evaluate(task, input);
      expect(result).toMatchObject({ status: 'invalid-response' });
      expect(Object.keys(result).sort()).toEqual(['reason', 'status']);
    }
  });
  it('handles a fresh JSON-decoded task and frozen null-prototype answer without mutation', () => {
    const task = JSON.parse(JSON.stringify(taskFor('paired-parenthesis')));
    const input = Object.freeze({ kind: 'punctuation', slots: Object.freeze(Object.assign(Object.create(null), { close: ')', open: '(' })) });
    const before = JSON.stringify([task, input]);
    expect(evaluate(task, input)).toMatchObject({ status: 'judged', correct: true });
    expect(JSON.stringify([task, input])).toBe(before);
  });
});

describe('content gate and original sparse/coercion regression class', () => {
  it.each(oracle)('$key rejects malformed content through both public functions', row => {
    const original = taskFor(row.key);
    const reject = (change: (task: any) => void, code: string) => {
      const task = JSON.parse(JSON.stringify(original)); change(task);
      const issues = validate(task);
      expect(issues.map(issue => issue.code)).toContain(code);
      expect(evaluate(task, responseFor(row, row.accepted[0]))).toEqual({ status: 'unavailable-content', issues });
      expect(evaluate(task, null).status).toBe('unavailable-content');
    };
    for (let slot = 0; slot < row.ids.length; slot++) {
      for (let option = 0; option < row.domains[slot].length; option++) {
        for (const mode of ['hole', 'null', 'undefined']) reject(task => {
          if (mode === 'hole') delete task.responseSpec.slots[slot].options[option];
          else task.responseSpec.slots[slot].options[option] = mode === 'null' ? null : undefined;
        }, 'slot-domain-mismatch');
      }
      for (const bad of [null, undefined, 1, false, [], {}, JSON.parse('{"toString":null}'), Symbol('bad')]) {
        reject(task => { task.responseSpec.requiredSlotIds[slot] = bad; }, 'slot-domain-mismatch');
      }
      reject(task => { delete task.responseSpec.requiredSlotIds[slot]; }, 'slot-domain-mismatch');
    }
    reject(task => { task.responseSpec.slots[0].options.push(task.responseSpec.slots[0].options[0]); }, 'slot-domain-mismatch');
    reject(task => { task.responseSpec.slots[0].label += ' answer'; }, 'slot-domain-mismatch');
    reject(task => { task.answerRule.responses = []; }, 'answer-domain-mismatch');
    reject(task => { task.answerRule.responses.push(task.answerRule.responses[0]); }, 'answer-domain-mismatch');
    reject(task => { delete task.answerRule.responses[0]; }, 'answer-domain-mismatch');
    reject(task => { task.narration.assessedTextMayBeSpokenBeforeCheck = true; }, 'reviewed-content-mismatch');
    reject(task => { task.review.status = 'withheld'; }, 'reviewed-content-mismatch');
    reject(task => { task.assessedText += ' Change the convention.'; }, 'reviewed-content-mismatch');
    reject(task => { task.band = 'unreviewed'; }, 'reviewed-content-mismatch');
    reject(task => { task.curriculum = null; }, 'reviewed-content-mismatch');
    reject(task => { task.descriptor.parameters = { week: '2026-10-12' }; }, 'reviewed-content-mismatch');
    reject(task => { task.hints = new Array(2); }, 'reviewed-content-mismatch');
  });
  it.each([null, undefined, [], {}, { canonicalQuestionId: 'unknown' }])('unreviewed task remains unavailable: %s', task => {
    expect(evaluate(task as TaskDefinition, null).status).toBe('unavailable-content');
  });
  it.each(oracle)('$key permits cosmetic revision and all semantic reordering without regrading', row => {
    const original = taskFor(row.key);
    const task = JSON.parse(JSON.stringify(original)); task.contentRevision = 'cosmetic-reprint';
    task.responseSpec.slots.reverse(); task.responseSpec.requiredSlotIds.reverse();
    task.responseSpec.slots.forEach((slot: any) => slot.options.reverse()); task.answerRule.responses.reverse();
    expect(validate(task)).toEqual([]);
    for (const { tuple } of complete.filter(item => item.key === row.key)) expect(evaluate(task, responseFor(row, tuple))).toEqual(evaluate(original, responseFor(row, tuple)));
  });
});

describe('independent-review presentation repairs', () => {
  const affected = [
    { key: 'combined-proofread', wrongLabel: "After the rain stopped the childrens' coats dried.", features: ['comma after stopped', "children's", "childrens'"] },
    { key: 'apostrophe-inside-speech', wrongLabel: '“It’s raining”, said Pip.', features: ['“Its raining,”', '“It’s raining”,'] },
    { key: 'interrupted-one-sentence', wrongLabel: '“When the bell rings.” said Mira. “We will leave.”', features: ['capital We', '“When the bell rings.”', 'lower-case said'] },
    { key: 'two-spoken-sentences', wrongLabel: '“The bridge is safe.” said Mira. “We can cross.”', features: ['commas creates a splice', '“The bridge is safe.” said Mira.', 'lower-case said'] },
    { key: 'quotation-within-speech', wrongLabel: '“Pip shouted ‘Wait’! before the gate closed,” said Mira.', features: ['double quotes for both levels', '‘Wait’!'] },
  ];
  const decode = (text: string) => text.replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
  const shownLabels = (markup: string) => [...markup.matchAll(/aria-label="Choose ([^"]*)"/g)].map(match => decode(match[1]));
  const choose = (task: TaskDefinition, id: string) => {
    let draft = createDraft(task.responseSpec);
    draft = reduceDraft(draft, { kind: 'select', selection: { kind: 'mark', value: id } }, task.responseSpec);
    return reduceDraft(draft, { kind: 'place', targetId: 'version' }, task.responseSpec);
  };
  const render = (task: TaskDefinition, draft = createDraft(task.responseSpec), feedback = '') => renderToStaticMarkup(
    createElement('div', null, createElement(ChoiceTiles, { responseSpec: task.responseSpec, draft, disabled: false, onAction: () => {} }),
      createElement('p', { id: 'feedback' }, feedback)));
  const permutations = (ids: readonly string[]): string[][] => ids.length ? ids.flatMap(id => permutations(ids.filter(other => other !== id)).map(rest => [id, ...rest])) : [[]];
  it.each(affected)('F01 $key: original reversal and all displayed orders have coherent teaching', ({ key, wrongLabel, features }) => {
    const original = taskFor(key);
    if (original.responseSpec.kind !== 'choice') throw new Error('Choice fixture required');
    const slot = original.responseSpec.slots[0];
    // Reviewer reproduction first: reverse the authored options and choose v4.
    const reverse: TaskDefinition = { ...original, responseSpec: { ...original.responseSpec,
      slots: [{ ...slot, options: [...slot.options].reverse() }] } };
    expect(validate(reverse)).toEqual([]);
    const draft = choose(reverse, 'v4');
    const result = evaluate(reverse, toResponse(draft));
    expect(result).toMatchObject({ status: 'judged', correct: false });
    if (result.status !== 'judged') throw new Error('Expected judgement');
    expect(shownLabels(render(reverse, draft, result.feedback.explanation))).toEqual([...slot.options].reverse().map(option => option.label));
    expect(slot.options.find(option => option.id === 'v4')!.label).toBe(wrongLabel);
    expect(result.feedback.explanation).not.toMatch(/\b(first|second|third|fourth)\s+(?:choice|option|version)\b/i);
    features.forEach(feature => expect(result.feedback.explanation).toContain(feature));
    // Verify rendered labels and placed-label/feedback facts in every supported
    // order, not merely invariant explanation strings or evaluator Booleans.
    for (const order of permutations(['v1', 'v2', 'v3', 'v4'])) {
      const reordered: TaskDefinition = { ...original, responseSpec: { ...original.responseSpec,
        slots: [{ ...slot, options: order.map(id => slot.options.find(option => option.id === id)!) }] } };
      expect(validate(reordered)).toEqual([]);
      for (const id of order) {
        const selected = choose(reordered, id);
        const judged = evaluate(reordered, toResponse(selected));
        const expected = oracle.find(row => row.key === key)!;
        expect(judged).toMatchObject({ status: 'judged', correct: expected.accepted.some(tuple => tuple[0] === id) });
        if (judged.status !== 'judged') throw new Error('Expected judgement');
        const markup = render(reordered, selected, judged.feedback.explanation);
        expect(shownLabels(markup)).toEqual(order.map(optionId => slot.options.find(option => option.id === optionId)!.label));
        const placedLabel = decode(markup.match(/class="iw-slot"[^>]*>([\s\S]*?)<\/button>/)![1].replace(/<[^>]+>/g, ''));
        expect(placedLabel).toBe(slot.options.find(option => option.id === id)!.label + 'Replace selection');
        const shownFeedback = decode(markup.match(/<p id="feedback">([\s\S]*?)<\/p>/)![1]);
        expect(shownFeedback).toBe(judged.feedback.explanation);
        features.forEach(feature => expect(shownFeedback).toContain(feature));
      }
    }
  });
  it('F02 no fixed displayed position solves the complete-version bank', () => {
    const choices = tasks.filter(task => task.responseSpec.kind === 'choice');
    expect(choices).toHaveLength(13);
    const hitCounts = [0, 1, 2, 3].map(position => choices.filter(task => {
      if (task.responseSpec.kind !== 'choice') throw new Error('Choice fixture');
      const draft = choose(task, task.responseSpec.slots[0].options[position].id);
      const result = evaluate(task, toResponse(draft));
      return result.status === 'judged' && result.correct;
    }).length);
    expect(hitCounts).toEqual([4, 4, 6, 4]);
    for (const subset of [choices.filter(task => task.skillId === 'E06'), choices.filter(task => task.skillId === 'E07'),
      ...(['support', 'core', 'stretch'] as const).map(band => choices.filter(task => task.band === band))]) {
      for (const position of [0, 1, 2, 3]) expect(subset.every(task => {
        if (task.responseSpec.kind !== 'choice') throw new Error('Choice fixture');
        const result = evaluate(task, toResponse(choose(task, task.responseSpec.slots[0].options[position].id)));
        return result.status === 'judged' && result.correct;
      })).toBe(false);
    }
  });
  it.each(oracle)('$key fresh actual draft and rendered controls remain blank', row => {
    const task = taskFor(row.key), draft = createDraft(task.responseSpec);
    expect(draft.selection).toBeNull(); expect(draft.undo).toEqual([]);
    expect(evaluate(task, toResponse(draft))).toEqual({ status: 'incomplete', missing: row.ids });
    const markup = render(task, draft);
    expect(markup).not.toContain('aria-pressed="true"');
    expect((markup.match(/Empty space/g) ?? []).length).toBe(row.ids.length);
  });
});

describe('inventory, source, assistance and receiving contract', () => {
  it('pins twenty meaningful new identities and exact skill bands', () => {
    expect(tasks).toHaveLength(20);
    expect(tasks.map(task => task.descriptor.authoredKey)).toEqual(oracle.map(row => row.key));
    expect(new Set(tasks.map(task => task.canonicalQuestionId)).size).toBe(20);
    expect(new Set(tasks.map(task => task.assessedText)).size).toBe(20);
    for (const skill of ['E06', 'E07']) for (const [band, count] of [['support', 3], ['core', 4], ['stretch', 3]] as const) {
      expect(tasks.filter(task => task.skillId === skill && task.band === band)).toHaveLength(count);
    }
    for (const row of oracle) {
      const task = taskFor(row.key);
      expect(task).toMatchObject({ skillId: row.skill, band: row.band, objectiveId: row.skill === 'E06' ? 'E06-punctuation' : 'E07-direct-speech' });
      expect(canonicalQuestionId(task.descriptor)).toBe(task.canonicalQuestionId);
      expect(task.descriptor.parameters).toEqual({});
      expect(task.curriculum.sourceUrl).toMatch(/^https:\/\/www.gov.uk\/government\/publications\/national-curriculum-in-england-english/);
      expect(task.curriculum.section).toContain('punctuation');
      expect(task.demandRationale.length).toBeGreaterThan(60);
      expect(task.review.reviewer).toContain('no qualified educator or child review');
      expect(Object.isFrozen(task.responseSpec)).toBe(true);
      expect(task.assessedText.split(/\s+/).length).toBeLessThanOrEqual(60);
      const spec = task.responseSpec;
      if (spec.kind !== 'choice' && spec.kind !== 'punctuation') throw new Error('Unexpected form');
      expect(spec.slots.length).toBeLessThanOrEqual(3);
      spec.slots.forEach(slot => expect(slot.options.length).toBeLessThanOrEqual(4));
      if (task.answerRule.kind !== 'accepted-responses') throw new Error('Unexpected rule');
      expect(task.answerRule.responses.length).toBeLessThanOrEqual(4);
    }
    expect(taskFor('paired-parenthesis').curriculum.programmeBand).toContain('Years 5–6');
    expect(taskFor('address-not-food').curriculum.programmeBand).toContain('Years 5–6');
    expect(taskFor('quotation-within-speech').demandRationale).toContain('not claimed as a statutory');
    expect(taskFor('combined-proofread').curriculum.programmeBand).toContain('Years 3–4');
  });
  it('preserves exact neutral narration and distinct help roles', () => {
    const neutral = 'Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.';
    for (const task of tasks) {
      expect(task.instructionText).toBe(neutral);
      expect(task.narration).toEqual({ neutralText: neutral, assessedTextMayBeSpokenBeforeCheck: false });
      expect(task.hints).toHaveLength(2);
      expect(task.hints[0].text).not.toBe(task.hints[1].text);
      task.hints.forEach(hint => expect(hint.text).not.toMatch(/comma|apostrophe|exclamation|question mark|full stop|v[1-4]|[?!]/i));
      expect(task.workedSupport.text.length).toBeGreaterThan(80);
    }
  });
  it('offers four separate M2 optional Q2 bindings without changing M1', () => {
    expect(proposals.map(row => row.bindingId)).toEqual(['q2-revisit-e06-punctuation', 'q2-revisit-e06-choice', 'q2-revisit-e07-punctuation', 'q2-revisit-e07-choice']);
    for (const proposal of proposals) {
      expect(proposal).toMatchObject({ questId: 'Q2', availability: 'M2', role: 'revisit', sourceBindingId: null });
      expect(proposal.taskIds.length).toBeGreaterThan(0);
      expect(proposal.taskIds.some(id => tasks.find(task => task.canonicalQuestionId === id)?.band === 'support')).toBe(true);
      proposal.taskIds.forEach(id => expect(tasks.find(task => task.canonicalQuestionId === id)).toMatchObject({ skillId: proposal.skillId, responseSpec: { kind: proposal.responseKind } }));
    }
    expect(proposals.flatMap(row => row.taskIds).sort()).toEqual(tasks.map(task => task.canonicalQuestionId).sort());
  });
  it('uses starter manifest references and exposes only new records and real manifest cases', () => {
    expect(manifest.retainedTaskIds).toBe(starterManifest.taskIds);
    expect(tasks.some(task => manifest.retainedTaskIds.includes(task.canonicalQuestionId))).toBe(false);
    expect(manifest.taskIds).toEqual(tasks.map(task => task.canonicalQuestionId));
    expect(manifest.cases).toHaveLength(136);
    expect(new Set(manifest.cases.map(item => item.caseId)).size).toBe(136);
    for (const item of manifest.cases) {
      const result = evaluate(tasks.find(task => task.canonicalQuestionId === item.canonicalQuestionId)!, item.response);
      expect(result.status).toBe(item.expectedStatus);
      if (result.status === 'judged') {
        expect(result.correct).toBe(item.expectedCorrect);
        expect(result.feedback.issues.map(issue => issue.code)).toEqual(item.expectedIssueCodes);
      }
    }
  });
  it('retains the literal nine-pair M1 oracle and both fixed anchor endings as one question', () => {
    const anchor = starters.find(task => task.canonicalQuestionId === 'lif.english.punctuation.r1.spellbook-anchor')!;
    expect(anchor.assessedText).toContain('Where are my magic books ___\nLook, there they are ___');
    const pairs = [['.', '.', false], ['.', '?', false], ['.', '!', false], ['?', '.', true], ['?', '?', false], ['?', '!', true], ['!', '.', false], ['!', '?', false], ['!', '!', false]] as const;
    const successes = [];
    for (const [question, discovery, correct] of pairs) {
      const result = evaluateStarterPunctuation(anchor, { kind: 'punctuation', slots: { question, discovery } });
      expect(result).toMatchObject({ status: 'judged', correct, canonicalQuestionId: anchor.canonicalQuestionId, band: 'support' });
      if (correct) successes.push(result);
    }
    expect(successes).toHaveLength(2); expect(successes[0]).toEqual(successes[1]);
    expect(validate(anchor).map(issue => issue.code)).toEqual(['unreviewed-task']);
  });
  it('imports no state, audio, UI, remote grading or reward runtime', () => {
    for (const path of ['src/content/expansion-english/punctuation.ts', 'src/learning/evaluators/expansion-punctuation.ts']) {
      const source = readFileSync(path, 'utf8');
      expect(source).not.toMatch(/from ['"].*(?:state|audio|react|rewards)/);
      expect(source).not.toMatch(/\b(?:fetch|window|document|speechSynthesis|indexedDB)\b/);
    }
  });
});
