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
