import { describe, expect, it } from 'vitest';
import { createDraft, reduceDraft, toResponse } from '../../src/interaction/draft';
import type { ActivityDraft, DraftAction, M1ResponseSpec } from '../../src/interaction/draft';
import { resolveDropTarget } from '../../src/interaction/pointer';
import { readFileSync } from 'node:fs';

const bridge: M1ResponseSpec = { kind: 'bridge', plankLengths: [1, 2, 3, 4, 5, 6], cardinality: { min: 1, max: 6 } };
const punctuation: M1ResponseSpec = { kind: 'punctuation', slots: [
  { id: 'a', label: 'First sentence', options: [{ id: '?', label: 'question mark' }, { id: '.', label: 'full stop' }] },
  { id: 'b', label: 'Second sentence', options: [{ id: '!', label: 'exclamation mark' }, { id: '.', label: 'full stop' }] },
], requiredSlotIds: ['a', 'b'] };
const merchant: M1ResponseSpec = { kind: 'merchant', countBounds: { min: 0, max: 4 }, maxTotal: 6 };
const edit = (spec: M1ResponseSpec, actions: readonly DraftAction[], draft = createDraft(spec)) => actions.reduce((d, a) => reduceDraft(d, a, spec), draft);
const placePlank = (length: number): readonly DraftAction[] => [{ kind: 'select', selection: { kind: 'plank', length } }, { kind: 'place', targetId: 'bridge' }];
const mark = (value: string, targetId: string): readonly DraftAction[] => [{ kind: 'select', selection: { kind: 'mark', value } }, { kind: 'place', targetId }];
const fruit = (which: 'apples' | 'pears'): readonly DraftAction[] => [{ kind: 'select', selection: { kind: 'fruit', fruit: which } }, { kind: 'place', targetId: 'basket' }];

describe('pure M1 draft controls', () => {
  it('creates empty/incomplete forms without implying a Check', () => {
    expect(toResponse(createDraft(bridge))).toEqual({ kind: 'bridge', planks: [] });
    expect(toResponse(createDraft(punctuation))).toEqual({ kind: 'punctuation', slots: { a: null, b: null } });
    expect(toResponse(createDraft(merchant))).toEqual({ kind: 'merchant', apples: null, pears: null });
  });
  it('round-trips structurally legal saved responses including repeated planks, zero and null', () => {
    for (const [spec, response] of [
      [bridge, { kind: 'bridge', planks: [3, 3] }],
      [punctuation, { kind: 'punctuation', slots: { a: '?', b: null } }],
      [merchant, { kind: 'merchant', apples: 0, pears: null }],
    ] as const) expect(toResponse(createDraft(spec, response))).toEqual(response);
  });
  it('rejects incompatible or malformed saved responses rather than discarding them', () => {
    expect(() => createDraft(bridge, { kind: 'merchant', apples: 1, pears: 1 })).toThrow();
    expect(() => createDraft(bridge, { kind: 'bridge', planks: [7] })).toThrow();
    expect(() => createDraft(bridge, { kind: 'bridge', planks: [1, 1, 1, 1, 1, 1, 1] })).toThrow();
    expect(() => createDraft(punctuation, { kind: 'punctuation', slots: { z: '.' } })).toThrow();
    expect(() => createDraft(punctuation, { kind: 'punctuation', slots: { a: '!' } })).toThrow();
    expect(() => createDraft(merchant, { kind: 'merchant', apples: 1.5, pears: 1 })).toThrow();
    expect(() => createDraft(merchant, { kind: 'merchant', apples: 4, pears: 4 })).toThrow();
  });
  it('selection is transient, neither an edit nor an undo entry', () => {
    const draft = createDraft(bridge);
    const selected = reduceDraft(draft, { kind: 'select', selection: { kind: 'plank', length: 3 } }, bridge);
    expect(toResponse(selected)).toEqual(toResponse(draft));
    expect(selected.undo).toEqual([]);
    expect(reduceDraft(draft, { kind: 'select', selection: { kind: 'plank', length: 999 } }, bridge)).toBe(draft);
  });
  it('bridge create/edit/undo/remove retains distinct reusable instances', () => {
    const draft = edit(bridge, [...placePlank(3), ...placePlank(3), { kind: 'undo' }]);
    expect(toResponse(draft)).toEqual({ kind: 'bridge', planks: [3] });
    const next = edit(bridge, [...placePlank(4)], draft);
    if (next.kind !== 'bridge') throw new Error();
    expect(next.planks.map(p => p.instanceId)).toEqual(['plank-1', 'plank-3']);
    expect(toResponse(reduceDraft(next, { kind: 'remove', targetId: 'plank-1' }, bridge))).toEqual({ kind: 'bridge', planks: [4] });
  });
  it('rearranges by adjacent controls and select/place-before with identical ordering', () => {
    const draft = edit(bridge, [...placePlank(2), ...placePlank(5)]);
    const moved = reduceDraft(draft, { kind: 'move', instanceId: 'plank-2', direction: 'before' }, bridge);
    const placed = edit(bridge, [{ kind: 'select', selection: { kind: 'placed-plank', instanceId: 'plank-2' } }, { kind: 'place', targetId: 'before:plank-1' }], draft);
    expect(toResponse(moved)).toEqual({ kind: 'bridge', planks: [5, 2] });
    expect(toResponse(placed)).toEqual(toResponse(moved));
    expect(toResponse(reduceDraft(placed, { kind: 'undo' }, bridge))).toEqual(toResponse(draft));
  });
  it('supports returning a placed plank to the end even at full cardinality', () => {
    const draft = edit(bridge, [1, 2, 3, 4, 5, 6].flatMap(placePlank));
    const moved = edit(bridge, [{ kind: 'select', selection: { kind: 'placed-plank', instanceId: 'plank-1' } }, { kind: 'place', targetId: 'bridge' }], draft);
    expect(toResponse(moved)).toEqual({ kind: 'bridge', planks: [2, 3, 4, 5, 6, 1] });
    expect(toResponse(edit(bridge, placePlank(1), moved))).toEqual(toResponse(moved));
  });
  it('bridge invalid drops and boundary moves preserve the original object', () => {
    const draft = edit(bridge, placePlank(2));
    for (const action of [
      { kind: 'place', targetId: 'unknown' }, { kind: 'remove', targetId: 'unknown' },
      { kind: 'move', instanceId: 'plank-1', direction: 'before' }, { kind: 'move', instanceId: 'plank-1', direction: 'after' },
    ] as const) expect(reduceDraft(draft, action, bridge)).toBe(draft);
  });
  it('punctuation create/edit/undo/remove retains partial slot shape', () => {
    const draft = edit(punctuation, [...mark('?', 'a'), ...mark('.', 'b'), { kind: 'undo' }]);
    expect(toResponse(draft)).toEqual({ kind: 'punctuation', slots: { a: '?', b: null } });
    const cleared = reduceDraft(draft, { kind: 'remove', targetId: 'a' }, punctuation);
    expect(toResponse(cleared)).toEqual({ kind: 'punctuation', slots: { a: null, b: null } });
    expect(toResponse(reduceDraft(cleared, { kind: 'undo' }, punctuation))).toEqual(toResponse(draft));
  });
  it('rejects unknown and slot-incompatible marks without judging legal marks', () => {
    const draft = edit(punctuation, mark('!', 'a'));
    expect(toResponse(draft)).toEqual({ kind: 'punctuation', slots: { a: null, b: null } });
    expect(toResponse(edit(punctuation, mark('.', 'a')))).toEqual({ kind: 'punctuation', slots: { a: '.', b: null } });
    expect(toResponse(edit(punctuation, mark('x', 'a')))).toEqual(toResponse(createDraft(punctuation)));
  });
  it('fruit drag/tap-place and increment commands produce the same values', () => {
    const placed = edit(merchant, [...fruit('apples'), ...fruit('apples'), ...fruit('pears')]);
    const incremented = edit(merchant, [{ kind: 'increment', fruit: 'apples', delta: 1 }, { kind: 'increment', fruit: 'apples', delta: 1 }, { kind: 'increment', fruit: 'pears', delta: 1 }]);
    expect(toResponse(placed)).toEqual({ kind: 'merchant', apples: 2, pears: 1 });
    expect(toResponse(incremented)).toEqual(toResponse(placed));
  });
  it('merchant create/edit/undo/remove preserves null versus deliberate zero', () => {
    const draft = edit(merchant, [...fruit('apples'), ...fruit('pears'), { kind: 'undo' }, { kind: 'remove', targetId: 'apples' }]);
    expect(toResponse(draft)).toEqual({ kind: 'merchant', apples: 0, pears: null });
    const cleared = reduceDraft(draft, { kind: 'set', fruit: 'apples', value: null }, merchant);
    expect(toResponse(cleared)).toEqual(toResponse(createDraft(merchant)));
    expect(toResponse(reduceDraft(cleared, { kind: 'undo' }, merchant))).toEqual(toResponse(draft));
  });
  it('enforces per-fruit counts and total capacity without clipping or scoring', () => {
    const draft = edit(merchant, [{ kind: 'set', fruit: 'apples', value: 4 }, { kind: 'set', fruit: 'pears', value: 2 }]);
    for (const action of [
      { kind: 'set', fruit: 'apples', value: -1 }, { kind: 'set', fruit: 'apples', value: 2.5 },
      { kind: 'increment', fruit: 'pears', delta: 1 }, { kind: 'increment', fruit: 'apples', delta: 1 },
    ] as const) expect(reduceDraft(draft, action, merchant)).toBe(draft);
    expect(toResponse(draft)).toEqual({ kind: 'merchant', apples: 4, pears: 2 });
  });
  it('a positive count minimum still permits empty drafts and starts at a legal count', () => {
    const spec: M1ResponseSpec = { kind: 'merchant', countBounds: { min: 2, max: 8 }, maxTotal: 12 };
    expect(toResponse(edit(spec, fruit('apples')))).toEqual({ kind: 'merchant', apples: 2, pears: null });
  });
  it('undo is bounded/transient and does not mutate inputs', () => {
    const original = createDraft(merchant);
    const draft = edit(merchant, Array.from({ length: 100 }, (_, i): DraftAction => ({ kind: 'set', fruit: 'apples', value: i % 2 })), original);
    expect(draft.undo.length).toBe(64);
    expect(toResponse(original)).toEqual({ kind: 'merchant', apples: null, pears: null });
    const response = toResponse(draft);
    expect(Object.keys(response)).toEqual(['kind', 'apples', 'pears']);
    expect(JSON.parse(JSON.stringify(response))).toEqual(response);
  });
  it('different response specifications cannot cross-edit a draft', () => {
    const draft = createDraft(bridge);
    expect(reduceDraft(draft, { kind: 'place', targetId: 'basket' }, merchant)).toBe(draft);
  });
});

describe('current viewport drop geometry', () => {
  it('uses half-open bounds and no event-target assumptions', () => {
    const targets = [{ id: 'a', rect: { left: 10, top: 20, right: 50, bottom: 60 } }];
    expect(resolveDropTarget({ x: 10, y: 20 }, targets)).toBe('a');
    expect(resolveDropTarget({ x: 49, y: 59 }, targets)).toBe('a');
    expect(resolveDropTarget({ x: 50, y: 30 }, targets)).toBeNull();
    expect(resolveDropTarget({ x: 30, y: 60 }, targets)).toBeNull();
    expect(resolveDropTarget({ x: 11, y: 20 }, [{ id: 'a', rect: { left: 110, top: 20, right: 150, bottom: 60 } }])).toBeNull();
  });
  it('production widgets import no evaluation, answer-rule, state, reward or audio owner', () => {
    for (const file of ['draft.ts', 'pointer.ts', 'ActivityWidgets.tsx']) {
      const source = readFileSync(new URL(`../../src/interaction/${file}`, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
      expect(source).not.toMatch(/answerRule|evaluateResponse|SubmitCheck|RecordAssistance|indexedDB|localStorage|\.\.\/(state|rewards|audio)\//);
    }
  });
});

function negativeShapes(draft: ActivityDraft) {
  // @ts-expect-error no Check/scoring command belongs to a widget
  const check: DraftAction = { kind: 'check', correct: true };
  // @ts-expect-error transient values are readonly
  draft.selection = null;
  void check;
}
void negativeShapes;
