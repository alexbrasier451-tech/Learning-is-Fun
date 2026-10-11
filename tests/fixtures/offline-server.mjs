import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

if (!process.env.OFFLINE_OUTPUT || !path.isAbsolute(process.env.OFFLINE_OUTPUT)) throw new Error('Set OFFLINE_OUTPUT to the private A/B build directory.');
const output = path.resolve(process.env.OFFLINE_OUTPUT);
await readFile(path.join(output, 'build-a/index.html')); await readFile(path.join(output, 'build-b/index.html'));
let current = { candidate: 'a', fail: '', requests: [] };
const types = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.wav': 'audio/wav', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:5196');
  res.setHeader('Cache-Control', 'no-store');
  if (url.pathname === '/__offline-shutdown' && req.method === 'POST') {
    res.end('Stopped'); server.close(() => process.exit(0)); server.closeAllConnections(); return;
  }
  if (url.pathname === '/__offline-control') {
    if (req.method === 'POST') {
      let body = ''; for await (const data of req) body += data;
      let input; try { input = JSON.parse(body); } catch { res.writeHead(400).end(); return; }
      if (!['a', 'b'].includes(input.candidate) || (input.fail && !/^[a-z0-9.-]+$/.test(input.fail))) { res.writeHead(400).end(); return; }
      current = { candidate: input.candidate, fail: input.fail ?? '', requests: [] };
    }
    res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(current)); return;
  }
  if (url.pathname === '/blank') { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><title>Outside app scope</title>'); return; }
  let file;
  if (/^\/__offline-support\/[ab]\.js$/.test(url.pathname)) file = path.join(output, 'support', path.basename(url.pathname));
  else if (url.pathname.startsWith('/playtest/')) {
    current.requests.push({ candidate: current.candidate, url: url.href, at: Date.now(), cacheControl: req.headers['cache-control'] ?? null, pragma: req.headers.pragma ?? null });
    if (current.fail && url.pathname.endsWith(current.fail)) { res.writeHead(503).end('Interrupted preparation'); return; }
    const relative = url.pathname.slice('/playtest/'.length) || 'index.html';
    if (relative.includes('..') || /[%\\]/.test(relative)) { res.writeHead(400).end(); return; }
    // Exercise ordinary fresh HTTP-cache entries too: B's install must request
    // its revised stable media, even while A's response is still HTTP-fresh.
    if (/^assets\/(?:art|audio)\//.test(relative)) res.setHeader('Cache-Control', 'public, max-age=3600');
    file = path.join(output, `build-${current.candidate}`, relative);
  } else { res.writeHead(404).end(); return; }
  try { res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream'); res.end(await readFile(file)); }
  catch { res.writeHead(404).end('Missing'); }
});
server.listen(5196, '127.0.0.1', () => console.log(`Production A/B server on 5196; pid=${process.pid}; parentPid=${process.ppid}`));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { server.close(() => process.exit(0)); server.closeAllConnections(); });
