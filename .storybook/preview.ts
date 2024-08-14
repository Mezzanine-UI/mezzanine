import type { Preview } from '@storybook/react';
import { DocsPage } from '@storybook/addon-docs';
import './global.scss';

const preview: Preview = {
  parameters: {
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
          'System',
          'General',
          'Navigation',
          'Data Entry',
          'Data Display',
          'Feedback',
        ],
      },
    },
  },
};

export default preview;
