import type { Preview } from '@storybook/react-webpack5';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['React', 'Angular'],
      },
    },
  },
};

export default preview;
