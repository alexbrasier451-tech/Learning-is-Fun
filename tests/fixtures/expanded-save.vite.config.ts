import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import foundation from '../../vite.config';
export default defineConfig(async env => {
  if (!process.env.EXPANDED_VERIFY_ROOT) throw new Error('Private output required.');
  const base = typeof foundation === 'function' ? await foundation(env) : foundation;
  const close: Plugin = {
    name: 'expanded-fixture-close', configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/playtest/__expanded-close') { next(); return; }
        res.end('closing'); void server.close().then(() => process.exit(0));
      });
    },
  };
  return { ...base, cacheDir: `${process.env.EXPANDED_VERIFY_ROOT}/vite`, plugins: [...(base.plugins ?? []), close] };
});
