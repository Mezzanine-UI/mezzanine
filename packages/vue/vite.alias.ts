import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { Alias } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));
const packagesRoot = resolve(here, '..');

/**
 * Resolve `@mezzanine-ui/*` to package **sources**, not to the built copies
 * that `scripts/build.js` drops into `node_modules/@mezzanine-ui/*`.
 *
 * This mirrors the React Storybook's webpack aliases in `.storybook/main.ts`
 * one-for-one, including the prefix-match semantics: a plain string `find`
 * matches both the bare specifier (`@use '@mezzanine-ui/core'`) and any
 * sub-path (`@use '@mezzanine-ui/system/palette'`, `@mezzanine-ui/core/button`).
 *
 * Getting this wrong is a parity hazard rather than a build error: SCSS would
 * silently resolve through node_modules to a possibly-stale built stylesheet,
 * so the Vue Storybook would render against different CSS than the React one.
 */
export const mezzanineAliases: Alias[] = [
  {
    find: '@mezzanine-ui/system',
    replacement: resolve(packagesRoot, 'system/src'),
  },
  {
    find: '@mezzanine-ui/core',
    replacement: resolve(packagesRoot, 'core/src'),
  },
  {
    find: '@mezzanine-ui/icons',
    replacement: resolve(packagesRoot, 'icons/src'),
  },
  {
    find: '@mezzanine-ui/vue',
    replacement: resolve(packagesRoot, 'vue'),
  },
];

/**
 * SCSS load paths mirroring the Angular Storybook's
 * `stylePreprocessorOptions.includePaths` (see `angular.json`). Kept as a
 * fallback for stylesheets that `@use` a bare partial name.
 */
export const scssLoadPaths: string[] = [
  resolve(packagesRoot, 'system/src'),
  resolve(packagesRoot, 'core/src'),
];
