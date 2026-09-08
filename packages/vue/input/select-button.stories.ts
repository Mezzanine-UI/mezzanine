import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import MznInputSelectButton from './select-button.vue';

export default {
  component: MznInputSelectButton,
  title: 'Data Entry/Input/SelectButton',
} as Meta;

type Story = StoryObj<typeof MznInputSelectButton>;

const options = [
  { id: 'https://', name: 'https://' },
  { id: 'http://', name: 'http://' },
  { id: 'ftp://', name: 'ftp://' },
];

export const Playground: Story = {
  render: () => ({
    components: { MznInputSelectButton },
    setup: () => {
      const selectedValue = ref('https://');

      return { options, selectedValue };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div>
          <h3 style="margin-bottom: 12px">Size: main (Normal)</h3>
          <div style="display: flex; gap: 12px">
            <MznInputSelectButton
              :options="options"
              size="main"
              :value="selectedValue"
              @select="selectedValue = $event"
            />
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Size: sub (Normal)</h3>
          <div style="display: flex; gap: 12px">
            <MznInputSelectButton
              :options="options"
              size="sub"
              :value="selectedValue"
              @select="selectedValue = $event"
            />
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 12px">Disabled State</h3>
          <div style="display: flex; gap: 12px">
            <MznInputSelectButton disabled :options="options" value="www." />
          </div>
        </div>
      </div>
    `,
  }),
};
