import { DocsPage } from '@storybook/addon-docs/blocks';
import './global.scss';

export function createPreview(options) {
  return {
    decorators: [options.decorateTheme],
    parameters: {
      ...options.parameters,
      docs: { page: DocsPage },
      backgrounds: {
        disable: true,
        grid: {
          disable: false,
        },
      },
    },
    globalTypes: {
      theme: {
        name: 'Theme',
        description: 'Toggle light/dark mode',
        defaultValue: 'light',
        toolbar: {
          icon: 'mirror',
          items: ['light', 'dark'],
        },
      },
    },
  };
}
