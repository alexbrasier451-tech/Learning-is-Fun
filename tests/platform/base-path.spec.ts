import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const published = process.env.PLAYTEST_MODE === 'published';
const buildId = process.env.PLAYTEST_BUILD_ID;
const inventoryPath = process.env.PLAYTEST_INVENTORY;
const filesPath = process.env.PLAYTEST_FILES;
if (published && (!buildId || !inventoryPath || !filesPath)) {
  throw new Error('Published base-path checks require PLAYTEST_BUILD_ID, PLAYTEST_INVENTORY and PLAYTEST_FILES from the retained deployment artifact.');
}
const register = JSON.parse(readFileSync('assets/asset-register.json', 'utf8'));

test('project entry, required bytes and saved activity reload use the configured base', async ({ page, request, baseURL }, info) => {
  test.setTimeout(120000);
  expect(baseURL).toBeTruthy();
  const entry = new URL(baseURL!);
  expect(entry.pathname).not.toBe('/');
  expect(entry.pathname.endsWith('/')).toBe(true);
  if (published) {
    expect(entry.protocol).toBe('https:');
    expect(entry.href).toBe('https://alexbrasier451-tech.github.io/Learning-is-Fun/');
  }
  const badRequests: string[] = [], failedResponses: string[] = [];
  page.on('request', r => {
    const url = new URL(r.url());
    if (published && ['http:', 'https:'].includes(url.protocol) &&
      (url.origin !== entry.origin || !url.pathname.startsWith(entry.pathname))) badRequests.push(url.href);
  });
  page.on('response', r => { if (r.status() >= 400) failedResponses.push(`${r.status()} ${r.url()}`); });
  const response = await page.goto('./');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('button', { name: 'Add an explorer', exact: true })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe(entry.pathname);

  const readyAssets = register.assets.filter((a: any) => a.milestone === 'M1' && a.status === 'ready');
  expect(readyAssets.filter((a: any) => a.kind === 'audio-loop')).toHaveLength(2);
  expect(readyAssets.filter((a: any) => a.kind === 'audio-effect')).toHaveLength(5);
  const files: { path: string; bytes: number; sha256: string }[] = published
    ? JSON.parse(readFileSync(filesPath!, 'utf8')) : readyAssets.map((a: any) => ({ path: a.runtimePath, bytes: a.bytes }));
  if (published) {
    const inventory = JSON.parse(readFileSync(inventoryPath!, 'utf8'));
    expect(inventory).toMatchObject({ passed: true, buildId, basePath: entry.pathname,
      missingUrls: [], oversizedUrls: [], outOfScopeUrls: [] });
    const paths = new Set(files.map(f => entry.pathname + f.path));
    for (const url of inventory.requiredUrls) expect(paths.has(url), `retained required URL: ${url}`).toBe(true);
    for (const file of files) expect(file.path).not.toMatch(/(^|\/)(tests|fixtures|source|node_modules|artifacts)\/|\.(tsx?|map|md)$/);
  }
  const fetched = [];
  // API requests bypass the page's service worker: deployed origin bytes must match.
  for (const file of files) {
    const url = new URL(file.path, entry);
    expect(url.origin).toBe(entry.origin);
    expect(url.pathname.startsWith(entry.pathname)).toBe(true);
    const asset = await request.get(url.href);
    expect(asset.ok(), url.href).toBe(true);
    expect(asset.url()).toBe(url.href);
    const body = await asset.body();
    expect(body.length, file.path).toBe(file.bytes);
    const sha256 = createHash('sha256').update(body).digest('hex');
    if (published) expect(sha256, file.path).toBe(file.sha256);
    fetched.push({ url: url.href, bytes: body.length, sha256 });
  }
  if (published) {
    await page.getByRole('button', { name: 'Help', exact: true }).click();
    const visibleIdentity = page.locator('.shell-help').getByText(`Game version: ${buildId}`, { exact: true });
    await visibleIdentity.scrollIntoViewIfNeeded();
    await expect(visibleIdentity).toBeVisible();
    await page.getByRole('button', { name: 'Back to my story', exact: true }).click();
    await expect(page.getByText('Ready offline', { exact: true })).toBeVisible({ timeout: 60000 });
    // This test belongs to the Node TypeScript project; browser code stays in
    // the browser evaluation rather than importing a DOM ambient environment.
    const worker = await page.evaluate(`(async () => {
      const registration = await navigator.serviceWorker.getRegistration(location.pathname);
      if (!registration?.active) throw new Error('No active application worker.');
      const active = registration.active;
      return await new Promise((resolve, reject) => {
        const channel = new MessageChannel(), requestId = 'publication-base-path';
        const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Worker probe timed out.')); }, 15000);
        channel.port1.onmessage = event => {
          if (event.data?.type !== 'OFFLINE_INVENTORY_RESULT' || event.data.requestId !== requestId) return;
          clearTimeout(timer); channel.port1.close(); resolve(event.data);
        };
        active.postMessage({ type: 'OFFLINE_INVENTORY_PROBE', requestId }, [channel.port2]);
      });
    })()`);
    expect(worker).toMatchObject({ buildId, complete: true });
    await info.attach('published-worker', { body: JSON.stringify(worker), contentType: 'application/json' });
  }

  await page.getByRole('button', { name: 'Add an explorer', exact: true }).click();
  await page.getByLabel('Nickname', { exact: true }).fill('Publication');
  await page.getByRole('button', { name: 'Save explorer', exact: true }).click();
  await page.getByRole('button', { name: 'Publication Choose explorer', exact: true }).click();
  await page.getByRole('button', { name: 'Meet Pip at the bridge' }).click();
  await page.getByRole('button', { name: 'A Bridge Back Home', exact: false }).click();
  await page.getByRole('button', { name: 'Choose 6 metre plank', exact: true }).click();
  await page.getByRole('button', { name: 'Place selected plank at the end', exact: true }).click();
  await page.getByRole('button', { name: 'Save progress', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
  await page.reload();
  expect(new URL(page.url()).pathname).toBe(entry.pathname);
  await page.getByRole('button', { name: 'Publication Choose explorer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Village Green', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Resume A Bridge Back Home', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Choose 6 metre plank', exact: true })).toBeVisible();
  expect(badRequests).toEqual([]);
  expect(failedResponses).toEqual([]);
  await info.attach('project-path-and-required-bytes', { body: JSON.stringify({ entry: entry.href,
    buildId: buildId ?? 'local-fixtures', browser: page.context().browser()?.version(), fetched, badRequests, failedResponses }, null, 2), contentType: 'application/json' });
  await info.attach('reloaded-entry', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});
