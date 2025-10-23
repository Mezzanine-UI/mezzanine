import type { Preview } from '@storybook/react-webpack5';
import './global.scss';

const preview: Preview = {
  parameters: {
    docs: { page: null },
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
