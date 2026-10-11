import { createHash } from 'node:crypto';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join } from 'node:path';
import { platform, release } from 'node:os';
import { pathToFileURL } from 'node:url';

export const projectName = 'T2-WebKit-touch';
export const scenarioTitle = 'Published M2 WebKit touch and scene transport observation';
export const scenarioFile = 'published-webkit.spec.ts';
export const contextSettings = {
  browserName: 'webkit' as const, headless: true, hasTouch: true,
  viewport: { width: 768, height: 1024 }, timezoneId: 'Europe/London', reducedMotion: 'reduce' as const,
};

export function publishedCandidate(path = new URL('../../docs/release/M2/CANDIDATE.json', import.meta.url)) {
  let bytes: Buffer;
  let value: Record<string, unknown>;
  try {
    bytes = readFileSync(path);
    value = JSON.parse(bytes.toString('utf8')) as Record<string, unknown>;
  } catch { throw new Error('Cannot read valid M2 candidate metadata.'); }
  const fields = ['release', 'url', 'basePath', 'buildId', 'commit', 'deploymentRun', 'requiredInventoryLocation'];
  if (!value || Array.isArray(value) || Object.keys(value).length !== fields.length ||
      fields.some(key => typeof value[key] !== 'string' || !value[key])) {
    throw new Error('M2 candidate requires its seven nonempty metadata fields.');
  }
  const candidate = value as Record<string, string>;
  const identity = /^([a-f0-9]{40})-pages-([0-9]+)-([0-9]+)$/.exec(candidate.buildId);
  if (candidate.release !== 'M2' || candidate.url !== 'https://alexbrasier451-tech.github.io/Learning-is-Fun/' ||
      candidate.basePath !== '/Learning-is-Fun/' || !identity || candidate.commit !== identity[1] ||
      candidate.deploymentRun !== `https://github.com/alexbrasier451-tech/Learning-is-Fun/actions/runs/${identity[2]}`) {
    throw new Error('M2 candidate must identify the HTTPS project deployment and matching build/commit/run.');
  }
  return { release: candidate.release, url: candidate.url, basePath: candidate.basePath,
    buildId: candidate.buildId, commit: candidate.commit, deploymentRun: candidate.deploymentRun,
    metadataSha256: createHash('sha256').update(bytes).digest('hex') };
}

export function sourceCommit() {
  const commit = process.env.GITHUB_SHA ?? process.env.PLAYTEST_CI_SOURCE_COMMIT;
  if (!commit || !/^[a-f0-9]{40}$/.test(commit)) throw new Error('A full CI source commit is required.');
  return commit;
}

export function evidenceRoot() {
  const root = process.env.PUBLISHED_WEBKIT_VERIFY_ROOT;
  if (!root || !isAbsolute(root)) throw new Error('An absolute private WebKit evidence root is required.');
  return root;
}

type Candidate = ReturnType<typeof publishedCandidate>;
type Run = { ciSourceCommit: string; deployedCandidate: Candidate };
type Test = { projectName?: string; expectedStatus?: string; results?: { status?: string; retry?: number }[] };
type Suite = { suites?: Suite[]; specs?: { title?: string; file?: string; tests?: Test[] }[] };
type Report = Suite & {
  errors?: unknown[];
  config?: { workers?: number; metadata?: Record<string, unknown>;
    projects?: { name?: string; retries?: number; repeatEach?: number }[] };
  stats?: { expected?: number; unexpected?: number; flaky?: number; skipped?: number };
};

export function gateReport(report: Report, run: Run, phase: 'discovery' | 'result') {
  const metadata = report.config?.metadata;
  const deployed = metadata?.deployedCandidate as Record<string, unknown> | undefined;
  const projects = report.config?.projects;
  if (!/^[a-f0-9]{40}$/.test(run.ciSourceCommit) || metadata?.ciSourceCommit !== run.ciSourceCommit ||
      !deployed || Object.entries(run.deployedCandidate).some(([key, value]) => deployed[key] !== value)) {
    throw new Error('WebKit report source/deployed identity does not match run metadata.');
  }
  if (report.config?.workers !== 1 || projects?.length !== 1 || projects[0].name !== projectName ||
      projects[0].retries !== 0 || projects[0].repeatEach !== 1) {
    throw new Error('WebKit report must use the sole project, one worker, zero retries and one repetition.');
  }
  const found: { title?: string; file?: string; test: Test }[] = [];
  function walk(suite: Suite) {
    for (const spec of suite.specs ?? []) for (const test of spec.tests ?? []) {
      found.push({ title: spec.title, file: spec.file, test });
    }
    for (const child of suite.suites ?? []) walk(child);
  }
  walk(report);
  if ((report.errors?.length ?? 0) !== 0 || found.length !== 1 ||
      found[0].title !== scenarioTitle || found[0].file !== scenarioFile || found[0].test.projectName !== projectName) {
    throw new Error('WebKit discovery/result must contain exactly the expected scenario.');
  }
  if (phase === 'result') {
    const test = found[0].test;
    if (report.stats?.expected !== 1 || report.stats.unexpected !== 0 || report.stats.flaky !== 0 ||
        report.stats.skipped !== 0 || test.expectedStatus !== 'passed' || test.results?.length !== 1 ||
        test.results[0].status !== 'passed' || test.results[0].retry !== 0) {
      throw new Error('WebKit result requires one actual pass and zero skipped, unexpected, flaky or retry results.');
    }
  }
}

function writeJson(path: string, value: unknown) { writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`); }

function main(command: string) {
  const root = evidenceRoot();
  const runPath = join(root, 'run.json');
  if (command === 'prepare') {
    const deployedCandidate = publishedCandidate();
    const ciSourceCommit = sourceCommit();
    const osRelease = platform() === 'linux' ? readFileSync('/etc/os-release', 'utf8') : '';
    if (platform() !== 'linux' || !/^ID=ubuntu$/m.test(osRelease) || !/^VERSION_ID="24\.04"$/m.test(osRelease) ||
        !/^v24\./.test(process.version)) throw new Error('This route requires Ubuntu 24.04 and Node 24.');
    for (const child of ['playwright', 'tmp', 'pw-cache']) mkdirSync(join(root, child), { recursive: true });
    writeJson(runPath, { ciSourceCommit, deployedCandidate, runId: process.env.GITHUB_RUN_ID ?? null,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null, os: { platform: platform(), release: release(), osRelease },
      node: process.version, projectName, scenarioTitle, scenarioFile, contextSettings,
      engineVersionSource: 'Observer checkpoint/session attachments contain the actual browser version.' });
    if (!process.env.GITHUB_ENV) throw new Error('GitHub environment output is required.');
    appendFileSync(process.env.GITHUB_ENV, [
      'PLAYTEST_MODE=published', `PLAYTEST_BASE_URL=${deployedCandidate.url}`,
      `TEMP=${join(root, 'tmp')}`, `TMP=${join(root, 'tmp')}`, `PWTEST_CACHE_DIR=${join(root, 'pw-cache')}`, '',
    ].join('\n'));
  } else if (command === 'runtime') {
    const repoRequire = createRequire(new URL('../../package.json', import.meta.url));
    const testPackage = repoRequire.resolve('@playwright/test/package.json');
    const testRequire = createRequire(testPackage);
    const playwrightPackage = testRequire.resolve('playwright/package.json');
    const playwrightRequire = createRequire(playwrightPackage);
    const corePackage = playwrightRequire.resolve('playwright-core/package.json');
    const version = JSON.parse(readFileSync(testPackage, 'utf8')).version;
    if (version !== '1.64.0') throw new Error('Playwright 1.64.0 is required.');
    const registry = JSON.parse(readFileSync(new URL('./browsers.json', pathToFileURL(corePackage)), 'utf8'));
    const entry = registry.browsers.find((browser: { name: string }) => browser.name === 'webkit');
    if (!entry) throw new Error('The installed WebKit registry entry is required.');
    writeJson(join(root, 'runtime.json'), { playwright: version, node: process.version,
      platform: platform(), osRelease: release(), engine: 'webkit', registry: entry,
      executablePath: testRequire('playwright').webkit.executablePath(), contextSettings,
      note: 'Registry browserVersion is a package expectation; actual version is recorded by the observer.' });
  } else if (command === 'discovery' || command === 'result') {
    const report = JSON.parse(readFileSync(join(root, command === 'discovery' ? 'discovery.json' : 'results.json'), 'utf8'));
    const run = JSON.parse(readFileSync(runPath, 'utf8'));
    gateReport(report, run, command);
    writeJson(join(root, `${command}-gate.json`), { passed: true, phase: command,
      ciSourceCommit: run.ciSourceCommit, deployedCandidate: run.deployedCandidate, projectName, scenarioTitle });
  } else throw new Error('Use prepare, runtime, discovery or result.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv[2]);
