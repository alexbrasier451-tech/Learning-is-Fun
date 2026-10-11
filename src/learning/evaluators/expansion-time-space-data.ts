import type { ActivityResponse, ContentIssue, EvaluationResult, TaskDefinition } from '../contracts';
import { canonicalQuestionId } from '../identity';
import { TIME_SPACE_DATA_TASKS } from '../../content/expansion-maths/time-space-data';

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object'
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const keys = (value: Record<string, unknown>, expected: readonly string[]) => Object.keys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
const integer = (value: unknown, min: number, max: number): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;

// Do not let JSON erase NaN/Infinity/undefined into null or omit a field. This
// comparison accepts only finite JSON structures; it is not a text parser.
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${Array.from(value, stable).join(',')}]`;
  if (record(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return JSON.stringify(value);
  throw new TypeError('Only finite JSON values are content.');
}
function specMeaning(spec: TaskDefinition['responseSpec']): unknown {
  if (spec.kind === 'choice') return { ...spec, slots: spec.slots.map(slot => ({ ...slot, options: [...slot.options].sort((a, b) => a.id.localeCompare(b.id)) })).sort((a, b) => a.id.localeCompare(b.id)), requiredSlotIds: [...spec.requiredSlotIds].sort() };
  if (spec.kind === 'sequence') return { ...spec, tiles: [...spec.tiles].sort((a, b) => a.id.localeCompare(b.id)) };
  return spec;
}
const byId = new Map(TIME_SPACE_DATA_TASKS.map(task => [task.canonicalQuestionId, task]));

/** Exact finite membership keeps prompt, source, accessible givens and answer
 * coupled. A substantive source change needs a reviewed tuple; coordinates
 * cannot derive a new answer. Revision and control presentation order may vary. */
export function validateTimeSpaceDataTask(task: TaskDefinition): readonly ContentIssue[] {
  const issues: ContentIssue[] = [];
  const id = record(task) && typeof task.canonicalQuestionId === 'string' ? task.canonicalQuestionId : '(unknown)';
  const add = (field: string, code: string, detail: string) => issues.push({ canonicalQuestionId: id, field, code, detail });
  if (!record(task) || !record(task.descriptor)) { add('descriptor', 'descriptor-invalid', 'A finite reviewed descriptor is required.'); return issues; }
  try { if (canonicalQuestionId(task.descriptor) !== id) add('canonicalQuestionId', 'identity-mismatch', 'Identity must match the authored source descriptor.'); }
  catch { add('descriptor', 'descriptor-invalid', 'Invalid canonical descriptor.'); return issues; }
  const reviewed = byId.get(id);
  if (!reviewed) { add('descriptor', 'unreviewed-tuple', 'Only the thirty enumerated reviewed tasks are available.'); return issues; }
  if (reviewed === task && !issues.length) return issues; // exported tuples are deeply frozen
  if (!keys(task, Object.keys(reviewed))) add('task', 'record-shape', 'Missing or extra task fields.');
  if (typeof task.contentRevision !== 'string' || !/^[1-9][0-9]*$/.test(task.contentRevision)) add('contentRevision', 'revision-invalid', 'A positive decimal revision string is required.');
  for (const field of Object.keys(reviewed) as (keyof TaskDefinition)[]) {
    if (field === 'contentRevision') continue;
    try {
      const actual = field === 'responseSpec' ? specMeaning(task.responseSpec) : task[field];
      const expected = field === 'responseSpec' ? specMeaning(reviewed.responseSpec) : reviewed[field];
      if (stable(actual) !== stable(expected)) add(field, 'reviewed-record-mismatch', 'Source, representation, prompt, help, demand and exact answers must retain their reviewed meaning.');
    } catch { add(field, 'malformed-content', 'Content must be finite JSON data in the declared shape.'); }
  }
  return issues;
}

type Draft = { status: 'complete'; response: ActivityResponse } | Extract<EvaluationResult, { status: 'invalid-response' | 'incomplete' }>;
function draft(task: TaskDefinition, response: unknown): Draft {
  const invalid = (reason: string): Draft => ({ status: 'invalid-response', reason });
  if (!record(response) || response.kind !== task.responseSpec.kind) return invalid('Use the declared response kind.');
  const spec = task.responseSpec;
  if (spec.kind === 'clock') {
    if (!keys(response, ['kind', 'minutes'])) return invalid('A clock response contains only kind and minutes.');
    if (response.minutes === null) return { status: 'incomplete', missing: ['minutes'] };
    if (!integer(response.minutes, spec.minuteBounds.min, spec.minuteBounds.max)) return invalid('Clock minutes must be an integer from 0 to 1439.');
  } else if (spec.kind === 'sequence') {
    if (!keys(response, ['kind', 'orderedIds']) || !Array.isArray(response.orderedIds)) return invalid('A sequence requires ordered event IDs.');
    const ids = response.orderedIds;
    // Array.from observes holes instead of silently skipping them.
    if (Array.from(ids).some(id => typeof id !== 'string' || !spec.tiles.some(tile => tile.id === id)) || new Set(ids).size !== ids.length || ids.length > spec.cardinality.max) return invalid('Use distinct known event IDs once each.');
    if (ids.length < spec.cardinality.min) return { status: 'incomplete', missing: spec.tiles.filter(tile => !ids.includes(tile.id)).map(tile => tile.id) };
  } else if (spec.kind === 'choice' || spec.kind === 'quantity') {
    const field = spec.kind === 'choice' ? 'choices' : 'values';
    if (!keys(response, ['kind', field]) || !record(response[field])) return invalid('Use the declared semantic value map.');
    const map = response[field];
    if (Object.keys(map).some(id => !spec.requiredSlotIds.includes(id))) return invalid('Unknown response slot.');
    const missing: string[] = [];
    for (const id of spec.requiredSlotIds) {
      if (!Object.hasOwn(map, id) || map[id] === null) { missing.push(id); continue; }
      const value = map[id];
      if (spec.kind === 'choice') {
        const slot = spec.slots.find(slot => slot.id === id)!;
        if (typeof value !== 'string' || !slot.options.some(option => option.id === value)) return invalid('Choose an authored option ID.');
      } else if (spec.kind === 'quantity') {
        const slot = spec.slots.find(slot => slot.id === id)!;
        if (!record(value) || !keys(value, ['numerator', 'denominator', 'unit']) || !integer(value.numerator, slot.numeratorBounds.min, slot.numeratorBounds.max)
          || !integer(value.denominator, 1, 1) || typeof value.unit !== 'string' || !slot.units.includes(value.unit)) return invalid('Use a bounded whole-number quantity with denominator 1 and the declared unit.');
      }
    }
    if (missing.length) return { status: 'incomplete', missing };
  } else return invalid('Unsupported family response.');
  return { status: 'complete', response: response as ActivityResponse };
}

export function evaluateExpansionTimeSpaceData(task: TaskDefinition, response: unknown): EvaluationResult {
  const issues = validateTimeSpaceDataTask(task);
  if (issues.length) return { status: 'unavailable-content', issues };
  const parsed = draft(task, response);
  if (parsed.status !== 'complete') return parsed;
  const correct = task.answerRule.kind === 'accepted-responses' && task.answerRule.responses.some(answer => stable(answer) === stable(parsed.response));
  const kind = task.responseSpec.kind;
  const code = kind === 'clock' ? 'clock-mismatch' : kind === 'sequence' ? 'order-mismatch' : kind === 'quantity' ? 'quantity-mismatch' : 'choice-mismatch';
  const observed = parsed.response.kind === 'clock' ? `The answer clock was set to ${parsed.response.minutes} minutes after midnight.`
    : parsed.response.kind === 'sequence' ? `Submitted event order: ${parsed.response.orderedIds.join(', ')}.`
      : parsed.response.kind === 'quantity' ? `Submitted quantity: ${parsed.response.values.answer!.numerator} ${parsed.response.values.answer!.unit}.`
        : parsed.response.kind === 'choice' ? `Selected option: ${parsed.response.choices.answer}.` : 'Submitted response differs from the reviewed answer.';
  return { status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    feedback: { explanation: task.explanation, issues: correct ? [] : [{ code, observed, explanation: 'This complete response does not satisfy the stated question. Compare it with the source labels, units and requested relationship.', slotId: null, constraintId: 'reviewed-answer' }] } };
}
