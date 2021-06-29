import { DocsPage } from '@storybook/addon-docs';
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
      controls: {
        sort: 'requiredFirst',
      },
      options: {
        storySort: {
          order: [
            'General',
            'Navigation',
            'Data Entry',
            'Data Display',
            'Feedback'
          ]
        }
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
