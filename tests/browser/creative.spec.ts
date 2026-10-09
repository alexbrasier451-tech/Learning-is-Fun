import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import type { CreativeFixtureApi } from '../fixtures/creative-api';
declare const window: { creativeFixture: CreativeFixtureApi };
declare const document: { documentElement: { scrollWidth: number }; querySelectorAll(selector: string): Iterable<{ getBoundingClientRect(): { width: number; height: number }; disabled: boolean }> };
declare const innerWidth: number;
declare function getComputedStyle(element: unknown): { fontSize: string; animationName: string };

async function boot(page: Page, namespace = randomUUID()) {
  await page.goto(`tests/fixtures/creative.html?speech=fake&namespace=${namespace}`);
  await expect(page.getByRole('heading', { name: 'Your little corner' })).toBeVisible(); return namespace;
}
async function q3(page: Page) { await page.evaluate(async () => { for (const id of ['Q1', 'Q2', 'Q3'] as const) await window.creativeFixture.completeQuest(id); }); }
async function snapshot(page: Page) { return page.evaluate(() => window.creativeFixture.snapshot()); }
async function evidence(page: Page, info: TestInfo, label: string) {
  await page.evaluate(() => window.creativeFixture.settle());
  const observed = await page.evaluate(async () => ({ snapshot: window.creativeFixture.snapshot(), native: await window.creativeFixture.nativeRoot(),
    events: window.creativeFixture.events(), celebrations: window.creativeFixture.celebrations() }));
  expect(observed.native).toEqual({ ...observed.snapshot.token, save: observed.snapshot.save });
  await info.attach(label, { body: JSON.stringify({ browserVersion: page.context().browser()?.version(), ...observed }, null, 2), contentType: 'application/json' });
}
test.afterEach(async ({ page }) => { await page.evaluate(() => window.creativeFixture?.cleanup()).catch(() => {}); });

for (const family of ['scarf', 'flowers', 'placement'] as const) {
  test(`${family}: free preview, undo, cancel, atomic Save, native abort retry, conflict and reload`, async ({ page, context }, info) => {
    const namespace = await boot(page); await q3(page);
    const before = await snapshot(page), id = await page.evaluate(() => window.creativeFixture.selected());
    const names = family === 'scarf' ? ['Teal', 'Amber', 'Plum'] : family === 'flowers' ? ['Coral flowers', 'Gold flowers', 'Violet flowers'] : ['Place planter in spot 1', 'Place planter in spot 2', 'Place planter in spot 3'];
    for (const name of names) {
      const control = page.getByRole('button', { name, exact: true });
      if (info.project.use.hasTouch) await control.tap(); else await control.click();
    }
    expect(await snapshot(page)).toEqual(before);
    await expect(page.getByRole('button', { name: names[2], exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    await expect(page.getByRole('button', { name: names[1], exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click(); expect(await snapshot(page)).toEqual(before);
    await page.getByRole('button', { name: names[1], exact: true }).click();
    await page.evaluate(() => window.creativeFixture.hold());
    await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.creativeFixture.held())).toBe(true);
    await expect(page.getByRole('button', { name: names[2], exact: true })).toBeDisabled();
    expect(await snapshot(page)).toEqual(before);
    await page.evaluate(() => window.creativeFixture.release());
    await expect(page.getByText('Saved · ready whenever you return.', { exact: true })).toBeVisible();
    const saved = await snapshot(page);
    expect(saved.token.revision).toBe(before.token.revision + 1);
    expect(saved.save.profiles[id].rewards).toEqual(before.save.profiles[id].rewards);
    expect(saved.save.profiles[id].encounters).toEqual(before.save.profiles[id].encounters);
    expect(await page.evaluate(() => window.creativeFixture.celebrations())).toBe(1);
    await page.reload(); await expect(page.getByRole('button', { name: names[1], exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect((await snapshot(page)).save.profiles[id].creative).toEqual(saved.save.profiles[id].creative);
    await page.getByRole('button', { name: names[2], exact: true }).click();
    await page.evaluate(() => window.creativeFixture.abort());
    await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
    await expect(page.getByText('Not saved. Your preview is safe. Try Save again.', { exact: true })).toBeVisible();
    expect((await snapshot(page)).save.profiles[id].creative).toEqual(saved.save.profiles[id].creative);
    await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
    await expect(page.getByText('Saved · ready whenever you return.', { exact: true })).toBeVisible();
    const saveCommands = await page.evaluate(() => window.creativeFixture.events().filter(e => e.kind === 'ChooseCosmetic' && e.stage === 'repository-command').map(e => e.command));
    expect(saveCommands[0]).toEqual(saveCommands[1]);
    const other = await context.newPage(); await boot(other, namespace);
    await page.getByRole('button', { name: names[0], exact: true }).click();
    await page.evaluate(() => window.creativeFixture.hold()); await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.creativeFixture.held())).toBe(true);
    await other.evaluate(async () => { const api = window.creativeFixture; await api.send({ kind: 'RenameProfile', profileId: api.selected(),
      actionId: 'creative-conflict-rename', expected: api.snapshot().token, payload: { nickname: 'Robin renamed' } }); });
    await page.evaluate(() => window.creativeFixture.release());
    await expect(page.getByText(/^Not saved: your save changed elsewhere/)).toBeVisible();
    await expect(page.getByRole('button', { name: names[0], exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
    await expect(page.getByText('Saved · ready whenever you return.', { exact: true })).toBeVisible();
    expect((await snapshot(page)).save.profiles[id].rewards).toEqual(before.save.profiles[id].rewards);
    await other.close(); await evidence(page, info, `${family}-real-save`);
  });
}

test('committed Q3 and 20/60 entitlements keep every free choice and only affect appearance', async ({ page }, info) => {
  await boot(page);
  await expect(page.getByRole('button', { name: 'Leaf scarf pattern', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Decorated planter rim', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Coral flowers', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Place planter in spot 1', exact: true })).toHaveCount(0);
  await page.evaluate(() => window.creativeFixture.completeQuest('Q1'));
  await expect(page.getByRole('button', { name: 'Leaf scarf pattern', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Coral flowers', exact: true })).toHaveCount(0);
  await page.evaluate(() => window.creativeFixture.completeQuest('Q2'));
  await expect(page.getByRole('button', { name: 'Decorated planter rim', exact: true })).toBeDisabled();
  await page.evaluate(() => window.creativeFixture.completeQuest('Q3'));
  const before = await snapshot(page), id = await page.evaluate(() => window.creativeFixture.selected());
  for (const name of ['Teal', 'Amber', 'Plum', 'Coral flowers', 'Gold flowers', 'Violet flowers', 'Place planter in spot 1', 'Place planter in spot 2', 'Place planter in spot 3', 'Leaf scarf pattern', 'Decorated planter rim']) await expect(page.getByRole('button', { name, exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Leaf scarf pattern', exact: true }).click();
  await page.getByRole('button', { name: 'Decorated planter rim', exact: true }).click();
  await page.getByRole('button', { name: 'Place planter in spot 2', exact: true }).click();
  await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
  await expect(page.getByText('Saved · ready whenever you return.', { exact: true })).toBeVisible();
  expect((await snapshot(page)).save.profiles[id].rewards).toEqual(before.save.profiles[id].rewards);
  await page.reload(); await expect(page.getByRole('button', { name: 'Leaf scarf pattern', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Decorated planter rim', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await evidence(page, info, 'entitlements-committed');
});

test('exact committed 20-point leaf entitlement changes appearance without spending points', async ({ page }, info) => {
  await boot(page);
  await page.getByRole('button', { name: 'Choose my next activity', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.creativeFixture.projection()?.status)).toBe('ready');
  await page.evaluate(async () => {
    const api = window.creativeFixture, projected = api.projection();
    if (projected?.status !== 'ready') throw new Error('Bounded bridge fixture required.');
    const a = projected.activity, rule = a.task.answerRule;
    if (rule.kind !== 'bridge-total') throw new Error('Bounded bridge rule required.');
    const target = rule.target;
    const result = await api.send({ kind: 'SubmitCheck', profileId: api.selected(), actionId: 'creative-twenty-check', expected: api.snapshot().token,
      payload: { encounterId: a.encounterId, learningEpisodeOrdinal: a.learningEpisodeOrdinal, checkSequence: a.nextCheckSequence,
        submissionId: 'creative-twenty-submission', response: { kind: 'bridge', planks: [...Array(Math.floor(target / 6)).fill(6), ...(target % 6 ? [target % 6] : [])] } } });
    if (result.status !== 'committed') throw new Error(`Practice: ${result.status}`);
  });
  const before = await snapshot(page), id = await page.evaluate(() => window.creativeFixture.selected());
  expect(before.save.profiles[id].rewards.lifetimePoints).toBe(20);
  expect(before.save.profiles[id].world.completedQuestIds).toEqual([]);
  await expect(page.getByRole('button', { name: 'Leaf scarf pattern', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Decorated planter rim', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Leaf scarf pattern', exact: true }).click();
  await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
  await expect(page.getByText('Saved · ready whenever you return.', { exact: true })).toBeVisible();
  expect((await snapshot(page)).save.profiles[id].rewards).toEqual(before.save.profiles[id].rewards);
  await evidence(page, info, 'exact-twenty-appearance');
});

test('late save stays on captured profile and profile switch discards the old preview', async ({ page }, info) => {
  await boot(page);
  const before = await snapshot(page), ids = Object.keys(before.save.profiles);
  await page.getByRole('button', { name: 'Plum', exact: true }).click(); await page.evaluate(() => window.creativeFixture.hold());
  await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.creativeFixture.held())).toBe(true);
  await page.getByRole('combobox', { name: 'Explorer' }).selectOption(ids[1]);
  await expect(page.getByRole('button', { name: 'Teal', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => window.creativeFixture.release());
  await expect.poll(async () => (await snapshot(page)).save.profiles[ids[0]].creative.scarfColourId).toBe('plum');
  expect((await snapshot(page)).save.profiles[ids[1]]).toEqual(before.save.profiles[ids[1]]);
  expect(await page.evaluate(() => window.creativeFixture.celebrations())).toBe(0);
  await expect(page.getByRole('button', { name: 'Teal', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Amber', exact: true }).click();
  await page.getByRole('combobox', { name: 'Explorer' }).selectOption(ids[0]);
  await expect(page.getByRole('button', { name: 'Plum', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await evidence(page, info, 'profile-isolation');
});

test('already applied save acknowledges without another celebration; cancel uses latest committed arrangement', async ({ page, context }, info) => {
  const namespace = await boot(page); const other = await context.newPage(); await boot(other, namespace);
  await page.getByRole('button', { name: 'Plum', exact: true }).click();
  await other.evaluate(async () => { const api = window.creativeFixture, snap = api.snapshot(), id = api.selected();
    await api.send({ kind: 'ChooseCosmetic', profileId: id, actionId: 'other-appearance', expected: snap.token,
      payload: { choice: { kind: 'appearance', value: { ...snap.save.profiles[id].creative, scarfColourId: 'plum' } } } }); });
  await expect.poll(async () => (await snapshot(page)).save.profiles[await page.evaluate(() => window.creativeFixture.selected())].creative.scarfColourId).toBe('plum');
  await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
  await expect(page.getByText('Already saved · your arrangement is safe.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.creativeFixture.celebrations())).toBe(0);
  await page.getByRole('button', { name: 'Amber', exact: true }).click();
  await other.evaluate(async () => { const api = window.creativeFixture, snap = api.snapshot(), id = api.selected();
    await api.send({ kind: 'ChooseCosmetic', profileId: id, actionId: 'other-teal', expected: snap.token,
      payload: { choice: { kind: 'appearance', value: { ...snap.save.profiles[id].creative, scarfColourId: 'teal' } } } }); });
  await expect.poll(async () => (await snapshot(page)).save.profiles[await page.evaluate(() => window.creativeFixture.selected())].creative.scarfColourId).toBe('teal');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Teal', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await other.close(); await evidence(page, info, 'already-applied-cancel');
});

test('epoch replacement drops old preview and held result without retargeting to a new child', async ({ page, context }, info) => {
  const namespace = await boot(page), before = await snapshot(page);
  const other = await context.newPage(); await boot(other, namespace);
  await page.getByRole('button', { name: 'Plum', exact: true }).click();
  await page.evaluate(() => window.creativeFixture.hold());
  await page.getByRole('button', { name: 'Save arrangement', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.creativeFixture.held())).toBe(true);
  const fresh = await other.evaluate(async () => { const api = window.creativeFixture;
    const result = await api.send({ kind: 'ResetSave', actionId: 'creative-reset', expected: api.snapshot().token, payload: {} });
    if (result.status !== 'committed') throw new Error(`Reset: ${result.status}`);
    return api.createProfile('New explorer'); });
  await page.evaluate(() => window.creativeFixture.release());
  await expect.poll(async () => (await snapshot(page)).token.epoch).not.toBe(before.token.epoch);
  await page.evaluate(id => window.creativeFixture.select(id), fresh);
  await expect(page.getByRole('button', { name: 'Teal', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => window.creativeFixture.events().some(e => e.stage === 'old-scope-save-ignored'))).toBe(true);
  expect((await snapshot(page)).save.profiles[fresh].creative.scarfColourId).toBe('teal');
  expect(await page.evaluate(() => window.creativeFixture.celebrations())).toBe(0);
  await other.close(); await evidence(page, info, 'epoch-isolation');
});

test('approved help remains hidden through pending and failed commit; explicit Read and Stop follow acknowledgement', async ({ page, browserName }, info) => {
  await boot(page); await page.evaluate(() => window.creativeFixture.openHelp());
  const projection = await page.evaluate(() => window.creativeFixture.projection());
  if (projection?.status !== 'ready') throw new Error('No approved task.');
  const hintText = projection.activity.task.hints[0].text;
  await page.evaluate(() => { window.creativeFixture.hold(); window.creativeFixture.abort(); });
  await page.getByRole('button', { name: 'Ask Pip for a hint', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.creativeFixture.held())).toBe(true);
  await expect(page.getByText(hintText, { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.creativeFixture.events().filter(e => e.stage === 'simulated-speech').length)).toBe(0);
  await page.evaluate(() => window.creativeFixture.release());
  await expect(page.getByTestId('help-status')).toHaveText('Your hint was not saved. Ask Pip again to retry.');
  await expect(page.getByText(hintText, { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Ask Pip for a hint', exact: true }).click();
  await expect(page.getByText(hintText, { exact: true })).toBeVisible();
  const after = await page.evaluate(() => window.creativeFixture.projection());
  expect(after?.status === 'ready' && after.activity.revealedAssistanceIds).toContain(projection.activity.task.hints[0].id);
  await expect(page.getByRole('img', { name: 'Pip, ready to help' })).toBeVisible();
  expect(await page.evaluate(() => window.creativeFixture.events().filter(e => e.stage === 'simulated-speech').length)).toBe(0);
  if (browserName !== 'webkit') {
    await page.getByRole('button', { name: /^Sound/ }).click(); await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Read aloud', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Read aloud', exact: true }).click();
    const stop = page.getByRole('complementary', { name: "Pip's guidance" }).getByRole('button', { name: 'Stop reading', exact: true });
    await expect(stop).toBeEnabled();
    const events = await page.evaluate(() => window.creativeFixture.events());
    expect(events.findLastIndex(e => e.stage === 'help-ui-ack' && e.status === 'committed')).toBeLessThan(events.findIndex(e => e.stage === 'simulated-speech'));
    expect(events.find(e => e.stage === 'simulated-speech')?.text).toBe(hintText);
    await stop.click();
    await expect(stop).toBeDisabled();
    await page.getByRole('button', { name: 'Silence all', exact: true }).click();
    await expect(page.getByText(hintText, { exact: true })).toBeVisible();
  } else {
    await page.getByRole('button', { name: /^Sound/ }).click();
    await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Read aloud', exact: true })).toBeDisabled();
    await expect(page.getByText('Reading aloud is unavailable here. The words stay on screen.', { exact: true })).toBeVisible();
    await expect(page.getByText(hintText, { exact: true })).toBeVisible();
  }
  await evidence(page, info, 'approved-help-order');
});

test('late help result cannot reveal or speak to a different profile', async ({ page }, info) => {
  await boot(page); await page.evaluate(() => window.creativeFixture.openHelp());
  const ids = Object.keys((await snapshot(page)).save.profiles);
  await page.evaluate(() => window.creativeFixture.hold()); await page.getByRole('button', { name: 'Ask Pip for a hint', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.creativeFixture.held())).toBe(true);
  await page.getByRole('combobox', { name: 'Explorer' }).selectOption(ids[1]); await page.evaluate(() => window.creativeFixture.release());
  await expect.poll(() => page.evaluate(() => window.creativeFixture.events().some(e => e.stage === 'old-scope-help-ignored'))).toBe(true);
  await expect(page.getByRole('img', { name: 'Pip, your companion', exact: true })).toBeVisible();
  await expect(page.getByTestId('help-status')).toHaveText('');
  expect(await page.evaluate(() => window.creativeFixture.events().filter(e => e.stage === 'simulated-speech').length)).toBe(0);
  await evidence(page, info, 'help-profile-isolation');
});

test('keyboard, tap-sized controls, reflow, reduced motion and illustrated visual evidence', async ({ page }, info) => {
  await boot(page); await q3(page); await page.emulateMedia({ reducedMotion: 'reduce' });
  const amber = page.getByRole('button', { name: 'Amber', exact: true }); await amber.focus(); await page.keyboard.press('Space');
  await expect(amber).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Leaf scarf pattern', exact: true }).click();
  await page.getByRole('button', { name: 'Violet flowers', exact: true }).click();
  await page.getByRole('button', { name: 'Decorated planter rim', exact: true }).click();
  await page.getByRole('button', { name: 'Place planter in spot 2', exact: true }).click();
  await info.attach('preview-illustration', { body: await page.screenshot({ fullPage: true, path: info.outputPath('preview.png') }), contentType: 'image/png' });
  const sizes = await page.evaluate(() => Array.from(document.querySelectorAll('.creative-plot button,.pip-companion button')).map(element => ({
    width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height,
    font: Number.parseFloat(getComputedStyle(element).fontSize) })));
  for (const size of sizes) { expect(size.width).toBeGreaterThanOrEqual(44); expect(size.height).toBeGreaterThanOrEqual(44); expect(size.font).toBeGreaterThanOrEqual(18); }
  await page.getByRole('button', { name: 'Save arrangement', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('img', { name: 'Pip, celebrating', exact: true })).toBeVisible();
  expect(await page.locator('.pip-celebration').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await info.attach('saved-celebration', { body: await page.screenshot({ fullPage: true, path: info.outputPath('saved.png') }), contentType: 'image/png' });
  await page.setViewportSize({ width: 360, height: 780 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await info.attach('narrow-reflow', { body: await page.screenshot({ fullPage: true, path: info.outputPath('narrow.png') }), contentType: 'image/png' });
  await evidence(page, info, 'keyboard-reflow');
});
