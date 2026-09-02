import type { Preview } from '@storybook/vue3-vite';
import './global.scss';

const preview: Preview = {
  parameters: {
    docs: {},
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
          'Foundation',
          'Motion',
          'Navigation',
          'Data Entry',
          'Data Display',
          'Feedback',
          'Others',
          'Internal',
          'V1',
        ],
      },
    },
  },
};

export default preview;
