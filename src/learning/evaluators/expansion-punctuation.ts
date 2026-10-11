import type { ContentIssue, EvaluationResult, FeedbackIssue, TaskDefinition } from '../contracts';
import { PUNCTUATION_TASKS } from '../../content/expansion-english/punctuation';

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object'
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const keys = (value: Record<string, unknown>, expected: readonly string[]) =>
  Reflect.ownKeys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
function dense(value: unknown): value is readonly unknown[] {
  if (!Array.isArray(value)) return false;
  for (let i = 0; i < value.length; i++) if (!Object.hasOwn(value, i)) return false;
  return true;
}
function same(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (dense(a) && dense(b)) return a.length === b.length && a.every((item, i) => same(item, b[i]));
  return record(a) && record(b) && keys(a, Object.keys(b)) && Object.keys(b).every(key => same(a[key], b[key]));
}
/** Match exact values in any order without coercing unknown IDs during sort. */
function bag(a: unknown, b: unknown, compare = same): boolean {
  if (!dense(a) || !dense(b) || a.length !== b.length) return false;
  const used = new Set<number>();
  return a.every(item => {
    const index = b.findIndex((other, i) => !used.has(i) && compare(item, other));
    if (index < 0) return false;
    used.add(index); return true;
  });
}
function sameSpec(a: unknown, b: unknown): boolean {
  return record(a) && record(b) && keys(a, ['kind', 'slots', 'requiredSlotIds']) && a.kind === b.kind
    && bag(a.requiredSlotIds, b.requiredSlotIds)
    && bag(a.slots, b.slots, (left, right) => record(left) && record(right)
      && keys(left, ['id', 'label', 'options']) && left.id === right.id && left.label === right.label
      && bag(left.options, right.options));
}

/** Only this finite, frozen reviewed bank is certified. No inference of grammar,
 * typography normalisation, external approval flag, or starter replacement. */
export function validatePunctuationTask(task: TaskDefinition): readonly ContentIssue[] {
  const issues: ContentIssue[] = [];
  const id = record(task) && typeof task.canonicalQuestionId === 'string' ? task.canonicalQuestionId : '(unknown)';
  const issue = (field: string, code: string, detail: string) => { issues.push({ canonicalQuestionId: id, field, code, detail }); };
  const approved = PUNCTUATION_TASKS.find(item => item.canonicalQuestionId === id);
  if (!record(task) || !approved) {
    issue('canonicalQuestionId', 'unreviewed-task', 'Only reviewed expansion punctuation and direct-speech records are handled.'); return issues;
  }
  for (const field of ['descriptor', 'skillId', 'objectiveId', 'band', 'contextualSkillIds', 'curriculum',
    'demandRationale', 'instructionText', 'assessedText', 'explanation', 'hints', 'workedSupport', 'narration', 'review'] as const) {
    if (!same(task[field], approved[field])) issue(field, 'reviewed-content-mismatch', 'This field differs from its approved meaning, source, assistance or narration convention.');
  }
  if (typeof task.contentRevision !== 'string' || !task.contentRevision.trim()) issue('contentRevision', 'revision-invalid', 'A nonempty revision is required.');
  if (task.stimulus !== undefined && task.stimulus !== null) issue('stimulus', 'unexpected-stimulus', 'These tasks use reviewed text and finite controls only.');
  if (!sameSpec(task.responseSpec, approved.responseSpec)) issue('responseSpec', 'slot-domain-mismatch', 'Require all reviewed slots, dense options, labels and required IDs; order alone may change.');
  if (!record(task.answerRule) || !keys(task.answerRule, ['kind', 'responses']) || task.answerRule.kind !== 'accepted-responses'
    || approved.answerRule.kind !== 'accepted-responses' || !bag(task.answerRule.responses, approved.answerRule.responses)) {
    issue('answerRule', 'answer-domain-mismatch', 'Require all and only the exact reviewed complete responses, including legitimate variants.');
  }
  return issues;
}

export function evaluateExpansionPunctuation(task: TaskDefinition, response: unknown): EvaluationResult {
  const contentIssues = validatePunctuationTask(task);
  if (contentIssues.length) return { status: 'unavailable-content', issues: contentIssues };
  const approved = PUNCTUATION_TASKS.find(item => item.canonicalQuestionId === task.canonicalQuestionId)!;
  const spec = approved.responseSpec;
  if ((spec.kind !== 'punctuation' && spec.kind !== 'choice') || approved.answerRule.kind !== 'accepted-responses') throw new Error('Reviewed family invariant');
  const field = spec.kind === 'punctuation' ? 'slots' : 'choices';
  if (!record(response) || !keys(response, ['kind', field]) || response.kind !== spec.kind || !record(response[field])) {
    return { status: 'invalid-response', reason: 'Use the task’s exact response kind and plain ID map, with no extra fields.' };
  }
  const values = response[field];
  const ids = spec.slots.map(slot => slot.id);
  if (Reflect.ownKeys(values).some(id => typeof id !== 'string' || !ids.includes(id))) {
    return { status: 'invalid-response', reason: 'Unknown or extra response slot.' };
  }
  for (const slot of spec.slots) {
    if (!Object.hasOwn(values, slot.id)) continue;
    const value = values[slot.id];
    if (value !== null && value !== '' && !slot.options.some(option => option.id === value)) {
      return { status: 'invalid-response', reason: 'A selected ID must exactly match an offered option; no typing, coercion or normalisation is used.' };
    }
  }
  const missing = ids.filter(id => !Object.hasOwn(values, id) || values[id] === null || values[id] === '');
  if (missing.length) return { status: 'incomplete', missing };
  const accepted = approved.answerRule.responses.map(item => {
    if (item.kind === 'punctuation') return item.slots;
    if (item.kind === 'choice') return item.choices;
    throw new Error('Reviewed response invariant');
  });
  const correct = accepted.some(map => ids.every(id => map[id] === values[id]));
  const issues: FeedbackIssue[] = [];
  if (!correct) {
    for (const id of ids) if (!accepted.some(map => map[id] === values[id])) {
      issues.push({ code: 'punctuation-context', slotId: id, constraintId: null,
        observed: String(values[id]), explanation: approved.explanation });
    }
    if (!issues.length) issues.push({ code: 'punctuation-combination', slotId: null, constraintId: 'assessed-convention',
      observed: ids.map(id => `${id}=${values[id]}`).join('; '), explanation: approved.explanation });
  }
  return { status: 'judged', correct, canonicalQuestionId: task.canonicalQuestionId, skillId: task.skillId,
    objectiveId: task.objectiveId, band: task.band, feedback: { explanation: approved.explanation, issues } };
}
