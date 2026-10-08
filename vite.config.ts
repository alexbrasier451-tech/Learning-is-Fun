import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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
  return {
    base: deploymentBase(env.APP_BASE ?? '/Learning-is-Fun/'),
    plugins: [react()],
    define: { __BUILD_ID__: JSON.stringify(buildId) },
    build: { rolldownOptions: { input: 'index.html' } },
    server: { host: '127.0.0.1' },
    preview: { host: '127.0.0.1' },
  };
});
