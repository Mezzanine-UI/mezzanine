import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznDropdownAction } from './dropdown-action.component';

export default {
  title: 'Internal/Dropdown/DropdownAction',
  decorators: [
    moduleMetadata({
      imports: [MznDropdownAction],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    showActions: {
      control: { type: 'boolean' },
      description: 'Whether to show the action area.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showTopBar: {
      control: { type: 'boolean' },
      description: 'Whether to show the top bar separator.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    mode: {
      options: ['default', 'clear'],
      control: { type: 'select' },
      description: 'Action mode.',
      table: {
        type: { summary: "'default' | 'clear'" },
        defaultValue: { summary: "'default'" },
      },
    },
    cancelText: {
      control: { type: 'text' },
      description: 'Cancel button text.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Cancel'" },
      },
    },
    confirmText: {
      control: { type: 'text' },
      description: 'Confirm button text.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Confirm'" },
      },
    },
  },
  args: {
    showActions: true,
    showTopBar: false,
    mode: 'default',
    cancelText: '',
    confirmText: '',
  },
  render: (args) => ({
    props: {
      ...args,
      onCancel(): void {
        console.log('cancel');
      },
      onConfirm(): void {
        console.log('confirm');
      },
    },
    template: `
      <div style="background-color: #d3d3d3; height: 100px; width: 188px; display: flex; align-items: center;">
        <div mznDropdownAction
          [showActions]="showActions"
          [showTopBar]="showTopBar"
          [mode]="mode"
          [cancelText]="cancelText || undefined"
          [confirmText]="confirmText || undefined"
          (cancelled)="onCancel()"
          (confirmed)="onConfirm()"
        ></div>
      </div>
    `,
  }),
};

export const withCustomAction: Story = {
  render: () => ({
    props: {
      onClick(): void {
        console.log('custom action clicked');
      },
    },
    template: `
      <div style="background-color: #d3d3d3; height: 100px; width: 188px; display: flex; align-items: center;">
        <div mznDropdownAction
          [showActions]="true"
          (confirmed)="onClick()"
        ></div>
      </div>
    `,
  }),
};

export const withClearAction: Story = {
  render: () => ({
    props: {
      onClear(): void {
        console.log('clear');
      },
    },
    template: `
      <div style="background-color: #d3d3d3; height: 100px; width: 188px; display: flex; align-items: center;">
        <div mznDropdownAction
          [showActions]="true"
          mode="clear"
          (cleared)="onClear()"
        ></div>
      </div>
    `,
  }),
};
