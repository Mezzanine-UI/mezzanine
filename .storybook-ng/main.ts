import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/angular';
import { resolve, dirname, join } from 'path';

const require = createRequire(import.meta.url);

const ROOT_PATH = resolve(__dirname, '../');
const PACKAGES_PATH = resolve(ROOT_PATH, 'packages');
const SYSTEM_PATH = resolve(PACKAGES_PATH, 'system');
const CORE_PATH = resolve(PACKAGES_PATH, 'core');
const ICONS_PATH = resolve(PACKAGES_PATH, 'icons');

const config: StorybookConfig = {
  stories: ['../packages/ng/**/*.stories.ts'],

  addons: [],

  framework: getAbsolutePath('@storybook/angular'),

  core: {
    builder: 'webpack5',
  },

  webpackFinal: (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@mezzanine-ui/system': resolve(SYSTEM_PATH, 'src'),
        '@mezzanine-ui/core': resolve(CORE_PATH, 'src'),
        '@mezzanine-ui/icons': resolve(ICONS_PATH, 'src'),
      };
    }

    return config;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
