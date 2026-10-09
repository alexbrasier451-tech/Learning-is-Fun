import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import foundation from '../../vite.config';

export default defineConfig(async environment => {
  const root = process.env.SHELL_VERIFY_ROOT;
  if (!root) throw new Error('Set SHELL_VERIFY_ROOT to a private temporary directory.');
  const base = typeof foundation === 'function' ? await foundation(environment) : foundation;
  const teardown: Plugin = { name: 'shell-server-teardown', configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.method !== 'POST' || request.url !== '/playtest/__d3-shell-close') { next(); return; }
      response.end('closing'); void server.close().then(() => process.exit(0));
    });
  } };
  return { ...base, root: fileURLToPath(new URL('../..', import.meta.url)),
    cacheDir: `${root}/vite`, plugins: [...(base.plugins ?? []), teardown] };
});
