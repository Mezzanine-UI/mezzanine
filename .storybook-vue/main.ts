import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { mezzanineAliases, scssLoadPaths } from '../packages/vue/vite.alias';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const rootPath = resolve(here, '..');

/**
 * Storybook's own manager/preview UI is React, and it must resolve to the one
 * copy in the repo root. Without these the repo root tsconfig's
 * `"baseUrl": "./packages"` wins and a bare `import React from 'react'`
 * resolves to the `packages/react` **directory**, crashing esbuild's
 * dependency optimizer. `.storybook-ng/main.ts` carries the same aliases for
 * the same reason.
 */
const reactAliases = [
  {
    find: 'react-dom',
    replacement: resolve(rootPath, 'node_modules/react-dom'),
  },
  { find: 'react', replacement: resolve(rootPath, 'node_modules/react') },
];

const config: StorybookConfig = {
  stories: ['../packages/vue/**/*.@(mdx|stories.ts)'],

  addons: [getAbsolutePath('@storybook/addon-docs')],

  framework: getAbsolutePath('@storybook/vue3-vite'),

  viteFinal: (config) => {
    // `@storybook/vue3-vite` does not depend on, or inject, `@vitejs/plugin-vue`
    // — it assumes the project's own `vite.config.ts` already registers it.
    // This repo has no root Vite config (React and Angular are webpack), so
    // without this every `.vue` file reaches `vite:import-analysis` untransformed
    // and the story 404s with "Install @vitejs/plugin-vue to handle .vue files".
    config.plugins = config.plugins ?? [];

    const hasVuePlugin = config.plugins
      .flat()
      .some(
        (p) =>
          p && typeof p === 'object' && 'name' in p && p.name === 'vite:vue',
      );

    // `unshift`, not `push`: Storybook's `storybook:vue-component-meta-plugin`
    // appends generated JS to whatever source it receives. If `vite:vue` runs
    // after it, that JS is appended to the raw SFC and then parsed as one —
    // a component JSDoc containing a `<template>`/`lang="ts"` example then
    // fails the SFC tokenizer and the module 404s. In a normal project
    // `@vitejs/plugin-vue` comes from the user's own Vite config, which
    // Storybook merges ahead of its own plugins; this restores that order.
    if (!hasVuePlugin) config.plugins.unshift(vue());

    config.resolve = config.resolve ?? {};
    config.resolve.alias = [
      ...normalizeAlias(config.resolve.alias),
      ...mezzanineAliases,
      ...reactAliases,
    ];

    config.css = config.css ?? {};
    config.css.preprocessorOptions = {
      ...config.css.preprocessorOptions,
      scss: {
        ...config.css.preprocessorOptions?.scss,
        loadPaths: scssLoadPaths,
      },
    };

    return config;
  },
};

export default config;

/**
 * Storybook may hand back either the object or the array alias form; the
 * Mezzanine aliases rely on ordered prefix matching, so everything is
 * normalized to the array form before appending.
 */
function normalizeAlias(
  alias: unknown,
): { find: string; replacement: string }[] {
  if (!alias) return [];
  if (Array.isArray(alias)) return alias;

  return Object.entries(alias as Record<string, string>).map(
    ([find, replacement]) => ({ find, replacement }),
  );
}

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
