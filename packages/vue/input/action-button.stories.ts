import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { EyeIcon } from '@mezzanine-ui/icons';
import MznInputActionButton from './action-button.vue';

export default {
  component: MznInputActionButton,
  title: 'Data Entry/Input/ActionButton',
} as Meta;

type Story = StoryObj<typeof MznInputActionButton>;

export const Playground: Story = {
  render: () => ({
    components: { MznInputActionButton },
    setup: () => ({ EyeIcon }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div>
          <h3 style="margin-bottom: 12px">Size: main (Normal)</h3>
          <div style="display: flex; gap: 12px">
            <MznInputActionButton size="main" />
            <MznInputActionButton :icon="EyeIcon" label="View" size="main" />
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Size: sub (Normal)</h3>
          <div style="display: flex; gap: 12px">
            <MznInputActionButton size="sub" />
            <MznInputActionButton :icon="EyeIcon" label="View" size="sub" />
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Disabled State</h3>
          <div style="display: flex; gap: 12px">
            <MznInputActionButton disabled />
            <MznInputActionButton :icon="EyeIcon" label="View" disabled />
          </div>
        </div>
      </div>
    `,
  }),
};
