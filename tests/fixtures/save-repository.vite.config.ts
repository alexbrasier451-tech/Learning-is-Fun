import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import foundation from '../../vite.config';

export default defineConfig(async environment => {
  const verificationRoot = process.env.REPOSITORY_VERIFY_ROOT;
  if (!verificationRoot) throw new Error('Set REPOSITORY_VERIFY_ROOT to a private temporary directory.');
  const base = typeof foundation === 'function' ? await foundation(environment) : foundation;
  const teardown: Plugin = {
    name: 'repository-fixture-teardown',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.method !== 'POST' || request.url !== '/playtest/__wp04-close-fixture') { next(); return; }
        response.end('closing');
        void server.close().then(() => process.exit(0));
      });
    },
  };
  return { ...base, cacheDir: `${verificationRoot}/vite`, plugins: [...(base.plugins ?? []), teardown] };
});
