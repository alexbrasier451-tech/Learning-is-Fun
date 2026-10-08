import { describe, expect, it } from 'vitest';
import { canonicalQuestionId } from '../../src/learning/identity';
import type { TaskDescriptor } from '../../src/learning/contracts';

const bridge: TaskDescriptor = { familyId: 'math.bridge', equivalenceVersion: 'r1', authoredKey: null, parameters: { target: 12 } };
const merchant: TaskDescriptor = { familyId: 'math.merchant', equivalenceVersion: 'r1', authoredKey: null, parameters: { multiplier: 2, pears: 3 } };
const punctuation: TaskDescriptor = { familyId: 'english.punctuation', equivalenceVersion: 'r1', authoredKey: 'spellbook-anchor', parameters: {} };

describe('educational canonical identity', () => {
  it.each([
    [bridge, 'lif.math.bridge.r1.total-12'],
    [merchant, 'lif.math.merchant.r1.mult-2.pears-3'],
    [punctuation, 'lif.english.punctuation.r1.spellbook-anchor'],
  ] as const)('round-trips the meaningful descriptor for %s', (descriptor, expected) => {
    expect(canonicalQuestionId(JSON.parse(JSON.stringify(descriptor)))).toBe(expected);
  });
  it('reconstructs exact bridge and merchant task facts without a seed', () => {
    expect(bridge.parameters.target).toBe(12);
    expect((Number(merchant.parameters.multiplier) + 1) * Number(merchant.parameters.pears)).toBe(9);
    expect(canonicalQuestionId({ ...bridge, parameters: { target: 13 } })).toBe('lif.math.bridge.r1.total-13');
    expect(canonicalQuestionId({ ...merchant, parameters: { multiplier: 3, pears: 3 } })).toBe('lif.math.merchant.r1.mult-3.pears-3');
  });
  it('ignores bridge arrangement, accepted endings, cosmetics, release and week outside the descriptor', () => {
    const presentations = [
      { descriptor: bridge, response: [1, 2, 3, 6], contentRevision: 'a', week: '2026-10-05', skin: 'stone' },
      { descriptor: bridge, response: [6, 3, 2, 1], contentRevision: 'b', week: '2026-10-12', skin: 'wood' },
      { descriptor: bridge, response: [6, 6], contentRevision: 'c', week: '2026-10-19', skin: 'flowers' },
    ];
    expect(presentations.map(x => canonicalQuestionId(x.descriptor))).toEqual(Array(3).fill('lif.math.bridge.r1.total-12'));
    const endings = [{ descriptor: punctuation, slots: { question: '?', discovery: '.' } },
      { descriptor: punctuation, slots: { question: '?', discovery: '!' } }];
    expect(endings.map(item => canonicalQuestionId(item.descriptor))).toEqual(Array(2).fill('lif.english.punctuation.r1.spellbook-anchor'));
    expect([{ names: ['apple', 'pear'], positions: [1, 2] }, { names: ['red apple', 'green pear'], positions: [2, 1] }]
      .map(() => canonicalQuestionId(merchant))).toEqual(Array(2).fill('lif.math.merchant.r1.mult-2.pears-3'));
  });
  it('sorts parameter keys and pins the non-anchor encoding independently', () => {
    const descriptor = { familyId: 'math.fraction', equivalenceVersion: 'r1', authoredKey: null, parameters: { numerator: 1, denominator: 2 } };
    const expected = 'lif.math.fraction.r1.generated-%5Bnull%2C%5B%5B%22denominator%22%2C2%5D%2C%5B%22numerator%22%2C1%5D%5D%5D';
    expect(canonicalQuestionId(descriptor)).toBe(expected);
    expect(canonicalQuestionId({ ...descriptor, parameters: { denominator: 2, numerator: 1 } })).toBe(expected);
  });
  it('distinguishes value types, delimiter-bearing strings, authored keys and equivalence versions', () => {
    const descriptor = { familyId: 'english.fixture', equivalenceVersion: 'r1', authoredKey: null, parameters: { text: 'a,b' } };
    const variants: TaskDescriptor[] = [descriptor, { ...descriptor, parameters: { text: 'a', b: 'b' } },
      { ...descriptor, parameters: { text: 12 } }, { ...descriptor, parameters: { text: '12' } },
      { ...descriptor, authoredKey: 'a,b' }, { ...descriptor, equivalenceVersion: 'r2' }];
    const ids = variants.map(canonicalQuestionId);
    expect(new Set(ids).size).toBe(6);
    expect(canonicalQuestionId({ ...bridge, equivalenceVersion: 'r2' })).toBe('lif.math.bridge.r2.total-12');
  });
  it.each([
    { ...bridge, parameters: { target: 12, seed: 1 } },
    { ...bridge, parameters: { target: '12' } },
    { ...bridge, parameters: { target: 0 } },
    { ...merchant, parameters: { multiplier: 2 } },
    { ...punctuation, parameters: { ending: '!' } },
    { ...bridge, equivalenceVersion: 'app-v1' },
    { ...bridge, contentRevision: 'new' },
    { ...bridge, familyId: 'math/bridge' },
    { familyId: 'math.fixture', equivalenceVersion: 'r1', authoredKey: null, parameters: {} },
    { familyId: 'math.fixture', equivalenceVersion: 'r1', authoredKey: null, parameters: { value: Infinity } },
    { familyId: 'math.fixture', equivalenceVersion: 'r1', authoredKey: null, parameters: { value: 0.5 } },
    { familyId: 'math.fixture', equivalenceVersion: 'r1', authoredKey: null, parameters: { value: Number.MAX_SAFE_INTEGER + 1 } },
  ])('rejects malformed or incomplete descriptors %s', descriptor => {
    expect(() => canonicalQuestionId(descriptor as TaskDescriptor)).toThrow(TypeError);
  });
});
