import type { ActivityResponse, DifficultyBand, QuestActivityBinding, ResponseSpec, TaskDefinition, TaskFamilyManifest } from '../../learning/contracts';
import { canonicalQuestionId } from '../../learning/identity';

const sourceUrl = 'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study';
const evidence = 'docs/content-review/expansion-words.md';
type WordSkill = 'E01' | 'E02' | 'E03';
type Entry = Readonly<{
  key: string; skill: WordSkill; band: DifficultyBand; context: string; demand: string;
  section: string; programmeBand: string; spec: ResponseSpec; answers: readonly ActivityResponse[];
  explanation: string; hints: readonly [string, string]; worked: string;
}>;
const spelling = 'Years 3 and 4 — Writing: transcription — Spelling: prefixes and suffixes (English Appendix 1)';
const homophones = 'Years 3 and 4 — Writing: transcription — Spelling: further homophones';
const vocabulary = 'Years 3 and 4 — Reading: comprehension — explaining the meaning of words in context';
// Each row is individually authored; helpers only assemble the frozen DTO.
function choice(key: string, skill: WordSkill, band: DifficultyBand, context: string,
  labels: readonly string[], accepted: readonly string[], demand: string, explanation: string,
  hints: readonly [string, string], worked: string, section?: string, programmeBand = 'Years 3–4'): Entry {
  return { key, skill, band, context, demand, section: section ?? (skill === 'E01' ? spelling : skill === 'E02' ? homophones : vocabulary), programmeBand,
    spec: { kind: 'choice', slots: [{ id: 'word', label: 'Your choice', options: labels.map((label, i) => ({ id: ['a', 'b', 'c', 'd'][i], label })) }], requiredSlotIds: ['word'] },
    answers: accepted.map(id => ({ kind: 'choice', choices: { word: id } })), explanation, hints, worked };
}
const entries: readonly Entry[] = [
  choice('e01-unfasten', 'E01', 'support', 'The book strap is fastened. Choose the word meaning to undo the fastening.',
    ['refasten', 'unfasten', 'fastening'], ['b'],
    'Earlier un- prefix consolidation: a concrete action and its reversal are supplied; recognise one transparent word.',
    'Unfasten means undo the fastening. Refasten means fasten again; fastening names the action or attachment, not its reversal.',
    ['Notice what must change about the strap.', 'Think about how a prefix can change the action of a base word.'],
    'Choose unfasten: un- changes fasten to its reversal, so the strap can open.',
    'Year 1 — Writing: transcription — prefix un-; consolidated for Years 3–4', 'Year 1 consolidation'),
  choice('e01-rewrite', 'E01', 'support', 'The spellbook page is smudged. Add a prefix to write to make a word meaning write again.',
    ['unwrite', 'miswrite', 'rewrite'], ['c'],
    'Introductory Years 3–4 prefix recognition: an explicit meaning and unchanged base reduce the demand.',
    'Rewrite means write again. Miswrite means write incorrectly; unwrite suggests undoing writing, not writing again.',
    ['Look at the meaning requested after the base word.', 'Compare what each beginning adds to the same base.'],
    'Choose rewrite. The prefix re- contributes again, and write stays unchanged.'),
  { key: 'e01-suffix-sort', skill: 'E01', band: 'support', context: 'These book labels describe having a quality or being without it. Sort them by what their endings mean.',
    demand: 'Earlier -ful/-less consolidation: two explicit meaning groups and four transparent words, without spelling production.',
    section: 'Year 2 — Writing: transcription — suffixes including -ful and -less; consolidated for Years 3–4', programmeBand: 'Year 2 consolidation',
    spec: { kind: 'sorting', items: [{ id: 'hopeful', label: 'hopeful' }, { id: 'fearless', label: 'fearless' }, { id: 'careful', label: 'careful' }, { id: 'painless', label: 'painless' }],
      groups: [{ id: 'having', label: 'Having the quality' }, { id: 'without', label: 'Without the quality' }], requiredItemIds: ['hopeful', 'fearless', 'careful', 'painless'] },
    answers: [{ kind: 'sorting', groups: { hopeful: 'having', fearless: 'without', careful: 'having', painless: 'without' } }],
    explanation: 'Hopeful has hope and careful takes care: both use -ful. Fearless is without fear and painless is without pain: both use -less.',
    hints: ['Look at the ending as well as the base of each label.', 'Try explaining each whole word before deciding which meaning group fits.'],
    worked: 'Put hopeful and careful in Having the quality. Put fearless and painless in Without the quality. The endings change what each base means.' },
  choice('e01-illegal', 'E01', 'core', 'A book lists actions that are not legal. Choose the correctly spelled word formed from legal that means not legal.',
    ['inlegal', 'ilegal', 'illegal', 'illlegal'], ['c'],
    'Years 3–4 negative-prefix spelling: recognise the il- form before l and retain the base initial letter.',
    'Illegal is il- plus legal and keeps both l letters. Inlegal uses the wrong prefix form; ilegal loses an l; illlegal adds a third l.',
    ['Find the beginning of the base word.', 'Check both the prefix form and what happens where it meets the base.'],
    'Choose illegal: il + legal gives illegal. Both l letters are retained.'),
  choice('e01-happily', 'E01', 'core', 'The reader feels happy and smiles. Add -ly to happy to complete: The reader smiles ___.',
    ['happily', 'happyly', 'hapily'], ['a'],
    'Years 3–4 suffix spelling: apply the consonant-plus-y change while retaining the doubled consonant in the base.',
    'Happily changes the final y of happy to i before -ly and retains pp. Happyly leaves y unchanged; hapily loses a p.',
    ['Look at the last two letters of the base word.', 'Check which part needs to change and which letters must stay.'],
    'Choose happily: happy becomes happi- before -ly, giving happily.'),
  choice('e01-disappear', 'E01', 'core', 'In the story, the ink will appear and then do the opposite. Choose the correctly spelled opposite formed by adding dis- to appear.',
    ['dissappear', 'disappear', 'disapear'], ['b'],
    'Years 3–4 prefix spelling: combine a supplied prefix with a base, retaining its consonants rather than doubling the boundary.',
    'Disappear is dis- plus appear. Dissappear inserts an extra s; disapear drops one of the two p letters in appear.',
    ['Find the boundary between the supplied prefix and base.', 'Build the word in two parts, then check the letters on either side of the join.'],
    'Choose disappear: dis + appear. The prefix has one s and the base keeps pp.'),
  choice('e01-gently', 'E01', 'core', 'The reader is gentle with the old pages. Add -ly to gentle to complete: The reader turns the pages ___.',
    ['gentlely', 'gentlly', 'gently'], ['c'],
    'Years 3–4 suffix spelling: recognise the -le to -ly change rather than simply appending the complete suffix.',
    'Gently replaces the ending -le of gentle with -ly. Gentlely leaves -le in place instead of replacing it; gentlly keeps an extra l at the join.',
    ['Look at the last two letters of the base word.', 'Check how that ending changes when the new word describes the action.'],
    'Choose gently: replace the ending -le of gentle with -ly, giving gently.'),
  choice('e01-forgetting', 'E01', 'stretch', 'The pupil keeps losing track of the page. Add -ing to forget to complete: The pupil is ___ the page number.',
    ['forgeting', 'forgetting', 'forgeteing'], ['b'],
    'Less-direct Years 3–4 suffix demand: the final stressed syllable of a two-syllable base determines consonant doubling.',
    'Forgetting doubles t before -ing because the final syllable in forget is stressed and ends in a single consonant after a single vowel. Forgeting omits that t; forgeteing inserts an e absent from the base.',
    ['Look at the final syllable of the base.', 'Consider its vowel and consonant pattern as well as where the stress falls.'],
    'Choose forgetting: forGET has a stressed final syllable, so its final t doubles before -ing.'),
  choice('e01-preferred', 'E01', 'stretch', 'The librarian will offer two covers; the reader may prefer one. Choose the correctly spelled pair after adding -ed to offer and prefer, in that order.',
    ['offerred / preferred', 'offered / prefered', 'offered / preferred'], ['c'],
    'Less-direct Years 3–4 contrast: compare an unstressed and a stressed final syllable before deciding whether to double the final consonant.',
    'Offered / preferred is correct. Offer has an unstressed final syllable and keeps one final r; prefer has a stressed final syllable and doubles r before -ed. Offerred / preferred over-doubles offer; offered / prefered under-doubles prefer.',
    ['Compare where the stress falls in the two base words.', 'Check each final syllable separately; the same ending need not produce the same change.'],
    'Choose offered / preferred: OFfer keeps one final r; preFER doubles its final r before -ed.'),
  choice('e01-reliable', 'E01', 'stretch', 'The guide can be relied on to return every book. Add -able to rely to describe the guide.',
    ['relyable', 'reliable', 'relyible', 'reliible'], ['b'],
    'Selected Years 5–6 suffix demand: choose -able and the consonant-plus-y base change together.',
    'Reliable is the standard adjective formed from rely. Relyable leaves y unchanged; relyible and reliible use the wrong suffix spelling for this word.',
    ['Consider the base ending and the requested suffix separately.', 'Check the join after you have chosen the suffix; more than one part may need attention.'],
    'Choose reliable: rely changes to reli- before -able.',
    'Years 5 and 6 — Writing: transcription — prefixes and suffixes (English Appendix 1: -able and -ible)', 'Years 5–6 selected'),

  choice('e02-sea', 'E02', 'support', 'The boat floats on the salty ___. Choose the word for the large area of water.',
    ['see', 'sea'], ['b'], 'Introductory familiar homophone: a concrete noun is identified by an explicit water clue.',
    'Sea is the large area of salt water. See is a verb about sight and does not name the water.',
    ['Notice what the boat is floating on.', 'Use the meaning of the whole sentence, not just the sound of the choices.'],
    'Choose sea: The boat floats on the salty sea.'),
  choice('e02-hear', 'E02', 'support', 'The bell makes a sound. I can ___ it with my ears.',
    ['hear', 'here'], ['a'], 'Introductory homophone: the sound and ears supply a direct sensory clue.',
    'Hear means notice a sound. Here identifies a place and cannot describe what the ears do.',
    ['Look at the clue about the bell.', 'Decide whether the missing word describes an action or a place.'],
    'Choose hear: I can hear it with my ears.'),
  choice('e02-pair', 'E02', 'support', 'Two matching gloves make a ___. Choose the word that means two things used together.',
    ['pear', 'pair'], ['b'], 'Introductory homophone: an explicit definition and familiar paired objects support the choice.',
    'Pair means two things used together. Pear names a fruit, which is not what the two gloves make.',
    ['Notice how many gloves are described.', 'Compare the meaning of each spelling with the objects in the clue.'],
    'Choose pair: Two matching gloves make a pair.'),
  choice('e02-accept-delivery', 'E02', 'core', 'The library will ___ the parcel if its label matches the order; otherwise the courier must take it away. Choose the word that fits this delivery decision.',
    ['except', 'accept'], ['b'], 'Years 3–4 accept/except distinction: infer the positive delivery decision from the matching-label condition and the contrasting return outcome; no definition is supplied.',
    'Accept means agree to receive the parcel, consistent with returning it only when the label does not match. Except means leave out or exclude; that does not express receiving the matching delivery.',
    ['Compare what happens when the label matches with what happens otherwise.', 'Try each meaning in the whole decision, including the outcome after the semicolon.'],
    'Choose accept: the matching parcel can be received, while a non-matching parcel goes back with the courier. Except would express exclusion instead.',
    'Years 3 and 4 — Writing: transcription — further homophones; English Appendix 1, homophones and near-homophones: accept/except (p. 15)'),
  choice('e02-plane-tool', 'E02', 'core', 'Before fitting the wooden shelf, the carpenter shaved thin curls from its rough edge with a ___. Choose the word that fits the tool being used.',
    ['plain', 'plane'], ['b'], 'Years 3–4 plain/plane distinction: infer the tool sense from its woodworking action, rather than receiving a definition or a supplied contraction expansion.',
    'Plane names the tool that shaves thin layers from wood. Plain can mean simple or an area of flat land, but neither meaning names the tool used on the shelf.',
    ['Notice the material and the action performed on it.', 'A spelling can have more than one meaning; check for a meaning that works in this particular activity.'],
    'Choose plane: a carpenter uses a plane to shave the rough wooden edge. The land or simple meanings of plain do not fit this tool.',
    'Years 3 and 4 — Writing: transcription — further homophones; English Appendix 1, homophones and near-homophones: plain/plane (p. 15)'),
  choice('e02-weather', 'E02', 'core', 'The outdoor reading plan depends on the ___. Rain would send everyone inside.',
    ['weather', 'whether'], ['a'], 'Years 3–4 homophone: infer the named conditions from the consequence in the second sentence.',
    'Weather names conditions such as rain. Whether introduces alternatives or uncertainty and does not name those conditions.',
    ['Look at the event that would change the plan.', 'Decide what kind of thing the missing word must name.'],
    'Choose weather: rain is a weather condition that could change the plan.'),
  choice('e02-brake', 'E02', 'core', 'The book cart is rolling downhill. Pull its ___ to slow the wheels.',
    ['break', 'brake'], ['b'], 'Years 3–4 homophone: select a device by its function, with an action-related distractor.',
    'A brake slows the wheels. A break is an interruption or damage; it is not the device being pulled here.',
    ['Look at what the device must do.', 'Try each meaning in the practical situation described.'],
    'Choose brake: pulling the brake slows the cart.'),
  choice('e02-practice-rehearsal', 'E02', 'stretch', 'Use British English spellings: After today’s ___, the actor will ___ the difficult scene alone before tomorrow’s performance. Choose the two spellings in order.',
    ['practice / practice', 'practise / practice', 'practice / practise', 'practise / practise'], ['c'],
    'Selected Years 5–6 practice/practise distinction: identify the noun naming an activity and the verb describing an action in the same sentence, then select the ordered spelling pair without grammatical labels in the prompt.',
    'In British English, practice names the activity after today’s; practise is the action after will. Practice / practise fits both. Practice / practice gets only the noun right; practise / practise gets only the verb right; practise / practice reverses both spellings.',
    ['Compare the jobs of the two missing words.', 'One names an activity; the other follows will and tells what someone does. Apply the British spelling distinction.'],
    'Choose practice / practise: After today’s practice, the actor will practise the difficult scene. The British noun uses -ce and the verb uses -se; both positions must be right.',
    'Years 5 and 6 — Writing: transcription — distinguishing homophones and other often-confused words; English Appendix 1, noun/verb pairs: practice/practise (p. 21)', 'Years 5–6 selected'),
  choice('e02-whose', 'E02', 'stretch', 'Every book except one has an owner label. We must discover ___ book has no label before returning it.',
    ["who’s", 'whose'], ['b'], 'Less-direct Years 3–4 homophone: an embedded ownership question requires expansion of the competing contraction.',
    'Whose asks about the owner of the book. Who’s means who is or who has; neither expansion fits before book has no label.',
    ['Work out what information is still missing.', 'Test both possible expansions of the shortened form against the whole sentence.'],
    'Choose whose: discover whose book it is means discover its owner.'),
  choice('e02-stationery', 'E02', 'stretch', 'The clerk stocked the drawer with envelopes and writing paper. The drawer now holds ___.',
    ['stationery', 'stationary'], ['a'], 'Selected Years 5–6 commonly confused words: identify a category from examples and distinguish its spelling from a similarly sounding adjective.',
    'Stationery names writing materials such as paper and envelopes. Stationary means not moving and does not name the drawer’s contents.',
    ['Use the examples to work out the category of objects.', 'Ask whether each word names materials or describes a condition.'],
    'Choose stationery: the paper and envelopes are stationery.',
    'Years 5 and 6 — Writing: transcription — distinguishing homophones and other often-confused words', 'Years 5–6 selected'),

  choice('e03-warm', 'E03', 'support', 'The potion label says warm, not hot or cold. Choose the opposite of warm on this temperature scale.',
    ['bright', 'cool', 'sweet'], ['b'], 'Introductory contextual opposite: the temperature dimension is named and unrelated dimensions contrast.',
    'Cool is the temperature opposite offered for warm. Bright concerns light and sweet concerns taste, so neither is a temperature opposite.',
    ['Notice which property the label describes.', 'Keep your comparison on the same scale.'],
    'Choose cool: warm and cool contrast on the temperature scale.'),
  choice('e03-tiny', 'E03', 'support', 'The label calls the bottle tiny: it is very small. Choose a phrase with the same meaning here.',
    ['very heavy', 'very small', 'very old'], ['b'], 'Introductory meaning recognition: an explicit definition is provided, with size distinguished from weight and age.',
    'Very small matches tiny. Very heavy describes weight; very old describes age, neither of which is given by tiny.',
    ['Look at the words after the colon.', 'Compare the property in the description with each offered phrase.'],
    'Choose very small. The label itself explains tiny with those words.'),
  { key: 'e03-label-match', skill: 'E03', band: 'support', context: 'One potion label says start mixing; another says stop mixing. Match each label to a phrase with the same meaning.',
    demand: 'Introductory contextual vocabulary: match two familiar action words to distinct explicit paraphrases.', section: vocabulary, programmeBand: 'Years 3–4 introductory',
    spec: { kind: 'matching', items: [{ id: 'start', label: 'start mixing' }, { id: 'stop', label: 'stop mixing' }], targets: [{ id: 'begin', label: 'begin mixing' }, { id: 'cease', label: 'cease mixing' }], requiredItemIds: ['start', 'stop'], uniqueTargets: true },
    answers: [{ kind: 'matching', pairs: { start: 'begin', stop: 'cease' } }],
    explanation: 'Start mixing means begin mixing; stop mixing means cease mixing. Swapping them reverses each instruction.',
    hints: ['Imagine what the mixer does when each label is followed.', 'Check that each pair produces the same action, not the opposite one.'],
    worked: 'Match start mixing to begin mixing, and stop mixing to cease mixing. Each pair keeps the action unchanged.' },
  choice('e03-faint', 'E03', 'core', 'The potion gives off a faint glow, just bright enough to see in the dark. Choose a word that could replace faint without changing that meaning.',
    ['dazzling', 'dim', 'noisy', 'weak'], ['b', 'd'], 'Years 3–4 contextual synonym: infer low light intensity and accept both natural offered substitutes.',
    'Dim and weak both describe this barely visible glow and are equally accepted. Dazzling implies intense brightness; noisy concerns sound.',
    ['Use the description after the comma as evidence.', 'Try each replacement with glow and keep the stated light level unchanged.'],
    'Choose dim or weak. A dim glow and a weak glow both fit light that is only just visible.'),
  choice('e03-fragile', 'E03', 'core', 'The label warns that the glass vial is fragile and could break if dropped. Choose the meaning of fragile here.',
    ['easy to break', 'hard to lift', 'safe to drop'], ['a'], 'Years 3–4 contextual meaning: use a stated consequence to interpret a descriptive warning.',
    'Easy to break explains fragile. Hard to lift concerns weight, which is not stated; safe to drop contradicts the warning.',
    ['Look at what might happen to the vial.', 'Choose a meaning that explains why the warning was written.'],
    'Choose easy to break. The warning about dropping the vial explains fragile.'),
  choice('e03-transparent', 'E03', 'core', 'The liquid is transparent, so the black line behind the bottle can be seen through it. Choose a description with the same meaning here.',
    ['impossible to see through', 'easy to see through', 'strongly scented', 'clear'], ['b', 'd'], 'Years 3–4 contextual vocabulary: relate a visible consequence to two legitimate paraphrases of transparency.',
    'Easy to see through and clear both match this transparent liquid. Impossible to see through contradicts the visible line; strongly scented concerns smell.',
    ['Use the line behind the bottle as your clue.', 'Test whether each meaning allows the described view through the liquid.'],
    'Choose easy to see through or clear. Both preserve the meaning that the line is visible through the liquid.'),
  choice('e03-scarce', 'E03', 'core', 'Moon petals are scarce this week: only two were found in the whole garden. Choose the meaning of scarce here.',
    ['available in large amounts', 'few in number', 'easy to grow'], ['b'], 'Years 3–4 contextual meaning: connect limited supply with a count across the stated search area.',
    'Few in number matches scarce in this scene. Available in large amounts contradicts only two; easy to grow is not established by how many were found.',
    ['Look at how much was found across the garden.', 'Separate a statement about supply from a statement about growing conditions.'],
    'Choose few in number. Only two petals were found across the garden, so the supply is scarce.'),
  choice('e03-sharp', 'E03', 'stretch', 'A sharp smell rose from the opened potion, making the mixer wrinkle her nose. Choose the meaning of sharp in this sentence.',
    ['having a pointed tip', 'strong and pungent', 'quick to understand'], ['b'], 'Less-direct Years 3–4 polysemy: select the sensory sense of a familiar word among two other valid senses.',
    'Strong and pungent fits a sharp smell. Having a pointed tip can describe a sharp object; quick to understand can describe a sharp person, but neither fits smell.',
    ['Notice which noun the word describes.', 'A familiar word can have several meanings; use the reaction as well as the noun.'],
    'Choose strong and pungent. Here sharp describes the smell that makes the mixer wrinkle her nose.'),
  choice('e03-reserve', 'E03', 'stretch', 'The label says to reserve one spoonful while mixing the rest. The spoonful will be needed for the final step. What does reserve mean here?',
    ['use it all now', 'keep it for later', 'set it aside', 'throw it away'], ['b', 'c'], 'Less-direct Years 3–4 contextual verb: link a present instruction to a later purpose and accept both equivalent actions.',
    'Keep it for later and set it aside both preserve the spoonful for the final step. Use it all now and throw it away leave none for that step.',
    ['Read the present instruction together with the later step.', 'Test whether each action leaves the needed amount available.'],
    'Choose keep it for later or set it aside. Both reserve the spoonful for the final step.'),
  choice('e03-mild-weather-scent', 'E03', 'stretch', 'The mild weather lets the mixer work outdoors, where the potion’s mild scent is easily lost among the garden smells. Which meaning fits mild where it describes the scent?',
    ['gentle', 'not cold for the season', 'faint', 'not severe as an illness'], ['a', 'c'],
    'Less-direct Years 3–4 contextual polysemy: distinguish two occurrences of mild in one scene. A plausible weather meaning fits the first occurrence but not the requested scent; two intensity synonyms remain valid, while an illness meaning fits neither occurrence.',
    'Gentle and faint both fit the low-intensity scent and are equally accepted. Not cold for the season explains the earlier mild weather, not the scent. Not severe as an illness is another use of mild, but no illness is described and it does not explain this scent.',
    ['Notice which noun each occurrence of mild describes.', 'Test the meanings against both occurrences, then keep a meaning that fits the requested noun.'],
    'Choose gentle or faint for mild scent. Not cold for the season belongs to mild weather in the same sentence; the illness meaning belongs to a different context.'),
];

const objectives = { E01: 'E01-spelling-affixes', E02: 'E02-homophones', E03: 'E03-contextual-vocabulary' } as const;
const spellingRows: Readonly<Record<string, string>> = {
  'e01-unfasten': 'English Appendix 1, Year 1, prefix un- (p. 6)',
  'e01-rewrite': 'English Appendix 1, Years 3–4, More prefixes: re- (p. 12)',
  'e01-suffix-sort': 'English Appendix 1, Year 2, -ful and -less suffixes (p. 9)',
  'e01-illegal': 'English Appendix 1, Years 3–4, More prefixes: in- before l (p. 12)',
  'e01-happily': 'English Appendix 1, Years 3–4, suffix -ly: consonant plus y (pp. 12–13)',
  'e01-disappear': 'English Appendix 1, Years 3–4, More prefixes: dis- (p. 11)',
  'e01-gently': 'English Appendix 1, Years 3–4, suffix -ly: -le ending (p. 13)',
  'e01-forgetting': 'English Appendix 1, Years 3–4, vowel suffixes on multisyllabic words (p. 11)',
  'e01-preferred': 'English Appendix 1, Years 3–4, vowel suffixes on multisyllabic words (p. 11)',
  'e01-reliable': 'English Appendix 1, Years 5–6, -able/-ible endings (p. 19)',
};
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
export const WORD_TASKS: readonly TaskDefinition[] = freeze(entries.map(entry => {
  const descriptor = { familyId: `english.words.${entry.skill.toLowerCase()}`, equivalenceVersion: 'r1', authoredKey: entry.key, parameters: {} };
  const instruction = entry.spec.kind === 'choice' ? 'Read the task and choose one option. You can change your choice before Check.'
    : entry.spec.kind === 'sorting' ? 'Read the task and put every item in a group. You can change the groups before Check.'
      : 'Read the task and match every item to a different phrase. You can change the matches before Check.';
  return {
    canonicalQuestionId: canonicalQuestionId(descriptor), descriptor, contentRevision: '1', skillId: entry.skill,
    objectiveId: objectives[entry.skill], band: entry.band, contextualSkillIds: [],
    curriculum: { sourceUrl,
      section: spellingRows[entry.key] ? `${entry.section}; ${spellingRows[entry.key]}`
        : entry.skill === 'E02' && entry.band === 'support' ? 'Year 2 — Writing: transcription — distinguishing homophones and near-homophones; consolidated in Years 3–4' : entry.section,
      programmeBand: entry.skill === 'E02' && entry.band === 'support' ? 'Year 2 consolidation' : entry.programmeBand }, demandRationale: entry.demand,
    instructionText: instruction, assessedText: entry.context, responseSpec: entry.spec,
    answerRule: { kind: 'accepted-responses' as const, responses: entry.answers }, explanation: entry.explanation,
    hints: [{ id: 'attention', text: entry.hints[0] }, { id: 'strategy', text: entry.hints[1] }] as const,
    workedSupport: { id: 'worked', text: entry.worked },
    narration: { neutralText: instruction, assessedTextMayBeSpokenBeforeCheck: entry.skill !== 'E01' },
    review: { status: 'approved' as const, reviewer: 'Codex WP03-09A author; independent lane review pending',
      rationale: 'Original finite task; all offered alternatives reviewed in context, including equivalent synonyms. See per-key matrix and narration disposition; no educator or efficacy claim.',
      evidenceRef: `${evidence}#${entry.key}` },
  };
}));

export const WORD_MANIFEST: TaskFamilyManifest = freeze({
  moduleId: 'expansion-words', familyIds: ['english.words.e01', 'english.words.e02', 'english.words.e03'],
  taskIds: WORD_TASKS.map(task => task.canonicalQuestionId), retainedTaskIds: [],
  domainDescription: 'Thirty original finite E01/E02/E03 tasks, each skill with 3 support, 4 core and 3 stretch. Twenty-eight choices, one suffix sort and one meaning match. No starter replaced or recounted.',
  reviewEvidenceRef: evidence,
  cases: [...WORD_TASKS.flatMap(task => {
    const accepted = task.answerRule.kind === 'accepted-responses' ? task.answerRule.responses : [];
    return accepted.map((response, i) => ({ caseId: `${task.descriptor.authoredKey}-accepted-${i + 1}`, canonicalQuestionId: task.canonicalQuestionId,
      response, expectedStatus: 'judged' as const, expectedCorrect: true, expectedIssueCodes: [] }));
  }), ...(['e01-unfasten', 'e02-sea', 'e03-warm'] as const).flatMap(key => {
    const task = WORD_TASKS.find(row => row.descriptor.authoredKey === key)!;
    return [
      { caseId: `${key}-wrong`, canonicalQuestionId: task.canonicalQuestionId, response: { kind: 'choice' as const, choices: { word: 'a' } }, expectedStatus: 'judged' as const, expectedCorrect: false, expectedIssueCodes: ['word-choice-mismatch'] },
      { caseId: `${key}-invalid`, canonicalQuestionId: task.canonicalQuestionId, response: { kind: 'choice' as const, choices: { word: 'unknown' } }, expectedStatus: 'invalid-response' as const, expectedIssueCodes: [] },
      { caseId: `${key}-incomplete`, canonicalQuestionId: task.canonicalQuestionId, response: { kind: 'choice' as const, choices: { word: null } }, expectedStatus: 'incomplete' as const, expectedIssueCodes: [] },
    ];
  })],
});

const taskId = (key: string) => WORD_TASKS.find(task => task.descriptor.authoredKey === key)!.canonicalQuestionId;
const clueKeys = ['e02-sea', 'e02-hear', 'e02-pair', 'e02-accept-delivery', 'e02-plane-tool', 'e02-weather', 'e02-brake', 'e02-practice-rehearsal', 'e02-whose', 'e02-stationery'];
const wordBinding = (bindingId: string, questId: string, role: 'story' | 'revisit', skillId: WordSkill, responseKind: 'choice' | 'sorting' | 'matching', keys: readonly string[]): QuestActivityBinding => ({
  bindingId, questId, availability: 'M2', role, skillId, taskIds: keys.map(taskId), sourceBindingId: null,
  mechanic: responseKind === 'choice' ? 'consequential-selection' : responseKind, responseKind,
});
/** Proposals only: WP03-13A owns central catalogue/dispatch/binding integration. */
export const WORD_BINDING_PROPOSALS: readonly QuestActivityBinding[] = freeze([
  wordBinding('q6-story-e02-clue', 'Q6', 'story', 'E02', 'choice', clueKeys),
  wordBinding('q6-revisit-e01-choice', 'Q6', 'revisit', 'E01', 'choice', ['e01-unfasten', 'e01-rewrite', 'e01-illegal', 'e01-happily', 'e01-disappear', 'e01-gently', 'e01-forgetting', 'e01-preferred', 'e01-reliable']),
  wordBinding('q6-revisit-e01-sorting', 'Q6', 'revisit', 'E01', 'sorting', ['e01-suffix-sort']),
  wordBinding('q6-revisit-e02-choice', 'Q6', 'revisit', 'E02', 'choice', clueKeys),
  wordBinding('q5-revisit-e03-choice', 'Q5', 'revisit', 'E03', 'choice', ['e03-warm', 'e03-tiny', 'e03-faint', 'e03-fragile', 'e03-transparent', 'e03-scarce', 'e03-sharp', 'e03-reserve', 'e03-mild-weather-scent']),
  wordBinding('q5-revisit-e03-matching', 'Q5', 'revisit', 'E03', 'matching', ['e03-label-match']),
]);

type HandoffCase = Readonly<{
  caseId: string; bindingId: string; canonicalQuestionId: string; response: ActivityResponse;
  expectedStatus: 'judged'; expectedCorrect: boolean; expectedEvidenceMode: 'independent' | 'listening-supported';
  consumer: 'WP02-10A' | 'WP04-07A' | 'WP06';
}>;
/** These are expected receiving checks, not claims that controls/save/audio ran. */
export const WORD_HANDOFF_CASES: readonly HandoffCase[] = freeze([
  { caseId: 'word-neutral-instruction', bindingId: 'q6-revisit-e01-choice', canonicalQuestionId: taskId('e01-unfasten'), response: { kind: 'choice', choices: { word: 'b' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP02-10A' },
  { caseId: 'word-story-support', bindingId: 'q6-story-e02-clue', canonicalQuestionId: taskId('e02-sea'), response: { kind: 'choice', choices: { word: 'b' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP04-07A' },
  { caseId: 'word-story-listening', bindingId: 'q6-story-e02-clue', canonicalQuestionId: taskId('e02-hear'), response: { kind: 'choice', choices: { word: 'a' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'listening-supported', consumer: 'WP06' },
  { caseId: 'word-synonym-alternative', bindingId: 'q5-revisit-e03-choice', canonicalQuestionId: taskId('e03-faint'), response: { kind: 'choice', choices: { word: 'd' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP02-10A' },
  { caseId: 'word-synonym-listening', bindingId: 'q5-revisit-e03-choice', canonicalQuestionId: taskId('e03-reserve'), response: { kind: 'choice', choices: { word: 'c' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'listening-supported', consumer: 'WP04-07A' },
  { caseId: 'word-sort-worked', bindingId: 'q6-revisit-e01-sorting', canonicalQuestionId: taskId('e01-suffix-sort'), response: { kind: 'sorting', groups: { hopeful: 'having', fearless: 'without', careful: 'having', painless: 'without' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP02-10A' },
  { caseId: 'word-match-retry', bindingId: 'q5-revisit-e03-matching', canonicalQuestionId: taskId('e03-label-match'), response: { kind: 'matching', pairs: { start: 'cease', stop: 'begin' } }, expectedStatus: 'judged', expectedCorrect: false, expectedEvidenceMode: 'independent', consumer: 'WP04-07A' },
  { caseId: 'word-familiar-revisit', bindingId: 'q6-revisit-e02-choice', canonicalQuestionId: taskId('e02-sea'), response: { kind: 'choice', choices: { word: 'b' } }, expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', consumer: 'WP04-07A' },
]);
