import type { Preview } from '@storybook/angular';

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
          'Foundation',
          'Motion',
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
