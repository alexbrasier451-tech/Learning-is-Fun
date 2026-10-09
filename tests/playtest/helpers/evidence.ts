import type { Page, TestInfo } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export type MatrixCase = 'D1' | 'D2' | 'D3' | 'T1' | 'T2';
export type CheckpointRecord = Readonly<{
  scenarioId: string;
  release: 'M1' | 'M2';
  candidateUrl: string;
  candidateBuildId: string;
  matrixCase: MatrixCase;
  browserVersion: string;
  viewport: Readonly<{ width: number; height: number }>;
  inputMode: 'keyboard' | 'mouse' | 'touch-cdp' | 'touch-tap';
  seededOrUnseeded: 'seeded' | 'unseeded';
  setupRef: string;
  actions: readonly string[];
  expected: string;
  observed: string;
  status: 'passed' | 'failed' | 'blocked' | 'untested';
  evidenceLinks: readonly string[];
  acousticStatus: 'verified' | 'unverified' | 'not-applicable';
  defectOwner: string | null;
  retestedBuildId: string | null;
  finalBuildApplicability: string | null;
}>;

/** Include once per JOURNEY/BOUNDARIES report. Candidate identity is verified
 * through visible UI by the observer, not inferred from an environment variable. */
export type EvidenceSession = Readonly<{
  os: string;
  deviceClass: 'desktop' | 'emulated-tablet' | 'physical-device';
  timezone: string;
  engine: string;
  browserVersion: string;
  fixtureOrPublished: 'fixture' | 'published';
  identityObservation: string;
  listenerOrCaptureRoute: string | null;
}>;

export type CheckpointAttachment = Readonly<{ name: string; path: string; contentType: string }>;

/** Native files for a persistent agent-controlled Page outside the test runner.
 * Supply a private, unique per-step directory. These files can be attached to
 * the existing Playwright report later; never manufacture a TestInfo object. */
export async function captureCheckpoint(page: Page, directory: string, row: CheckpointRecord): Promise<readonly CheckpointAttachment[]> {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(row.scenarioId)
    || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(row.candidateBuildId)) {
    throw new Error('Checkpoint scenario/build identifiers must be safe nonempty path segments.');
  }
  const screenshotPath = join(directory, 'screen.png');
  const domPath = join(directory, 'visible-state.txt');
  const metadataPath = join(directory, 'checkpoint.json');
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const visibleState = await page.locator('body').ariaSnapshot();
  await writeFile(domPath, visibleState, 'utf8');
  const browser = page.context().browser();
  await writeFile(metadataPath, JSON.stringify({
    ...row,
    evidenceLinks: [...row.evidenceLinks, screenshotPath, domPath],
    capture: {
      url: page.url(), engine: browser?.browserType().name() ?? null,
      browserVersion: browser?.version() ?? null, viewport: page.viewportSize(),
      capturedAt: new Date().toISOString(),
    },
  }, null, 2), 'utf8');
  return [
    { name: `${row.scenarioId}-metadata`, path: metadataPath, contentType: 'application/json' },
    { name: `${row.scenarioId}-screen`, path: screenshotPath, contentType: 'image/png' },
    { name: `${row.scenarioId}-visible-state`, path: domPath, contentType: 'text/plain' },
  ];
}

/** Capture facts only. The observer supplies status, assessment and next choice;
 * a screenshot, playback event or recording filename cannot verify listening. */
export async function recordCheckpoint(page: Page, testInfo: TestInfo, row: CheckpointRecord): Promise<void> {
  const prefix = `checkpoint-${testInfo.attachments.length}`;
  const directory = testInfo.outputPath('artifacts', 'playtests', row.release,
    encodeURIComponent(row.candidateBuildId), row.matrixCase, row.scenarioId, prefix);
  for (const attachment of await captureCheckpoint(page, directory, row)) {
    await testInfo.attach(`${attachment.name}-${prefix}`, { path: attachment.path, contentType: attachment.contentType });
  }
}
