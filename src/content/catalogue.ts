import type { ContentIssue, DifficultyBand, SkillId, TaskDefinition } from '../learning/contracts';
import { canonicalQuestionId } from '../learning/identity';
import { validateStarterMathsTask } from '../learning/evaluators/starter-maths';
import { validateStarterPunctuationTask } from '../learning/evaluators/starter-punctuation';
import { buildBridgeTasks, buildMerchantTasks } from './starter-maths';
import { STARTER_PUNCTUATION_TASKS } from './starter-english';

// Separate assembly objects protect both accepted producer banks from callers.
const supplied: readonly TaskDefinition[] = JSON.parse(JSON.stringify([
  ...buildBridgeTasks(), ...buildMerchantTasks(), ...STARTER_PUNCTUATION_TASKS,
]));
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
freeze(supplied);
const record = (value: unknown): value is Record<string, unknown> => value !== null
  && typeof value === 'object' && !Array.isArray(value)
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const strings = (value: unknown): value is string[] => Array.isArray(value)
  && Array.from(value).every(item => typeof item === 'string');
function equal(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (Array.isArray(left) && Array.isArray(right)) return left.length === right.length
    && Array.from(left).every((value, i) => Object.hasOwn(left, i) && Object.hasOwn(right, i) && equal(value, right[i]));
  return record(left) && record(right) && Object.keys(left).length === Object.keys(right).length
    && Object.keys(right).every(key => Object.hasOwn(left, key) && equal(left[key], right[key]));
}

/** Validate delivered records (including nonempty filtered subsets). Family
 * owners remain responsible for domains; this boundary preserves reviewed prose. */
export function validateCatalogue(tasks: readonly TaskDefinition[]): readonly ContentIssue[] {
  const issues: ContentIssue[] = [];
  const add = (canonicalQuestionId: string, field: string, code: string, detail: string) => {
    issues.push({ canonicalQuestionId, field, code, detail });
  };
  if (!Array.isArray(tasks) || tasks.length === 0) {
    add('(catalogue)', 'tasks', 'empty-catalogue', 'A nonempty array of delivered reviewed tasks is required.'); return issues;
  }
  const seen = new Set<string>();
  for (const input of tasks) {
    const task = input as TaskDefinition;
    const id = record(task) && typeof task.canonicalQuestionId === 'string' ? task.canonicalQuestionId : '(unknown)';
    if (!record(task) || !record(task.descriptor) || !record(task.review) || !record(task.responseSpec)
      || !strings(task.contextualSkillIds)) {
      add(id, 'task', 'malformed-task', 'A task with descriptor, review, response specification and string contextual IDs is required.'); continue;
    }
    if (seen.has(id)) add(id, 'canonicalQuestionId', 'duplicate-canonical', 'Each canonical question occurs once in a catalogue.');
    seen.add(id);
    try {
      if (canonicalQuestionId(task.descriptor) !== id) add(id, 'descriptor', 'identity-mismatch', 'Retained meaningful parameters/key must reconstruct the canonical ID.');
    } catch {
      add(id, 'descriptor', 'descriptor-invalid', 'The retained descriptor cannot reconstruct a canonical question.'); continue;
    }
    const family = task.descriptor.familyId;
    if (family === 'math.bridge' && (task.responseSpec.kind !== 'bridge' || !Array.isArray(task.responseSpec.plankLengths)
      || !Array.from(task.responseSpec.plankLengths).every(value => typeof value === 'number' && Number.isSafeInteger(value)))) {
      add(id, 'responseSpec', 'malformed-task', 'Bridge supply must contain dense integer lengths.'); continue;
    }
    const validate = family === 'math.bridge' || family === 'math.merchant' ? validateStarterMathsTask
      : family === 'english.punctuation' ? validateStarterPunctuationTask : null;
    if (!validate) { add(id, 'descriptor.familyId', 'unknown-family', 'This family is not delivered in M1.'); continue; }
    issues.push(...validate(task));
    const reference = supplied.find(candidate => candidate.canonicalQuestionId === id);
    if (!reference) { add(id, 'canonicalQuestionId', 'undelivered-task', 'Only the reviewed starter inventory is delivered.'); continue; }
    const reviewedFields = ['skillId', 'objectiveId', 'band', 'contextualSkillIds', 'curriculum', 'demandRationale',
      'instructionText', 'assessedText', 'explanation', 'hints', 'workedSupport', 'narration', 'review'] as const;
    for (const field of reviewedFields) if (!equal(task[field], reference[field])) {
      add(id, field, 'reviewed-content-mismatch', 'Changed source, prose, assistance or attribution requires review in its owning bank.');
    }
  }
  return issues;
}

/** A defective bank publishes no usable task, rather than a partially approved bank. */
export const STARTER_TASKS: readonly TaskDefinition[] = freeze(supplied.length === 36 && validateCatalogue(supplied).length === 0 ? supplied : []);
export function getTask(canonicalQuestionId: string): TaskDefinition | undefined {
  return STARTER_TASKS.find(task => task.canonicalQuestionId === canonicalQuestionId);
}
export function listTasks(filter: { skillId?: SkillId; band?: DifficultyBand } = {}): readonly TaskDefinition[] {
  return Object.freeze(STARTER_TASKS.filter(task => (filter.skillId === undefined || task.skillId === filter.skillId)
    && (filter.band === undefined || task.band === filter.band)));
}
