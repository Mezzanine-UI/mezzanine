const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..', '..', '..');
const PACKAGES_PATH = path.resolve(ROOT_PATH, 'packages');
const CORE_PATH = path.resolve(PACKAGES_PATH, 'core');
const REACT_PATH = path.resolve(PACKAGES_PATH, 'react')
const TS_CONFIG = path.resolve(REACT_PATH, 'tsconfig.dev.json');

module.exports = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-knobs', '@storybook/addon-docs/preset', '@storybook/addon-storysource'],
  reactOptions: {
    fastRefresh: true,
  },
  webpackFinal: config => {
    config.module.rules.push(
      {
        test: /\.(ts|tsx)$/,
        include: [CORE_PATH, REACT_PATH],
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: TS_CONFIG
            }
          },
          {
            loader: 'react-docgen-typescript-loader',
            options: {
              tsconfigPath: TS_CONFIG
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        include: [CORE_PATH, REACT_PATH],
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: false,
            },
          },
        ]
      }
    );
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: TS_CONFIG,
      })
    );

    return config;
  }
};
