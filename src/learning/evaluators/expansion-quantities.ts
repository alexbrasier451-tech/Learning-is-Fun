import type { ActivityResponse, ContentIssue, EvaluationResult, ExactQuantity, FeedbackIssue, TaskDefinition } from '../contracts';
import { canonicalQuestionId } from '../identity';
import { QUANTITY_TASKS } from '../../content/expansion-maths/quantities';

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object'
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const keys = (value: Record<string, unknown>, expected: readonly string[]) => Reflect.ownKeys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
const integer = (value: unknown, min: number, max: number): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
// Compare finite JSON structurally. In particular, NaN/Infinity/undefined must
// never become null or disappear through lossy JSON serialization.
function stable(value: unknown): string {
  if (Array.isArray(value)) {
    if (Reflect.ownKeys(value).length !== value.length + 1) throw new TypeError('Malformed JSON array.');
    return `[${Array.from(value, stable).join(',')}]`;
  }
  if (record(value)) {
    if (Reflect.ownKeys(value).length !== Object.keys(value).length) throw new TypeError('Non-JSON key.');
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  }
  if (value === null || typeof value === 'string' || typeof value === 'boolean'
    || (typeof value === 'number' && Number.isFinite(value))) return JSON.stringify(value);
  throw new TypeError('Expected finite JSON content.');
}
function specMeaning(spec: TaskDefinition['responseSpec']): unknown {
  if (spec.kind === 'quantity') return { ...spec, slots: [...spec.slots].map(slot => ({ ...slot, allowedDenominators: [...slot.allowedDenominators].sort((a, b) => a - b), units: [...slot.units].sort() })).sort((a, b) => a.id.localeCompare(b.id)), requiredSlotIds: [...spec.requiredSlotIds].sort() };
  if (spec.kind === 'choice') return { ...spec, slots: [...spec.slots].map(slot => ({ ...slot, options: [...slot.options].sort((a, b) => a.id.localeCompare(b.id)) })).sort((a, b) => a.id.localeCompare(b.id)), requiredSlotIds: [...spec.requiredSlotIds].sort() };
  if (spec.kind === 'matching') return { ...spec, items: [...spec.items].sort((a, b) => a.id.localeCompare(b.id)), targets: [...spec.targets].sort((a, b) => a.id.localeCompare(b.id)), requiredItemIds: [...spec.requiredItemIds].sort() };
  return spec;
}
const reviewedById = new Map(QUANTITY_TASKS.map(task => [task.canonicalQuestionId, task]));

/** Only reviewed finite records can be evaluated. Changing a source tuple,
 * control, answer, help, review, or stimulus requires a new author review. */
export function validateQuantityTask(task: TaskDefinition): readonly ContentIssue[] {
  const issues: ContentIssue[] = [];
  const id = record(task) && typeof task.canonicalQuestionId === 'string' ? task.canonicalQuestionId : '(unknown)';
  const add = (field: string, code: string, detail: string) => issues.push({ canonicalQuestionId: id, field, code, detail });
  if (!record(task) || !record(task.descriptor)) { add('descriptor', 'descriptor-invalid', 'A finite reviewed task descriptor is required.'); return issues; }
  try {
    if (canonicalQuestionId(task.descriptor) !== id) add('canonicalQuestionId', 'identity-mismatch', 'Canonical ID must agree with the meaningful descriptor.');
  } catch { add('descriptor', 'descriptor-invalid', 'Malformed canonical descriptor.'); return issues; }
  const reviewed = reviewedById.get(id);
  if (!reviewed) { add('descriptor', 'unreviewed-tuple', 'Only the thirty enumerated quantity tasks are reviewed.'); return issues; }
  if (reviewed === task && issues.length === 0) return issues; // deeply frozen export
  if (!keys(task, Object.keys(reviewed))) add('task', 'record-shape', 'Use the reviewed task fields without undeclared additions.');
  if (typeof task.contentRevision !== 'string' || !/^[1-9][0-9]*$/.test(task.contentRevision)) add('contentRevision', 'revision-invalid', 'Revision must be a positive decimal revision string.');
  for (const field of Object.keys(reviewed) as (keyof TaskDefinition)[]) {
    if (field === 'contentRevision') continue;
    try {
      // Validate raw data first: normalising option order must not erase a
      // malformed extra field or a non-finite number in the supplied record.
      stable(task[field]);
      const actual = field === 'responseSpec' ? specMeaning(task.responseSpec) : task[field];
      const expected = field === 'responseSpec' ? specMeaning(reviewed.responseSpec) : reviewed[field];
      if (stable(actual) !== stable(expected)) add(field, 'reviewed-record-mismatch', 'Source, prompt, representation, units, controls, answer and review must retain their reviewed meaning.');
    } catch { add(field, 'malformed-content', 'Content must be finite JSON data in the reviewed shape.'); }
  }
  return issues;
}

type Draft = { status: 'complete'; response: ActivityResponse } | Extract<EvaluationResult, { status: 'invalid-response' | 'incomplete' }>;
function draft(task: TaskDefinition, response: unknown): Draft {
  const spec = task.responseSpec;
  const field = spec.kind === 'quantity' ? 'values' : spec.kind === 'choice' ? 'choices' : 'pairs';
  const invalid = (reason: string): Draft => ({ status: 'invalid-response', reason });
  if (!record(response) || !keys(response, ['kind', field]) || response.kind !== spec.kind || !record(response[field])) return invalid('Use the declared response kind and semantic value map.');
  const map = response[field];
  const required = spec.kind === 'quantity' || spec.kind === 'choice' ? spec.requiredSlotIds : spec.kind === 'matching' ? spec.requiredItemIds : [];
  if (Reflect.ownKeys(map).some(id => typeof id !== 'string' || !required.includes(id))) return invalid('Unknown slot or item ID.');
  const missing: string[] = [];
  const used = new Set<string>();
  for (const id of required) {
    if (!Object.hasOwn(map, id) || map[id] === null) { missing.push(id); continue; }
    const value = map[id];
    if (spec.kind === 'quantity') {
      const slot = spec.slots.find(row => row.id === id)!;
      if (!record(value) || !keys(value, ['numerator', 'denominator', 'unit'])
        || !integer(value.numerator, slot.numeratorBounds.min, slot.numeratorBounds.max)
        || !integer(value.denominator, 1, 100) || !slot.allowedDenominators.includes(value.denominator)
        || typeof value.unit !== 'string' || !slot.units.includes(value.unit)) return invalid(`Slot ${id} requires an allowed bounded integer numerator, positive denominator and unit.`);
    } else if (spec.kind === 'choice' || spec.kind === 'matching') {
      const options = spec.kind === 'matching' ? spec.targets : spec.slots.find(row => row.id === id)!.options;
      if (typeof value !== 'string' || !options.some(option => option.id === value)) return invalid(`Unknown option for ${id}.`);
      if (spec.kind === 'matching' && spec.uniqueTargets && used.has(value)) return invalid('A matching target cannot be used twice.');
      used.add(value);
    } else return invalid('Unsupported quantity-family response form.');
  }
  // Invalid present entries win over a simultaneous partial draft.
  return missing.length ? { status: 'incomplete', missing } : { status: 'complete', response: response as ActivityResponse };
}
function values(response: ActivityResponse): Readonly<Record<string, ExactQuantity | string | null>> {
  return response.kind === 'quantity' ? response.values : response.kind === 'choice' ? response.choices : response.kind === 'matching' ? response.pairs : {};
}
function equalSlot(task: TaskDefinition, id: string, actual: ExactQuantity | string | null, expected: ExactQuantity | string | null): boolean {
  if (task.responseSpec.kind !== 'quantity') return actual === expected;
  if (!actual || !expected || typeof actual === 'string' || typeof expected === 'string') return false;
  if (actual.unit !== expected.unit) return false; // Requested unit is assessed.
  const slot = task.responseSpec.slots.find(row => row.id === id)!;
  if (slot.form === 'exact') return actual.numerator === expected.numerator && actual.denominator === expected.denominator;
  const left = actual.numerator * expected.denominator;
  const right = expected.numerator * actual.denominator;
  // All reviewed slot bounds give products <= 250000. Check anyway rather
  // than permit an unsafe intermediate if the finite bank is later revised.
  return Number.isSafeInteger(left) && Number.isSafeInteger(right) && left === right;
}

export function evaluateExpansionQuantities(task: TaskDefinition, response: unknown): EvaluationResult {
  const contentIssues = validateQuantityTask(task);
  if (contentIssues.length) return { status: 'unavailable-content', issues: contentIssues };
  const parsed = draft(task, response);
  if (parsed.status !== 'complete') return parsed;
  const accepted = task.answerRule.kind === 'accepted-responses' ? task.answerRule.responses : [];
  const actual = values(parsed.response);
  const mismatchIds = (answer: ActivityResponse) => Object.keys(actual).filter(id => !equalSlot(task, id, actual[id], values(answer)[id]));
  const nearest = [...accepted].sort((a, b) => mismatchIds(a).length - mismatchIds(b).length)[0];
  const mismatches = mismatchIds(nearest);
  const correct = mismatches.length === 0;
  const issues: FeedbackIssue[] = mismatches.map(id => {
    const value = actual[id];
    return { code: 'value-mismatch', slotId: id, constraintId: null,
      observed: typeof value === 'object' && value ? `${id} was set to ${value.numerator}/${value.denominator} ${value.unit}.` : `${id} was set to ${String(value)}.`,
      explanation: task.responseSpec.kind === 'quantity' ? 'This quantity or its requested unit/form does not match the question. Check the given whole, conversion and requested representation.'
        : 'This selected card does not match the requested quantity or written form. Check that item against the givens.' };
  });
  return { status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    feedback: { explanation: task.explanation, issues } };
}
