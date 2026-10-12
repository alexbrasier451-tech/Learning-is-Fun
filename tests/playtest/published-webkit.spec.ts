import { test, expect, webkit } from '@playwright/test';
import type { BrowserContext, Locator, Page } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { platform, release } from 'node:os';
import { fileURLToPath } from 'node:url';
import { recordCheckpoint } from './helpers/evidence';
import type { CheckpointRecord } from './helpers/evidence';
import type { TouchPoint } from './helpers/touch';

const URL = 'https://alexbrasier451-tech.github.io/Learning-is-Fun/';
const BUILD = '011d2afe6e8a2215d4bebdd21787cfaa4f7a9fc9-pages-38177521884-1';
const SOURCE = '011d2afe6e8a2215d4bebdd21787cfaa4f7a9fc9';
const EXPORT_SHA = 'ef0a74d01e489704110ca02b6508fb9d532900d883a91d02d8bcb47afea70290';
const require = createRequire(import.meta.url);
const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
type Metadata = Record<string, unknown>;
type NativeInput = { type: string; at: number; time: number; isTrusted: boolean; target: string | null;
  pointerType: string | null; pointerId: number | null; clientX: number | null; clientY: number | null;
  changedTouches: { identifier: number; clientX: number; clientY: number }[] };
type Identity = { scope: string; activeScript: string | null; controller: string | null;
  reply: { type: string; buildId: string; complete: boolean } };
type Scope = { id: string; context: BrowserContext; page: Page; network: Metadata[];
  actions: { at: string; action: string }[]; checkpoints: Metadata[]; actionCursor: number;
  imported: boolean; identity?: Identity; lifecycles?: Metadata[]; frozenIdentityValid: boolean };

// One authored observation, not a producer-answer hook. Linux outcome never
// repairs or erases the retained Windows native WebKit transport failures.
test('Published M2 WebKit touch and scene transport observation', async ({ browser, browserName }, info) => {
  test.setTimeout(240_000);
  expect(platform(), 'This case supplies a real Linux host observation').toBe('linux');
  expect(browserName).toBe('webkit');
  expect(browser.browserType().name()).toBe('webkit');
  expect(require('@playwright/test/package.json').version).toBe('1.64.0');
  expect(info.config.workers).toBe(1);
  expect(info.project.retries).toBe(0);
  expect(info.project.use.headless).not.toBe(false);
  expect(process.env.PLAYTEST_MODE).toBe('published');
  expect(process.env.PLAYTEST_BASE_URL).toBe(URL);
  const candidateBytes = await readFile(new globalThis.URL('../../docs/release/M2/CANDIDATE.json', import.meta.url));
  const candidate = JSON.parse(candidateBytes.toString('utf8')) as Record<string, string>;
  expect(Object.keys(candidate).sort()).toEqual(['release', 'url', 'basePath', 'buildId', 'commit', 'deploymentRun', 'requiredInventoryLocation'].sort());
  expect(candidate.release).toBe('M2');
  expect(candidate.url).toBe(URL);
  expect(candidate.basePath).toBe('/Learning-is-Fun/');
  expect(candidate.buildId).toBe(BUILD);
  expect(candidate.commit).toBe(SOURCE);
  expect(candidate.deploymentRun).toBe('https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/38177521884');
  const ciSourceCommit = process.env.GITHUB_SHA ?? process.env.PLAYTEST_CI_SOURCE_COMMIT ?? null;
  if (process.env.CI) expect(ciSourceCommit).toMatch(/^[a-f0-9]{40}$/);
  const scopes: Scope[] = [], fatalErrors: Error[] = [], cleanup: Metadata[] = [];
  const transportRoot = info.outputPath('transport');
  await mkdir(transportRoot, { recursive: true });
  const attachJSON = async (name: string, value: unknown) => {
    const path = info.outputPath('transport', name + '.json');
    await writeFile(path, JSON.stringify(value, null, 2));
    await info.attach(name, { path, contentType: 'application/json' });
  };
  await attachJSON('runtime', {
    os: platform() + ' ' + release(), browserVersion: browser.version(), engine: browser.browserType().name(),
    playwrightVersion: require('@playwright/test/package.json').version,
    executablePath: webkit.executablePath(), installedRevision: /webkit-(\d+)/.exec(webkit.executablePath())?.[1] ?? null,
    candidate, candidateSha256: sha256(candidateBytes), ciSourceCommit,
    launch: 'Playwright runner browser fixture; headless Linux; no explicit launch/proxy/transport overrides in this spec',
    initial: { viewport: { width: 768, height: 1024 }, hasTouch: true, timezoneId: 'Europe/London', reducedMotion: 'reduce' },
    navigation: { waitUntil: 'domcontentloaded', timeout: 6000 },
    observation: 'Metadata-only fetch/signal wrapper returns native promise; no body reads, route interception, HTTP suppression, cache bypass, forced retry or artificial delay',
    acousticStatus: 'unverified; silent', startedAt: new Date().toISOString(),
  });
  const openScope = async (id: string, imported: boolean): Promise<Scope> => {
    const context = await browser.newContext({ viewport: { width: 768, height: 1024 }, hasTouch: true,
      timezoneId: 'Europe/London', reducedMotion: 'reduce' });
    const page = await context.newPage();
    const s: Scope = { id, context, page, imported, network: [], actions: [], checkpoints: [], actionCursor: 0, frozenIdentityValid: false };
    scopes.push(s);
    page.setDefaultTimeout(6000);
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    page.on('request', r => s.network.push({ event: 'request', at: new Date().toISOString(), url: r.url(), type: r.resourceType() }));
    page.on('response', r => s.network.push({ event: 'response', at: new Date().toISOString(), url: r.url(), status: r.status(), fromServiceWorker: r.fromServiceWorker() }));
    page.on('requestfailed', r => s.network.push({ event: 'failed', at: new Date().toISOString(), url: r.url(), failure: r.failure() }));
    page.on('pageerror', e => s.network.push({ event: 'pageerror', at: new Date().toISOString(), message: e.message }));
    await page.addInitScript(() => {
      const inputRows: NativeInput[] = [];
      (window as unknown as { __nativeInputDiagnostics: NativeInput[] }).__nativeInputDiagnostics = inputRows;
      for (const type of ['touchstart', 'touchend', 'pointerdown', 'pointerup']) {
        document.addEventListener(type, event => {
          const button = event.target instanceof Element ? event.target.closest('button') : null;
          const touch = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent ? event : null;
          const pointer = typeof PointerEvent !== 'undefined' && event instanceof PointerEvent ? event : null;
          inputRows.push({ type: event.type, at: Date.now(), time: performance.now(), isTrusted: event.isTrusted,
            target: button?.getAttribute('aria-label') ?? button?.textContent?.trim() ?? null,
            pointerType: pointer?.pointerType ?? null, pointerId: pointer?.pointerId ?? null,
            clientX: pointer?.clientX ?? null, clientY: pointer?.clientY ?? null,
            changedTouches: touch ? Array.from(touch.changedTouches, t => ({ identifier: t.identifier,
              clientX: t.clientX, clientY: t.clientY })) : [] });
        }, { capture: true, passive: true });
      }
      const native = window.fetch, rows: Record<string, unknown>[] = [];
      (window as unknown as { __sceneFetchDiagnostics: typeof rows }).__sceneFetchDiagnostics = rows;
      let next = 0;
      const record = (event: string, id: number, details: Record<string, unknown>) => rows.push({
        event, id, at: Date.now(), time: performance.now(), controller: navigator.serviceWorker.controller?.scriptURL ?? null, ...details,
      });
      window.fetch = function (...args: Parameters<typeof fetch>) {
        const input = args[0], url = input instanceof Request ? input.url : String(input);
        const signal = args[1]?.signal ?? (input instanceof Request ? input.signal : undefined);
        if (!url.includes('/assets/art/')) return native.apply(this, args);
        const id = ++next;
        record('fetch', id, { url, signalPresent: !!signal, aborted: signal?.aborted,
          scene: document.querySelector('.adventure-scene-art')?.getAttribute('data-scene'),
          results: document.querySelector('.adventure-scene-art')?.getAttribute('data-results') });
        signal?.addEventListener('abort', () => record('abort', id, { url, aborted: signal.aborted,
          reasonName: signal.reason?.name, stack: new Error().stack }), { once: true });
        const promise = native.apply(this, args);
        promise.then(response => record('response', id, { url, status: response.status, aborted: signal?.aborted }),
          error => record('reject', id, { url, errorName: error?.name, errorMessage: error?.message,
            aborted: signal?.aborted, reasonName: signal?.reason?.name }));
        return promise;
      };
    });
    return s;
  };
  const tapLocator = async (s: Scope, locator: Locator, label: string) => {
    await expect(locator).toBeEnabled();
    await locator.scrollIntoViewIfNeeded();
    const rect = await locator.boundingBox();
    expect(rect, label + ' native rendered target').not.toBeNull();
    const point: TouchPoint = { x: rect!.x + rect!.width / 2, y: rect!.y + rect!.height / 2 };
    s.actions.push({ at: new Date().toISOString(), action: 'touchscreen.tap ' + label });
    await s.page.touchscreen.tap(point.x, point.y);
  };
  const tap = (s: Scope, name: string) => tapLocator(s, s.page.getByRole('button', { name, exact: true }).first(), name);
  const nativeState = (s: Scope) => s.page.evaluate(() => ({
    at: new Date().toISOString(), local: new Date().toString(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    controller: navigator.serviceWorker.controller?.scriptURL ?? null, viewport: { width: innerWidth, height: innerHeight },
    rootFont: getComputedStyle(document.documentElement).fontSize, documentWidth: document.documentElement.scrollWidth,
    touchPoints: navigator.maxTouchPoints, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    runningAnimations: document.getAnimations().filter(a => a.playState === 'running').length,
    targets: [...document.querySelectorAll('main button')].filter(e => e.getBoundingClientRect().width > 0).map(e => {
      const rect = e.getBoundingClientRect();
      return { label: e.getAttribute('aria-label') ?? e.textContent?.trim(), width: rect.width, height: rect.height,
        overflow: e.scrollWidth > e.clientWidth + 2 };
    }),
    art: [...document.querySelectorAll('.adventure-scene-art')].map(e => ({ scene: e.getAttribute('data-scene'),
      results: e.getAttribute('data-results'), html: e.outerHTML, images: [...e.querySelectorAll('img')].map(i => {
        const rect = i.getBoundingClientRect(), css = getComputedStyle(i);
        return { src: i.currentSrc, complete: i.complete, width: i.naturalWidth, height: i.naturalHeight,
          visibleCSS: rect.width > 0 && rect.height > 0 && css.visibility !== 'hidden' && css.display !== 'none',
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } };
      }) })), fetch: (window as unknown as { __sceneFetchDiagnostics?: Metadata[] }).__sceneFetchDiagnostics ?? [],
    nativeInput: (window as unknown as { __nativeInputDiagnostics?: NativeInput[] }).__nativeInputDiagnostics ?? [],
  }));
  const checkpoint = async (s: Scope, id: string, expected: string, status: CheckpointRecord['status'] = 'passed') => {
    const state = await nativeState(s);
    s.checkpoints.push({ id, expected, status, state });
    const actions = s.actions.slice(s.actionCursor).map(a => a.action); s.actionCursor = s.actions.length;
    await recordCheckpoint(s.page, info, { scenarioId: s.id + '-' + id, release: 'M2', candidateUrl: URL,
      candidateBuildId: BUILD, matrixCase: 'T2', browserVersion: browser.version(), viewport: s.page.viewportSize()!,
      inputMode: 'touch-tap', seededOrUnseeded: s.imported ? 'seeded' : 'unseeded',
      setupRef: s.imported ? 'SUPPLEMENTARY: separate isolated context; byte-identical genuine Juniper M2 endgame export imported through adult UI. Not fresh journey evidence.'
        : 'Fresh normal Hazel Linux M2; original Q1–Q6 sequence, coordinate taps/captures, rotation/root32px; no import or answer hooks.',
      actions, expected, observed: JSON.stringify({ art: state.art, controller: state.controller, at: state.at }), status,
      evidenceLinks: [], acousticStatus: 'unverified', defectOwner: status === 'failed' ? 'Native WebKit transport/asset delivery owner pending' : null,
      retestedBuildId: BUILD, finalBuildApplicability: BUILD });
    const viewportPath = info.outputPath('transport', s.id + '-' + id + '-viewport.png');
    await s.page.screenshot({ path: viewportPath });
    await info.attach(s.id + '-' + id + '-viewport', { path: viewportPath, contentType: 'image/png' });
    await attachJSON(s.id + '-' + id + '-native', state);
  };
  const workerIdentity = (page: Page, requestId: string): Promise<Identity> => page.evaluate(async id => {
    const registration = await navigator.serviceWorker.ready;
    return new Promise<Identity>((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(Error('Native identity probe timeout')); }, 5000);
      channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve({ scope: registration.scope,
        activeScript: registration.active?.scriptURL ?? null, controller: navigator.serviceWorker.controller?.scriptURL ?? null, reply: event.data }); };
      registration.active?.postMessage({ type: 'OFFLINE_INVENTORY_PROBE', requestId: id }, [channel.port2]);
    });
  }, requestId);
  const entry = async (s: Scope) => {
    s.actions.push({ at: new Date().toISOString(), action: 'goto frozen URL; domcontentloaded;6000ms' });
    await s.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 6000 });
    await expect(s.page.getByRole('heading', { name: 'Who’s exploring today?', exact: true })).toBeVisible();
    await expect(s.page.getByRole('button', { name: 'Sound Silent', exact: true })).toBeVisible();
    await tap(s, 'Help');
    await expect(s.page.getByRole('dialog').getByText('Game version: ' + BUILD, { exact: true })).toBeVisible();
    s.identity = await workerIdentity(s.page, s.id + '-before-profile');
    expect(s.identity.scope).toBe(URL); expect(s.identity.activeScript).toBe(URL + 'sw.js');
    expect(s.identity.reply.buildId).toBe(BUILD); expect(s.identity.reply.complete).toBe(true);
    await attachJSON(s.id + '-initial-worker', s.identity);
    s.frozenIdentityValid = true;
    expect.soft(s.identity.controller, 'Initial uncontrolled page condition; mismatch is retained without reload').toBeNull();
    const initialState = await nativeState(s);
    expect(initialState.timezone).toBe('Europe/London');
    const helpInput = initialState.nativeInput.filter(event => event.target === 'Help' && event.isTrusted);
    const touchPair = helpInput.some((start, index) => start.type === 'touchstart' && start.changedTouches.length === 1
      && Number.isFinite(start.changedTouches[0].identifier) && helpInput.slice(index + 1).some(end =>
        end.type === 'touchend' && end.changedTouches.length === 1 && end.time >= start.time
        && end.changedTouches[0].identifier === start.changedTouches[0].identifier
        && end.changedTouches[0].clientX === start.changedTouches[0].clientX
        && end.changedTouches[0].clientY === start.changedTouches[0].clientY));
    const pointerPair = helpInput.some((start, index) => start.type === 'pointerdown' && start.pointerType === 'touch'
      && start.pointerId !== null && Number.isFinite(start.pointerId) && helpInput.slice(index + 1).some(end =>
        end.type === 'pointerup' && end.pointerType === 'touch' && end.pointerId === start.pointerId
        && end.time >= start.time && end.clientX === start.clientX && end.clientY === start.clientY));
    await attachJSON(s.id + '-native-touch-proof', { action: 'Existing ordinary Help touchscreen.tap',
      maxTouchPoints: initialState.touchPoints, events: initialState.nativeInput, touchPair, pointerPair,
      proven: touchPair || pointerPair });
    expect(touchPair || pointerPair,
      'Native Help tap must deliver a trusted touchstart/end or pointerType touch pair; no mouse substitution').toBe(true);
    expect(initialState.reducedMotion).toBe(true);
    await checkpoint(s, 'IDENTITY', 'Actual Help/active-worker exact M2 before input; initially uncontrolled', s.identity.controller === null ? 'passed' : 'failed');
    await tap(s, 'Back to my story');
  };
  const readTask = async (s: Scope, region: string, prompt: string) => {
    await expect(s.page.getByRole('region', { name: region, exact: true })).toBeVisible();
    await expect(s.page.getByText(prompt, { exact: true })).toBeVisible();
    s.actions.push({ at: new Date().toISOString(), action: 'Read native prompt: ' + prompt });
  };
  const check = async (s: Scope, id: string) => {
    await tap(s, 'Check my idea');
    await expect(s.page.getByRole('heading', { name: 'Your idea worked!', exact: true })).toBeVisible();
    await expect(s.page.getByText('Saved on this device.', { exact: true })).toBeVisible();
    await checkpoint(s, id, 'Actual correct saved Check; artwork adjudicated separately');
  };
  const layout = async (s: Scope, id: string, region: string) => {
    await s.page.getByRole('region', { name: region, exact: true }).scrollIntoViewIfNeeded();
    const state = await nativeState(s);
    expect.soft(state.documentWidth).toBe(state.viewport.width);
    const targetsFit = state.targets.every(t => t.width >= 44 && t.height >= 44 && !t.overflow);
    expect.soft(targetsFit, id + ': measured main control targets and wrapped labels').toBe(true);
    expect(state.reducedMotion).toBe(true);
    await checkpoint(s, id, 'Native construction remains usable after viewport/font change',
      targetsFit && state.documentWidth === state.viewport.width ? 'passed' : 'failed');
  };
  const rotate = async (s: Scope) => { await s.page.setViewportSize({ width: 1024, height: 768 }); s.actions.push({ at: new Date().toISOString(), action: 'rotate viewport1024x768' }); };
  const text200 = async (s: Scope) => {
    await s.page.setViewportSize({ width: 768, height: 1024 });
    await s.page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    s.actions.push({ at: new Date().toISOString(), action: 'portrait768x1024;rootfont32px' });
  };
  const normalText = async (s: Scope) => { await s.page.evaluate(() => { document.documentElement.style.fontSize = '16px'; }); s.actions.push({ at: new Date().toISOString(), action: 'restore rootfont16px' }); };
  const assertArt = async (s: Scope, id: string, sceneId: string, pieces: number, results: string[], paths: string[]) => {
    const scene = s.page.locator('.adventure-scene-art[data-scene="' + sceneId + '"]');
    await expect(scene).toBeVisible(); await scene.scrollIntoViewIfNeeded();
    const verdict = () => scene.evaluate((e, expected) => {
      const base = [...e.querySelectorAll(':scope > img')] as HTMLImageElement[];
      const layers = [...e.querySelectorAll(':scope > .adventure-scene-piece')];
      const images = [...e.querySelectorAll('img')] as HTMLImageElement[];
      const decoded = images.every(i => { const r = i.getBoundingClientRect(), css = getComputedStyle(i);
        return i.complete && i.naturalWidth > 0 && i.naturalHeight > 0 && r.width > 0 && r.height > 0 && css.visibility !== 'hidden' && css.display !== 'none'; });
      const actualResults = (e.getAttribute('data-results') ?? '').split('|');
      return base.length === 1 && base[0].naturalWidth === 960 && base[0].naturalHeight === 600
        && layers.length === expected.pieces && images.length === expected.pieces + 1 && decoded
        && !e.querySelector('.scene-fallback') && expected.results.every(r => actualResults.includes(r));
    }, { pieces, results });
    // Bounded observation of the existing request, never a fetch retry or input delay.
    await expect.soft.poll(verdict, { timeout: 4000, message: s.id + '/' + id + ': decoded visible base/result layers; no fallback' }).toBe(true);
    const passed = await verdict();
    await checkpoint(s, id, 'Decoded base960x600 + ' + pieces + ' composed layers, no fallback; expected assets ' + paths.join(', '), passed ? 'passed' : 'failed');
  };
  const finishScope = async (s: Scope) => {
    try {
      try {
      if (!s.page.isClosed()) {
        const final = await nativeState(s);
        await attachJSON(s.id + '-final-native', final);
        s.lifecycles = final.fetch.filter(e => e.event === 'fetch').map(start => {
          const events = final.fetch.filter(e => e.id === start.id);
          const response = events.find(e => e.event === 'response');
          const rejection = events.find(e => e.event === 'reject');
          const abort = events.find(e => e.event === 'abort');
          const abortTime = Number(abort?.time);
          return { id: start.id, url: start.url, scene: start.scene, results: start.results, start,
            response: response ?? null, rejection: rejection ?? null, abort: abort ?? null,
            pendingAtAbort: !!abort && !events.some(e => (e.event === 'response' || e.event === 'reject') && Number(e.time) < abortTime) };
        });
        await attachJSON(s.id + '-fetch-lifecycles', s.lifecycles);
        if (s.frozenIdentityValid) {
          try {
            const identity = await workerIdentity(s.page, s.id + '-final');
            await attachJSON(s.id + '-final-worker', identity);
            expect.soft(identity.reply.buildId).toBe(BUILD);
          } catch (error) {
            fatalErrors.push(error instanceof Error ? error : Error(String(error)));
            await attachJSON(s.id + '-final-worker-error', { error: String(error) });
          }
        }
      }
      } catch (error) {
        fatalErrors.push(error instanceof Error ? error : Error(String(error)));
        await attachJSON(s.id + '-final-native-error', { error: String(error) });
      }
      await attachJSON(s.id + '-requests', s.network);
      await attachJSON(s.id + '-actions', s.actions);
      await attachJSON(s.id + '-checkpoints', s.checkpoints);
    } finally {
      try { const path = info.outputPath('transport', s.id + '-trace.zip'); await s.context.tracing.stop({ path });
        await info.attach(s.id + '-trace', { path, contentType: 'application/zip' }); }
      finally { await s.context.close(); cleanup.push({ scope: s.id, contextClosed: true, at: new Date().toISOString() }); }
    }
  };
  const fresh = await openScope('fresh-original', false);
  try {
    await entry(fresh);
    await tap(fresh, 'Add an explorer');
    await tapLocator(fresh, fresh.page.getByRole('textbox', { name: 'Nickname', exact: true }), 'Nickname');
    await fresh.page.keyboard.type('Hazel Linux M2'); fresh.actions.push({ at: new Date().toISOString(), action: 'keyboard.type nickname only:Hazel Linux M2' });
    await tap(fresh, 'Save explorer'); await tap(fresh, 'Hazel Linux M2 Choose explorer');
    await tap(fresh, 'Meet Pip at the bridge'); await tap(fresh, 'A Bridge Back Home');
    await readTask(fresh, 'Bridge construction', 'The bridge must span 12 metres. Make the chosen plank lengths add up to 12 metres.');
    for (let n = 0; n < 3; n++) { await tap(fresh, 'Choose 4 metre plank'); await tap(fresh, 'Place selected plank at the end'); }
    await checkpoint(fresh, 'Q1-DRAFT', 'Three4m native planks before Check'); await check(fresh, 'Q1-SUCCESS');
    await tap(fresh, 'Continue without the extra challenge'); await tap(fresh, 'Wake the Whispering Library');
    await readTask(fresh, 'Punctuation construction', 'The reader asks where the missing books are. Then the reader spots them. The discovery may be calm or excited; the reader is no longer asking where they are. Where are my magic books ___ Look, there they are ___');
    await tap(fresh, 'Choose ?'); await tap(fresh, 'Place selected mark in question'); await tap(fresh, 'Choose !'); await tap(fresh, 'Place selected mark in discovery');
    await checkpoint(fresh, 'Q2-DRAFT', 'Question?/discovery! native draft'); await check(fresh, 'Q2-SUCCESS');
    await tap(fresh, 'Continue without the extra challenge'); await tap(fresh, 'The Merchant’s Welcome');
    await readTask(fresh, 'Fruit basket construction', 'Please pack twice as many apples as pears. I need nine pieces of fruit altogether.');
    await tap(fresh, 'Set apples to zero'); await tap(fresh, 'Set pears to zero');
    for (let n = 0; n < 6; n++) await tap(fresh, 'Add one apple'); for (let n = 0; n < 3; n++) await tap(fresh, 'Add one pear');
    await checkpoint(fresh, 'Q3-DRAFT', 'Six apples/three pears; retain pre-Check pending/response/signal state');
    await check(fresh, 'Q3-SUCCESS-IMMEDIATE');
    await assertArt(fresh, 'Q3-MARKET-ART', 'market-square', 0, ['market-stocked', 'village-welcome', 'planter-available'], ['assets/art/m1/scenes/market-square.svg']);
    await tap(fresh, 'Continue without the extra challenge'); await tap(fresh, 'Back to village · discard any unsaved preview');
    await tap(fresh, "Tinker's Workshop"); await tap(fresh, 'Start the Sawmill');
    await readTask(fresh, 'Matching construction', 'Match each multiplication to its total. One total card will be unused; either card with the same count is valid.');
    await tap(fresh, 'Choose 11 × 8'); await tap(fresh, 'Place selected item with 88 in total'); await layout(fresh, 'MATCH-PORTRAIT', 'Matching construction');
    await rotate(fresh); await tap(fresh, 'Choose 12 × 12'); await tap(fresh, 'Place selected item with 144 counters'); await layout(fresh, 'MATCH-ROTATED', 'Matching construction');
    await text200(fresh); await tap(fresh, 'Choose 7 × 7'); await tap(fresh, 'Place selected item with 49 counters'); await layout(fresh, 'MATCH-TEXT200', 'Matching construction');
    await check(fresh, 'Q4-SUCCESS-TEXT200'); await normalText(fresh); await tap(fresh, 'Continue the adventure'); await tap(fresh, 'Mix the Growing Potion');
    await readTask(fresh, 'Quantity construction', 'One ribbon piece is 3/8 of a whole ribbon and another is 2/8 of the same whole. What fraction of a whole is their combined length? Equivalent fractions are welcome.');
    for (let n = 0; n < 3; n++) await tap(fresh, 'Increase Requested quantity parts'); await tap(fresh, 'Requested quantity denominator 1'); await tap(fresh, 'Requested quantity unit whole');
    await layout(fresh, 'QUANTITY-PORTRAIT', 'Quantity construction'); await rotate(fresh);
    for (let n = 0; n < 2; n++) await tap(fresh, 'Increase Requested quantity parts'); await tap(fresh, 'Requested quantity denominator 8'); await layout(fresh, 'QUANTITY-ROTATED', 'Quantity construction');
    await text200(fresh); await layout(fresh, 'QUANTITY-TEXT200', 'Quantity construction'); await check(fresh, 'Q5-SUCCESS-TEXT200');
    await normalText(fresh); await tap(fresh, 'Continue the adventure'); await tap(fresh, 'Shelve the Lost Stories');
    await readTask(fresh, 'Sorting construction', 'These lanterns belong to us. They light the path.');
    await tap(fresh, 'Choose These'); await tap(fresh, 'Place selected item with Determiner'); await tap(fresh, 'Choose us'); await tap(fresh, 'Place selected item with Pronoun'); await layout(fresh, 'SORT-PORTRAIT', 'Sorting construction');
    await rotate(fresh); await tap(fresh, 'Choose They'); await tap(fresh, 'Place selected item with Pronoun'); await tap(fresh, 'Choose the'); await tap(fresh, 'Place selected item with Determiner'); await layout(fresh, 'SORT-ROTATED', 'Sorting construction');
    await text200(fresh); await tap(fresh, 'Undo last edit'); await tap(fresh, 'Choose the'); await tap(fresh, 'Place selected item with Determiner'); await layout(fresh, 'SORT-TEXT200', 'Sorting construction');
    await check(fresh, 'Q6-SORT-SUCCESS-TEXT200'); await normalText(fresh); await tap(fresh, 'Continue the adventure');
    await expect(fresh.page.getByRole('region', { name: 'Choice construction', exact: true })).toBeVisible();
    await assertArt(fresh, 'ORIGINAL-LIBRARY-ART', 'whispering-library', 1, ['library-restored'], ['assets/art/m1/scenes/whispering-library.svg', 'assets/art/m1/props/spellbook.svg']);
  } catch (error) {
    fatalErrors.push(error instanceof Error ? error : Error(String(error)));
    await checkpoint(fresh, 'FUNCTIONAL-STOP', 'Retain original hard failure without retry', 'failed').catch(() => {});
  } finally { await finishScope(fresh); }

  // The Controller explicitly permits a genuine normal-UI export for these
  // focused later visual checks. A separate context preserves the fresh prefix.
  if (fresh.frozenIdentityValid) {
    const supplementary = await openScope('supplementary-imported-endgame', true);
    try {
      await entry(supplementary);
      const fixture = fileURLToPath(new globalThis.URL('../fixtures/published-webkit-endgame.json', import.meta.url));
      const bytes = await readFile(fixture); expect(sha256(bytes)).toBe(EXPORT_SHA);
      const exported = JSON.parse(bytes.toString('utf8'));
      expect(exported.exportedAt).toBe('2026-10-11T22:33:21.244Z');
      await attachJSON('supplementary-export-provenance', { bytes: bytes.length, sha256: sha256(bytes), exportedAt: exported.exportedAt,
        original: 'M2 journey/D1/final-native-backup.json; Juniper M2 genuine all15 normal story beats, adult Download current backup',
        scope: 'Imported visual check only, not fresh Q1–Q10 journey or original partial-Q9 equivalence' });
      await tap(supplementary, 'Grown-ups'); await tap(supplementary, 'For grown-ups'); await tap(supplementary, 'Continue to adult area');
      await expect(supplementary.page.getByRole('heading', { name: 'Stories, practice and care', exact: true })).toBeVisible();
      supplementary.actions.push({ at: new Date().toISOString(), action: 'Adult native file input:setInputFiles byte-identical genuine export' });
      await supplementary.page.getByLabel('Choose a backup to replace this app’s whole save', { exact: true }).setInputFiles(fixture);
      await expect(supplementary.page.getByRole('dialog', { name: 'Replace this app’s whole save?', exact: true })).toContainText('Juniper M2');
      await tap(supplementary, 'Confirm whole-save replacement');
      // Whole-save epoch replacement retires the adult panel and returns to the
      // chooser. Verify that stable UI and committed data before selecting.
      await expect(supplementary.page.getByRole('heading', { name: 'Who’s exploring today?', exact: true })).toBeVisible();
      await expect(supplementary.page.getByRole('button', { name: 'Juniper M2 Choose explorer', exact: true })).toBeVisible();
      await expect(supplementary.page.getByText('Choose an explorer for this saved story.', { exact: true })).toBeVisible();
      await expect(supplementary.page.getByRole('combobox', { name: 'Active explorer', exact: true })).toHaveValue('');
      await expect(supplementary.page.getByRole('heading', { name: 'Stories, practice and care', exact: true })).toBeHidden();
      await expect(supplementary.page.getByRole('dialog', { name: 'Replace this app’s whole save?', exact: true })).toBeHidden();
      const importedRoot = await supplementary.page.evaluate(() => new Promise<{ save: unknown; revision: number }>((resolve, reject) => {
        const request = indexedDB.open('learning-is-fun:/Learning-is-Fun/:save');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result, transaction = db.transaction('records', 'readonly'), query = transaction.objectStore('records').get('root');
          let value: { save: unknown; revision: number };
          query.onsuccess = () => { value = query.result; };
          transaction.oncomplete = () => { db.close(); resolve(value); };
          transaction.onabort = () => { db.close(); reject(transaction.error); };
        };
      }));
      expect(importedRoot.save, 'Normal UI replacement committed the exact genuine whole save').toEqual(exported.save);
      expect(importedRoot.revision).toBe(0);
      await attachJSON('supplementary-import-commit', { source: 'Read-only native IndexedDB root after normal UI confirmation',
        fixtureSha256: sha256(bytes), revision: importedRoot.revision, exactWholeSaveMatch: true });
      await checkpoint(supplementary, 'IMPORT-COMMITTED-CHOOSER', 'Whole-save confirmation returned to chooser; exact genuine save committed, no profile selected');
      await tap(supplementary, 'Juniper M2 Choose explorer');
      await expect(supplementary.page.getByRole('button', { name: 'Sound Silent', exact: true })).toBeVisible();
      await expect(supplementary.page.getByRole('region', { name: 'Kingdom story finale', exact: true })).toBeVisible();
      await assertArt(supplementary, 'GREEN-PORTRAIT', 'village-green', 3, ['garden-restored', 'forest-marker', 'kingdom-finale'],
        ['assets/art/m1/scenes/village-green.svg', 'assets/art/m2/scenes/green-garden.svg', 'assets/art/m2/scenes/green-finale.svg', 'assets/art/m2/props/forest-marker.svg']);
      await rotate(supplementary);
      await assertArt(supplementary, 'GREEN-ROTATED', 'village-green', 3, ['garden-restored', 'forest-marker', 'kingdom-finale'],
        ['assets/art/m1/scenes/village-green.svg', 'assets/art/m2/scenes/green-garden.svg', 'assets/art/m2/scenes/green-finale.svg', 'assets/art/m2/props/forest-marker.svg']);
      await supplementary.page.setViewportSize({ width: 768, height: 1024 });
      supplementary.actions.push({ at: new Date().toISOString(), action: 'restore portrait768x1024' });
      await tap(supplementary, 'Clockwork Castle');
      await assertArt(supplementary, 'CASTLE-PORTRAIT', 'clockwork-castle', 1, ['castle-clock-restored', 'castle-open', 'kingdom-finale'],
        ['assets/art/m2/scenes/clockwork-castle.svg', 'assets/art/m2/scenes/castle-finale.svg']);
      await rotate(supplementary);
      await assertArt(supplementary, 'CASTLE-ROTATED', 'clockwork-castle', 1, ['castle-clock-restored', 'castle-open'],
        ['assets/art/m2/scenes/clockwork-castle.svg', 'assets/art/m2/scenes/castle-finale.svg']);
      await text200(supplementary);
      await assertArt(supplementary, 'CASTLE-TEXT200', 'clockwork-castle', 1, ['castle-clock-restored', 'castle-open'],
        ['assets/art/m2/scenes/clockwork-castle.svg', 'assets/art/m2/scenes/castle-finale.svg']);
      await tap(supplementary, 'Village Green');
      await assertArt(supplementary, 'GREEN-TEXT200', 'village-green', 3, ['garden-restored', 'forest-marker', 'kingdom-finale'],
        ['assets/art/m1/scenes/village-green.svg', 'assets/art/m2/scenes/green-garden.svg', 'assets/art/m2/scenes/green-finale.svg', 'assets/art/m2/props/forest-marker.svg']);
    } catch (error) {
      fatalErrors.push(error instanceof Error ? error : Error(String(error)));
      await checkpoint(supplementary, 'SUPPLEMENTARY-STOP', 'Retain imported visual-check failure', 'failed').catch(() => {});
    } finally { await finishScope(supplementary); }
  }
  await attachJSON('cleanup', { contexts: cleanup, allOwnContextsClosed: cleanup.length === scopes.length,
    browser: 'Playwright runner fixture owns browser teardown; this receipt does not preclaim its later close', finishedAt: new Date().toISOString() });
  await attachJSON('scope-and-outcome', { frozenBuild: BUILD, freshPrefix: 'Q1–Q3 then Q4 matching/Q5 quantity/Q6 sorting; original Market/library checks',
    supplementary: 'Genuine imported Juniper endgame Castle/Green composition only; not fresh journey/partial-Q9 equivalence',
    fatalErrors: fatalErrors.map(e => ({ message: e.message, stack: e.stack })), softAssertionErrors: info.errors.map(e => e.message),
    pendingAbortObservations: scopes.map(s => ({ scope: s.id, originalConditionMismatch: s.identity ? s.identity.controller !== null : null,
      artFetchesAbortedWhilePending: s.lifecycles?.filter(e => e.pendingAtAbort).map(e => ({ id: e.id, url: e.url, results: e.results })) ?? [],
      limit: 'Fast decoded success without a pending abort narrows host behaviour; it does not prove cancellation safety under the failing Windows condition' })),
    windowsFailuresRetained: true, windowsCorrectionClaim: false, matrixAcceptance: 'Controller adjudication; no independent fullT2 closure', acousticStatus: 'unverified' });
  if (fatalErrors.length) throw fatalErrors[0];
});
