import { BASE_URL } from './appIdentity';

/** Public files only. Imported Vite asset URLs must be used as supplied. */
export function assetUrl(relativePath: string): string {
  if (!relativePath || /[\\:%?#\u0000-\u0020\u007f]/.test(relativePath) || relativePath.startsWith('/')) {
    throw new Error('Asset paths must be app-relative, without schemes, escapes, queries or fragments.');
  }
  if (relativePath.split('/').some(segment => !segment || segment === '.' || segment === '..')) {
    throw new Error('Asset paths cannot contain traversal or empty segments.');
  }
  return `${BASE_URL}${relativePath}`;
}
