const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..', '..', '..');
const PACKAGES_PATH = path.resolve(ROOT_PATH, 'packages');
const SYSTEM_PATH = path.resolve(PACKAGES_PATH, 'system');
const CORE_PATH = path.resolve(PACKAGES_PATH, 'core');

module.exports = {
  stories: [
    '../**/*.stories.@(mdx|ts)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
  ],
  webpackFinal: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mezzanine-ui/system': path.resolve(SYSTEM_PATH, 'src'),
      '@mezzanine-ui/core': path.resolve(CORE_PATH, 'src'),
    };
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
