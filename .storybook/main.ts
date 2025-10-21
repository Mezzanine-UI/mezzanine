import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/react-webpack5';
import { resolve, dirname, join } from 'path';

const require = createRequire(import.meta.url);

const ROOT_PATH = resolve(__dirname, '../');
const PACKAGES_PATH = resolve(ROOT_PATH, 'packages');
const SYSTEM_PATH = resolve(PACKAGES_PATH, 'system');
const CORE_PATH = resolve(PACKAGES_PATH, 'core');
const ICONS_PATH = resolve(PACKAGES_PATH, 'icons');

const config: StorybookConfig = {
  stories: ['../packages/react/src/**/*.@(mdx|stories.@(mjs|ts|tsx))'],

  addons: [
    getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: getAbsolutePath('@storybook/react-webpack5'),

  webpackFinal: (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        '@mezzanine-ui/system': resolve(SYSTEM_PATH, 'src'),
        '@mezzanine-ui/core': resolve(CORE_PATH, 'src'),
        '@mezzanine-ui/icons': resolve(ICONS_PATH, 'src'),
      };
    }

    if (config.module && config.module.rules) {
      config.module.rules.push({
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      });
    }

    return config;
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
