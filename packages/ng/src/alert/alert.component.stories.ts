import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { AlertStatus, MznAlertComponent, MznAlertModule } from '.';

export default {
  title: 'Feedback/Alert',
  decorators: [
    moduleMetadata({
      imports: [MznAlertModule],
    }),
  ],
} as Meta;

const statusList: AlertStatus[] = [
  'success',
  'warning',
  'error',
];

export const Playground: Story<MznAlertComponent & { content: string; }> = (args) => ({
  props: args,
  template: `
    <mzn-alert
      [status]="status"
      (close)="onClose($event)"
    >
      {{content}}
    </mzn-alert>
  `,
});

Playground.args = {
  content: 'Alert',
  onClose: action('onClose'),
  status: 'success',
};

Playground.argTypes = {
  status: {
    control: {
      type: 'select',
      options: statusList,
    },
  },
};
