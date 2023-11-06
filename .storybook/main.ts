import type { StorybookConfig } from '@storybook/react-webpack5';
import { resolve } from 'path';

const ROOT_PATH = resolve(__dirname, '../');
const PACKAGES_PATH = resolve(ROOT_PATH, 'packages');
const SYSTEM_PATH = resolve(PACKAGES_PATH, 'system');
const CORE_PATH = resolve(PACKAGES_PATH, 'core');
const ICONS_PATH = resolve(PACKAGES_PATH, 'icons');

const config: StorybookConfig = {
  stories: [
    '../packages/react/src/**/*.stories.@(mjs|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-storysource',
    'storybook-rytass-palette',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      fastRefresh: true,
      builder: {
        fsCache: true,
        lazyCompilation: true,
      },
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
