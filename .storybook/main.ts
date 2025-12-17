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
        // Force single React instance
        react: resolve(ROOT_PATH, 'node_modules/react'),
        'react-dom': resolve(ROOT_PATH, 'node_modules/react-dom'),
      };
    }

    if (config.module && config.module.rules) {
      config.module.rules.push({
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      });

      // Handle font files
      config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
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
