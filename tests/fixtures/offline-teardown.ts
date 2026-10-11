import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Close the successfully started, non-reused harness before Playwright process cleanup. */
export default async function teardown() {
  const endpoint = 'http://127.0.0.1:5196/__offline-shutdown';
  const receipt: Record<string, unknown> = { endpoint, requestedAt: new Date().toISOString() };
  try {
    const response = await fetch(endpoint, { method: 'POST', signal: AbortSignal.timeout(3000) });
    receipt.httpStatus = response.status;
    receipt.status = response.ok ? 'shutdown-requested' : 'shutdown-rejected';
  } catch (error) {
    // The helper can close all connections before its response reaches fetch.
    // Record uncertainty; Playwright still performs its owned process cleanup.
    receipt.status = 'shutdown-unconfirmed';
    receipt.error = error instanceof Error ? error.message : String(error);
  }
  const output = process.env.OFFLINE_OUTPUT;
  if (!output) throw new Error('Offline teardown requires its configured OFFLINE_OUTPUT.');
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'server-cleanup.json'), `${JSON.stringify(receipt, null, 2)}\n`);
}
