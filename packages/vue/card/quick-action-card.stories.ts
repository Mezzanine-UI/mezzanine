import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  CalendarIcon,
  FileIcon,
  FolderIcon,
  UserIcon,
} from '@mezzanine-ui/icons';
import MznCardGroup from './card-group.vue';
import MznQuickActionCard from './quick-action-card.vue';

export default {
  title: 'Data Display/Card/QuickActionCard',
  component: MznQuickActionCard,
} satisfies Meta<typeof MznQuickActionCard>;

type Story = StoryObj<typeof MznQuickActionCard>;

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
  render: (args) => ({
    components: { MznQuickActionCard },
    setup: () => ({ args }),
    template: `
      <div style="width: 280px">
        <MznQuickActionCard v-bind="args" />
      </div>
    `,
  }),
};

export const ModeHorizontal: Story = {
  name: 'Mode: Horizontal',
  render: () => ({
    components: { MznQuickActionCard },
    setup: () => ({ CalendarIcon, FileIcon, UserIcon }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 280px">
        <MznQuickActionCard
          :icon="CalendarIcon"
          subtitle="Set up a new meeting"
          title="Schedule Meeting"
        />
        <MznQuickActionCard
          :icon="FileIcon"
          subtitle="Start a new document"
          title="Create Document"
        />
        <MznQuickActionCard :icon="UserIcon" title="Add Contact" />
      </div>
    `,
  }),
};

export const ModeVertical: Story = {
  name: 'Mode: Vertical',
  render: () => ({
    components: { MznQuickActionCard },
    setup: () => ({ CalendarIcon, FileIcon, FolderIcon }),
    template: `
      <div style="display: flex; gap: 16px">
        <div style="width: 160px">
          <MznQuickActionCard
            :icon="CalendarIcon"
            mode="vertical"
            subtitle="View schedule"
            title="Calendar"
          />
        </div>
        <div style="width: 160px">
          <MznQuickActionCard
            :icon="FolderIcon"
            mode="vertical"
            subtitle="Browse files"
            title="Files"
          />
        </div>
        <div style="width: 160px">
          <MznQuickActionCard :icon="FileIcon" mode="vertical" title="Settings" />
        </div>
      </div>
    `,
  }),
};

export const States: Story = {
  name: 'States',
  render: () => ({
    components: { MznQuickActionCard },
    setup: () => ({ CalendarIcon }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 280px">
        <MznQuickActionCard
          :icon="CalendarIcon"
          subtitle="Interactive card"
          title="Default State"
        />
        <MznQuickActionCard
          disabled
          :icon="CalendarIcon"
          subtitle="Non-interactive"
          title="Disabled State"
        />
        <MznQuickActionCard
          :icon="CalendarIcon"
          read-only
          subtitle="View only"
          title="Read Only State"
        />
      </div>
    `,
  }),
};

export const AsLink: Story = {
  name: 'As Link',
  render: () => ({
    components: { MznQuickActionCard },
    setup: () => ({ FileIcon }),
    template: `
      <div style="display: flex; gap: 16px">
        <div style="width: 280px">
          <MznQuickActionCard
            component="a"
            href="https://rytass.com/"
            :icon="FileIcon"
            subtitle="Opens in new tab"
            target="_blank"
            title="External Link"
          />
        </div>
      </div>
    `,
  }),
};

export const InCardGroup: Story = {
  name: 'Card Group',
  render: () => ({
    components: { MznCardGroup, MznQuickActionCard },
    setup: () => ({ CalendarIcon, FileIcon, UserIcon }),
    template: `
      <MznCardGroup>
        <MznQuickActionCard
          :icon="CalendarIcon"
          subtitle="View your schedule"
          title="Calendar"
        />
        <MznQuickActionCard
          :icon="FileIcon"
          subtitle="Browse files"
          title="Documents"
        />
        <MznQuickActionCard
          :icon="UserIcon"
          subtitle="Manage contacts"
          title="Contacts"
        />
      </MznCardGroup>
    `,
  }),
};
