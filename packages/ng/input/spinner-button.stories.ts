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
            <div mznInputSpinnerButton type="up" size="main" ></div>
            <div mznInputSpinnerButton type="down" size="main" ></div>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Size: sub (Normal)</h3>
          <div style="position: relative;">
            <div mznInputSpinnerButton type="up" size="sub" ></div>
            <div mznInputSpinnerButton type="down" size="sub" ></div>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Disabled</h3>
          <div style="position: relative;">
            <div mznInputSpinnerButton type="up" [disabled]="true" ></div>
            <div mznInputSpinnerButton type="down" [disabled]="true" ></div>
          </div>
        </div>
      </div>
    `,
  }),
};
