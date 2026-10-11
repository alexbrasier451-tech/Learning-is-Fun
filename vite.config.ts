import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootConfig = resolve(fileURLToPath(import.meta.url));

/** Confirmed intended Pages path; APP_BASE remains an explicit override. */
function deploymentBase(value: string): string {
  if (!value || value.trim() !== value || !/^\/?[A-Za-z0-9._~/-]*\/?$/.test(value)) {
    throw new Error('APP_BASE must be a local path such as /repository/ or /.');
  }
  const segments = value.split('/').filter(Boolean);
  if (segments.some(segment => segment === '.' || segment === '..') || value.includes('//')) {
    throw new Error('APP_BASE cannot contain traversal or empty path segments.');
  }
  return segments.length ? `/${segments.join('/')}/` : '/';
}

export default defineConfig(({ command, mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  if (command === 'build' && !env.APP_BUILD_ID) {
    throw new Error('Set APP_BUILD_ID to the candidate identity (local-* for local builds).');
  }
  const buildId = env.APP_BUILD_ID ?? 'local-development';
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(buildId)) {
    throw new Error('APP_BUILD_ID must be a nonempty candidate identifier.');
  }
  const base = deploymentBase(env.APP_BASE ?? '/Learning-is-Fun/');
  return {
    base,
    plugins: [react(), ...(command === 'build' ? VitePWA({
      strategies: 'injectManifest', srcDir: 'src', filename: 'sw.ts',
      injectRegister: false, registerType: 'prompt',
      manifest: {
        name: 'Learning is Fun', short_name: 'Learning is Fun',
        id: base, start_url: base, scope: base, display: 'standalone',
        theme_color: '#176a68', background_color: '#f5eedc',
        icons: [{ src: `${base}assets/art/m1/ui/app-icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      injectManifest: {
        globPatterns: ['**/*.{html,js,css,json,svg,png,ico,webp,jpg,jpeg,wav,webmanifest}'],
        globIgnores: ['.vite/**'],
        // Keep content revisions for every URL, including stable public media.
        dontCacheBustURLsMatching: /(?!)/,
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      integration: {
        configureOptions(config, options) {
          // Fixture wrappers import this foundation; only the actual root build gets PWA output.
          options.disable = config.command !== 'build' || !config.configFile || resolve(config.configFile) !== rootConfig;
        },
        configureCustomSWViteBuild(config) {
          config.base = base;
          config.define = { ...config.define, __BUILD_ID__: JSON.stringify(buildId) };
        },
      },
    }) : [])],
    define: { __BUILD_ID__: JSON.stringify(buildId) },
    build: { manifest: true, rolldownOptions: { input: 'index.html' } },
    server: { host: '127.0.0.1' },
    preview: { host: '127.0.0.1' },
  };
});
