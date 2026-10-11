import { expect, test } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ExpandedFixture } from '../fixtures/expanded-save-api';
declare const window: { expandedFixture: ExpandedFixture };
// Main consumes the retained real export. Private candidates can explicitly
// provide its byte-identical copy, without assumptions about parent directories.
const starterPath = process.env.EXPANDED_STARTER_SOURCE ?? fileURLToPath(new URL('../../artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/starter-save.json', import.meta.url));
const starter = readFileSync(starterPath, 'utf8');
if (Buffer.byteLength(starter) !== 22690 || createHash('sha256').update(starter).digest('hex') !== '7400aef18215e63f5d44303e8c16c804bc323e1f534a9edbe70956e563bc6c3e') throw new Error('Expanded compatibility requires the unchanged genuine starter export.');
function writeExport(info: TestInfo, name: string, json: string) {
  const path = process.env.EXPANDED_VERIFY_ROOT ? join(process.env.EXPANDED_VERIFY_ROOT, name) : info.outputPath(name);
  mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, json);
}
test.beforeEach(async ({ page }) => { await page.goto('tests/fixtures/expanded-save.html'); await page.waitForFunction(() => !!window.expandedFixture); });

test('actual assembly consumer cases and persisted assessed-reading adapter', async ({ page }, info) => {
  const result = await page.evaluate(text => window.expandedFixture.runBaseline(text), starter);
  await info.attach('original-compatibility-boundaries', { body: JSON.stringify(result), contentType: 'application/json' });
  expect(result.starter).toBe('valid'); expect(result.taskCount).toBe(236); expect(result.bindingCount).toBe(57); expect(result.cases).toHaveLength(48);
  for (const c of result.cases) { expect(c.status, c.caseId).toBe(c.expectedStatus); if (c.expectedCorrect !== undefined) expect(c.correct, c.caseId).toBe(c.expectedCorrect); }
  expect(result.opened.status).toBe('committed'); expect(result.assistance).toMatchObject({ status: 'committed', value: { assessedTextReadAloud: true, evidenceMode: 'listening-supported', answerHintUsed: false } });
  expect(result.check).toMatchObject({ status: 'committed', changes: { earnedPoints: { lifetimeDelta: 20, competitiveDelta: 20 } } });
});
test('immutable real River/Moss starter load/import preserves logical save before separate calendar changes', async ({ page }, info) => {
  expect(Buffer.byteLength(starter)).toBe(22690); expect(createHash('sha256').update(starter).digest('hex')).toBe('7400aef18215e63f5d44303e8c16c804bc323e1f534a9edbe70956e563bc6c3e');
  const result = await page.evaluate(text => window.expandedFixture.runStarter(text), starter);
  await info.attach('starter-paired-logical-roots-and-calendar', { body: JSON.stringify(result), contentType: 'application/json' });
  writeExport(info, 'starter-upgraded.json', result.preCalendarJson);
  expect(result.loaded).toEqual(result.original); expect(result.imported).toEqual(result.original);
  expect(result.importedToken.epoch).not.toBe(result.loadedToken.epoch); expect(result.importedToken.revision).toBe(0);
  expect(result.duplicateStatuses).toEqual(['already-applied', 'already-applied', 'already-applied', 'invalid']);
  expect(result.resumedEncounter).toMatchObject({ encounterId: '75d97a4f-733b-460f-82f2-59a884fc1909', canonicalQuestionId: 'lif.math.merchant.r1.mult-2.pears-1', validChecks: 1, assistance: { answerHintUsed: true }, learningEpisode: { status: 'open' } });
  expect(result.resumeDelta).toMatchObject({ lifetimeDelta: 0, competitiveDelta: 0 });
  const profiles = Object.values(result.imported.profiles); expect(profiles.map(p => p.rewards.lifetimePoints)).toEqual([115, 0]);
  expect(result.imported.installation.audio).toMatchObject({ soundEnabled: true, silenceAll: true, music: { muted: true }, effects: { muted: true } });
  expect(result.summaries).toHaveLength(20); expect(result.summaries.filter(s => !s.validChecks)).toHaveLength(17);
  await expect(page.locator('.adult-skill')).toHaveCount(20); await expect(page.locator('.adult-evidence-label', { hasText: 'Not practised' })).toHaveCount(20);
  expect(result.calendar.save.competition.latestOpenedWeek).toBe('2026-10-19');
  expect(Object.values(result.calendar.save.profiles).map(p => p.rewards.lifetimePoints)).toEqual([115, 0]);
  expect(result.calendar.save.installation).toEqual(result.original.installation);
});
test('real multibeat Q9 partial compaction/import and expanded responses/choices/20-skill evidence', async ({ page }, info) => {
  const result = await page.evaluate(() => window.expandedFixture.runExpansion());
  await info.attach('expanded-partial-and-final-native-roots', { body: JSON.stringify(result), contentType: 'application/json' });
  writeExport(info, 'expanded-partial.json', result.partialJson);
  writeExport(info, 'expanded-save.json', result.finalJson);
  for (const save of [result.partialBefore, result.partialCompacted, result.partialImported]) {
    expect(save.profiles.expanded.world.completedStoryBindingIds).toContain('q9-story-m08-clock');
    expect(save.profiles.expanded.world.completedStoryBindingIds).not.toContain('q9-story-m08-sequence');
    expect(save.profiles.expanded.world.completedQuestIds).not.toContain('Q9'); expect(save.profiles.expanded.rewards.questReceipts.some(r => r.questId === 'Q9')).toBe(false);
  }
  expect(result.partialCompacted.profiles.expanded.encounters[result.compactedEncounterId]).toBeUndefined();
  expect(result.finalSequenceCanonical).toBe(result.optionalSequenceCanonical);
  expect(result.partialImported).toEqual(result.partialCompacted); expect(result.optionalDelta).toMatchObject({ lifetimeDelta: 0, competitiveDelta: 0 });
  expect(result.duplicateStatus).toBe('already-applied'); expect(result.afterReloadDuplicateStatus).toBe('already-applied');
  expect(result.forms).toEqual(expect.arrayContaining(['bridge', 'punctuation', 'merchant', 'matching', 'quantity', 'sorting', 'choice', 'sequence', 'clock']));
  expect(result.reloaded).toEqual(result.save); expect(result.roundtrip).toEqual(result.save);
  const p = result.save.profiles.expanded; expect(p.world.completedQuestIds).toHaveLength(10); expect(p.world.completedStoryBindingIds).toHaveLength(15);
  expect(p.rewards.questReceipts).toHaveLength(10); expect(p.rewards.questReceipts.filter(r => r.questId === 'Q9')).toHaveLength(1);
  // The final sequence's ordinary award already occurred in hinted optional
  // practice. Each fresh hinted optional Check earns 10; quest bonuses add 200
  // lifetime only. Fourteen other required awards total 260, plus revisit 20.
  const ordinary = 280 + result.optionalFresh.length * 10;
  expect(p.rewards.lifetimePoints).toBe(ordinary + 200); expect(result.save.competition.currentScores.expanded).toBe(ordinary);
  expect(p.rewards.entitlementIds).toEqual(expect.arrayContaining(['home-trim', 'scarf-star', 'scarf-wave']));
  expect(Object.values(p.creative.placements)).toEqual(['planter', 'tree', 'bench', 'lantern', 'banner', 'pond']); expect(result.choiceTrace).toHaveLength(5);
  expect(result.displays.map(d => d.id)).toEqual(['spellbook', 'forest-story-map', 'forest-tale', 'sawmill-model']);
  expect(result.library.visibleAssetIds).toEqual(expect.arrayContaining(['library-shelf', 'forest-story-map'])); expect(result.workshop.visibleAssetIds).toContain('sawmill-model');
  expect(result.summaries).toHaveLength(20); for (const s of result.summaries) expect(s.validChecks).toBeGreaterThan(0);
  expect(result.absentSummaries).toHaveLength(20); for (const s of result.absentSummaries) { expect(s.validChecks).toBe(0); expect(s.independentSuccesses).toBe(0); }
  await expect(page.locator('.adult-skill')).toHaveCount(20); await expect(page.locator('.adult-evidence-label', { hasText: 'Recorded practice' })).toHaveCount(20);
  expect(result.budget.byteLength).toBeLessThan(16 * 1024 * 1024); expect(result.budget.nesting).toBeLessThanOrEqual(32);
  expect(result.olderCatalogueResult).toBe('unsupported');
});
test('actual English neutral/listening/hinted saved evidence reloads and retains ordinary points', async ({ page }, info) => {
  const results = await page.evaluate(() => window.expandedFixture.runListening());
  await info.attach('saved-assessed-reading-variants', { body: JSON.stringify(results), contentType: 'application/json' });
  expect(results).toHaveLength(22);
  for (const r of results) {
    const heard = r.mode !== 'neutral' && r.mode !== 'm1-forbidden', helped = r.mode === 'hinted', qualified = heard;
    expect(r.reloadedAssistance).toMatchObject({ evidenceMode: qualified ? 'listening-supported' : 'independent', assessedTextReadAloud: heard, answerHintUsed: helped, workedSupportUsed: false });
    expect(r.delta).toMatchObject({ lifetimeDelta: r.mode === 'm1-forbidden' ? 40 : helped ? 10 : 20, competitiveDelta: helped ? 10 : 20 });
    expect(r.summary).toMatchObject({ validChecks: 1, completedEpisodes: 1, independentSuccesses: qualified ? 0 : 1, supportedSuccesses: qualified ? 1 : 0 });
  }
});
