import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import foundation from '../../vite.config';
export default defineConfig(async environment => {
  const root = process.env.ADULT_VERIFY_ROOT;
  if (!root) throw new Error('Set ADULT_VERIFY_ROOT to a private temporary directory.');
  const base = typeof foundation === 'function' ? await foundation(environment) : foundation;
  const teardown: Plugin = { name: 'adult-fixture-teardown', configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.method !== 'POST' || request.url !== '/playtest/__wp04-adult-close') { next(); return; }
      response.end('closing'); void server.close().then(() => process.exit(0));
    });
  } };
  return { ...base, cacheDir: `${root}/vite`, plugins: [...(base.plugins ?? []), teardown] };
});
