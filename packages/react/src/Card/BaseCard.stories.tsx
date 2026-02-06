import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';

import BaseCard, { CardGroup } from '.';
import type { BaseCardComponentProps } from './BaseCard';

export default {
  title: 'Data Display/Card/BaseCard',
  component: BaseCard,
} satisfies Meta<typeof BaseCard>;

type Story = StoryObj<BaseCardComponentProps>;

const dropdownOptions = [
  { id: 'edit', name: 'Edit' },
  { id: 'duplicate', name: 'Duplicate' },
  { id: 'archive', name: 'Archive' },
  { id: 'delete', name: 'Delete', validate: 'danger' as const },
];

export const Playground: Story = {
  argTypes: {
    type: {
      options: ['default', 'action', 'overflow', 'toggle'],
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
    description: {
      control: { type: 'text' },
    },
  },
  args: {
    type: 'default',
    title: 'Card Title',
    description: 'Card description text goes here',
    disabled: false,
    readOnly: false,
    children: 'This is the card content area. You can put any content here.',
  },
  render: (props) => (
    <div style={{ width: '320px' }}>
      <BaseCard {...props} />
    </div>
  ),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  render: () => (
    <div style={{ width: '320px' }}>
      <BaseCard
        description="A simple card with no header action"
        title="Default Card"
        type="default"
      >
        The default type shows only the title and description without any action
        element in the header.
      </BaseCard>
    </div>
  ),
};

export const TypeAction: Story = {
  name: 'Type: Action',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '320px' }}>
        <BaseCard
          actionName="Edit"
          description="Card with a text-link action button"
          onActionClick={() => alert('Edit clicked!')}
          title="Action Card"
          type="action"
        >
          Click the Edit button in the header to trigger an action.
        </BaseCard>
      </div>

      <div style={{ width: '320px' }}>
        <BaseCard
          actionName="Delete"
          actionVariant="destructive-text-link"
          description="Card with a destructive action"
          onActionClick={() => alert('Delete clicked!')}
          title="Destructive Action"
          type="action"
        >
          The action button can use destructive-text-link variant.
        </BaseCard>
      </div>
    </div>
  ),
};

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  render: () => (
    <div style={{ width: '320px' }}>
      <BaseCard
        description="Card with a dropdown menu"
        onOptionSelect={(option) => alert(`Selected: ${option.name}`)}
        options={dropdownOptions}
        title="Overflow Card"
        type="overflow"
      >
        Click the three-dot icon to see more options in a dropdown menu.
      </BaseCard>
    </div>
  ),
};

export const TypeToggle: Story = {
  name: 'Type: Toggle',
  render: function ToggleCard() {
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '320px' }}>
          <BaseCard
            checked={checked}
            description="Card with a toggle switch"
            onToggleChange={(e) => setChecked(e.target.checked)}
            title="Toggle Card"
            type="toggle"
          >
            Toggle is currently: <strong>{checked ? 'ON' : 'OFF'}</strong>
          </BaseCard>
        </div>

        <div style={{ width: '320px' }}>
          <BaseCard
            defaultChecked
            description="Toggle with label"
            title="Toggle with Label"
            toggleLabel="Enabled"
            type="toggle"
          >
            The toggle can have its own label and supporting text.
          </BaseCard>
        </div>
      </div>
    );
  },
};

export const WithCardGroup: Story = {
  name: 'Card Group',
  render: function CardGroupExample() {
    const [feature1, setFeature1] = useState(true);
    const [feature2, setFeature2] = useState(false);

    return (
      <div style={{ width: '100%' }}>
        <CardGroup>
          <BaseCard
            description="Basic settings and preferences"
            onActionClick={() => alert('Configure clicked!')}
            actionName="Configure"
            title="Settings"
            type="action"
          >
            Manage your account settings and preferences.
          </BaseCard>

          <BaseCard
            checked={feature1}
            description="Toggle this feature on or off"
            onToggleChange={(e) => setFeature1(e.target.checked)}
            title="Feature A"
            type="toggle"
          >
            Feature A is {feature1 ? 'enabled' : 'disabled'}.
          </BaseCard>

          <BaseCard
            checked={feature2}
            description="Another toggleable feature"
            onToggleChange={(e) => setFeature2(e.target.checked)}
            title="Feature B"
            type="toggle"
          >
            Feature B is {feature2 ? 'enabled' : 'disabled'}.
          </BaseCard>

          <BaseCard
            description="More options available"
            onOptionSelect={(option) => alert(`Selected: ${option.name}`)}
            options={dropdownOptions}
            title="Advanced"
            type="overflow"
          >
            Access advanced options through the menu.
          </BaseCard>
        </CardGroup>
      </div>
    );
  },
};

export const States: Story = {
  name: 'States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0 }}>Normal</h4>
      <div style={{ width: '320px' }}>
        <BaseCard
          actionName="Action"
          description="Normal interactive card"
          title="Normal Card"
          type="action"
        >
          This card is fully interactive.
        </BaseCard>
      </div>

      <h4 style={{ margin: 0 }}>Disabled</h4>
      <div style={{ width: '320px' }}>
        <BaseCard
          actionName="Action"
          description="This card is disabled"
          disabled
          title="Disabled Card"
          type="action"
        >
          The card and its action are disabled.
        </BaseCard>
      </div>

      <h4 style={{ margin: 0 }}>Read Only</h4>
      <div style={{ width: '320px' }}>
        <BaseCard
          actionName="Action"
          description="This card is read-only"
          readOnly
          title="Read Only Card"
          type="action"
        >
          The card cannot be interacted with.
        </BaseCard>
      </div>
    </div>
  ),
};

export const AsLink: Story = {
  name: 'As Link',
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div style={{ width: '280px' }}>
        <BaseCard<'a'>
          component="a"
          description="Click anywhere to navigate"
          href="https://rytass.com/"
          target="_blank"
          title="Link Card"
          type="default"
        >
          This entire card is a clickable link.
        </BaseCard>
      </div>

      <div style={{ width: '280px' }}>
        <BaseCard<'a'>
          actionName="Details"
          component="a"
          description="Has both link and action"
          href="https://rytass.com/"
          onActionClick={(e) => {
            e.preventDefault();
            alert('Action clicked, navigation prevented');
          }}
          target="_blank"
          title="Link with Action"
          type="action"
        >
          Card is a link, but action button has separate behavior.
        </BaseCard>
      </div>
    </div>
  ),
};

export const NoHeaderContent: Story = {
  name: 'No Header Content',
  render: function NoHeaderExample() {
    return (
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ width: '280px' }}>
          <BaseCard type="default">
            This card has no title or description, so the header is completely
            hidden.
          </BaseCard>
        </div>
      </div>
    );
  },
};
