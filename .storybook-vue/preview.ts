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
        // React's sidebar order is an accident of its builder: webpack expands
        // the stories glob in path order, which happens to read alphabetically.
        // Vite's indexer has no such order at all, so the tree is sorted here
        // explicitly. `includeNames` stays off, so this orders the title tree
        // and leaves each component's own stories in declaration order.
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
