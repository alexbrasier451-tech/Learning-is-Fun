import { test, expect } from '@playwright/test';
import type { Page, Locator, TestInfo } from '@playwright/test';
import type { AdventureFixtureApi } from '../fixtures/adventure-api';

type FixtureWindow = { adventureFixture: AdventureFixtureApi };
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
    await press(page.getByRole('button', { name: `Choose ${length} metre plank`, exact: true }), mode);
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
  if (await page.locator('.adventure-scene-art').count()) await expect(page.locator('.adventure-scene-art img')).toBeVisible();
  await page.evaluate(() => (globalThis as unknown as { scrollTo(x: number, y: number): void }).scrollTo(0, 0));
  await info.attach(name, { body: await page.screenshot({ fullPage: true, animations: 'disabled' }), contentType: 'image/png' });
}
async function evidence(page: Page, info: TestInfo) {
  const data = await page.evaluate(() => { const api = (globalThis as unknown as FixtureWindow).adventureFixture;
    return { snapshot: api.snapshot(), readiness: api.readiness(), events: api.events() }; });
  await info.attach('committed-journey-and-command-receipts', { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
}
test.afterEach(async ({ page }, info) => {
  if (info.status !== info.expectedStatus) { await evidence(page, info).catch(() => {}); await capture(page, info, 'failure-before-disposal').catch(() => {}); }
  await page.evaluate(() => (globalThis as unknown as FixtureWindow).adventureFixture?.close()).catch(() => {});
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
  await press(page.getByRole('button', { name: 'Place planter in spot 2' }), mode);
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
  await press(page.getByRole('button', { name: 'Place planter in spot 3' }), 'keyboard');
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
  expect((await readiness()).facade.ready).toBe(true);
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
