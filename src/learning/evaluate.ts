import type { EvaluationResult, TaskDefinition } from './contracts';
import { validateCatalogue } from '../content/catalogue';
import { evaluateStarterMaths } from './evaluators/starter-maths';
import { evaluateStarterPunctuation } from './evaluators/starter-punctuation';
import { evaluateExpansionArithmetic } from './evaluators/expansion-arithmetic';
import { evaluateExpansionQuantities } from './evaluators/expansion-quantities';
import { evaluateExpansionTimeSpaceData } from './evaluators/expansion-time-space-data';
import { evaluateExpansionWords } from './evaluators/expansion-words';
import { evaluateExpansionGrammar } from './evaluators/expansion-grammar';
import { evaluateExpansionPunctuation } from './evaluators/expansion-punctuation';
import { evaluateExpansionReadingWriting } from './evaluators/expansion-reading-writing';

/** Caller resolves the committed canonical descriptor/revision; no UI answer rule
 * or numeric reward is accepted here. Preserve each family's recovery tags. */
export function evaluateResponse(task: TaskDefinition, response: unknown): EvaluationResult {
  const issues = validateCatalogue([task]);
  if (issues.length) return { status: 'unavailable-content', issues };
  switch (task.descriptor.familyId) {
    case 'math.bridge': case 'math.merchant': return evaluateStarterMaths(task, response);
    case 'english.punctuation': return evaluateStarterPunctuation(task, response);
    case 'math.expansion.m01': case 'math.expansion.m02': case 'math.expansion.m03': case 'math.expansion.m04': return evaluateExpansionArithmetic(task, response);
    case 'math.expansion.m05': case 'math.expansion.m06': case 'math.expansion.m07': return evaluateExpansionQuantities(task, response);
    case 'math.expansion.m08': case 'math.expansion.m09': case 'math.expansion.m10': return evaluateExpansionTimeSpaceData(task, response);
    case 'english.words.e01': case 'english.words.e02': case 'english.words.e03': return evaluateExpansionWords(task, response);
    case 'english.expansion.e04': case 'english.expansion.e05': return evaluateExpansionGrammar(task, response);
    case 'english.punctuation.expansion': case 'english.direct-speech': return evaluateExpansionPunctuation(task, response);
    case 'english.reading-writing': return evaluateExpansionReadingWriting(task, response);
    default: return { status: 'unavailable-content', issues: [{ canonicalQuestionId: task.canonicalQuestionId,
      field: 'descriptor.familyId', code: 'unknown-family', detail: 'Return this undelivered family to its content owner.' }] };
  }
}
