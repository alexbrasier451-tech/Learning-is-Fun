import type { ActivityResponse, CurriculumReference, DifficultyBand, QuestActivityBinding, ResponseSpec, TaskDefinition, TaskFamilyManifest } from '../../learning/contracts';
import { canonicalQuestionId } from '../../learning/identity';
import { STARTER_PUNCTUATION_MANIFEST } from '../starter-english';

const sourceUrl = 'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study';
const sources: Readonly<Record<string, CurriculumReference>> = {
  list: { sourceUrl, programmeBand: 'Year 2 consolidation in Years 3–4', section: 'Year 2 Writing — vocabulary, grammar and punctuation; English Appendix 2, Year 2: commas in lists' },
  apostrophe: { sourceUrl, programmeBand: 'Year 2 consolidation in Years 3–4', section: 'Year 2 Writing — vocabulary, grammar and punctuation; English Appendix 2, Year 2: apostrophes for omissions and singular possession' },
  fronted: { sourceUrl, programmeBand: 'Years 3–4; Appendix 2 Year 4', section: 'Writing — vocabulary, grammar and punctuation: commas after fronted adverbials; English Appendix 2, Year 4' },
  plural: { sourceUrl, programmeBand: 'Years 3–4; Appendix 2 Year 4', section: 'Writing — vocabulary, grammar and punctuation: possessive apostrophe with plural nouns; English Appendix 2, Year 4' },
  pronoun: { sourceUrl, programmeBand: 'Years 3–4 consolidation of Year 2 apostrophes', section: 'Writing — vocabulary, grammar and punctuation; English Appendix 2, Year 2 apostrophes for omissions, consolidated in Years 3–4' },
  ambiguity: { sourceUrl, programmeBand: 'Years 5–6; Appendix 2 Year 5', section: 'Writing — vocabulary, grammar and punctuation: commas to clarify meaning or avoid ambiguity; English Appendix 2, Year 5' },
  parenthesis: { sourceUrl, programmeBand: 'Years 5–6; Appendix 2 Year 5', section: 'Writing — vocabulary, grammar and punctuation: brackets, dashes or commas for parenthesis; English Appendix 2, Year 5' },
  editing: { sourceUrl, programmeBand: 'Years 3–4 with additional combined editing demand', section: 'Writing — composition: proofreading punctuation; vocabulary, grammar and punctuation: plural possessive apostrophes and commas after fronted adverbials' },
  speechIntro: { sourceUrl, programmeBand: 'Years 3–4; Appendix 2 Year 3 introduction', section: 'Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 3 introduction to inverted commas' },
  speech: { sourceUrl, programmeBand: 'Years 3–4; Appendix 2 Year 4', section: 'Writing — vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 inverted commas and other punctuation, including reporting-clause comma and end punctuation inside inverted commas' },
  speechEdit: { sourceUrl, programmeBand: 'Years 3–4 with less-direct editing demand', section: 'Writing — composition: proofreading punctuation; vocabulary, grammar and punctuation: direct speech; English Appendix 2, Year 4 (authored extension of convention, not a new statutory year claim)' },
};
const neutral = 'Read the context and the text. Choose an option for each space or choose a complete version. You can change your choices. When you are ready, choose Check.';
const slots = (...items: readonly (readonly [string, string, readonly string[]])[]): ResponseSpec => ({
  kind: 'punctuation', slots: items.map(([id, label, marks]) => ({ id, label, options: marks.map(mark => ({ id: mark, label: mark })) })),
  requiredSlotIds: items.map(([id]) => id),
});
type OptionNumber = 1 | 2 | 3 | 4;
// IDs belong to the authored versions, not their displayed positions. Each task
// supplies its deterministic presentation order; no runtime shuffle is needed.
const choices = (order: readonly [OptionNumber, OptionNumber, OptionNumber, OptionNumber], ...labels: readonly string[]): ResponseSpec => {
  const versions = labels.map((label, i) => ({ id: `v${i + 1}`, label }));
  return { kind: 'choice', slots: [{ id: 'version', label: 'Choose the complete version',
    options: order.map(number => versions[number - 1]) }], requiredSlotIds: ['version'] };
};
type Authored = Readonly<{ key: string; skill: 'E06' | 'E07'; band: DifficultyBand; source: string;
  demand: string; text: string; spec: ResponseSpec; answers: readonly Readonly<Record<string, string>>[];
  explanation: string; hints: readonly [string, string]; worked: string }>;
const items: readonly Authored[] = [
  {
    key: 'list-separator', skill: 'E06', band: 'support', source: 'list',
    demand: 'One explicit boundary between simple items in a list; earlier consolidation with the final conjunction fixed.',
    text: 'Complete this calm, one-sentence packing instruction naming three separate foods:\nPack bread ___ cheese and apples.',
    spec: slots(['list', 'Between bread and cheese', [',', '.', '?']]), answers: [{ list: ',' }],
    explanation: 'The comma separates bread from cheese in this list. A full stop or question mark ends the line before the list is finished and leaves cheese and apples as a fragment, rather than keeping the required instruction together.',
    hints: ['Count the separate things being packed.', 'Notice how the last two items are already joined.'],
    worked: 'Pack bread, cheese and apples. The comma separates the first two items; and joins the last two. All three foods remain in one complete instruction.',
  },
  {
    key: 'contract-is-not', skill: 'E06', band: 'support', source: 'apostrophe',
    demand: 'Insert one omission mark in an explicitly given contraction; straight and curly typography have equal meaning.',
    text: 'Shorten is not without changing its meaning; straight or curly apostrophes are both allowed:\nIt isn___t cold.',
    spec: slots(['omission', 'Between isn and t', ["'", '’', ',']]), answers: [{ omission: "'" }, { omission: '’' }],
    explanation: 'An apostrophe marks the omitted o in not. Straight and curly apostrophes are equally correct here. A comma does not mark a contraction.',
    hints: ['Compare the shortened word with the two original words.', 'Check which letter disappears when the words join.'],
    worked: 'It isn’t cold. Is not becomes isn’t: the o is omitted. It isn\'t cold. uses the equally accepted straight apostrophe.',
  },
  {
    key: 'one-fox-owner', skill: 'E06', band: 'support', source: 'apostrophe',
    demand: 'Select singular ownership with an explicit one-owner cue; distinguish possession from plural and omission.',
    text: 'One fox owns this den; choose the sentence that shows ownership, using the printed straight apostrophe style:',
    spec: choices([3, 1, 4, 2], "The fox's den is warm.", "The foxs' den is warm.", 'The foxes den is warm.', 'The foxs den is warm.'),
    answers: [{ version: 'v1' }],
    explanation: 'Fox’s places the apostrophe before s for one fox’s possession. Foxs is not the plural foxes; neither foxs’ nor an unmarked foxes/foxs expresses the specified singular ownership.',
    hints: ['Identify the owner before looking at the den.', 'Keep the stated number of owners in mind when comparing versions.'],
    worked: "The fox's den is warm. One fox is the owner, so fox takes apostrophe plus s. The other choices do not mark ownership by that one fox.",
  },
  {
    key: 'fronted-time', skill: 'E06', band: 'core', source: 'fronted',
    demand: 'Locate the boundary between a multiword fronted time adverbial and its main clause.',
    text: 'Follow this page’s convention of separating the opening time phrase from the main clause:\nBefore the sun rose ___ the team packed its bags.',
    spec: slots(['time', 'After Before the sun rose', [',', ';', ':']]), answers: [{ time: ',' }],
    explanation: 'A comma separates this fronted time adverbial from the main clause. The opening dependent phrase is not an independent clause for a semicolon or a complete introduction for a colon.',
    hints: ['Find the part that tells when the packing happened.', 'Look for the boundary where the main action begins.'],
    worked: 'Before the sun rose, the team packed its bags. The opening time phrase comes before the main clause and is separated by a comma.',
  },
  {
    key: 'regular-plural-owners', skill: 'E06', band: 'core', source: 'plural',
    demand: 'Place a possessive apostrophe with a regular plural ending in s; contrast singular owner and unmarked plural.',
    text: 'Several gardeners share these tools; choose the version that marks their ownership in the printed straight apostrophe style:',
    spec: choices([2, 4, 1, 3], "The gardeners' tools are clean.", "The gardener's tools are clean.", 'The gardeners tools are clean.', "The gardener's' tools are clean."),
    answers: [{ version: 'v1' }],
    explanation: 'Gardeners is already a plural ending in s, so its possessive apostrophe follows that s. Gardener’s means one owner; no apostrophe omits the assessed possession mark; two apostrophes do not form this possessive.',
    hints: ['Work out whether the owner word is singular or plural.', 'Keep the plural spelling intact while comparing the ownership forms.'],
    worked: "The gardeners' tools are clean. Several gardeners own the tools; put the possessive apostrophe after the plural gardeners.",
  },
  {
    key: 'irregular-plural-owners', skill: 'E06', band: 'core', source: 'plural',
    demand: 'Apply possession to an irregular plural that does not end in s, rather than copying the regular-plural placement.',
    text: 'These boots belong to several children; choose the version showing that ownership with the printed straight apostrophe style:',
    spec: choices([1, 3, 2, 4], "The children's boots are muddy.", "The childrens' boots are muddy.", "The child's boots are muddy.", 'The children boots are muddy.'),
    answers: [{ version: 'v1' }],
    explanation: 'Children is already plural without a final s, so add apostrophe plus s. Child’s changes the owner count; childrens’ invents a plural childrens; children alone lacks the possession marking.',
    hints: ['Start with the correct word for more than one child.', 'Compare the ending of this plural with a plural such as gardeners.'],
    worked: "The children's boots are muddy. Children is the plural owner word and takes apostrophe plus s, unlike a regular plural that already ends in s.",
  },
  {
    key: 'its-and-it-is', skill: 'E06', band: 'core', source: 'pronoun',
    demand: 'Distinguish two functions of nearly identical forms in one edit: contraction and possessive determiner; not a new Year 4 statutory objective.',
    text: 'The first shortened form means it is; the second shows that the wing belongs to the bird; use straight apostrophes:',
    spec: choices([4, 2, 3, 1], "It's folding its wing.", "Its folding it's wing.", "It's folding it's wing.", 'Its folding its wing.'), answers: [{ version: 'v1' }],
    explanation: 'It’s means it is; possessive its has no apostrophe. Every other offered version confuses at least one of those roles. The added core demand is discriminating both uses together, beyond inserting a supplied contraction.',
    hints: ['Try expanding each similar-looking form in turn.', 'Decide whether each form describes ownership or stands for two words.'],
    worked: "It's folding its wing. Expanding the first form gives It is folding; the wing belongs to the bird, so the second form is possessive its.",
  },
  {
    key: 'address-not-food', skill: 'E06', band: 'stretch', source: 'ambiguity',
    demand: 'Use comma placement to preserve who is addressed and avoid a different literal meaning, not merely list separation.',
    text: 'Pip is being invited to eat, not offered as food; keep the invitation calm and choose the version that makes this meaning clear:',
    spec: choices([2, 1, 4, 3], "Let's eat, Pip.", "Let's eat Pip.", "Let's, eat Pip.", "Let's eat Pip, ."), answers: [{ version: 'v1' }],
    explanation: 'The comma before Pip separates the person being addressed. Without it Pip can be read as what to eat. The other placements do not separate the address and disrupt the sentence.',
    hints: ['Identify who receives the invitation.', 'Compare what each version might tell a reader to eat.'],
    worked: "Let's eat, Pip. Pip is the person addressed; separating that name makes the invitation clear without suggesting that Pip is food.",
  },
  {
    key: 'paired-parenthesis', skill: 'E06', band: 'stretch', source: 'parenthesis',
    demand: 'Coordinate two boundaries of removable information and accept three different valid paired conventions; single-slot local correctness is insufficient.',
    text: 'Mark a gift from Pip as extra information; use a matched pair of commas, dashes or round brackets, with spacing appropriate to the chosen pair:\nThe boat ___ a gift from Pip ___ is blue.',
    spec: slots(['open', 'Before a gift from Pip', [',', '—', '(', ')']], ['close', 'After a gift from Pip', [',', '—', '(', ')']]),
    answers: [{ open: ',', close: ',' }, { open: '—', close: '—' }, { open: '(', close: ')' }],
    explanation: 'Both commas, both dashes, or an opening bracket followed by a closing bracket enclose the extra information. Mixed, reversed or repeated opening/closing brackets do not form an accepted matched pair.',
    hints: ['Read the main sentence without the extra information.', 'Check the two boundaries together, rather than judging each in isolation.'],
    worked: 'The boat, a gift from Pip, is blue. Also accepted: The boat — a gift from Pip — is blue. Or: The boat (a gift from Pip) is blue. Each matching pair encloses the same extra information.',
  },
  {
    key: 'combined-proofread', skill: 'E06', band: 'stretch', source: 'editing',
    demand: 'Proofread two different features together with less scaffolding: a fronted time adverbial and irregular-plural possession; additional reasoning within Years 3–4, not a Year 5 claim.',
    text: 'Several children own the coats; follow the page’s convention of separating a fronted time phrase and mark ownership, using straight apostrophes:',
    spec: choices([4, 3, 1, 2], "After the rain stopped, the children's coats dried.", "After the rain stopped the children's coats dried.", "After the rain stopped, the childrens' coats dried.", "After the rain stopped the childrens' coats dried."),
    answers: [{ version: 'v1' }],
    explanation: "The version with a comma after stopped and the possessive children's marks both features. Omitting that comma leaves the fronted time phrase unseparated; childrens' uses the wrong possessive for the irregular plural children. A version can have one or both errors.",
    hints: ['Review the time information and the ownership information separately.', 'A version can repair one feature while leaving another unchanged.'],
    worked: "After the rain stopped, the children's coats dried. The comma closes the opening time phrase; children's shows that the coats belong to several children.",
  },
  {
    key: 'quote-boundaries', skill: 'E07', band: 'support', source: 'speechIntro',
    demand: 'Identify the two boundaries of explicitly given spoken words, with sentence punctuation already fixed; single/double straight quote styles both count.',
    text: 'These are the speaker’s exact words; enclose them using matching straight single or double quotation marks:\n___The door is open.___',
    spec: slots(['open', 'Before The', ['"', "'"]], ['close', 'After the full sentence', ['"', "'"]]),
    answers: [{ open: '"', close: '"' }, { open: "'", close: "'" }],
    explanation: 'Matching opening and closing quotation marks enclose all the spoken words and their full stop. Either offered quote style is valid; mixing single and double marks does not make a matching pair.',
    hints: ['Locate the first and last parts belonging to the speaker.', 'Compare the two boundaries as one enclosing pair.'],
    worked: '"The door is open." and \'The door is open.\' are equally accepted. Each version encloses the whole spoken sentence with one consistent quote style.',
  },
  {
    key: 'reporting-clause-link', skill: 'E07', band: 'support', source: 'speech',
    demand: 'Choose one connection after a supplied reporting clause; quotation boundaries and spoken sentence punctuation are fixed.',
    text: 'Join the reporting clause to the spoken statement in the book’s standard dialogue style:\nMira said ___ “The path is clear.”',
    spec: slots(['link', 'After Mira said', [',', '.', '?']]), answers: [{ link: ',' }],
    explanation: 'The comma links Mira said to the quoted words in this reporting-first construction. The offered full stop breaks the required connection and the question mark would turn the reporting clause into a question.',
    hints: ['Separate the narrator’s introduction from the speaker’s words.', 'Check whether the chosen version keeps the introduction attached to what was said.'],
    worked: 'Mira said, “The path is clear.” The comma follows the reporting clause; the spoken sentence’s full stop remains inside its quotation marks.',
  },
  {
    key: 'spoken-question-end', skill: 'E07', band: 'support', source: 'speech',
    demand: 'Choose a complete version retaining a genuine question inside its quotation, with the lower-case reporting clause already modelled.',
    text: 'Pip calmly asks a real question, expecting an answer; choose the version with correct question and reporting punctuation:',
    spec: choices([3, 4, 2, 1], '“Is the bridge safe?” asked Pip.', '“Is the bridge safe”? asked Pip.', '“Is the bridge safe,” asked Pip.', '“Is the bridge safe.” asked Pip.'), answers: [{ version: 'v1' }],
    explanation: 'The question mark belongs inside the quotation because Pip’s spoken words ask the question. The following asked Pip is a reporting clause, not a new sentence. A comma or full stop removes the assessed question ending.',
    hints: ['Identify whose words ask for an answer.', 'Look at the boundary between the spoken words and the narrator’s attribution.'],
    worked: '“Is the bridge safe?” asked Pip. The question mark completes Pip’s spoken question inside the quotation; the reporting clause follows with a lower-case a.',
  },
  {
    key: 'speech-before-report', skill: 'E07', band: 'core', source: 'speech',
    demand: 'Coordinate quote boundary and comma when the spoken statement comes before a reporting clause; accept both consistent quote styles.',
    text: 'Mira calmly states that departure is possible; use the standard speech-before-reporting convention, with either consistent curly quote style:',
    spec: choices([1, 3, 4, 2], '“We can leave,” said Mira.', '‘We can leave,’ said Mira.', '“We can leave”, said Mira.', '“We can leave.” said Mira.'), answers: [{ version: 'v1' }, { version: 'v2' }],
    explanation: 'The comma is inside the closing quote and connects the spoken statement to said Mira. Single and double curly quotation styles both work. Moving the comma outside or using a full stop before lower-case said breaks the assessed convention.',
    hints: ['Notice whether the narrator’s attribution comes before or after the speech.', 'Check the speech boundary and the connection to the attribution together.'],
    worked: '“We can leave,” said Mira. Also accepted: ‘We can leave,’ said Mira. Both put the connecting comma inside the closing quotation mark.',
  },
  {
    key: 'coordinate-report-first', skill: 'E07', band: 'core', source: 'speech',
    demand: 'Coordinate reporting-clause connection and two quote boundaries; all three editable features must work together.',
    text: 'The narrator introduces a calm statement; use the book’s reporting-first dialogue convention and matching straight single or double quotes:\nPip said ___ ___The lantern is ready.___',
    spec: slots(['link', 'After Pip said', [',', '.', '?']], ['open', 'Before The lantern', ['"', "'" ]], ['close', 'After ready and its full stop', ['"', "'" ]]),
    answers: [{ link: ',', open: '"', close: '"' }, { link: ',', open: "'", close: "'" }],
    explanation: 'A comma follows Pip said and the whole spoken statement is enclosed by matching quotes. Either offered quote style works. A different linking mark or mismatched quote pair fails the stated dialogue convention.',
    hints: ['Distinguish the narrator’s words from the speaker’s words.', 'Check the connection and the two enclosing boundaries as separate jobs.'],
    worked: 'Pip said, "The lantern is ready." and Pip said, \'The lantern is ready.\' are both accepted. Each has a comma after the reporting clause and matching quotes around the complete speech.',
  },
  {
    key: 'apostrophe-inside-speech', skill: 'E07', band: 'core', source: 'speech',
    demand: 'Distinguish an internal contraction apostrophe from the outer speech boundaries while retaining the speech-to-reporting comma; E06 is context, not a second award.',
    text: 'Pip says it is raining; retain the contraction and use either matching curly quotation style around the speech:',
    spec: choices([3, 2, 1, 4], '“It’s raining,” said Pip.', '‘It’s raining,’ said Pip.', '“Its raining,” said Pip.', '“It’s raining”, said Pip.'), answers: [{ version: 'v1' }, { version: 'v2' }],
    explanation: 'The apostrophe inside It’s represents it is; it is not an outer quotation boundary. Both complete consistent quote styles are accepted. “Its raining,” loses the contraction distinction; “It’s raining”, puts the speech-to-reporting comma outside the quote.',
    hints: ['Work out which marks belong inside a word and which enclose speech.', 'Compare the complete spoken unit with the narrator’s attribution.'],
    worked: '“It’s raining,” said Pip. Also accepted: ‘It’s raining,’ said Pip. The internal apostrophe stays in It’s and the connecting comma stays inside the outer closing quote.',
  },
  {
    key: 'question-and-reply', skill: 'E07', band: 'core', source: 'speech',
    demand: 'Edit two quoted turns together, distinguishing a spoken question from a statement reply before their reporting clauses.',
    text: 'Mira asks where the map is and Pip calmly answers; use double curly quotes and retain the standard punctuation for both turns:',
    spec: choices([2, 3, 1, 4], '“Where is the map?” asked Mira. “In my bag,” said Pip.', '“Where is the map,” asked Mira. “In my bag,” said Pip.', '“Where is the map?” asked Mira. “In my bag.” said Pip.', '“Where is the map”? asked Mira. “In my bag”, said Pip.'), answers: [{ version: 'v1' }],
    explanation: 'The question keeps its question mark inside the quote; the reply takes an internal connecting comma before said Pip. The other versions remove the question ending, break the reply’s reporting connection, or put both marks outside.',
    hints: ['Consider the purpose of each spoken turn.', 'A correct boundary in one turn does not guarantee that the other turn is correct.'],
    worked: '“Where is the map?” asked Mira. “In my bag,” said Pip. The first turn is a question; the second is a reply attached to its reporting clause.',
  },
  {
    key: 'interrupted-one-sentence', skill: 'E07', band: 'stretch', source: 'speechEdit',
    demand: 'Track one spoken sentence across an inserted reporting clause, coordinating continuation case and both comma boundaries; additional reasoning beyond uninterrupted dialogue.',
    text: 'Mira’s one spoken sentence is interrupted by the narrator; retain that single sentence and use either consistent curly quote style:',
    spec: choices([2, 4, 3, 1], '“When the bell rings,” said Mira, “we will leave.”', '‘When the bell rings,’ said Mira, ‘we will leave.’', '“When the bell rings,” said Mira, “We will leave.”', '“When the bell rings.” said Mira. “We will leave.”'), answers: [{ version: 'v1' }, { version: 'v2' }],
    explanation: 'The same spoken sentence continues after the reporting clause, so we remains lower-case; commas mark the interruption. Both quote styles work. A capital We breaks the stated continuation convention. “When the bell rings.” leaves a dependent fragment, and a full stop before lower-case said breaks the speech-to-report connection.',
    hints: ['Read just the spoken words, leaving out the narrator’s interruption.', 'Decide whether the resumed words continue the same sentence.'],
    worked: '“When the bell rings,” said Mira, “we will leave.” The speech alone is When the bell rings, we will leave. Matching single curly quotes are equally accepted.',
  },
  {
    key: 'two-spoken-sentences', skill: 'E07', band: 'stretch', source: 'speechEdit',
    demand: 'Distinguish a new spoken sentence after a reporting clause from a continuation, coordinating narrator full stop and resumed capital; contrast with the interrupted-sentence convention.',
    text: 'Mira gives two complete spoken statements with a reporting clause after the first; use either consistent curly quote style:',
    spec: choices([4, 1, 2, 3], '“The bridge is safe,” said Mira. “We can cross.”', '‘The bridge is safe,’ said Mira. ‘We can cross.’', '“The bridge is safe,” said Mira, “we can cross.”', '“The bridge is safe.” said Mira. “We can cross.”'), answers: [{ version: 'v1' }, { version: 'v2' }],
    explanation: 'The reporting clause ends the first sentence; the second complete spoken sentence begins with We. Both quote styles are accepted. Joining the two independent statements with commas creates a splice under the assessed convention. “The bridge is safe.” said Mira. has a full stop before lower-case said, breaking the speech-to-report connection.',
    hints: ['Read each spoken statement on its own.', 'Compare the boundary after the narrator with an interruption inside one sentence.'],
    worked: '“The bridge is safe,” said Mira. “We can cross.” The narrator closes the first sentence, then a new spoken sentence begins with a capital. Consistent single curly quotes also work.',
  },
  {
    key: 'quotation-within-speech', skill: 'E07', band: 'stretch', source: 'speechEdit',
    demand: 'Track two levels of quoted words and their different endpoints; alternating quote styles is an explicit authored extension, not claimed as a statutory Year 4 nested-quotation requirement.',
    text: 'Mira repeats Pip’s exact warning inside her own speech; use different curly quote styles for inner and outer speech, and keep the warning emphatic:',
    spec: choices([1, 3, 2, 4], '“Pip shouted ‘Wait!’ before the gate closed,” said Mira.', '‘Pip shouted “Wait!” before the gate closed,’ said Mira.', '“Pip shouted “Wait!” before the gate closed,” said Mira.', '“Pip shouted ‘Wait’! before the gate closed,” said Mira.'), answers: [{ version: 'v1' }, { version: 'v2' }],
    explanation: 'The inner warning includes its exclamation mark and uses the other quote style; the outer speech ends with the reporting comma. Either outer style is accepted. Using double quotes for both levels violates the stated alternating convention; ‘Wait’! places the warning ending outside its inner quote.',
    hints: ['Identify whose words appear inside whose speech.', 'Follow each speaker’s boundaries separately, including the ending that belongs to each.'],
    worked: '“Pip shouted ‘Wait!’ before the gate closed,” said Mira. The inner warning ends inside its single quotes; Mira’s outer speech closes with its comma. Reversing single and double styles consistently is equally correct.',
  },
];

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
export const PUNCTUATION_TASKS: readonly TaskDefinition[] = freeze(items.map((item): TaskDefinition => {
  const descriptor = { familyId: item.skill === 'E06' ? 'english.punctuation.expansion' : 'english.direct-speech', equivalenceVersion: 'r1', authoredKey: item.key, parameters: {} };
  return {
    canonicalQuestionId: canonicalQuestionId(descriptor), descriptor,
    contentRevision: item.spec.kind === 'choice' ? 'expansion-punctuation-2' : 'expansion-punctuation-1',
    skillId: item.skill, objectiveId: item.skill === 'E06' ? 'E06-punctuation' : 'E07-direct-speech', band: item.band,
    contextualSkillIds: item.key === 'apostrophe-inside-speech' ? ['E06'] : [], curriculum: sources[item.source],
    demandRationale: item.demand, instructionText: neutral, assessedText: item.text, responseSpec: item.spec,
    answerRule: { kind: 'accepted-responses', responses: item.answers.map((map): ActivityResponse => item.spec.kind === 'punctuation'
      ? { kind: 'punctuation', slots: map } : { kind: 'choice', choices: map }) },
    explanation: item.explanation,
    hints: [{ id: `${item.key}-hint-1`, text: item.hints[0] }, { id: `${item.key}-hint-2`, text: item.hints[1] }],
    workedSupport: { id: `${item.key}-worked`, text: item.worked },
    narration: { neutralText: neutral, assessedTextMayBeSpokenBeforeCheck: false },
    review: { status: 'approved', reviewer: 'Codex WP03-11A AI author and finite-content reviewer; no qualified educator or child review claimed',
      rationale: 'Original bounded task; all offered complete choices/maps reviewed against the explicit convention, including legitimate variants and assistance timing.', evidenceRef: 'docs/content-review/expansion-punctuation.md' },
  };
}));

export const PUNCTUATION_MANIFEST: TaskFamilyManifest = freeze<TaskFamilyManifest>({
  moduleId: 'expansion-punctuation', familyIds: ['english.punctuation.expansion', 'english.direct-speech'],
  taskIds: PUNCTUATION_TASKS.map(task => task.canonicalQuestionId),
  retainedTaskIds: STARTER_PUNCTUATION_MANIFEST.taskIds,
  domainDescription: '20 new tasks: E06 and E07 each 3 support, 4 core, 3 stretch; bounded exact punctuation maps or complete-version choices. M1 referenced only, never duplicated.',
  reviewEvidenceRef: 'docs/content-review/expansion-punctuation.md',
  // Consumer fixtures follow declared rules. The independent editorial oracle
  // lives in the tests/review and checks every one of these declared outcomes.
  cases: PUNCTUATION_TASKS.flatMap((task): TaskFamilyManifest['cases'] => {
    const spec = task.responseSpec;
    if ((spec.kind !== 'punctuation' && spec.kind !== 'choice') || task.answerRule.kind !== 'accepted-responses') throw new Error('Authored rule invariant');
    const accepted = task.answerRule.responses.map(response => {
      if (response.kind === 'punctuation') return response.slots;
      if (response.kind === 'choice') return response.choices;
      throw new Error('Authored response invariant');
    });
    const maps = spec.slots.reduce<Record<string, string>[]>((rows, slot) => rows.flatMap(row =>
      slot.options.map(option => ({ ...row, [slot.id]: option.id }))), [{}]);
    const makeResponse = (map: Record<string, string | null>): ActivityResponse => spec.kind === 'punctuation'
      ? { kind: 'punctuation', slots: map } : { kind: 'choice', choices: map };
    const cases: TaskFamilyManifest['cases'] = maps.map((map, i) => {
      const correct = accepted.some(answer => spec.slots.every(slot => answer[slot.id] === map[slot.id]));
      const codes = spec.slots.filter(slot => !accepted.some(answer => answer[slot.id] === map[slot.id])).map(() => 'punctuation-context');
      return { caseId: `${task.descriptor.authoredKey}-map-${i + 1}`, canonicalQuestionId: task.canonicalQuestionId,
        response: makeResponse(map), expectedStatus: 'judged', expectedCorrect: correct,
        expectedIssueCodes: correct ? [] : codes.length ? codes : ['punctuation-combination'] };
    });
    return [...cases,
      { caseId: `${task.descriptor.authoredKey}-blank`, canonicalQuestionId: task.canonicalQuestionId,
        response: makeResponse({}), expectedStatus: 'incomplete', expectedIssueCodes: [] },
      { caseId: `${task.descriptor.authoredKey}-unknown`, canonicalQuestionId: task.canonicalQuestionId,
        response: makeResponse({ unknown: null }), expectedStatus: 'invalid-response', expectedIssueCodes: [] },
    ];
  }),
});

// Proposals only: WP03-13A integrates these new M2 optional rows, leaving all
// nine M1 rows and Q1–Q3 completion requirements unchanged.
export const PUNCTUATION_REVISIT_PROPOSALS: readonly QuestActivityBinding[] = freeze(
  (['E06', 'E07'] as const).flatMap(skillId => (['punctuation', 'choice'] as const).map(responseKind => ({
    bindingId: `q2-revisit-${skillId.toLowerCase()}-${responseKind}`, questId: 'Q2', availability: 'M2' as const,
    role: 'revisit' as const, sourceBindingId: null, skillId,
    taskIds: PUNCTUATION_TASKS.filter(task => task.skillId === skillId && task.responseSpec.kind === responseKind).map(task => task.canonicalQuestionId),
    mechanic: responseKind === 'punctuation' ? 'drag' as const : 'consequential-selection' as const, responseKind,
  }))),
);
