import type { ActivityResponse, DifficultyBand, LearningAssistance, QuestActivityBinding, ResponseOption, TaskDefinition, TaskFamilyManifest } from '../../learning/contracts';
import { canonicalQuestionId } from '../../learning/identity';

const sourceUrl = 'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study';
const reviewRef = 'docs/content-review/expansion-reading-writing.md';
type Skill = 'E08' | 'E09' | 'E10';
type Options = readonly (readonly [string, string])[];
type Base = { key: string; skill: Skill; band: DifficultyBand; text: string; question: string; demand: string; explanation: string; hints: readonly [string, string] };
type ChoiceItem = Base & { options: Options; accepted: readonly string[]; rejected: Readonly<Record<string, string>> };
type InferenceItem = Base & { inferences: Options; clues: Options; pairs: readonly (readonly [string, string])[]; unsupported: Readonly<Record<string, string>> };
type SequenceItem = Base & { tiles: Options; orders: readonly (readonly string[])[]; constraint: string };
const options = (rows: Options): readonly ResponseOption[] => rows.map(([id, label]) => ({ id, label }));
const choice = (slot: string, value: string): ActivityResponse => ({ kind: 'choice', choices: { [slot]: value } });
const pair = (inference: string, clue: string): ActivityResponse => ({ kind: 'choice', choices: { inference, clue } });
function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}

const retrieval: readonly ChoiceItem[] = [
  { key: 'bench-note', skill: 'E08', band: 'support',
    text: 'Garden notice: Leave borrowed cushions in the box beneath the bench. Put borrowed books on the shelf beside the door.',
    question: 'Where should a borrowed cushion go?', demand: 'Retrieve one explicit location while distinguishing a nearby instruction for another object.',
    options: [['shelf', 'On the shelf beside the door'], ['box', 'In the box beneath the bench'], ['bench', 'On top of the bench']], accepted: ['box'],
    rejected: { shelf: 'The shelf instruction is for books, not cushions.', bench: 'The notice says beneath the bench, not on top of it.' },
    explanation: 'The cushion instruction names the box beneath the bench.', hints: ['Find the line about the object in the question.', 'Check the location word as well as the name of the place.'] },
  { key: 'repair-kit', skill: 'E08', band: 'support',
    text: 'Workshop list: The small repair kit contains string and a cloth. Glue is kept in the cupboard. Ask the keeper before taking it.',
    question: 'Which two things are inside the small repair kit?', demand: 'Retrieve an explicitly grouped pair from a list without importing an item stored elsewhere.',
    options: [['glue-cloth', 'Glue and a cloth'], ['string-glue', 'String and glue'], ['string-cloth', 'String and a cloth']], accepted: ['string-cloth'],
    rejected: { 'glue-cloth': 'Glue is in the cupboard, not in the kit.', 'string-glue': 'The kit contains a cloth with the string; glue is stored separately.' },
    explanation: 'The first list sentence puts string and a cloth in the kit.', hints: ['Find the sentence naming the container in the question.', 'Keep items stored elsewhere separate from items inside that container.'] },
  { key: 'path-flag', skill: 'E08', band: 'support',
    text: 'Path notice: A blue flag marks the drinking-water stop. A yellow flag marks the tool store. Return empty bottles to the water stop.',
    question: 'Which flag marks the place for empty bottles?', demand: 'Link an explicitly named destination to its flag in an adjacent sentence.',
    options: [['blue', 'Blue'], ['yellow', 'Yellow'], ['either', 'Either flag']], accepted: ['blue'],
    rejected: { yellow: 'Yellow marks the tool store; the bottles go to the water stop.', either: 'Only the water stop is named as the bottle destination.' },
    explanation: 'Empty bottles go to the water stop, which the notice marks with a blue flag.', hints: ['Find where the bottles must go.', 'Look back for the description of that place.'] },
  { key: 'wet-path', skill: 'E08', band: 'core',
    text: 'Walkers: At the fork, use the low path when the ground is dry. If the ground is wet, use the raised path instead. Both paths end at the orchard. Today the ground is wet.',
    question: 'Which path do the written instructions tell walkers to use today?', demand: 'Apply a written conditional instruction to a stated condition, separating shared destination from route.',
    options: [['low', 'The low path'], ['raised', 'The raised path'], ['either', 'Either path']], accepted: ['raised'],
    rejected: { low: 'The low path is prescribed only when the ground is dry.', either: 'Although both reach the orchard, the wet-ground instruction specifies the raised path.' },
    explanation: 'Today is wet, so the instruction for wet ground applies: use the raised path.', hints: ['Find the condition given for today.', 'Match that condition to the instruction that applies to it.'] },
  { key: 'lantern-card', skill: 'E08', band: 'core',
    text: 'Lantern card: Before opening the case, switch the lantern off. After the case is open, wipe the clear cover. Close the case before switching the lantern on again.',
    question: 'What must happen immediately before the case is opened?', demand: 'Retrieve an ordered prerequisite from linked before/after instructions.',
    options: [['wipe', 'Wipe the clear cover'], ['off', 'Switch the lantern off'], ['on', 'Switch the lantern on']], accepted: ['off'],
    rejected: { wipe: 'Wiping is after the case is open.', on: 'Switching on is after the case has been closed again.' },
    explanation: 'The first instruction places switching off before opening the case.', hints: ['Locate the action named in the question.', 'Use the time words to decide which action comes before it.'] },
  { key: 'return-desk', skill: 'E08', band: 'core',
    text: 'Library notice: Return borrowed maps to the desk, except maps with a torn edge. Put those in the repair tray beside the desk. Rolled maps follow the same rule as flat maps. Your map is rolled and has a torn edge.',
    question: 'Where should this map go?', demand: 'Retrieve an exception and ignore a property explicitly declared irrelevant to the rule.',
    options: [['desk', 'On the desk'], ['shelf', 'On a shelf'], ['tray', 'In the repair tray']], accepted: ['tray'],
    rejected: { desk: 'The torn-edge exception overrides the usual desk instruction.', shelf: 'The notice gives no shelf return instruction.' },
    explanation: 'The map has a torn edge, so it belongs in the repair tray even though it is rolled.', hints: ['Check whether the ordinary instruction has an exception.', 'Decide which details of this map the notice says matter.'] },
  { key: 'seed-delivery', skill: 'E08', band: 'core',
    text: 'Delivery note: Take the packet marked BEANS to the greenhouse. Leave the other packet in the shed. The keeper has already put the beans in the striped packet; the plain packet holds peas.',
    question: 'Which packet should be taken to the greenhouse?', demand: 'Connect a named content with a separately stated physical description across the note.',
    options: [['striped', 'The striped packet'], ['plain', 'The plain packet'], ['both', 'Both packets']], accepted: ['striped'],
    rejected: { plain: 'The plain packet holds peas, not the beans requested for the greenhouse.', both: 'The other packet must stay in the shed.' },
    explanation: 'The greenhouse needs the beans, and the note says the striped packet holds them.', hints: ['Identify what the destination needs.', 'Find which packet contains that item.'] },
  { key: 'updated-route', skill: 'E08', band: 'stretch',
    text: 'Morning route card: All deliveries use the east gate.\nLater update: Deliveries carrying glass must now use the west gate. All other deliveries still follow the morning card. This update changes the gate only; every delivery must still stop at the desk. Your delivery contains glass jars.',
    question: 'Which instruction applies to your delivery after the update?', demand: 'Reconcile an explicit amendment with the unchanged portion of an earlier instruction; additional reasoning within Years 3–4 retrieval.',
    options: [['east-desk', 'Use the east gate and stop at the desk'], ['west-desk', 'Use the west gate and stop at the desk'], ['west-only', 'Use the west gate and skip the desk']], accepted: ['west-desk'],
    rejected: { 'east-desk': 'The later update changes the gate for glass deliveries.', 'west-only': 'The update explicitly keeps the desk stop for every delivery.' },
    explanation: 'Glass deliveries change to the west gate, but the desk stop still applies.', hints: ['Separate what the update changes from what it keeps.', 'Test each part of an option against both notices.'] },
  { key: 'archive-slip', skill: 'E08', band: 'stretch',
    text: 'Archive guide: Copies are in green folders. Originals are in brown folders. To request an original, copy its shelf letter onto a white slip. To request a copy, use a blue slip. The old river survey is an original on shelf K; its newer copy is on shelf M.',
    question: 'What should be written on which slip to request the original river survey?', demand: 'Retrieve and combine document status, location and request rule while excluding the newer copy; linked Years 3–4 demand.',
    options: [['blue-k', 'K on a blue slip'], ['white-m', 'M on a white slip'], ['white-k', 'K on a white slip']], accepted: ['white-k'],
    rejected: { 'blue-k': 'Blue slips request copies, while the question asks for the original.', 'white-m': 'Shelf M holds the copy; the original is on shelf K.' },
    explanation: 'An original needs a white slip, and the original river survey is on shelf K.', hints: ['Keep the original and the copy separate as you read.', 'Check both the requested shelf and the kind of slip.'] },
  { key: 'bell-delivery', skill: 'E08', band: 'stretch',
    text: 'Courtyard instructions: Before the bell, leave all parcels with the keeper. After the bell, take dry parcels to the hall and damp parcels to the covered rack. A label saying URGENT changes only the order in which parcels are collected, not where they are left. The bell has rung. Your parcel is damp and labelled URGENT.',
    question: 'Where do the instructions say to leave this parcel?', demand: 'Combine time and condition while excluding an explicitly irrelevant priority label; no inference about urgency is needed.',
    options: [['rack', 'On the covered rack'], ['keeper', 'With the keeper'], ['hall', 'In the hall']], accepted: ['rack'],
    rejected: { keeper: 'The keeper rule applies before the bell; it has already rung.', hall: 'After the bell the hall is for dry parcels; this parcel is damp.' },
    explanation: 'The bell has rung and the parcel is damp, so the covered rack rule applies. URGENT does not change the place.', hints: ['Find the rule for the present time and condition.', 'Check whether every label changes the destination.'] },
];

const inference: readonly InferenceItem[] = [
  { key: 'wet-cloak', skill: 'E09', band: 'support',
    text: 'Ada stepped in from the yard. Water dripped from her cloak. She set a basket on the table. Through the open door, raindrops were striking the paving stones.',
    question: 'What probably made Ada’s cloak wet? Choose an inference and a clue that supports it.', demand: 'Make a modest causal inference using a visible weather clue; the cause is not explicitly stated.',
    inferences: [['rain', 'She was caught in the rain'], ['river', 'She swam in the river'], ['wash', 'She washed the cloak indoors']],
    clues: [['paving', 'Raindrops were striking the paving stones'], ['basket', 'She set a basket on the table'], ['yard', 'Ada stepped in from the yard']], pairs: [['rain', 'paving']],
    unsupported: { river: 'There is no river or swimming in this account.', wash: 'There is no washing indoors in this account.' },
    explanation: 'Rain outside supports rain as the likely cause of the wet cloak. Coming from a yard alone does not establish wet weather.', hints: ['Look for evidence related to the cause of the wetness.', 'A clue should help distinguish your explanation from the other possibilities.'] },
  { key: 'cold-wait', skill: 'E09', band: 'support',
    text: 'While waiting at the gate, Bo pulled his scarf tighter and rubbed his hands for warmth. A basket stood beside him. He watched the path.',
    question: 'How is Bo probably feeling physically? Choose an inference and a supporting clue.', demand: 'Infer a physical feeling from a purposeful action instead of retrieving a named feeling.',
    inferences: [['hungry', 'Hungry'], ['cold', 'Cold'], ['tired', 'Sleepy']],
    clues: [['basket', 'A basket stood beside him'], ['warmth', 'He rubbed his hands for warmth'], ['path', 'He watched the path']], pairs: [['cold', 'warmth']],
    unsupported: { hungry: 'A basket does not establish hunger, and no eating action is described.', tired: 'The account gives no yawning, resting or other evidence of sleepiness.' },
    explanation: 'Rubbing his hands for warmth supports the inference that Bo feels cold.', hints: ['Look at what the character does.', 'Ask which action provides evidence about a physical feeling.'] },
  { key: 'tilting-cup', skill: 'E09', band: 'support',
    text: 'A cup full of water rested on a board. One end of the board slipped down. The cup began sliding towards the lowered edge. Nothing was underneath to catch it.',
    question: 'What is likely to happen if nobody stops the cup? Choose a prediction and its clue.', demand: 'Predict a direct consequence of supplied movement, without claiming certainty beyond the condition.',
    inferences: [['stay', 'The cup will stay where it started'], ['rise', 'The cup will move uphill'], ['fall', 'The cup will slide off']],
    clues: [['water', 'The cup was full of water'], ['sliding', 'The cup began sliding towards the lowered edge'], ['board', 'The cup rested on a board']], pairs: [['fall', 'sliding']],
    unsupported: { stay: 'The text says the cup has already begun moving.', rise: 'The described movement is towards the lowered edge, not uphill.' },
    explanation: 'Sliding towards an edge supports the prediction of sliding off if nobody intervenes.', hints: ['Notice what is already changing.', 'Choose a clue that gives a direction to your prediction.'] },
  { key: 'first-reading', skill: 'E09', band: 'core',
    text: 'Before her first public reading, Kit whispered, “What if I forget the words?” Her hands trembled as she unfolded the page. A green curtain hung beside the stage.',
    question: 'What feeling about the reading is best supported? Choose it and one sufficient clue.', demand: 'Infer an unstated emotional state from speech or behaviour and accept either sufficient clue.',
    inferences: [['worried', 'She is worried about performing'], ['bored', 'She is bored by the audience'], ['angry', 'She is angry with the curtain maker']],
    clues: [['words', '“What if I forget the words?”'], ['hands', 'Her hands trembled as she unfolded the page'], ['curtain', 'A green curtain hung beside the stage']], pairs: [['worried', 'words'], ['worried', 'hands']],
    unsupported: { bored: 'Neither her question about forgetting nor trembling suggests boredom with the audience.', angry: 'The curtain is described, but no anger or curtain maker is mentioned.' },
    explanation: 'Her worry about forgetting and her trembling each support nervousness about the reading. The curtain colour does not.', hints: ['Look for speech or behaviour that reveals a feeling.', 'More than one clue may support a feeling; choose one that actually does.'] },
  { key: 'early-baker', skill: 'E09', band: 'core',
    text: 'At sunrise, Ren reached the bakery. Six warm loaves were cooling on the counter. The baker brushed flour from her sleeves and took another tray from the oven. The shop sign was blue.',
    question: 'What can Ren reasonably infer? Choose an inference and a clue that supports it.', demand: 'Infer earlier activity from completed work, distinguishing it from an unsupported precise duration.',
    inferences: [['all-night', 'The baker worked all night without stopping'], ['already', 'The baker had started work before Ren arrived'], ['closed', 'The bakery had made no bread yet']],
    clues: [['loaves', 'Six warm loaves were cooling on the counter'], ['tray', 'The baker took another tray from the oven'], ['sign', 'The shop sign was blue']], pairs: [['already', 'loaves'], ['already', 'tray']],
    unsupported: { 'all-night': 'Finished bread implies earlier work, but not work throughout the entire night.', closed: 'Cooling loaves show bread has already been made.' },
    explanation: 'The finished loaves or another tray from the oven support work starting before Ren arrived; neither tells us it lasted all night.', hints: ['Separate what the evidence suggests from an exact detail it cannot establish.', 'Ask whether your chosen clue shows work already done.'] },
  { key: 'quiet-repair', skill: 'E09', band: 'core',
    text: 'A baby slept beside the workroom. Sol wrapped a cloth around the loose latch before testing it, so its rattle was muffled. He also closed the workroom door gently. A red toolbox sat on the floor.',
    question: 'Why did Sol probably take these actions? Choose a reason and one supporting clue.', demand: 'Infer a motive linking actions to a nearby situation; both noise-reducing actions support the motive.',
    inferences: [['hide', 'To hide the red toolbox'], ['sleep', 'To avoid waking the baby'], ['break', 'To break the door']],
    clues: [['latch', 'He muffled the latch’s rattle with a cloth'], ['door', 'He closed the door gently'], ['box', 'A red toolbox sat on the floor']], pairs: [['sleep', 'latch'], ['sleep', 'door']],
    unsupported: { hide: 'The toolbox remains on the floor; the actions reduce noise rather than conceal it.', break: 'Muffling a latch and closing gently do not support an intention to break the door.' },
    explanation: 'Muffling the latch or closing gently would reduce noise near the sleeping baby, supporting that motive.', hints: ['Connect the actions with the nearby situation.', 'Choose evidence of what the actions achieve, rather than an unrelated object.'] },
  { key: 'seed-tray', skill: 'E09', band: 'core',
    text: 'In the growing tray, one shoot leaned towards the window. Each new leaf had opened on the brighter side. The gardener left the tray in the same position and kept watering it. A label showed the planting date.',
    question: 'If these conditions continue, which prediction is best supported? Choose it and a clue.', demand: 'Use an observed pattern to justify a qualified prediction; reject an ungrounded dramatic change.',
    inferences: [['window', 'New growth will probably favour the window side'], ['blue', 'The leaves will probably turn blue'], ['stop', 'All growth will certainly stop tomorrow']],
    clues: [['leaves', 'Each new leaf had opened on the brighter side'], ['date', 'A label showed the planting date'], ['watering', 'The gardener kept watering it']], pairs: [['window', 'leaves']],
    unsupported: { blue: 'Nothing in the account supports a change to blue leaves.', stop: 'The account describes continued growth and care, not a certain stop tomorrow.' },
    explanation: 'The repeated growth on the brighter side supports that pattern continuing, although it is a prediction rather than a certainty.', hints: ['Find a pattern that has already happened.', 'Use a clue that supports the direction of the prediction, not just growth in general.'] },
  { key: 'sheltered-gauge', skill: 'E09', band: 'stretch',
    text: '“The whole garden stayed dry,” said the keeper, pointing to an empty rain gauge. Mira looked up: a broad new canopy covered the gauge. Beyond the canopy, puddles filled the open path. The keeper had not visited that path since morning.',
    question: 'Which judgement of the keeper’s claim is supported? Choose it and a sufficient clue.', demand: 'Evaluate a broad claim against limited observation and counterevidence; selected Years 5–6 evidence and viewpoint demand.',
    inferences: [['certain', 'The empty gauge proves the whole garden stayed dry'], ['doubt', 'The empty gauge is not enough to show the whole garden stayed dry'], ['liar', 'The keeper is deliberately lying']],
    clues: [['canopy', 'A broad canopy covered the gauge'], ['puddles', 'Puddles filled the open path'], ['morning', 'The keeper had not visited that path since morning']], pairs: [['doubt', 'canopy'], ['doubt', 'puddles'], ['doubt', 'morning']],
    unsupported: { certain: 'A sheltered gauge cannot represent the whole garden, and there is water on the open path.', liar: 'A mistaken or poorly supported claim does not establish deliberate dishonesty.' },
    explanation: 'The shelter limits the gauge’s evidence; the puddles challenge the claim; not visiting the path leaves a gap in the keeper’s observations. Each supports doubt, but none establishes deliberate deception.', hints: ['Compare the size of the claim with the area actually observed.', 'Distinguish evidence against a claim from evidence about someone’s intention.'] },
  { key: 'waiting-chair', skill: 'E09', band: 'stretch',
    text: 'Each afternoon Len set two cups beside the window, though only he sat there. When footsteps passed, he turned towards the door. When they faded, he left the second cup untouched. No visitor’s name or reason for absence appeared in his notebook.',
    question: 'Which interpretation is supported without inventing a visitor’s identity? Choose it and a clue.', demand: 'Combine repeated behaviour and qualified interpretation while rejecting an attractive unsupported backstory; selected Years 5–6 text demand.',
    inferences: [['sister', 'He is certainly waiting for his sister'], ['waiting', 'He seems to be hoping for company'], ['dislike', 'He does not want anyone to visit']],
    clues: [['cups', 'He set two cups though only he sat there'], ['steps', 'He turned towards the door when footsteps passed'], ['notebook', 'No visitor’s name appeared in his notebook']], pairs: [['waiting', 'cups'], ['waiting', 'steps']],
    unsupported: { sister: 'The text does not identify a sister or any particular visitor.', dislike: 'The extra cup and attention to footsteps support welcome or expectation, not rejection of visitors.' },
    explanation: 'Preparing an extra cup or turning at footsteps supports hoping for company. The text leaves who and why unstated.', hints: ['Notice what is repeated but never explained outright.', 'Keep the interpretation modest: do not add an identity the text withholds.'] },
  { key: 'muddy-threshold', skill: 'E09', band: 'stretch',
    text: 'The storeroom floor was clean when the keeper left. On her return, muddy bootprints ran from the open doorway to the seed shelf. The shelf looked undisturbed. Many villagers wore boots of that size, and the keeper had seen nobody enter.',
    question: 'Which conclusion is supported by the account? Choose it and a clue.', demand: 'Distinguish evidence for an event from unsupported identity or theft claims; selected Years 5–6 reasoned justification.',
    inferences: [['theft', 'Someone certainly stole seeds'], ['entry', 'Someone with muddy boots probably entered the storeroom'], ['keeper', 'The keeper can identify exactly who entered']],
    clues: [['prints', 'Muddy bootprints ran from the doorway to the shelf'], ['shelf', 'The shelf looked undisturbed'], ['size', 'Many villagers wore boots of that size']], pairs: [['entry', 'prints']],
    unsupported: { theft: 'Prints show movement, not missing seeds; the shelf looked undisturbed.', keeper: 'Many people fit the boot size and nobody was seen entering, so identity is not established.' },
    explanation: 'The new muddy trail supports entry by someone in muddy boots, but it does not establish theft or identity.', hints: ['Separate evidence that something happened from evidence about who did it.', 'Check whether the conclusion adds a fact the trace cannot show.'] },
];

const sequences: readonly SequenceItem[] = [
  { key: 'planted-seed', skill: 'E10', band: 'support', text: 'Tell the seed’s story in time order. Use each sentence once.', question: 'Arrange the sentence tiles into a short story.',
    demand: 'Construct a three-event narrative using explicit temporal links and a continuing subject.',
    tiles: [['sprout', 'After that watering, a shoot rose from the seed.'], ['plant', 'Nia planted a seed in a pot.'], ['water', 'After planting it, she watered the seed.']], orders: [['plant', 'water', 'sprout']],
    constraint: 'Planting comes before the watering that follows planting; the later shoot closes this story.', explanation: 'Plant the seed, water it after planting, then describe the later shoot.',
    hints: ['Look for an opening that introduces the subject.', 'Check what each time word refers back to.'] },
  { key: 'found-note', skill: 'E10', band: 'support', text: 'Tell what happened to the folded note in time order. Use every sentence once.', question: 'Arrange the sentence tiles into a short story.',
    demand: 'Build a short narrative with an object introduced before actions on it and information used after discovery.',
    tiles: [['read', 'She unfolded the note and read the owner’s name.'], ['return', 'Using the name she had just read, she returned the note to its owner.'], ['find', 'Eli found a folded note beside the gate.']], orders: [['find', 'read', 'return']],
    constraint: 'The note must be found before it is unfolded; the name must be read before it is used to return the note.', explanation: 'Finding introduces the note; reading supplies the name needed for returning it.',
    hints: ['Find the sentence that introduces the object.', 'Ask what information a later action needs first.'] },
  { key: 'kite-rescue', skill: 'E10', band: 'core', text: 'Write a chronological account of this one rescue. Use all four sentences once; there is no flashback.', question: 'Arrange the sentence tiles into a coherent account.',
    demand: 'Coordinate four narrative events through motivation, action and consequence without relying on numbered steps.',
    tiles: [['lift', 'Using the pole, Jo lifted the kite free.'], ['spot', 'Jo spotted a kite caught in a low branch.'], ['return', 'Once it was free, Jo handed the kite to its owner.'], ['fetch', 'Having spotted the trapped kite, Jo fetched a long pole.']], orders: [['spot', 'fetch', 'lift', 'return']],
    constraint: 'Spotting motivates fetching; the pole must be fetched before use; the kite must be freed before the handover.', explanation: 'The account moves from spotting the problem to fetching a tool, freeing the kite and handing it back.',
    hints: ['Find the problem that starts the account.', 'Check that each action has what it needs from an earlier sentence.'] },
  { key: 'picnic-preparation', skill: 'E10', band: 'core', text: 'Tell this picnic story in time order. The two packing jobs can be described in either order. Both happen after the basket is opened and before it is shut.', question: 'Arrange all four sentence tiles.',
    demand: 'Respect a narrative opening and closure while recognising two independent middle events; no unique order is invented.',
    tiles: [['fruit', 'Mina put fruit in the open basket.'], ['close', 'With both jobs done, Mina shut the packed basket.'], ['open', 'Mina opened the empty picnic basket.'], ['cloth', 'Mina put a folded cloth in the open basket.']], orders: [['open', 'fruit', 'cloth', 'close'], ['open', 'cloth', 'fruit', 'close']],
    constraint: 'The basket is opened first and shut after both packing jobs; neither packing job has priority over the other.', explanation: 'Open the basket, include both packing jobs in either order, then close it.',
    hints: ['Look for the conditions needed by the middle actions.', 'Do not impose an order where the story gives neither action priority.'] },
  { key: 'puppet-show', skill: 'E10', band: 'stretch', text: 'Tell this preparation story chronologically. The stage and puppet jobs can overlap. Describe each job’s preparation before its result, and end with the show after both jobs are finished.', question: 'Arrange all five tiles into one valid account.',
    demand: 'Coordinate two independent causal chains and a shared ending; additional narrative organisation demand within Years 3–4.',
    tiles: [['show', 'With the stage ready and the puppet mended, the show began.'], ['mend', 'Using that needle, Ivo mended the puppet.'], ['frame', 'Uma set up the stage frame.'], ['needle', 'Ivo fetched a needle for the torn puppet.'], ['curtain', 'Uma hung the curtain on the frame, finishing the stage.']],
    orders: [['frame', 'curtain', 'needle', 'mend', 'show'], ['frame', 'needle', 'curtain', 'mend', 'show'], ['frame', 'needle', 'mend', 'curtain', 'show'], ['needle', 'mend', 'frame', 'curtain', 'show'], ['needle', 'frame', 'mend', 'curtain', 'show'], ['needle', 'frame', 'curtain', 'mend', 'show']],
    constraint: 'The frame precedes its curtain; the needle precedes its use; both finished jobs precede the show. All interleavings that respect those links are valid.', explanation: 'Frame before curtain, needle before mending, and show after both completed jobs. Either job may start first.',
    hints: ['Follow each character’s connected actions separately.', 'Combine the two chains without reversing a dependency; then check the ending.'] },
];

const edits: readonly ChoiceItem[] = [
  { key: 'clear-owner', skill: 'E10', band: 'support', text: 'Story facts: Tess carried her own bag. Noor carried a lamp.\nDraft: Tess met Noor. She put her bag down.', question: 'Choose an edit that makes the bag’s owner clear and keeps the facts.',
    demand: 'Choose an explicit noun reference to resolve a locally ambiguous pronoun in a short narrative.',
    options: [['tess', 'Tess met Noor. Tess put her bag down.'], ['noor', 'Tess met Noor. Noor put her bag down.'], ['same', 'Tess met Noor. She put her bag down.']], accepted: ['tess'],
    rejected: { noor: 'The facts assign the bag to Tess, not Noor.', same: 'She still has two possible referents, so the owner remains unclear.' },
    explanation: 'Naming Tess makes the bag’s owner explicit and preserves the supplied facts.', hints: ['Check who owns the object in the story facts.', 'Replace a reference that could point to either person with a clear name.'] },
  { key: 'past-account', skill: 'E10', band: 'core', text: 'This is a past-tense account of a finished journey.\nDraft: We crossed the bridge and enter the hall. Inside, we rested.', question: 'Choose the complete edit that keeps the journey in the past.',
    demand: 'Edit tense consistency across a linked account, retaining event sequence and meaning.',
    options: [['present', 'We cross the bridge and enter the hall. Inside, we rested.'], ['past', 'We crossed the bridge and entered the hall. Inside, we rested.'], ['future', 'We crossed the bridge and will enter the hall. Inside, we rested.']], accepted: ['past'],
    rejected: { present: 'The opening remains present tense while the finished account and rested are past.', future: 'Will enter changes the completed entrance into a future action.' },
    explanation: 'Crossed, entered and rested consistently describe the finished journey.', hints: ['Read the account as one piece, rather than one verb alone.', 'Check whether each action belongs to the same time as the surrounding actions.'] },
  { key: 'two-lanterns', skill: 'E10', band: 'core', text: 'Story facts: A brass lantern was cracked. A wooden lantern was sound. Both stood on a shelf.\nDraft: Suri lifted the lantern. It was cracked.', question: 'Choose an edit that clearly identifies the damaged lantern and keeps all these facts.',
    demand: 'Evaluate complete alternatives for referent clarity and factual consistency; accept two legitimate formulations.',
    options: [['brass-first', 'Suri lifted the brass lantern. It was cracked.'], ['wooden', 'Suri lifted the wooden lantern. It was cracked.'], ['cracked-first', 'Suri lifted the cracked lantern. It was made of brass.'], ['both', 'Suri lifted both lanterns. They were cracked.']], accepted: ['brass-first', 'cracked-first'],
    rejected: { wooden: 'The wooden lantern is sound in the supplied facts.', both: 'Only the brass lantern is cracked; they were cracked changes the facts.' },
    explanation: 'Either naming brass first or naming the cracked lantern first uniquely identifies the damaged lantern without changing the facts.', hints: ['Check each description against the story facts.', 'An edit can be clear in more than one way; reject only those that change or obscure the meaning.'] },
  { key: 'uncertain-visitor', skill: 'E10', band: 'stretch', text: 'Story facts: Lio heard a knock but could not see the visitor. He guessed it might be the courier.\nDraft: The courier was definitely outside. Lio went to open the door.', question: 'Choose an edit that preserves Lio’s uncertainty and the next action.',
    demand: 'Edit narrative viewpoint and degree of certainty without adding facts; selected Years 5–6 meaning and effect demand.',
    options: [['might', 'The visitor might be the courier, Lio thought. He went to open the door.'], ['must', 'The visitor must be the courier, Lio knew. He went to open the door.'], ['denial', 'Lio knew the visitor was not the courier. He went to open the door.'], ['wonder', 'Lio wondered whether the courier had arrived. He went to open the door.']], accepted: ['might', 'wonder'],
    rejected: { must: 'Must and knew replace a guess with certainty unsupported by what Lio can see.', denial: 'The facts do not establish that the visitor is someone else.' },
    explanation: 'Might or wondered whether preserves the guess; both keep Lio going to the door.', hints: ['Compare what the character knows with what the draft asserts.', 'Check that the edit keeps both the degree of certainty and the action.'] },
  { key: 'cause-and-contrast', skill: 'E10', band: 'stretch', text: 'Story facts: The shutters blocked the wind, but a gap in the roof still let rain in. The room stayed draught-free and wet.\nDraft: The shutters blocked the wind. The room was dry.', question: 'Choose a complete edit that keeps both effects and their contrast.',
    demand: 'Evaluate paragraph meaning across two causes and contrasting outcomes, accepting equivalent cohesive constructions; selected Years 5–6 editing demand.',
    options: [['because', 'The room was dry because the shutters blocked the wind, although the roof had a gap.'], ['although', 'Although the shutters kept out the wind, rain came through the roof gap, leaving the room wet.'], ['both', 'The shutters kept out both wind and rain, so the room stayed dry.'], ['but', 'The shutters kept the room draught-free, but rain through the roof gap left it wet.']], accepted: ['although', 'but'],
    rejected: { because: 'The shutters block wind, not the rain entering through the roof; the room is wet.', both: 'The supplied facts say rain still enters through the roof, so neither both nor dry preserves them.' },
    explanation: 'Both although and but versions keep wind blocked and rain entering, preserving the contrast and the wet room.', hints: ['Track the effect of each part of the building separately.', 'Check the final condition of the room as well as the linking word.'] },
];

const objectives = { E08: 'E08-retrieval-instructions', E09: 'E09-inference-prediction', E10: 'E10-narrative-editing' } as const;
function base(item: Base): Omit<TaskDefinition, 'responseSpec' | 'answerRule'> {
  const descriptor = { familyId: 'english.reading-writing', equivalenceVersion: 'r1', authoredKey: item.key, parameters: {} } as const;
  const upper = (item.skill === 'E09' && item.band === 'stretch') || ['uncertain-visitor', 'cause-and-contrast'].includes(item.key);
  const section = item.skill === 'E08' ? 'Reading — comprehension: retrieve and record information from non-fiction'
    : item.skill === 'E09' ? 'Reading — comprehension: inference, justification and prediction'
      : 'Writing — composition: drafting narratives; evaluating and editing for clarity and consistency';
  return { canonicalQuestionId: canonicalQuestionId(descriptor), descriptor, contentRevision: '1',
    skillId: item.skill, objectiveId: objectives[item.skill], band: item.band, contextualSkillIds: [],
    curriculum: { sourceUrl, section, programmeBand: upper ? 'Years 5–6 (selected text demand)' : 'Years 3–4' },
    demandRationale: item.demand, instructionText: item.question, assessedText: item.text, stimulus: null,
    explanation: item.explanation, hints: [{ id: `${item.key}-h1`, text: item.hints[0] }, { id: `${item.key}-h2`, text: item.hints[1] }],
    workedSupport: { id: `${item.key}-worked`, text: `Worked support: ${item.explanation}` },
    narration: { neutralText: item.question, assessedTextMayBeSpokenBeforeCheck: true },
    review: { status: 'approved', reviewer: 'WP03-12A author: model-assisted semantic review; independent release review pending',
      rationale: `Original bounded text and complete finite answer space reviewed; ${item.demand}`, evidenceRef: `${reviewRef}#${item.key}` } };
}
function makeChoice(item: ChoiceItem): TaskDefinition {
  const slot = item.skill === 'E08' ? 'answer' : 'edit';
  return { ...base(item), responseSpec: { kind: 'choice', slots: [{ id: slot, label: item.question, options: options(item.options) }], requiredSlotIds: [slot] },
    answerRule: { kind: 'accepted-responses', responses: item.accepted.map(id => choice(slot, id)) } };
}
function makeInference(item: InferenceItem): TaskDefinition {
  return { ...base(item), responseSpec: { kind: 'choice', slots: [{ id: 'inference', label: 'Inference or prediction', options: options(item.inferences) }, { id: 'clue', label: 'Supporting clue from the text', options: options(item.clues) }], requiredSlotIds: ['inference', 'clue'] },
    answerRule: { kind: 'accepted-responses', responses: item.pairs.map(([i, c]) => pair(i, c)) } };
}
function makeSequence(item: SequenceItem): TaskDefinition {
  return { ...base(item), responseSpec: { kind: 'sequence', tiles: options(item.tiles), cardinality: { min: item.tiles.length, max: item.tiles.length } },
    answerRule: { kind: 'accepted-responses', responses: item.orders.map(orderedIds => ({ kind: 'sequence', orderedIds })) } };
}

export const READING_WRITING_TASKS: readonly TaskDefinition[] = freeze([
  ...retrieval.map(makeChoice), ...inference.map(makeInference), ...sequences.map(makeSequence), ...edits.map(makeChoice),
]);

/** Post-Check feedback only. These dispositions must never be rendered as hints
 * or source alternatives before Check. E09 receives one result, never clue credit. */
export const READING_WRITING_DISPOSITIONS = freeze({
  choices: Object.fromEntries([...retrieval, ...edits].map(item => [item.key, item.rejected])),
  inferences: Object.fromEntries(inference.map(item => [item.key, item.unsupported])),
  sequences: Object.fromEntries(sequences.map(item => [item.key, item.constraint])),
});
const task = (key: string) => READING_WRITING_TASKS.find(row => row.descriptor.authoredKey === key)!;
const ids = (skill: Skill, kind: 'choice' | 'sequence') => READING_WRITING_TASKS.filter(row => row.skillId === skill && row.responseSpec.kind === kind).map(row => row.canonicalQuestionId);
/** Proposals only: WP03-13A owns the central binding table. */
export const READING_WRITING_BINDING_PROPOSALS: readonly QuestActivityBinding[] = freeze([
  { bindingId: 'q7-story-e10-sequence', questId: 'Q7', availability: 'M2', role: 'story', skillId: 'E10', taskIds: ids('E10', 'sequence'), mechanic: 'sequencing', responseKind: 'sequence', sourceBindingId: null },
  { bindingId: 'q8-story-e08-clue', questId: 'Q8', availability: 'M2', role: 'story', skillId: 'E08', taskIds: ids('E08', 'choice'), mechanic: 'consequential-selection', responseKind: 'choice', sourceBindingId: null },
  { bindingId: 'q7-revisit-e10-choice', questId: 'Q7', availability: 'M2', role: 'revisit', skillId: 'E10', taskIds: ids('E10', 'choice'), mechanic: 'consequential-selection', responseKind: 'choice', sourceBindingId: null },
  { bindingId: 'q8-revisit-e09-choice', questId: 'Q8', availability: 'M2', role: 'revisit', skillId: 'E09', taskIds: ids('E09', 'choice'), mechanic: 'consequential-selection', responseKind: 'choice', sourceBindingId: null },
  { bindingId: 'q10-revisit-e10-choice', questId: 'Q10', availability: 'M2', role: 'revisit', skillId: 'E10', taskIds: ids('E10', 'choice'), mechanic: 'consequential-selection', responseKind: 'choice', sourceBindingId: null },
]);

export const READING_WRITING_MANIFEST: TaskFamilyManifest = freeze({ moduleId: 'expansion-reading-writing', familyIds: ['english.reading-writing'],
  taskIds: READING_WRITING_TASKS.map(row => row.canonicalQuestionId), retainedTaskIds: [],
  domainDescription: '30 original authored E08–E10 tasks; each skill 3 support/4 core/3 stretch. Finite retrieval, joint inference/clue, narrative sequences and complete edits. Text-only; no new starter identities.',
  reviewEvidenceRef: reviewRef,
  cases: [
    { caseId: 'retrieval-support', canonicalQuestionId: task('bench-note').canonicalQuestionId, response: choice('answer', 'box'), expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
    { caseId: 'inference-alt-clue', canonicalQuestionId: task('first-reading').canonicalQuestionId, response: pair('worried', 'hands'), expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
    { caseId: 'inference-wrong-clue', canonicalQuestionId: task('first-reading').canonicalQuestionId, response: pair('worried', 'curtain'), expectedStatus: 'judged', expectedCorrect: false, expectedIssueCodes: ['unsupported-clue'] },
    { caseId: 'inference-unsupported', canonicalQuestionId: task('early-baker').canonicalQuestionId, response: pair('all-night', 'loaves'), expectedStatus: 'judged', expectedCorrect: false, expectedIssueCodes: ['unsupported-inference'] },
    { caseId: 'inference-partial', canonicalQuestionId: task('first-reading').canonicalQuestionId, response: choice('inference', 'worried'), expectedStatus: 'incomplete', expectedIssueCodes: [] },
    { caseId: 'sequence-support', canonicalQuestionId: task('found-note').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['find', 'read', 'return'] }, expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
    { caseId: 'sequence-alternative', canonicalQuestionId: task('picnic-preparation').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['open', 'cloth', 'fruit', 'close'] }, expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
    { caseId: 'editing-alternative', canonicalQuestionId: task('uncertain-visitor').canonicalQuestionId, response: choice('edit', 'wonder'), expectedStatus: 'judged', expectedCorrect: true, expectedIssueCodes: [] },
  ],
});

const neutral: LearningAssistance = { answerHintUsed: false, workedSupportUsed: false, assessedTextReadAloud: false, evidenceMode: 'independent' };
type HandoffCase = Readonly<{
  caseId: string; bindingId: string; canonicalQuestionId: string; response: ActivityResponse;
  expectedStatus: 'judged' | 'incomplete'; expectedCorrect?: boolean;
  expectedEvidenceMode: LearningAssistance['evidenceMode']; expectedAssistance: LearningAssistance;
  consumer: 'WP02-10A' | 'WP04-07A' | 'WP06'; scenario: string;
}>;
/** Expectations for downstream controls/commit/reload/published checks, not
 * observations that those checks have already happened. */
export const READING_WRITING_HANDOFF_CASES: readonly HandoffCase[] = freeze([
  { caseId: 'q8-retrieve-neutral', bindingId: 'q8-story-e08-clue', canonicalQuestionId: task('bench-note').canonicalQuestionId, response: choice('answer', 'box'),
    expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', expectedAssistance: neutral, consumer: 'WP02-10A', scenario: 'Narrate instructions only, answer via keyboard/tap, then Check. One E08 result.' },
  { caseId: 'q8-retrieve-listening', bindingId: 'q8-story-e08-clue', canonicalQuestionId: task('bench-note').canonicalQuestionId, response: choice('answer', 'box'),
    expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'listening-supported', expectedAssistance: { ...neutral, assessedTextReadAloud: true, evidenceMode: 'listening-supported' }, consumer: 'WP04-07A', scenario: 'Record assessed-text narration before speech, save/reload, then Check. Supported reading evidence; ordinary unhinted first-success points unchanged.' },
  { caseId: 'q8-inference-clue-only', bindingId: 'q8-revisit-e09-choice', canonicalQuestionId: task('first-reading').canonicalQuestionId, response: choice('clue', 'hands'),
    expectedStatus: 'incomplete', expectedEvidenceMode: 'independent', expectedAssistance: neutral, consumer: 'WP02-10A', scenario: 'Choose only the clue. No attempt, learning observation or reward; request the inference.' },
  { caseId: 'q8-inference-wrong-clue', bindingId: 'q8-revisit-e09-choice', canonicalQuestionId: task('first-reading').canonicalQuestionId, response: pair('worried', 'curtain'),
    expectedStatus: 'judged', expectedCorrect: false, expectedEvidenceMode: 'independent', expectedAssistance: neutral, consumer: 'WP02-10A', scenario: 'Complete unsupported pairing produces one E09 wrong Check and specific clue feedback, no second clue skill or success award.' },
  { caseId: 'q8-inference-listening', bindingId: 'q8-revisit-e09-choice', canonicalQuestionId: task('first-reading').canonicalQuestionId, response: pair('worried', 'hands'),
    expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'listening-supported', expectedAssistance: { ...neutral, assessedTextReadAloud: true, evidenceMode: 'listening-supported' }, consumer: 'WP06', scenario: 'On the integrated published candidate, hear the assessed passage, use both controls and Check; verify qualified evidence and unchanged ordinary points. Actual listening remains unverified here.' },
  { caseId: 'q7-sequence-support', bindingId: 'q7-story-e10-sequence', canonicalQuestionId: task('found-note').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['find', 'read', 'return'] },
    expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', expectedAssistance: neutral, consumer: 'WP02-10A', scenario: 'Support-band three-tile story through real keyboard/tap sequencing. Only this story binding satisfies its required beat.' },
  { caseId: 'q7-sequence-alternative', bindingId: 'q7-story-e10-sequence', canonicalQuestionId: task('picnic-preparation').canonicalQuestionId, response: { kind: 'sequence', orderedIds: ['open', 'cloth', 'fruit', 'close'] },
    expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', expectedAssistance: neutral, consumer: 'WP04-07A', scenario: 'Save the alternative valid tile order and reload before Check. Preserve canonical identity, binding provenance and ordered IDs.' },
  { caseId: 'q10-edit-worked-reload', bindingId: 'q10-revisit-e10-choice', canonicalQuestionId: task('uncertain-visitor').canonicalQuestionId, response: choice('edit', 'wonder'),
    expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', expectedAssistance: { ...neutral, workedSupportUsed: true }, consumer: 'WP04-07A', scenario: 'Use explicit worked support, save/reload and choose the alternative valid edit. Sticky help gives supported success even though the reading evidenceMode remains independent; never recreate a first unassisted opportunity.' },
  { caseId: 'q7-edit-hint', bindingId: 'q7-revisit-e10-choice', canonicalQuestionId: task('clear-owner').canonicalQuestionId, response: choice('edit', 'tess'),
    expectedStatus: 'judged', expectedCorrect: true, expectedEvidenceMode: 'independent', expectedAssistance: { ...neutral, answerHintUsed: true }, consumer: 'WP06', scenario: 'Use a hint in the published optional edit, navigate away and resume. Hint remains sticky; optional revisit cannot substitute for q7-story-e10-sequence.' },
]);
