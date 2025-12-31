import { Meta, StoryObj } from '@storybook/react-webpack5';
import DropdownAction, { DropdownActionProps } from './DropdownAction';

export default {
  title: 'Data Entry/Dropdown/DropdownAction',
  component: DropdownAction,
} satisfies Meta<typeof DropdownAction>;

type Story = StoryObj<DropdownActionProps>;

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
    onConfirm: () => { },
    onCancel: () => { },
  },
  render: (args) => (
    <div
      style={{
        backgroundColor: '#d3d3d3',
        height: '100px',
        width: '188px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DropdownAction {...args} />
    </div>
  ),
};

export const withCustomAction: Story = {
  args: {
    showActions: true,
    showTopBar: false,
    onClick: () => { },
  },
  render: (args) => (
    <div
      style={{
        backgroundColor: '#d3d3d3',
        height: '100px',
        width: '188px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DropdownAction {...args} />
    </div>
  ),
};

export const withClearAction: Story = {
  args: {
    showActions: true,
    showTopBar: false,
    onClear: () => { },
  },
  render: (args) => (
    <div
      style={{
        backgroundColor: '#d3d3d3',
        height: '100px',
        width: '188px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DropdownAction {...args} />
    </div>
  ),
};