import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { FolderIcon } from '@mezzanine-ui/icons';
import MznDropdownStatus from './dropdown-status.vue';

export default {
  component: MznDropdownStatus,
  title: 'Internal/Dropdown/DropdownStatus',
} as Meta;

type Story = StoryObj<typeof MznDropdownStatus>;

const wrapperStyle =
  'padding: 20px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px; display: flex; align-items: center; justify-content: center';

export const Playground: Story = {
  argTypes: {
    status: {
      control: 'select',
      options: ['loading', 'empty'],
    },
  },
  args: {
    status: 'loading',
  },
  render: (args) => ({
    components: { MznDropdownStatus },
    setup: () => ({ args, wrapperStyle }),
    template: `
      <div :style="wrapperStyle">
        <MznDropdownStatus v-bind="args" />
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: {
    loadingText: '搜尋中...',
    status: 'loading',
  },
  render: (args) => ({
    components: { MznDropdownStatus },
    setup: () => ({ args, wrapperStyle }),
    template: `
      <div :style="wrapperStyle">
        <MznDropdownStatus v-bind="args" />
      </div>
    `,
  }),
};

export const Empty: Story = {
  args: {
    emptyIcon: FolderIcon,
    emptyText: '找不到任何選項。',
    status: 'empty',
  },
  render: (args) => ({
    components: { MznDropdownStatus },
    setup: () => ({ args, wrapperStyle }),
    template: `
      <div :style="wrapperStyle">
        <MznDropdownStatus v-bind="args" />
      </div>
    `,
  }),
};
