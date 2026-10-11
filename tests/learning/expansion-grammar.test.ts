import { describe, expect, it } from 'vitest';
import type { ActivityResponse, TaskDefinition } from '../../src/learning/contracts';
import { canonicalQuestionId } from '../../src/learning/identity';
import { SKILLS, PREREQUISITE_SUGGESTIONS } from '../../src/content/skills';
import { usedAnswerHelp } from '../../src/learning/evidence';
import { createDraft, reduceDraft, toResponse } from '../../src/interaction/draft';
import { GRAMMAR_TASKS, GRAMMAR_MANIFEST, GRAMMAR_BINDING_PROPOSALS, GRAMMAR_HANDOFF_CASES } from '../../src/content/expansion-english/grammar';
import { evaluateExpansionGrammar, validateGrammarTask } from '../../src/learning/evaluators/expansion-grammar';

const task = (key: string) => GRAMMAR_TASKS.find(row => row.descriptor.authoredKey === key)!;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const sorts = [
  ['otter-actions', 'support', ['noun', 'verb'], [['otters', 'Otters', 'noun'], ['splash', 'splash', 'verb'], ['rocks', 'rocks', 'noun']]],
  ['meadow-description', 'support', ['noun', 'adjective'], [['narrow', 'narrow', 'adjective'], ['path', 'path', 'noun'], ['quiet', 'quiet', 'adjective'], ['meadow', 'meadow', 'noun']]],
  ['careful-movements', 'support', ['verb', 'adverb'], [['carefully', 'carefully', 'adverb'], ['opens', 'opens', 'verb'], ['gently', 'gently', 'adverb'], ['lifts', 'lifts', 'verb']]],
  ['lantern-reference', 'core', ['determiner', 'pronoun'], [['these', 'These', 'determiner'], ['us', 'us', 'pronoun'], ['they', 'They', 'pronoun'], ['the', 'the', 'determiner']]],
  ['oak-relations', 'core', ['preposition', 'conjunction'], [['under', 'under', 'preposition'], ['because', 'because', 'conjunction'], ['beyond', 'beyond', 'preposition']]],
  ['watch-clause', 'core', ['noun', 'verb', 'conjunction'], [['watch', 'watch', 'noun'], ['stopped', 'stopped', 'verb'], ['while', 'while', 'conjunction'], ['watched', 'watched', 'verb'], ['river', 'river', 'noun']]],
  ['sweet-soup', 'core', ['noun', 'verb', 'adjective', 'adverb'], [['sweet', 'sweet', 'adjective'], ['smells', 'smells', 'verb'], ['baker', 'baker', 'noun'], ['softly', 'softly', 'adverb']]],
  ['hard-roles', 'stretch', ['noun', 'verb', 'adjective', 'adverb'], [['hard-seed', 'hard (before seed)', 'adjective'], ['seed', 'seed', 'noun'], ['fell', 'fell', 'verb'], ['hard-fall', 'hard (after fell)', 'adverb']]],
  ['before-roles', 'stretch', ['noun', 'verb', 'preposition', 'conjunction'], [['before-dawn', 'Before (first sentence)', 'preposition'], ['dawn', 'dawn', 'noun'], ['before-sun', 'before (second sentence)', 'conjunction'], ['rose', 'rose', 'verb']]],
  ['that-roles', 'stretch', ['determiner', 'pronoun', 'verb'], [['that-key', 'That (before key)', 'determiner'], ['opens', 'opens', 'verb'], ['that-chest', 'that (after chest)', 'pronoun'], ['holds', 'holds', 'verb']]],
] as const;

// Independent language-review oracle: every offered choice, its exact text,
// and its disposition. Nothing is read from production answerRule to decide it.
const choices = [
  ['add-two-actions', 'support', [
    ['add', 'Tess rings a bell and Jo waves a flag.', true],
    ['reason', 'Tess rings a bell because Jo waves a flag.', false],
    ['condition', 'Tess rings a bell if Jo waves a flag.', false],
  ]],
  ['explain-dry-pots', 'support', [
    ['cause', 'The pots stayed dry because the roof covered them.', true],
    ['despite', 'The pots stayed dry although the roof covered them.', false],
    ['uncertain', 'The pots stayed dry if the roof covered them.', false],
  ]],
  ['contrast-heavy-basket', 'support', [
    ['contrast', 'The basket was heavy but Arun lifted it easily.', true],
    ['cause', 'The basket was heavy because Arun lifted it easily.', false],
    ['alternative', 'The basket was heavy or Arun lifted it easily.', false],
  ]],
  ['concede-wind', 'core', [['although', 'Although', true], ['even-though', 'Even though', true], ['because', 'Because', false], ['if', 'If', false]]],
  ['condition-pass', 'core', [['if', 'if', true], ['provided', 'provided that', true], ['because', 'because', false], ['although', 'although', false]]],
  ['relative-gardeners', 'stretch', [
    ['who', 'Only the gardeners who carry passes may enter.', true],
    ['that', 'Only the gardeners that carry passes may enter.', true],
    ['all', 'Only the gardeners, who carry passes, may enter.', false],
    ['without', 'Only the gardeners who have no passes may enter.', false],
  ]],
  ['relative-repaired-rope', 'stretch', [
    ['that', 'The rope that Inez repaired holds the sail.', true],
    ['omitted', 'The rope Inez repaired holds the sail.', true],
    ['which', 'The rope which Inez repaired holds the sail.', true],
    ['reversed', 'The rope that repaired Inez holds the sail.', false],
  ]],
] as const;
const orders = [
  ['flooded-path-cause', [['flood', 'rain flooded the path'], ['because', 'because'], ['wait', 'we waited inside']], [
    ['wait,because,flood', true], ['because,flood,wait', true],
    ['flood,because,wait', false], ['because,wait,flood', false],
    ['wait,flood,because', false], ['flood,wait,because', false],
  ]],
  ['pack-before-leave', [['leave', 'we left the field'], ['before', 'before'], ['pack', 'we packed the tent']], [
    ['pack,before,leave', true], ['before,leave,pack', true],
    ['leave,before,pack', false], ['before,pack,leave', false],
    ['pack,leave,before', false], ['leave,pack,before', false],
  ]],
] as const;
const nestMatrix = [
  ['although', 'because', true], ['although', 'although', false],
  ['because', 'because', false], ['because', 'although', false],
] as const;
function maps(ids: readonly string[], groups: readonly string[]): Record<string, string>[] {
  if (!ids.length) return [{}];
  return groups.flatMap(group => maps(ids.slice(1), groups).map(tail => ({ [ids[0]]: group, ...tail })));
}
function judge(t: TaskDefinition, response: unknown, correct: boolean) {
  const result = evaluateExpansionGrammar(t, response);
  expect(result).toMatchObject({ status: 'judged', correct, canonicalQuestionId: t.canonicalQuestionId, skillId: t.skillId, objectiveId: t.objectiveId, band: t.band });
  if (result.status === 'judged') expect(result.feedback.issues.map(issue => issue.code)).toEqual(correct ? [] : ['grammar-meaning-mismatch']);
}

describe('independently reviewed complete response domains', () => {
  it.each(sorts)('%s: every full contextual grouping is judged', (key, band, groups, items) => {
    const t = task(key);
    expect(t.band).toBe(band);
    expect(t.responseSpec).toEqual({ kind: 'sorting', items: items.map(([id, label]) => ({ id, label })), groups: groups.map(id => ({ id, label: id === 'pronoun' && key === 'that-roles' ? 'Pronoun (including relative pronouns)' : id[0].toUpperCase() + id.slice(1) })), requiredItemIds: items.map(([id]) => id) });
    const expected = Object.fromEntries(items.map(([id, , group]) => [id, group]));
    expect(t.answerRule).toEqual({ kind: 'accepted-responses', responses: [{ kind: 'sorting', groups: expected }] });
    for (const groups of maps(items.map(([id]) => id), t.responseSpec.kind === 'sorting' ? t.responseSpec.groups.map(group => group.id) : [])) {
      judge(t, { kind: 'sorting', groups }, items.every(([id, , group]) => groups[id] === group));
    }
  });
  it.each(choices)('%s: every choice is judged without a preferred valid synonym', (key, band, rows) => {
    const t = task(key);
    expect(t.band).toBe(band);
    expect(t.responseSpec).toMatchObject({ kind: 'choice', slots: [{ id: 'sentence', options: rows.map(([id, label]) => ({ id, label })) }], requiredSlotIds: ['sentence'] });
    expect(t.answerRule).toEqual({ kind: 'accepted-responses', responses: rows.filter(([, , ok]) => ok).map(([id]) => ({ kind: 'choice', choices: { sentence: id } })) });
    for (const [id, , correct] of rows) judge(t, { kind: 'choice', choices: { sentence: id } }, correct);
  });
  it.each(orders)('%s: all six orders including grammatical wrong-meaning ones', (key, tiles, matrix) => {
    const t = task(key);
    expect(t.band).toBe('core');
    expect(t.responseSpec).toEqual({ kind: 'sequence', tiles: tiles.map(([id, label]) => ({ id, label })), cardinality: { min: 3, max: 3 } });
    expect(t.answerRule).toEqual({ kind: 'accepted-responses', responses: matrix.filter(([, ok]) => ok).map(([order]) => ({ kind: 'sequence', orderedIds: order.split(',') })) });
    expect(new Set(matrix.map(([order]) => order)).size).toBe(6);
    for (const [order, correct] of matrix) judge(t, { kind: 'sequence', orderedIds: order.split(',') }, correct);
  });
  it.each(orders)('%s: fresh draft is unsolved and every accepted order is reachable through real controls', (key, _tiles, matrix) => {
    const t = task(key);
    const fresh = createDraft(t.responseSpec);
    expect(fresh.undo).toHaveLength(0);
    expect(fresh.selection).toBeNull();
    judge(t, toResponse(fresh), false);
    for (const [order] of matrix.filter(([, correct]) => correct)) {
      const expected = order.split(',');
      for (const control of ['move', 'select-place'] as const) {
        let draft = createDraft(t.responseSpec);
        for (const [index, id] of expected.entries()) {
          if (draft.kind !== 'sequence') throw new Error('Expected a sequence draft');
          if (control === 'move') {
            // The actual Earlier button action, repeated only as needed.
            const steps = draft.orderedIds.indexOf(id) - index;
            for (let i = 0; i < steps; i++) draft = reduceDraft(draft, { kind: 'move', instanceId: id, direction: 'before' }, t.responseSpec);
          } else if (draft.orderedIds[index] !== id) {
            // The actual choose-card then Place before actions.
            const targetId = `before:${draft.orderedIds[index]}`;
            draft = reduceDraft(draft, { kind: 'select', selection: { kind: 'item', id } }, t.responseSpec);
            draft = reduceDraft(draft, { kind: 'place', targetId }, t.responseSpec);
          }
        }
        expect(draft.undo.length).toBeGreaterThan(0);
        expect(toResponse(draft)).toEqual({ kind: 'sequence', orderedIds: expected });
        judge(t, toResponse(draft), true);
        // Restoring an already constructed answer must not require a new move.
        judge(t, toResponse(createDraft(t.responseSpec, toResponse(draft))), true);
      }
    }
  });
  it('checks the entire two-join matrix, not two disconnected substring matches', () => {
    const t = task('sheltered-nest-relations');
    expect(t.band).toBe('stretch');
    expect(t.responseSpec).toEqual({ kind: 'choice', slots: [
      { id: 'contrast', label: 'First join', options: [{ id: 'although', label: 'Although' }, { id: 'because', label: 'Because' }] },
      { id: 'reason', label: 'Second join', options: [{ id: 'because', label: 'because' }, { id: 'although', label: 'although' }] },
    ], requiredSlotIds: ['contrast', 'reason'] });
    expect(t.answerRule).toEqual({ kind: 'accepted-responses', responses: [{ kind: 'choice', choices: { contrast: 'although', reason: 'because' } }] });
    for (const [contrast, reason, correct] of nestMatrix) judge(t, { kind: 'choice', choices: { contrast, reason } }, correct);
  });
});

describe('unscored drafts and malformed records through the actual exports', () => {
  it.each(GRAMMAR_TASKS)('$descriptor.authoredKey: validates serialized records, empty and null drafts', t => {
    expect(validateGrammarTask(clone(t))).toEqual([]);
    const kind = t.responseSpec.kind;
    const empty = kind === 'sequence' ? { kind, orderedIds: [] } : kind === 'sorting' ? { kind, groups: {} } : { kind, choices: {} };
    expect(evaluateExpansionGrammar(t, empty).status).toBe('incomplete');
    if (t.responseSpec.kind === 'sorting') expect(evaluateExpansionGrammar(t, { kind, groups: Object.fromEntries(t.responseSpec.requiredItemIds.map(id => [id, null])) }).status).toBe('incomplete');
    if (t.responseSpec.kind === 'choice') expect(evaluateExpansionGrammar(t, { kind, choices: Object.fromEntries(t.responseSpec.requiredSlotIds.map(id => [id, null])) }).status).toBe('incomplete');
    expect(evaluateExpansionGrammar(t, null).status).toBe('invalid-response');
    expect(evaluateExpansionGrammar(t, { ...empty, extra: true }).status).toBe('invalid-response');
    expect(evaluateExpansionGrammar(t, { kind: 'bridge', planks: [] }).status).toBe('invalid-response');
  });
  it.each([
    { kind: 'sorting', groups: { otters: 'unknown' } },
    { kind: 'sorting', groups: { unknown: 'noun' } },
    { kind: 'sorting', groups: { otters: ['noun', 'verb'] } },
    { kind: 'sorting', groups: { otters: undefined } },
    { kind: 'sorting', groups: { otters: NaN } },
    { kind: 'sorting', groups: [['otters', 'noun'], ['otters', 'verb']] },
    { kind: 'sorting', groups: Object.create({ otters: 'noun' }) },
  ])('rejects malformed/unknown/duplicate-represented map input %j', response => {
    expect(evaluateExpansionGrammar(task('otter-actions'), response).status).toBe('invalid-response');
  });
  it('valid partial placements and choices remain incomplete even if already wrong', () => {
    expect(evaluateExpansionGrammar(task('otter-actions'), { kind: 'sorting', groups: { otters: 'verb' } })).toEqual({ status: 'incomplete', missing: ['splash', 'rocks'] });
    expect(evaluateExpansionGrammar(task('sheltered-nest-relations'), { kind: 'choice', choices: { contrast: 'because' } })).toEqual({ status: 'incomplete', missing: ['reason'] });
    expect(evaluateExpansionGrammar(task('flooded-path-cause'), { kind: 'sequence', orderedIds: ['flood', 'wait'] })).toEqual({ status: 'incomplete', missing: ['because'] });
    expect(evaluateExpansionGrammar(task('sheltered-nest-relations'), { kind: 'choice', choices: { contrast: null, reason: 'unknown' } }).status).toBe('invalid-response');
    expect(evaluateExpansionGrammar(task('concede-wind'), { kind: 'choice', choices: { sentence: ['although', 'even-though'] } }).status).toBe('invalid-response');
  });
  it.each([['wait', 'wait'], ['wait', 'unknown'], ['wait', 1], [null], Array(2), ['wait', 'because', 'flood', 'wait']])('rejects duplicate/unknown/typed/sparse tiles %j', orderedIds => {
    expect(evaluateExpansionGrammar(task('flooded-path-cause'), { kind: 'sequence', orderedIds }).status).toBe('invalid-response');
  });
  it('accepts null-prototype maps and ignores insertion order, but not display text as IDs', () => {
    judge(task('otter-actions'), { kind: 'sorting', groups: Object.assign(Object.create(null), { rocks: 'noun', splash: 'verb', otters: 'noun' }) }, true);
    expect(evaluateExpansionGrammar(task('flooded-path-cause'), { kind: 'sequence', orderedIds: ['we waited inside', 'because', 'rain flooded the path'] }).status).toBe('invalid-response');
  });
  it.each([
    ['stimulus NaN', (t: any) => { t.stimulus = NaN; }],
    ['stimulus Infinity', (t: any) => { t.stimulus = Infinity; }],
    ['undefined hint', (t: any) => { t.hints[0].text = undefined; }],
    ['missing hint', (t: any) => { delete t.hints[0]; }],
    ['duplicate tile ID', (t: any) => { t.responseSpec.tiles[1].id = 'wait'; }],
    ['unreviewed label', (t: any) => { t.responseSpec.tiles[0].label = 'we ran outside'; }],
    ['extra metadata', (t: any) => { t.reward = 100; }],
    ['withheld review', (t: any) => { t.review.status = 'withheld'; }],
    ['wrong band', (t: any) => { t.band = 'stretch'; }],
    ['wrong objective', (t: any) => { t.objectiveId = 'E04-word-classes'; }],
    ['wrong source', (t: any) => { t.curriculum.section = 'Year 6'; }],
    ['changed answer', (t: any) => { t.answerRule.responses[0].orderedIds = ['flood', 'because', 'wait']; }],
    ['numeric revision', (t: any) => { t.contentRevision = 2; }],
    ['extra descriptor parameter', (t: any) => { t.descriptor.parameters.week = '2026-W41'; }],
    ['stringified bound', (t: any) => { t.responseSpec.cardinality.min = '3'; }],
    ['symbol field', (t: any) => { t[Symbol('hidden')] = 1; }],
    ['nonenumerable', (t: any) => { Object.defineProperty(t, 'hidden', { value: 1 }); }],
    ['getter', (t: any) => { Object.defineProperty(t, 'assessedText', { enumerable: true, get: () => { throw new Error('must not invoke'); } }); }],
    ['cycle', (t: any) => { t.stimulus = t; }],
    ['nonplain', (t: any) => { t.stimulus = new Date(); }],
  ])('unavailable content rather than learner error: %s', (_, corrupt) => {
    const t = clone(task('flooded-path-cause'));
    corrupt(t);
    expect(validateGrammarTask(t).length).toBeGreaterThan(0);
    expect(evaluateExpansionGrammar(t, { kind: 'sequence', orderedIds: ['wait', 'because', 'flood'] }).status).toBe('unavailable-content');
  });
  it('rejects unknown identities and missing tasks before response parsing', () => {
    const t = clone(task('otter-actions'));
    const descriptor = { ...t.descriptor, authoredKey: 'unreviewed-otters' };
    expect(evaluateExpansionGrammar({ ...t, descriptor, canonicalQuestionId: canonicalQuestionId(descriptor) }, null).status).toBe('unavailable-content');
    expect(evaluateExpansionGrammar(null as unknown as TaskDefinition, null).status).toBe('unavailable-content');
  });
  it('rechecks fresh reconstructed content with reversed control order and revision, preserving identity', () => {
    for (const original of GRAMMAR_TASKS) {
      const t = clone(original);
      const spec = clone(t.responseSpec);
      if (spec.kind === 'sorting') { (spec.items as unknown[]).reverse(); (spec.groups as unknown[]).reverse(); (spec.requiredItemIds as string[]).reverse(); }
      if (spec.kind === 'sequence') (spec.tiles as unknown[]).reverse();
      if (spec.kind === 'choice') { (spec.slots as unknown[]).reverse(); spec.slots.forEach(slot => (slot.options as unknown[]).reverse()); }
      const reconstructed = { ...t, contentRevision: '2', responseSpec: spec };
      expect(validateGrammarTask(reconstructed)).toEqual([]);
      expect(canonicalQuestionId(reconstructed.descriptor)).toBe(original.canonicalQuestionId);
      if (spec.kind === 'sorting') {
        const oracle = sorts.find(([key]) => key === t.descriptor.authoredKey)!;
        judge(reconstructed, { kind: 'sorting', groups: Object.fromEntries(oracle[3].map(([id, , group]) => [id, group])) }, true);
      } else if (spec.kind === 'sequence') {
        const oracle = orders.find(([key]) => key === t.descriptor.authoredKey)!;
        for (const [order, correct] of oracle[2]) judge(reconstructed, { kind: 'sequence', orderedIds: order.split(',') }, correct);
      } else if (t.descriptor.authoredKey === 'sheltered-nest-relations') {
        for (const [contrast, reason, correct] of nestMatrix) judge(reconstructed, { kind: 'choice', choices: { contrast, reason } }, correct);
      } else {
        const oracle = choices.find(([key]) => key === t.descriptor.authoredKey)!;
        for (const [id, , correct] of oracle[2]) judge(reconstructed, { kind: 'choice', choices: { sentence: id } }, correct);
      }
    }
  });
});

describe('inventory, receiving bindings and narration/help contract', () => {
  it('delivers exactly 20 distinct authored identities with the genuine 4/3/3 split', () => {
    expect(GRAMMAR_TASKS).toHaveLength(20);
    expect(new Set(GRAMMAR_TASKS.map(t => t.canonicalQuestionId)).size).toBe(20);
    for (const skillId of ['E04', 'E05']) {
      expect(['core', 'support', 'stretch'].map(band => GRAMMAR_TASKS.filter(t => t.skillId === skillId && t.band === band).length)).toEqual([4, 3, 3]);
    }
    for (const t of GRAMMAR_TASKS) {
      expect(t.objectiveId).toBe(SKILLS.find(skill => skill.skillId === t.skillId)!.objectiveId);
      expect(t.descriptor.parameters).toEqual({});
      expect(t.descriptor.equivalenceVersion).toBe('r1');
      expect(t.canonicalQuestionId).toBe(`lif.english.expansion.${t.skillId.toLowerCase()}.r1.authored-${encodeURIComponent(JSON.stringify([t.descriptor.authoredKey, []]))}`);
      expect(t.assessedText.split(/\s+/).length).toBeLessThanOrEqual(60);
      expect(t.assessedText.split(/(?<=[.!?])\s+/).length).toBeLessThanOrEqual(2);
      expect(t.curriculum.sourceUrl).toContain('gov.uk/government/publications/national-curriculum-in-england-english');
      expect(t.curriculum.section).toMatch(/Year/);
      expect(t.demandRationale.length).toBeGreaterThan(70);
      expect(t.review).toMatchObject({ status: 'approved', evidenceRef: 'docs/content-review/expansion-grammar.md' });
      expect(t.hints).toHaveLength(2);
      expect(new Set([...t.hints.map(h => h.id), t.workedSupport.id]).size).toBe(3);
      expect(t.hints.every(h => h.text !== t.explanation && h.text !== t.workedSupport.text)).toBe(true);
      expect(Object.isFrozen(t)).toBe(true);
      expect(Object.isFrozen(t.responseSpec)).toBe(true);
      if (t.responseSpec.kind === 'sorting') { expect(t.responseSpec.items.length).toBeLessThanOrEqual(6); expect(t.responseSpec.groups.length).toBeGreaterThanOrEqual(2); expect(t.responseSpec.groups.length).toBeLessThanOrEqual(4); }
      if (t.responseSpec.kind === 'sequence') expect(t.responseSpec.tiles.length).toBeLessThanOrEqual(5);
      if (t.responseSpec.kind === 'choice') expect(t.responseSpec.slots.reduce((sum, slot) => sum + slot.options.length, 0)).toBeLessThanOrEqual(4);
    }
    expect(GRAMMAR_MANIFEST.taskIds).toEqual(GRAMMAR_TASKS.map(t => t.canonicalQuestionId));
    expect(GRAMMAR_MANIFEST.retainedTaskIds).toEqual([]);
    expect(PREREQUISITE_SUGGESTIONS.some(row => row.prerequisiteSkillId === 'E04' && row.skillId === 'E05')).toBe(true);
  });
  it('keeps source attribution and real stretch distinctions explicit', () => {
    for (const key of ['that-roles', 'relative-gardeners', 'relative-repaired-rope']) expect(task(key).curriculum.programmeBand).toBe('Years 5–6 (selected Year 5 relative clauses)');
    for (const key of ['hard-roles', 'before-roles', 'sheltered-nest-relations']) expect(task(key).curriculum.programmeBand).toBe('Years 3–4');
    expect(task('hard-roles').assessedText).toBe('The hard seed fell hard onto stone.');
    expect(task('before-roles').assessedText).toBe('Before dawn, we packed. We left before the sun rose.');
    expect(task('that-roles').assessedText).toBe('That key opens the chest that holds the maps.');
  });
  it('offers exact required bindings with support choices and valid optional conventions', () => {
    expect(GRAMMAR_BINDING_PROPOSALS.filter(row => row.role === 'story').map(row => row.bindingId)).toEqual(['q6-story-e04-sort', 'q10-story-e05-meaning']);
    for (const row of GRAMMAR_BINDING_PROPOSALS) {
      expect(row.sourceBindingId).toBeNull(); expect(row.availability).toBe('M2');
      expect(row.taskIds.length).toBeGreaterThan(0);
      if (row.role === 'revisit') expect(row.bindingId).toBe(`${row.questId.toLowerCase()}-revisit-${row.skillId.toLowerCase()}-${row.responseKind}`);
      const pool = row.taskIds.map(id => GRAMMAR_TASKS.find(t => t.canonicalQuestionId === id)!);
      expect(pool.every(t => t.skillId === row.skillId && t.responseSpec.kind === row.responseKind)).toBe(true);
      if (row.role === 'story') expect(pool.some(t => t.band === 'support')).toBe(true);
    }
    expect(GRAMMAR_BINDING_PROPOSALS.find(row => row.bindingId === 'q6-story-e04-sort')!.taskIds).toHaveLength(10);
    expect(GRAMMAR_BINDING_PROPOSALS.find(row => row.bindingId === 'q10-story-e05-meaning')!.taskIds).toHaveLength(8);
  });
  it('executes every manifest and downstream handoff response through the pure family boundary', () => {
    for (const row of [...GRAMMAR_MANIFEST.cases, ...GRAMMAR_HANDOFF_CASES]) {
      const t = GRAMMAR_TASKS.find(t => t.canonicalQuestionId === row.canonicalQuestionId)!;
      const result = evaluateExpansionGrammar(t, row.response);
      expect(result.status).toBe(row.expectedStatus);
      if (result.status === 'judged') expect(result.correct).toBe(row.expectedCorrect);
      if ('bindingId' in row) expect(GRAMMAR_BINDING_PROPOSALS.find(binding => binding.bindingId === row.bindingId)!.taskIds).toContain(row.canonicalQuestionId);
    }
  });
  it('separates neutral narration, assessed listening and explicit answer help', () => {
    for (const t of GRAMMAR_TASKS) {
      expect(t.narration.neutralText).toBe(t.instructionText);
      expect(t.narration.neutralText).not.toContain(t.assessedText);
      expect(t.narration.neutralText).not.toContain(t.explanation);
      expect(t.narration.assessedTextMayBeSpokenBeforeCheck).toBe(true);
    }
    const noHelp = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' } as const;
    expect(usedAnswerHelp(noHelp)).toBe(false);
    expect(usedAnswerHelp({ ...noHelp, assessedTextReadAloud: true, evidenceMode: 'listening-supported' })).toBe(false);
    expect(usedAnswerHelp({ ...noHelp, answerHintUsed: true })).toBe(true);
    expect(usedAnswerHelp({ ...noHelp, workedSupportUsed: true })).toBe(true);
    expect(GRAMMAR_HANDOFF_CASES.find(row => row.caseId === 'grammar-listened-choice')!.expectedEvidenceMode).toBe('listening-supported');
    // Hint/worked support can retain independent *reading mode* but must still
    // set sticky answer-help flags downstream; the evaluator allocates neither.
    expect(GRAMMAR_HANDOFF_CASES.find(row => row.caseId === 'grammar-hinted-sort')!.expectedEvidenceMode).toBe('independent');
  });
});
