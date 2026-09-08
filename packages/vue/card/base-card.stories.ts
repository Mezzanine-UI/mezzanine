import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import type { FunctionalComponent } from 'vue';
import MznBaseCard from './base-card.vue';
import MznCardGroup from './card-group.vue';

export default {
  title: 'Data Display/Card/BaseCard',
  component: MznBaseCard,
} satisfies Meta<typeof MznBaseCard>;

type Story = StoryObj<typeof MznBaseCard>;

const dropdownOptions = [
  { id: 'edit', name: 'Edit' },
  { id: 'duplicate', name: 'Duplicate' },
  { id: 'archive', name: 'Archive' },
  { id: 'delete', name: 'Delete', validate: 'danger' as const },
];

/**
 * React renders `A{value}B` as separate text nodes; a Vue template merges the
 * text and the interpolations into one, so the parts are handed over as an
 * array.
 */
const TextParts: FunctionalComponent<{ parts: (number | string)[] }> = (
  props,
) => props.parts.map((part) => String(part));

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
  } as Story['args'],
  render: (args) => ({
    components: { MznBaseCard },
    setup: () => ({ args }),
    template: `
      <div style="width: 320px">
        <MznBaseCard v-bind="args">{{ args.children }}</MznBaseCard>
      </div>
    `,
  }),
};

export const TypeDefault: Story = {
  name: 'Type: Default',
  render: () => ({
    components: { MznBaseCard },
    template: `
      <div style="width: 320px">
        <MznBaseCard
          description="A simple card with no header action"
          title="Default Card"
          type="default"
        >The default type shows only the title and description without any action
        element in the header.</MznBaseCard>
      </div>
    `,
  }),
};

export const TypeAction: Story = {
  name: 'Type: Action',
  render: () => ({
    components: { MznBaseCard },
    setup: () => ({
      onDeleteClick: (): void => {
        alert('Delete clicked!');
      },
      onEditClick: (): void => {
        alert('Edit clicked!');
      },
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px">
        <div style="width: 320px">
          <MznBaseCard
            action-name="Edit"
            description="Card with a text-link action button"
            title="Action Card"
            type="action"
            @action-click="onEditClick"
          >Click the Edit button in the header to trigger an action.</MznBaseCard>
        </div>

        <div style="width: 320px">
          <MznBaseCard
            action-name="Delete"
            action-variant="destructive-text-link"
            description="Card with a destructive action"
            title="Destructive Action"
            type="action"
            @action-click="onDeleteClick"
          >The action button can use destructive-text-link variant.</MznBaseCard>
        </div>
      </div>
    `,
  }),
};

export const TypeOverflow: Story = {
  name: 'Type: Overflow',
  render: () => ({
    components: { MznBaseCard },
    setup: () => ({
      dropdownOptions,
      onOptionSelect: (option: { name: string }): void => {
        alert(`Selected: ${option.name}`);
      },
    }),
    template: `
      <div style="width: 320px">
        <MznBaseCard
          description="Card with a dropdown menu"
          :options="dropdownOptions"
          title="Overflow Card"
          type="overflow"
          @option-select="onOptionSelect"
        >Click the three-dot icon to see more options in a dropdown menu.</MznBaseCard>
      </div>
    `,
  }),
};

export const TypeToggle: Story = {
  name: 'Type: Toggle',
  render: () => ({
    components: { MznBaseCard },
    setup: () => {
      const checked = ref(false);

      return {
        checked,
        onToggleChange: (event: Event): void => {
          checked.value = (event.target as HTMLInputElement).checked;
        },
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px">
        <div style="width: 320px">
          <MznBaseCard
            :checked="checked"
            description="Card with a toggle switch"
            title="Toggle Card"
            type="toggle"
            @toggle-change="onToggleChange"
          >Toggle is currently: <strong>{{ checked ? 'ON' : 'OFF' }}</strong></MznBaseCard>
        </div>

        <div style="width: 320px">
          <MznBaseCard
            default-checked
            description="Toggle with label"
            title="Toggle with Label"
            toggle-label="Enabled"
            type="toggle"
          >The toggle can have its own label and supporting text.</MznBaseCard>
        </div>
      </div>
    `,
  }),
};

export const WithCardGroup: Story = {
  name: 'Card Group',
  render: () => ({
    components: { MznBaseCard, MznCardGroup, TextParts },
    setup: () => {
      const feature1 = ref(true);
      const feature2 = ref(false);

      return {
        dropdownOptions,
        feature1,
        feature2,
        onConfigureClick: (): void => {
          alert('Configure clicked!');
        },
        onFeature1Change: (event: Event): void => {
          feature1.value = (event.target as HTMLInputElement).checked;
        },
        onFeature2Change: (event: Event): void => {
          feature2.value = (event.target as HTMLInputElement).checked;
        },
        onOptionSelect: (option: { name: string }): void => {
          alert(`Selected: ${option.name}`);
        },
      };
    },
    template: `
      <div style="width: 100%">
        <MznCardGroup>
          <MznBaseCard
            description="Basic settings and preferences"
            action-name="Configure"
            title="Settings"
            type="action"
            @action-click="onConfigureClick"
          >Manage your account settings and preferences.</MznBaseCard>

          <MznBaseCard
            :checked="feature1"
            description="Toggle this feature on or off"
            title="Feature A"
            type="toggle"
            @toggle-change="onFeature1Change"
          ><TextParts :parts="['Feature A is ', feature1 ? 'enabled' : 'disabled', '.']" /></MznBaseCard>

          <MznBaseCard
            :checked="feature2"
            description="Another toggleable feature"
            title="Feature B"
            type="toggle"
            @toggle-change="onFeature2Change"
          ><TextParts :parts="['Feature B is ', feature2 ? 'enabled' : 'disabled', '.']" /></MznBaseCard>

          <MznBaseCard
            description="More options available"
            :options="dropdownOptions"
            title="Advanced"
            type="overflow"
            @option-select="onOptionSelect"
          >Access advanced options through the menu.</MznBaseCard>
        </MznCardGroup>
      </div>
    `,
  }),
};

export const States: Story = {
  name: 'States',
  render: () => ({
    components: { MznBaseCard },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px">
        <h4 style="margin: 0">Normal</h4>
        <div style="width: 320px">
          <MznBaseCard
            action-name="Action"
            description="Normal interactive card"
            title="Normal Card"
            type="action"
          >This card is fully interactive.</MznBaseCard>
        </div>

        <h4 style="margin: 0">Disabled</h4>
        <div style="width: 320px">
          <MznBaseCard
            action-name="Action"
            description="This card is disabled"
            disabled
            title="Disabled Card"
            type="action"
          >The card and its action are disabled.</MznBaseCard>
        </div>

        <h4 style="margin: 0">Read Only</h4>
        <div style="width: 320px">
          <MznBaseCard
            action-name="Action"
            description="This card is read-only"
            read-only
            title="Read Only Card"
            type="action"
          >The card cannot be interacted with.</MznBaseCard>
        </div>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  name: 'As Link',
  render: () => ({
    components: { MznBaseCard },
    setup: () => ({
      onActionClick: (event: MouseEvent): void => {
        event.preventDefault();
        alert('Action clicked, navigation prevented');
      },
    }),
    template: `
      <div style="display: flex; gap: 16px">
        <div style="width: 280px">
          <MznBaseCard
            component="a"
            description="Click anywhere to navigate"
            href="https://rytass.com/"
            target="_blank"
            title="Link Card"
            type="default"
          >This entire card is a clickable link.</MznBaseCard>
        </div>

        <div style="width: 280px">
          <MznBaseCard
            action-name="Details"
            component="a"
            description="Has both link and action"
            href="https://rytass.com/"
            target="_blank"
            title="Link with Action"
            type="action"
            @action-click="onActionClick"
          >Card is a link, but action button has separate behavior.</MznBaseCard>
        </div>
      </div>
    `,
  }),
};

export const NoHeaderContent: Story = {
  name: 'No Header Content',
  render: () => ({
    components: { MznBaseCard },
    template: `
      <div style="display: flex; gap: 16px">
        <div style="width: 280px">
          <MznBaseCard type="default">This card has no title or description, so the header is completely
          hidden.</MznBaseCard>
        </div>
      </div>
    `,
  }),
};
