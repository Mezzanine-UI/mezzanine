import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznToggle from './toggle.vue';
import type { ToggleProps } from './toggle.types';

export default {
  title: 'Data Entry/Toggle',
} as Meta;

type Story = StoryObj<ToggleProps>;

export const All: Story = {
  render: () => ({
    components: { MznToggle },
    template: `
      <div style="display: grid; gap: 16px; align-items: center">
        Size: main
        <div style="display: flex; gap: 16px; align-items: center">
          enable
          <MznToggle />
          <MznToggle default-checked />
          disabled
          <MznToggle disabled />
          <MznToggle default-checked disabled />
        </div>
        <br />
        Size: sub
        <div style="display: flex; gap: 16px; align-items: center">
          enable
          <MznToggle size="sub" />
          <MznToggle size="sub" default-checked />
          disabled
          <MznToggle size="sub" disabled />
          <MznToggle size="sub" default-checked disabled />
        </div>
        <br />
        With text content
        <div style="display: flex; gap: 16px; align-items: center">
          <MznToggle label="Toggle Label" supporting-text="Toggle Supporting Text" />
          <MznToggle label="Toggle Label" />
        </div>
        <div style="display: flex; gap: 16px; align-items: center">
          <MznToggle
            disabled
            label="Toggle Label"
            supporting-text="Toggle Supporting Text"
          />
          <MznToggle disabled label="Toggle Label" />
        </div>
      </div>
    `,
  }),
};

export const Playground: Story = {
  args: {
    checked: true,
    disabled: false,
    size: 'main',
  },
  argTypes: {
    size: { control: 'select', options: ['main', 'sub'] },
  },
  render: (args) => ({
    components: { MznToggle },
    setup: () => ({ args }),
    template: '<MznToggle v-bind="args" />',
  }),
};
