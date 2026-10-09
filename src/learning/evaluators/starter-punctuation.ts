import type { ContentIssue, EvaluationResult, FeedbackIssue, TaskDefinition } from '../contracts';
import { canonicalQuestionId } from '../identity';
import { STARTER_PUNCTUATION_TASKS } from '../../content/starter-english';

const record = (value: unknown): value is Record<string, unknown> => value !== null
  && typeof value === 'object'
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const exactKeys = (value: Record<string, unknown>, keys: readonly string[]) =>
  Reflect.ownKeys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
const mark = (value: unknown): value is string => value === '.' || value === '?' || value === '!';
const nonempty = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
// Array.every skips holes. Require an own, valid value at every control index.
function denseEvery(values: readonly unknown[], accepts: (value: unknown) => boolean): boolean {
  for (let index = 0; index < values.length; index++) {
    if (!Object.hasOwn(values, index) || !accepts(values[index])) return false;
  }
  return true;
}

/** JSON structural equality, independent of record key insertion order. */
function equal(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && right.every((value, i) => Object.hasOwn(left, i) && equal(left[i], value));
  }
  return record(left) && record(right) && exactKeys(left, Object.keys(right))
    && Object.keys(right).every(key => equal(left[key], right[key]));
}

function answerMaps(value: unknown, ids: readonly string[]): readonly string[] | null {
  if (!record(value) || value.kind !== 'accepted-responses' || !exactKeys(value, ['kind', 'responses'])
    || !Array.isArray(value.responses) || value.responses.length === 0 || value.responses.length > 9) return null;
  const maps: string[] = [];
  for (const response of value.responses) {
    if (!record(response) || !exactKeys(response, ['kind', 'slots']) || response.kind !== 'punctuation'
      || !record(response.slots) || !exactKeys(response.slots, ids)) return null;
    const slots = response.slots;
    if (!ids.every(id => mark(slots[id]))) return null;
    maps.push(ids.map(id => slots[id]).join(''));
  }
  return new Set(maps).size === maps.length ? maps.sort() : null;
}

/** This finite family admits only reviewed task semantics. A caller cannot attach
 * 'approved' to changed prose/answers and turn a content defect into learner error.
 * Cosmetic revision IDs and semantic slot/option/map reordering are harmless.
 * A prose revision must be reviewed in the owned source bank before use. */
export function validateStarterPunctuationTask(task: TaskDefinition): readonly ContentIssue[] {
  const issues: ContentIssue[] = [];
  const id = record(task) && typeof task.canonicalQuestionId === 'string' ? task.canonicalQuestionId : '(unknown)';
  const add = (field: string, code: string, detail: string) => { issues.push({ canonicalQuestionId: id, field, code, detail }); };
  if (!record(task) || !record(task.descriptor)) {
    add('descriptor', 'descriptor-invalid', 'A task with its retained descriptor is required.');
    return issues;
  }
  try {
    if (canonicalQuestionId(task.descriptor) !== id) add('canonicalQuestionId', 'identity-mismatch', 'The canonical ID must match the descriptor.');
  } catch {
    add('descriptor', 'descriptor-invalid', 'The descriptor must contain only valid meaningful identity fields.');
    return issues;
  }
  const reference = STARTER_PUNCTUATION_TASKS.find(candidate => candidate.canonicalQuestionId === id);
  if (!reference || !equal(task.descriptor, reference.descriptor)) {
    add('descriptor', 'unreviewed-task', 'Only the twelve authored r1 punctuation tasks with empty parameters are reviewed.');
    return issues;
  }
  if (!nonempty(task.contentRevision)) add('contentRevision', 'revision-invalid', 'A nonempty content revision is required.');
  if (!record(task.review) || task.review.status !== 'approved') add('review', 'review-unapproved', 'Withheld or unreviewed content cannot be judged.');
  const reviewedFields = [
    'skillId', 'objectiveId', 'band', 'contextualSkillIds', 'curriculum', 'demandRationale',
    'instructionText', 'assessedText', 'explanation', 'hints', 'workedSupport', 'review',
  ] as const;
  for (const field of reviewedFields) {
    if (!equal(task[field], reference[field])) add(field, 'reviewed-content-mismatch', 'This field must match the approved contextual content and help review.');
  }
  if (!equal(task.narration, reference.narration)) add('narration', 'unsafe-narration', 'Only approved neutral controls may be spoken before Check; assessed lines must not be modelled.');
  if (task.stimulus !== undefined && task.stimulus !== null) add('stimulus', 'unexpected-stimulus', 'These reviewed tasks use text and terminal slots only.');

  const expected = reference.responseSpec;
  if (expected.kind !== 'punctuation') throw new Error('Internal punctuation reference invariant');
  const ids = expected.slots.map(slot => slot.id).sort();
  const spec: unknown = task.responseSpec;
  let validSpec = record(spec) && exactKeys(spec, ['kind', 'slots', 'requiredSlotIds'])
    && spec.kind === 'punctuation' && Array.isArray(spec.slots) && spec.slots.length === ids.length
    && Array.isArray(spec.requiredSlotIds)
    && denseEvery(spec.requiredSlotIds, id => typeof id === 'string')
    && equal([...spec.requiredSlotIds].sort(), ids);
  if (validSpec && record(spec) && Array.isArray(spec.slots)) {
    const seen = new Set<string>();
    for (const slot of spec.slots) {
      if (!record(slot) || !exactKeys(slot, ['id', 'label', 'options']) || typeof slot.id !== 'string'
        || seen.has(slot.id) || !Array.isArray(slot.options)) { validSpec = false; break; }
      seen.add(slot.id);
      const approved = expected.slots.find(candidate => candidate.id === slot.id);
      if (!approved || slot.label !== approved.label || slot.options.length !== 3
        || !denseEvery(slot.options, option => record(option) && exactKeys(option, ['id', 'label'])
          && mark(option.id) && option.label === option.id)
        || new Set(slot.options.map(option => (option as Record<string, unknown>).id)).size !== 3) {
        validSpec = false; break;
      }
    }
  }
  if (!validSpec) add('responseSpec', 'slot-domain-mismatch', 'Require exactly the reviewed one or two distinct terminal slots, their labels, and all three glyph options.');
  const suppliedMaps = answerMaps(task.answerRule, ids);
  if (suppliedMaps === null || !equal(suppliedMaps, answerMaps(reference.answerRule, ids))) {
    add('answerRule', 'answer-domain-mismatch', 'Require all and only the reviewed complete accepted maps, without duplicates or extra slots.');
  }
  return issues;
}

/** No text normalisation, free-text grading, browser/audio/state or rewards. */
export function evaluateStarterPunctuation(task: TaskDefinition, response: unknown): EvaluationResult {
  const contentIssues = validateStarterPunctuationTask(task);
  if (contentIssues.length) return { status: 'unavailable-content', issues: contentIssues };
  if (!record(response) || !exactKeys(response, ['kind', 'slots']) || response.kind !== 'punctuation'
    || !record(response.slots)) return { status: 'invalid-response', reason: 'Use a punctuation response with a plain slot map and no extra fields.' };
  const spec = task.responseSpec;
  const rule = task.answerRule;
  if (spec.kind !== 'punctuation' || rule.kind !== 'accepted-responses') throw new Error('Validated punctuation invariant');
  // Reference order keeps missing/feedback stable even if presentation is reordered.
  const referenceSpec = STARTER_PUNCTUATION_TASKS.find(candidate => candidate.canonicalQuestionId === task.canonicalQuestionId)!.responseSpec;
  if (referenceSpec.kind !== 'punctuation') throw new Error('Internal punctuation reference invariant');
  const ids = referenceSpec.slots.map(slot => slot.id);
  const slots = response.slots;
  if (Reflect.ownKeys(slots).some(id => typeof id !== 'string' || !ids.includes(id))) {
    return { status: 'invalid-response', reason: 'The slot map contains an unknown or extra slot.' };
  }
  // Invalid takes precedence over missing: a malformed partial draft is not a Check.
  if (Object.values(slots).some(value => value !== null && value !== '' && !mark(value))) {
    return { status: 'invalid-response', reason: 'Each supplied ending must be exactly ., ? or !, or a blank (null or empty string).' };
  }
  const missing = ids.filter(id => !Object.hasOwn(slots, id) || slots[id] === null || slots[id] === '');
  if (missing.length) return { status: 'incomplete', missing };
  const accepted = rule.responses.filter(item => item.kind === 'punctuation');
  const correct = accepted.some(item => ids.every(id => item.slots[id] === slots[id]));
  const issues: FeedbackIssue[] = [];
  if (!correct) {
    for (const slot of referenceSpec.slots) {
      if (!accepted.some(item => item.slots[slot.id] === slots[slot.id])) {
        issues.push({ code: 'punctuation-context', slotId: slot.id, constraintId: null,
          observed: String(slots[slot.id]), explanation: `For “${slot.label}”: ${task.explanation}` });
      }
    }
    // Kept explicit so future jointly constrained maps never yield empty feedback.
    if (issues.length === 0) issues.push({ code: 'punctuation-combination', slotId: null,
      constraintId: 'complete-map', observed: ids.map(id => `${id}=${slots[id]}`).join(', '), explanation: task.explanation });
  }
  return { status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId,
    skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    feedback: { explanation: task.explanation, issues } };
}
