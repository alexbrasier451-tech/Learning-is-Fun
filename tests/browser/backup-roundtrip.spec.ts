import { expect, test } from '@playwright/test';
import type { BackupFixture } from '../fixtures/backup-roundtrip-api';
declare const window: { backupFixture: BackupFixture };
for (const [capacity, populated] of [[false, false], [false, true], [true, true]] as const) {
  test(`actual producer backup replacement capacity=${capacity} existing=${populated}`, async ({ page }, info) => {
    await page.goto('tests/fixtures/backup-roundtrip.html'); await page.waitForFunction(() => !!window.backupFixture);
    const result = await page.evaluate(([capacity, populated]) => window.backupFixture.runBackupRoundtrip(capacity, populated), [capacity, populated]);
    await info.attach('paired-backup-roots', { body: JSON.stringify(result), contentType: 'application/json' });
    expect(result.importBeforeReconcileEqual).toBe(true); expect(result.reexportEqual).toBe(true); expect(result.oldEpochStatus).toBe('conflict');
    expect(result.profileCount).toBe(capacity ? 16 : 2); expect(result.restoredLifetime[0]).toBe(55);
    expect(result.importedToken.epoch).not.toBe(result.initialToken.epoch); expect(result.importedToken.revision).toBe(0);
    expect(result.nextWeek).toBe('2026-10-19'); expect(result.archivesAfter).toBe(result.archivesBefore + 1);
  });
}
test('cancel/rejections/stale previews/capacity refusal preserve actual IDB roots', async ({ page }, info) => {
  await page.goto('tests/fixtures/backup-roundtrip.html'); await page.waitForFunction(() => !!window.backupFixture);
  const result = await page.evaluate(() => window.backupFixture.runBackupRejections());
  await info.attach('unchanged-root-and-reissue', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result.cancelUnchanged).toBe(true); expect(result.rejected).toHaveLength(6); expect(result.raceStatus).toBe('conflict');
  expect(result.capacityReason).toBe('capacity-exceeded'); expect(result.reissuedStatus).toBe('committed');
  expect(result.interveningToken.revision).toBe(result.beforeToken.revision + 1);
});
test('unsupported persisted root remains intact through validated export refusal', async ({ page }, info) => {
  await page.goto('tests/fixtures/backup-roundtrip.html'); await page.waitForFunction(() => !!window.backupFixture);
  const result = await page.evaluate(() => window.backupFixture.runUnsupportedRecovery());
  await info.attach('unsupported-unchanged-root', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result.loadStatus).toBe('unsupported'); expect(result.preserved).toBe(true); expect(result.after).toEqual(result.before);
  expect(result.normalValidatedExportAvailable).toBe(false);
});
test('F01 supported later-distinct producer successes save/export/migrate/import without changed counters', async ({ page }, info) => {
  await page.goto('tests/fixtures/backup-roundtrip.html'); await page.waitForFunction(() => !!window.backupFixture);
  const result = await page.evaluate(() => window.backupFixture.runSupportedSuccessRegression());
  await info.attach('F01-producer-decoder-writer-roundtrip', { body: JSON.stringify(result), contentType: 'application/json' });
  for (const v of result.variants) {
    expect(v.rewardIssues).toEqual([]); expect(v.competitionIssues).toEqual([]); expect(v.validation.status).toBe('valid'); expect(v.decodeStatus).toBe('valid');
    expect(v.band.laterDistinctSuccesses).toBe(v.hints.length - 1);
  }
  expect(result.committedStatus).toBe('committed'); expect(result.expectedPersisted).toBe(true); expect(result.after.token.revision).toBe(1);
  expect(result.after.save).toEqual(result.original); expect(result.exportError).toBeNull(); expect(result.decodeStatus).toBe('valid');
  expect(result.migrationStatus).toBe('valid'); expect(result.compactedStatus).toBe('valid'); expect(result.replacementStatus).toBe('committed');
  expect(result.importSnapshot?.save).toEqual(result.original);
  expect(result.fresh.validationStatus).toBe('valid'); expect(result.fresh.band).toMatchObject({ independentSuccesses: 0, supportedSuccesses: 2, laterDistinctSuccesses: 1 });
});
test('F02 rejects contradictory active first-Check before replacement and preserves valid Check-2 continuation', async ({ page }, info) => {
  await page.goto('tests/fixtures/backup-roundtrip.html'); await page.waitForFunction(() => !!window.backupFixture);
  const cases = await page.evaluate(() => window.backupFixture.runActiveFirstCheckRegression());
  await info.attach('F02-import-rejection-and-continuation', { body: JSON.stringify(cases), contentType: 'application/json' });
  for (const c of cases) {
    if (c.corrupted) { expect(c.decodeStatus).toBe('invalid'); expect(c.previewCreated).toBe(false); expect(c.replacementStatus).toBe('invalid'); expect(c.unchanged).toBe(true); expect(c.after).toEqual(c.before); }
    else {
      expect(c.decodeStatus).toBe('valid'); expect(c.replacementStatus).toBe('committed'); expect(c.learningAdvanced).toBe(true);
      expect(c.delta).toMatchObject({ lifetimeDelta: 5, competitiveDelta: 5, consumedSlot: null });
      expect(c.nextBand).toMatchObject({ validChecks: 2, completedEpisodes: 1, supportedSuccesses: 1, retrySuccesses: 1 });
      expect(c.nextValidationStatus).toBe('valid'); expect(c.nextWriteStatus).toBe('committed'); expect(c.expectedPersisted).toBe(true); expect(c.after.token.revision).toBe(1);
    }
  }
});
