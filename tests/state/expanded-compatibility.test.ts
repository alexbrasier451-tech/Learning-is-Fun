import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { listTasks, STARTER_TASKS } from '../../src/content/catalogue';
import { decodeBackup, exportBackup, validateSave } from '../../src/state/backup';
import { migrateSupportedSave } from '../../src/state/migrations';
import { validCommand } from '../../src/state/transition';
import { summarizeLearning } from '../../src/learning/summarize';
import type { ActivityResponse } from '../../src/learning/contracts';
import type { BackupEnvelopeV1 } from '../../src/state/backup';
type Mutable<T> = T extends readonly (infer E)[] ? Mutable<E>[] : T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T;
const source = readFileSync(new URL('../fixtures/expanded-full-save.json', import.meta.url), 'utf8');
const catalogue = listTasks();
const copy = () => JSON.parse(source) as Mutable<BackupEnvelopeV1>;
describe('expanded actual-facade fixture compatibility', () => {
  it('preserves unchanged v1/content/reward identities and every real committed field', () => {
    const decoded = decodeBackup(source, catalogue); expect(decoded.status).toBe('valid');
    if (decoded.status !== 'valid') throw new Error(JSON.stringify(decoded));
    const out = exportBackup({ save: decoded.envelope.save, token: { epoch: 'fixture', revision: 0 } }, decoded.envelope.exportedAt, catalogue);
    expect(JSON.parse(out.json)).toEqual(JSON.parse(source));
    const migrated = migrateSupportedSave(decoded.envelope, 'm1', catalogue);
    expect(migrated).toEqual(decoded); expect(decoded.envelope.save).toMatchObject({ schemaVersion: 1, contentVersion: 'm1', rewardPolicyVersion: '1' });
  });
  it.each(['choice', 'sequence', 'sorting', 'matching', 'quantity', 'clock'])('rejects malformed actual %s drafts without coercion', kind => {
    const envelope = copy(), e = Object.values(envelope.save.profiles.expanded.encounters).find(e => e.responseDraft?.kind === kind)!;
    expect(e).toBeDefined();
    const malformed: Record<string, unknown> = kind === 'quantity' ? { kind, values: { answer: { numerator: 1, denominator: 0, unit: 'unknown' } } }
      : kind === 'clock' ? { kind, minutes: 1441 } : { ...e.responseDraft, injectedAnswer: 'forged' };
    e.responseDraft = malformed as unknown as Mutable<ActivityResponse>;
    expect(decodeBackup(JSON.stringify(envelope), catalogue).status).toBe('invalid');
    expect(readFileSync(new URL('../fixtures/expanded-full-save.json', import.meta.url), 'utf8')).toBe(source);
  });
  it('keeps opaque IDs bounded while admitting only exact long producer identities', () => {
    const envelope = copy(); expect(Object.keys(envelope.save.profiles.expanded.rewards.tracksByCanonical).some(id => id.length > 160)).toBe(true);
    envelope.save.profiles.expanded.learning.canonicalHistory[0].canonicalQuestionId = 'unregistered'.repeat(24);
    expect(decodeBackup(JSON.stringify(envelope), catalogue).status).toBe('unsupported');
    const longKey = copy(); longKey.save.profiles['x'.repeat(161)] = longKey.save.profiles.absent;
    expect(decodeBackup(JSON.stringify(longKey), catalogue).status).toBe('invalid');
    expect(validCommand({ kind: 'ReconcileCalendar', actionId: 'x'.repeat(161), expected: { epoch: 'fixture', revision: 0 }, payload: {} })).toBe(false);
  });
  it('does not admit expanded permanent progress under an older starter-only catalogue', () => {
    expect(decodeBackup(source, STARTER_TASKS).status).toBe('unsupported');
    for (const patch of [{ contentVersion: 'future-content' }, { schemaVersion: 2 }, { rewardPolicyVersion: 'future-policy' }]) {
      const envelope = copy(); Object.assign(envelope.save, patch);
      expect(decodeBackup(JSON.stringify(envelope), catalogue).status).toBe('unsupported');
    }
  });
  it('rejects fabricated full required sets and missing threshold entitlements', () => {
    const missing = copy(); missing.save.profiles.expanded.world.completedStoryBindingIds = missing.save.profiles.expanded.world.completedStoryBindingIds.filter(id => id !== 'q9-story-m08-clock');
    expect(validateSave(missing.save, catalogue).status).toBe('invalid');
    const entitlement = copy(); entitlement.save.profiles.expanded.rewards.entitlementIds = entitlement.save.profiles.expanded.rewards.entitlementIds.filter(id => id !== 'home-trim');
    expect(validateSave(entitlement.save, catalogue).status).toBe('invalid');
  });
  it('reports actual all-20 practice separately from the untouched all-20 absent evidence', () => {
    const save = copy().save;
    const practised = summarizeLearning(save.profiles.expanded.learning.evidence, catalogue, '2026-10-13');
    const absent = summarizeLearning(save.profiles.absent.learning.evidence, catalogue, '2026-10-13');
    expect(practised).toHaveLength(20); expect(practised.every(s => s.validChecks > 0)).toBe(true);
    expect(absent).toHaveLength(20); expect(absent.every(s => s.validChecks === 0 && s.completedEpisodes === 0 && s.independentSuccesses === 0 && s.latestReview === null)).toBe(true);
  });
});
