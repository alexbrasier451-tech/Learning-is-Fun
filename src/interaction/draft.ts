import type { ActivityResponse, ResponseSpec } from '../learning/contracts';

export type M1ResponseSpec = Extract<ResponseSpec, { kind: 'bridge' | 'merchant' }>
  | (Omit<Extract<ResponseSpec, { kind: 'punctuation' | 'choice' }>, 'kind'> & Readonly<{ kind: 'punctuation' }>);
export type Fruit = 'apples' | 'pears';
export type DraftSelection =
  | Readonly<{ kind: 'plank'; length: number }>
  | Readonly<{ kind: 'placed-plank'; instanceId: string }>
  | Readonly<{ kind: 'mark'; value: string }>
  | Readonly<{ kind: 'fruit'; fruit: Fruit }>;
export type DraftValues =
  | Readonly<{ kind: 'bridge'; planks: readonly Readonly<{ instanceId: string; length: number }>[] }>
  | Readonly<{ kind: 'punctuation'; slots: Readonly<Record<string, string | null>> }>
  | Readonly<{ kind: 'merchant'; apples: number | null; pears: number | null }>;
/** Session-local selection/undo and instance numbering. Never a saved encounter,
 * answer judgement or reward identity. Pointer ghosts are owned by the binding. */
export type ActivityDraft = DraftValues & Readonly<{
  selection: DraftSelection | null; undo: readonly DraftValues[]; nextInstanceId: number;
}>;
export type DraftAction =
  | Readonly<{ kind: 'select'; selection: DraftSelection | null }>
  | Readonly<{ kind: 'place'; targetId: string }>
  | Readonly<{ kind: 'remove'; targetId: string }>
  | Readonly<{ kind: 'move'; instanceId: string; direction: 'before' | 'after' }>
  | Readonly<{ kind: 'set'; fruit: Fruit; value: number | null }>
  | Readonly<{ kind: 'increment'; fruit: Fruit; delta: 1 | -1 }>
  | Readonly<{ kind: 'undo' }>;

const integer = (n: number, min: number, max: number) => Number.isSafeInteger(n) && n >= min && n <= max;
const fruit = (s: string): s is Fruit => s === 'apples' || s === 'pears';
function values(draft: ActivityDraft): DraftValues {
  if (draft.kind === 'bridge') return { kind: 'bridge', planks: draft.planks };
  if (draft.kind === 'punctuation') return { kind: 'punctuation', slots: draft.slots };
  return { kind: 'merchant', apples: draft.apples, pears: draft.pears };
}
function edited(draft: ActivityDraft, next: DraftValues, nextInstanceId = draft.nextInstanceId): ActivityDraft {
  if (JSON.stringify(values(draft)) === JSON.stringify(next)) return draft;
  return { ...next, selection: draft.selection, undo: [...draft.undo.slice(-63), values(draft)], nextInstanceId };
}
function selectionAllowed(selection: DraftSelection | null, draft: ActivityDraft, spec: M1ResponseSpec): boolean {
  if (!selection) return true;
  if (draft.kind === 'bridge' && spec.kind === 'bridge') {
    return (selection.kind === 'plank' && spec.plankLengths.includes(selection.length))
      || (selection.kind === 'placed-plank' && draft.planks.some(p => p.instanceId === selection.instanceId));
  }
  if (spec.kind === 'punctuation') return selection.kind === 'mark' && spec.slots.some(s => s.options.some(o => o.id === selection.value));
  return spec.kind === 'merchant' && selection.kind === 'fruit' && fruit(selection.fruit);
}

/** Structural restoration only. Bad saved shape is rejected, never silently
 * converted into a fresh answer. Partial/empty responses are permitted drafts. */
export function createDraft(responseSpec: M1ResponseSpec, savedResponse?: ActivityResponse | null): ActivityDraft {
  const base = { selection: null, undo: [], nextInstanceId: 1 } as const;
  if (savedResponse && savedResponse.kind !== responseSpec.kind) throw new TypeError('Saved response does not match the specification.');
  switch (responseSpec.kind) {
    case 'bridge': {
      const input = savedResponse?.kind === 'bridge' ? savedResponse.planks : [];
      if (!input.every(n => Number.isSafeInteger(n) && responseSpec.plankLengths.includes(n)) || input.length > responseSpec.cardinality.max) throw new TypeError('Invalid saved plank shape.');
      return { ...base, kind: 'bridge', planks: input.map((length, i) => ({ instanceId: `plank-${i + 1}`, length })), nextInstanceId: input.length + 1 };
    }
    case 'punctuation': {
      const input = savedResponse?.kind === 'punctuation' ? savedResponse.slots : {};
      if (Object.keys(input).some(id => !responseSpec.slots.some(s => s.id === id))
        || Object.entries(input).some(([id, value]) => value !== null && !responseSpec.slots.find(s => s.id === id)!.options.some(o => o.id === value))) throw new TypeError('Invalid saved punctuation shape.');
      return { ...base, kind: 'punctuation', slots: Object.fromEntries(responseSpec.slots.map(s => [s.id, input[s.id] ?? null])) };
    }
    case 'merchant': {
      const input = savedResponse?.kind === 'merchant' ? savedResponse : { apples: null, pears: null };
      if ([input.apples, input.pears].some(n => n !== null && !integer(n, responseSpec.countBounds.min, responseSpec.countBounds.max))
        || (input.apples ?? 0) + (input.pears ?? 0) > responseSpec.maxTotal) throw new TypeError('Invalid saved basket shape.');
      return { ...base, kind: 'merchant', apples: input.apples, pears: input.pears };
    }
    default: throw new TypeError('This response form is not an M1 widget.');
  }
}

/** All input routes use these same edits. Only declared shape/range constraints
 * are enforced; cardinality minimum/completeness/correctness stay with WP03. */
export function reduceDraft(draft: ActivityDraft, action: DraftAction, responseSpec: M1ResponseSpec): ActivityDraft {
  if (draft.kind !== responseSpec.kind) return draft;
  if (action.kind === 'undo') {
    const previous = draft.undo.at(-1);
    return previous ? { ...previous, selection: null, undo: draft.undo.slice(0, -1), nextInstanceId: draft.nextInstanceId } : draft;
  }
  if (action.kind === 'select') return selectionAllowed(action.selection, draft, responseSpec) ? { ...draft, selection: action.selection } : draft;
  if (draft.kind === 'bridge' && responseSpec.kind === 'bridge') {
    if (action.kind === 'remove') {
      const next = edited(draft, { kind: 'bridge', planks: draft.planks.filter(p => p.instanceId !== action.targetId) });
      return next !== draft && draft.selection?.kind === 'placed-plank' && draft.selection.instanceId === action.targetId ? { ...next, selection: null } : next;
    }
    if (action.kind === 'move') {
      const from = draft.planks.findIndex(p => p.instanceId === action.instanceId);
      const to = from + (action.direction === 'before' ? -1 : 1);
      if (from < 0 || to < 0 || to >= draft.planks.length) return draft;
      const planks = [...draft.planks];
      [planks[from], planks[to]] = [planks[to], planks[from]];
      return edited(draft, { kind: 'bridge', planks });
    }
    if (action.kind === 'place' && (draft.selection?.kind === 'plank' || draft.selection?.kind === 'placed-plank')) {
      if (action.targetId !== 'bridge' && !draft.planks.some(p => action.targetId === `before:${p.instanceId}`)) return draft;
      const selection = draft.selection;
      if (selection.kind === 'placed-plank' && action.targetId === `before:${selection.instanceId}`) return draft;
      const existing = selection.kind === 'placed-plank' ? draft.planks.find(p => p.instanceId === selection.instanceId) : null;
      if (selection.kind === 'placed-plank' && !existing) return draft;
      if (!existing && draft.planks.length >= responseSpec.cardinality.max) return draft;
      const plank = existing ?? { instanceId: `plank-${draft.nextInstanceId}`, length: (selection as Extract<DraftSelection, { kind: 'plank' }>).length };
      const planks = draft.planks.filter(p => p.instanceId !== plank.instanceId);
      const position = action.targetId === 'bridge' ? planks.length : planks.findIndex(p => action.targetId === `before:${p.instanceId}`);
      planks.splice(position, 0, plank);
      return edited(draft, { kind: 'bridge', planks }, draft.nextInstanceId + (existing ? 0 : 1));
    }
  }
  if (draft.kind === 'punctuation' && responseSpec.kind === 'punctuation') {
    if (action.kind !== 'place' && action.kind !== 'remove') return draft;
    const slot = responseSpec.slots.find(s => s.id === action.targetId);
    if (!slot) return draft;
    if (action.kind === 'place' && (draft.selection?.kind !== 'mark' || !slot.options.some(o => o.id === (draft.selection as Extract<DraftSelection, { kind: 'mark' }>).value))) return draft;
    const value = action.kind === 'remove' ? null : (draft.selection as Extract<DraftSelection, { kind: 'mark' }>).value;
    return edited(draft, { kind: 'punctuation', slots: { ...draft.slots, [slot.id]: value } });
  }
  if (draft.kind === 'merchant' && responseSpec.kind === 'merchant') {
    let which: Fruit, value: number | null;
    if (action.kind === 'set') { which = action.fruit; value = action.value; }
    else if (action.kind === 'increment') {
      which = action.fruit;
      if (!fruit(which) || (draft[which] === null && action.delta < 0)) return draft;
      value = draft[which] === null ? Math.max(1, responseSpec.countBounds.min) : draft[which]! + action.delta;
    } else if (action.kind === 'place' && action.targetId === 'basket' && draft.selection?.kind === 'fruit') {
      which = draft.selection.fruit;
      value = draft[which] === null ? Math.max(1, responseSpec.countBounds.min) : draft[which]! + 1;
    } else if (action.kind === 'remove' && fruit(action.targetId)) {
      which = action.targetId;
      if (draft[which] === null) return draft;
      value = draft[which]! - 1;
    } else return draft;
    if (!fruit(which) || (value !== null && !integer(value, responseSpec.countBounds.min, responseSpec.countBounds.max))) return draft;
    const next = { kind: 'merchant' as const, apples: draft.apples, pears: draft.pears, [which]: value };
    if ((next.apples ?? 0) + (next.pears ?? 0) > responseSpec.maxTotal) return draft;
    return edited(draft, next);
  }
  return draft;
}

/** Fresh domain response, containing no UI/history/instance/gesture fields. */
export function toResponse(draft: ActivityDraft): ActivityResponse {
  if (draft.kind === 'bridge') return { kind: 'bridge', planks: draft.planks.map(p => p.length) };
  if (draft.kind === 'punctuation') return { kind: 'punctuation', slots: { ...draft.slots } };
  return { kind: 'merchant', apples: draft.apples, pears: draft.pears };
}
