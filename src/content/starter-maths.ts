import type { TaskDefinition, TaskFamilyManifest } from '../learning/contracts';
import { canonicalQuestionId } from '../learning/identity';
import { SKILLS } from './skills';

const review = {
  status: 'approved', reviewer: 'Codex WP03-02A content and finite-domain review',
  rationale: 'Original introductory tasks checked for reachability, exact constraints, neutral instructions and separate assisted support; no qualified educator review claimed.',
  evidenceRef: 'docs/content-review/starter-maths.md',
} as const;

export function buildBridgeTasks(): readonly TaskDefinition[] {
  return Array.from({ length: 12 }, (_, index): TaskDefinition => {
    const target = index + 6;
    const descriptor = { familyId: 'math.bridge', equivalenceVersion: 'r1', authoredKey: null, parameters: { target } };
    const solution = [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])];
    const instructionText = 'Choose one to six planks. You may reuse lengths from 1 to 6 metres. When you are ready, choose Check.';
    return {
      canonicalQuestionId: canonicalQuestionId(descriptor), descriptor, contentRevision: 'starter-maths-1',
      skillId: 'M01', objectiveId: SKILLS[0].objectiveId, band: 'support', contextualSkillIds: ['M07'],
      curriculum: SKILLS[0].curriculum[0],
      demandRationale: 'Introductory whole-number addition with reusable visible lengths and one missing total, consolidating earlier arithmetic in a Years 3–4 planning context. Larger targets alone do not establish a harder band; metres are context, not a separate measurement assessment.',
      instructionText, assessedText: `The bridge must span ${target} metres. Make the chosen plank lengths add up to ${target} metres.`,
      responseSpec: { kind: 'bridge', plankLengths: [1, 2, 3, 4, 5, 6], cardinality: { min: 1, max: 6 } },
      answerRule: { kind: 'bridge-total', target },
      explanation: `Add all the chosen lengths. Any arrangement totalling ${target} metres works, using one to six permitted planks. Changing the order does not change the total.`,
      hints: [
        { id: 'bridge-look', text: 'Look at the required span and the length written on each chosen plank.' },
        { id: 'bridge-add', text: 'Add the chosen lengths. If the total is too short, try a longer plank or add a plank; if it is too long, try a shorter plank or remove one. Keep one to six planks.' },
      ],
      workedSupport: { id: 'bridge-worked', text: `One possible solution is ${solution.join(' + ')} = ${target} metres. Each plank is between 1 and 6 metres. Other combinations can work too.` },
      narration: { neutralText: instructionText, assessedTextMayBeSpokenBeforeCheck: true }, review,
    };
  });
}

export function buildMerchantTasks(): readonly TaskDefinition[] {
  return [2, 3].flatMap(multiplier => Array.from({ length: 6 }, (_, index): TaskDefinition => {
    const pears = index + 1;
    const total = (multiplier + 1) * pears;
    const apples = multiplier * pears;
    const descriptor = { familyId: 'math.merchant', equivalenceVersion: 'r1', authoredKey: null, parameters: { multiplier, pears } };
    const relation = multiplier === 2 ? 'twice' : 'three times';
    const instructionText = 'Choose how many apples and pears to pack. Check both requests. When you are ready, choose Check.';
    return {
      canonicalQuestionId: canonicalQuestionId(descriptor), descriptor, contentRevision: 'starter-maths-1',
      skillId: 'M04', objectiveId: SKILLS[3].objectiveId, band: 'support', contextualSkillIds: ['M02', 'E08'],
      curriculum: SKILLS[3].curriculum[0],
      demandRationale: 'Introductory integer scaling with two explicit constraints and bounded counters. This is mixed-task M04 evidence, not formal ratio algebra or independent M02/E08 evidence; a larger multiplier alone does not establish a harder band.',
      instructionText,
      assessedText: multiplier === 2 && pears === 3
        ? 'Please pack twice as many apples as pears. I need nine pieces of fruit altogether.'
        : `Please pack ${relation} as many apples as pears. I need ${total} pieces of fruit altogether.`,
      responseSpec: { kind: 'merchant', countBounds: { min: 0, max: 24 }, maxTotal: 24 },
      answerRule: { kind: 'merchant-constraints', total, multiplier },
      explanation: `Both requests must hold: apples + pears = ${total}, and apples = ${multiplier} × pears. Check the total and the relationship separately.`,
      hints: [
        { id: 'merchant-requests', text: 'There are two requests: the total fruit and how many apples go with each pear.' },
        { id: 'merchant-groups', text: `Imagine groups with one pear and ${multiplier} apples in each group. Count how many whole groups fit the requested total, then check both fruit counts.` },
      ],
      workedSupport: { id: 'merchant-worked', text: `Each group has 1 pear and ${multiplier} apples, so ${multiplier + 1} fruit. ${total} ÷ ${multiplier + 1} = ${pears} ${pears === 1 ? 'group' : 'groups'}: ${pears} ${pears === 1 ? 'pear' : 'pears'} and ${apples} apples. Check: ${apples} + ${pears} = ${total}, and ${apples} = ${multiplier} × ${pears}.` },
      narration: { neutralText: instructionText, assessedTextMayBeSpokenBeforeCheck: true }, review,
    };
  }));
}

const bridges = buildBridgeTasks();
const merchants = buildMerchantTasks();
export const STARTER_MATHS_MANIFEST: TaskFamilyManifest = {
  moduleId: 'starter-maths', familyIds: ['math.bridge', 'math.merchant'],
  taskIds: [...bridges, ...merchants].map(task => task.canonicalQuestionId), retainedTaskIds: [],
  domainDescription: '12 bridge targets 6–17 with 1–6 reusable integer planks of length 1–6; 12 merchant pairs with multiplier 2/3, pears 1–6 and basket total at most 24. All support band.',
  reviewEvidenceRef: 'docs/content-review/starter-maths.md',
  cases: [
    ...bridges.flatMap((task, index) => {
      const target = index + 6;
      const planks = [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])];
      return [
        { caseId: `bridge-${target}-reachable`, canonicalQuestionId: task.canonicalQuestionId, response: { kind: 'bridge' as const, planks }, expectedStatus: 'judged' as const, expectedCorrect: true, expectedIssueCodes: [] },
        { caseId: `bridge-${target}-short`, canonicalQuestionId: task.canonicalQuestionId, response: { kind: 'bridge' as const, planks: [1] }, expectedStatus: 'judged' as const, expectedCorrect: false, expectedIssueCodes: ['sum-under'] },
      ];
    }),
    ...merchants.flatMap(task => {
      const { multiplier, pears } = task.descriptor.parameters;
      const count = Number(pears);
      const apples = Number(multiplier) * count;
      return [
        { caseId: `merchant-${multiplier}-${pears}-reachable`, canonicalQuestionId: task.canonicalQuestionId, response: { kind: 'merchant' as const, apples, pears: count }, expectedStatus: 'judged' as const, expectedCorrect: true, expectedIssueCodes: [] },
        { caseId: `merchant-${multiplier}-${pears}-wrong`, canonicalQuestionId: task.canonicalQuestionId, response: { kind: 'merchant' as const, apples: 1, pears: 0 }, expectedStatus: 'judged' as const, expectedCorrect: false, expectedIssueCodes: ['total-mismatch', 'relationship-mismatch'] },
      ];
    }),
    { caseId: 'bridge-anchor-empty', canonicalQuestionId: 'lif.math.bridge.r1.total-12', response: { kind: 'bridge', planks: [] }, expectedStatus: 'incomplete', expectedIssueCodes: [] },
    { caseId: 'bridge-anchor-seven', canonicalQuestionId: 'lif.math.bridge.r1.total-12', response: { kind: 'bridge', planks: [1, 1, 1, 1, 1, 1, 6] }, expectedStatus: 'invalid-response', expectedIssueCodes: [] },
    { caseId: 'merchant-anchor-blank', canonicalQuestionId: 'lif.math.merchant.r1.mult-2.pears-3', response: { kind: 'merchant', apples: null, pears: 3 }, expectedStatus: 'incomplete', expectedIssueCodes: [] },
    { caseId: 'merchant-anchor-over-limit', canonicalQuestionId: 'lif.math.merchant.r1.mult-2.pears-3', response: { kind: 'merchant', apples: 22, pears: 3 }, expectedStatus: 'invalid-response', expectedIssueCodes: [] },
  ],
};
