import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { PlusIcon } from '@mezzanine-ui/icons';
import type { ButtonGroupOrientation } from '@mezzanine-ui/core/button';
import MznButton from './button.vue';
import MznButtonGroup from './button-group.vue';
import type { ButtonGroupProps } from './button-group.types';

export default {
  title: 'Foundation/Button/ButtonGroup',
  component: MznButtonGroup,
} satisfies Meta<typeof MznButtonGroup>;

type Story = StoryObj<ButtonGroupProps>;

const orientations: ButtonGroupOrientation[] = ['horizontal', 'vertical'];

export const Playground: Story = {
  argTypes: {
    orientation: {
      options: orientations,
      control: {
        type: 'select',
      },
    },
  },
  args: {
    orientation: 'horizontal',
  },
  render: (args) => ({
    components: { MznButton, MznButtonGroup },
    setup: () => ({ args }),
    template: `
      <MznButtonGroup variant="base-primary" size="main" :orientation="args.orientation">
        <MznButton>One</MznButton>
        <MznButton>Two</MznButton>
        <MznButton>Three</MznButton>
      </MznButtonGroup>
      <br />
      <br />
      <MznButtonGroup variant="base-secondary" size="sub" :orientation="args.orientation">
        <MznButton>One</MznButton>
        <MznButton>Two</MznButton>
        <MznButton>Three</MznButton>
      </MznButtonGroup>
      <br />
      <br />
      <MznButtonGroup variant="destructive-primary" size="minor" :orientation="args.orientation">
        <MznButton>One</MznButton>
        <MznButton>Two</MznButton>
        <MznButton>Three</MznButton>
      </MznButtonGroup>
    `,
  }),
};

export const Variants: StoryObj = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <MznButtonGroup variant="base-primary">
          <MznButton>One</MznButton>
          <MznButton>Two</MznButton>
          <MznButton>Three</MznButton>
        </MznButtonGroup>

        <MznButtonGroup variant="base-secondary">
          <MznButton>One</MznButton>
          <MznButton>Two</MznButton>
          <MznButton>Three</MznButton>
        </MznButtonGroup>

        <MznButtonGroup variant="base-tertiary">
          <MznButton>One</MznButton>
          <MznButton>Two</MznButton>
          <MznButton>Three</MznButton>
        </MznButtonGroup>

        <MznButtonGroup variant="destructive-primary">
          <MznButton>Delete</MznButton>
          <MznButton>Remove</MznButton>
          <MznButton>Clear</MznButton>
        </MznButtonGroup>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    setup: () => ({ PlusIcon }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <MznButtonGroup variant="base-primary">
          <MznButton icon-type="leading" :icon="PlusIcon">
            Create
          </MznButton>
          <MznButton icon-type="leading" :icon="PlusIcon">
            New
          </MznButton>
        </MznButtonGroup>

        <MznButtonGroup variant="base-secondary">
          <MznButton icon-type="icon-only" :icon="PlusIcon" />
          <MznButton icon-type="icon-only" :icon="PlusIcon" />
          <MznButton icon-type="icon-only" :icon="PlusIcon" />
        </MznButtonGroup>
      </div>
    `,
  }),
};

export const Orientation: Story = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    template: `
      <div style="display: flex; gap: 48px">
        <MznButtonGroup variant="base-primary" orientation="horizontal">
          <MznButton>One</MznButton>
          <MznButton>Two</MznButton>
          <MznButton>Three</MznButton>
        </MznButtonGroup>

        <MznButtonGroup variant="base-secondary" orientation="vertical">
          <MznButton>One</MznButton>
          <MznButton>Two</MznButton>
          <MznButton>Three</MznButton>
        </MznButtonGroup>
      </div>
    `,
  }),
};

export const FullWidth: Story = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <MznButtonGroup variant="base-primary" full-width>
          <MznButton>One</MznButton>
          <MznButton>Two</MznButton>
          <MznButton>Three</MznButton>
        </MznButtonGroup>

        <MznButtonGroup variant="base-secondary" full-width>
          <MznButton>One</MznButton>
          <MznButton>Two</MznButton>
        </MznButtonGroup>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <MznButtonGroup variant="base-primary">
          <MznButton variant="base-secondary">Normal</MznButton>
          <MznButton variant="base-tertiary" disabled>
            Disabled
          </MznButton>
          <MznButton loading>Loading</MznButton>
        </MznButtonGroup>

        <MznButtonGroup variant="base-primary" disabled>
          <MznButton>All</MznButton>
          <MznButton>Disabled</MznButton>
          <MznButton>Group</MznButton>
        </MznButtonGroup>
      </div>
    `,
  }),
};
