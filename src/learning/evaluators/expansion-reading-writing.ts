import type { ActivityResponse, ContentIssue, EvaluationResult, FeedbackIssue, TaskDefinition } from '../contracts';
import { canonicalQuestionId } from '../identity';
import { READING_WRITING_DISPOSITIONS, READING_WRITING_TASKS } from '../../content/expansion-english/reading-writing';

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object'
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const keys = (value: object, expected: readonly string[]) => Object.keys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));

/** Lossless finite JSON comparison. Reject holes, extra array properties,
 * accessors, symbols, undefined, cycles, unsafe numbers and non-plain objects
 * before they can be erased/coerced by JSON.stringify. No toJSON execution. */
function stable(value: unknown, parents = new Set<object>()): string {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || Object.is(value, -0)) throw new TypeError('Lossy number');
    return JSON.stringify(value);
  }
  if (!Array.isArray(value) && !record(value)) throw new TypeError('Non-JSON content');
  if (parents.has(value)) throw new TypeError('Cyclic content');
  const own = Reflect.ownKeys(value);
  if (own.some(key => typeof key !== 'string')) throw new TypeError('Symbol property');
  const fields = own.filter(key => key !== 'length' || !Array.isArray(value)) as string[];
  for (const field of fields) {
    const property = Object.getOwnPropertyDescriptor(value, field)!;
    if (!property.enumerable || !Object.hasOwn(property, 'value')) throw new TypeError('Non-data property');
  }
  const next = new Set(parents).add(value);
  if (Array.isArray(value)) {
    if (fields.length !== value.length || fields.some((key, index) => key !== String(index))) throw new TypeError('Sparse or extended array');
    return `[${value.map(item => stable(item, next)).join(',')}]`;
  }
  return `{${fields.sort().map(key => `${JSON.stringify(key)}:${stable(value[key], next)}`).join(',')}}`;
}
function specMeaning(spec: TaskDefinition['responseSpec']): unknown {
  if (spec.kind === 'sequence') return { ...spec, tiles: [...spec.tiles].sort((a, b) => a.id.localeCompare(b.id)) };
  if (spec.kind === 'choice') return { ...spec,
    slots: spec.slots.map(slot => ({ ...slot, options: [...slot.options].sort((a, b) => a.id.localeCompare(b.id)) })).sort((a, b) => a.id.localeCompare(b.id)),
    requiredSlotIds: [...spec.requiredSlotIds].sort() };
  return spec;
}
const reviewedById = new Map(READING_WRITING_TASKS.map(task => [task.canonicalQuestionId, task]));

/** Only the frozen finite reviewed bank is reconstructible. A cosmetic revision
 * or control presentation order may change; meaning/source/help/answers may not. */
export function validateReadingWritingTask(task: TaskDefinition): readonly ContentIssue[] {
  let id = '(unknown)';
  const issue = (field: string, code: string, detail: string): readonly ContentIssue[] => [{ canonicalQuestionId: id, field, code, detail }];
  try { stable(task); } catch { return issue('task', 'malformed-content', 'Use lossless finite JSON task data.'); }
  if (!record(task) || typeof task.canonicalQuestionId !== 'string') return issue('task', 'record-shape', 'A reviewed task record is required.');
  id = task.canonicalQuestionId;
  try { if (canonicalQuestionId(task.descriptor) !== id) return issue('canonicalQuestionId', 'identity-mismatch', 'Descriptor and canonical identity disagree.'); }
  catch { return issue('descriptor', 'descriptor-invalid', 'The authored descriptor is malformed.'); }
  const reviewed = reviewedById.get(id);
  if (!reviewed) return issue('descriptor', 'unreviewed-task', 'This authored meaning has no reviewed reading/writing record.');
  if (!keys(task, Object.keys(reviewed))) return issue('task', 'record-shape', 'Retain exactly the reviewed task fields.');
  if (typeof task.contentRevision !== 'string' || !/^[1-9][0-9]*$/.test(task.contentRevision)) return issue('contentRevision', 'revision-invalid', 'A positive decimal content revision is required.');
  const issues: ContentIssue[] = [];
  for (const field of Object.keys(reviewed) as (keyof TaskDefinition)[]) {
    if (field === 'contentRevision') continue;
    try {
      const actual = field === 'responseSpec' ? specMeaning(task.responseSpec) : task[field];
      const expected = field === 'responseSpec' ? specMeaning(reviewed.responseSpec) : reviewed[field];
      if (stable(actual) !== stable(expected)) issues.push(...issue(field, 'reviewed-record-mismatch', 'Preserve the reviewed passage, question, source, objective, response meaning, answers and help.'));
    } catch { issues.push(...issue(field, 'malformed-content', 'The declared content shape is malformed.')); }
  }
  return issues;
}

type Draft = { status: 'complete'; response: ActivityResponse } | Extract<EvaluationResult, { status: 'invalid-response' | 'incomplete' }>;
function parse(task: TaskDefinition, input: unknown): Draft {
  const invalid = (reason: string): Draft => ({ status: 'invalid-response', reason });
  try { stable(input); } catch { return invalid('Use finite semantic response data with no missing array entries.'); }
  const spec = task.responseSpec;
  const field = spec.kind === 'choice' ? 'choices' : 'orderedIds';
  if (!record(input) || !keys(input, ['kind', field]) || input.kind !== spec.kind) return invalid('Use the task’s declared response kind and fields.');
  if (spec.kind === 'choice') {
    if (!record(input.choices)) return invalid('Choices must be a slot-to-option map.');
    const choices = input.choices;
    if (Object.keys(choices).some(id => !spec.requiredSlotIds.includes(id))) return invalid('Unknown choice slot.');
    const missing: string[] = [];
    for (const slot of spec.slots) {
      if (!Object.hasOwn(choices, slot.id) || choices[slot.id] === null) { missing.push(slot.id); continue; }
      if (typeof choices[slot.id] !== 'string' || !slot.options.some(option => option.id === choices[slot.id])) return invalid(`Unknown option in ${slot.id}.`);
    }
    if (missing.length) return { status: 'incomplete', missing };
  } else if (spec.kind === 'sequence') {
    if (!Array.isArray(input.orderedIds)) return invalid('A sequence must be an array of tile IDs.');
    const ids = input.orderedIds;
    if (ids.some(id => typeof id !== 'string' || !spec.tiles.some(tile => tile.id === id))) return invalid('Unknown tile ID.');
    if (new Set(ids).size !== ids.length) return invalid('Use each tile ID only once.');
    if (ids.length > spec.cardinality.max) return invalid('Too many tiles.');
    if (ids.length < spec.cardinality.min) return { status: 'incomplete', missing: spec.tiles.filter(tile => !ids.includes(tile.id)).map(tile => tile.id) };
  } else return invalid('Unsupported reading/writing response kind.');
  return { status: 'complete', response: input as ActivityResponse };
}

export function evaluateExpansionReadingWriting(task: TaskDefinition, response: unknown): EvaluationResult {
  const issues = validateReadingWritingTask(task);
  if (issues.length) return { status: 'unavailable-content', issues };
  const draft = parse(task, response);
  if (draft.status !== 'complete') return draft;
  const accepted = task.answerRule.kind === 'accepted-responses' ? task.answerRule.responses : [];
  const correct = accepted.some(answer => stable(answer) === stable(draft.response));
  const feedback: FeedbackIssue[] = [];
  const key = task.descriptor.authoredKey!;
  const actual = draft.response;
  if (!correct && actual.kind === 'sequence') feedback.push({ code: 'sequence-dependency', slotId: null, constraintId: 'narrative-order',
    observed: `Tile order: ${actual.orderedIds.join(', ')}.`, explanation: READING_WRITING_DISPOSITIONS.sequences[key] });
  else if (!correct && actual.kind === 'choice') {
    if (task.skillId === 'E09') {
      const infer = actual.choices.inference!;
      const clue = actual.choices.clue!;
      const unsupported = READING_WRITING_DISPOSITIONS.inferences[key][infer];
      if (unsupported) feedback.push({ code: 'unsupported-inference', slotId: 'inference', constraintId: 'textual-evidence', observed: `Inference ${infer} with clue ${clue}.`, explanation: unsupported });
      else {
        const spec = task.responseSpec;
        const clueText = spec.kind === 'choice' ? spec.slots.find(slot => slot.id === 'clue')!.options.find(option => option.id === clue)!.label : '';
        feedback.push({ code: 'unsupported-clue', slotId: 'clue', constraintId: 'textual-evidence', observed: `Clue ${clue} with inference ${infer}.`,
          explanation: `“${clueText}” does not establish this inference. ${task.explanation}` });
      }
    } else {
      const slot = task.skillId === 'E08' ? 'answer' : 'edit';
      feedback.push({ code: task.skillId === 'E08' ? 'retrieval-mismatch' : 'edit-meaning', slotId: slot, constraintId: null,
        observed: `Selected ${actual.choices[slot]}.`, explanation: READING_WRITING_DISPOSITIONS.choices[key][actual.choices[slot]!] });
    }
  }
  return { status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    feedback: { explanation: task.explanation, issues: feedback } };
}
