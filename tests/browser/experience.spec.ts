import { test, expect } from '@playwright/test';
import type { Page, Locator, TestInfo } from '@playwright/test';
import type { AdventureFixtureApi } from '../fixtures/adventure-api';
import type { StateController } from '../../src/state/contracts';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { listTasks } from '../../src/content/catalogue';
import { QUEST_ACTIVITY_BINDINGS } from '../../src/content/quest-bindings';
import { QUESTS, SCENES } from '../../src/experience/catalogue';
import { QUEST_TITLES } from '../../src/experience/world';
import type { QuestId } from '../../src/experience/types';
import type { ActivityResponse, TaskDefinition } from '../../src/learning/contracts';

type FixtureWindow = { adventureFixture: AdventureFixtureApi };
const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = []; runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (!response.url().includes('/assets/art/')) return;
    const contentType = response.headers()['content-type'] ?? '';
    // A 304 reuses cached content and may omit Content-Type; the decode check still covers that image.
    if (response.status() >= 400 || (response.ok() && new URL(response.url()).pathname.endsWith('.svg') && !contentType.includes('image/svg+xml')))
      errors.push(`${response.status()} ${contentType} ${response.url()}`);
  });
});
const snapshot = (page: Page) => page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.snapshot());
async function player(page: Page) { return Object.values((await snapshot(page)).save.profiles)[0]; }
async function press(control: Locator, mode: 'click' | 'keyboard' | 'tap') {
  await expect(control).toBeEnabled();
  if (mode === 'keyboard') { await control.focus(); await control.press('Enter'); }
  else if (mode === 'tap') await control.tap(); else await control.click();
}
async function start(page: Page, name = 'River') {
  await page.goto(`tests/fixtures/adventure.html?namespace=${test.info().testId.replace(/[^a-z0-9]/gi, '')}-${Date.now()}`);
  await page.getByLabel('New player name').fill(name); await page.getByRole('button', { name: 'Create adventurer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
}
async function bridge(page: Page, lengths: number[], mode: 'click' | 'keyboard' | 'tap') {
  for (const length of lengths) {
    const piece = page.getByRole('button', { name: `Choose ${length} metre plank`, exact: true });
    await press(piece, mode); await expect(piece).toHaveAttribute('aria-pressed', 'true');
    await press(page.getByRole('button', { name: 'Place selected plank at the end', exact: true }), mode);
  }
}
async function mark(page: Page, value: string, slot: string, mode: 'click' | 'keyboard' | 'tap') {
  await press(page.getByRole('button', { name: `Choose ${value}`, exact: true }), mode);
  await press(page.getByRole('button', { name: `Place selected mark in ${slot}`, exact: true }), mode);
}
async function fruit(page: Page, apples: number, pears: number, mode: 'click' | 'keyboard' | 'tap') {
  await press(page.getByRole('button', { name: 'Set apples to zero', exact: true }), mode);
  await press(page.getByRole('button', { name: 'Set pears to zero', exact: true }), mode);
  for (let i = 0; i < apples; i++) await press(page.getByRole('button', { name: 'Add one apple', exact: true }), mode);
  for (let i = 0; i < pears; i++) await press(page.getByRole('button', { name: 'Add one pear', exact: true }), mode);
  await expect(page.getByLabel('apples count', { exact: true })).toHaveText(String(apples));
  await expect(page.getByLabel('pears count', { exact: true })).toHaveText(String(pears));
}
async function check(page: Page) { await page.getByRole('button', { name: 'Check my idea', exact: true }).click(); await expect(page.locator('.activity-save-status')).not.toHaveText('Saving…'); }
async function openBridge(page: Page) {
  await page.getByRole('button', { name: 'Meet Pip at the bridge' }).click();
  await page.getByRole('button', { name: 'A Bridge Back Home', exact: false }).click();
  await expect(page.getByRole('heading', { name: 'Build your bridge' })).toBeVisible();
}
async function capture(page: Page, info: TestInfo, name: string) {
  if (await page.locator('.adventure-scene-art').count()) await expect(page.locator('.adventure-scene-art > img')).toBeVisible();
  for (const layer of await page.locator('.adventure-scene-piece').all()) await expect(layer.locator('img')).toBeVisible();
  // Include saved decorations and socket bases: visibility and HTTP 200 alone also accept an HTML fallback.
  await expect.poll(() => page.locator('.adventure-scene-canvas img').evaluateAll(images => images
    .filter(image => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0)
    .map(image => (image as HTMLImageElement).src)), { message: 'Every composed scene image must decode' }).toEqual([]);
  await page.evaluate(() => (globalThis as unknown as { scrollTo(x: number, y: number): void }).scrollTo(0, 0));
  const path = info.outputPath(name + '.png');
  await page.screenshot({ path, fullPage: true, animations: 'disabled' }); await info.attach(name, { path, contentType: 'image/png' });
}
async function evidence(page: Page, info: TestInfo) {
  const data = await page.evaluate(() => { const api = (globalThis as unknown as FixtureWindow).adventureFixture;
    return { snapshot: api.snapshot(), readiness: api.readiness(), events: api.events() }; });
  const path = info.outputPath('committed-journey-and-command-receipts.json'); writeFileSync(path, JSON.stringify(data, null, 2));
  await info.attach('committed-journey-and-command-receipts', { path, contentType: 'application/json' });
}
test.afterEach(async ({ page }, info) => {
  if (info.status !== info.expectedStatus) { await evidence(page, info).catch(() => {}); await capture(page, info, 'failure-before-disposal').catch(() => {}); }
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture?.close()).catch(() => {});
  expect(runtimeErrors.get(page)).toEqual([]);
});

test('ordinary Q1 → Q2 → Q3 → saved planter, all optional offers declined, reload and Hall', async ({ page }, info) => {
  const mode = info.project.name.includes('T') ? 'tap' : 'click';
  await start(page); await capture(page, info, '01-village-before'); await openBridge(page);
  expect(Object.values((await player(page)).encounters)[0].responseDraft).toBeNull();
  await bridge(page, [6, 6], mode);
  expect((await player(page)).world.completedQuestIds).toEqual([]);
  expect(Object.values((await player(page)).encounters)[0].validChecks).toBe(0);
  await check(page); await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  expect((await player(page)).world.completedQuestIds).toEqual(['Q1']);
  await capture(page, info, '02-bridge-restored');
  await press(page.getByRole('button', { name: 'Continue without the extra challenge' }), mode);
  await press(page.getByRole('button', { name: 'Wake the Whispering Library' }), mode);
  await mark(page, '?', 'question', mode); await mark(page, '!', 'discovery', mode); await check(page);
  expect((await player(page)).world.completedQuestIds).toEqual(['Q1', 'Q2']);
  await capture(page, info, '03-library-restored');
  await press(page.getByRole('button', { name: 'Continue without the extra challenge' }), mode);
  await press(page.getByRole('button', { name: 'The Merchant’s Welcome' }), mode);
  await fruit(page, 6, 3, mode); await check(page);
  expect((await player(page)).world.completedQuestIds).toEqual(['Q1', 'Q2', 'Q3']);
  await capture(page, info, '04-market-restored');
  await press(page.getByRole('button', { name: 'Continue without the extra challenge' }), mode);
  await press(page.getByRole('button', { name: 'Gold flowers', exact: true }), mode);
  await press(page.getByRole('button', { name: 'Place Flower planter in spot 2' }), mode);
  await press(page.getByRole('button', { name: 'Save arrangement' }), mode);
  await expect.poll(async () => (await player(page)).creative.placements['plot-2']).toBe('planter');
  await capture(page, info, '05-creative-saved');
  await page.getByRole('button', { name: 'Back to village · discard any unsaved preview' }).click();
  await expect(page.getByRole('heading', { name: 'Your first adventure is complete' })).toBeVisible();
  const before = await player(page); await capture(page, info, '05-explicit-ending'); await evidence(page, info);
  await page.reload(); await page.getByRole('button', { name: 'Continue as River', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Your saved gold planter' })).toBeVisible();
  expect((await player(page)).world).toEqual(before.world); expect((await player(page)).rewards).toEqual(before.rewards);
  await expect(page.locator('.adventure-celebration')).toHaveCount(0);
  await page.getByRole('button', { name: 'Visit the Hall', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hall of Champions', exact: true })).toBeVisible();
  await expect(page.getByText('This board belongs to this browser.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Back to adventure', exact: true }).click();
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.setClock('2026-10-12T12:00:00Z'));
  await page.getByRole('button', { name: 'Choose some practice', exact: true }).click();
  await expect(page.locator('.activity-heading .adventure-eyebrow')).toContainText('Review');
  const review = Object.values((await player(page)).encounters).find(e => e.selectionReason === 'due-review')!;
  const anchor = Object.values(before.encounters).find(e => e.canonicalQuestionId === review.canonicalQuestionId)!;
  expect(anchor).toBeDefined(); expect(review.bindingProvenance).toBeNull();
  expect(review.canonicalQuestionId).toBe(anchor.canonicalQuestionId); expect(review.opportunityId).not.toBe(anchor.opportunityId);
  expect(review.reviewReference?.previousSuccessWeek).toBe('2026-10-05');
  if (await page.locator('.iw-bridge').count()) await bridge(page, [6, 6], mode);
  else if (await page.locator('.iw-punctuation').count()) { await mark(page, '?', 'question', mode); await mark(page, '!', 'discovery', mode); }
  else await fruit(page, 6, 3, mode);
  await check(page);
  await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  expect((await player(page)).world).toEqual(before.world); expect((await player(page)).rewards.questReceipts).toHaveLength(3);
  await expect(page.locator('.adventure-celebration')).toHaveCount(0);
  // A real later-week successful review compacts the original story encounter.
  expect((await player(page)).encounters[anchor.encounterId]).toBeUndefined();
  const quest = anchor.bindingProvenance!.questId as 'Q1' | 'Q2' | 'Q3';
  const chapter = { Q1: 'The crossing', Q2: 'The spellbook', Q3: 'The welcome' }[quest];
  await page.reload(); await page.getByRole('button', { name: 'Continue as River', exact: true }).click();
  await page.getByRole('button', { name: new RegExp(chapter) }).click();
  await page.getByRole('button', { name: 'Try the optional challenge', exact: true }).click();
  await expect(page.getByText('Optional new challenge', { exact: false })).toBeVisible();
  const afterCompaction = Object.values((await player(page)).encounters).find(e => e.bindingProvenance?.role === 'optional-transfer')!;
  expect(afterCompaction.bindingProvenance).toMatchObject({ questId: quest, role: 'optional-transfer' });
  expect(afterCompaction.canonicalQuestionId).not.toBe(anchor.canonicalQuestionId);
  expect((await player(page)).world).toEqual(before.world); expect((await player(page)).rewards.questReceipts).toHaveLength(3);
  await evidence(page, info);
});

test('supported keyboard journey: suspend versus finish, both merchant constraints and calm spellbook ending', async ({ page }, info) => {
  await start(page, 'Willow'); await openBridge(page); await bridge(page, [4, 4], 'keyboard'); await check(page);
  let original = Object.values((await player(page)).encounters)[0];
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Build your bridge' })).toBeVisible();
  let resumed = Object.values((await player(page)).encounters)[0];
  expect(resumed.learningEpisode.ordinal).toBe(original.learningEpisode.ordinal);
  expect(resumed.encounterId).toBe(original.encounterId); expect(resumed.opportunityId).toBe(original.opportunityId);
  await page.getByRole('button', { name: 'Ask Pip for a hint' }).click();
  await expect(page.locator('.pip-guidance')).toContainText('Look at the required span');
  await page.getByRole('button', { name: 'Finish practice for now' }).click();
  await expect(page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true })).toBeVisible();
  const finished = Object.values((await player(page)).encounters)[0]; expect(finished.learningEpisode.status).toBe('completed-unsuccessful');
  expect((await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.redeliverLastCommand())).status).toBe('already-applied');
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Build your bridge' })).toBeVisible();
  resumed = Object.values((await player(page)).encounters)[0];
  expect(resumed.learningEpisode.ordinal).toBe(original.learningEpisode.ordinal + 1);
  expect(resumed.opportunityId).toBe(original.opportunityId); expect(resumed.validChecks).toBe(1);
  await bridge(page, [4], 'keyboard'); await expect(page.getByText('You have changed your idea since this Check.', { exact: false })).toBeVisible();
  await check(page); await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Continue without the extra challenge' }).click();
  await page.getByRole('button', { name: 'Wake the Whispering Library' }).click();
  await mark(page, '.', 'question', 'keyboard'); await mark(page, '?', 'discovery', 'keyboard'); await check(page);
  await page.getByRole('button', { name: 'Ask Pip for a hint' }).click();
  await mark(page, '?', 'question', 'keyboard'); await mark(page, '.', 'discovery', 'keyboard'); await check(page);
  await page.getByRole('button', { name: 'Continue without the extra challenge' }).click();
  await page.getByRole('button', { name: 'The Merchant’s Welcome' }).click();
  await fruit(page, 5, 4, 'keyboard'); await check(page);
  let merchant = Object.values((await player(page)).encounters).find(e => e.bindingProvenance?.questId === 'Q3')!;
  const relationIssues = merchant.lastCommittedCheck!.evaluation.feedback.issues; expect(relationIssues.length).toBeGreaterThan(0);
  await fruit(page, 4, 2, 'keyboard'); await check(page);
  merchant = Object.values((await player(page)).encounters).find(e => e.bindingProvenance?.questId === 'Q3')!;
  expect(merchant.lastCommittedCheck!.evaluation.feedback.issues).not.toEqual(relationIssues);
  await page.getByRole('button', { name: 'Ask Pip for a hint' }).click(); await fruit(page, 6, 3, 'keyboard'); await check(page);
  await page.getByRole('button', { name: 'Continue without the extra challenge' }).click();
  await press(page.getByRole('button', { name: 'Violet flowers', exact: true }), 'keyboard');
  await press(page.getByRole('button', { name: 'Place Flower planter in spot 3' }), 'keyboard');
  await press(page.getByRole('button', { name: 'Save arrangement' }), 'keyboard');
  await expect.poll(async () => (await player(page)).creative.placements['plot-3']).toBe('planter');
  expect((await player(page)).world.completedQuestIds).toEqual(['Q1', 'Q2', 'Q3']); await evidence(page, info);
});

test('third bridge combination and distinct optional transfer preserve provenance on leave and resume', async ({ page }, info) => {
  await start(page); await openBridge(page); await bridge(page, [5, 4, 3], 'click'); await check(page);
  const source = Object.values((await player(page)).encounters)[0];
  await page.getByRole('button', { name: 'Continue without the extra challenge' }).click();
  await page.getByRole('button', { name: /The crossing/ }).click();
  await expect(page.getByRole('button', { name: 'Try the optional challenge', exact: true })).toBeVisible();
  await page.reload(); await page.getByRole('button', { name: 'Continue as River', exact: true }).click();
  await page.getByRole('button', { name: /The crossing/ }).click();
  await page.getByRole('button', { name: 'Try the optional challenge' }).click();
  await expect(page.getByText('Optional new challenge', { exact: false })).toBeVisible();
  let transfer = Object.values((await player(page)).encounters).find(e => e.bindingProvenance?.role === 'optional-transfer')!;
  expect(transfer.canonicalQuestionId).not.toBe(source.canonicalQuestionId);
  expect(transfer.bindingProvenance?.bindingId).toBe('q1-transfer-m01');
  await bridge(page, [1], 'click'); await page.getByRole('button', { name: 'Leave activity' }).click();
  await page.getByRole('button', { name: 'Resume A Bridge Back Home · optional challenge' }).click();
  const after = (await player(page)).encounters[transfer.encounterId];
  expect(after.bindingProvenance).toEqual(transfer.bindingProvenance); expect(after.opportunityId).toBe(transfer.opportunityId);
  expect(after.responseDraft).toEqual({ kind: 'bridge', planks: [1] });
  expect((await player(page)).world.completedQuestIds).toEqual(['Q1']);
  await page.getByRole('button', { name: 'Remove plank 1', exact: true }).click();
  const span = Number((await page.locator('.activity-reading p').innerText()).match(/span (\d+) metres/)![1]);
  await bridge(page, [...Array(Math.floor(span / 6)).fill(6), ...(span % 6 ? [span % 6] : [])], 'click'); await check(page);
  await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  expect((await player(page)).world.completedStoryBindingIds).toEqual(['q1-story-m01']);
  expect((await player(page)).rewards.questReceipts).toHaveLength(1); await evidence(page, info);
});

test('native save aborts retain draft and committed help; exact retry, leave failure, flush and explicit discard', async ({ page }, info) => {
  await start(page); await openBridge(page); await bridge(page, [2], 'click');
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.abortNext());
  await page.getByRole('button', { name: 'Ask Pip for a hint' }).click();
  await expect(page.getByRole('button', { name: 'Retry saved action' })).toBeVisible();
  await expect(page.locator('.pip-guidance')).not.toContainText('Look at the required span');
  expect(Object.values((await player(page)).encounters)[0].revealedAssistanceIds).toEqual([]);
  await page.getByRole('button', { name: 'Retry saved action' }).click();
  await expect(page.locator('.pip-guidance')).toContainText('Look at the required span');
  await check(page);
  await bridge(page, [3], 'click');
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.abortNext());
  await page.getByRole('button', { name: 'Leave activity' }).click();
  await expect(page.getByRole('heading', { name: 'Your draft is still here' })).toBeVisible();
  const failed = await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.readiness());
  expect(failed.panel).toEqual({ dirty: true, pending: false, failed: true });
  expect((await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.flush())).ready).toBe(false);
  await page.getByRole('button', { name: 'Retry saving and leaving' }).click();
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await expect(page.getByText('2 planks · 5 metres so far.', { exact: false })).toBeVisible();
  await bridge(page, [1], 'click');
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.abortNext());
  await page.getByRole('button', { name: 'Leave activity' }).click();
  await page.getByRole('button', { name: 'Leave without saving the draft' }).click();
  const saved = Object.values((await player(page)).encounters)[0];
  expect(saved.responseDraft).toEqual({ kind: 'bridge', planks: [2, 3] }); expect(saved.validChecks).toBe(1); expect(saved.revealedAssistanceIds).toContain('bridge-look');
  expect((await player(page)).world.completedQuestIds).toEqual([]);
  const commands = await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.events().filter(e => e.stage === 'command').map(e => e.command));
  const hints = commands.filter(c => c.kind === 'RecordAssistance'); expect(hints[0]).toEqual(hints[1]);
  const suspends = commands.filter(c => c.kind === 'SuspendEncounter'); expect(suspends[0]).toEqual(suspends[1]);
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Build your bridge' })).toBeVisible();
  await bridge(page, [1], 'click');
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.holdNext());
  await page.getByRole('button', { name: 'Leave activity' }).click();
  await expect.poll(() => page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.events().at(-1)?.stage)).toBe('held');
  expect((await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.externalRename('River renewed'))).status).toBe('committed');
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.release());
  await expect(page.getByRole('heading', { name: 'Your draft is still here' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry saving and leaving' }).click();
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await expect(page.getByText('3 planks · 6 metres so far.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Remove plank 1', exact: true }).click();
  await page.getByRole('button', { name: 'Remove plank 1', exact: true }).click();
  await page.getByRole('button', { name: 'Remove plank 1', exact: true }).click();
  await bridge(page, [6, 6], 'click');
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.loseNextAcknowledgement());
  await check(page); await expect(page.getByRole('button', { name: 'Retry saved action' })).toBeVisible();
  await page.getByRole('button', { name: 'Retry saved action' }).click();
  await expect(page.locator('.activity-save-status')).toHaveText('Already saved. Your progress is safe.');
  await expect(page.locator('.adventure-celebration')).toHaveCount(0);
  await expect(page.locator('.pip-celebration')).toHaveCount(0);
  expect((await player(page)).world.completedQuestIds).toEqual(['Q1']);
  const checks = await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.events().filter(e => e.stage === 'command' && e.command.kind === 'SubmitCheck'));
  expect(checks.at(-1)).toEqual(checks.at(-2));
  await evidence(page, info);
});

test('pending Check blocks profile change, saves only captured child, and a failed switch retains selection', async ({ page }, info) => {
  await start(page, 'First'); await page.getByRole('button', { name: 'Player chooser', exact: true }).click();
  await page.getByLabel('New player name').fill('Second'); await page.getByRole('button', { name: 'Create adventurer', exact: true }).click();
  await page.getByRole('button', { name: 'Play as First', exact: true }).click(); await openBridge(page); await bridge(page, [6, 6], 'click');
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.holdNext());
  await page.getByRole('button', { name: 'Check my idea' }).click();
  await page.getByRole('button', { name: 'Play as Second', exact: true }).click();
  await expect(page.getByText('First’s adventure', { exact: true })).toBeVisible();
  expect(Object.values((await snapshot(page)).save.profiles).find(p => p.identity.nickname === 'Second')!.world.completedQuestIds).toEqual([]);
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.release());
  await expect(page.getByText('Second’s adventure', { exact: true })).toBeVisible();
  expect(Object.values((await snapshot(page)).save.profiles).find(p => p.identity.nickname === 'First')!.world.completedQuestIds).toEqual(['Q1']);
  await openBridge(page); await bridge(page, [2], 'click');
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.abortNext());
  await page.getByRole('button', { name: 'Play as First', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retry player change' })).toBeVisible();
  await expect(page.getByText('Second’s adventure', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Retry player change' }).click();
  await expect(page.getByText('First’s adventure', { exact: true })).toBeVisible();
  const readiness = () => page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.readiness());
  const withoutActivity = (await readiness()).stateSubscriptions;
  await page.getByRole('button', { name: 'Play as Second', exact: true }).click();
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Build your bridge' })).toBeVisible();
    await expect.poll(async () => (await readiness()).stateSubscriptions).toBe(withoutActivity + 1);
    await expect(page.getByRole('button', { name: 'Choose placed plank 1: 2 metres', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true })).toBeVisible();
    await expect.poll(async () => (await readiness()).stateSubscriptions).toBe(withoutActivity);
  }
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await bridge(page, [4, 6], 'click');
  expect((await readiness()).panel?.dirty).toBe(true);
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.holdNext());
  await page.getByRole('button', { name: 'Check my idea', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.events().at(-1)?.stage)).toBe('held');
  expect((await readiness()).panel?.pending).toBe(true);
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.remountWorld());
  await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
  await expect.poll(async () => (await readiness()).panel).toBeNull();
  await expect.poll(async () => (await readiness()).stateSubscriptions).toBe(withoutActivity);
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.release());
  await expect.poll(async () => Object.values((await snapshot(page)).save.profiles).find(p => p.identity.nickname === 'Second')!.world.completedQuestIds).toEqual(['Q1']);
  await expect(page.locator('.adventure-celebration, .pip-celebration')).toHaveCount(0);
  expect((await readiness()).stateSubscriptions).toBe(withoutActivity);
  await expect.poll(async () => (await readiness()).facade.ready).toBe(true);
  await evidence(page, info);
});

test('silent reduced motion and 200 percent portrait keep native controls and committed restoration', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await start(page); await openBridge(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.evaluate(() => { (globalThis as unknown as { document: { documentElement: { style: { fontSize: string } } } }).document.documentElement.style.fontSize = '200%'; });
  await bridge(page, [6, 6], 'keyboard'); await check(page);
  await expect(page.locator('.adventure')).toHaveAttribute('data-reduced-motion', 'true');
  await expect(page.locator('.adventure-scene-art')).toHaveAttribute('data-results', /bridge-restored/);
  await page.getByRole('button', { name: 'Silence all', exact: true }).click();
  await expect.poll(async () => (await snapshot(page)).save.installation.audio.silenceAll).toBe(true);
  const layout = await page.evaluate(() => {
    const doc = (globalThis as unknown as { document: { documentElement: { scrollWidth: number; clientWidth: number }; querySelectorAll(s: string): Iterable<{ getBoundingClientRect(): { width: number; height: number }; checkVisibility(): boolean }> } }).document;
    return { width: doc.documentElement.scrollWidth, viewport: doc.documentElement.clientWidth,
      small: [...doc.querySelectorAll('.adventure button')].filter(b => b.checkVisibility()).map(b => b.getBoundingClientRect()).filter(r => r.width < 44 || r.height < 44) };
  });
  expect(layout.width).toBeLessThanOrEqual(layout.viewport); expect(layout.small).toEqual([]);
  await capture(page, info, 'portrait-200-percent-reduced-motion'); await evidence(page, info);
});

test('published journey: Hall resume keeps mission scene and edited saved Checks remain visibly unsaved', async ({ page }, info) => {
  const readRoot = () => page.evaluate(() => (globalThis as unknown as { __shellRuntime: { state: StateController } }).__shellRuntime.state.getSnapshot());
  const rootPlayer = async () => Object.values((await readRoot()).save.profiles)[0];
  const hallAndBack = async () => {
    await page.getByRole('navigation', { name: 'Your story', exact: true }).getByRole('button', { name: 'Hall of Champions', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Hall of Champions', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Back to adventure', exact: true }).click();
  };
  await page.goto('./');
  await page.getByRole('button', { name: 'Add an explorer', exact: true }).click();
  await page.getByLabel('Nickname', { exact: true }).fill('River');
  await page.getByRole('button', { name: 'Save explorer', exact: true }).click();
  await page.getByRole('button', { name: 'River Choose explorer', exact: true }).click();
  await openBridge(page); await bridge(page, [6], 'keyboard');
  await expect(page.locator('.activity-save-status')).toHaveText('Your idea is not saved yet.');
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await hallAndBack();
  const before = Object.values((await rootPlayer()).encounters)[0];
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await expect.soft(page.locator('.adventure-scene-art')).toHaveAttribute('data-scene', 'river-bridge');
  await expect.soft(page.getByRole('button', { name: 'Meet Pip at the bridge' })).toHaveCount(0);
  await check(page); await page.getByRole('button', { name: 'Ask Pip for a hint' }).click();
  await expect(page.locator('.pip-guidance')).toContainText('Look at the required span');
  await bridge(page, [6], 'keyboard');
  await expect(page.getByText('You have changed your idea since this Check.', { exact: false })).toBeVisible();
  await expect.soft(page.locator('.activity-save-status')).toHaveText('Your idea is not saved yet.');
  const dirty = (await rootPlayer()).encounters[before.encounterId];
  expect(dirty.responseDraft).toEqual({ kind: 'bridge', planks: [6] }); expect(dirty.validChecks).toBe(1);
  expect(dirty.learningEpisode.ordinal).toBe(before.learningEpisode.ordinal); expect(dirty.opportunityId).toBe(before.opportunityId);
  await capture(page, info, 'published-bridge-dirty');
  await page.getByRole('button', { name: 'Undo last edit', exact: true }).click();
  await expect(page.locator('.activity-save-status')).toHaveText('Saved on this device.');
  await bridge(page, [6], 'keyboard'); await check(page);
  await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  await expect(page.locator('.activity-save-status')).toHaveText('Saved on this device.');
  await expect.soft(page.locator('.adventure-scene-art')).toHaveAttribute('data-scene', 'river-bridge');
  await expect(page.locator('.adventure-scene-art')).toHaveAttribute('data-results', /bridge-restored/);
  const savedWorld = (await rootPlayer()).world;
  await page.reload(); await page.getByRole('button', { name: 'River Choose explorer', exact: true }).click();
  expect((await rootPlayer()).world).toEqual(savedWorld);
  await page.getByRole('button', { name: /The spellbook/ }).click();
  await page.getByRole('button', { name: 'Wake the Whispering Library', exact: true }).click();
  // Replay J-03's portrait draft, rotation and exact text-only enlargement.
  await page.setViewportSize({ width: 768, height: 1024 });
  await mark(page, '?', 'question', 'keyboard');
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.evaluate(`(() => {
    globalThis.journeyFontBaseline = [...document.querySelectorAll('body *')].filter(el => el instanceof HTMLElement)
      .map(el => ({ el, style: el.getAttribute('style'), size: parseFloat(getComputedStyle(el).fontSize) }));
    for (const { el, size } of globalThis.journeyFontBaseline) if (Number.isFinite(size)) el.style.fontSize = (size * 2) + 'px';
  })()`);
  const measureReflow = () => page.evaluate<{ viewport: number; document: number; heading: { client: number; scroll: number } }>(`(() => {
    const heading = document.querySelector('.adventure-story h1');
    return { viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth,
      heading: { client: heading.clientWidth, scroll: heading.scrollWidth } };
  })()`);
  const enlarged = await measureReflow();
  expect.soft(enlarged.document).toBeLessThanOrEqual(enlarged.viewport);
  expect.soft(enlarged.heading.scroll).toBeLessThanOrEqual(enlarged.heading.client);
  await info.attach('library-text-200-layout', { body: JSON.stringify(enlarged), contentType: 'application/json' });
  await info.attach('library-text-200', { body: await page.locator('.adventure-scene-layout').screenshot(), contentType: 'image/png' });
  await page.evaluate(`(() => {
    for (const { el, style } of globalThis.journeyFontBaseline) {
      if (style === null) el.removeAttribute('style'); else el.setAttribute('style', style);
    }
    delete globalThis.journeyFontBaseline;
  })()`);
  const restored = await measureReflow(); expect(restored.document).toBeLessThanOrEqual(restored.viewport);
  // Independent supported root-text enlargement, rather than compounding it.
  await page.evaluate(`document.documentElement.style.fontSize = '200%'`);
  const rootText = await measureReflow(); expect(rootText.document).toBeLessThanOrEqual(rootText.viewport);
  await page.setViewportSize({ width: 768, height: 1024 });
  const portrait = await measureReflow(); expect(portrait.document).toBeLessThanOrEqual(portrait.viewport);
  await page.evaluate(`document.documentElement.style.removeProperty('font-size')`);
  await expect(page.getByRole('button', { name: 'Place selected mark in question', exact: true })).toContainText('?');
  await mark(page, '.', 'question', 'keyboard'); await mark(page, '?', 'discovery', 'keyboard'); await check(page);
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click(); await hallAndBack();
  await page.getByRole('button', { name: 'Resume Wake the Whispering Library', exact: true }).click();
  await expect.soft(page.locator('.adventure-scene-art')).toHaveAttribute('data-scene', 'whispering-library');
  await page.getByRole('button', { name: 'Ask Pip for a hint' }).click();
  await mark(page, '?', 'question', 'keyboard'); await mark(page, '!', 'discovery', 'keyboard');
  await expect.soft(page.locator('.activity-save-status')).toHaveText('Your idea is not saved yet.');
  await check(page); await page.getByRole('button', { name: 'Continue without the extra challenge' }).click();
  await page.getByRole('button', { name: 'The Merchant’s Welcome', exact: true }).click();
  await fruit(page, 5, 4, 'keyboard'); await check(page);
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click(); await hallAndBack();
  await page.getByRole('button', { name: 'Resume The Merchant’s Welcome', exact: true }).click();
  await expect.soft(page.locator('.adventure-scene-art')).toHaveAttribute('data-scene', 'market-square');
  await page.getByRole('button', { name: 'Ask Pip for a hint' }).click(); await fruit(page, 6, 3, 'keyboard');
  await expect.soft(page.locator('.activity-save-status')).toHaveText('Your idea is not saved yet.');
  await check(page); await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  expect((await rootPlayer()).world.completedQuestIds).toEqual(['Q1', 'Q2', 'Q3']);
  expect((await rootPlayer()).rewards.questReceipts).toHaveLength(3);
  await info.attach('published-journey-committed-snapshot', { body: JSON.stringify(await readRoot(), null, 2), contentType: 'application/json' });
});

// Approved answer rules stay in this test process. The host exposes only native
// commands, snapshots and import confirmation; every response below uses visible controls.
const delivered = listTasks();
async function openIdea(page: Page) {
  const read = async () => Object.values((await player(page)).encounters).reverse().find(e => e.learningEpisode.status === 'open');
  await expect.poll(async () => (await read())?.encounterId).toBeTruthy();
  await expect(page.getByRole('button', { name: 'Check my idea', exact: true })).toBeEnabled();
  return (await read())!;
}
function approved(task: TaskDefinition): ActivityResponse {
  const rule = task.answerRule;
  if (rule.kind === 'accepted-responses') return rule.responses[0];
  if (rule.kind === 'merchant-constraints') { const pears = rule.total / (rule.multiplier + 1); return { kind: 'merchant', apples: pears * rule.multiplier, pears }; }
  return { kind: 'bridge', planks: [...Array(Math.floor(rule.target / 6)).fill(6), ...(rule.target % 6 ? [rule.target % 6] : [])] };
}
async function fillApproved(page: Page, task: TaskDefinition, mode: 'click' | 'keyboard' | 'tap' = 'click') {
  const response = approved(task), spec = task.responseSpec;
  const button = (name: string) => press(page.getByRole('button', { name, exact: true }), mode);
  if (response.kind === 'bridge') { for (const ignored of await page.getByRole('button', { name: /^Remove plank / }).all()) { void ignored; await page.getByRole('button', { name: 'Remove plank 1', exact: true }).click(); } await bridge(page, [...response.planks], mode); }
  else if (response.kind === 'merchant') await fruit(page, response.apples!, response.pears!, mode);
  else if ((response.kind === 'punctuation' || response.kind === 'choice') && (spec.kind === 'punctuation' || spec.kind === 'choice')) {
    const values = response.kind === 'punctuation' ? response.slots : response.choices;
    for (const slot of spec.slots) { await button('Choose ' + slot.options.find(o => o.id === values[slot.id])!.label); await button(`Place selected ${response.kind === 'punctuation' ? 'mark' : 'option'} in ${slot.id}`); }
  } else if ((response.kind === 'matching' || response.kind === 'sorting') && (spec.kind === 'matching' || spec.kind === 'sorting')) {
    const values = response.kind === 'matching' ? response.pairs : response.groups, targets = spec.kind === 'matching' ? spec.targets : spec.groups;
    for (const item of spec.items) { await button('Choose ' + item.label); await button('Place selected item with ' + targets.find(t => t.id === values[item.id])!.label); }
  } else if (response.kind === 'sequence' && spec.kind === 'sequence') {
    for (const id of [...response.orderedIds].reverse()) {
      const label = spec.tiles.find(t => t.id === id)!.label;
      while (await page.locator('.iw-sequence-card').first().getAttribute('data-sequence-id') !== id) await button(`Move ${label} earlier`);
    }
  } else if (response.kind === 'quantity' && spec.kind === 'quantity') {
    for (const slot of spec.slots) {
      const value = response.values[slot.id]!;
      await button(`Set ${slot.label} minimum`);
      let delta = value.numerator - slot.numeratorBounds.min;
      for (const step of [100, 10, 1]) while (delta >= step) { await button(step === 1 ? `Increase ${slot.label} parts` : `Increase ${slot.label} by ${step} parts`); delta -= step; }
      await button(`${slot.label} denominator ${value.denominator}`); await button(`${slot.label} unit ${value.unit}`);
    }
  } else if (response.kind === 'clock') {
    await button('Set earliest time'); await button(`Set hour ${Math.floor(response.minutes! / 60)}`);
    await button(`Set minute ${Math.floor(response.minutes! % 60 / 5) * 5}`);
    for (let n = 0; n < response.minutes! % 5; n++) await button('One minute later');
  } else throw new Error('Uncovered approved response ' + response.kind);
}
async function solveIdea(page: Page, mode: 'click' | 'keyboard' | 'tap' = 'click') {
  const encounter = await openIdea(page), task = delivered.find(t => t.canonicalQuestionId === encounter.canonicalQuestionId)!;
  await fillApproved(page, task, mode); await check(page); await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  return { encounter, task };
}
async function openQuest(page: Page, quest: QuestId) {
  await page.locator('.adventure-chapters button').nth(QUESTS.findIndex(q => q.id === quest)).click();
  await page.getByRole('button', { name: QUEST_TITLES[quest], exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Make a little difference', exact: true })).toBeVisible();
}
async function completeQuest(page: Page, quest: QuestId, mode: 'click' | 'keyboard' | 'tap' = 'click') {
  await openQuest(page, quest);
  const rows = QUEST_ACTIVITY_BINDINGS.filter(b => b.questId === quest && b.role === 'story');
  for (const [i, row] of rows.entries()) {
    const e = await openIdea(page); expect(e.bindingProvenance?.bindingId).toBe(row.bindingId);
    if (mode === 'keyboard') await page.getByRole('button', { name: 'Ask Pip for a hint', exact: true }).click();
    await solveIdea(page, mode);
    if (mode === 'keyboard') await expect(page.getByText('You used support and kept going. Your successful idea is saved.', { exact: true })).toBeVisible();
    expect((await player(page)).world.completedQuestIds.includes(quest)).toBe(i === rows.length - 1);
    if (i < rows.length - 1) await page.getByRole('button', { name: 'Continue the adventure', exact: false }).click();
  }
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
}
async function chapterOne(page: Page) { for (const id of ['Q1', 'Q2', 'Q3'] as const) await completeQuest(page, id); }

test('M2 workshop-first journey reaches all 20 assessed skills, nine forms, seven discoveries and saved six-socket finale', async ({ page }, info) => {
  test.setTimeout(180000);
  const mode = info.project.name.startsWith('T') ? 'tap' : 'click';
  await start(page, 'Aster'); await chapterOne(page);
  for (const id of ['Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'] as const) {
    await completeQuest(page, id, mode); await capture(page, info, `M2-${id}-restored`);
  }
  await expect(page.getByRole('heading', { name: 'Your kingdom is together again' })).toBeVisible();
  const permanent = (await player(page)).world;
  expect(permanent.completedStoryBindingIds).toHaveLength(15);
  // A real judged response from a delivered pool for every primary assessed skill.
  const matrix: unknown[] = [];
  for (const skill of [...new Set(QUEST_ACTIVITY_BINDINGS.map(b => b.skillId))]) {
    const row = QUEST_ACTIVITY_BINDINGS.find(b => b.role === 'revisit' && b.skillId === skill)
      ?? QUEST_ACTIVITY_BINDINGS.find(b => b.role === 'story' && b.skillId === skill)!;
    if (row.role === 'story') {
      const done = Object.values((await player(page)).encounters).find(e => e.bindingProvenance?.bindingId === row.bindingId && e.lastCommittedCheck?.evaluation.correct)!;
      expect(done).toBeDefined(); matrix.push({ bindingId: row.bindingId, canonicalQuestionId: done.canonicalQuestionId, assessedSkill: done.skillId, mechanic: row.mechanic, responseKind: row.responseKind }); continue;
    }
    const quest = QUESTS.find(q => q.id === row.questId)!;
    await page.locator('.adventure-chapters button').nth(QUESTS.indexOf(quest)).click();
    // Use the pure public projection label to select the exact binding, never an answer endpoint.
    const { resolveWorldView } = await import('../../src/experience/world');
    const p = await player(page), label = resolveWorldView({ world: p.world, creative: p.creative, entitlements: p.rewards.entitlementIds, sceneId: quest.sceneId, milestone: 'M2' }).hotspots.find(h => h.id === row.bindingId)!.label;
    await page.getByRole('button', { name: label, exact: true }).click();
    const solved = await solveIdea(page, mode); expect(solved.task.skillId).toBe(skill);
    matrix.push({ bindingId: row.bindingId, canonicalQuestionId: solved.task.canonicalQuestionId, assessedSkill: solved.task.skillId, mechanic: row.mechanic, responseKind: solved.task.responseSpec.kind });
    await page.getByRole('button', { name: 'Leave activity', exact: true }).click(); expect((await player(page)).world).toEqual(permanent);
  }
  const matrixPath = info.outputPath('assessed-skill-binding-matrix.json'); writeFileSync(matrixPath, JSON.stringify(matrix, null, 2));
  await info.attach('assessed-skill-binding-matrix', { path: matrixPath, contentType: 'application/json' });
  for (const scene of SCENES) {
    await page.locator('.adventure-chapters button').nth(QUESTS.findIndex(q => q.sceneId === scene.id)).click();
    const before = (await player(page)).rewards;
    await page.getByRole('button', { name: 'Look a little closer', exact: true }).click(); await expect(page.locator('.adventure-discovery')).toBeVisible();
    expect((await player(page)).rewards).toEqual(before);
    await capture(page, info, `M2-scene-${scene.id}`); await page.getByRole('button', { name: 'Back to exploring', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Your little corner', exact: true }).click();
  for (const [i, name] of ['Flower planter', 'Little tree', 'Curved bench', 'Warm lantern', 'Village banner', 'Small pond'].entries()) {
    await page.getByRole('button', { name, exact: true }).click(); await page.getByRole('button', { name: `Place ${name} in spot ${i + 1}`, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
  await expect.poll(async () => Object.values((await player(page)).creative.placements).filter(Boolean).length).toBe(6);
  await expect(page.getByRole('region', { name: 'Your discovered stories and invention' })).toBeVisible();
  await capture(page, info, 'M2-keepsakes-and-six-sockets');
  const beforeReload = await player(page);
  await page.reload(); await page.getByRole('button', { name: 'Continue as Aster', exact: true }).click();
  expect((await player(page)).creative).toEqual(beforeReload.creative); expect((await player(page)).world).toEqual(permanent);
  await expect(page.locator('.adventure-saved-decoration')).toHaveCount(6);
  for (const size of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(size); await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: 'html{font-size:200%}' });
    for (const scene of SCENES) {
      await page.locator('.adventure-chapters button').nth(QUESTS.findIndex(q => q.sceneId === scene.id)).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await capture(page, info, `M2-${size.width}-reduced-${scene.id}`);
    }
  }
  await evidence(page, info);
});

test('M2 library-first multibeat leave and reload plus actual Q9 compaction cannot complete a missing story beat', async ({ page }, info) => {
  test.setTimeout(180000);
  await start(page, 'Fern'); await chapterOne(page); await completeQuest(page, 'Q6', 'keyboard');
  expect((await player(page)).world.completedQuestIds).not.toContain('Q7');
  for (const id of ['Q4', 'Q5', 'Q7', 'Q8'] as const) await completeQuest(page, id, 'keyboard');
  await openQuest(page, 'Q9'); const clock = (await solveIdea(page)).encounter;
  const partial = (await player(page)).world;
  expect(partial.completedStoryBindingIds).toContain('q9-story-m08-clock'); expect(partial.completedQuestIds).not.toContain('Q9');
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await page.reload(); await page.getByRole('button', { name: 'Continue as Fern', exact: true }).click();
  expect((await player(page)).world).toEqual(partial);
  await page.getByText('More ways to explore · optional practice', { exact: true }).click();
  await page.getByLabel('Practice topic', { exact: true }).selectOption('M08');
  await page.getByRole('button', { name: 'Revisit a familiar idea', exact: true }).click();
  const repeat = await openIdea(page); expect(repeat.bindingProvenance).toBeNull(); expect(repeat.canonicalQuestionId).toBe(clock.canonicalQuestionId);
  const points = (await player(page)).rewards;
  await solveIdea(page); expect((await player(page)).encounters[clock.encounterId]).toBeUndefined();
  expect((await player(page)).rewards.lifetimePoints).toBe(points.lifetimePoints); expect((await player(page)).rewards.questReceipts).toEqual(points.questReceipts); expect((await player(page)).world).toEqual(partial);
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  const sequencePool = QUEST_ACTIVITY_BINDINGS.find(b => b.bindingId === 'q9-story-m08-sequence')!.taskIds;
  let optionalSequence = false;
  for (let n = 0; n < delivered.filter(t => t.skillId === 'M08').length && !optionalSequence; n++) {
    await page.getByText('More ways to explore · optional practice', { exact: true }).click();
    await page.getByLabel('Practice topic', { exact: true }).selectOption('M08');
    await page.getByRole('button', { name: 'Explore this topic', exact: true }).click();
    const optional = await openIdea(page); expect(optional.bindingProvenance).toBeNull();
    await page.getByRole('button', { name: 'Ask Pip for a hint', exact: true }).click(); await solveIdea(page);
    optionalSequence = sequencePool.includes(optional.canonicalQuestionId);
    expect((await player(page)).world).toEqual(partial);
    await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  }
  expect(optionalSequence).toBe(true);
  await openQuest(page, 'Q9');
  const sequence = await openIdea(page); expect(sequence.bindingProvenance?.bindingId).toBe('q9-story-m08-sequence');
  await page.getByRole('button', { name: /^Move .+ later$/ }).first().click();
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  const saved = (await player(page)).encounters[sequence.encounterId];
  await page.reload(); await page.getByRole('button', { name: 'Continue as Fern', exact: true }).click();
  expect((await player(page)).world).toEqual(partial); expect((await player(page)).encounters[sequence.encounterId].responseDraft).toEqual(saved.responseDraft);
  await page.getByRole('button', { name: 'Resume Set the Castle Clock', exact: true }).click();
  expect((await openIdea(page)).encounterId).toBe(sequence.encounterId); await solveIdea(page);
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await completeQuest(page, 'Q10'); await evidence(page, info); await capture(page, info, 'M2-library-first-final');
});

test('M2 genuine immutable M1 import retains suspended identity and old awards while new failed Check stays pending', async ({ page }, info) => {
  const source = readFileSync('artifacts/playtests/M1/b158e2b3de86d119c1650996977201264563abde-pages-38116364473-1/boundaries/starter-save.json', 'utf8');
  expect(Buffer.byteLength(source)).toBe(22690); expect(createHash('sha256').update(source).digest('hex')).toBe('7400aef18215e63f5d44303e8c16c804bc323e1f534a9edbe70956e563bc6c3e');
  await start(page, 'Temporary'); await page.getByRole('button', { name: 'Save & choose player', exact: true }).click();
  const imported = await page.evaluate(text => (globalThis as unknown as FixtureWindow).adventureFixture.importBackup(text), source);
  expect(imported.status).toBe('committed'); expect((await snapshot(page)).save).toEqual(JSON.parse(source).save);
  await page.getByRole('button', { name: 'Continue as River Boundary', exact: true }).click();
  const before = await player(page), suspended = before.encounters['75d97a4f-733b-460f-82f2-59a884fc1909'];
  await page.getByRole('button', { name: /^Resume The Merchant/ }).click();
  const resumed = await openIdea(page);
  expect(resumed).toEqual({ ...suspended, learningEpisode: { ...suspended.learningEpisode, status: 'open' } }); expect((await player(page)).rewards).toEqual(before.rewards);
  await page.getByRole('button', { name: 'Leave activity', exact: true }).click();
  await openQuest(page, 'Q4');
  // Any due review is completed through its real visible form before the requested story.
  if ((await openIdea(page)).bindingProvenance === null) { await solveIdea(page); await page.getByRole('button', { name: 'Leave activity', exact: true }).click(); await openQuest(page, 'Q4'); }
  const e = await openIdea(page); expect(e.bindingProvenance?.bindingId).toBe('q4-story-m02-match');
  await fillApproved(page, delivered.find(t => t.canonicalQuestionId === e.canonicalQuestionId)!);
  const beforeFailedCheck = await player(page);
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.abortNext()); await check(page);
  expect((await player(page)).world).toEqual(before.world); expect((await player(page)).rewards).toEqual(beforeFailedCheck.rewards);
  await expect(page.getByRole('button', { name: 'Retry saved action', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Retry saved action', exact: true }).click();
  await expect(page.getByText('Your idea worked!', { exact: true })).toBeVisible();
  const after = await player(page); expect(after.world.completedQuestIds).toContain('Q4');
  expect(after.rewards.questReceipts.filter(r => ['Q1','Q2','Q3'].includes(r.questId))).toEqual(before.rewards.questReceipts);
  await page.getByRole('button', { name: 'Play as Moss Boundary', exact: true }).click();
  await expect(page.getByText('Moss Boundary’s adventure', { exact: true })).toBeVisible();
  const moss = Object.values((await snapshot(page)).save.profiles).find(p => p.identity.nickname === 'Moss Boundary')!;
  expect(moss.world.completedQuestIds).toEqual([]); expect(moss.rewards.lifetimePoints).toBe(0);
  await page.reload(); await page.getByRole('button', { name: 'Continue as River Boundary', exact: true }).click();
  expect((await player(page)).world).toEqual(after.world); await evidence(page, info); await capture(page, info, 'M2-real-M1-save-continued');
});

test('M2 Festival offers refreshed closed facts on ordinary visit, skip and replay restore focus without story completion', async ({ page }, info) => {
  await start(page, 'Juniper'); await completeQuest(page, 'Q1');
  await expect(page.getByRole('button', { name: 'Visit the Festival', exact: true })).toHaveCount(0);
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture.setClock('2026-10-12T12:00:00Z'));
  await page.getByRole('button', { name: 'Save & choose player', exact: true }).click();
  await page.getByRole('button', { name: 'Continue as Juniper', exact: true }).click();
  await page.getByRole('button', { name: 'Visit the Festival', exact: true }).click();
  const before = await snapshot(page); await expect(page.getByRole('heading', { name: 'Village Festival', exact: true })).toBeFocused();
  await expect(page.getByText('Week beginning 2026-10-05', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('button', { name: 'Replay the Festival', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Replay the Festival', exact: true }).click(); await capture(page, info, 'M2-Festival-closed-facts');
  await page.getByRole('button', { name: 'Skip Festival', exact: true }).click(); expect((await snapshot(page)).save).toEqual(before.save);
  expect((await player(page)).world.completedQuestIds).toEqual(['Q1']);
  await page.reload(); await page.getByRole('button', { name: 'Continue as Juniper', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Visit the Festival', exact: true })).toBeVisible();
  expect((await snapshot(page)).save).toEqual(before.save); await evidence(page, info);
});
