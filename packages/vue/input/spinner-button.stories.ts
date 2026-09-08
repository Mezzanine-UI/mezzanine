import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznInputSpinnerButton from './spinner-button.vue';

export default {
  component: MznInputSpinnerButton,
  title: 'Data Entry/Input/SpinnerButton',
} as Meta;

type Story = StoryObj<typeof MznInputSpinnerButton>;

export const Playground: Story = {
  render: () => ({
    components: { MznInputSpinnerButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div>
          <h3 style="margin-bottom: 12px">Size: main (Normal)</h3>
          <div style="position: relative">
            <MznInputSpinnerButton type="up" size="main" />
            <MznInputSpinnerButton type="down" size="main" />
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Size: sub (Normal)</h3>
          <div style="position: relative">
            <MznInputSpinnerButton type="up" size="sub" />
            <MznInputSpinnerButton type="down" size="sub" />
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Disabled</h3>
          <div style="position: relative">
            <MznInputSpinnerButton type="up" disabled />
            <MznInputSpinnerButton type="down" disabled />
          </div>
        </div>
      </div>
    `,
  }),
};
