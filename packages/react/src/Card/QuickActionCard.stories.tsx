import { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  CalendarIcon,
  FileIcon,
  FolderIcon,
  UserIcon,
} from '@mezzanine-ui/icons';

import { CardGroup, QuickActionCardGeneric as QuickActionCard } from '.';
import type { QuickActionCardComponentProps } from './QuickActionCard';

export default {
  title: 'Data Display/Card/QuickActionCard',
  component: QuickActionCard,
} satisfies Meta<typeof QuickActionCard>;

type Story = StoryObj<QuickActionCardComponentProps>;

export const Playground: Story = {
  argTypes: {
    mode: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    readOnly: {
      control: { type: 'boolean' },
    },
    title: {
      control: { type: 'text' },
    },
    subtitle: {
      control: { type: 'text' },
    },
  },
  args: {
    icon: CalendarIcon,
    mode: 'horizontal',
    title: 'Quick Action',
    subtitle: 'Click to perform action',
    disabled: false,
    readOnly: false,
  },
  render: (props) => (
    <div style={{ width: '280px' }}>
      <QuickActionCard {...props} />
    </div>
  ),
};

export const ModeHorizontal: Story = {
  name: 'Mode: Horizontal',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '280px',
      }}
    >
      <QuickActionCard
        icon={CalendarIcon}
        subtitle="Set up a new meeting"
        title="Schedule Meeting"
      />
      <QuickActionCard
        icon={FileIcon}
        subtitle="Start a new document"
        title="Create Document"
      />
      <QuickActionCard icon={UserIcon} title="Add Contact" />
    </div>
  ),
};

export const ModeVertical: Story = {
  name: 'Mode: Vertical',
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ width: '160px' }}>
        <QuickActionCard
          icon={CalendarIcon}
          mode="vertical"
          subtitle="View schedule"
          title="Calendar"
        />
      </div>
      <div style={{ width: '160px' }}>
        <QuickActionCard
          icon={FolderIcon}
          mode="vertical"
          subtitle="Browse files"
          title="Files"
        />
      </div>
      <div style={{ width: '160px' }}>
        <QuickActionCard icon={FileIcon} mode="vertical" title="Settings" />
      </div>
    </div>
  ),
};

export const States: Story = {
  name: 'States',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '280px',
      }}
    >
      <QuickActionCard
        icon={CalendarIcon}
        subtitle="Interactive card"
        title="Default State"
      />
      <QuickActionCard
        disabled
        icon={CalendarIcon}
        subtitle="Non-interactive"
        title="Disabled State"
      />
      <QuickActionCard
        icon={CalendarIcon}
        readOnly
        subtitle="View only"
        title="Read Only State"
      />
    </div>
  ),
};

export const AsLink: Story = {
  name: 'As Link',
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ width: '280px' }}>
        <QuickActionCard<'a'>
          component="a"
          href="https://rytass.com/"
          icon={FileIcon}
          subtitle="Opens in new tab"
          target="_blank"
          title="External Link"
        />
      </div>
    </div>
  ),
};

export const InCardGroup: Story = {
  name: 'Card Group',
  render: () => (
    <CardGroup>
      <QuickActionCard
        icon={CalendarIcon}
        subtitle="View your schedule"
        title="Calendar"
      />
      <QuickActionCard
        icon={FileIcon}
        subtitle="Browse files"
        title="Documents"
      />
      <QuickActionCard
        icon={UserIcon}
        subtitle="Manage contacts"
        title="Contacts"
      />
    </CardGroup>
  ),
};
