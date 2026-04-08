import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznInputSelectButton } from './select-button.component';
import { MznIcon } from '../icon/icon.component';

export default {
  title: 'Data Entry/Input/SelectButton',
  decorators: [
    moduleMetadata({
      imports: [MznInputSelectButton, MznIcon],
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
          <div style="display: flex; gap: 12px;">
            <div mznInputSelectButton size="main" value="https://" ></div>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Size: sub (Normal)</h3>
          <div style="display: flex; gap: 12px;">
            <div mznInputSelectButton size="sub" value="https://" ></div>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Disabled State</h3>
          <div style="display: flex; gap: 12px;">
            <div mznInputSelectButton [disabled]="true" value="www." ></div>
          </div>
        </div>
      </div>
    `,
  }),
};
