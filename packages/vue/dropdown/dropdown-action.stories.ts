import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznDropdownAction from './dropdown-action.vue';

export default {
  component: MznDropdownAction,
  title: 'Internal/Dropdown/DropdownAction',
} as Meta;

type Story = StoryObj<typeof MznDropdownAction>;

const wrapperStyle =
  'background-color: #d3d3d3; height: 100px; width: 188px; display: flex; align-items: center';

const noop = (): void => {};

export const Playground: Story = {
  argTypes: {
    showActions: {
      control: 'boolean',
    },
    showTopBar: {
      control: 'boolean',
    },
  },
  args: {
    showActions: true,
    showTopBar: false,
  },
  render: (args) => ({
    components: { MznDropdownAction },
    setup: () => ({ args, noop, wrapperStyle }),
    template: `
      <div :style="wrapperStyle">
        <MznDropdownAction v-bind="args" @cancel="noop" @confirm="noop" />
      </div>
    `,
  }),
};

export const withCustomAction: Story = {
  args: {
    showActions: true,
    showTopBar: false,
  },
  render: (args) => ({
    components: { MznDropdownAction },
    setup: () => ({ args, noop, wrapperStyle }),
    template: `
      <div :style="wrapperStyle">
        <MznDropdownAction v-bind="args" @click="noop" />
      </div>
    `,
  }),
};

export const withClearAction: Story = {
  args: {
    showActions: true,
    showTopBar: false,
  },
  render: (args) => ({
    components: { MznDropdownAction },
    setup: () => ({ args, noop, wrapperStyle }),
    template: `
      <div :style="wrapperStyle">
        <MznDropdownAction v-bind="args" @clear="noop" />
      </div>
    `,
  }),
};
