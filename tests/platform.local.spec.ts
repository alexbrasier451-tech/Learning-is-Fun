import { expect, test } from '@playwright/test';
import { mkdir, unlink, writeFile } from 'node:fs/promises';

const probe = new URL('../public/__wp01-probe.txt', import.meta.url);
let probeCreated = false;
test.beforeAll(async () => {
  await mkdir(new URL('../public/', import.meta.url), { recursive: true });
  await writeFile(probe, 'local public probe', { flag: 'wx' });
  probeCreated = true;
});
test.afterAll(async () => { if (probeCreated) await unlink(probe); });

test('producer fixture mounts, reloads, navigates with focus and tears down', async ({ page, baseURL }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('tests/fixtures/platform.html');
  await expect(page.getByRole('heading', { name: 'Neutral profiles panel' })).toBeFocused();
  await expect(page.getByLabel('Panel status')).toHaveText('dirty');
  await expect(page.getByRole('link', { name: 'Public asset probe' })).toHaveAttribute('href', '/playtest/__wp01-probe.txt');
  await page.getByRole('link', { name: 'Public asset probe' }).click();
  await expect(page.locator('body')).toContainText('local public probe');
  await page.goBack();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Neutral profiles panel' })).toBeFocused();
  await page.getByRole('button', { name: 'Request world view' }).click();
  await expect(page.getByRole('heading', { name: 'Neutral world panel' })).toBeFocused();
  await page.getByRole('button', { name: 'Suspend fixture draft' }).click();
  await expect(page.getByLabel('Panel status')).toHaveText('clean');
  await page.reload();
  await page.getByRole('button', { name: 'Discard fixture draft' }).click();
  await expect(page.getByLabel('Panel status')).toHaveText('clean');
  await page.getByRole('button', { name: 'Unmount fixture' }).click();
  await expect(page.locator('#panel')).toBeEmpty();
  await expect(page.locator('#teardown')).toHaveText('Removed panel; 0 subscriptions remain.');
  expect(errors).toEqual([]);
  const entryOrigin = new URL(baseURL!).origin;
  expect(requests.every(request => {
    const url = new URL(request);
    return url.origin === entryOrigin && url.pathname.startsWith('/playtest/');
  })).toBe(true);
});
