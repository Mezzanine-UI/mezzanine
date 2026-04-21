import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  CalendarIcon,
  FileIcon,
  FolderIcon,
  UserIcon,
} from '@mezzanine-ui/icons';
import { MznQuickActionCard } from './quick-action-card.component';
import { MznCardGroup } from './card-group.component';

export default {
  title: 'Data Display/Card/QuickActionCard',
  decorators: [
    moduleMetadata({
      imports: [MznQuickActionCard, MznCardGroup],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

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
    mode: 'horizontal',
    title: 'Quick Action',
    subtitle: 'Click to perform action',
    disabled: false,
    readOnly: false,
  },
  render: (args) => ({
    props: {
      ...args,
      icon: CalendarIcon,
    },
    template: `
      <div style="width: 280px;">
        <button mznQuickActionCard
          [icon]="icon"
          [mode]="mode"
          [title]="title"
          [subtitle]="subtitle"
          [disabled]="disabled"
          [readOnly]="readOnly"
        ></button>
      </div>
    `,
  }),
};

export const ModeHorizontal: Story = {
  name: 'Mode: Horizontal',
  render: () => ({
    props: {
      calendarIcon: CalendarIcon,
      fileIcon: FileIcon,
      userIcon: UserIcon,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 280px;">
        <button mznQuickActionCard
          [icon]="calendarIcon"
          subtitle="Set up a new meeting"
          title="Schedule Meeting"
        ></button>
        <button mznQuickActionCard
          [icon]="fileIcon"
          subtitle="Start a new document"
          title="Create Document"
        ></button>
        <button mznQuickActionCard [icon]="userIcon" title="Add Contact" ></button>
      </div>
    `,
  }),
};

export const ModeVertical: Story = {
  name: 'Mode: Vertical',
  render: () => ({
    props: {
      calendarIcon: CalendarIcon,
      folderIcon: FolderIcon,
      fileIcon: FileIcon,
    },
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="width: 160px;">
          <button mznQuickActionCard
            [icon]="calendarIcon"
            mode="vertical"
            subtitle="View schedule"
            title="Calendar"
          ></button>
        </div>
        <div style="width: 160px;">
          <button mznQuickActionCard
            [icon]="folderIcon"
            mode="vertical"
            subtitle="Browse files"
            title="Files"
          ></button>
        </div>
        <div style="width: 160px;">
          <button mznQuickActionCard [icon]="fileIcon" mode="vertical" title="Settings" ></button>
        </div>
      </div>
    `,
  }),
};

export const States: Story = {
  name: 'States',
  render: () => ({
    props: { calendarIcon: CalendarIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 280px;">
        <button mznQuickActionCard
          [icon]="calendarIcon"
          subtitle="Interactive card"
          title="Default State"
        ></button>
        <button mznQuickActionCard
          [disabled]="true"
          [icon]="calendarIcon"
          subtitle="Non-interactive"
          title="Disabled State"
        ></button>
        <button mznQuickActionCard
          [icon]="calendarIcon"
          [readOnly]="true"
          subtitle="View only"
          title="Read Only State"
        ></button>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  name: 'As Link',
  render: () => ({
    props: { fileIcon: FileIcon },
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="width: 280px;">
          <button mznQuickActionCard
            [icon]="fileIcon"
            subtitle="Opens in new tab"
            title="External Link"
          ></button>
        </div>
      </div>
    `,
  }),
};

export const InCardGroup: Story = {
  name: 'Card Group',
  render: () => ({
    props: {
      calendarIcon: CalendarIcon,
      fileIcon: FileIcon,
      userIcon: UserIcon,
    },
    template: `
      <div mznCardGroup cardType="quick-action">
        <button mznQuickActionCard
          [icon]="calendarIcon"
          subtitle="View your schedule"
          title="Calendar"
        ></button>
        <button mznQuickActionCard
          [icon]="fileIcon"
          subtitle="Browse files"
          title="Documents"
        ></button>
        <button mznQuickActionCard
          [icon]="userIcon"
          subtitle="Manage contacts"
          title="Contacts"
        ></button>
      </div>
    `,
  }),
};
