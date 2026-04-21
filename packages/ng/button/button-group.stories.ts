import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { PlusIcon } from '@mezzanine-ui/icons';
import { ButtonGroupOrientation } from '@mezzanine-ui/core/button';
import { MznButton } from './button.directive';
import { MznButtonGroup } from './button-group.component';
import { MznIcon } from '../icon/icon.component';

const orientations: ButtonGroupOrientation[] = ['horizontal', 'vertical'];

export default {
  title: 'Foundation/Button/ButtonGroup',
  decorators: [
    moduleMetadata({
      imports: [MznButton, MznButtonGroup, MznIcon],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    orientation: {
      options: orientations,
      control: { type: 'select' },
    },
  },
  args: {
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznButtonGroup variant="base-primary" size="main" [orientation]="orientation">
        <button mznButton>One</button>
        <button mznButton>Two</button>
        <button mznButton>Three</button>
      </div>
      <br />
      <br />
      <div mznButtonGroup variant="base-secondary" size="sub" [orientation]="orientation">
        <button mznButton>One</button>
        <button mznButton>Two</button>
        <button mznButton>Three</button>
      </div>
      <br />
      <br />
      <div mznButtonGroup variant="destructive-primary" size="minor" [orientation]="orientation">
        <button mznButton>One</button>
        <button mznButton>Two</button>
        <button mznButton>Three</button>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div mznButtonGroup variant="base-primary">
          <button mznButton>One</button>
          <button mznButton>Two</button>
          <button mznButton>Three</button>
        </div>

        <div mznButtonGroup variant="base-secondary">
          <button mznButton>One</button>
          <button mznButton>Two</button>
          <button mznButton>Three</button>
        </div>

        <div mznButtonGroup variant="base-tertiary">
          <button mznButton>One</button>
          <button mznButton>Two</button>
          <button mznButton>Three</button>
        </div>

        <div mznButtonGroup variant="destructive-primary">
          <button mznButton>Delete</button>
          <button mznButton>Remove</button>
          <button mznButton>Clear</button>
        </div>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    props: {
      PlusIcon,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div mznButtonGroup variant="base-primary">
          <button mznButton iconType="leading"><i mznIcon [icon]="PlusIcon" [size]="16" ></i>Create</button>
          <button mznButton iconType="leading"><i mznIcon [icon]="PlusIcon" [size]="16" ></i>New</button>
        </div>

        <div mznButtonGroup variant="base-secondary">
          <button mznButton iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>
          <button mznButton iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>
          <button mznButton iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>
        </div>
      </div>
    `,
  }),
};

export const Orientation: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 48px;">
        <div mznButtonGroup variant="base-primary" orientation="horizontal">
          <button mznButton>One</button>
          <button mznButton>Two</button>
          <button mznButton>Three</button>
        </div>

        <div mznButtonGroup variant="base-secondary" orientation="vertical">
          <button mznButton>One</button>
          <button mznButton>Two</button>
          <button mznButton>Three</button>
        </div>
      </div>
    `,
  }),
};

export const FullWidth: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div mznButtonGroup variant="base-primary" [fullWidth]="true">
          <button mznButton>One</button>
          <button mznButton>Two</button>
          <button mznButton>Three</button>
        </div>

        <div mznButtonGroup variant="base-secondary" [fullWidth]="true">
          <button mznButton>One</button>
          <button mznButton>Two</button>
        </div>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div mznButtonGroup variant="base-primary">
          <button mznButton variant="base-secondary">Normal</button>
          <button mznButton variant="base-tertiary" [disabled]="true">Disabled</button>
          <button mznButton [loading]="true">Loading</button>
        </div>

        <div mznButtonGroup variant="base-primary" [disabled]="true">
          <button mznButton>All</button>
          <button mznButton>Disabled</button>
          <button mznButton>Group</button>
        </div>
      </div>
    `,
  }),
};
