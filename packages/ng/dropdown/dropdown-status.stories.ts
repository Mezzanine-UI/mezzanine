import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznDropdownStatus } from './dropdown-status.component';
import { FolderIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Internal/Dropdown/DropdownStatus',
  decorators: [
    moduleMetadata({
      imports: [MznDropdownStatus],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    status: {
      options: ['loading', 'empty'],
      control: { type: 'select' },
      description: 'The status of the dropdown.',
      table: {
        type: { summary: "'loading' | 'empty'" },
        defaultValue: { summary: '-' },
      },
    },
    loadingText: {
      control: { type: 'text' },
      description: 'The text shown during loading.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Loading...'" },
      },
    },
    emptyText: {
      control: { type: 'text' },
      description: 'The text shown when empty.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'No matching options.'" },
      },
    },
  },
  args: {
    status: 'loading',
    loadingText: 'Loading...',
    emptyText: 'No matching options.',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 20px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px; display: flex; align-items: center; justify-content: center;">
        <div mznDropdownStatus
          [status]="status"
          [loadingText]="loadingText"
          [emptyText]="emptyText"
        ></div>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px; display: flex; align-items: center; justify-content: center;">
        <div mznDropdownStatus status="loading" loadingText="搜尋中..." ></div>
      </div>
    `,
  }),
};

export const Empty: Story = {
  render: () => ({
    props: { emptyIcon: FolderIcon },
    template: `
      <div style="padding: 20px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px; display: flex; align-items: center; justify-content: center;">
        <div mznDropdownStatus status="empty" [emptyIcon]="emptyIcon" emptyText="找不到任何選項。" ></div>
      </div>
    `,
  }),
};
