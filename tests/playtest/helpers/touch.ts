import type { Page } from '@playwright/test';

export type TouchPoint = Readonly<{ x: number; y: number }>;

async function gesture(page: Page, from: TouchPoint, target: TouchPoint, cancel: boolean): Promise<void> {
  const browser = page.context().browser();
  if (browser?.browserType().name() !== 'chromium') {
    throw new Error('Trusted touch drag/cancel requires Chromium CDP; use touchscreen taps in WebKit.');
  }
  const touchPoints = await page.evaluate(() =>
    (globalThis as unknown as { navigator: { maxTouchPoints: number } }).navigator.maxTouchPoints);
  if (touchPoints < 1) throw new Error('Trusted touch drag/cancel requires a hasTouch: true context.');
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('Touch coordinates require an explicit CSS viewport.');
  for (const point of [from, target]) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < 0 || point.y < 0
      || point.x >= viewport.width || point.y >= viewport.height) {
      throw new Error('Touch coordinates must be finite and inside the current CSS viewport; observe targets after scrolling.');
    }
  }
  const session = await page.context().newCDPSession(page);
  let active = false;
  try {
    // Mark active before sending so even an interrupted start receives cleanup.
    active = true;
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...from, id: 1 }] });
    for (let step = 1; step <= 8; step++) {
      const fraction = step / 8;
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{
        x: from.x + (target.x - from.x) * fraction,
        y: from.y + (target.y - from.y) * fraction, id: 1,
      }] });
    }
    await session.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
    active = false;
  } finally {
    try {
      if (active) await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    } finally {
      await session.detach();
    }
  }
}

/** Coordinates come from currently rendered targets; no draft/Check/answer hook. */
export async function touchDrag(page: Page, points: Readonly<{ from: TouchPoint; to: TouchPoint }>): Promise<void> {
  await gesture(page, points.from, points.to, false);
}

/** Move far enough to observe manipulation, then deliver trusted pointercancel. */
export async function touchCancel(page: Page, points: Readonly<{ from: TouchPoint; toward: TouchPoint }>): Promise<void> {
  await gesture(page, points.from, points.toward, true);
}
