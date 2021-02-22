import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { AlertSeverity, MznAlertComponent, MznAlertModule } from '.';

export default {
  title: 'Feedback/Alert',
  decorators: [
    moduleMetadata({
      imports: [MznAlertModule],
    }),
  ],
} as Meta;

const severities: AlertSeverity[] = [
  'success',
  'warning',
  'error',
];

export const Playground: Story<MznAlertComponent & { content: string; }> = (args) => ({
  props: args,
  template: `
    <mzn-alert
      [severity]="severity"
      (close)="onClose($event)"
    >
      {{content}}
    </mzn-alert>
  `,
});

Playground.args = {
  content: 'Alert',
  onClose: action('onClose'),
  severity: 'success',
};

Playground.argTypes = {
  severity: {
    control: {
      type: 'select',
      options: severities,
    },
  },
};
