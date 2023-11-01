import type { StorybookConfig } from '@storybook/react-webpack5';

import { join, dirname, resolve } from 'path';

const ROOT_PATH = resolve(__dirname, '../');
const PACKAGES_PATH = resolve(ROOT_PATH, 'packages');
const SYSTEM_PATH = resolve(PACKAGES_PATH, 'system');
const CORE_PATH = resolve(PACKAGES_PATH, 'core');
const ICONS_PATH = resolve(PACKAGES_PATH, 'icons');

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../packages/react/src/**/*.stories.@(mjs|ts|tsx|mdx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    // getAbsolutePath('@react-theming/storybook-addon'),
    getAbsolutePath('@storybook/addon-onboarding'),
  ],
  core: {
    builder: {
      name: '@storybook/builder-webpack5',
      options: {
        fsCache: true,
        lazyCompilation: true,
      },
    },
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      fastRefresh: true,
    },
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: config => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
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
  }
};
export default config;
