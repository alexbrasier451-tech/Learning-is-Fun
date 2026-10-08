import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify('local-unit-tests') },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: [...configDefaults.exclude, 'tests/fixtures/**', 'tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
  },
});
