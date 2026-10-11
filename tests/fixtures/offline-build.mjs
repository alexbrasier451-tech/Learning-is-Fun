import { cp, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { checkPrecache } from '../../scripts/check-precache.mjs';

// Production A/B candidates, never a replacement application or fixture entry.
const root = fileURLToPath(new URL('../..', import.meta.url));
if (!process.env.OFFLINE_OUTPUT || !path.isAbsolute(process.env.OFFLINE_OUTPUT)) throw new Error('Set OFFLINE_OUTPUT to an absolute private output directory.');
const output = path.resolve(process.env.OFFLINE_OUTPUT);
if (output === root || root.startsWith(`${output}${path.sep}`) || output === path.join(root, 'dist') || output.startsWith(`${path.join(root, 'dist')}${path.sep}`)) throw new Error('Offline support must be outside the repository root and published dist.');
process.chdir(root); process.env.APP_BASE = '/playtest/';
await mkdir(output, { recursive: true });
for (const candidate of ['a', 'b']) {
  const buildId = `local-offline-${candidate}`;
  process.env.APP_BUILD_ID = buildId;
  let publicDir = path.join(root, 'public');
  if (candidate === 'b') {
    publicDir = path.join(output, 'public-b'); await cp(path.join(root, 'public'), publicDir, { recursive: true });
    const wav = path.join(publicDir, 'assets/audio/village-loop.wav'), bytes = await readFile(wav);
    bytes[bytes.length - 1] ^= 1; await writeFile(wav, bytes);
    const art = path.join(publicDir, 'assets/art/m1/scenes/village-green.svg'), svg = await readFile(art, 'utf8');
    const marked = svg.replace(/#[0-9a-fA-F]{6}/, colour => `${colour.slice(0, -1)}${colour.endsWith('0') ? '1' : '0'}`);
    if (marked === svg) throw new Error('The private B art marker was not applied.');
    await writeFile(art, marked);
  }
  const dist = path.join(output, `build-${candidate}`);
  await build({ root, configFile: path.join(root, 'vite.config.ts'), publicDir, cacheDir: path.join(output, `cache-${candidate}`), build: { outDir: dist, emptyOutDir: true } });
  const report = await checkPrecache({ dist, buildId, base: '/playtest/', maxBytes: 8388608, report: path.join(output, `precache-${candidate}.json`) });
  if (!report.passed) throw new Error(`Candidate ${candidate} precache check failed.`);
  // Browser observers import only the real platform exports. These support
  // modules are served outside /playtest/ and never enter the published build.
  const entry = path.join(output, `probe-${candidate}.ts`);
  const pwa = path.join(root, 'src/platform/pwa.ts').replaceAll('\\', '/'), fullscreen = path.join(root, 'src/platform/fullscreen.ts').replaceAll('\\', '/');
  await writeFile(entry, `export { registerOfflineApp } from ${JSON.stringify(pwa)};\nexport { requestFullscreen } from ${JSON.stringify(fullscreen)};\n`);
  await build({ root, configFile: false, publicDir: false, base: '/playtest/', define: { __BUILD_ID__: JSON.stringify(buildId) }, build: {
    outDir: path.join(output, 'support'), emptyOutDir: false, lib: { entry, formats: ['es'], fileName: () => `${candidate}.js` },
  } });
}
await writeFile(path.join(output, 'build-contract.json'), `${JSON.stringify({ base: '/playtest/', buildIds: ['local-offline-a', 'local-offline-b'], port: 5196,
  privateBMarkers: ['assets/audio/village-loop.wav: last sample byte toggled', 'assets/art/m1/scenes/village-green.svg: one same-length colour change'] }, null, 2)}\n`);
