import type { ActivityResponse, ContentIssue, EvaluationResult, TaskDefinition } from '../contracts';
import { canonicalQuestionId } from '../identity';
import { GRAMMAR_TASKS } from '../../content/expansion-english/grammar';

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object'
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const keys = (value: Record<string, unknown>, expected: readonly string[]) => Reflect.ownKeys(value).length === expected.length
  && expected.every(key => Object.hasOwn(value, key));
// Preserve JSON value types before comparison. JSON.stringify alone would turn
// NaN into null, erase undefined members and conceal sparse array holes.
function stable(value: unknown, depth = 0): string {
  if (depth > 40) throw new TypeError('Content must be bounded acyclic JSON.');
  if (value !== null && typeof value === 'object' && Reflect.ownKeys(value).some(key => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    return !Object.hasOwn(descriptor, 'value') || (key !== 'length' && !descriptor.enumerable);
  })) throw new TypeError('Plain enumerable data properties required.');
  if (Array.isArray(value)) {
    if (Reflect.ownKeys(value).length !== value.length + 1 || !Array.from({ length: value.length }, (_, i) => Object.hasOwn(value, i)).every(Boolean)) throw new TypeError('Dense JSON arrays required.');
    return `[${value.map(item => stable(item, depth + 1)).join(',')}]`;
  }
  if (record(value)) {
    if (Reflect.ownKeys(value).length !== Object.keys(value).length) throw new TypeError('Enumerable string fields required.');
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key], depth + 1)}`).join(',')}}`;
  }
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return JSON.stringify(value);
  throw new TypeError('Finite JSON values required.');
}
function specMeaning(spec: TaskDefinition['responseSpec']): unknown {
  const byId = <T extends { id: string }>(rows: readonly T[]) => [...rows].sort((a, b) => a.id.localeCompare(b.id));
  if (spec.kind === 'sorting') return { ...spec, items: byId(spec.items), groups: byId(spec.groups), requiredItemIds: [...spec.requiredItemIds].sort() };
  if (spec.kind === 'sequence') return { ...spec, tiles: byId(spec.tiles) };
  if (spec.kind === 'choice') return { ...spec, slots: byId(spec.slots).map(slot => ({ ...slot, options: byId(slot.options) })), requiredSlotIds: [...spec.requiredSlotIds].sort() };
  return spec;
}
const reviewedById = new Map(GRAMMAR_TASKS.map(task => [task.canonicalQuestionId, task]));

/** The twenty authored records are the reviewed finite domain. Reconstruction
 * must retain all semantic, source and assistance fields. Presentation ordering
 * and a positive content revision can change without manufacturing a new ID. */
export function validateGrammarTask(task: TaskDefinition): readonly ContentIssue[] {
  try { stable(task); } catch {
    return [{ canonicalQuestionId: '(unknown)', field: 'task', code: 'malformed-content', detail: 'Content must be bounded finite JSON with plain data fields.' }];
  }
  const id = record(task) && typeof task.canonicalQuestionId === 'string' ? task.canonicalQuestionId : '(unknown)';
  const issues: ContentIssue[] = [];
  const add = (field: string, code: string, detail: string) => issues.push({ canonicalQuestionId: id, field, code, detail });
  if (!record(task) || !record(task.descriptor)) {
    add('descriptor', 'descriptor-invalid', 'A reviewed task with a canonical descriptor is required.'); return issues;
  }
  try {
    if (canonicalQuestionId(task.descriptor) !== id) add('canonicalQuestionId', 'identity-mismatch', 'The canonical ID must match the supplied descriptor.');
  } catch { add('descriptor', 'descriptor-invalid', 'The descriptor must preserve its authored key and finite typed parameters.'); return issues; }
  const reviewed = reviewedById.get(id);
  if (!reviewed) { add('descriptor', 'unreviewed-task', 'This authored identity is outside the reviewed grammar bank.'); return issues; }
  if (task === reviewed && issues.length === 0) return issues; // exports are deeply frozen
  if (!keys(task, Object.keys(reviewed))) add('task', 'record-shape', 'All and only the reviewed task fields are required.');
  if (typeof task.contentRevision !== 'string' || !/^[1-9][0-9]*$/.test(task.contentRevision)) add('contentRevision', 'revision-invalid', 'A positive decimal revision string is required.');
  for (const field of Object.keys(reviewed) as (keyof TaskDefinition)[]) {
    if (field === 'contentRevision') continue;
    try {
      // Validate raw values first: normalization must not erase sparse/non-JSON
      // values before their finite-value/type integrity has been checked.
      stable(task[field]);
      const actual = field === 'responseSpec' ? specMeaning(task.responseSpec) : task[field];
      const expected = field === 'responseSpec' ? specMeaning(reviewed.responseSpec) : reviewed[field];
      if (stable(actual) !== stable(expected)) add(field, 'reviewed-record-mismatch', 'The supplied record differs from its reviewed contextual meaning, answer domain, source or help.');
    } catch { add(field, 'malformed-content', 'Content must be bounded finite JSON in the reviewed shape.'); }
  }
  return issues;
}

type Draft = { status: 'complete'; response: ActivityResponse } | Extract<EvaluationResult, { status: 'invalid-response' | 'incomplete' }>;
function readDraft(task: TaskDefinition, response: unknown): Draft {
  const spec = task.responseSpec;
  const invalid = (reason: string): Draft => ({ status: 'invalid-response', reason });
  try { stable(response); } catch { return invalid('The response must be finite JSON data without hidden fields or array holes.'); }
  if (spec.kind === 'sequence') {
    if (!record(response) || !keys(response, ['kind', 'orderedIds']) || response.kind !== 'sequence' || !Array.isArray(response.orderedIds)) return invalid('Use a sequence of tile IDs.');
    const ids: unknown[] = response.orderedIds;
    if (Reflect.ownKeys(ids).length !== ids.length + 1 || !Array.from({ length: ids.length }, (_, i) => Object.hasOwn(ids, i)).every(Boolean)
      || ids.some(id => typeof id !== 'string' || !spec.tiles.some(tile => tile.id === id)) || new Set(ids).size !== ids.length) return invalid('Tile IDs must be known, distinct strings in a dense array.');
    const missing = spec.tiles.filter(tile => !ids.includes(tile.id)).map(tile => tile.id);
    if (missing.length) return { status: 'incomplete', missing };
    return { status: 'complete', response: response as ActivityResponse };
  }
  if (spec.kind !== 'sorting' && spec.kind !== 'choice') return invalid('Unsupported grammar response kind.');
  const field = spec.kind === 'sorting' ? 'groups' : 'choices';
  if (!record(response) || !keys(response, ['kind', field]) || response.kind !== spec.kind || !record(response[field])) return invalid('Use the declared kind and an item or slot ID map.');
  const map = response[field];
  const required = spec.kind === 'sorting' ? spec.requiredItemIds : spec.requiredSlotIds;
  if (Reflect.ownKeys(map).some(id => typeof id !== 'string' || !required.includes(id))) return invalid('Unknown item or slot ID.');
  const missing: string[] = [];
  for (const id of required) {
    if (!Object.hasOwn(map, id) || map[id] === null) { missing.push(id); continue; }
    const allowed = spec.kind === 'sorting' ? spec.groups : spec.slots.find(slot => slot.id === id)!.options;
    if (typeof map[id] !== 'string' || !allowed.some(option => option.id === map[id])) return invalid(`Unknown or malformed value for ${id}.`);
  }
  // Invalid values anywhere take precedence over missing values elsewhere.
  if (missing.length) return { status: 'incomplete', missing };
  return { status: 'complete', response: response as ActivityResponse };
}

export function evaluateExpansionGrammar(task: TaskDefinition, response: unknown): EvaluationResult {
  const issues = validateGrammarTask(task);
  if (issues.length) return { status: 'unavailable-content', issues };
  const parsed = readDraft(task, response);
  if (parsed.status !== 'complete') return parsed;
  const answers = task.answerRule.kind === 'accepted-responses' ? task.answerRule.responses : [];
  const correct = answers.some(answer => stable(answer) === stable(parsed.response));
  return {
    status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId,
    skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    feedback: { explanation: task.explanation, issues: correct ? [] : [{
      code: 'grammar-meaning-mismatch', slotId: null, constraintId: task.skillId === 'E04' ? 'contextual-word-roles' : 'intended-clause-relation',
      observed: task.skillId === 'E04' ? 'The complete grouping differs from the reviewed word roles in these sentences.' : 'The complete response does not form a reviewed sentence with the required meaning.',
      explanation: task.skillId === 'E04' ? 'Check each word in its supplied sentence; a word can have another class in another context.' : 'Check both the grammatical construction and the stated relationship; a grammatical sentence can express a different meaning.',
    }] },
  };
}
