import type { ActivityResponse, DifficultyBand, QuestActivityBinding, ResponseSpec, SkillId, TaskDefinition, TaskDescriptor, TaskFamilyManifest, TaskStimulus } from '../../learning/contracts';
import { canonicalQuestionId } from '../../learning/identity';
import { SKILLS } from '../skills';
import { buildBridgeTasks, buildMerchantTasks } from '../starter-maths';

const evidence = 'docs/content-review/expansion-arithmetic.md';
type ArithmeticSkill = Extract<SkillId, 'M01' | 'M02' | 'M03' | 'M04'>;
type Tuple = Readonly<{ skill: ArithmeticSkill; band: DifficultyBand; operation: string; parameters: Readonly<Record<string, number>> }>;
// Only these checked-in tuples ship. No seed, inferred answer or cosmetic index
// is an identity parameter. The operation and every given quantity are retained.
const tuples: readonly Tuple[] = [
  { skill: 'M01', band: 'support', operation: 'add', parameters: { a: 28, b: 15 } },
  { skill: 'M01', band: 'support', operation: 'subtract', parameters: { a: 60, b: 24 } },
  { skill: 'M01', band: 'support', operation: 'missing-addend', parameters: { a: 37, total: 80 } },
  { skill: 'M01', band: 'core', operation: 'add', parameters: { a: 2687, b: 1756 } },
  { skill: 'M01', band: 'core', operation: 'subtract', parameters: { a: 5000, b: 2678 } },
  { skill: 'M01', band: 'core', operation: 'missing-addend', parameters: { a: 3846, total: 7000 } },
  { skill: 'M01', band: 'core', operation: 'balance', parameters: { a: 1240, b: 875, c: 560 } },
  { skill: 'M01', band: 'stretch', operation: 'reverse-change', parameters: { final: 940, added: 275, removed: 180 } },
  { skill: 'M01', band: 'stretch', operation: 'missing-delivery', parameters: { start: 1350, used: 785, final: 1420 } },
  { skill: 'M01', band: 'stretch', operation: 'two-deliveries', parameters: { start: 2200, first: 875, used: 1940, final: 3000 } },
  { skill: 'M02', band: 'support', operation: 'array-expression', parameters: { groups: 2, items: 5 } },
  { skill: 'M02', band: 'support', operation: 'array-total', parameters: { groups: 3, items: 4 } },
  { skill: 'M02', band: 'support', operation: 'array-total', parameters: { groups: 4, items: 8 } },
  { skill: 'M02', band: 'core', operation: 'match-products', parameters: { a: 6, b: 7, c: 8, d: 9, e: 12, f: 11 } },
  { skill: 'M02', band: 'core', operation: 'match-products', parameters: { a: 9, b: 6, c: 7, d: 8, e: 12, f: 4 } },
  { skill: 'M02', band: 'core', operation: 'match-products', parameters: { a: 11, b: 8, c: 12, d: 12, e: 7, f: 7 } },
  { skill: 'M02', band: 'core', operation: 'continue-pattern', parameters: { step: 7, start: 4 } },
  { skill: 'M02', band: 'stretch', operation: 'missing-factor', parameters: { total: 96, factor: 8 } },
  { skill: 'M02', band: 'stretch', operation: 'sort-products', parameters: { a: 6, b: 8, c: 7, d: 9 } },
  { skill: 'M02', band: 'stretch', operation: 'missing-pattern', parameters: { step: 9, start: 3 } },
  { skill: 'M03', band: 'support', operation: 'array-share', parameters: { groups: 1, items: 12, divisor: 2 } },
  { skill: 'M03', band: 'support', operation: 'array-share', parameters: { groups: 1, items: 12, divisor: 3 } },
  { skill: 'M03', band: 'support', operation: 'array-share', parameters: { groups: 2, items: 10, divisor: 5 } },
  { skill: 'M03', band: 'core', operation: 'divide', parameters: { total: 84, divisor: 7 } },
  { skill: 'M03', band: 'core', operation: 'divide', parameters: { total: 132, divisor: 12 } },
  { skill: 'M03', band: 'core', operation: 'match-inverses', parameters: { a: 8, b: 9 } },
  { skill: 'M03', band: 'core', operation: 'match-inverses', parameters: { a: 7, b: 12 } },
  { skill: 'M03', band: 'stretch', operation: 'regroup', parameters: { groups: 6, items: 8, divisor: 12 } },
  { skill: 'M03', band: 'stretch', operation: 'remove-share', parameters: { total: 96, removed: 24, divisor: 9 } },
  { skill: 'M03', band: 'stretch', operation: 'combine-share', parameters: { first: 35, second: 49, divisor: 7 } },
  { skill: 'M04', band: 'support', operation: 'represented-scale', parameters: { base: 4, multiplier: 2 } },
  { skill: 'M04', band: 'support', operation: 'represented-scale', parameters: { base: 5, multiplier: 3 } },
  { skill: 'M04', band: 'support', operation: 'represented-scale', parameters: { base: 6, multiplier: 4 } },
  { skill: 'M04', band: 'core', operation: 'scale-total', parameters: { base: 8, multiplier: 3 } },
  { skill: 'M04', band: 'core', operation: 'scale-total', parameters: { base: 24, multiplier: 2 } },
  { skill: 'M04', band: 'core', operation: 'undo-scale', parameters: { scaled: 48, multiplier: 4 } },
  { skill: 'M04', band: 'core', operation: 'scale-extra', parameters: { base: 17, multiplier: 3, extra: 5 } },
  { skill: 'M04', band: 'stretch', operation: 'total-constraints', parameters: { total: 60, multiplier: 4 } },
  { skill: 'M04', band: 'stretch', operation: 'difference-constraints', parameters: { difference: 18, multiplier: 3 } },
  { skill: 'M04', band: 'stretch', operation: 'after-removal', parameters: { remaining: 29, removed: 7, multiplier: 2 } },
];

function freeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
const quantity = (values: Readonly<Record<string, number>>): ActivityResponse => ({
  kind: 'quantity', values: Object.fromEntries(Object.entries(values).map(([id, numerator]) => [id, { numerator, denominator: 1, unit: 'count' }])),
});
const quantities = (slots: Readonly<Record<string, string>>, max: number): ResponseSpec => ({
  kind: 'quantity', slots: Object.entries(slots).map(([id, label]) => ({ id, label, numeratorBounds: { min: 0, max }, allowedDenominators: [1], units: ['count'], form: 'exact' })), requiredSlotIds: Object.keys(slots),
});
const array = (groups: number, itemsPerGroup: number): TaskStimulus => ({
  kind: 'array', groups, itemsPerGroup, labels: [`${groups} equal groups`, `${itemsPerGroup} counters in each group`],
  accessibleDescription: `${groups} equal groups are shown. Each group contains ${itemsPerGroup} counters.`,
});
type Authored = { prompt: string; spec: ResponseSpec; answers: readonly ActivityResponse[]; strategy: string; worked: string; demand: string; stimulus?: TaskStimulus };

function author(tuple: Tuple): Authored {
  const p = tuple.parameters;
  const one = (prompt: string, answer: number, max: number, strategy: string, worked: string, demand: string, stimulus?: TaskStimulus): Authored => ({
    prompt, spec: quantities({ answer: 'Missing count' }, max), answers: [quantity({ answer })], strategy, worked, demand, stimulus,
  });
  const directDemand = tuple.band === 'support'
    ? 'Earlier addition/subtraction and one explicit inverse step consolidate Year 3 preparation with a single requested count.'
    : 'Selected Year 4 four-digit calculation or inverse equality requires place-value exchange and checking; the operation is explicit.';
  switch (tuple.operation) {
    case 'add': return one(`A store has ${p.a} counters. Another ${p.b} arrive. How many are there now?`, p.a + p.b, tuple.band === 'support' ? 100 : 10000,
      'Combine the two counts. Partition into place-value parts and exchange when a part reaches ten.', `${p.a} + ${p.b} = ${p.a + p.b}. Add the new arrival to the original count; subtracting either addend checks the other.`, directDemand);
    case 'subtract': return one(`A store has ${p.a} counters. ${p.b} are used. How many remain?`, p.a - p.b, tuple.band === 'support' ? 100 : 10000,
      'Remove the used count. You can count up from the used count to the starting count to check.', `${p.a} − ${p.b} = ${p.a - p.b}. Check by adding ${p.b} back to the remaining count.`, directDemand);
    case 'missing-addend': return one(`A tray needs ${p.total} counters altogether. It already has ${p.a}. How many more are needed?`, p.total - p.a, tuple.band === 'support' ? 100 : 10000,
      'The starting count plus the missing count must equal the required total. Use the inverse operation.', `${p.total} − ${p.a} = ${p.total - p.a}. Check: ${p.a} + ${p.total - p.a} = ${p.total}.`, directDemand);
    case 'balance': return one(`Two stores must contain the same total. The first has ${p.a} counters and ${p.b} more. The second has ${p.c} counters. How many must be added to the second?`, p.a + p.b - p.c, 10000,
      'Find the first store’s combined total, then the gap from the second store to that total.', `${p.a} + ${p.b} = ${p.a + p.b}; ${p.a + p.b} − ${p.c} = ${p.a + p.b - p.c}. Both stores then have the same count.`, 'Year 4 two-step addition/subtraction: a total must be found before using an inverse gap, rather than reading one printed operation.');
    case 'reverse-change': return one(`Some counters were in a store. ${p.added} arrived, then ${p.removed} were used. ${p.final} remain. How many were there at the start?`, p.final + p.removed - p.added, 10000,
      'Work backwards from the final count. Undo the last change first, then undo the arrival.', `${p.final} + ${p.removed} = ${p.final + p.removed}; subtract the arrival: ${p.final + p.removed} − ${p.added} = ${p.final + p.removed - p.added}.`, 'Less-direct Year 4 two-step problem: reconstruct an unknown initial state by reversing the chronological changes.');
    case 'missing-delivery': return one(`A store began with ${p.start} counters. A delivery arrived, then ${p.used} were used. There are now ${p.final}. How many were delivered?`, p.final + p.used - p.start, 10000,
      'Undo the use to find the count just after delivery. Compare that with the starting count.', `${p.final} + ${p.used} = ${p.final + p.used}; ${p.final + p.used} − ${p.start} = ${p.final + p.used - p.start} delivered.`, 'Less-direct two-step missing change: the unknown is between known initial and final states, so both changes must be reconciled.');
    case 'two-deliveries': return one(`A store starts with ${p.start} counters. ${p.first} arrive in the first delivery, then an unknown second delivery arrives. ${p.used} are used and ${p.final} remain. How many arrived in the second delivery?`, p.final + p.used - p.start - p.first, 10000,
      'Undo the use. Then remove both known contributions to leave only the second delivery.', `${p.final} + ${p.used} = ${p.final + p.used}; subtract ${p.start} and ${p.first}: ${p.final + p.used - p.start - p.first}.`, 'Selected Year 5 multi-step addition/subtraction: three known contributions/changes surround a missing delivery; extra reasoning is the nested reverse reconstruction.');
    case 'array-expression': return {
      prompt: 'Match the displayed equal groups to a multiplication expression for their total. Either factor order is valid; leave the other cards unused.',
      spec: { kind: 'matching', items: [{ id: 'displayed', label: 'Displayed equal groups' }], targets: [{ id: 'forward', label: `${p.groups} × ${p.items}` }, { id: 'reverse', label: `${p.items} × ${p.groups}` }, { id: 'addition', label: `${p.groups} + ${p.items}` }], requiredItemIds: ['displayed'], uniqueTargets: true },
      answers: [{ kind: 'matching', pairs: { displayed: 'forward' } }, { kind: 'matching', pairs: { displayed: 'reverse' } }],
      strategy: 'An equal-group total uses the group count and the count in each group as factors. Swapping the factors keeps the total unchanged.',
      worked: `${p.groups} groups of ${p.items} use ${p.groups} × ${p.items} = ${p.groups * p.items}. ${p.items} × ${p.groups} gives the same total. Adding just the two given numbers does not count every displayed object.`,
      demand: 'Represented earlier multiplication recognition: one visible grouping is matched to an expression, with both commutative forms accepted. This supplies a support-accessible Q4 matching route.', stimulus: array(p.groups, p.items),
    };
    case 'array-total': return one('How many counters are shown altogether in the equal groups?', p.groups * p.items, 144,
      'Count the groups and the counters per group separately. Repeated addition or multiplication combines them.', `${p.groups} groups of ${p.items}: ${p.groups} × ${p.items} = ${p.groups * p.items}.`, 'Represented earlier equal-group demand: every object is supplied, so counting/repeated addition supports multiplication without claiming fact fluency.', array(p.groups, p.items));
    case 'match-products': {
      const products = [p.a * p.b, p.c * p.d, p.e * p.f];
      const spec: ResponseSpec = { kind: 'matching', items: [{ id: 'first', label: `${p.a} × ${p.b}` }, { id: 'second', label: `${p.c} × ${p.d}` }, { id: 'third', label: `${p.e} × ${p.f}` }],
        targets: [{ id: 't-first', label: `${products[0]} counters` }, { id: 't-second', label: `${products[1]} counters` }, { id: 't-third', label: `${products[2]} counters` }, { id: 't-equivalent', label: `${products[0]} in total` }], requiredItemIds: ['first', 'second', 'third'], uniqueTargets: true };
      return { prompt: 'Match each multiplication to its total. One total card will be unused; either card with the same count is valid.', spec,
        answers: ['t-first', 't-equivalent'].map(id => ({ kind: 'matching', pairs: { first: id, second: 't-second', third: 't-third' } })),
        strategy: 'Use a known multiplication fact for each pair of factors. Cards with equal counts mean the same total.', worked: `${p.a} × ${p.b} = ${products[0]}; ${p.c} × ${p.d} = ${products[1]}; ${p.e} × ${p.f} = ${products[2]}. The two ${products[0]} cards are interchangeable.`,
        demand: 'Selected Year 4 fact recall up to 12 × 12: match three independent expressions without a countable array; equivalent cards test quantity rather than label preference.' };
    }
    case 'continue-pattern': return one(`The totals for ${p.start}, ${p.start + 1}, and ${p.start + 2} groups are ${p.start * p.step}, ${(p.start + 1) * p.step}, and ${(p.start + 2) * p.step}. Each group has the same number of counters. What is the next total?`, (p.start + 3) * p.step, 144,
      'Compare consecutive totals to find the extra group’s count. Add one more equal step.', `Each new group adds ${p.step}. ${(p.start + 2) * p.step} + ${p.step} = ${(p.start + 3) * p.step}.`, 'Year 4 equal-group pattern: infer a constant group increment from totals and extend the multiplicative sequence.');
    case 'missing-factor': return one(`A rectangular array contains ${p.total} counters, with ${p.factor} counters in every row. How many rows are needed?`, p.total / p.factor, 12,
      'Think of the missing factor: number of rows times counters per row equals the total. Use a related multiplication fact.', `${p.total} ÷ ${p.factor} = ${p.total / p.factor}; ${p.total / p.factor} × ${p.factor} = ${p.total}.`, 'Less-direct Year 4 equal-group reasoning: reconstruct an absent array dimension from the product instead of counting displayed rows.');
    case 'sort-products': return { prompt: 'Sort all six expressions by their total. Several expressions can belong to the same total group.',
      spec: { kind: 'sorting', items: [{ id: 'a', label: `${p.a} × ${p.b}` }, { id: 'b', label: `${p.b} × ${p.a}` }, { id: 'c', label: `(${p.a - 1} × ${p.b}) + ${p.b}` }, { id: 'd', label: `${p.c} × ${p.d}` }, { id: 'e', label: `${p.d} × ${p.c}` }, { id: 'f', label: `(${p.c - 1} × ${p.d}) + ${p.d}` }],
        groups: [{ id: 'left', label: `${p.a * p.b} counters` }, { id: 'right', label: `${p.c * p.d} counters` }], requiredItemIds: ['a', 'b', 'c', 'd', 'e', 'f'] },
      answers: [{ kind: 'sorting', groups: { a: 'left', b: 'left', c: 'left', d: 'right', e: 'right', f: 'right' } }],
      strategy: 'Swapping factors preserves a product. A product plus one extra equal group can be recombined into a single product.',
      worked: `${p.a} × ${p.b}, ${p.b} × ${p.a}, and (${p.a - 1} × ${p.b}) + ${p.b} all give ${p.a * p.b}. The other three expressions give ${p.c * p.d}.`,
      demand: 'Less-direct Year 4 equality of expressions: combine commutativity and distributive regrouping to classify six expressions, not just recall a single total.' };
    case 'missing-pattern': return one(`The totals for ${p.start}, ${p.start + 1}, ${p.start + 2}, ${p.start + 3} and ${p.start + 4} equal groups are ${p.start * p.step}, ?, ${(p.start + 2) * p.step}, ${(p.start + 3) * p.step}, ${(p.start + 4) * p.step}. What is the missing total?`, (p.start + 1) * p.step, 144,
      'Use two adjacent known totals to find the group step. The gap before the missing total spans only one group.', `Adjacent known totals differ by ${p.step}. ${p.start * p.step} + ${p.step} = ${(p.start + 1) * p.step}; adding another step reaches ${(p.start + 2) * p.step}.`, 'Less-direct multiplicative pattern: infer the step from later terms and reconstruct an earlier missing term; the first visible gap spans two steps.');
    case 'array-share': return one(`Take all the counters shown in the array and share them equally among ${p.divisor} trays. How many counters does each tray receive?`, p.groups * p.items / p.divisor, 12,
      'Count the displayed counters, then distribute them one at a time among the new trays so every tray has the same count.', `${p.groups * p.items} counters shared among ${p.divisor} trays gives ${p.groups * p.items / p.divisor} each. Check: ${p.divisor} × ${p.groups * p.items / p.divisor} = ${p.groups * p.items}.`, 'Represented earlier equal-sharing consolidation: visible source counters support counting and one-at-a-time redistribution. The source grouping is not the requested new tray size.', array(p.groups, p.items));
    case 'divide': return one(`${p.total} counters are shared equally among ${p.divisor} trays. How many are in each tray?`, p.total / p.divisor, 12,
      'Find the multiplication fact with the tray count as one factor and the total as its product.', `${p.total} ÷ ${p.divisor} = ${p.total / p.divisor}. Check: ${p.divisor} × ${p.total / p.divisor} = ${p.total}.`, 'Year 4 exact division fact without a displayed share: retrieve the inverse fact, keeping divisor and quotient roles distinct.');
    case 'match-inverses': return { prompt: `Use the fact ${p.a} × ${p.b} = ${p.a * p.b}. Match each division expression to its quotient.`,
      spec: { kind: 'matching', items: [{ id: 'by-a', label: `${p.a * p.b} ÷ ${p.a}` }, { id: 'by-b', label: `${p.a * p.b} ÷ ${p.b}` }], targets: [{ id: 'a', label: `${p.a}` }, { id: 'b', label: `${p.b}` }], requiredItemIds: ['by-a', 'by-b'], uniqueTargets: true },
      answers: [{ kind: 'matching', pairs: { 'by-a': 'b', 'by-b': 'a' } }], strategy: 'Dividing the product by one factor leaves the other factor. Check each expression separately.',
      worked: `${p.a * p.b} ÷ ${p.a} = ${p.b}; ${p.a * p.b} ÷ ${p.b} = ${p.a}. Both are checked by the given multiplication.`, demand: 'Year 4 inverse family: distinguish both exact division roles rather than treating the printed factor order as a matching answer.' };
    case 'regroup': return one(`There are ${p.groups} packets with ${p.items} counters in each. Repack all counters into packets of ${p.divisor}. How many new packets are needed?`, p.groups * p.items / p.divisor, 12,
      'Find the total from the original packets. Divide that total by the size of each new packet.', `${p.groups} × ${p.items} = ${p.groups * p.items}; ${p.groups * p.items} ÷ ${p.divisor} = ${p.groups * p.items / p.divisor} new packets.`, 'Less-direct Year 4 grouping division: first reconstruct the dividend from one grouping, then change the packet size.');
    case 'remove-share': return one(`There are ${p.total} counters. Set ${p.removed} aside, then share the rest equally among ${p.divisor} trays. How many does each tray receive?`, (p.total - p.removed) / p.divisor, 12,
      'The set-aside counters are not shared. Find the remaining dividend before dividing.', `${p.total} − ${p.removed} = ${p.total - p.removed}; ${p.total - p.removed} ÷ ${p.divisor} = ${(p.total - p.removed) / p.divisor}.`, 'Less-direct two-step exact sharing: select the correct dividend after removal; dividing the printed starting total would answer a different question.');
    case 'combine-share': return one(`One box contains ${p.first} counters and another contains ${p.second}. Share both boxes equally among ${p.divisor} trays. How many does each tray receive?`, (p.first + p.second) / p.divisor, 12,
      'Combine both boxes before sharing. Check the quotient against the whole combined count.', `${p.first} + ${p.second} = ${p.first + p.second}; ${p.first + p.second} ÷ ${p.divisor} = ${(p.first + p.second) / p.divisor}.`, 'Less-direct two-step exact division: assemble the dividend from two sources, then check an inverse relation for the combined quantity.');
    case 'represented-scale': return one(`The array shows counters in one small pack. A large pack has ${p.multiplier} times as many. How many counters are in the large pack?`, p.base * p.multiplier, 96,
      'Count the small pack, then imagine that many counters repeated for each copy of the pack.', `${p.base} × ${p.multiplier} = ${p.base * p.multiplier} counters in the large pack.`, 'Represented introductory integer scaling: the base count is visible and the multiplier is explicit; this does not assess M02 separately.', array(1, p.base));
    case 'scale-total': return { prompt: `A small pack has ${p.base} counters. A large pack has ${p.multiplier} times as many. Give the large pack’s count and the total in one small plus one large pack.`,
      spec: quantities({ large: 'Large pack', total: 'Combined total' }, 120), answers: [quantity({ large: p.base * p.multiplier, total: p.base * (p.multiplier + 1) })],
      strategy: 'Scale the base count to find the large pack. Include the original small pack when finding the combined total.', worked: `Large: ${p.base} × ${p.multiplier} = ${p.base * p.multiplier}. Total: ${p.base} + ${p.base * p.multiplier} = ${p.base * (p.multiplier + 1)}.`,
      demand: 'Year 4 scaling plus addition: two requested counts must satisfy the scaling and combined-total constraints; merchant counters are not enlarged.' };
    case 'undo-scale': return one(`A large pack contains ${p.scaled} counters, ${p.multiplier} times the count in a small pack. How many counters are in the small pack?`, p.scaled / p.multiplier, 24,
      'The printed count is already scaled. Undo the multiplier rather than multiplying the large pack again.', `${p.scaled} ÷ ${p.multiplier} = ${p.scaled / p.multiplier}. Scaling back checks the large pack’s count.`, 'Selected Year 4 inverse integer scaling: infer the base from a scaled amount without a countable representation.');
    case 'scale-extra': return one(`A display uses ${p.multiplier} times as many counters as a pack of ${p.base}, then adds ${p.extra} spare counters. How many counters are used in all?`, p.base * p.multiplier + p.extra, 120,
      'Scale the pack count first. The spares are added once, after scaling.', `${p.base} × ${p.multiplier} = ${p.base * p.multiplier}; add ${p.extra} to give ${p.base * p.multiplier + p.extra}.`, 'Year 4 multiplying and adding: determine which count is scaled and which is an unscaled extra.');
    case 'total-constraints': return { prompt: `A large pack has ${p.multiplier} times the count in a small pack. Together they contain ${p.total} counters. Give both pack counts.`,
      spec: quantities({ small: 'Small pack', large: 'Large pack' }, 96), answers: [quantity({ small: p.total / (p.multiplier + 1), large: p.total * p.multiplier / (p.multiplier + 1) })],
      strategy: 'Treat the small pack as one equal part and the large pack as several of those parts. Share the total among all parts, then check both counts.', worked: `There are ${p.multiplier + 1} equal parts. ${p.total} ÷ ${p.multiplier + 1} = ${p.total / (p.multiplier + 1)} per part. Small: ${p.total / (p.multiplier + 1)}; large: ${p.total * p.multiplier / (p.multiplier + 1)}. Check their sum and multiplier.`,
      demand: 'Less-direct integer scaling with two unknown counts: reconstruct one part from the combined total, then satisfy both total and relationship; no formal ratio algebra is required.' };
    case 'difference-constraints': return { prompt: `A large pack has ${p.multiplier} times the count in a small pack and contains ${p.difference} more counters. Give both pack counts.`,
      spec: quantities({ small: 'Small pack', large: 'Large pack' }, 96), answers: [quantity({ small: p.difference / (p.multiplier - 1), large: p.difference * p.multiplier / (p.multiplier - 1) })],
      strategy: 'Imagine the packs in equal parts. The difference accounts for the extra parts in the large pack, not all its parts.', worked: `The difference is ${p.multiplier - 1} equal parts. ${p.difference} ÷ ${p.multiplier - 1} = ${p.difference / (p.multiplier - 1)} per part. Small: ${p.difference / (p.multiplier - 1)}; large: ${p.difference * p.multiplier / (p.multiplier - 1)}. Their difference is ${p.difference}.`,
      demand: 'Less-direct two-constraint scaling: infer the base from the difference between packs, distinguishing extra parts from all parts.' };
    case 'after-removal': return { prompt: `Originally a large pack had ${p.multiplier} times the count in a small pack. After ${p.removed} counters were removed from the large pack, the two packs together contain ${p.remaining}. Give the original counts in both packs.`,
      spec: quantities({ small: 'Original small pack', large: 'Original large pack' }, 96), answers: [quantity({ small: (p.remaining + p.removed) / (p.multiplier + 1), large: (p.remaining + p.removed) * p.multiplier / (p.multiplier + 1) })],
      strategy: 'Undo the removal to restore the original combined total. Then find one equal part and scale it for the original large pack.', worked: `Original total: ${p.remaining} + ${p.removed} = ${p.remaining + p.removed}. Divide among ${p.multiplier + 1} parts: ${(p.remaining + p.removed) / (p.multiplier + 1)} each. Original small: ${(p.remaining + p.removed) / (p.multiplier + 1)}; large: ${(p.remaining + p.removed) * p.multiplier / (p.multiplier + 1)}.`,
      demand: 'Additional multi-step scaling: reverse a change before reconstructing two original quantities, then verify the post-removal total separately.' };
    default: throw new Error(`Unknown reviewed arithmetic operation: ${tuple.operation}`);
  }
}

export const ARITHMETIC_TASKS: readonly TaskDefinition[] = freeze(tuples.map(tuple => {
  const authored = author(tuple);
  const skill = SKILLS.find(row => row.skillId === tuple.skill)!;
  const descriptor: TaskDescriptor = { familyId: `math.expansion.${tuple.skill.toLowerCase()}`, equivalenceVersion: 'r1', authoredKey: null,
    parameters: { operation: tuple.operation, ...tuple.parameters } };
  const instructionText = authored.spec.kind === 'matching' ? 'Pair each expression with a result card, then Check.'
    : authored.spec.kind === 'sorting' ? 'Place every expression in a total group, then Check.' : 'Set each requested whole-number count, then Check.';
  return {
    canonicalQuestionId: canonicalQuestionId(descriptor), descriptor, contentRevision: '1', skillId: tuple.skill, objectiveId: skill.objectiveId, band: tuple.band,
    contextualSkillIds: tuple.skill === 'M04' ? ['M02', 'E08'] : [],
    curriculum: { sourceUrl: skill.curriculum[0].sourceUrl, section: tuple.skill === 'M01' ? 'Number — addition and subtraction' : 'Number — multiplication and division',
      programmeBand: tuple.operation === 'two-deliveries' ? 'Year 5 (selected multi-step problems)' : tuple.band !== 'support' ? 'Year 4 (selected objectives)'
        : tuple.skill === 'M01' || (tuple.skill === 'M02' && tuple.parameters.groups === 2) || (tuple.skill === 'M03' && tuple.parameters.divisor !== 3) ? 'Year 2 (earlier consolidation)' : 'Year 3 (selected support)' },
    demandRationale: authored.demand, instructionText, assessedText: authored.prompt, stimulus: authored.stimulus ?? null,
    responseSpec: authored.spec, answerRule: { kind: 'accepted-responses', responses: authored.answers },
    explanation: `${authored.worked} Check the requested quantities and operations separately.`,
    hints: [{ id: 'arithmetic-attend', text: 'Identify what is given and what is missing. Notice whether the question asks for a total, one group, or an earlier count.' }, { id: 'arithmetic-strategy', text: authored.strategy }],
    workedSupport: { id: 'arithmetic-worked', text: authored.worked }, narration: { neutralText: instructionText, assessedTextMayBeSpokenBeforeCheck: true },
    review: { status: 'approved', reviewer: 'Codex WP03-06A author review; independent acceptance pending', rationale: 'Original finite tuple reviewed for source, demand, all control answers, help and representation consistency. No qualified educator review claimed.', evidenceRef: evidence },
  };
}));

// Proposed rows only: WP03-13A owns the actual shared catalogue. Every pool is
// response-homogeneous and references actual records; Q1/Q3 gain no story rows.
export const ARITHMETIC_BINDING_PROPOSALS: readonly QuestActivityBinding[] = freeze([
  ...(['M01', 'M02', 'M03', 'M04'] as const).flatMap(skillId => {
    const quests = skillId === 'M01' ? ['Q1', 'Q9'] : skillId === 'M02' ? ['Q3', 'Q4'] : skillId === 'M03' ? ['Q4'] : ['Q3'];
    const kinds = [...new Set(ARITHMETIC_TASKS.filter(task => task.skillId === skillId).map(task => task.responseSpec.kind))];
    return quests.flatMap(questId => kinds.map(responseKind => ({
      bindingId: questId === 'Q4' && skillId === 'M02' && responseKind === 'matching' ? 'q4-story-m02-match' : `${questId.toLowerCase()}-revisit-${skillId.toLowerCase()}-${responseKind}`, questId, availability: 'M2' as const,
      role: (questId === 'Q4' && skillId === 'M02' && responseKind === 'matching' ? 'story' : 'revisit') as QuestActivityBinding['role'], skillId,
      taskIds: ARITHMETIC_TASKS.filter(task => task.skillId === skillId && task.responseSpec.kind === responseKind).map(task => task.canonicalQuestionId),
      mechanic: (responseKind === 'matching' ? 'matching' : responseKind === 'sorting' ? 'sorting' : 'object-manipulation') as QuestActivityBinding['mechanic'],
      responseKind, sourceBindingId: null,
    })));
  }),
]);

export const ARITHMETIC_MANIFEST: TaskFamilyManifest = freeze({
  moduleId: 'expansion-arithmetic', familyIds: [...new Set(ARITHMETIC_TASKS.map(task => task.descriptor.familyId))],
  taskIds: ARITHMETIC_TASKS.map(task => task.canonicalQuestionId),
  retainedTaskIds: [...buildBridgeTasks(), ...buildMerchantTasks()].map(task => task.canonicalQuestionId),
  domainDescription: '40 finite tuples: each M01–M04 has 3 support/4 core/3 stretch. Addition/subtraction 0–10000; group factors/divisors 1–12 with exact answers; scaling base 1–24, multiplier 2–4; arrays use given groups/items 1–12. Per-task control bounds are authoritative. Binding proposals and source/stimulus review are in the evidence document.',
  reviewEvidenceRef: evidence,
  cases: ARITHMETIC_TASKS.flatMap((task, index) => {
    const answers = task.answerRule.kind === 'accepted-responses' ? task.answerRule.responses : [];
    const first = answers[0];
    if (!first) throw new Error('Arithmetic manifest requires an authored control response.');
    if (first.kind !== 'quantity' && first.kind !== 'matching' && first.kind !== 'sorting') throw new Error('Unsupported arithmetic control response.');
    const partial: ActivityResponse = first.kind === 'quantity' ? { kind: 'quantity', values: {} } : first.kind === 'matching' ? { kind: 'matching', pairs: {} } : { kind: 'sorting', groups: {} };
    const wrong: ActivityResponse = first.kind === 'quantity' ? { kind: 'quantity', values: Object.fromEntries(Object.entries(first.values).map(([id, value]) => [id, { ...value!, numerator: value!.numerator === 0 ? 1 : 0 }])) }
      : first.kind === 'matching' ? { kind: 'matching', pairs: Object.fromEntries(Object.keys(first.pairs).map((id, i, ids) => [id, ids.length === 1 && task.responseSpec.kind === 'matching' ? task.responseSpec.targets.at(-1)!.id : first.pairs[ids[(i + 1) % ids.length]]])) }
        : { kind: 'sorting', groups: Object.fromEntries(Object.entries(first.groups).map(([id, group]) => [id, group === 'left' ? 'right' : 'left'])) };
    const invalid: ActivityResponse = first.kind === 'quantity' ? { kind: 'quantity', values: { unknown: { numerator: 0, denominator: 1, unit: 'count' } } }
      : first.kind === 'matching' ? { kind: 'matching', pairs: { unknown: null } } : { kind: 'sorting', groups: { unknown: null } };
    const ids = first.kind === 'quantity' ? Object.keys(first.values) : first.kind === 'matching' ? Object.keys(first.pairs) : Object.keys(first.groups);
    return [
      ...answers.map((response, alternative) => ({ caseId: `arithmetic-${index + 1}-correct-${alternative + 1}`, canonicalQuestionId: task.canonicalQuestionId, response, expectedStatus: 'judged' as const, expectedCorrect: true, expectedIssueCodes: [] })),
      { caseId: `arithmetic-${index + 1}-wrong`, canonicalQuestionId: task.canonicalQuestionId, response: wrong, expectedStatus: 'judged' as const, expectedCorrect: false, expectedIssueCodes: ids.map(() => 'value-mismatch') },
      { caseId: `arithmetic-${index + 1}-partial`, canonicalQuestionId: task.canonicalQuestionId, response: partial, expectedStatus: 'incomplete' as const, expectedIssueCodes: [] },
      { caseId: `arithmetic-${index + 1}-invalid`, canonicalQuestionId: task.canonicalQuestionId, response: invalid, expectedStatus: 'invalid-response' as const, expectedIssueCodes: [] },
    ];
  }),
});
