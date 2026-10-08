import { describe, expect, it, vi } from 'vitest';
import { APP_ID, createAppIdentity, normalizeBasePath } from './appIdentity';
import { assetUrl } from './assets';

describe('deployment identity and public assets', () => {
  it('normalizes explicit root and project paths', () => {
    expect(APP_ID).toBe('learning-is-fun');
    expect(normalizeBasePath('/')).toBe('/');
    expect(normalizeBasePath('learning-is-fun')).toBe('/learning-is-fun/');
    expect(normalizeBasePath('/learning-is-fun/')).toBe('/learning-is-fun/');
  });
  it('keeps the namespace stable across candidates and distinct across paths', () => {
    const first = createAppIdentity('/example/', 'local-first');
    const second = createAppIdentity('/example/', 'local-second');
    expect(first.namespace).toBe('learning-is-fun:/example/');
    expect(second.namespace).toBe(first.namespace);
    expect(second.buildId).not.toBe(first.buildId);
    expect(createAppIdentity('/', 'local-first').namespace).toBe('learning-is-fun:/');
  });
  it.each(['', '//', '/a//b/', '/a/../', '/./', 'https://example.org/', '/a?b/', '/a#b/', '/a\\b/', ' /a/'])('rejects malformed base %j', base => {
    expect(() => normalizeBasePath(base)).toThrow();
  });
  it.each(['', '/asset.svg', '../asset.svg', 'a/../b', 'https://x/a', 'a?b', 'a#b', 'a\\b', 'a//b', '%2e%2e/b', 'a/%2f/b', './a', 'a b'])('rejects unsafe asset %j', path => {
    expect(() => assetUrl(path)).toThrow();
  });
  it('resolves a public path under the configured project base', async () => {
    vi.resetModules();
    vi.stubEnv('BASE_URL', '/example/');
    try {
      const { assetUrl: projectAssetUrl } = await import('./assets');
      expect(projectAssetUrl('scenery/bridge.svg')).toBe('/example/scenery/bridge.svg');
    } finally { vi.unstubAllEnvs(); vi.resetModules(); }
  });
  it('rejects a malformed candidate identity', () => {
    expect(() => createAppIdentity('/', '')).toThrow();
    expect(() => createAppIdentity('/', 'candidate with spaces')).toThrow();
  });
});
