import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { mezzanineAliases, scssLoadPaths } from './vite.alias';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: { alias: mezzanineAliases },
  css: { preprocessorOptions: { scss: { loadPaths: scssLoadPaths } } },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    // Keeps spec files written the same way as the React (jest) and Angular
    // (jest-preset-angular) suites — no per-file `import { describe } from ...`.
    globals: true,
    setupFiles: [resolve(here, 'vitest.setup.ts')],
    include: ['**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    /**
     * Vitest's default is 5s, the same one the React suite outgrew: the
     * monorepo runs its test targets three at a time and each runner spawns
     * its own workers, so a test's wall clock says as much about what else is
     * running as about the test. Matches `packages/react/jest.config.js`.
     */
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      include: ['**/*.ts', '**/*.vue'],
      exclude: [
        '**/index.ts',
        '**/*.stories.ts',
        '**/*.spec.ts',
        '**/dist/**',
        '**/node_modules/**',
        'vite.alias.ts',
        'vite.config.ts',
        'vitest.config.ts',
        'vitest.setup.ts',
      ],
    },
  },
});
