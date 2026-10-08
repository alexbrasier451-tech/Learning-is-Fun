export const APP_ID = 'learning-is-fun';

export function normalizeBasePath(value: string): string {
  if (!value || value.trim() !== value || !/^\/?[A-Za-z0-9._~/-]*\/?$/.test(value)) {
    throw new Error('Invalid deployment base path.');
  }
  const segments = value.split('/').filter(Boolean);
  if (value.includes('//') || segments.some(segment => segment === '.' || segment === '..')) {
    throw new Error('Invalid deployment base path segments.');
  }
  return segments.length ? `/${segments.join('/')}/` : '/';
}

export function createAppIdentity(basePath: string, buildId: string) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(buildId)) throw new Error('Invalid build identity.');
  const baseUrl = normalizeBasePath(basePath);
  return Object.freeze({ appId: APP_ID, baseUrl, namespace: `${APP_ID}:${baseUrl}`, buildId });
}

const identity = createAppIdentity(import.meta.env.BASE_URL, __BUILD_ID__);
export const BASE_URL = identity.baseUrl;
export const APP_NAMESPACE = identity.namespace;
export const BUILD_ID = identity.buildId;
