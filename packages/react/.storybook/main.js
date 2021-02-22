const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..', '..', '..');
const PACKAGES_PATH = path.resolve(ROOT_PATH, 'packages');
const SYSTEM_PATH = path.resolve(PACKAGES_PATH, 'system');
const CORE_PATH = path.resolve(PACKAGES_PATH, 'core');
const REACT_PATH = path.resolve(PACKAGES_PATH, 'react');
const TS_CONFIG = path.resolve(REACT_PATH, 'tsconfig.dev.json');

module.exports = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    {
      name: '@storybook/preset-scss',
      options: {
        sassLoaderOptions: {
          implementation: require('sass'),
          sourceMap: false,
        }
      }
    },
  ],
  typescript: {
    check: true,
    checkOptions: {
      tsconfig: TS_CONFIG,
    },
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: TS_CONFIG,
      propFilter: (prop) => {
        const { parent } = prop;

        if (parent) {
          if (
            /node_modules/.test(parent.fileName) ||
            /**
             * For windows
             */
            parent.fileName === 'react/index.d.ts'
          ) {
            return false;
          }
        }

        return true;
      },
    },
  },
  reactOptions: {
    fastRefresh: true,
  },
  webpackFinal: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mezzanine-ui/system': path.resolve(SYSTEM_PATH, 'src'),
      '@mezzanine-ui/core': path.resolve(CORE_PATH, 'src'),
    };
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: TS_CONFIG,
      })
    );
    config.devServer = {
      ...config.devServer,
      stats: {
        ...config.devServer?.stats,
        assets: false,
        children: false,
        chunks: false,
        chunkModules: false,
        colors: true,
        entrypoints: false,
        hash: false,
        modules: false,
        timings: false,
        version: false,
        warnings: false,
      },
    };

    return config;
  }
};
