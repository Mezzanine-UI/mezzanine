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
        // Without this the sidebar falls back to the order the builder happens
        // to index files in — webpack's path order here, Vite's module graph in
        // `.storybook-vue`, which is no order at all. Sorting explicitly keeps
        // the two Storybooks comparable and survives a file being moved.
        // `includeNames` stays at its default, so this orders sections and
        // components only and leaves each component's stories as declared.
        method: 'alphabetical',
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
