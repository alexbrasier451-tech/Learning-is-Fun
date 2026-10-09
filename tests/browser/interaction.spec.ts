import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { writeFileSync } from 'node:fs';

type Route = 'pointer' | 'tap' | 'keyboard';
/** Browser callbacks are serialized by Playwright. These local structural types
 * describe only fixture probes; they do not add DOM globals to the Node project. */
type ProbeElement = {
  dataset: Record<string, string | undefined>; scrollWidth: number; clientWidth: number;
  classList: { contains(name: string): boolean };
  getBoundingClientRect(): { width: number; height: number; left: number; right: number; top: number; bottom: number };
  getClientRects(): readonly unknown[];
  querySelectorAll(selector: string): readonly ProbeElement[];
  querySelector(selector: string): ProbeElement | null;
  addEventListener(name: string, callback: (event: { pointerId: number }) => void): void;
  releasePointerCapture(pointerId: number): void;
  dispatchEvent(event: unknown): void;
  click(): void;
};
type ProbeImage = ProbeElement & { complete: boolean; naturalWidth: number; naturalHeight: number };
type BrowserProbe = {
  scrollY: number;
  document: { documentElement: { style: { fontSize: string } }; activeElement: unknown;
    getElementById(id: string): ProbeElement | null };
  getComputedStyle(element: ProbeElement): { fontSize: string; touchAction: string; outlineWidth: string };
  PointerEvent: new (name: string, init: { pointerId: number; clientX?: number; clientY?: number }) => unknown;
};
async function activate(button: Locator, route: Route, touch: boolean) {
  if (route === 'keyboard') { await button.focus(); await button.press('Enter'); }
  else if (route === 'tap' && touch) await button.tap();
  else await button.click();
}
async function response(page: Page, name: string) { return JSON.parse((await page.getByLabel(`${name} response`).textContent())!); }
async function drag(page: Page, source: Locator, target: Locator) {
  await source.scrollIntoViewIfNeeded();
  const start = (await source.boundingBox())!;
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2 + 12, start.y + start.height / 2 + 12, { steps: 3 });
  await expect(page.locator('.iw-drag-ghost')).toHaveCount(1);
  await target.scrollIntoViewIfNeeded();
  const end = (await target.boundingBox())!;
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(page.locator('.iw-drag-ghost')).toHaveCount(0);
}
async function place(page: Page, source: Locator, target: Locator, route: Route, touch: boolean) {
  if (route === 'pointer') await drag(page, source, target);
  else { await activate(source, route, touch); await activate(target, route, touch); }
}
test.beforeEach(async ({ page }) => { await page.goto('tests/fixtures/interaction.html'); });
test.beforeAll(async ({ browser }, info) => { console.log(`${info.project.name}: observed running browser ${browser.version()}`); });

for (const route of ['pointer', 'tap', 'keyboard'] as const) {
  test(`bridge create/edit/undo/rearrange/remove through ${route}`, async ({ page, hasTouch }) => {
    const board = page.getByRole('region', { name: 'Bridge construction' });
    const put = async (n: number) => place(page, board.getByRole('button', { name: `Choose ${n} metre plank`, exact: true }), board.getByRole('button', { name: 'Place selected plank at the end' }), route, hasTouch);
    await put(2); await put(2);
    await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [2, 2] });
    await activate(board.getByRole('button', { name: 'Undo last edit' }), route, hasTouch);
    await put(3);
    await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [2, 3] });
    await activate(board.getByRole('button', { name: 'Undo last edit' }), route, hasTouch);
    await put(4);
    if (route === 'keyboard') await activate(board.getByRole('button', { name: 'Move plank 2 before', exact: true }), route, hasTouch);
    else await place(page, board.getByRole('button', { name: 'Choose placed plank 2: 4 metres', exact: true }), board.getByRole('button', { name: 'Place before plank 1', exact: true }), route, hasTouch);
    await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [4, 2] });
    await activate(board.getByRole('button', { name: 'Undo last edit' }), route, hasTouch);
    await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [2, 4] });
    await activate(board.getByRole('button', { name: 'Remove plank 2', exact: true }), route, hasTouch);
    await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [2] });
    await activate(board.getByRole('button', { name: 'Remove plank 1', exact: true }), route, hasTouch);
    await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [] });
  });
  test(`punctuation create/edit/replace/undo/remove through ${route}`, async ({ page, hasTouch }) => {
    const board = page.getByRole('region', { name: 'Punctuation construction' });
    const put = async (name: string, slot: string) => place(page, board.getByRole('button', { name: `Choose ${name}`, exact: true }), board.getByRole('button', { name: `Place selected mark in ${slot}`, exact: true }), route, hasTouch);
    await put('question mark', 'first'); await put('question mark', 'second');
    await expect.poll(() => response(page, 'Punctuation')).toEqual({ kind: 'punctuation', slots: { first: '?', second: '?' } });
    await activate(board.getByRole('button', { name: 'Undo last edit' }), route, hasTouch);
    await put('exclamation mark', 'second');
    await expect.poll(() => response(page, 'Punctuation')).toEqual({ kind: 'punctuation', slots: { first: '?', second: '!' } });
    await activate(board.getByRole('button', { name: 'Undo last edit' }), route, hasTouch);
    await put('full stop', 'first');
    await expect.poll(() => response(page, 'Punctuation')).toEqual({ kind: 'punctuation', slots: { first: '.', second: null } });
    await activate(board.getByRole('button', { name: 'Undo last edit' }), route, hasTouch);
    await expect.poll(() => response(page, 'Punctuation')).toEqual({ kind: 'punctuation', slots: { first: '?', second: null } });
    await activate(board.getByRole('button', { name: 'Clear first', exact: true }), route, hasTouch);
    await expect.poll(() => response(page, 'Punctuation')).toEqual({ kind: 'punctuation', slots: { first: null, second: null } });
  });
  test(`basket create/edit/undo/remove/clear through ${route}`, async ({ page, hasTouch }) => {
    const board = page.getByRole('region', { name: 'Fruit basket construction' });
    const put = async (which: string) => {
      if (route === 'keyboard') await activate(board.getByRole('button', { name: `Add one ${which === 'apples' ? 'apple' : 'pear'}`, exact: true }), route, hasTouch);
      else await place(page, board.getByRole('button', { name: `Choose ${which}`, exact: true }), board.getByRole('button', { name: 'Place selected fruit in basket' }), route, hasTouch);
    };
    await put('apples'); await put('apples'); await put('pears');
    await expect.poll(() => response(page, 'Merchant')).toEqual({ kind: 'merchant', apples: 2, pears: 1 });
    await activate(board.getByRole('button', { name: 'Undo last edit' }), route, hasTouch);
    await expect.poll(() => response(page, 'Merchant')).toEqual({ kind: 'merchant', apples: 2, pears: null });
    await activate(board.getByRole('button', { name: 'Remove one apple', exact: true }), route, hasTouch);
    await expect.poll(() => response(page, 'Merchant')).toEqual({ kind: 'merchant', apples: 1, pears: null });
    await activate(board.getByRole('button', { name: 'Undo last edit' }), route, hasTouch);
    await activate(board.getByRole('button', { name: 'Clear apples count', exact: true }), route, hasTouch);
    await expect.poll(() => response(page, 'Merchant')).toEqual({ kind: 'merchant', apples: null, pears: null });
  });
}

test('ordinary scroll, overlay focus return, comfortable targets and 200% portrait reflow', async ({ page, browserName }) => {
  await page.getByLabel('Ordinary scroll area').hover();
  await page.mouse.wheel(0, 350);
  await expect.poll(() => page.evaluate(() => (globalThis as unknown as BrowserProbe).scrollY)).toBeGreaterThan(0);
  const board = page.getByRole('region', { name: 'Bridge construction' });
  const trigger = board.getByRole('button', { name: 'How to move pieces' });
  await trigger.click();
  await expect(board.getByRole('dialog', { name: 'Move pieces your way' })).toBeVisible();
  await expect(board.getByRole('button', { name: 'Back to pieces' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(board.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await board.getByRole('button', { name: 'Back to pieces' }).click();
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.evaluate(() => { (globalThis as unknown as BrowserProbe).document.documentElement.style.fontSize = '32px'; });
  const metrics = await page.locator('.iw-widget').evaluateAll(elements => (elements as unknown as ProbeElement[]).map(widget => ({
    overflow: widget.scrollWidth > widget.clientWidth + 1,
    fontSize: parseFloat((globalThis as unknown as BrowserProbe).getComputedStyle(widget).fontSize),
    buttons: [...widget.querySelectorAll('button')].filter(b => b.getClientRects().length > 0).map(b => ({
      width: b.getBoundingClientRect().width, height: b.getBoundingClientRect().height,
      overflow: b.scrollWidth > b.clientWidth + 1,
      touchAction: (globalThis as unknown as BrowserProbe).getComputedStyle(b).touchAction,
      handle: b.classList.contains('iw-drag-handle'),
    })),
  })));
  expect(metrics.every(m => !m.overflow && m.fontSize >= 36)).toBe(true);
  for (const button of metrics.flatMap(m => m.buttons)) {
    expect(button.width).toBeGreaterThanOrEqual(44); expect(button.height).toBeGreaterThanOrEqual(44);
    expect(button.overflow).toBe(false);
    if (button.handle) expect(button.touchAction).toBe('none');
    else expect(button.touchAction).not.toBe('none');
  }
  await expect(page.getByRole('button', { name: 'Choose 1 metre plank', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Choose 1 metre plank', exact: true }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Place selected plank at the end' }).focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [1] });
  const screenshotPath = test.info().outputPath('portrait-200-percent.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await test.info().attach(`portrait-200-percent-${browserName}`, { path: screenshotPath, contentType: 'image/png' });
});

for (const interruption of ['escape', 'lost-capture', 'pointercancel', 'rotation', 'teardown'] as const) {
  test(`active drag ${interruption} preserves the last completed edit`, async ({ page }) => {
    const board = page.getByRole('region', { name: 'Bridge construction' });
    await board.getByRole('button', { name: 'Choose 2 metre plank', exact: true }).click();
    await board.getByRole('button', { name: 'Place selected plank at the end' }).click();
    const source = board.getByRole('button', { name: 'Choose 3 metre plank', exact: true });
    await source.scrollIntoViewIfNeeded();
    await source.evaluate(e => {
      const handle = e as unknown as ProbeElement;
      handle.addEventListener('gotpointercapture', event => { handle.dataset.testPointerId = String(event.pointerId); });
    });
    const box = (await source.boundingBox())!;
    await page.mouse.move(box.x + 20, box.y + 20); await page.mouse.down();
    await page.mouse.move(box.x + 45, box.y + 45, { steps: 3 });
    await expect(page.locator('.iw-drag-ghost')).toHaveCount(1);
    if (interruption === 'escape') await page.keyboard.press('Escape');
    if (interruption === 'lost-capture') {
      await source.evaluate(e => { const handle = e as unknown as ProbeElement; handle.releasePointerCapture(Number(handle.dataset.testPointerId)); });
      // The browser processes pending capture release at the next pointer event.
      await page.mouse.move(box.x + 46, box.y + 46);
    }
    if (interruption === 'pointercancel') await source.evaluate(e => {
      const handle = e as unknown as ProbeElement;
      handle.dispatchEvent(new (globalThis as unknown as BrowserProbe).PointerEvent('pointercancel', { pointerId: Number(handle.dataset.testPointerId) }));
    });
    if (interruption === 'rotation') {
      const current = page.viewportSize()!;
      await page.setViewportSize({ width: current.height, height: current.width });
    }
    if (interruption === 'teardown') await page.evaluate(() => (globalThis as unknown as BrowserProbe).document.getElementById('unmount')!.click());
    await expect(page.locator('.iw-drag-ghost')).toHaveCount(0);
    await page.mouse.up();
    if (interruption === 'teardown') await expect(page.locator('#panel')).toBeEmpty();
    else await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [2] });
  });
}

test('a second pointer cannot finish the active drag; drop uses changed viewport geometry', async ({ page }) => {
  const board = page.getByRole('region', { name: 'Bridge construction' });
  const source = board.getByRole('button', { name: 'Choose 5 metre plank', exact: true });
  await source.scrollIntoViewIfNeeded();
  const box = (await source.boundingBox())!;
  await page.mouse.move(box.x + 20, box.y + 20); await page.mouse.down();
  await page.mouse.move(box.x + 40, box.y + 40, { steps: 3 });
  await source.evaluate(e => (e as unknown as ProbeElement).dispatchEvent(new (globalThis as unknown as BrowserProbe).PointerEvent('pointerup', { pointerId: 999, clientX: 0, clientY: 0 })));
  await expect(page.locator('.iw-drag-ghost')).toHaveCount(1);
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [] });
  const target = board.getByRole('button', { name: 'Place selected plank at the end' });
  await target.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 30);
  const end = (await target.boundingBox())!;
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [5] });
});

test('disabled editing, invalid drop and route cleanup emit no submission/help/reward events', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('button', { name: 'Pause editing' }).click();
  await expect(page.getByRole('button', { name: 'Choose 2 metre plank', exact: true })).toBeDisabled();
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [] });
  await page.getByRole('button', { name: 'Enable editing' }).click();
  const source = page.getByRole('button', { name: 'Choose 2 metre plank', exact: true });
  await source.scrollIntoViewIfNeeded();
  const box = (await source.boundingBox())!;
  await page.mouse.move(box.x + 20, box.y + 20); await page.mouse.down();
  await page.mouse.move(5, 5, { steps: 5 }); await page.mouse.up();
  await expect(page.locator('.iw-drag-ghost')).toHaveCount(0);
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [] });
  const actions: string[] = JSON.parse((await page.getByLabel('Draft action kinds').textContent())!);
  expect(actions.every(kind => ['select', 'place', 'remove', 'move', 'set', 'increment', 'undo'].includes(kind))).toBe(true);
  await page.getByRole('button', { name: 'Unmount fixture' }).click();
  await expect(page.locator('#panel')).toBeEmpty();
  expect(errors).toEqual([]);
});

test('Chromium native touch scroll outside a handle and touch cancellation preserve the draft', async ({ page, browserName, hasTouch }) => {
  test.skip(browserName !== 'chromium' || !hasTouch, 'CDP touch injection is available only in the Chromium touch fixture.');
  const session = await page.context().newCDPSession(page);
  const scrollArea = (await page.getByLabel('Ordinary scroll area').boundingBox())!;
  const x = scrollArea.x + 40, y = scrollArea.y + scrollArea.height / 2;
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 5; step++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 25 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => (globalThis as unknown as BrowserProbe).scrollY)).toBeGreaterThan(0);
  const source = page.getByRole('button', { name: 'Choose 3 metre plank', exact: true });
  await source.scrollIntoViewIfNeeded();
  const box = (await source.boundingBox())!;
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + 20, y: box.y + 20 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + 45, y: box.y + 45 }] });
  await expect(page.locator('.iw-drag-ghost')).toHaveCount(1);
  await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(page.locator('.iw-drag-ghost')).toHaveCount(0);
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [] });
  await session.detach();
});

test('native Tab/Enter/Space traversal completes and undoes a construction with visible focus', async ({ page }) => {
  const reach = async (button: Locator) => {
    for (let attempts = 0; attempts < 100; attempts++) {
      if (await button.evaluate(e => e === (globalThis as unknown as BrowserProbe).document.activeElement)) return;
      await page.keyboard.press('Tab');
    }
    throw new Error('Target button is not reachable in the native tab order.');
  };
  await reach(page.getByRole('button', { name: 'Choose 2 metre plank', exact: true }));
  await page.keyboard.press('Space');
  const destination = page.getByRole('button', { name: 'Place selected plank at the end' });
  await reach(destination);
  expect(await destination.evaluate(e => (globalThis as unknown as BrowserProbe).getComputedStyle(e as unknown as ProbeElement).outlineWidth)).toBe('3px');
  await page.keyboard.press('Enter');
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [2] });
  await reach(page.getByRole('region', { name: 'Bridge construction' }).getByRole('button', { name: 'Undo last edit' }));
  await page.keyboard.press('Enter');
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [] });
});

test('bridge timber uses one responsive painted scale in palette and placed construction', async ({ page, hasTouch }) => {
  const board = page.getByRole('region', { name: 'Bridge construction' });
  const put = async (length: number) => {
    await activate(board.getByRole('button', { name: `Choose ${length} metre plank`, exact: true }), 'tap', hasTouch);
    await activate(board.getByRole('button', { name: 'Place selected plank at the end' }), 'tap', hasTouch);
  };
  const measure = (selector: string) => board.locator(selector).evaluateAll(elements => (elements as unknown as ProbeElement[]).map(timber => {
    const image = timber.querySelector('img') as ProbeImage;
    return { length: Number(timber.dataset.plankLength), width: image.getBoundingClientRect().width,
      height: image.getBoundingClientRect().height, naturalWidth: image.naturalWidth,
      loaded: image.complete && image.naturalWidth > 0 };
  }));
  const commonScale = async () => {
    const palette = await measure('.iw-palette .iw-timber');
    const placed = await measure('.iw-placed .iw-timber');
    expect(palette.map(p => p.length)).toEqual([1, 2, 3, 4, 5, 6]);
    for (const plank of [...palette, ...placed]) {
      expect(plank.loaded).toBe(true);
      expect(plank.naturalWidth).toBe(72 * plank.length + 16);
      expect(Math.abs(plank.width / plank.naturalWidth - palette[0].width / palette[0].naturalWidth)).toBeLessThan(.001);
      expect(Math.abs(plank.height - palette[0].height)).toBeLessThan(.02);
    }
    for (const plank of placed) expect(Math.abs(plank.width - palette.find(p => p.length === plank.length)!.width)).toBeLessThan(.02);
    // Source SVGs have 72*n painted bodies and constant side gutters. Compare
    // painted lengths at the observed image scale, not label/hit-area width.
    const painted = palette.map(p => p.width / p.naturalWidth * 72 * p.length);
    expect(Math.abs(painted[5] / painted[0] - 6)).toBeLessThan(.002);
    expect(painted.every((width, i) => i === 0 || width > painted[i - 1])).toBe(true);
    return { palette, placed, painted };
  };
  await put(1); await put(6);
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: [1, 6] });
  const original = await commonScale();
  expect(original.placed.map(p => p.length)).toEqual([1, 6]);
  const originalScreenshot = test.info().outputPath('bridge-original-1-and-6.png');
  await board.screenshot({ path: originalScreenshot });
  await test.info().attach('original-1-and-6', { path: originalScreenshot, contentType: 'image/png' });
  await activate(board.getByRole('button', { name: 'Remove plank 1', exact: true }), 'tap', hasTouch);
  await activate(board.getByRole('button', { name: 'Remove plank 1', exact: true }), 'tap', hasTouch);
  const six = [6, 1, 5, 2, 4, 3];
  for (const length of six) await put(length);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.evaluate(() => { (globalThis as unknown as BrowserProbe).document.documentElement.style.fontSize = '32px'; });
  await expect.poll(() => response(page, 'Bridge')).toEqual({ kind: 'bridge', planks: six });
  const portrait = await commonScale();
  expect(portrait.placed.map(p => p.length)).toEqual(six);
  const layout = await board.evaluate(element => {
    const widget = element as unknown as ProbeElement;
    return { overflow: widget.scrollWidth > widget.clientWidth + 1,
      buttons: [...widget.querySelectorAll('button')].filter(b => b.getClientRects().length > 0).map(b => {
        const rect = b.getBoundingClientRect();
        return { rect: { width: rect.width, height: rect.height, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
          overflow: b.scrollWidth > b.clientWidth + 1 };
      }) };
  });
  expect(layout.overflow).toBe(false);
  for (let i = 0; i < layout.buttons.length; i++) {
    const { rect, overflow } = layout.buttons[i];
    expect(rect.width).toBeGreaterThanOrEqual(44); expect(rect.height).toBeGreaterThanOrEqual(44); expect(overflow).toBe(false);
    for (const other of layout.buttons.slice(i + 1)) {
      expect(rect.left < other.rect.right && rect.right > other.rect.left && rect.top < other.rect.bottom && rect.bottom > other.rect.top).toBe(false);
    }
  }
  const portraitScreenshot = test.info().outputPath('bridge-six-lengths-portrait-200.png');
  await board.screenshot({ path: portraitScreenshot });
  await test.info().attach('six-lengths-portrait-200', { path: portraitScreenshot, contentType: 'image/png' });
  const metricsPath = test.info().outputPath('painted-geometry.json');
  writeFileSync(metricsPath, JSON.stringify({ original, portrait, layout }, null, 2));
  await test.info().attach('painted-geometry', { path: metricsPath, contentType: 'application/json' });
});
