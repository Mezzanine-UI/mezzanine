import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznBaseCard } from './base-card.component';
import { MznCardGroup } from './card-group.component';

export default {
  title: 'Data Display/Card/BaseCard',
  decorators: [
    moduleMetadata({
      imports: [MznBaseCard, MznCardGroup],
    }),
  ],
  argTypes: {
    description: {
      control: { type: 'text' },
      description: '卡片描述',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否停用',
      table: { defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: { type: 'boolean' },
      description: '是否唯讀',
      table: { defaultValue: { summary: 'false' } },
    },
    title: {
      control: { type: 'text' },
      description: '卡片標題',
    },
    type: {
      options: ['default', 'action', 'overflow', 'toggle'],
      control: { type: 'select' },
      description: '卡片類型',
      table: { defaultValue: { summary: "'default'" } },
    },
  },
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    title: 'Card Title',
    description: 'Card description text goes here',
    disabled: false,
    readOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 320px;">
        <mzn-base-card
          [title]="title"
          [description]="description"
          [disabled]="disabled"
          [readOnly]="readOnly"
        >
          This is the card content area. You can put any content here.
        </mzn-base-card>
      </div>
    `,
  }),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width: 320px;">
        <mzn-base-card title="Default Card" description="A simple card with no header action">
          The default type shows only the title and description without any action element in the header.
        </mzn-base-card>
      </div>
    `,
  }),
};

export const TypeAction: Story = {
  name: 'Type: Action',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="width: 320px;">
          <mzn-base-card
            title="Action Card"
            description="Card with a text-link action button"
            type="action"
            actionName="Edit"
          >
            Click the Edit button in the header to trigger an action.
          </mzn-base-card>
        </div>
        <div style="width: 320px;">
          <mzn-base-card
            title="Destructive Action"
            description="Card with a destructive action"
            type="action"
            actionName="Delete"
            actionVariant="destructive-text-link"
          >
            The action button can use destructive-text-link variant.
          </mzn-base-card>
        </div>
      </div>
    `,
  }),
};

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      dropdownOptions: [
        { id: 'edit', name: 'Edit' },
        { id: 'duplicate', name: 'Duplicate' },
        { id: 'archive', name: 'Archive' },
        { id: 'delete', name: 'Delete' },
      ],
    },
    template: `
      <div style="width: 320px;">
        <mzn-base-card
          title="Overflow Card"
          description="Card with dropdown menu"
          type="overflow"
          [options]="dropdownOptions"
        >
          Click the three-dot icon to see more options in a dropdown menu.
        </mzn-base-card>
      </div>
    `,
  }),
};

export const TypeToggle: Story = {
  name: 'Type: Toggle',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="width: 320px;">
          <mzn-base-card
            title="Toggle Card"
            description="Card with a toggle switch"
            type="toggle"
          >
            Use the toggle in the card header to switch the state.
          </mzn-base-card>
        </div>
        <div style="width: 320px;">
          <mzn-base-card
            title="Toggle with Label"
            description="Toggle with label and supporting text"
            type="toggle"
            toggleLabel="Enabled"
            toggleSupportingText="Turn this feature on or off"
          >
            The toggle can have its own label and supporting text.
          </mzn-base-card>
        </div>
      </div>
    `,
  }),
};

export const WithCardGroup: Story = {
  name: 'Card Group',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width: 100%;">
        <mzn-card-group>
          <mzn-base-card
            description="Basic settings and preferences"
            title="Settings"
            type="action"
            actionName="Configure"
          >
            Manage your account settings and preferences.
          </mzn-base-card>
          <mzn-base-card
            description="Toggle this feature on or off"
            title="Feature A"
            type="toggle"
          >
            Use the toggle to enable or disable this feature.
          </mzn-base-card>
          <mzn-base-card
            description="Another toggleable feature"
            title="Feature B"
            type="toggle"
          >
            Use the toggle to enable or disable this feature.
          </mzn-base-card>
        </mzn-card-group>
      </div>
    `,
  }),
};

export const States: Story = {
  name: 'States',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
        <mzn-base-card title="Normal Card" description="Normal interactive card">
          This card is fully interactive.
        </mzn-base-card>

        <mzn-base-card title="Disabled Card" description="This card is disabled" [disabled]="true">
          The card and its action are disabled.
        </mzn-base-card>

        <mzn-base-card title="Read Only Card" description="This card is read-only" [readOnly]="true">
          The card cannot be interacted with.
        </mzn-base-card>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  name: 'As Link',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px;">
        <div style="width: 280px;">
          <mzn-base-card title="Link Card" description="Click anywhere to navigate">
            This entire card is a clickable link (not implemented in Angular).
          </mzn-base-card>
        </div>
      </div>
    `,
  }),
};

export const NoHeaderContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width: 280px;">
        <mzn-base-card>
          This card has no title or description, so the header is completely hidden.
        </mzn-base-card>
      </div>
    `,
  }),
};
