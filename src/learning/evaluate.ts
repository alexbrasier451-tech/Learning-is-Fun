import type { EvaluationResult, TaskDefinition } from './contracts';
import { validateCatalogue } from '../content/catalogue';
import { evaluateStarterMaths } from './evaluators/starter-maths';
import { evaluateStarterPunctuation } from './evaluators/starter-punctuation';

/** Caller resolves the committed canonical descriptor/revision; no UI answer rule
 * or numeric reward is accepted here. Preserve each family's recovery tags. */
export function evaluateResponse(task: TaskDefinition, response: unknown): EvaluationResult {
  const issues = validateCatalogue([task]);
  if (issues.length) return { status: 'unavailable-content', issues };
  switch (task.descriptor.familyId) {
    case 'math.bridge': case 'math.merchant': return evaluateStarterMaths(task, response);
    case 'english.punctuation': return evaluateStarterPunctuation(task, response);
    default: return { status: 'unavailable-content', issues: [{ canonicalQuestionId: task.canonicalQuestionId,
      field: 'descriptor.familyId', code: 'unknown-family', detail: 'This family is not delivered in M1.' }] };
  }
}
