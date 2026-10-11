import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseAst } from 'vite';

/** Read the injected literal, never execute the built worker during validation. */
export function injectedEntries(source) {
  const tree = parseAst(source);
  const candidates = [];
  function visit(node) {
    if (node.type === 'ArrayExpression' && node.elements.length) {
      const entries = node.elements.map(element => {
        if (element?.type !== 'ObjectExpression') return null;
        const fields = {};
        for (const property of element.properties) {
          if (property.type !== 'Property' || property.computed || property.value.type !== 'Literal') return null;
          fields[property.key.name ?? property.key.value] = property.value.value;
        }
        return typeof fields.url === 'string' && (typeof fields.revision === 'string' || fields.revision === null) ? fields : null;
      });
      if (entries.every(Boolean)) candidates.push(entries);
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) { for (const child of value) if (child?.type) visit(child); }
      else if (value?.type) visit(value);
    }
  }
  visit(tree);
  if (candidates.length !== 1) throw new Error(`Expected one injected Workbox manifest; found ${candidates.length}.`);
  return candidates[0];
}

async function files(root, prefix = '') {
  const result = [];
  for (const item of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    const name = `${prefix}${item.name}`;
    if (item.isDirectory()) result.push(...await files(root, `${name}/`));
    else if (item.isFile()) result.push(name);
    else throw new Error(`Unexpected non-file output: ${name}`);
  }
  return result;
}

export async function checkPrecache({ dist, buildId, base, maxBytes, report, register = 'assets/asset-register.json' }) {
  dist = path.resolve(dist); report = path.resolve(report);
  if (report === dist || report.startsWith(`${dist}${path.sep}`)) throw new Error('The inventory report must be outside dist.');
  if (typeof base !== 'string' || typeof buildId !== 'string' || !/^\/(?:[A-Za-z0-9_~-][A-Za-z0-9._~-]*\/)*$/.test(base) || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(buildId)) throw new Error('Invalid base or build identity.');
  if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) throw new Error('An explicit measured maximum is required.');
  const source = await readFile(path.join(dist, 'sw.js'), 'utf8');
  const entries = injectedEntries(source), emitted = await files(dist);
  const origin = 'https://inventory.invalid', scope = new URL(base, origin);
  const required = new Set([`${base}index.html`, `${base}manifest.webmanifest`]);
  const missing = new Set(), oversized = new Set(), outOfScope = new Set(), errors = [];
  const cached = new Set(), revisions = new Map();
  let largest = 0;
  for (const entry of entries) {
    const url = new URL(entry.url, scope);
    if (url.origin !== origin || !url.pathname.startsWith(base) || url.search || url.hash || /[%\\]/.test(entry.url) || entry.url.split('/').includes('..')) {
      outOfScope.add(entry.url); continue;
    }
    if (revisions.has(url.pathname) && revisions.get(url.pathname) !== entry.revision) errors.push(`Conflicting manifest revision ${url.pathname}`);
    revisions.set(url.pathname, entry.revision);
    cached.add(url.pathname);
    try {
      const size = (await stat(path.join(dist, url.pathname.slice(base.length)))).size;
      largest = Math.max(largest, size); if (size > maxBytes) oversized.add(url.pathname);
    } catch { missing.add(url.pathname); }
  }
  // Content is imported into emitted JS. Every emitted runtime chunk is required;
  // source task JSON/TS paths are not invented as runtime URLs.
  const mapping = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
  if (!mapping['index.html']?.isEntry) errors.push('Vite output mapping has no application entry.');
  for (const item of Object.values(mapping)) {
    for (const file of [item.file, ...(item.css ?? []), ...(item.assets ?? [])]) required.add(`${base}${file}`);
  }
  for (const file of emitted) {
    if (file === 'sw.js' || file === '.vite/manifest.json') continue;
    if (/(^|\/)(?:tests|fixtures|source|node_modules)\//.test(file) || /\.(?:tsx?|map|md)$/.test(file)) errors.push(`Source/test bulk in dist: ${file}`);
    if (/\.(?:html|js|css|json|svg|png|ico|webp|jpe?g|wav|webmanifest)$/.test(file)) required.add(`${base}${file}`);
  }
  const inventory = JSON.parse(await readFile(register, 'utf8'));
  const ready = inventory.assets.filter(item => item.milestone === 'M1' && item.status === 'ready');
  const audio = ready.filter(item => item.kind.startsWith('audio-'));
  if (audio.filter(item => item.kind === 'audio-loop').length !== 2 || audio.filter(item => item.kind === 'audio-effect').length !== 5) errors.push('Required two-loop/five-cue inventory is incomplete.');
  for (const item of ready) {
    const output = mapping[item.runtimePath]?.file ?? item.runtimePath;
    const url = new URL(output, scope);
    if (url.origin !== origin || !url.pathname.startsWith(base) || /[%\\?#]/.test(output) || output.split('/').includes('..')) { outOfScope.add(output); continue; }
    required.add(url.pathname);
    if (!mapping[item.runtimePath] && typeof revisions.get(url.pathname) !== 'string') errors.push(`Required public asset lacks a content revision: ${output}`);
    try {
      const size = (await stat(path.join(dist, output))).size;
      largest = Math.max(largest, size);
      if (size > maxBytes) oversized.add(url.pathname);
      if (size !== item.bytes && !mapping[item.runtimePath]) errors.push(`Inventory byte mismatch: ${output}`);
    } catch { missing.add(url.pathname); }
  }
  const manifest = JSON.parse(await readFile(path.join(dist, 'manifest.webmanifest'), 'utf8'));
  for (const name of ['id', 'scope', 'start_url']) if (manifest[name] !== base) errors.push(`Manifest ${name} differs from BASE_URL.`);
  for (const icon of manifest.icons ?? []) {
    const url = new URL(icon.src, scope);
    if (url.origin !== origin || !url.pathname.startsWith(base) || url.search || url.hash) outOfScope.add(icon.src);
    else required.add(url.pathname);
  }
  if (!manifest.icons?.length) errors.push('Manifest has no install icons.');
  if (![JSON.stringify(buildId), `'${buildId}'`, `\`${buildId}\``].some(literal => source.includes(literal))) errors.push('Worker build identity differs.');
  for (const url of required) if (!cached.has(url)) missing.add(url);
  const result = { buildId, basePath: base, requiredUrls: [...required].sort(), missingUrls: [...missing].sort(),
    oversizedUrls: [...oversized].sort(), outOfScopeUrls: [...outOfScope].sort(), largestAssetBytes: largest,
    configuredMaxBytes: maxBytes, passed: !missing.size && !oversized.size && !outOfScope.size && !errors.length };
  await mkdir(path.dirname(report), { recursive: true }); await writeFile(report, `${JSON.stringify(result, null, 2)}\n`);
  if (errors.length) console.error(errors.join('\n'));
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = Object.fromEntries(Array.from({ length: (process.argv.length - 2) / 2 }, (_, i) => [process.argv[2 + i * 2], process.argv[3 + i * 2]]));
  try {
    const buildId = args['--build-id'] ?? process.env.APP_BUILD_ID;
    const rawBase = args['--base'] ?? process.env.APP_BASE ?? '/Learning-is-Fun/';
    if (!rawBase || rawBase.trim() !== rawBase || !/^\/?[A-Za-z0-9._~/-]*\/?$/.test(rawBase) || rawBase.includes('//') || rawBase.split('/').some(s => s === '.' || s === '..')) throw new Error('Invalid APP_BASE.');
    const segments = rawBase.split('/').filter(Boolean), base = segments.length ? `/${segments.join('/')}/` : '/';
    const result = await checkPrecache({ dist: args['--dist'] ?? 'dist', buildId, base,
      maxBytes: Number(args['--max-bytes'] ?? 10485760), report: args['--report'] ?? `artifacts/platform/${encodeURIComponent(buildId)}/precache-report.json` });
    console.log(JSON.stringify(result)); if (!result.passed) process.exitCode = 1;
  } catch (error) { console.error(error); process.exitCode = 1; }
}
