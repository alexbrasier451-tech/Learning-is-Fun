import type { TaskDescriptor } from './contracts';

const token = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/;
const ownKeys = (record: object, expected: readonly string[]) => {
  const keys = Object.keys(record).sort();
  return keys.length === expected.length && keys.every((key, i) => key === [...expected].sort()[i]);
};
const plainRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object'
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);

/** Educational equivalence only. The original descriptor must be retained to
 * reconstruct content; this ID is not a decoder, seed, encounter or receipt. */
export function canonicalQuestionId(descriptor: TaskDescriptor): string {
  if (!plainRecord(descriptor) || !ownKeys(descriptor, ['familyId', 'equivalenceVersion', 'authoredKey', 'parameters'])
    || typeof descriptor.familyId !== 'string' || !token.test(descriptor.familyId)
    || typeof descriptor.equivalenceVersion !== 'string' || !/^r[1-9][0-9]*$/.test(descriptor.equivalenceVersion)
    || !plainRecord(descriptor.parameters)
    || (descriptor.authoredKey !== null && (typeof descriptor.authoredKey !== 'string' || descriptor.authoredKey.length === 0))) {
    throw new TypeError('Invalid canonical descriptor');
  }
  const entries = Object.entries(descriptor.parameters).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  if (entries.some(([key, value]) => !token.test(key)
    || !(typeof value === 'string' || (typeof value === 'number' && Number.isSafeInteger(value))))) {
    throw new TypeError('Meaningful parameters must be named strings or safe integers');
  }
  const prefix = `lif.${descriptor.familyId}.${descriptor.equivalenceVersion}`;
  if (descriptor.familyId === 'math.bridge') {
    if (descriptor.authoredKey !== null || !ownKeys(descriptor.parameters, ['target'])
      || !Number.isSafeInteger(descriptor.parameters.target) || Number(descriptor.parameters.target) <= 0) {
      throw new TypeError('Bridge identity requires only its positive integer target');
    }
    return `${prefix}.total-${descriptor.parameters.target}`;
  }
  if (descriptor.familyId === 'math.merchant') {
    if (descriptor.authoredKey !== null || !ownKeys(descriptor.parameters, ['multiplier', 'pears'])
      || !['multiplier', 'pears'].every(key => Number.isSafeInteger(descriptor.parameters[key]) && Number(descriptor.parameters[key]) > 0)) {
      throw new TypeError('Merchant identity requires multiplier and pears');
    }
    return `${prefix}.mult-${descriptor.parameters.multiplier}.pears-${descriptor.parameters.pears}`;
  }
  if (descriptor.familyId === 'english.punctuation' && descriptor.authoredKey === 'spellbook-anchor') {
    if (entries.length !== 0) throw new TypeError('Spellbook anchor has no generated parameters');
    return `${prefix}.spellbook-anchor`;
  }
  if (descriptor.authoredKey === null && entries.length === 0) {
    throw new TypeError('Generated identity needs its complete meaningful parameters');
  }
  // JSON tuples retain value types and boundaries. Percent encoding prevents
  // delimiter collisions; authored and generated namespaces cannot collide.
  return `${prefix}.${descriptor.authoredKey === null ? 'generated' : 'authored'}-${encodeURIComponent(JSON.stringify([descriptor.authoredKey, entries]))}`;
}
