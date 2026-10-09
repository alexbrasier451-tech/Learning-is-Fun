import { test, expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import type { AdultProfilesApi } from '../fixtures/adult-profiles-api';
const fixtureUrl = 'tests/fixtures/adult-profiles.html';
async function enter(page: Page, touch = false) {
  const start = page.getByRole('button', { name: 'For grown-ups', exact: true });
  if (touch) await start.tap(); else { await start.focus(); await page.keyboard.press('Enter'); }
  await expect(page.getByRole('heading', { name: 'For grown-ups', exact: true })).toBeFocused();
  const next = page.getByRole('button', { name: 'Continue to adult area' });
  if (touch) await next.tap(); else { await next.focus(); await page.keyboard.press('Enter'); }
  await expect(page.getByRole('heading', { name: 'Stories, practice and care' })).toBeFocused();
}
async function capture(page: Page, info: TestInfo, name: string) {
  const path = info.outputPath(`${name}.png`); await page.screenshot({ path, fullPage: true }); await info.attach(name, { path, contentType: 'image/png' });
}
test.beforeEach(async ({ page }, info) => {
  if (info.title.startsWith('actual facade')) return;
  await page.goto(`${fixtureUrl}?namespace=${encodeURIComponent(`${info.project.name}-${info.testId}`)}`);
  await expect(page.getByRole('heading', { name: 'Who’s exploring today?' })).toBeVisible();
});

test('frozen UI shows four portraits and captures a pending rename through a guarded selection request', async ({ page }, info) => {
  await expect(page.locator('.profile-select')).toHaveCount(4);
  expect(await page.locator('.profile-select img').evaluateAll(images => images.every(img => (img as unknown as { complete: boolean; naturalWidth: number }).complete && (img as unknown as { naturalWidth: number }).naturalWidth > 0))).toBe(true);
  await capture(page, info, 'four-profiles');
  await page.getByRole('button', { name: 'Rename Ada', exact: true }).click();
  await expect(page.getByLabel('Nickname', { exact: true })).toBeFocused(); await page.getByLabel('Nickname', { exact: true }).fill('  Star  ');
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.hold());
  await page.getByRole('button', { name: 'Save explorer' }).click();
  await page.getByRole('button', { name: /Ben Choose explorer/ }).click();
  const before = await page.evaluate(() => { const f = (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles; return { selected: f.selected(), selections: f.selections(), command: f.commands().at(-1) }; });
  expect(before.selected).toBe('a'); expect(before.selections).toEqual(['b']); expect(before.command).toMatchObject({ kind: 'RenameProfile', profileId: 'a', payload: { nickname: 'Star' } });
  await page.evaluate(() => { const f = (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles; f.select('b'); f.release(); });
  await expect(page.getByRole('status').first()).toContainText('Ada: change saved');
  await expect(page.getByRole('button', { name: 'Rename Ada', exact: true })).toBeFocused();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.scenario('renamed'));
  await expect(page.getByRole('button', { name: /Star Choose explorer/ })).toBeVisible();
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot().save.profiles.a.rewards.lifetimePoints)).toBe(42);
});

test('nickname validation, avatar keyboard choice, cancelled edit and honest capacity', async ({ page }, info) => {
  await page.getByRole('button', { name: 'Add an explorer' }).click();
  await page.getByLabel('Nickname', { exact: true }).fill('   '); await page.getByRole('button', { name: 'Save explorer' }).click();
  await expect(page.getByRole('status').first()).toContainText('1–24');
  await page.getByLabel('Nickname', { exact: true }).fill('Maple');
  const radio = page.getByRole('radio', { name: 'Rowan the village maker' }); await radio.focus(); await page.keyboard.press('Space'); await expect(radio).toBeChecked();
  await capture(page, info, 'new-profile-form'); await page.getByRole('button', { name: 'Cancel edit' }).click();
  await expect(page.getByRole('button', { name: 'Add an explorer' })).toBeFocused();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.scenario('capacity'));
  await expect(page.locator('.profile-select')).toHaveCount(16); await expect(page.getByRole('button', { name: 'Add an explorer' })).toBeDisabled();
  await expect(page.getByText('16 of 16 local profiles · This browser’s profile space is full.')).toBeVisible();
});

test('create retries retain facade identity and avatar edits use their own captured command', async ({ page }) => {
  await page.getByRole('button', { name: 'Add an explorer' }).click(); await page.getByLabel('Nickname', { exact: true }).fill('  Maple  ');
  await page.getByRole('radio', { name: 'A coral flower' }).check();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.outcome('save-failed'));
  await page.getByRole('button', { name: 'Save explorer' }).click(); await expect(page.getByRole('status').first()).toContainText('Not saved.');
  const first = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.commands().at(-1));
  expect(first).toMatchObject({ kind: 'CreateProfile', payload: { nickname: 'Maple', avatarId: 'flower' } });
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.outcome('committed'));
  await page.getByRole('button', { name: 'Retry this save' }).click();
  const second = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.commands().at(-1)); expect(second).toEqual(first);
  await expect(page.getByRole('button', { name: 'Add an explorer' })).toBeFocused();
  await page.getByRole('button', { name: 'Picture for Ada', exact: true }).click(); await expect(page.getByRole('heading', { name: 'Choose a picture for Ada' })).toBeFocused();
  await page.getByRole('radio', { name: 'A market apple' }).check(); await page.getByRole('button', { name: 'Save explorer' }).click();
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.commands().at(-1))).toMatchObject({ kind: 'SetAvatar', profileId: 'a', payload: { avatarId: 'apple' } });
});

test('review F01 disappeared edit opener returns focus to the surviving chooser heading', async ({ page }) => {
  await page.getByRole('button', { name: 'Rename Ada', exact: true }).click(); await page.getByLabel('Nickname', { exact: true }).fill('Star');
  await page.evaluate(() => { const f = (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles; f.hold(); f.outcome('invalid'); });
  await page.getByRole('button', { name: 'Save explorer' }).click();
  await page.evaluate(() => { const f = (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles; f.scenario('deleted'); f.select('b'); f.release(); });
  await expect(page.getByRole('status').first()).toContainText('The captured profile is missing');
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.commands().at(-1)?.profileId)).toBe('a');
  await page.getByRole('button', { name: 'Cancel edit' }).click(); await expect(page.getByRole('heading', { name: 'Who’s exploring today?' })).toBeFocused();
  await page.getByRole('button', { name: 'Add an explorer' }).click();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.scenario('capacity'));
  await page.getByRole('button', { name: 'Cancel edit' }).click(); await expect(page.getByRole('heading', { name: 'Who’s exploring today?' })).toBeFocused();
});

test('review F02 refreshing a removed destructive target preserves its missing-profile explanation', async ({ page }) => {
  await enter(page); await page.getByRole('button', { name: 'Delete Ada', exact: true }).click();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.scenario('deleted'));
  await expect(page.getByRole('button', { name: 'Confirm destructive action' })).toBeDisabled();
  await page.getByRole('button', { name: 'Update affected-profile preview' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible(); await expect(page.getByRole('heading', { name: 'Stories, practice and care' })).toBeFocused();
  await expect(page.locator('.adult-area > .adult-status')).toContainText('That profile is no longer available');
  await expect(page.locator('.adult-area > .adult-status')).not.toContainText('Preview updated');
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.commands().length)).toBe(0);
});

test('review F03 cancellation after submitted failed or unacknowledged attempts preserves truthful outcome', async ({ page }) => {
  await enter(page);
  for (const status of ['save-failed', 'unacknowledged'] as const) {
    await page.evaluate(status => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.outcome(status), status);
    await page.getByRole('button', { name: 'Delete Ada', exact: true }).click(); await page.getByRole('button', { name: 'Confirm destructive action' }).click();
    const prior = page.getByRole('dialog').getByRole('status');
    await expect(prior).toContainText(status === 'save-failed' ? 'Not changed.' : 'not acknowledged');
    if (status === 'unacknowledged') {
      await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.blocked(true));
      await page.getByRole('button', { name: 'Download backup before this change' }).click();
      await expect(prior).toContainText('not acknowledged'); await expect(prior).toContainText('Some changes are not saved');
      await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.blocked(false));
    }
    if (status === 'save-failed') await page.getByRole('button', { name: 'Cancel destructive action' }).click(); else await page.keyboard.press('Escape');
    const result = page.locator('.adult-area > .adult-status'); await expect(result).not.toContainText('No destructive change was submitted');
    await expect(result).toContainText(status === 'save-failed' ? 'Not changed.' : 'not acknowledged');
    await expect(page.getByRole('button', { name: 'Delete Ada', exact: true })).toBeFocused();
  }
  const file = page.getByLabel('Choose a backup to replace this app’s whole save', { exact: true });
  await file.setInputFiles({ name: 'example.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
  await page.getByRole('button', { name: 'Confirm whole-save replacement' }).click(); await expect(page.getByRole('dialog').getByRole('status')).toContainText('not acknowledged');
  await page.getByRole('button', { name: 'Cancel replacement' }).click();
  await expect(page.locator('.adult-backup > .adult-status')).not.toContainText('No backup was imported');
  await expect(page.locator('.adult-backup > .adult-status')).toContainText('not acknowledged'); await expect(file).toBeFocused();
});

test('two-step adult entry, keyboard or touch confirmation cancellation and exit focus', async ({ page }, info) => {
  const touch = !!info.project.use.hasTouch; await enter(page, touch);
  const open = page.getByRole('button', { name: 'Delete Ada', exact: true }); if (touch) await open.tap(); else { await open.focus(); await page.keyboard.press('Enter'); }
  await expect(page.getByRole('button', { name: 'Cancel destructive action' })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Confirm destructive action' })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await expect(page.getByRole('button', { name: 'Cancel destructive action' })).toBeFocused();
  await capture(page, info, 'delete-confirmation'); await page.keyboard.press('Escape'); await expect(open).toBeFocused();
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.commands().length)).toBe(0);
  await page.getByRole('button', { name: 'Exit adult area' }).click(); await expect(page.getByRole('button', { name: 'For grown-ups', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'For grown-ups', exact: true }).click();
  await expect(page.getByText('This extra step helps avoid accidental entry.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to adult area' })).toBeVisible(); await capture(page, info, 'adult-entry');
});

test('producer evidence separates supported later success, distinct task, delayed review and missing data', async ({ page }, info) => {
  await enter(page); const row = page.locator('.adult-skill').filter({ has: page.getByRole('heading', { name: 'Missing totals', exact: true }) });
  await expect(row.locator('dd')).toHaveText(['4', '3', '2', '1', '1', '1']);
  await row.getByText('Recent episodes and help', { exact: true }).click();
  await expect(row.locator('.adult-episodes')).toContainText('Hint used'); await expect(row.locator('.adult-episodes')).toContainText('Later-Check success');
  await expect(row.locator('.adult-feedback')).toContainText('The planks do not reach the target total.');
  await expect(row.locator('.adult-review')).toContainText('Independent success · 2026-10-12 · Familiar task');
  await expect(page.getByText('Not practised · Not enough evidence', { exact: true })).toHaveCount(2);
  await expect(page.locator('.adult-progress')).toContainText('not proof of durable learning');
  expect(await page.locator('.adult-progress').innerText()).not.toMatch(/\d+(?:\.\d+)?%/);
  const summary = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.summaries());
  expect(summary.find(s => s.skillId === 'M01')).toMatchObject({ validChecks: 4, supportedSuccesses: 1, retrySuccesses: 1, laterDistinctSuccesses: 1, latestReview: { localDate: '2026-10-12', outcome: 'independent-success' } });
  await capture(page, info, 'truthful-progress');
});

test('preference intents retain captured profile and save failure stays visible until retry', async ({ page }, info) => {
  await enter(page); await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.outcome('save-failed'));
  await page.getByLabel('Read instructions aloud', { exact: true }).check(); await expect(page.getByText('Preferences are not saved.', { exact: false })).toBeVisible();
  await page.getByLabel('Reduce motion', { exact: true }).check(); await expect(page.locator('.adult-area[data-motion=reduced]')).toBeVisible();
  const command = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.commands()[0]); expect(command.profileId).toBe('a');
  await capture(page, info, 'preference-failure');
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.outcome('committed'));
  await page.getByRole('button', { name: 'Retry preferences' }).click(); await expect(page.getByText('Preferences match the committed save.')).toBeVisible();
  await page.getByLabel('Profile to view', { exact: true }).selectOption('b'); await expect(page.getByLabel('Read instructions aloud', { exact: true })).not.toBeChecked();
  await page.getByRole('button', { name: 'Exit adult area' }).click();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.select('b'));
  await enter(page); await expect(page.getByLabel('Profile to view', { exact: true })).toHaveValue('b');
});

test('destructive failure and stale all-profile preview never claim success', async ({ page }, info) => {
  await enter(page); await page.getByRole('button', { name: 'Reset this app’s save' }).click();
  await expect(page.getByRole('dialog')).toContainText('Ada');
  const copy = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download backup before this change' }).click(); await copy;
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.commands().length)).toBe(0);
  await page.evaluate(() => { const f = (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles; f.scenario('renamed'); });
  await expect(page.getByRole('button', { name: 'Confirm destructive action' })).toBeDisabled();
  await page.getByRole('button', { name: 'Update affected-profile preview' }).click();
  await expect(page.getByRole('dialog')).toContainText('Star'); await expect(page.getByRole('dialog')).not.toContainText('Ada');
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.outcome('save-failed'));
  await page.getByRole('button', { name: 'Confirm destructive action' }).click(); await expect(page.getByRole('dialog')).toContainText('Not changed. Fixture write failed.');
  await capture(page, info, 'destructive-failure'); await page.getByRole('button', { name: 'Cancel destructive action' }).click();
  await expect(page.getByRole('button', { name: 'Reset this app’s save' })).toBeFocused();
});

test('backup prepare cancel, stale preview, failed replacement and recovery download labels', async ({ page }, info) => {
  await enter(page); const file = page.getByLabel('Choose a backup to replace this app’s whole save', { exact: true });
  await file.setInputFiles({ name: 'example.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
  await expect(page.getByRole('button', { name: 'Cancel replacement' })).toBeFocused(); await expect(page.getByRole('dialog')).toContainText('Backup explorer');
  await page.keyboard.press('Escape'); await expect(file).toBeFocused();
  const cancelled = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.backupCalls());
  expect(cancelled[1]).toEqual({ kind: 'cancel', id: cancelled[0].id });
  await file.setInputFiles({ name: 'example.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.bump());
  await expect(page.getByRole('button', { name: 'Confirm whole-save replacement' })).toBeDisabled();
  await page.getByRole('button', { name: 'Preview file again' }).click(); await expect(page.getByRole('button', { name: 'Confirm whole-save replacement' })).toBeEnabled();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.outcome('save-failed'));
  await page.getByRole('button', { name: 'Confirm whole-save replacement' }).click(); await expect(page.getByRole('dialog')).toContainText('Not imported. Fixture write failed.');
  await expect(page.getByRole('button', { name: 'Retry confirmed replacement' })).toBeVisible(); await capture(page, info, 'backup-failure');
  await page.getByRole('button', { name: 'Cancel replacement' }).click();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.blocked(true));
  await page.getByRole('button', { name: 'Download current backup', exact: true }).click(); await expect(page.locator('.adult-backup')).toContainText('Some changes are not saved.');
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download last-committed recovery backup', exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(/^last-committed-/); await expect(page.locator('.adult-backup')).toContainText('excludes unsaved changes');
  await file.setInputFiles({ name: 'learning-is-fun.recovery.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
  await expect(page.locator('.adult-backup')).toContainText('Raw recovery data is not an importable backup');
});

test('oversized backup is rejected before the prepare port reads a file', async ({ page }) => {
  await enter(page); await page.getByLabel('Choose a backup to replace this app’s whole save', { exact: true }).setInputFiles({ name: 'too-large.json', mimeType: 'application/json', buffer: Buffer.alloc(16 * 1024 * 1024 + 1) });
  await expect(page.locator('.adult-backup')).toContainText('no larger than 16 MiB');
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.backupCalls())).toEqual([]);
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('unsupported storage recovery surface keeps raw data distinct from importable backup', async ({ page }, info) => {
  await page.goto(`${fixtureUrl}?raw=yes`); await expect(page.getByRole('button', { name: 'Download current backup', exact: true })).toBeDisabled();
  await page.getByText('Preserve unreadable or unsupported stored data', { exact: true }).click();
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download raw recovery data', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('learning-is-fun.recovery.json'); await expect(page.getByRole('status')).toContainText('not an importable backup'); await capture(page, info, 'raw-recovery');
});

test('touch targets, 200 percent text reflow and portrait-landscape relevant views', async ({ page }, info) => {
  const touch = !!info.project.use.hasTouch;
  if (touch) { await page.getByRole('button', { name: /Ben Choose explorer/ }).tap(); expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.selections())).toEqual(['b']); }
  await page.getByRole('button', { name: 'Add an explorer' }).click();
  await page.setViewportSize({ width: 683, height: 768 });
  await page.evaluate(() => { const doc = (globalThis as unknown as { document: { documentElement: { style: { fontSize: string } } } }).document; doc.documentElement.style.fontSize = '32px'; });
  const chooserLayout = await page.evaluate(() => { const doc = (globalThis as unknown as { document: { documentElement: { clientWidth: number; scrollWidth: number }; querySelectorAll(selector: string): { getBoundingClientRect(): { width: number; height: number } }[] } }).document;
    return { width: doc.documentElement.clientWidth, scroll: doc.documentElement.scrollWidth, targets: [...doc.querySelectorAll('.profile-chooser button,.profile-avatar-options label')].map(e => ({ w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height })) }; });
  expect(chooserLayout.scroll).toBeLessThanOrEqual(chooserLayout.width + 1); expect(chooserLayout.targets.every(t => t.w >= 44 && t.h >= 44)).toBe(true);
  await capture(page, info, 'chooser-text-200-percent'); await page.getByRole('button', { name: 'Cancel edit' }).click();
  await page.evaluate(() => { const doc = (globalThis as unknown as { document: { documentElement: { style: { fontSize: string } } } }).document; doc.documentElement.style.fontSize = '16px'; });
  await enter(page, touch);
  for (const viewport of [{ width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 683, height: 768 }]) {
    await page.setViewportSize(viewport); await page.evaluate(() => { (globalThis as unknown as { document: { documentElement: { style: { fontSize: string } } } }).document.documentElement.style.fontSize = '32px'; });
    const layout = await page.evaluate(() => { const doc = (globalThis as unknown as { document: { documentElement: { clientWidth: number; scrollWidth: number }; querySelectorAll(selector: string): { getBoundingClientRect(): { width: number; height: number } }[] } }).document;
      return { width: doc.documentElement.clientWidth, scroll: doc.documentElement.scrollWidth,
        targets: [...doc.querySelectorAll('.adult-area button,.adult-area summary,.adult-toggle')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height })) }; });
    expect(layout.scroll).toBeLessThanOrEqual(layout.width + 1); expect(layout.targets.every(t => t.w >= 44 && t.h >= 44)).toBe(true);
  }
  await capture(page, info, 'text-200-percent');
});

test('actual facade four-profile committed rename preferences reload and whole-backup replacement', async ({ page }, info) => {
  test.skip(process.env.ADULT_REAL_RELEASE !== 'yes', 'Controller has not released actual facade integration. Frozen ports are not completion evidence.');
  await page.goto(`${fixtureUrl}?mode=real&namespace=${encodeURIComponent(`${info.project.name}-${info.testId}`)}`);
  for (const [nickname, avatar] of [['Ada', 'pip'], ['Ben', 'rowan'], ['Cora', 'iona'], ['Dev', 'nessa']]) {
    await page.getByRole('button', { name: 'Add an explorer' }).click(); await page.getByLabel('Nickname', { exact: true }).fill(nickname);
    await page.locator(`input[type=radio][value=${avatar}]`).check(); await page.getByRole('button', { name: 'Save explorer' }).click();
    await expect(page.getByRole('button', { name: `Rename ${nickname}`, exact: true })).toBeVisible();
  }
  const original = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  const ids = Object.keys(original.save.profiles); await page.evaluate(id => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.select(id), ids[0]);
  const completions = await page.evaluate(async ids => { const f = (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles; return [await f.practice(ids[0], true), await f.practice(ids[1], false)]; }, ids);
  expect(completions.every(result => result.status === 'committed')).toBe(true);
  const practised = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  expect(practised.save.profiles[ids[0]].rewards.lifetimePoints).not.toBe(practised.save.profiles[ids[1]].rewards.lifetimePoints);
  expect(practised.save.profiles[ids[0]].world.completedQuestIds).toContain('Q1'); expect(practised.save.profiles[ids[1]].world.completedQuestIds).toContain('Q1');
  expect(practised.save.profiles[ids[2]].world.completedQuestIds).toEqual([]);
  await page.getByRole('button', { name: 'Rename Ada', exact: true }).click(); await page.getByLabel('Nickname', { exact: true }).fill('Star');
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.hold()); await page.getByRole('button', { name: 'Save explorer' }).click();
  await page.getByRole('button', { name: /Ben Choose explorer/ }).click();
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.selected())).toBe(ids[0]);
  await page.evaluate(ids => { const f = (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles; f.select(ids[1]); f.release(); }, ids);
  await expect(page.getByRole('button', { name: 'Rename Star', exact: true })).toBeVisible();
  await page.evaluate(id => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.select(id), ids[0]); await enter(page);
  expect((await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot())).save.profiles[ids[0]].rewards).toEqual(practised.save.profiles[ids[0]].rewards);
  await expect(page.locator('.adult-skill').filter({ has: page.getByRole('heading', { name: 'Missing totals', exact: true }) }).locator('dd')).toHaveText(['2', '1', '0', '1', '1', '0']);
  await page.getByLabel('Read instructions aloud', { exact: true }).check(); await page.getByLabel('Reduce motion', { exact: true }).check(); await expect(page.getByText('Preferences match the committed save.')).toBeVisible();
  const saved = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  await page.getByRole('button', { name: 'Exit adult area' }).click(); await page.reload(); await expect(page.getByRole('button', { name: 'Rename Star', exact: true })).toBeVisible();
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot())).toEqual(saved);
  await page.evaluate(id => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.select(id), ids[0]); await enter(page);
  const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download current backup', exact: true }).click(); const download = await event, path = await download.path(); expect(path).toBeTruthy();
  await page.getByLabel('Choose a backup to replace this app’s whole save', { exact: true }).setInputFiles(path!);
  await page.getByRole('button', { name: 'Confirm whole-save replacement' }).click(); await expect(page.locator('.adult-backup')).toContainText('Whole backup replacement committed');
  const replaced = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  expect(replaced.save).toEqual(saved.save); expect(replaced.token.epoch).not.toBe(saved.token.epoch); await capture(page, info, 'actual-facade-roundtrip');
  await page.getByRole('button', { name: 'Delete Star', exact: true }).click(); await page.getByRole('button', { name: 'Confirm destructive action' }).click();
  await expect(page.getByText('Star: deletion committed.', { exact: false })).toBeVisible();
  const deleted = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  expect(deleted.save.profiles[ids[0]]).toBeUndefined(); expect(deleted.save.profiles[ids[1]]).toEqual(saved.save.profiles[ids[1]]);
  await page.getByLabel('Profile to view', { exact: true }).selectOption(ids[1]); await page.getByRole('button', { name: 'Start over Ben', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm destructive action' }).click(); await expect(page.getByText('Ben: start over committed', { exact: false })).toBeVisible();
  const restarted = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  expect(restarted.save.profiles[ids[1]]).toBeUndefined(); const newBen = Object.values(restarted.save.profiles).find(p => p.identity.nickname === 'Ben')!;
  expect(newBen.identity.profileId).not.toBe(ids[1]); expect(newBen.rewards.lifetimePoints).toBe(0); expect(newBen.world.completedQuestIds).toEqual([]);
  expect(restarted.save.profiles[ids[2]]).toEqual(saved.save.profiles[ids[2]]);
  await page.getByRole('button', { name: 'Reset this app’s save' }).click(); await page.getByRole('button', { name: 'Confirm destructive action' }).click();
  await expect(page.getByText('App reset committed.', { exact: false })).toBeVisible(); expect(Object.keys((await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot())).save.profiles)).toEqual([]);
  await info.attach('actual-profile-checkpoints', { body: JSON.stringify({ original, practised, saved, replaced, deleted, restarted }), contentType: 'application/json' });
});

test('actual facade backup cancel stale native-abort exact retry and pending cancellation', async ({ page }, info) => {
  test.skip(process.env.ADULT_REAL_RELEASE !== 'yes', 'Actual facade integration requires Controller release.');
  await page.goto(`${fixtureUrl}?mode=real&namespace=${encodeURIComponent(`${info.project.name}-${info.testId}`)}`);
  for (const nickname of ['Ada', 'Ben']) {
    await page.getByRole('button', { name: 'Add an explorer' }).click(); await page.getByLabel('Nickname', { exact: true }).fill(nickname);
    await page.getByRole('button', { name: 'Save explorer' }).click(); await expect(page.getByRole('button', { name: `Rename ${nickname}`, exact: true })).toBeVisible();
  }
  const original = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  const ids = Object.keys(original.save.profiles); await page.evaluate(id => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.select(id), ids[0]); await enter(page);
  const event = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download current backup', exact: true }).click(); const path = await (await event).path(); expect(path).toBeTruthy();
  const file = page.getByLabel('Choose a backup to replace this app’s whole save', { exact: true });
  await file.setInputFiles(path!); await page.getByRole('button', { name: 'Cancel replacement' }).click();
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.nativeRoot())).toEqual({ epoch: original.token.epoch, revision: original.token.revision, save: original.save });
  await file.setInputFiles(path!);
  const renamed = await page.evaluate(async id => { const f = (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles;
    return f.send({ kind: 'RenameProfile', profileId: id, actionId: crypto.randomUUID(), expected: f.snapshot().token, payload: { nickname: 'Benny' } }); }, ids[1]);
  expect(renamed.status).toBe('committed'); await expect(page.getByRole('button', { name: 'Confirm whole-save replacement' })).toBeDisabled();
  await expect(page.getByRole('dialog')).toContainText('Benny'); await page.getByRole('button', { name: 'Preview file again' }).click();
  const beforeAbort = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.abortNextWrite());
  await page.getByRole('button', { name: 'Confirm whole-save replacement' }).click(); await expect(page.getByRole('button', { name: 'Retry confirmed replacement' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('Not imported.');
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot())).toEqual(beforeAbort);
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.nativeRoot())).toEqual({ epoch: beforeAbort.token.epoch, revision: beforeAbort.token.revision, save: beforeAbort.save });
  await capture(page, info, 'actual-native-abort'); await page.getByRole('button', { name: 'Retry confirmed replacement' }).click();
  await expect(page.locator('.adult-backup')).toContainText('Whole backup replacement committed');
  const retryIds = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.backupCalls().filter(call => call.kind === 'confirm').map(call => call.id)); expect(retryIds).toHaveLength(2); expect(retryIds[1]).toBe(retryIds[0]);
  const replaced = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot()); expect(replaced.save).toEqual(original.save); expect(replaced.token.epoch).not.toBe(original.token.epoch);
  await expect(file).toHaveValue('');
  await file.setInputFiles(path!); await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.abortNextWrite());
  await page.getByRole('button', { name: 'Confirm whole-save replacement' }).click(); await expect(page.getByRole('button', { name: 'Retry confirmed replacement' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel replacement' }).click(); await expect(page.locator('.adult-backup > .adult-status')).toContainText('no further retry was requested');
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.nativeRoot())).toEqual({ epoch: replaced.token.epoch, revision: replaced.token.revision, save: replaced.save });
  await file.setInputFiles(path!); await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.hold());
  await page.getByRole('button', { name: 'Confirm whole-save replacement' }).click(); await expect(page.getByRole('button', { name: 'Cancel replacement' })).toBeDisabled();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toBeVisible(); await expect(page.getByRole('button', { name: 'Exit adult area' })).toBeDisabled();
  await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.release()); await expect(page.locator('.adult-backup')).toContainText('Whole backup replacement committed');
  await capture(page, info, 'actual-retry-and-pending');
  const committed = await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot());
  await page.reload(); await expect(page.getByRole('button', { name: 'Rename Ada', exact: true })).toBeVisible();
  expect(await page.evaluate(() => (globalThis as unknown as { adultProfiles: AdultProfilesApi }).adultProfiles.snapshot())).toEqual(committed);
  await info.attach('actual-backup-checkpoints', { body: JSON.stringify({ original, beforeAbort, replaced, committed, retryIds }), contentType: 'application/json' });
});
