import type { ActivityResponse, ContentIssue, EvaluationResult, FeedbackIssue, TaskDefinition } from '../contracts';
import { canonicalQuestionId } from '../identity';
import { WORD_TASKS } from '../../content/expansion-english/words';

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object'
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const keys = (value: Record<string, unknown>, expected: readonly string[]) => Object.keys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
/** Reject values JSON would silently erase/coerce, cycles, accessors, sparse
 * arrays and undeclared symbol/non-enumerable properties before comparison. */
function stable(value: unknown, parents = new Set<object>()): string {
  if (value === null || typeof value === 'string' || typeof value === 'boolean'
    || (typeof value === 'number' && Number.isFinite(value))) return JSON.stringify(value);
  if (!Array.isArray(value) && !record(value)) throw new TypeError('Finite plain JSON is required.');
  if (parents.has(value)) throw new TypeError('Cyclic value.');
  parents.add(value);
  try {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (Reflect.ownKeys(value).some(key => typeof key !== 'string' || (key !== 'length' || !Array.isArray(value))
      && (!descriptors[key].enumerable || !Object.hasOwn(descriptors[key], 'value')))) throw new TypeError('Data properties only.');
    if (Array.isArray(value)) {
      if (Object.keys(value).length !== value.length || Array.from({ length: value.length }, (_, i) => i).some(i => !Object.hasOwn(value, i))) throw new TypeError('Dense arrays only.');
      return `[${value.map(item => stable(item, parents)).join(',')}]`;
    }
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key], parents)}`).join(',')}}`;
  } finally { parents.delete(value); }
}
function specMeaning(spec: TaskDefinition['responseSpec']): unknown {
  if (spec.kind === 'choice') return { ...spec, requiredSlotIds: [...spec.requiredSlotIds].sort(), slots: spec.slots.map(slot => ({ ...slot, options: [...slot.options].sort((a, b) => a.id.localeCompare(b.id)) })).sort((a, b) => a.id.localeCompare(b.id)) };
  if (spec.kind === 'sorting') return { ...spec, items: [...spec.items].sort((a, b) => a.id.localeCompare(b.id)), groups: [...spec.groups].sort((a, b) => a.id.localeCompare(b.id)), requiredItemIds: [...spec.requiredItemIds].sort() };
  if (spec.kind === 'matching') return { ...spec, items: [...spec.items].sort((a, b) => a.id.localeCompare(b.id)), targets: [...spec.targets].sort((a, b) => a.id.localeCompare(b.id)), requiredItemIds: [...spec.requiredItemIds].sort() };
  return spec;
}
const byId = new Map(WORD_TASKS.map(task => [task.canonicalQuestionId, task]));

/** Finite authored membership protects reviewed meaning/answers/help. Content
 * revision is separate from identity; it cannot silently change reviewed text. */
export function validateWordTask(task: TaskDefinition): readonly ContentIssue[] {
  const fallback = '(unknown)';
  try { stable(task); } catch { return [{ canonicalQuestionId: fallback, field: 'task', code: 'malformed-content', detail: 'Task must be finite plain JSON data.' }]; }
  const id = record(task) && typeof task.canonicalQuestionId === 'string' ? task.canonicalQuestionId : fallback;
  const issue = (field: string, code: string, detail: string): ContentIssue => ({ canonicalQuestionId: id, field, code, detail });
  if (!record(task) || !record(task.descriptor)) return [issue('descriptor', 'descriptor-invalid', 'An authored task descriptor is required.')];
  try {
    if (canonicalQuestionId(task.descriptor) !== id) return [issue('canonicalQuestionId', 'identity-mismatch', 'ID must reconstruct from the authored descriptor.')];
  } catch { return [issue('descriptor', 'descriptor-invalid', 'Invalid authored descriptor.')]; }
  const reviewed = byId.get(id);
  if (!reviewed) return [issue('descriptor', 'unreviewed-task', 'Only the thirty reviewed authored tasks are available.')];
  if (task === reviewed) return [];
  const issues: ContentIssue[] = [];
  if (!keys(task, Object.keys(reviewed))) issues.push(issue('task', 'record-shape', 'All and only declared task fields are required.'));
  if (typeof task.contentRevision !== 'string' || !/^[1-9][0-9]*$/.test(task.contentRevision)) issues.push(issue('contentRevision', 'revision-invalid', 'Use a positive decimal revision string.'));
  for (const field of Object.keys(reviewed) as (keyof TaskDefinition)[]) {
    if (field === 'contentRevision') continue;
    try {
      const actual = field === 'responseSpec' ? specMeaning(task.responseSpec) : task[field];
      const expected = field === 'responseSpec' ? specMeaning(reviewed.responseSpec) : reviewed[field];
      if (stable(actual) !== stable(expected)) issues.push(issue(field, 'reviewed-record-mismatch', 'Retain the reviewed objective, context, spelling, answers and assistance meaning.'));
    } catch { issues.push(issue(field, 'malformed-content', 'Malformed reviewed content field.')); }
  }
  return issues;
}
type Draft = { status: 'complete'; map: Readonly<Record<string, string>> } | Extract<EvaluationResult, { status: 'invalid-response' | 'incomplete' }>;
function draft(task: TaskDefinition, response: unknown): Draft {
  const invalid = (reason: string): Draft => ({ status: 'invalid-response', reason });
  try { stable(response); } catch { return invalid('Response must be finite plain JSON data.'); }
  const spec = task.responseSpec;
  if (spec.kind !== 'choice' && spec.kind !== 'sorting' && spec.kind !== 'matching') return invalid('Unsupported word response.');
  const field = spec.kind === 'choice' ? 'choices' : spec.kind === 'sorting' ? 'groups' : 'pairs';
  if (!record(response) || !keys(response, ['kind', field]) || response.kind !== spec.kind || !record(response[field])) return invalid('Use the declared response kind and ID map.');
  const map = response[field];
  const required = spec.kind === 'sorting' || spec.kind === 'matching' ? spec.requiredItemIds : spec.requiredSlotIds;
  if (Object.keys(map).some(id => !required.includes(id))) return invalid('Unknown slot or item ID.');
  const missing: string[] = [];
  const used = new Set<string>();
  for (const id of required) {
    if (!Object.hasOwn(map, id) || map[id] === null) { missing.push(id); continue; }
    const options = spec.kind === 'sorting' ? spec.groups : spec.kind === 'matching' ? spec.targets : spec.slots.find(slot => slot.id === id)!.options;
    const value = map[id];
    if (typeof value !== 'string' || !options.some(option => option.id === value)) return invalid(`Unknown option ID for ${id}.`);
    if (spec.kind === 'matching' && spec.uniqueTargets && used.has(value)) return invalid('A matching target cannot be used twice.');
    used.add(value);
  }
  return missing.length ? { status: 'incomplete', missing } : { status: 'complete', map: map as Record<string, string> };
}
function answerMap(response: ActivityResponse): Readonly<Record<string, string | null>> {
  return response.kind === 'choice' ? response.choices : response.kind === 'sorting' ? response.groups : response.kind === 'matching' ? response.pairs : {};
}
/** A complete in-domain wrong choice is judged, never classified as invalid.
 * Word forms are assessed through exact authored IDs; no text normalisation. */
export function evaluateExpansionWords(task: TaskDefinition, response: unknown): EvaluationResult {
  const issues = validateWordTask(task);
  if (issues.length) return { status: 'unavailable-content', issues };
  const parsed = draft(task, response);
  if (parsed.status !== 'complete') return parsed;
  const accepted = task.answerRule.kind === 'accepted-responses' ? task.answerRule.responses.map(answerMap) : [];
  const correct = accepted.some(map => stable(map) === stable(parsed.map));
  const mismatchCount = (map: Readonly<Record<string, string | null>>) => Object.keys(parsed.map).filter(id => map[id] !== parsed.map[id]).length;
  const closest = [...accepted].sort((a, b) => mismatchCount(a) - mismatchCount(b))[0];
  const feedback: FeedbackIssue[] = correct ? [] : Object.keys(parsed.map).filter(id => parsed.map[id] !== closest[id]).map(id => ({
    code: 'word-choice-mismatch', slotId: id, constraintId: null, observed: `Selected option ${parsed.map[id]} for ${id}.`,
    explanation: 'This selection does not meet the word meaning or spelling requested in this context. Compare it with the task explanation.',
  }));
  return { status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    feedback: { explanation: task.explanation, issues: feedback } };
}
