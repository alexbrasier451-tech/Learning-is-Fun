import type { ActivityResponse, DifficultyBand, QuestActivityBinding, ResponseSpec, TaskDefinition, TaskDescriptor, TaskFamilyManifest, TaskStimulus } from '../../learning/contracts';
import { canonicalQuestionId } from '../../learning/identity';
import { SKILLS } from '../skills';

const evidence = 'docs/content-review/expansion-quantities.md';
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
type Authored = {
  key: string; skill: 'M05' | 'M06' | 'M07'; band: DifficultyBand; year: 3 | 4 | 5;
  givens: Record<string, number | string>; prompt: string; demand: string;
  hints: [string, string]; worked: string; spec: ResponseSpec; answer: ActivityResponse;
  stimulus?: TaskStimulus;
};
const fractions = [1, 2, 3, 4, 5, 6, 8, 10, 12] as const;
function quantity(numerator: number, denominator: number, unit: string, max: number,
  allowedDenominators: readonly number[] = [1], units: readonly string[] = [unit], form: 'exact' | 'equivalent' = 'equivalent') {
  return {
    spec: { kind: 'quantity', slots: [{ id: 'answer', label: 'Requested quantity', numeratorBounds: { min: 0, max }, allowedDenominators, units, form }], requiredSlotIds: ['answer'] } satisfies ResponseSpec,
    answer: { kind: 'quantity', values: { answer: { numerator, denominator, unit } } } satisfies ActivityResponse,
  };
}
function choice(labels: readonly string[], correctIndex: number) {
  return {
    spec: { kind: 'choice', slots: [{ id: 'answer', label: 'Choose one answer', options: labels.map((label, i) => ({ id: `option-${i + 1}`, label })) }], requiredSlotIds: ['answer'] } satisfies ResponseSpec,
    answer: { kind: 'choice', choices: { answer: `option-${correctIndex + 1}` } } satisfies ActivityResponse,
  };
}
function matching(items: readonly string[], targets: readonly string[], answers: readonly number[]) {
  return {
    spec: { kind: 'matching', items: items.map((label, i) => ({ id: `item-${i + 1}`, label })), targets: targets.map((label, i) => ({ id: `target-${i + 1}`, label })), requiredItemIds: items.map((_, i) => `item-${i + 1}`), uniqueTargets: true } satisfies ResponseSpec,
    answer: { kind: 'matching', pairs: Object.fromEntries(answers.map((target, i) => [`item-${i + 1}`, `target-${target + 1}`])) } satisfies ActivityResponse,
  };
}
function fraction(numerator: number, denominator: number, wholeCount: number): TaskStimulus {
  return { kind: 'fraction', numerator, denominator, wholeCount, labels: ['Equal wholes; equal parts within every whole'],
    accessibleDescription: `${wholeCount} equal whole strips are shown. Each whole is partitioned into ${denominator} equal parts. Across the strips, ${numerator} parts are shaded.` };
}
function path(first: string, second: string): TaskStimulus {
  return { kind: 'diagram', closed: false,
    points: [{ id: 'a', x: 10, y: 25, label: 'Gate' }, { id: 'b', x: 45, y: 65, label: 'Well' }, { id: 'c', x: 90, y: 25, label: 'Garden' }],
    edges: [{ id: 'ab', from: 'a', to: 'b', label: first }, { id: 'bc', from: 'b', to: 'c', label: second }],
    labels: ['Use the labelled route Gate → Well → Garden. Drawing is not to scale.'],
    accessibleDescription: `The route runs from Gate to Well, labelled ${first}, then from Well to Garden, labelled ${second}. The drawing is not to scale.` };
}

// Authored finite source tuples, not a runtime generator. Keys describe the
// assessed relation; givens preserve substantive quantities independently of UI.
const authored: readonly Authored[] = [
  { key: 'shaded-half', skill: 'M05', band: 'support', year: 3, givens: { shaded: 1, partition: 2, wholes: 1 },
    prompt: 'What fraction of one whole strip is shaded? Equivalent fractions are welcome.',
    demand: 'Year 3 represented part/whole consolidation: identify the unit whole and its equal shaded part; equivalent forms do not change the quantity.',
    hints: ['Find one whole strip and count its equal parts.', 'Count the shaded parts. Put the shaded count over the parts in one whole.'],
    worked: 'One of two equal parts is shaded: 1/2 of a whole. Multiplying both counts by two gives the equivalent fraction 2/4.',
    stimulus: fraction(1, 2, 1), ...quantity(1, 2, 'whole', 24, fractions) },
  { key: 'shaded-quarters-form', skill: 'M05', band: 'support', year: 3, givens: { shaded: 2, partition: 4, wholes: 1, required: 'quarters' },
    prompt: 'Write the shaded fraction with denominator 4, to describe the parts drawn. Keep the denominator 4 even if another fraction has the same value.',
    demand: 'Year 3 represented fractions: name the actual quarter partitions, retaining the specified denominator rather than substituting an equivalent half.',
    hints: ['The denominator tells how many equal parts make one whole.', 'Keep the requested denominator and count the shaded quarter-parts for the numerator.'],
    worked: 'There are four equal parts in the whole and two are shaded, so the requested form is 2/4. The equal value 1/2 does not name the drawn quarter-parts.',
    stimulus: fraction(2, 4, 1), ...quantity(2, 4, 'whole', 24, fractions, ['whole'], 'exact') },
  { key: 'third-of-counters', skill: 'M05', band: 'support', year: 3, givens: { count: 12, fractionNumerator: 1, fractionDenominator: 3 },
    prompt: 'Share 12 counters equally into 3 groups. One group is one third of the counters. How many counters are in that group?',
    demand: 'Year 3 unit fraction of a discrete set with the equal-sharing operation explicitly supplied; only whole counters are reachable.',
    hints: ['All groups must contain the same number of counters.', 'Share the entire set equally; check that three copies of your group reconstruct the set.'],
    worked: '12 ÷ 3 = 4 counters in each group. One third of 12 is 4 counters.', ...quantity(4, 1, 'count', 12) },
  { key: 'equivalent-sixths', skill: 'M05', band: 'core', year: 4, givens: { numerator: 2, denominator: 3, requiredDenominator: 6 },
    prompt: 'Write a fraction equal to 2/3 with denominator 6. Keep denominator 6 in your answer.',
    demand: 'Year 4 common equivalent fractions: coordinate numerator and denominator scaling while retaining an assessed sixths form.',
    hints: ['Compare the given denominator with the requested denominator.', 'Multiply both parts of a fraction by the same factor to preserve its value.'],
    worked: '3 × 2 = 6, so 2 × 2 = 4. The requested fraction is 4/6; 2/3 has the same value but is not in sixths.',
    ...quantity(4, 6, 'whole', 24, fractions, ['whole'], 'exact') },
  { key: 'three-quarters-of-beads', skill: 'M05', band: 'core', year: 4, givens: { count: 20, numerator: 3, denominator: 4 },
    prompt: 'A box holds 20 beads. Use 3/4 of them for a potion label. How many beads do you use?',
    demand: 'Year 4 non-unit fraction of a quantity: find one equal part then combine three parts, without an explicit sharing scaffold.',
    hints: ['The denominator tells how many equal shares form the whole set.', 'Find one share before combining the number of shares named by the numerator.'],
    worked: 'One quarter of 20 is 20 ÷ 4 = 5. Three quarters is 3 × 5 = 15 beads.', ...quantity(15, 1, 'count', 20) },
  { key: 'add-eighths', skill: 'M05', band: 'core', year: 4, givens: { first: 3, second: 2, denominator: 8 },
    prompt: 'One ribbon piece is 3/8 of a whole ribbon and another is 2/8 of the same whole. What fraction of a whole is their combined length? Equivalent fractions are welcome.',
    demand: 'Year 4 same-denominator addition: combine like fractional units while keeping the unit whole fixed.',
    hints: ['Both measurements use the same size fractional part.', 'Combine the counts of these parts; the size of each part stays fixed.'],
    worked: '3 eighths + 2 eighths = 5 eighths, or 5/8 of a whole ribbon.', ...quantity(5, 8, 'whole', 24, fractions) },
  { key: 'subtract-tenths', skill: 'M05', band: 'core', year: 4, givens: { first: 9, removed: 4, denominator: 10 },
    prompt: 'A bottle contains 9/10 of a full bottle. Pour out 4/10 of a full bottle. What fraction of a full bottle remains? Equivalent fractions are welcome.',
    demand: 'Year 4 same-denominator subtraction: interpret the removed amount relative to the full bottle, retaining its unit whole.',
    hints: ['Both fractions refer to a full bottle, not to different starting amounts.', 'Subtract the number of removed parts while keeping the fractional part size.'],
    worked: '9 tenths − 4 tenths = 5 tenths. 5/10 and 1/2 both describe the remaining fraction.', ...quantity(5, 10, 'whole', 24, fractions) },
  { key: 'reverse-three-fifths', skill: 'M05', band: 'stretch', year: 4, givens: { selected: 12, numerator: 3, denominator: 5 },
    prompt: '12 beads are 3/5 of all the beads in a bag. How many beads are in the whole bag?',
    demand: 'Less-direct Year 4 fraction-of-quantity reasoning: undo the non-unit fraction to find one fifth, then reconstruct the unknown whole.',
    hints: ['The given count is several equal parts, not the whole bag.', 'Find one of those equal parts, then count enough parts to make the whole.'],
    worked: 'Three fifths is 12, so one fifth is 12 ÷ 3 = 4. Five fifths is 5 × 4 = 20 beads.', ...quantity(20, 1, 'count', 30) },
  { key: 'improper-mixed-quarters', skill: 'M05', band: 'stretch', year: 5, givens: { shaded: 7, partition: 4, wholes: 2 },
    prompt: 'How much of one whole strip is shaded across both strips? Choose the answer written as a mixed number.',
    demand: 'Selected Year 5 improper/mixed conversion: carry quarter-parts across two equal wholes; retain the requested mixed-number representation.',
    hints: ['The denominator belongs to one whole strip, even though two strips are shown.', 'Group shaded parts into complete wholes, then describe the leftover parts.'],
    worked: 'Four shaded quarters make one whole. Three shaded quarters remain, so the mixed number is 1 3/4. The equal value 7/4 is not written as a mixed number.',
    stimulus: fraction(7, 4, 2), ...choice(['1 3/4', '7/4', '7/8', '2 3/4'], 0) },
  { key: 'compare-thirds-sixths', skill: 'M05', band: 'stretch', year: 5, givens: { firstNumerator: 2, firstDenominator: 3, secondNumerator: 5, secondDenominator: 6 },
    prompt: 'Two jars have the same full capacity. One is 2/3 full and one is 5/6 full. Which contains more?',
    demand: 'Selected Year 5 comparison where denominators are multiples: construct a common partition before comparing filled quantities.',
    hints: ['Keep both jars the same whole size.', 'Rewrite the fractions using a common denominator before comparing their numerators.'],
    worked: '2/3 = 4/6. Since 5/6 exceeds 4/6, the 5/6-full jar contains more.', ...choice(['The 2/3-full jar', 'The 5/6-full jar', 'They contain equal amounts'], 1) },

  { key: 'five-tenths-decimal', skill: 'M06', band: 'support', year: 4, givens: { tenths: 5 },
    prompt: 'Choose the decimal that means five tenths.',
    demand: 'Introductory Year 4 tenths representation: connect a named place-value unit to its decimal notation, without a second operation.',
    hints: ['Locate the tenths place immediately after the decimal point.', 'A tenth is smaller than a whole but larger than a hundredth.'],
    worked: 'Five tenths is 5/10, written 0.5. The notation 0.05 means five hundredths.', ...choice(['0.05', '0.5', '5.0'], 1) },
  { key: 'seven-hundredths-decimal', skill: 'M06', band: 'support', year: 4, givens: { hundredths: 7 },
    prompt: 'Choose the decimal that means seven hundredths.',
    demand: 'Introductory Year 4 hundredths representation: use a zero placeholder in the tenths column.',
    hints: ['The hundredths place is two places to the right of the decimal point.', 'Use a zero in a place that contains none of that unit.'],
    worked: 'Seven hundredths is 7/100, written 0.07. There are no whole units or tenths.', ...choice(['0.7', '7.00', '0.07'], 2) },
  { key: 'match-decimal-parts', skill: 'M06', band: 'support', year: 4, givens: { tenths: 3, hundredths: 3 },
    prompt: 'Match each named quantity to its decimal card. Use each card at most once.',
    demand: 'Introductory Year 4 contrasting place values: distinguish identical nonzero digits in the tenths and hundredths places across two mappings.',
    hints: ['Look at the place named in each quantity before looking at the digit.', 'A zero after the decimal point can hold an empty tenths place.'],
    worked: 'Three tenths matches 0.3; three hundredths matches 0.03. The digit is the same but its place changes its value.',
    ...matching(['Three tenths', 'Three hundredths'], ['0.03', '3.0', '0.3'], [2, 0]) },
  { key: 'compare-decimal-lengths', skill: 'M06', band: 'core', year: 4, givens: { firstHundredths: 70, secondHundredths: 65 },
    prompt: 'Both amounts use the same whole unit. Which is greater: 0.7 or 0.65?',
    demand: 'Year 4 decimal comparison to two places: compare unequal written lengths using place value, not the count of digits.',
    hints: ['Line up the decimal points and compare corresponding places.', 'A trailing zero after the final decimal digit does not change the amount.'],
    worked: '0.7 is 70 hundredths; 0.65 is 65 hundredths. Since 70 > 65, 0.7 is greater.', ...choice(['0.7', '0.65', 'They are equal'], 0) },
  { key: 'quarter-decimal-equivalence', skill: 'M06', band: 'core', year: 4, givens: { numerator: 3, denominator: 4 },
    prompt: 'Choose the decimal equivalent of 3/4 of a whole.',
    demand: 'Year 4 quarter/decimal equivalence: translate a common fraction into hundredths rather than copying fraction digits.',
    hints: ['Think how many hundredths make one quarter.', 'Combine three equal quarter amounts, or scale the fraction to hundredths.'],
    worked: '1/4 = 25/100, so 3/4 = 75/100 = 0.75.', ...choice(['0.34', '0.75', '0.25', '3.4'], 1) },
  { key: 'round-decimal-whole', skill: 'M06', band: 'core', year: 4, givens: { hundredths: 260 },
    prompt: 'Round 2.6 to the nearest whole number.',
    demand: 'Year 4 rounding a one-decimal number to a whole: identify the adjacent wholes and use the midpoint.',
    hints: ['Locate the two whole numbers on either side of the decimal.', 'Compare its position with the halfway point between those wholes.'],
    worked: '2.6 lies above the halfway point 2.5, so it is nearer 3 than 2. It rounds to 3.', ...choice(['2', '3', '2.5'], 1) },
  { key: 'extend-decimal-pattern', skill: 'M06', band: 'core', year: 4, givens: { startHundredths: 20, stepHundredths: 15, shownTerms: 3 },
    prompt: 'The pattern increases by the same amount each time: 0.20, 0.35, 0.50, __. Set the next value as a fraction of a whole. Equivalent values are welcome.',
    demand: 'Year 4 two-place decimal pattern: infer a constant hundredths increment and extend it without dropping the zero placeholder.',
    hints: ['Compare consecutive values to find the repeated increase.', 'Keep the increase in hundredths and add it to the final given value.'],
    worked: 'Each increase is 15 hundredths. 50 + 15 = 65 hundredths, so the next value is 65/100 = 0.65.', ...quantity(65, 100, 'whole', 150, [1, 10, 100]) },
  { key: 'missing-decimal-pattern', skill: 'M06', band: 'stretch', year: 4, givens: { firstHundredths: 45, thirdHundredths: 95, fourthHundredths: 120 },
    prompt: 'The pattern increases by the same amount each time: 0.45, __, 0.95, 1.20. Set the missing value as a fraction of a whole. Equivalent values are welcome.',
    demand: 'Less-direct Year 4 decimal pattern: infer the step from later adjacent terms and reconstruct an earlier term; the first visible gap spans two steps.',
    hints: ['Use two known neighbouring terms to find one step.', 'Work back from the next known term to the missing position.'],
    worked: '1.20 − 0.95 is 25 hundredths. 95 − 25 = 70 hundredths, so the missing value is 70/100 = 0.70 = 7/10.', ...quantity(70, 100, 'whole', 150, [1, 10, 100]) },
  { key: 'decimal-digit-constraints', skill: 'M06', band: 'stretch', year: 4, givens: { digitOne: 2, digitTwo: 5, digitThree: 7, lowerHundredths: 500, upperHundredths: 600 },
    prompt: 'Use the digits 2, 5 and 7 exactly once, with two digits after the decimal point. Choose the greatest possible number between 5 and 6.',
    demand: 'Less-direct Year 4 place-value reasoning: satisfy a whole-number interval and a digit-use constraint, then maximise the tenths position.',
    hints: ['Use the interval to decide which digit belongs in the whole-number place.', 'Among the remaining digits, the tenths place has greater value than the hundredths place.'],
    worked: 'The whole-number digit must be 5. Of the remaining digits, 7 belongs in the tenths place to make the greatest value, giving 5.72.', ...choice(['5.27', '5.72', '7.52', '5.77'], 1) },
  { key: 'round-to-tenth', skill: 'M06', band: 'stretch', year: 5, givens: { hundredths: 246, requiredPlaces: 1 },
    prompt: 'Round 2.46 to one decimal place. Choose the answer written with exactly one digit after the decimal point.',
    demand: 'Selected Year 5 rounding two decimal places to one: locate adjacent tenths and retain the assessed one-place notation.',
    hints: ['Locate the two adjacent tenths around the number.', 'Use the hundredths digit to decide which tenth is nearer, then check the requested written form.'],
    worked: '2.46 is between 2.4 and 2.5 and above the halfway point 2.45, so it rounds to 2.5. The equal value 2.50 is not written to one decimal place.', ...choice(['2.4', '2.5', '2.50', '2.46'], 1) },

  { key: 'path-metres', skill: 'M07', band: 'support', year: 3, givens: { first: 2, second: 3, sourceUnit: 'm', outputUnit: 'm' },
    prompt: 'Walk from Gate to Well to Garden along both labelled sections. How long is this route in metres?',
    demand: 'Year 3 supported measurement addition: sum two explicitly labelled lengths in the same unit; coordinates are not measurements.',
    hints: ['Follow the stated route and read each of its length labels.', 'Both lengths have the same unit, so combine their amounts and keep that unit.'],
    worked: 'Gate to Well is 2 m and Well to Garden is 3 m. 2 + 3 = 5 m for the full route.',
    stimulus: path('2 m', '3 m'), ...quantity(5, 1, 'm', 10, [1], ['m', 'cm']) },
  { key: 'goods-price-pence', skill: 'M07', band: 'support', year: 4, givens: { firstPence: 120, secondPence: 75, pencePerPound: 100 },
    prompt: 'Match each price label to its value in pence. There are 100 pence in £1. Use each pence card at most once.',
    demand: 'Introductory Year 4 decimal-money equivalence: translate decimal pounds-and-pence labels into integer pence using an explicit conversion fact and direct matching.',
    hints: ['Separate the whole pounds from the pence after the decimal point.', 'Exchange every pound for its pence value before combining the parts.'],
    worked: '£1.20 means 100 p + 20 p = 120 p. £0.75 means 75 p.', ...matching(['Ribbon: £1.20', 'Label: £0.75'], ['75 p', '102 p', '120 p'], [2, 0]) },
  { key: 'millimetres-to-centimetres', skill: 'M07', band: 'support', year: 3, givens: { lengthMm: 30, millimetresPerCm: 10, outputUnit: 'cm' },
    prompt: 'A strip is 30 mm long. There are 10 mm in 1 cm. Set its length in centimetres.',
    demand: 'Year 3 supported metric equivalence: group millimetres into centimetres with the conversion explicitly supplied.',
    hints: ['The answer needs a count of centimetre groups, not millimetres.', 'Find how many equal groups of the stated size fit the given length.'],
    worked: '30 mm ÷ 10 mm per cm = 3 cm.', ...quantity(3, 1, 'cm', 40, [1], ['cm', 'mm']) },
  { key: 'path-mixed-lengths', skill: 'M07', band: 'core', year: 4, givens: { firstMetres: 2, secondCm: 75, outputUnit: 'cm' },
    prompt: 'Walk from Gate to Well to Garden along both labelled sections. Give the total length in centimetres. There are 100 cm in 1 m.',
    demand: 'Year 4 conversion and measure addition: normalise metres and centimetres before summing the measured route.',
    hints: ['The two labels use different units; first choose the requested common unit.', 'Convert the metre section before combining the two lengths.'],
    worked: '2 m = 200 cm. The total is 200 cm + 75 cm = 275 cm.', stimulus: path('2 m', '75 cm'), ...quantity(275, 1, 'cm', 400, [1], ['cm', 'm']) },
  { key: 'goods-change-pence', skill: 'M07', band: 'core', year: 4, givens: { firstPaid: 200, firstCost: 125, secondPaid: 100, secondCost: 40 },
    prompt: 'Match each separate purchase to its change in pence. Use each card at most once.',
    demand: 'Year 4 money problems: interpret each payment and price separately, convert to pence and subtract in the correct direction.',
    hints: ['For each purchase, distinguish the amount paid from the cost.', 'Work in pence; check that cost plus change equals the payment.'],
    worked: 'Ribbon: 200 p − 125 p = 75 p change. Label: 100 p − 40 p = 60 p change.',
    ...matching(['Ribbon costs £1.25; pay £2.00', 'Label costs £0.40; pay £1.00'], ['60 p', '125 p', '75 p'], [2, 0]) },
  { key: 'money-change-quantity', skill: 'M07', band: 'core', year: 4, givens: { paidPence: 200, pricePence: 120, outputUnit: 'p' },
    prompt: 'A bottle costs £1.20. Pay with £2.00. How much change do you receive? Give the answer in pence.',
    demand: 'Year 4 independent money-change quantity: translate a decimal price to integer pence and subtract from the payment.',
    hints: ['Use one unit for both the price and payment.', 'Subtract the cost from what was paid, then check by adding the change back.'],
    worked: '£2.00 is 200 p and £1.20 is 120 p. 200 − 120 = 80 p change.', ...quantity(80, 1, 'p', 200, [1], ['p', 'GBP']) },
  { key: 'capacity-total', skill: 'M07', band: 'core', year: 4, givens: { firstLitres: 1, secondMl: 250, outputUnit: 'ml' },
    prompt: 'Pour 1 l of water and another 250 ml into an empty container. What is the total in millilitres? There are 1000 ml in 1 l.',
    demand: 'Year 4 capacity conversion and addition: combine quantities written in paired litre/millilitre units.',
    hints: ['Convert the larger unit to the requested smaller unit.', 'Combine the amounts only when their units agree.'],
    worked: '1 l = 1000 ml. 1000 + 250 = 1250 ml.', ...quantity(1250, 1, 'ml', 2000, [1], ['ml', 'l']) },
  { key: 'path-remaining-length', skill: 'M07', band: 'stretch', year: 4, givens: { firstMetres: 3, secondCm: 50, travelledCm: 175, outputUnit: 'cm' },
    prompt: 'The full route goes from Gate to Well to Garden. You have travelled 175 cm along it from Gate. How many centimetres remain to reach Garden? There are 100 cm in 1 m.',
    demand: 'Less-direct Year 4 multistep measurement: convert and combine labelled sections, then distinguish distance remaining from the full route length.',
    hints: ['First find the length of the complete labelled route in one unit.', 'The distance already travelled is part of that total; remove it to find what remains.'],
    worked: '3 m = 300 cm; full route = 300 + 50 = 350 cm. Remaining distance = 350 − 175 = 175 cm.',
    stimulus: path('3 m', '50 cm'), ...quantity(175, 1, 'cm', 400, [1], ['cm', 'm']) },
  { key: 'goods-basket-change', skill: 'M07', band: 'stretch', year: 4, givens: { aCount: 2, aPricePence: 120, aExtraPence: 35, bCount: 3, bPricePence: 75, bExtraPence: 120, paidPence: 500 },
    prompt: 'Each basket is a separate purchase paid for with £5.00. Match each basket to its change in pence. Use each card at most once.',
    demand: 'Less-direct Year 4 multistep money: form each basket cost from repeated prices plus a different item, then subtract from its payment; cost distractors distinguish the requested amount.',
    hints: ['Find the cost of every item in each basket, including repeated items.', 'After combining each basket cost, find the change from its own payment.'],
    worked: 'Basket A costs 2 × 120 + 35 = 275 p, so change is 500 − 275 = 225 p. Basket B costs 3 × 75 + 120 = 345 p, so change is 500 − 345 = 155 p.',
    ...matching(['A: two bottles at £1.20 each and one label at £0.35', 'B: three ribbons at £0.75 each and one bottle at £1.20'], ['275 p', '225 p', '155 p', '345 p'], [1, 2]) },
  { key: 'mass-after-sharing', skill: 'M07', band: 'stretch', year: 4, givens: { startingKg: 2, removedG: 750, bags: 3, eachG: 250, outputUnit: 'g' },
    prompt: 'Start with 2 kg of seeds. Remove 750 g, then fill 3 bags with 250 g each from the remaining seeds. How many grams are left? There are 1000 g in 1 kg.',
    demand: 'Less-direct Year 4 multistep mass: convert the starting amount, account for one removal and a repeated removal, then report the residue in grams.',
    hints: ['Express the starting mass and all removed masses in grams.', 'Find the combined mass put into bags before subtracting all the removed mass.'],
    worked: '2 kg = 2000 g. Three bags take 3 × 250 = 750 g. Remaining seeds: 2000 − 750 − 750 = 500 g.', ...quantity(500, 1, 'g', 2500, [1], ['g', 'kg']) },
];

export const QUANTITY_TASKS: readonly TaskDefinition[] = freeze(authored.map(item => {
  const skill = SKILLS.find(row => row.skillId === item.skill)!;
  const descriptor: TaskDescriptor = { familyId: `math.expansion.${item.skill.toLowerCase()}`, equivalenceVersion: 'r1', authoredKey: item.key,
    parameters: Object.fromEntries(Object.entries(item.givens).map(([key, value]) => [key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`), value])) };
  const instructionText = item.spec.kind === 'quantity' ? 'Set the requested numerator, denominator and unit, then Check.'
    : item.spec.kind === 'matching' ? 'Match each item to a card, then Check.' : 'Choose one answer, then Check.';
  return {
    canonicalQuestionId: canonicalQuestionId(descriptor), descriptor, contentRevision: '1', skillId: item.skill, objectiveId: skill.objectiveId, band: item.band,
    contextualSkillIds: item.skill === 'M07' && item.key.startsWith('goods-') ? ['M06'] : [],
    curriculum: { sourceUrl: skill.curriculum[0].sourceUrl,
      section: item.skill === 'M07' ? 'Measurement' : item.year === 5 ? 'Number — fractions (including decimals and percentages)' : item.year === 4 ? 'Number — fractions (including decimals)' : 'Number — fractions',
      programmeBand: `Year ${item.year}${item.band === 'support' ? ' (introductory support)' : item.year === 5 ? ' (selected stretch)' : ' (selected objectives)'}` },
    demandRationale: item.demand, instructionText, assessedText: item.prompt, stimulus: item.stimulus ?? null,
    responseSpec: item.spec, answerRule: { kind: 'accepted-responses', responses: [item.answer] },
    explanation: item.worked, hints: [{ id: 'quantity-attend', text: item.hints[0] }, { id: 'quantity-strategy', text: item.hints[1] }],
    workedSupport: { id: 'quantity-worked', text: item.worked }, narration: { neutralText: instructionText, assessedTextMayBeSpokenBeforeCheck: true },
    review: { status: 'approved', reviewer: 'Codex WP03-07A author review; independent acceptance pending', rationale: 'Prompt, demand, source, controls, exact solution, representation, alternative and help reviewed together. No qualified educator or child-testing claim.', evidenceRef: evidence },
  };
}));

function binding(bindingId: string, questId: string, skillId: 'M05' | 'M06' | 'M07', role: 'story' | 'revisit', responseKind: 'quantity' | 'choice' | 'matching', keys: readonly string[]): QuestActivityBinding {
  return { bindingId, questId, skillId, role, responseKind, availability: 'M2', sourceBindingId: null,
    mechanic: responseKind === 'matching' ? 'matching' : responseKind === 'choice' ? 'consequential-selection' : 'object-manipulation',
    taskIds: keys.map(key => {
      const task = QUANTITY_TASKS.find(row => row.descriptor.authoredKey === key);
      if (!task || task.skillId !== skillId || task.responseSpec.kind !== responseKind) throw new Error(`Invalid quantity binding key: ${key}`);
      return task.canonicalQuestionId;
    }) };
}
const fractionQuantityKeys = ['shaded-half', 'shaded-quarters-form', 'third-of-counters', 'equivalent-sixths', 'three-quarters-of-beads', 'add-eighths', 'subtract-tenths', 'reverse-three-fifths'];
const pathKeys = ['path-metres', 'path-mixed-lengths', 'path-remaining-length'];
const goodsKeys = ['goods-price-pence', 'goods-change-pence', 'goods-basket-change'];
// Proposed only: assembler owns runtime catalogue and shared bindings.
export const QUANTITY_BINDING_PROPOSALS: readonly QuestActivityBinding[] = freeze([
  binding('q5-story-m05-quantity', 'Q5', 'M05', 'story', 'quantity', fractionQuantityKeys),
  binding('q8-story-m07-path', 'Q8', 'M07', 'story', 'quantity', pathKeys),
  binding('q10-story-m07-goods', 'Q10', 'M07', 'story', 'matching', goodsKeys),
  binding('q1-revisit-m07-quantity', 'Q1', 'M07', 'revisit', 'quantity', ['millimetres-to-centimetres', 'capacity-total', 'mass-after-sharing']),
  binding('q5-revisit-m05-choice', 'Q5', 'M05', 'revisit', 'choice', ['improper-mixed-quarters', 'compare-thirds-sixths']),
  binding('q5-revisit-m06-choice', 'Q5', 'M06', 'revisit', 'choice', ['five-tenths-decimal', 'seven-hundredths-decimal', 'compare-decimal-lengths', 'quarter-decimal-equivalence', 'round-decimal-whole', 'decimal-digit-constraints', 'round-to-tenth']),
  binding('q5-revisit-m06-matching', 'Q5', 'M06', 'revisit', 'matching', ['match-decimal-parts']),
  binding('q5-revisit-m06-quantity', 'Q5', 'M06', 'revisit', 'quantity', ['extend-decimal-pattern', 'missing-decimal-pattern']),
  binding('q10-revisit-m07-quantity', 'Q10', 'M07', 'revisit', 'quantity', ['money-change-quantity']),
]);

export const QUANTITY_MANIFEST: TaskFamilyManifest = freeze({
  moduleId: 'expansion-quantities', familyIds: ['math.expansion.m05', 'math.expansion.m06', 'math.expansion.m07'],
  taskIds: QUANTITY_TASKS.map(task => task.canonicalQuestionId), retainedTaskIds: [],
  domainDescription: '30 enumerated tuples: M05/M06/M07 each 3 support, 4 core, 3 stretch. Fraction input denominators 2/3/4/5/6/8/10/12, integer count denominator 1; response numerators 0–24 for fractions. Decimal source values stored as integer hundredths 0–10000; decimal response denominators 1/10/100. Money is integer pence 0–10000, metric givens 0–10000 paired mm/cm/m, g/kg, ml/l with declared factors 10/100/1000. Per-item tighter bounds and units are authoritative. Equivalent slots compare exact rational value within the SAME unit; exact slots require numerator/denominator/unit form. Decimal-place form uses reviewed choices. No runtime tuple generation. Binding proposals and per-item review are in the evidence document.',
  reviewEvidenceRef: evidence,
  cases: QUANTITY_TASKS.flatMap(task => {
    if (task.answerRule.kind !== 'accepted-responses') throw new Error('Expected finite answers.');
    const answer = task.answerRule.responses[0];
    if (answer.kind !== 'quantity' && answer.kind !== 'choice' && answer.kind !== 'matching') throw new Error('Expected quantity-family response.');
    const partial: ActivityResponse = answer.kind === 'quantity' ? { kind: 'quantity', values: {} } : answer.kind === 'choice' ? { kind: 'choice', choices: {} } : { kind: 'matching', pairs: {} };
    const wrong: ActivityResponse = answer.kind === 'quantity' ? { kind: 'quantity', values: { answer: { ...answer.values.answer!, numerator: 0 } } }
      : answer.kind === 'choice' ? { kind: 'choice', choices: { answer: answer.choices.answer === 'option-1' ? 'option-2' : 'option-1' } }
        : { kind: 'matching', pairs: { 'item-1': answer.pairs['item-2'], 'item-2': answer.pairs['item-1'] } };
    const invalid: ActivityResponse = answer.kind === 'quantity' ? { kind: 'quantity', values: { unknown: null } }
      : answer.kind === 'choice' ? { kind: 'choice', choices: { unknown: null } } : { kind: 'matching', pairs: { unknown: null } };
    return [
      { caseId: `${task.descriptor.authoredKey}-correct`, canonicalQuestionId: task.canonicalQuestionId, response: answer, expectedStatus: 'judged' as const, expectedCorrect: true, expectedIssueCodes: [] },
      { caseId: `${task.descriptor.authoredKey}-partial`, canonicalQuestionId: task.canonicalQuestionId, response: partial, expectedStatus: 'incomplete' as const, expectedIssueCodes: [] },
      { caseId: `${task.descriptor.authoredKey}-wrong`, canonicalQuestionId: task.canonicalQuestionId, response: wrong, expectedStatus: 'judged' as const, expectedCorrect: false, expectedIssueCodes: answer.kind === 'matching' ? ['value-mismatch', 'value-mismatch'] : ['value-mismatch'] },
      { caseId: `${task.descriptor.authoredKey}-invalid`, canonicalQuestionId: task.canonicalQuestionId, response: invalid, expectedStatus: 'invalid-response' as const, expectedIssueCodes: [] },
    ];
  }),
});
