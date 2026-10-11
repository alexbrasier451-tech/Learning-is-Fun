import type { ContentIssue, DifficultyBand, SkillId, TaskDefinition } from '../learning/contracts';
import { canonicalQuestionId } from '../learning/identity';
import { validateStarterMathsTask } from '../learning/evaluators/starter-maths';
import { validateStarterPunctuationTask } from '../learning/evaluators/starter-punctuation';
import { buildBridgeTasks, buildMerchantTasks } from './starter-maths';
import { STARTER_PUNCTUATION_TASKS } from './starter-english';
import { SKILLS } from './skills';
import { ARITHMETIC_TASKS, ARITHMETIC_MANIFEST } from './expansion-maths/arithmetic';
import { QUANTITY_TASKS, QUANTITY_MANIFEST } from './expansion-maths/quantities';
import { TIME_SPACE_DATA_TASKS, TIME_SPACE_DATA_MANIFEST } from './expansion-maths/time-space-data';
import { WORD_TASKS, WORD_MANIFEST } from './expansion-english/words';
import { GRAMMAR_TASKS, GRAMMAR_MANIFEST } from './expansion-english/grammar';
import { PUNCTUATION_TASKS, PUNCTUATION_MANIFEST } from './expansion-english/punctuation';
import { READING_WRITING_TASKS, READING_WRITING_MANIFEST } from './expansion-english/reading-writing';
import { validateArithmeticTask } from '../learning/evaluators/expansion-arithmetic';
import { validateQuantityTask } from '../learning/evaluators/expansion-quantities';
import { validateTimeSpaceDataTask } from '../learning/evaluators/expansion-time-space-data';
import { validateWordTask } from '../learning/evaluators/expansion-words';
import { validateGrammarTask } from '../learning/evaluators/expansion-grammar';
import { validatePunctuationTask } from '../learning/evaluators/expansion-punctuation';
import { validateReadingWritingTask } from '../learning/evaluators/expansion-reading-writing';

// Separate assembly objects protect both accepted producer banks from callers.
const supplied: readonly TaskDefinition[] = JSON.parse(JSON.stringify([
  ...buildBridgeTasks(), ...buildMerchantTasks(), ...STARTER_PUNCTUATION_TASKS,
]));
const expansion: readonly TaskDefinition[] = JSON.parse(JSON.stringify([
  ...ARITHMETIC_TASKS, ...QUANTITY_TASKS, ...TIME_SPACE_DATA_TASKS, ...WORD_TASKS,
  ...GRAMMAR_TASKS, ...PUNCTUATION_TASKS, ...READING_WRITING_TASKS,
]));
export const EXPANSION_MANIFESTS = Object.freeze([ARITHMETIC_MANIFEST, QUANTITY_MANIFEST,
  TIME_SPACE_DATA_MANIFEST, WORD_MANIFEST, GRAMMAR_MANIFEST, PUNCTUATION_MANIFEST, READING_WRITING_MANIFEST]);
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
freeze(supplied);
freeze(expansion);
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
    switch (family) {
      case 'math.bridge': case 'math.merchant': issues.push(...validateStarterMathsTask(task)); break;
      case 'english.punctuation': issues.push(...validateStarterPunctuationTask(task)); break;
      case 'math.expansion.m01': case 'math.expansion.m02': case 'math.expansion.m03': case 'math.expansion.m04':
        issues.push(...validateArithmeticTask(task)); break;
      case 'math.expansion.m05': case 'math.expansion.m06': case 'math.expansion.m07':
        issues.push(...validateQuantityTask(task)); break;
      case 'math.expansion.m08': case 'math.expansion.m09': case 'math.expansion.m10':
        issues.push(...validateTimeSpaceDataTask(task)); break;
      case 'english.words.e01': case 'english.words.e02': case 'english.words.e03':
        issues.push(...validateWordTask(task)); break;
      case 'english.expansion.e04': case 'english.expansion.e05': issues.push(...validateGrammarTask(task)); break;
      case 'english.punctuation.expansion': case 'english.direct-speech': issues.push(...validatePunctuationTask(task)); break;
      case 'english.reading-writing': issues.push(...validateReadingWritingTask(task)); break;
      default: add(id, 'descriptor.familyId', 'unknown-family', 'Return an undelivered family to its content owner.'); continue;
    }
    const reference = [...supplied, ...expansion].find(candidate => candidate.canonicalQuestionId === id);
    if (!reference) { add(id, 'canonicalQuestionId', 'undelivered-task', 'Only the reviewed producer inventory is delivered.'); continue; }
    // Approved membership also preserves source alternatives, labels, finite domains,
    // diagram closure/references and data scales. Never replace a missing source with text.
    if (!equal(task.stimulus ?? null, reference.stimulus ?? null)) {
      add(id, 'stimulus', 'reviewed-stimulus-mismatch', 'Return missing, unsupported or changed source data to the owning family.');
    }
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
const combined = [...STARTER_TASKS, ...expansion];
const inventoryValid = expansion.length === 200 && SKILLS.length === 20
  && new Set(expansion.map(task => task.skillId)).size === 20
  && SKILLS.every(skill => (['core', 'support', 'stretch'] as const).every((band, index) =>
    expansion.filter(task => task.skillId === skill.skillId && task.band === band).length >= [4, 3, 3][index]))
  && EXPANSION_MANIFESTS.flatMap(manifest => manifest.taskIds).length === expansion.length
  && new Set(EXPANSION_MANIFESTS.flatMap(manifest => manifest.taskIds)).size === expansion.length
  && EXPANSION_MANIFESTS.every(manifest => manifest.taskIds.every(id =>
    expansion.filter(task => task.canonicalQuestionId === id && manifest.familyIds.includes(task.descriptor.familyId)).length === 1));
/** Publication is all-or-nothing; retained records remain separately available for M1 fixtures. */
export const ALL_TASKS: readonly TaskDefinition[] = freeze(inventoryValid && combined.length === 236
  && validateCatalogue(combined).length === 0 ? combined : []);
export function getTask(canonicalQuestionId: string): TaskDefinition | undefined {
  return ALL_TASKS.find(task => task.canonicalQuestionId === canonicalQuestionId);
}
export function listTasks(filter: { skillId?: SkillId; band?: DifficultyBand } = {}): readonly TaskDefinition[] {
  return Object.freeze(ALL_TASKS.filter(task => (filter.skillId === undefined || task.skillId === filter.skillId)
    && (filter.band === undefined || task.band === filter.band)));
}
