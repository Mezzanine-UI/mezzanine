import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-webpack5';

const require = createRequire(import.meta.url);
const ROOT_PATH = resolve(__dirname, '../');

/**
 * Mezzanine Storybook Hub
 *
 * 本身不含元件，透過 Storybook Composition 聚合 React 與 Angular 兩邊的
 * Storybook。部署時三個 Storybook 的 static output 被 compose 到同一個網域：
 *
 *   /          → Hub（此設定）
 *   /react/    → React Storybook
 *   /angular/  → Angular Storybook
 *
 * refs 使用相對路徑，同 origin 避免 CORS；同時保證 local dev（指向 localhost
 * 的 React / Angular Storybook）也能正確運作 — 用 `STORYBOOK_HUB_*_URL` 環境
 * 變數覆寫。
 */
const config: StorybookConfig = {
  stories: ['./**/*.mdx'],

  addons: [
    getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: getAbsolutePath('@storybook/react-webpack5'),

  webpackFinal: (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        // Force single React instance — hub itself has no React stories but
        // the react-webpack5 framework still needs react/react-dom to bootstrap.
        react: resolve(ROOT_PATH, 'node_modules/react'),
        'react-dom': resolve(ROOT_PATH, 'node_modules/react-dom'),
      };
    }
    return config;
  },

  refs: {
    react: {
      title: 'React',
      url: process.env.STORYBOOK_HUB_REACT_URL ?? './react',
      expanded: false,
    },
    angular: {
      title: 'Angular',
      url: process.env.STORYBOOK_HUB_ANGULAR_URL ?? './angular',
      expanded: false,
    },
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
