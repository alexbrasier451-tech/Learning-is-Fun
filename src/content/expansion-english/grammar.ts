import type { ActivityResponse, DifficultyBand, EvaluationResult, QuestActivityBinding, ResponseSpec, TaskDefinition, TaskFamilyManifest } from '../../learning/contracts';
import { canonicalQuestionId } from '../../learning/identity';

const sourceUrl = 'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study';
const evidenceRef = 'docs/content-review/expansion-grammar.md';
const earlier = 'Year 2 — Writing: vocabulary, grammar and punctuation; English Appendix 2, Year 2 — Sentence and Terminology for pupils; consolidated in Years 3–4';
const lower = 'Years 3–4 — Writing: vocabulary, grammar and punctuation; English Appendix 2, Years 3–4 — Sentence and Terminology for pupils';
const relative = 'Years 5–6 — Writing: vocabulary, grammar and punctuation: relative clauses; English Appendix 2, Year 5 — Sentence and Terminology for pupils';
type Row = {
  key: string; band: DifficultyBand; text: string; demand: string; section: string;
  explanation: string; hints: readonly [string, string]; worked: string;
  spec: ResponseSpec; answers: readonly ActivityResponse[];
};
const options = (pairs: readonly (readonly [string, string])[]) => pairs.map(([id, label]) => ({ id, label }));
function sorting(items: readonly (readonly [string, string, string])[], groups: readonly (readonly [string, string])[]) {
  return {
    spec: { kind: 'sorting', items: options(items.map(([id, label]) => [id, label])), groups: options(groups), requiredItemIds: items.map(([id]) => id) } as const,
    answers: [{ kind: 'sorting', groups: Object.fromEntries(items.map(([id, , group]) => [id, group])) }] as const,
  };
}
function choice(pairs: readonly (readonly [string, string])[], accepted: readonly string[]) {
  return {
    spec: { kind: 'choice', slots: [{ id: 'sentence', label: 'Choose a sentence or join', options: options(pairs) }], requiredSlotIds: ['sentence'] } as const,
    answers: accepted.map(id => ({ kind: 'choice', choices: { sentence: id } }) as const),
  };
}
function sequence(pairs: readonly (readonly [string, string])[], accepted: readonly (readonly string[])[]) {
  return {
    spec: { kind: 'sequence', tiles: options(pairs), cardinality: { min: pairs.length, max: pairs.length } } as const,
    answers: accepted.map(orderedIds => ({ kind: 'sequence', orderedIds }) as const),
  };
}

const classes: readonly Row[] = [
  {
    key: 'otter-actions', band: 'support', text: 'Otters splash beside rocks.', section: earlier,
    demand: 'Introductory noun/verb consolidation: distinguish the named animals and objects from the action in one short clause.',
    ...sorting([['otters', 'Otters', 'noun'], ['splash', 'splash', 'verb'], ['rocks', 'rocks', 'noun']], [['noun', 'Noun'], ['verb', 'Verb']]),
    explanation: 'Otters names the animals and rocks names objects, so both are nouns here. Splash is the verb saying what the otters do.',
    hints: ['Read the whole sentence before moving a word.', 'Ask whether each selected word names something or tells what happens.'],
    worked: 'In this sentence, put Otters and rocks in Noun. Put splash in Verb: the otters are doing the splashing.',
  },
  {
    key: 'meadow-description', band: 'support', text: 'A narrow path crosses a quiet meadow.', section: earlier,
    demand: 'Earlier expanded-noun-phrase consolidation: separate two nouns from their adjacent descriptive adjectives.',
    ...sorting([['narrow', 'narrow', 'adjective'], ['path', 'path', 'noun'], ['quiet', 'quiet', 'adjective'], ['meadow', 'meadow', 'noun']], [['noun', 'Noun'], ['adjective', 'Adjective']]),
    explanation: 'Path and meadow are the nouns being described. Narrow describes the path and quiet describes the meadow, so those two words are adjectives here.',
    hints: ['Look at each description together with the word beside it.', 'Which selected words name things, and which tell you what those things are like?'],
    worked: 'Put path and meadow in Noun. Put narrow and quiet in Adjective: each adds a description to its following noun.',
  },
  {
    key: 'careful-movements', band: 'support', text: 'Mira carefully opens the box and gently lifts the lid.', section: earlier,
    demand: 'Earlier verb/adverb consolidation: identify two actions and the clearly marked manner adverbs modifying them.',
    ...sorting([['carefully', 'carefully', 'adverb'], ['opens', 'opens', 'verb'], ['gently', 'gently', 'adverb'], ['lifts', 'lifts', 'verb']], [['verb', 'Verb'], ['adverb', 'Adverb']]),
    explanation: 'Opens and lifts are verbs. Carefully tells how Mira opens, and gently tells how she lifts, so both are adverbs here.',
    hints: ['Consider each action and the way it is done.', 'Try saying the sentence without a selected word: does an action disappear, or just information about how it happens?'],
    worked: 'Put opens and lifts in Verb. Put carefully and gently in Adverb because they modify those actions.',
  },
  {
    key: 'lantern-reference', band: 'core', text: 'These lanterns belong to us. They light the path.', section: lower,
    demand: 'Year 4 determiner/pronoun distinction across two linked sentences: distinguish noun specification from reference without a following noun.',
    ...sorting([['these', 'These', 'determiner'], ['us', 'us', 'pronoun'], ['they', 'They', 'pronoun'], ['the', 'the', 'determiner']], [['determiner', 'Determiner'], ['pronoun', 'Pronoun']]),
    explanation: 'These specifies lanterns and the specifies path, so both are determiners. Us refers to the owners; They refers back to the lanterns. Those are pronouns here.',
    hints: ['Track what each selected word refers to across both sentences.', 'Check whether the word specifies a following noun or refers to someone or something without that noun.'],
    worked: 'These and the accompany nouns, so put them in Determiner. Us and They make their own references, so put them in Pronoun.',
  },
  {
    key: 'oak-relations', band: 'core', text: 'We rested under the oak because rain fell beyond the wall.', section: lower,
    demand: 'Year 3–4 consolidation of place and cause: distinguish prepositions introducing noun phrases from a conjunction introducing a causal clause.',
    ...sorting([['under', 'under', 'preposition'], ['because', 'because', 'conjunction'], ['beyond', 'beyond', 'preposition']], [['preposition', 'Preposition'], ['conjunction', 'Conjunction']]),
    explanation: 'Under introduces the oak and beyond introduces the wall: these prepositions express place. Because introduces rain fell beyond the wall, a clause giving the reason for resting.',
    hints: ['Look at the words that follow each selected word.', 'A phrase locating something works differently from a join that introduces a clause with its own verb.'],
    worked: 'Put under and beyond in Preposition. Put because in Conjunction: it links the resting clause to the clause explaining its cause.',
  },
  {
    key: 'watch-clause', band: 'core', text: 'The watch stopped while we watched the river.', section: lower,
    demand: 'Year 3–4 multi-clause context: use syntax rather than the familiar word family to identify nouns, verbs and the temporal conjunction.',
    ...sorting([['watch', 'watch', 'noun'], ['stopped', 'stopped', 'verb'], ['while', 'while', 'conjunction'], ['watched', 'watched', 'verb'], ['river', 'river', 'noun']], [['noun', 'Noun'], ['verb', 'Verb'], ['conjunction', 'Conjunction']]),
    explanation: 'Watch names a timepiece and river names what we watched: both are nouns. Stopped and watched are verbs in different clauses. While joins those clauses in time.',
    hints: ['Find the two things happening in the sentence.', 'Do not give words in the same family a class just because they look alike; examine each word’s job here.'],
    worked: 'Put watch and river in Noun, stopped and watched in Verb, and while in Conjunction. The timepiece stops while the people watch.',
  },
  {
    key: 'sweet-soup', band: 'core', text: 'The soup smells sweet, but the baker speaks softly.', section: lower,
    demand: 'Earlier terminology consolidated in a Year 3–4 clause contrast: distinguish a predicative adjective after a linking verb from a manner adverb, alongside noun and verb roles.',
    ...sorting([['sweet', 'sweet', 'adjective'], ['smells', 'smells', 'verb'], ['baker', 'baker', 'noun'], ['softly', 'softly', 'adverb']], [['noun', 'Noun'], ['verb', 'Verb'], ['adjective', 'Adjective'], ['adverb', 'Adverb']]),
    explanation: 'Sweet describes the soup, even though it follows smells; it is an adjective. Smells is a verb and baker a noun. Softly modifies speaks, so it is an adverb.',
    hints: ['An adjective does not always stand immediately before a noun.', 'Ask what is being described: a thing, or the way an action happens?'],
    worked: 'Put sweet in Adjective, smells in Verb, baker in Noun and softly in Adverb. The soup has a sweet smell; the speech happens softly.',
  },
  {
    key: 'hard-roles', band: 'stretch', text: 'The hard seed fell hard onto stone.', section: lower,
    demand: 'Additional contextual reasoning beyond the core: identical spelling carries adjective and adverb roles, and the adverb lacks -ly. This is extended consolidation, not a new Year 5 statutory objective.',
    ...sorting([['hard-seed', 'hard (before seed)', 'adjective'], ['seed', 'seed', 'noun'], ['fell', 'fell', 'verb'], ['hard-fall', 'hard (after fell)', 'adverb']], [['noun', 'Noun'], ['verb', 'Verb'], ['adjective', 'Adjective'], ['adverb', 'Adverb']]),
    explanation: 'The first hard describes the seed’s firmness: adjective. The second hard modifies fell, describing the force of the fall: adverb. Seed is a noun and fell is a verb.',
    hints: ['Keep the two occurrences separate; the same spelling can do different jobs.', 'Decide what each occurrence modifies rather than relying on its ending.'],
    worked: 'Put hard before seed in Adjective, seed in Noun, fell in Verb and hard after fell in Adverb. The two hard cards must stay distinguishable.',
  },
  {
    key: 'before-roles', band: 'stretch', text: 'Before dawn, we packed. We left before the sun rose.', section: lower,
    demand: 'Additional contextual reasoning: distinguish the same time word with a noun complement and with a finite clause; then identify the embedded noun and verb. Extended Years 3–4 consolidation.',
    ...sorting([['before-dawn', 'Before (first sentence)', 'preposition'], ['dawn', 'dawn', 'noun'], ['before-sun', 'before (second sentence)', 'conjunction'], ['rose', 'rose', 'verb']], [['noun', 'Noun'], ['verb', 'Verb'], ['preposition', 'Preposition'], ['conjunction', 'Conjunction']]),
    explanation: 'Before dawn is a preposition phrase: dawn is a noun. Before the sun rose introduces a clause, so that before is a conjunction in the DfE terminology. Rose is its past-tense verb, not a flower here.',
    hints: ['Compare what follows the two occurrences of before.', 'A complete clause contains a verb; a noun alone does not form that clause.'],
    worked: 'Put first-sentence Before in Preposition and dawn in Noun. Put second-sentence before in Conjunction and rose in Verb.',
  },
  {
    key: 'that-roles', band: 'stretch', text: 'That key opens the chest that holds the maps.', section: relative,
    demand: 'Selected Year 5 relative-pronoun demand combined with Year 4 determiner consolidation: distinguish identical that forms by their roles, including the relative clause’s subject.',
    ...sorting([['that-key', 'That (before key)', 'determiner'], ['opens', 'opens', 'verb'], ['that-chest', 'that (after chest)', 'pronoun'], ['holds', 'holds', 'verb']], [['determiner', 'Determiner'], ['pronoun', 'Pronoun (including relative pronouns)'], ['verb', 'Verb']]),
    explanation: 'The first That specifies key: determiner. The second that refers back to chest and begins the relative clause that holds the maps: relative pronoun. Opens and holds are verbs.',
    hints: ['Find which noun each occurrence of that is connected to.', 'One occurrence accompanies a noun; the other refers back to a noun while introducing more information about it.'],
    worked: 'Put That before key in Determiner, that after chest in Pronoun, and opens and holds in Verb. The chest is what holds the maps.',
  },
];

const clauses: readonly Row[] = [
  {
    key: 'add-two-actions', band: 'support', text: 'Tess rings a bell and Jo waves a flag, both as part of the welcome. Choose a sentence that simply adds the two actions without giving a reason or a condition.', section: 'Year 1 — Writing: vocabulary, grammar and punctuation: joining clauses using and; consolidated in Years 3–4',
    demand: 'Earlier coordination consolidation: choose a complete additive sentence from three explicit joins.',
    ...choice([['add', 'Tess rings a bell and Jo waves a flag.'], ['reason', 'Tess rings a bell because Jo waves a flag.'], ['condition', 'Tess rings a bell if Jo waves a flag.']], ['add']),
    explanation: 'And adds the two welcome actions. Because would claim a reason; if would make bell-ringing depend on flag-waving. Neither extra relation was requested.',
    hints: ['Check what relationship the sentence is meant to show.', 'A join can add information, give a reason or set a condition. Read each complete option.'],
    worked: 'Choose the sentence with and: Tess rings a bell and Jo waves a flag. It reports both actions without adding a cause or condition.',
  },
  {
    key: 'explain-dry-pots', band: 'support', text: 'A roof kept the pots dry during rain. Choose the sentence that gives the roof as the reason the pots stayed dry.', section: earlier,
    demand: 'Earlier because-subordination consolidation: preserve an explicitly supplied cause using complete sentence choices.',
    ...choice([['cause', 'The pots stayed dry because the roof covered them.'], ['despite', 'The pots stayed dry although the roof covered them.'], ['uncertain', 'The pots stayed dry if the roof covered them.']], ['cause']),
    explanation: 'Because gives the stated reason. Although presents the cover as a surprising obstacle, while if makes the cover conditional rather than reporting the given cause.',
    hints: ['Hold on to the explanation given in the scene.', 'Check whether an option states a reason, a contrast or a condition.'],
    worked: 'Choose The pots stayed dry because the roof covered them. The covering caused the dry result in this scene.',
  },
  {
    key: 'contrast-heavy-basket', band: 'support', text: 'The basket was heavy, yet Arun lifted it easily. Choose a sentence that makes this surprising contrast clear.', section: earlier,
    demand: 'Earlier but-coordination consolidation: distinguish explicit contrast from cause and alternative.',
    ...choice([['contrast', 'The basket was heavy but Arun lifted it easily.'], ['cause', 'The basket was heavy because Arun lifted it easily.'], ['alternative', 'The basket was heavy or Arun lifted it easily.']], ['contrast']),
    explanation: 'But contrasts the basket’s weight with the easy lift. Because invents a cause of the weight, and or offers alternatives instead of reporting both facts in contrast.',
    hints: ['Both facts happened; neither is just a possible alternative.', 'Think about why the second fact is surprising beside the first.'],
    worked: 'Choose The basket was heavy but Arun lifted it easily. But preserves both facts and signals their contrast.',
  },
  {
    key: 'flooded-path-cause', band: 'core', text: 'Rain flooded the path, which caused us to wait inside. Join the tiles to express that reason for waiting.', section: lower,
    demand: 'Years 3–4 causal clause construction: position a subordinate clause before or after the main clause without reversing the cause.',
    ...sequence([['flood', 'rain flooded the path'], ['because', 'because'], ['wait', 'we waited inside']], [['wait', 'because', 'flood'], ['because', 'flood', 'wait']]),
    explanation: 'We waited inside because rain flooded the path and Because rain flooded the path, we waited inside express the same cause. Making the waiting the reason for the flood reverses the intended meaning.',
    hints: ['Find the event that caused the other event.', 'A reason clause can come before or after the main clause; its join must stay with the reason.'],
    worked: 'One order is wait → because → flood. Another is because → flood → wait: Because rain flooded the path, we waited inside. Both keep the flood as the reason.',
  },
  {
    key: 'pack-before-leave', band: 'core', text: 'We packed the tent first and left the field later. Join the tiles to keep that order of events.', section: lower,
    demand: 'Years 3–4 temporal subordination: distinguish narrative tile order from event order, accepting a fronted before-clause.',
    ...sequence([['leave', 'we left the field'], ['before', 'before'], ['pack', 'we packed the tent']], [['pack', 'before', 'leave'], ['before', 'leave', 'pack']]),
    explanation: 'We packed the tent before we left the field and Before we left the field, we packed the tent both put packing first in time. Putting the before-clause around packing instead reverses the events.',
    hints: ['Work out which event happened first in time.', 'The first tile need not describe the first event; read what before does to the whole sentence.'],
    worked: 'Use pack → before → leave, or before → leave → pack. In both, packing happens before leaving.',
  },
  {
    key: 'concede-wind', band: 'core', text: 'The wind was strong, yet the kite stayed steady. Complete the sentence to express that surprising contrast: ___ the wind was strong, the kite stayed steady.', section: lower,
    demand: 'Years 3–4 wider conjunction range: recognise two equivalent concessive joins and distinguish reason or condition.',
    ...choice([['although', 'Although'], ['even-though', 'Even though'], ['because', 'Because'], ['if', 'If']], ['although', 'even-though']),
    explanation: 'Although and Even though both mark the surprising contrast. Because states a cause and If states a condition; those do not explicitly express the requested contrast.',
    hints: ['Read both facts together, including the surprising part.', 'More than one available join may express the same relationship.'],
    worked: 'Although the wind was strong, the kite stayed steady works. Even though the wind was strong, the kite stayed steady works equally well.',
  },
  {
    key: 'condition-pass', band: 'core', text: 'Having a pass is the condition for permission to enter. Complete the rule with a condition: You may enter ___ you have a pass.', section: lower,
    demand: 'Years 3–4 clause meaning: recognise equivalent conditional expressions while excluding causal and concessive claims.',
    ...choice([['if', 'if'], ['provided', 'provided that'], ['because', 'because'], ['although', 'although']], ['if', 'provided']),
    explanation: 'If and provided that both express the permission condition. Because presumes a reason and although signals contrast; neither states the requested conditional rule.',
    hints: ['The sentence is a rule about permission, not a report about someone who already entered.', 'Try each join and check whether permission depends on the stated requirement.'],
    worked: 'You may enter if you have a pass and You may enter provided that you have a pass both express the condition.',
  },
  {
    key: 'relative-gardeners', band: 'stretch', text: 'Only the gardeners carrying passes may enter; some gardeners have no pass. Choose a sentence whose relative clause identifies the permitted group.', section: relative,
    demand: 'Selected Year 5 relative-clause demand: distinguish restrictive identification from extra information about all gardeners; who and that are legitimate alternatives.',
    ...choice([['who', 'Only the gardeners who carry passes may enter.'], ['that', 'Only the gardeners that carry passes may enter.'], ['all', 'Only the gardeners, who carry passes, may enter.'], ['without', 'Only the gardeners who have no passes may enter.']], ['who', 'that']),
    explanation: 'Who carry passes and that carry passes without surrounding commas identify the permitted gardeners. The comma version treats carrying passes as extra information about the gardeners as a whole; the last option permits the wrong group.',
    hints: ['Decide whether the added clause identifies a smaller group or supplies extra information about everyone named.', 'Read each whole sentence, including its supplied punctuation; no punctuation needs to be typed.'],
    worked: 'Choose either the who sentence or the that sentence without commas around the relative clause. Both restrict permission to gardeners carrying passes.',
  },
  {
    key: 'sheltered-nest-relations', band: 'stretch', text: 'Wind bent the reeds, yet a roof kept the nest dry. Complete both joins to show the contrast with the wind and the reason for the dry nest: ___ wind bent the reeds, the nest stayed dry ___ the roof sheltered it.', section: lower,
    demand: 'Additional clause reasoning beyond the core: coordinate two different subordinate relations in one sentence, preserving both concessive scope and causal direction. Extended Years 3–4 demand, not a claimed Year 5 list item.',
    spec: { kind: 'choice', slots: [
      { id: 'contrast', label: 'First join', options: options([['although', 'Although'], ['because', 'Because']]) },
      { id: 'reason', label: 'Second join', options: options([['because', 'because'], ['although', 'although']]) },
    ], requiredSlotIds: ['contrast', 'reason'] },
    answers: [{ kind: 'choice', choices: { contrast: 'although', reason: 'because' } }],
    explanation: 'Although links the wind to the surprising dry result. Because links the shelter to its effect. Replacing either join changes one of those two requested relationships even if the resulting sentence is grammatical.',
    hints: ['Check each relationship separately, then read the complete sentence.', 'One join must connect an obstacle with a surprising result; the other must explain that result.'],
    worked: 'Although wind bent the reeds, the nest stayed dry because the roof sheltered it. The first join gives the contrast and the second supplies the cause.',
  },
  {
    key: 'relative-repaired-rope', band: 'stretch', text: 'Inez repaired a rope, and that rope now holds the sail. Choose a sentence whose relative clause keeps Inez as the person who did the repair.', section: relative,
    demand: 'Selected Year 5 relative clauses with an omitted relative pronoun: recover who acts on what across an embedded clause and accept both explicit relative pronouns and omission.',
    ...choice([['that', 'The rope that Inez repaired holds the sail.'], ['omitted', 'The rope Inez repaired holds the sail.'], ['which', 'The rope which Inez repaired holds the sail.'], ['reversed', 'The rope that repaired Inez holds the sail.']], ['that', 'omitted', 'which']),
    explanation: 'That Inez repaired, which Inez repaired and Inez repaired all modify rope while keeping Inez as the repairer. The last option makes the rope do the repairing and changes the given meaning.',
    hints: ['Track the repairer and the thing repaired inside the added clause.', 'A relative pronoun can sometimes be omitted without losing the clause’s meaning.'],
    worked: 'The that, omitted and which options are all correct. In each, Inez repaired the rope; the rope did not repair Inez.',
  },
];

function build(row: Row, skillId: 'E04' | 'E05'): TaskDefinition {
  const descriptor = { familyId: `english.expansion.${skillId.toLowerCase()}`, equivalenceVersion: 'r1', authoredKey: row.key, parameters: {} } as const;
  const instructionText = row.spec.kind === 'sorting'
    ? 'Read the sentence or sentences. Sort each selected word by its job there, using every card once. Then choose Check.'
    : row.spec.kind === 'sequence'
      ? 'Read the required meaning. Arrange every tile once into one sentence. Capital letters and punctuation are not assessed by these tiles. Then choose Check.'
      : 'Read the required meaning and every option. Choose one option for each space; any option that fully meets the required meaning is accepted. Then choose Check.';
  return {
    canonicalQuestionId: canonicalQuestionId(descriptor), descriptor, contentRevision: '1', skillId,
    objectiveId: skillId === 'E04' ? 'E04-word-classes' : 'E05-clauses-conjunctions', band: row.band, contextualSkillIds: [],
    curriculum: { sourceUrl, section: row.section, programmeBand: row.section === relative ? 'Years 5–6 (selected Year 5 relative clauses)' : row.band === 'support' ? 'Earlier grammar consolidated in Years 3–4' : 'Years 3–4' },
    demandRationale: row.demand, instructionText, assessedText: row.text, stimulus: null,
    responseSpec: row.spec, answerRule: { kind: 'accepted-responses', responses: row.answers }, explanation: row.explanation,
    hints: [{ id: `${row.key}-hint-1`, text: row.hints[0] }, { id: `${row.key}-hint-2`, text: row.hints[1] }],
    workedSupport: { id: `${row.key}-worked`, text: row.worked },
    narration: { neutralText: instructionText, assessedTextMayBeSpokenBeforeCheck: true },
    review: { status: 'approved', reviewer: 'Codex WP03-10A author: contextual grammar and finite answer-space review, 11 October 2026',
      rationale: 'Original authored task checked against separately recorded contextual classifications and complete control matrices. Author review only; no qualified educator or efficacy claim. Independent lane review remains downstream.', evidenceRef },
  };
}
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
export const GRAMMAR_TASKS: readonly TaskDefinition[] = freeze([...classes.map(row => build(row, 'E04')), ...clauses.map(row => build(row, 'E05'))]);
const task = (key: string) => GRAMMAR_TASKS.find(row => row.descriptor.authoredKey === key)!;
export const GRAMMAR_MANIFEST: TaskFamilyManifest = freeze<TaskFamilyManifest>({
  moduleId: 'expansion-grammar', familyIds: ['english.expansion.e04', 'english.expansion.e05'],
  taskIds: GRAMMAR_TASKS.map(row => row.canonicalQuestionId), retainedTaskIds: [],
  domainDescription: 'Twenty original finite E04/E05 tasks: each skill has 3 support, 4 core and 3 stretch; contextual item maps, complete tile permutations and reviewed choice combinations. No starter identity is replaced.',
  reviewEvidenceRef: evidenceRef,
  cases: [
    { caseId: 'grammar-q6-support-sort', canonicalQuestionId: task('otter-actions').canonicalQuestionId, response: { kind: 'sorting', groups: { otters: 'noun', splash: 'verb', rocks: 'noun' } }, expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
    { caseId: 'grammar-q6-partial', canonicalQuestionId: task('otter-actions').canonicalQuestionId, response: { kind: 'sorting', groups: { otters: 'noun' } }, expectedStatus: 'incomplete', expectedIssueCodes: [] },
    { caseId: 'grammar-q7-fronted-cause', canonicalQuestionId: task('flooded-path-cause').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['because', 'flood', 'wait'] }, expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
    { caseId: 'grammar-q7-reversed-cause', canonicalQuestionId: task('flooded-path-cause').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['flood', 'because', 'wait'] }, expectedStatus: 'judged', expectedCorrect: false, expectedIssueCodes: ['grammar-meaning-mismatch'] },
    { caseId: 'grammar-q7-duplicate', canonicalQuestionId: task('flooded-path-cause').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['wait', 'wait'] }, expectedStatus: 'invalid-response', expectedIssueCodes: [] },
    { caseId: 'grammar-q10-support-choice', canonicalQuestionId: task('explain-dry-pots').canonicalQuestionId, response: { kind: 'choice', choices: { sentence: 'cause' } }, expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
    { caseId: 'grammar-q10-relative-alternative', canonicalQuestionId: task('relative-repaired-rope').canonicalQuestionId, response: { kind: 'choice', choices: { sentence: 'omitted' } }, expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
  ],
});

const sortPool = ['otter-actions', 'meadow-description', 'careful-movements', 'lantern-reference', 'oak-relations', 'watch-clause', 'sweet-soup', 'hard-roles', 'before-roles', 'that-roles'].map(key => task(key).canonicalQuestionId);
const choicePool = ['add-two-actions', 'explain-dry-pots', 'contrast-heavy-basket', 'concede-wind', 'condition-pass', 'relative-gardeners', 'sheltered-nest-relations', 'relative-repaired-rope'].map(key => task(key).canonicalQuestionId);
const sequencePool = ['flooded-path-cause', 'pack-before-leave'].map(key => task(key).canonicalQuestionId);
/** Proposals only. WP03-13A owns insertion into QUEST_ACTIVITY_BINDINGS. */
export const GRAMMAR_BINDING_PROPOSALS: readonly QuestActivityBinding[] = freeze([
  { bindingId: 'q6-story-e04-sort', questId: 'Q6', availability: 'M2', role: 'story', skillId: 'E04', taskIds: sortPool, mechanic: 'sorting', responseKind: 'sorting', sourceBindingId: null },
  { bindingId: 'q10-story-e05-meaning', questId: 'Q10', availability: 'M2', role: 'story', skillId: 'E05', taskIds: choicePool, mechanic: 'consequential-selection', responseKind: 'choice', sourceBindingId: null },
  { bindingId: 'q6-revisit-e04-sorting', questId: 'Q6', availability: 'M2', role: 'revisit', skillId: 'E04', taskIds: sortPool, mechanic: 'sorting', responseKind: 'sorting', sourceBindingId: null },
  { bindingId: 'q7-revisit-e05-sequence', questId: 'Q7', availability: 'M2', role: 'revisit', skillId: 'E05', taskIds: sequencePool, mechanic: 'sequencing', responseKind: 'sequence', sourceBindingId: null },
  { bindingId: 'q7-revisit-e05-choice', questId: 'Q7', availability: 'M2', role: 'revisit', skillId: 'E05', taskIds: choicePool, mechanic: 'consequential-selection', responseKind: 'choice', sourceBindingId: null },
  { bindingId: 'q10-revisit-e05-choice', questId: 'Q10', availability: 'M2', role: 'revisit', skillId: 'E05', taskIds: choicePool, mechanic: 'consequential-selection', responseKind: 'choice', sourceBindingId: null },
]);
type HandoffCase = Readonly<{
  caseId: string; bindingId: string; canonicalQuestionId: string; response: ActivityResponse;
  expectedStatus: EvaluationResult['status']; expectedCorrect: boolean | null;
  expectedEvidenceMode: 'independent' | 'listening-supported' | 'mixed'; consumer: 'WP02-10A' | 'WP04-07A' | 'WP06';
}>;
export const GRAMMAR_HANDOFF_CASES: readonly HandoffCase[] = freeze<readonly HandoffCase[]>([
  { caseId: 'grammar-neutral-sort', bindingId: 'q6-story-e04-sort', canonicalQuestionId: task('otter-actions').canonicalQuestionId, response: { kind: 'sorting', groups: { otters: 'noun', splash: 'verb', rocks: 'noun' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP02-10A' },
  { caseId: 'grammar-listened-choice', bindingId: 'q10-story-e05-meaning', canonicalQuestionId: task('explain-dry-pots').canonicalQuestionId, response: { kind: 'choice', choices: { sentence: 'cause' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'listening-supported', consumer: 'WP04-07A' },
  { caseId: 'grammar-hinted-sort', bindingId: 'q6-story-e04-sort', canonicalQuestionId: task('hard-roles').canonicalQuestionId, response: { kind: 'sorting', groups: { 'hard-seed': 'adjective', seed: 'noun', fell: 'verb', 'hard-fall': 'adverb' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP04-07A' },
  { caseId: 'grammar-worked-sequence', bindingId: 'q7-revisit-e05-sequence', canonicalQuestionId: task('flooded-path-cause').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['because', 'flood', 'wait'] }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP04-07A' },
  { caseId: 'grammar-retry-wrong', bindingId: 'q7-revisit-e05-sequence', canonicalQuestionId: task('pack-before-leave').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['leave', 'before', 'pack'] }, expectedStatus: 'judged', expectedCorrect: false, expectedEvidenceMode: 'independent', consumer: 'WP02-10A' },
  { caseId: 'grammar-retry-correct', bindingId: 'q7-revisit-e05-sequence', canonicalQuestionId: task('pack-before-leave').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['before', 'leave', 'pack'] }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP02-10A' },
  { caseId: 'grammar-familiar-relative', bindingId: 'q10-revisit-e05-choice', canonicalQuestionId: task('relative-repaired-rope').canonicalQuestionId, response: { kind: 'choice', choices: { sentence: 'omitted' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP06' },
]);
