import type { ContentIssue, EvaluationResult, FeedbackIssue, TaskDefinition } from '../contracts';
import { canonicalQuestionId } from '../identity';
import { SKILLS } from '../../content/skills';

const record = (value: unknown): value is Record<string, unknown> => value !== null
  && typeof value === 'object' && !Array.isArray(value)
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const whole = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0 && !/[<>\u0000]/.test(value);
const exactKeys = (value: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));

/** Bounded validation of these two reviewed M1 families, never an expression engine. */
export function validateStarterMathsTask(task: TaskDefinition): readonly ContentIssue[] {
  const issues: ContentIssue[] = [];
  const id = record(task) && typeof task.canonicalQuestionId === 'string' ? task.canonicalQuestionId : '(unknown)';
  const issue = (field: string, code: string, detail: string) => { issues.push({ canonicalQuestionId: id, field, code, detail }); };
  if (!record(task) || !record(task.descriptor)) {
    issue('descriptor', 'descriptor-invalid', 'A task and meaningful descriptor are required.'); return issues;
  }
  const descriptor = task.descriptor;
  const bridge = descriptor.familyId === 'math.bridge';
  if (!bridge && descriptor.familyId !== 'math.merchant') {
    issue('descriptor.familyId', 'unsupported-family', 'Only starter bridge and merchant families are handled.'); return issues;
  }
  try {
    if (canonicalQuestionId(descriptor) !== id) issue('canonicalQuestionId', 'identity-mismatch', 'Canonical ID must match the retained descriptor.');
  } catch {
    issue('descriptor', 'descriptor-invalid', 'The descriptor is malformed or contains extra identity inputs.');
    return issues;
  }
  if (descriptor.equivalenceVersion !== 'r1') issue('descriptor.equivalenceVersion', 'unsupported-version', 'Only reviewed r1 starter equivalence is delivered.');
  const parameters = record(descriptor.parameters) ? descriptor.parameters : {};
  const rule: Record<string, unknown> = record(task.answerRule) ? task.answerRule : {};
  const spec: Record<string, unknown> = record(task.responseSpec) ? task.responseSpec : {};
  const skill = bridge ? SKILLS[0] : SKILLS[3];
  if (task.skillId !== skill.skillId || task.objectiveId !== skill.objectiveId || task.band !== 'support') {
    issue('skillId/objectiveId/band', 'objective-mismatch', 'This introductory task must retain its primary objective and support band.');
  }
  if (!Array.isArray(task.contextualSkillIds) || task.contextualSkillIds.join(',') !== (bridge ? 'M07' : 'M02,E08')) {
    issue('contextualSkillIds', 'context-mismatch', 'Contextual skills must remain separate from the assessed objective.');
  }
  if (!record(task.curriculum) || task.curriculum.sourceUrl !== skill.curriculum[0].sourceUrl
    || task.curriculum.section !== skill.curriculum[0].section || task.curriculum.programmeBand !== skill.curriculum[0].programmeBand) {
    issue('curriculum', 'source-mismatch', 'The retained primary objective source reference is required.');
  }
  let expectedPrompt = '';
  if (bridge) {
    const target = parameters.target;
    if (!whole(target, 6, 17)) issue('descriptor.parameters.target', 'unreachable-domain', 'Starter bridge targets are whole metres 6–17.');
    if (rule.kind !== 'bridge-total' || rule.target !== target || !exactKeys(rule, ['kind', 'target'])) issue('answerRule', 'rule-mismatch', 'The sum target must match the descriptor.');
    if (spec.kind !== 'bridge' || !Array.isArray(spec.plankLengths) || spec.plankLengths.join(',') !== '1,2,3,4,5,6'
      || !spec.plankLengths.every(v => whole(v, 1, 6)) || !record(spec.cardinality) || spec.cardinality.min !== 1 || spec.cardinality.max !== 6) {
      issue('responseSpec', 'response-spec-mismatch', 'The supply is reusable lengths 1–6 and one to six planks.');
    }
    expectedPrompt = `The bridge must span ${target} metres. Make the chosen plank lengths add up to ${target} metres.`;
  } else {
    const { multiplier, pears } = parameters;
    if (!whole(multiplier, 2, 3) || !whole(pears, 1, 6)) issue('descriptor.parameters', 'unreachable-domain', 'Starter merchant multiplier is 2 or 3 and solution pears are 1–6.');
    const total = (Number(multiplier) + 1) * Number(pears);
    if (rule.kind !== 'merchant-constraints' || rule.multiplier !== multiplier || rule.total !== total
      || !exactKeys(rule, ['kind', 'total', 'multiplier'])) issue('answerRule', 'rule-mismatch', 'Both total and relationship must match the descriptor.');
    if (spec.kind !== 'merchant' || !record(spec.countBounds) || spec.countBounds.min !== 0 || spec.countBounds.max !== 24 || spec.maxTotal !== 24) {
      issue('responseSpec', 'response-spec-mismatch', 'Counters allow whole numbers 0–24 with a combined maximum of 24.');
    }
    expectedPrompt = multiplier === 2 && pears === 3
      ? 'Please pack twice as many apples as pears. I need nine pieces of fruit altogether.'
      : `Please pack ${multiplier === 2 ? 'twice' : 'three times'} as many apples as pears. I need ${total} pieces of fruit altogether.`;
  }
  if (task.assessedText !== expectedPrompt) issue('assessedText', 'prompt-mismatch', 'The assessed request must match the reviewed descriptor and both mathematical constraints.');
  for (const field of ['contentRevision', 'instructionText', 'demandRationale', 'explanation'] as const) {
    if (!text(task[field])) issue(field, 'missing-text', 'Nonempty reviewed plain text is required.');
  }
  if (task.stimulus != null) issue('stimulus', 'stimulus-unsupported', 'These starter tasks use text and native controls, without a separate assessed representation.');
  if (!Array.isArray(task.hints) || task.hints.length !== 2 || !task.hints.every(h => record(h) && text(h.id) && text(h.text))
    || !record(task.workedSupport) || !text(task.workedSupport.id) || !text(task.workedSupport.text)
    || new Set([...(Array.isArray(task.hints) ? task.hints.map(h => record(h) ? h.id : null) : []), record(task.workedSupport) ? task.workedSupport.id : null]).size !== 3) {
    issue('hints/workedSupport', 'help-invalid', 'Two stable distinct hints and a separate worked-support ID/text are required.');
  }
  if (!record(task.narration) || task.narration.neutralText !== task.instructionText || task.narration.assessedTextMayBeSpokenBeforeCheck !== true) {
    issue('narration', 'narration-invalid', 'Neutral narration must be instructions only; mathematical assessed text may be read separately.');
  }
  if (!record(task.review) || task.review.status !== 'approved' || !text(task.review.reviewer)
    || !text(task.review.rationale) || !text(task.review.evidenceRef)) {
    issue('review', 'unreviewed', 'Only approved, attributed and evidenced records can be evaluated.');
  }
  return issues;
}

export function evaluateStarterMaths(task: TaskDefinition, response: unknown): EvaluationResult {
  const contentIssues = validateStarterMathsTask(task);
  if (contentIssues.length) return { status: 'unavailable-content', issues: contentIssues };
  const invalid = (reason: string): EvaluationResult => ({ status: 'invalid-response', reason });
  if (!record(response)) return invalid('Use a semantic response object.');
  const issues: FeedbackIssue[] = [];
  if (task.descriptor.familyId === 'math.bridge') {
    if (response.kind !== 'bridge' || !exactKeys(response, ['kind', 'planks']) || !Array.isArray(response.planks)
      || response.planks.length > 6 || !Array.from(response.planks).every(value => whole(value, 1, 6))) {
      return invalid('Bridge response requires at most six whole-metre planks, each length 1–6.');
    }
    if (response.planks.length === 0) return { status: 'incomplete', missing: ['planks'] };
    const total = response.planks.reduce((sum: number, value: number) => sum + value, 0);
    const target = Number(task.descriptor.parameters.target);
    if (total !== target) {
      const short = total < target;
      issues.push({ code: short ? 'sum-under' : 'sum-over', slotId: null, constraintId: 'target',
        observed: `${total} metres`,
        explanation: `Your planks total ${total} metres, ${Math.abs(target - total)} ${Math.abs(target - total) === 1 ? 'metre' : 'metres'} ${short ? 'short of' : 'over'} the ${target}-metre span. A longer plank increases the total; a shorter plank decreases it.` });
    }
  } else {
    if (response.kind !== 'merchant' || !exactKeys(response, ['kind', 'apples', 'pears'])
      || !(response.apples === null || whole(response.apples, 0, 24))
      || !(response.pears === null || whole(response.pears, 0, 24))
      || Number(response.apples) + Number(response.pears) > 24) {
      return invalid('Merchant response requires whole counts or empty fields, with at most 24 fruit altogether.');
    }
    if (response.apples === null || response.pears === null) {
      return { status: 'incomplete', missing: ['apples', 'pears'].filter(key => response[key] === null) };
    }
    const apples = response.apples as number; const pears = response.pears as number;
    if (apples + pears === 0) return { status: 'incomplete', missing: ['fruit'] };
    const multiplier = Number(task.descriptor.parameters.multiplier);
    const total = (multiplier + 1) * Number(task.descriptor.parameters.pears);
    if (apples + pears !== total) issues.push({ code: 'total-mismatch', slotId: null, constraintId: 'total',
      observed: `${apples + pears} fruit`, explanation: `There are ${apples + pears} pieces of fruit in the basket. The request is for ${total} altogether.` });
    if (apples !== multiplier * pears) issues.push({ code: 'relationship-mismatch', slotId: null, constraintId: 'relationship',
      observed: `${apples} ${apples === 1 ? 'apple' : 'apples'} and ${pears} ${pears === 1 ? 'pear' : 'pears'}`, explanation: `The request needs ${multiplier} apples for each pear. With ${pears} ${pears === 1 ? 'pear' : 'pears'}, that relationship would give ${multiplier * pears} apples; this basket has ${apples}. Check the total too.` });
  }
  return { status: 'judged', correct: issues.length === 0, canonicalQuestionId: task.canonicalQuestionId,
    skillId: task.skillId, objectiveId: task.objectiveId, band: task.band,
    feedback: { explanation: task.explanation, issues } };
}
