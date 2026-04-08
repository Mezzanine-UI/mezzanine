import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznInputSpinnerButton } from './spinner-button.component';
import { MznIcon } from '../icon/icon.component';

export default {
  title: 'Data Entry/Input/SpinnerButton',
  decorators: [
    moduleMetadata({
      imports: [MznInputSpinnerButton, MznIcon],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 12px;">Size: main (Normal)</h3>
          <div style="position: relative;">
            <mzn-input-spinner-button type="up" size="main" />
            <mzn-input-spinner-button type="down" size="main" />
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Size: sub (Normal)</h3>
          <div style="position: relative;">
            <mzn-input-spinner-button type="up" size="sub" />
            <mzn-input-spinner-button type="down" size="sub" />
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Disabled</h3>
          <div style="position: relative;">
            <mzn-input-spinner-button type="up" [disabled]="true" />
            <mzn-input-spinner-button type="down" [disabled]="true" />
          </div>
        </div>
      </div>
    `,
  }),
};
