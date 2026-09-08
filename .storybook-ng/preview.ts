import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { applicationConfig, type Preview } from '@storybook/angular';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
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
        // Without this the sidebar falls back to whatever order the builder
        // indexes files in. That currently reads alphabetically here, but only
        // because every component sits in its own flat directory — moving one
        // file would silently reorder the tree. Sorting explicitly keeps it put
        // and keeps the three Storybooks comparable. `includeNames` stays at its
        // default, so this orders sections and components only and leaves each
        // component's stories in declaration order.
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
