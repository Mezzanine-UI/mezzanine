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
        <mzn-quick-action-card
          [icon]="icon"
          [mode]="mode"
          [title]="title"
          [subtitle]="subtitle"
          [disabled]="disabled"
          [readOnly]="readOnly"
        />
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
        <mzn-quick-action-card
          [icon]="calendarIcon"
          subtitle="Set up a new meeting"
          title="Schedule Meeting"
        />
        <mzn-quick-action-card
          [icon]="fileIcon"
          subtitle="Start a new document"
          title="Create Document"
        />
        <mzn-quick-action-card [icon]="userIcon" title="Add Contact" />
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
          <mzn-quick-action-card
            [icon]="calendarIcon"
            mode="vertical"
            subtitle="View schedule"
            title="Calendar"
          />
        </div>
        <div style="width: 160px;">
          <mzn-quick-action-card
            [icon]="folderIcon"
            mode="vertical"
            subtitle="Browse files"
            title="Files"
          />
        </div>
        <div style="width: 160px;">
          <mzn-quick-action-card [icon]="fileIcon" mode="vertical" title="Settings" />
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
        <mzn-quick-action-card
          [icon]="calendarIcon"
          subtitle="Interactive card"
          title="Default State"
        />
        <mzn-quick-action-card
          [disabled]="true"
          [icon]="calendarIcon"
          subtitle="Non-interactive"
          title="Disabled State"
        />
        <mzn-quick-action-card
          [icon]="calendarIcon"
          [readOnly]="true"
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
    props: { fileIcon: FileIcon },
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="width: 280px;">
          <mzn-quick-action-card
            [icon]="fileIcon"
            subtitle="Opens in new tab"
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
    props: {
      calendarIcon: CalendarIcon,
      fileIcon: FileIcon,
      userIcon: UserIcon,
    },
    template: `
      <mzn-card-group>
        <mzn-quick-action-card
          [icon]="calendarIcon"
          subtitle="View your schedule"
          title="Calendar"
        />
        <mzn-quick-action-card
          [icon]="fileIcon"
          subtitle="Browse files"
          title="Documents"
        />
        <mzn-quick-action-card
          [icon]="userIcon"
          subtitle="Manage contacts"
          title="Contacts"
        />
      </mzn-card-group>
    `,
  }),
};
