import type { Preview } from '@storybook/react-webpack5';
import { DocsPage } from '@storybook/addon-docs';
import './global.scss';

const preview: Preview = {
  parameters: {
    docs: { page: DocsPage },
    backgrounds: {
      grid: {
        disable: false,
      },
      disabled: true,
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
          'Others',
        ],
      },
    },
  },
};

export default preview;
