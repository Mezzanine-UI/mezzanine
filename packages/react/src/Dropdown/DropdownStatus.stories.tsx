import { Meta, StoryObj } from '@storybook/react-webpack5';
import DropdownStatus, { DropdownStatusProps } from './DropdownStatus';

import { FolderIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Data Entry/Dropdown/DropdownStatus',
  component: DropdownStatus,
} satisfies Meta<typeof DropdownStatus>;

type Story = StoryObj<DropdownStatusProps>;

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
  render: (args) => (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DropdownStatus {...args} />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    status: 'loading',
    loadingText: '搜尋中...',
  },
  render: (args) => (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DropdownStatus {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    status: 'empty',
    emptyIcon: FolderIcon,
    emptyText: '找不到任何選項。',
  },
  render: (args) => (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DropdownStatus {...args} />
    </div>
  ),
};
