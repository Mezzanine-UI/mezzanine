import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
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
        <div mznBaseCard
          [title]="title"
          [description]="description"
          [disabled]="disabled"
          [readOnly]="readOnly"
        >
          This is the card content area. You can put any content here.
        </div>
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
        <div mznBaseCard title="Default Card" description="A simple card with no header action">
          The default type shows only the title and description without any action element in the header.
        </div>
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
          <div mznBaseCard
            title="Action Card"
            description="Card with a text-link action button"
            type="action"
            actionName="Edit"
          >
            Click the Edit button in the header to trigger an action.
          </div>
        </div>
        <div style="width: 320px;">
          <div mznBaseCard
            title="Destructive Action"
            description="Card with a destructive action"
            type="action"
            actionName="Delete"
            actionVariant="destructive-text-link"
          >
            The action button can use destructive-text-link variant.
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: '[mznBaseCardTypeOverflowDemo]',
  standalone: true,
  imports: [MznBaseCard],
  host: { style: 'width: 320px; display: block;' },
  template: `
    <div
      mznBaseCard
      title="Overflow Card"
      description="Card with a dropdown menu"
      type="overflow"
      [options]="dropdownOptions"
      (optionSelect)="onOptionSelect($event)"
    >
      Click the three-dot icon to see more options in a dropdown menu.
    </div>
  `,
})
class BaseCardTypeOverflowDemoComponent {
  readonly dropdownOptions: ReadonlyArray<DropdownOption> = [
    { id: 'edit', name: 'Edit' },
    { id: 'duplicate', name: 'Duplicate' },
    { id: 'archive', name: 'Archive' },
    { id: 'delete', name: 'Delete', validate: 'danger' },
  ];

  onOptionSelect(option: DropdownOption): void {
    alert(`Selected: ${option.name}`);
  }
}

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [BaseCardTypeOverflowDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznBaseCardTypeOverflowDemo></div>`,
  }),
};

@Component({
  selector: '[mznBaseCardTypeToggleDemo]',
  standalone: true,
  imports: [MznBaseCard],
  host: { style: 'display: flex; flex-direction: column; gap: 16px;' },
  template: `
    <div style="width: 320px;">
      <div
        mznBaseCard
        title="Toggle Card"
        description="Card with a toggle switch"
        type="toggle"
        [checked]="checked()"
        (toggleChange)="checked.set($event)"
      >
        Toggle is currently: <strong>{{ checked() ? 'ON' : 'OFF' }}</strong>
      </div>
    </div>
    <div style="width: 320px;">
      <div
        mznBaseCard
        title="Toggle with Label"
        description="Toggle with label"
        type="toggle"
        toggleLabel="Enabled"
        [defaultChecked]="true"
      >
        The toggle can have its own label and supporting text.
      </div>
    </div>
  `,
})
class BaseCardTypeToggleDemoComponent {
  readonly checked = signal(false);
}

export const TypeToggle: Story = {
  name: 'Type: Toggle',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [BaseCardTypeToggleDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznBaseCardTypeToggleDemo></div>`,
  }),
};

@Component({
  selector: '[mznBaseCardCardGroupDemo]',
  standalone: true,
  imports: [MznBaseCard, MznCardGroup],
  host: { style: 'width: 100%; display: block;' },
  template: `
    <div mznCardGroup>
      <div
        mznBaseCard
        description="Basic settings and preferences"
        title="Settings"
        type="action"
        actionName="Configure"
        (actionClick)="onConfigureClick()"
      >
        Manage your account settings and preferences.
      </div>
      <div
        mznBaseCard
        description="Toggle this feature on or off"
        title="Feature A"
        type="toggle"
        [checked]="feature1()"
        (toggleChange)="feature1.set($event)"
      >
        Feature A is
        <ng-container>{{ feature1() ? 'enabled' : 'disabled' }}</ng-container
        >.
      </div>
      <div
        mznBaseCard
        description="Another toggleable feature"
        title="Feature B"
        type="toggle"
        [checked]="feature2()"
        (toggleChange)="feature2.set($event)"
      >
        Feature B is
        <ng-container>{{ feature2() ? 'enabled' : 'disabled' }}</ng-container
        >.
      </div>
      <div
        mznBaseCard
        description="More options available"
        title="Advanced"
        type="overflow"
        [options]="dropdownOptions"
        (optionSelect)="onOptionSelect($event)"
      >
        Access advanced options through the menu.
      </div>
    </div>
  `,
})
class BaseCardCardGroupDemoComponent {
  readonly feature1 = signal(true);
  readonly feature2 = signal(false);
  readonly dropdownOptions: ReadonlyArray<DropdownOption> = [
    { id: 'edit', name: 'Edit' },
    { id: 'duplicate', name: 'Duplicate' },
    { id: 'archive', name: 'Archive' },
    { id: 'delete', name: 'Delete', validate: 'danger' },
  ];

  onConfigureClick(): void {
    alert('Configure clicked!');
  }

  onOptionSelect(option: DropdownOption): void {
    alert(`Selected: ${option.name}`);
  }
}

export const WithCardGroup: Story = {
  name: 'Card Group',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [BaseCardCardGroupDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznBaseCardCardGroupDemo></div>
    `,
  }),
};

export const States: Story = {
  name: 'States',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h4 style="margin: 0;">Normal</h4>
        <div style="width: 320px;">
          <div
            mznBaseCard
            title="Normal Card"
            description="Normal interactive card"
            type="action"
            actionName="Action"
          >
            This card is fully interactive.
          </div>
        </div>

        <h4 style="margin: 0;">Disabled</h4>
        <div style="width: 320px;">
          <div
            mznBaseCard
            title="Disabled Card"
            description="This card is disabled"
            type="action"
            actionName="Action"
            [disabled]="true"
          >
            The card and its action are disabled.
          </div>
        </div>

        <h4 style="margin: 0;">Read Only</h4>
        <div style="width: 320px;">
          <div
            mznBaseCard
            title="Read Only Card"
            description="This card is read-only"
            type="action"
            actionName="Action"
            [readOnly]="true"
          >
            The card cannot be interacted with.
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: '[mznBaseCardAsLinkDemo]',
  standalone: true,
  imports: [MznBaseCard],
  host: { style: 'display: flex; gap: 16px;' },
  template: `
    <div style="width: 280px;">
      <a
        mznBaseCard
        href="https://rytass.com/"
        target="_blank"
        title="Link Card"
        description="Click anywhere to navigate"
        type="default"
      >
        This entire card is a clickable link.
      </a>
    </div>

    <div style="width: 280px;">
      <a
        mznBaseCard
        href="https://rytass.com/"
        target="_blank"
        title="Link with Action"
        description="Has both link and action"
        type="action"
        actionName="Details"
        (actionClick)="onActionClick($event)"
      >
        Card is a link, but action button has separate behavior.
      </a>
    </div>
  `,
})
class BaseCardAsLinkDemoComponent {
  onActionClick(event: MouseEvent): void {
    event.preventDefault();
    alert('Action clicked, navigation prevented');
  }
}

export const AsLink: Story = {
  name: 'As Link',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [BaseCardAsLinkDemoComponent],
    }),
  ],
  render: () => ({
    template: `<div mznBaseCardAsLinkDemo></div>`,
  }),
};

export const NoHeaderContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width: 280px;">
        <div mznBaseCard>
          This card has no title or description, so the header is completely hidden.
        </div>
      </div>
    `,
  }),
};
