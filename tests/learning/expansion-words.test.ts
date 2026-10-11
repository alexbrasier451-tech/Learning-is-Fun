import { describe, expect, it } from 'vitest';
import { WORD_BINDING_PROPOSALS, WORD_HANDOFF_CASES, WORD_MANIFEST, WORD_TASKS } from '../../src/content/expansion-english/words';
import { evaluateExpansionWords, validateWordTask } from '../../src/learning/evaluators/expansion-words';
import { canonicalQuestionId } from '../../src/learning/identity';
import { STARTER_PUNCTUATION_TASKS } from '../../src/content/starter-english';
import type { TaskDefinition } from '../../src/learning/contracts';

const task = (key: string) => WORD_TASKS.find(row => row.descriptor.authoredKey === key)!;
const check = (key: string, word: unknown) => evaluateExpansionWords(task(key), { kind: 'choice', choices: { word } });
// Independent lexical oracle: written from the contextual review, not extracted
// from production answerRule, explanation, or generated manifest responses.
const lexical: readonly [string, readonly string[], readonly string[]][] = [
  ['e01-unfasten', ['refasten', 'unfasten', 'fastening'], ['b']],
  ['e01-rewrite', ['unwrite', 'miswrite', 'rewrite'], ['c']],
  ['e01-illegal', ['inlegal', 'ilegal', 'illegal', 'illlegal'], ['c']],
  ['e01-happily', ['happily', 'happyly', 'hapily'], ['a']],
  ['e01-disappear', ['dissappear', 'disappear', 'disapear'], ['b']],
  ['e01-gently', ['gentlely', 'gentlly', 'gently'], ['c']],
  ['e01-forgetting', ['forgeting', 'forgetting', 'forgeteing'], ['b']],
  ['e01-preferred', ['offerred / preferred', 'offered / prefered', 'offered / preferred'], ['c']],
  ['e01-reliable', ['relyable', 'reliable', 'relyible', 'reliible'], ['b']],
  ['e02-sea', ['see', 'sea'], ['b']],
  ['e02-hear', ['hear', 'here'], ['a']],
  ['e02-pair', ['pear', 'pair'], ['b']],
  ['e02-accept-delivery', ['except', 'accept'], ['b']],
  ['e02-plane-tool', ['plain', 'plane'], ['b']],
  ['e02-weather', ['weather', 'whether'], ['a']],
  ['e02-brake', ['break', 'brake'], ['b']],
  ['e02-practice-rehearsal', ['practice / practice', 'practise / practice', 'practice / practise', 'practise / practise'], ['c']],
  ['e02-whose', ['who’s', 'whose'], ['b']],
  ['e02-stationery', ['stationery', 'stationary'], ['a']],
  ['e03-warm', ['bright', 'cool', 'sweet'], ['b']],
  ['e03-tiny', ['very heavy', 'very small', 'very old'], ['b']],
  ['e03-faint', ['dazzling', 'dim', 'noisy', 'weak'], ['b', 'd']],
  ['e03-fragile', ['easy to break', 'hard to lift', 'safe to drop'], ['a']],
  ['e03-transparent', ['impossible to see through', 'easy to see through', 'strongly scented', 'clear'], ['b', 'd']],
  ['e03-scarce', ['available in large amounts', 'few in number', 'easy to grow'], ['b']],
  ['e03-sharp', ['having a pointed tip', 'strong and pungent', 'quick to understand'], ['b']],
  ['e03-reserve', ['use it all now', 'keep it for later', 'set it aside', 'throw it away'], ['b', 'c']],
  ['e03-mild-weather-scent', ['gentle', 'not cold for the season', 'faint', 'not severe as an illness'], ['a', 'c']],
];
describe('reviewed lexical alternatives through actual word exports', () => {
  it.each(lexical)('%s checks every offered spelling/meaning', (key, labels, accepted) => {
    const row = task(key);
    expect(row.responseSpec.kind).toBe('choice');
    if (row.responseSpec.kind !== 'choice') throw new Error('Wrong response family');
    expect(row.responseSpec.slots[0].options.map(option => option.label)).toEqual(labels);
    for (const [index] of labels.entries()) {
      const id = ['a', 'b', 'c', 'd'][index];
      const result = check(key, id);
      expect(result).toMatchObject({ status: 'judged', correct: accepted.includes(id), canonicalQuestionId: row.canonicalQuestionId, skillId: row.skillId, band: row.band, objectiveId: row.objectiveId });
      if (result.status !== 'judged') throw new Error('Expected judged');
      expect(result.feedback.explanation).toBe(row.explanation);
      expect(result.feedback.issues.map(issue => issue.code)).toEqual(accepted.includes(id) ? [] : ['word-choice-mismatch']);
    }
  });
  it('exhausts all sixteen suffix-sort maps using the reviewed semantic rule', () => {
    const items = ['hopeful', 'fearless', 'careful', 'painless'];
    for (let mask = 0; mask < 16; mask++) {
      const groups = Object.fromEntries(items.map((id, i) => [id, mask & (1 << i) ? 'having' : 'without']));
      const result = evaluateExpansionWords(task('e01-suffix-sort'), { kind: 'sorting', groups });
      expect(result).toMatchObject({ status: 'judged', correct: mask === 5 });
      if (result.status === 'judged') expect(result.feedback.issues.map(issue => issue.slotId)).toEqual(items.filter((_, i) => Boolean(mask & (1 << i)) !== (i === 0 || i === 2)));
    }
  });
  it('checks the two complete unique matchings and duplicate-target rejection', () => {
    expect(evaluateExpansionWords(task('e03-label-match'), { kind: 'matching', pairs: { start: 'begin', stop: 'cease' } })).toMatchObject({ status: 'judged', correct: true });
    expect(evaluateExpansionWords(task('e03-label-match'), { kind: 'matching', pairs: { stop: 'begin', start: 'cease' } })).toMatchObject({ status: 'judged', correct: false });
    expect(evaluateExpansionWords(task('e03-label-match'), { kind: 'matching', pairs: { start: 'begin', stop: 'begin' } })).toMatchObject({ status: 'invalid-response' });
  });
  it.each(WORD_TASKS)('$descriptor.authoredKey keeps missing/null drafts unscored and invalid values take precedence', row => {
    const kind = row.responseSpec.kind;
    const field = kind === 'choice' ? 'choices' : kind === 'sorting' ? 'groups' : 'pairs';
    const ids = kind === 'choice' && row.responseSpec.kind === 'choice' ? row.responseSpec.requiredSlotIds
      : row.responseSpec.kind === 'sorting' || row.responseSpec.kind === 'matching' ? row.responseSpec.requiredItemIds : [];
    expect(evaluateExpansionWords(row, { kind, [field]: {} })).toEqual({ status: 'incomplete', missing: ids });
    expect(evaluateExpansionWords(row, { kind, [field]: Object.fromEntries(ids.map(id => [id, null])) })).toEqual({ status: 'incomplete', missing: ids });
    for (const value of ['UNKNOWN', '', false, 0, NaN, Infinity, undefined, [], {}, 'a '.trimEnd().toUpperCase()]) {
      expect(evaluateExpansionWords(row, { kind, [field]: { [ids[0]]: value } }).status).toBe('invalid-response');
    }
    expect(evaluateExpansionWords(row, { kind, [field]: { unexpected: null } }).status).toBe('invalid-response');
    expect(evaluateExpansionWords(row, { kind, [field]: {}, extra: true }).status).toBe('invalid-response');
    expect(evaluateExpansionWords(row, { kind: 'quantity', values: {} }).status).toBe('invalid-response');
  });
  it('retains actual assessed case, punctuation and spelling instead of grading answer text', () => {
    for (const text of ['unfasten', 'Unfasten', 'UNFASTEN', 'b ', 'B']) expect(check('e01-unfasten', text).status).toBe('invalid-response');
    for (const form of ['Illegal', 'illegal ', 'illegal.', 'ilegal']) {
      const clone = structuredClone(task('e01-illegal'));
      if (clone.responseSpec.kind === 'choice') (clone.responseSpec.slots[0].options[2] as { label: string }).label = form;
      expect(evaluateExpansionWords(clone, { kind: 'choice', choices: { word: 'c' } }).status).toBe('unavailable-content');
    }
  });
});

describe('finite content, identities, bands, assistance and receiving inventory', () => {
  it('retires the four rejected unpublished identities instead of reusing their receipts for different work', () => {
    const replacements = [
      ['e02-their', 'e02-accept-delivery'], ['e02-youre', 'e02-plane-tool'],
      ['e02-piece', 'e02-practice-rehearsal'], ['e03-mild', 'e03-mild-weather-scent'],
    ];
    for (const [oldKey, newKey] of replacements) {
      const replacement = task(newKey);
      const oldDescriptor = { ...replacement.descriptor, authoredKey: oldKey };
      const oldId = canonicalQuestionId(oldDescriptor);
      expect(WORD_TASKS.some(row => row.canonicalQuestionId === oldId)).toBe(false);
      expect(WORD_MANIFEST.taskIds).not.toContain(oldId);
      expect(WORD_BINDING_PROPOSALS.flatMap(row => row.taskIds)).not.toContain(oldId);
      expect(WORD_HANDOFF_CASES.map(row => row.canonicalQuestionId)).not.toContain(oldId);
      expect(validateWordTask({ ...replacement, descriptor: oldDescriptor, canonicalQuestionId: oldId })[0].code).toBe('unreviewed-task');
      expect(replacement.canonicalQuestionId).not.toBe(oldId);
    }
    expect(check('e03-mild-weather-scent', 'a')).toEqual(check('e03-mild-weather-scent', 'c'));
  });
  it('validates 30 distinct originals with the exact band floors and unchanged starter namespace', () => {
    expect(WORD_TASKS).toHaveLength(30);
    expect(new Set(WORD_TASKS.map(row => row.canonicalQuestionId)).size).toBe(30);
    expect(WORD_TASKS.every(row => validateWordTask(row).length === 0)).toBe(true);
    for (const skill of ['E01', 'E02', 'E03']) {
      expect(WORD_TASKS.filter(row => row.skillId === skill && row.band === 'support')).toHaveLength(3);
      expect(WORD_TASKS.filter(row => row.skillId === skill && row.band === 'core')).toHaveLength(4);
      expect(WORD_TASKS.filter(row => row.skillId === skill && row.band === 'stretch')).toHaveLength(3);
    }
    for (const row of WORD_TASKS) {
      expect(canonicalQuestionId(row.descriptor)).toBe(row.canonicalQuestionId);
      expect(STARTER_PUNCTUATION_TASKS.some(starter => starter.canonicalQuestionId === row.canonicalQuestionId)).toBe(false);
      expect(row.assessedText.split(/\s+/).length).toBeLessThanOrEqual(60);
      expect(row.review.status).toBe('approved');
      expect(row.curriculum.sourceUrl).toContain('gov.uk/');
      expect(row.demandRationale.length).toBeGreaterThan(60);
      expect(Object.isFrozen(row.responseSpec)).toBe(true);
      if (row.responseSpec.kind === 'choice') expect(row.responseSpec.slots[0].options.length).toBeLessThanOrEqual(4);
      else if (row.responseSpec.kind === 'sorting' || row.responseSpec.kind === 'matching') expect(row.responseSpec.items.length).toBeLessThanOrEqual(6);
    }
    expect(WORD_MANIFEST.retainedTaskIds).toEqual([]);
    expect(STARTER_PUNCTUATION_TASKS[0].canonicalQuestionId).toBe('lif.english.punctuation.r1.spellbook-anchor');
  });
  it('supplies the exact Q6 E02 choice pool including three support routes', () => {
    const pool = WORD_TASKS.filter(row => row.skillId === 'E02' && row.responseSpec.kind === 'choice');
    expect(pool.map(row => row.descriptor.authoredKey)).toEqual(['e02-sea', 'e02-hear', 'e02-pair', 'e02-accept-delivery', 'e02-plane-tool', 'e02-weather', 'e02-brake', 'e02-practice-rehearsal', 'e02-whose', 'e02-stationery']);
    expect(pool.filter(row => row.band === 'support')).toHaveLength(3);
    for (const [skill, kind, count] of [['E01', 'choice', 9], ['E01', 'sorting', 1], ['E02', 'choice', 10], ['E03', 'choice', 9], ['E03', 'matching', 1]] as const)
      expect(WORD_TASKS.filter(row => row.skillId === skill && row.responseSpec.kind === kind)).toHaveLength(count);
  });
  it('resolves six frozen proposals and all receiving cases without changing the central catalogue', () => {
    expect(WORD_BINDING_PROPOSALS.map(row => row.bindingId)).toEqual(['q6-story-e02-clue', 'q6-revisit-e01-choice', 'q6-revisit-e01-sorting', 'q6-revisit-e02-choice', 'q5-revisit-e03-choice', 'q5-revisit-e03-matching']);
    expect(WORD_BINDING_PROPOSALS.filter(row => row.role === 'story')).toHaveLength(1);
    expect(WORD_BINDING_PROPOSALS[0].taskIds).toEqual(WORD_TASKS.filter(row => row.skillId === 'E02').map(row => row.canonicalQuestionId));
    for (const binding of WORD_BINDING_PROPOSALS) {
      expect(binding.sourceBindingId).toBeNull(); expect(binding.availability).toBe('M2');
      expect(binding.taskIds.length).toBeGreaterThan(0);
      for (const id of binding.taskIds) {
        const row = WORD_TASKS.find(item => item.canonicalQuestionId === id)!;
        expect(row.skillId).toBe(binding.skillId); expect(row.responseSpec.kind).toBe(binding.responseKind);
      }
    }
    expect(new Set(WORD_BINDING_PROPOSALS.flatMap(row => row.taskIds)).size).toBe(30);
    for (const example of WORD_HANDOFF_CASES) {
      const binding = WORD_BINDING_PROPOSALS.find(row => row.bindingId === example.bindingId)!;
      expect(binding.taskIds).toContain(example.canonicalQuestionId);
      const row = WORD_TASKS.find(item => item.canonicalQuestionId === example.canonicalQuestionId)!;
      expect(evaluateExpansionWords(row, example.response)).toMatchObject({ status: example.expectedStatus, correct: example.expectedCorrect });
      if (example.expectedEvidenceMode === 'listening-supported') expect(row.narration.assessedTextMayBeSpokenBeforeCheck).toBe(true);
    }
  });
  it('keeps neutral narration separate from assessed listening and explicit answer help', () => {
    for (const row of WORD_TASKS) {
      expect(row.narration.neutralText).toBe(row.instructionText);
      expect(row.narration.neutralText).not.toBe(row.assessedText);
      expect(row.narration.assessedTextMayBeSpokenBeforeCheck).toBe(row.skillId !== 'E01');
      expect(row.hints.map(hint => hint.id)).toEqual(['attention', 'strategy']);
      expect(row.hints[0].text).not.toBe(row.hints[1].text);
      expect(row.workedSupport.id).toBe('worked');
      expect(row.workedSupport.text).not.toBe(row.explanation);
      if (row.responseSpec.kind === 'choice' && row.answerRule.kind === 'accepted-responses') {
        for (const response of row.answerRule.responses) if (response.kind === 'choice') {
          const label = row.responseSpec.slots[0].options.find(option => option.id === response.choices.word)!.label;
          expect(row.narration.neutralText.toLowerCase()).not.toContain(label.toLowerCase());
          for (const hint of row.hints) expect(hint.text.toLowerCase()).not.toContain(label.toLowerCase());
        }
      }
    }
    // Fresh receiving path: listening changes assistance evidence downstream;
    // this pure evaluator has no help/score input and accepts the same answer.
    expect(check('e03-reserve', 'c')).toMatchObject({ status: 'judged', correct: true });
  });
  it('runs every frozen manifest case through the actual exported evaluator', () => {
    expect(WORD_MANIFEST.taskIds).toEqual(WORD_TASKS.map(row => row.canonicalQuestionId));
    for (const example of WORD_MANIFEST.cases) {
      const row = WORD_TASKS.find(item => item.canonicalQuestionId === example.canonicalQuestionId)!;
      const result = evaluateExpansionWords(row, example.response);
      expect(result.status).toBe(example.expectedStatus);
      if (result.status === 'judged') {
        expect(result.correct).toBe(example.expectedCorrect);
        expect(result.feedback.issues.map(issue => issue.code)).toEqual(example.expectedIssueCodes);
      }
    }
  });
  it('accepts JSON reconstruction, revision-only updates and reordered presentation with stable IDs', () => {
    for (const row of WORD_TASKS) {
      const clone = JSON.parse(JSON.stringify(row)) as TaskDefinition;
      (clone as { contentRevision: string }).contentRevision = '2';
      if (clone.responseSpec.kind === 'choice') (clone.responseSpec.slots[0].options as unknown[]).reverse();
      if (clone.responseSpec.kind === 'sorting') (clone.responseSpec.items as unknown[]).reverse();
      if (clone.responseSpec.kind === 'matching') (clone.responseSpec.targets as unknown[]).reverse();
      expect(validateWordTask(clone)).toEqual([]);
      if (row.answerRule.kind === 'accepted-responses') expect(evaluateExpansionWords(clone, row.answerRule.responses[0])).toMatchObject({ status: 'judged', correct: true });
    }
  });
  it('withholds missing or unreviewed content before inspecting learner input', () => {
    for (const field of Object.keys(task('e02-sea'))) {
      const clone = structuredClone(task('e02-sea')) as unknown as Record<string, unknown>;
      delete clone[field];
      expect(evaluateExpansionWords(clone as unknown as TaskDefinition, null).status).toBe('unavailable-content');
    }
    for (const mutation of [
      { band: 'stretch' }, { skillId: 'E01' }, { contentRevision: '' }, { assessedText: 'Different clue' },
      { answerRule: { kind: 'accepted-responses', responses: [] } }, { review: { status: 'withheld' } },
      { hints: [] }, { stimulus: null }, { curriculum: null }, { extra: true },
      { descriptor: { familyId: 'english.words.e02', equivalenceVersion: 'r2', authoredKey: 'e02-sea', parameters: {} } },
    ]) expect(evaluateExpansionWords({ ...task('e02-sea'), ...mutation } as TaskDefinition, null).status).toBe('unavailable-content');
    const unknown = structuredClone(task('e02-sea'));
    (unknown.descriptor as { authoredKey: string }).authoredKey = 'unreviewed';
    (unknown as { canonicalQuestionId: string }).canonicalQuestionId = canonicalQuestionId(unknown.descriptor);
    expect(validateWordTask(unknown)[0].code).toBe('unreviewed-task');
  });
  it('guards non-finite, cyclic, non-JSON, accessor and sparse boundaries', () => {
    const cyclic: Record<string, unknown> = {}; cyclic.self = cyclic;
    const getter = Object.defineProperty({}, 'trap', { enumerable: true, get: () => { throw new Error('Getter must not run'); } });
    const symbol = { [Symbol('hidden')]: true };
    const hidden = Object.defineProperty({}, 'hidden', { value: true });
    for (const value of [undefined, null, NaN, Infinity, BigInt(1), () => true, cyclic, getter, symbol, hidden, new Date(), new Array(2)]) {
      expect(evaluateExpansionWords(value as TaskDefinition, null).status).toBe('unavailable-content');
      expect(evaluateExpansionWords(task('e02-sea'), value).status).toBe('invalid-response');
    }
    const bad = structuredClone(task('e02-sea')) as unknown as Record<string, unknown>;
    bad.contentRevision = NaN;
    expect(validateWordTask(bad as unknown as TaskDefinition)[0].code).toBe('malformed-content');
  });
});
