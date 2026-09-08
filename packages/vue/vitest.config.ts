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
