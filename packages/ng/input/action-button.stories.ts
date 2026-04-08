import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { EyeIcon } from '@mezzanine-ui/icons';
import { MznInputActionButton } from './action-button.component';
import { MznIcon } from '../icon/icon.component';

export default {
  title: 'Data Entry/Input/ActionButton',
  decorators: [
    moduleMetadata({
      imports: [MznInputActionButton, MznIcon],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { EyeIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 12px;">Size: main (Normal)</h3>
          <div style="display: flex; gap: 12px;">
            <mzn-input-action-button size="main" />
            <mzn-input-action-button [icon]="EyeIcon" label="View" size="main" />
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Size: sub (Normal)</h3>
          <div style="display: flex; gap: 12px;">
            <mzn-input-action-button size="sub" />
            <mzn-input-action-button [icon]="EyeIcon" label="View" size="sub" />
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Disabled State</h3>
          <div style="display: flex; gap: 12px;">
            <mzn-input-action-button [disabled]="true" />
            <mzn-input-action-button [icon]="EyeIcon" label="View" [disabled]="true" />
          </div>
        </div>
      </div>
    `,
  }),
};
