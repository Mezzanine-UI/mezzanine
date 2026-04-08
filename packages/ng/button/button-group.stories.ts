import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { PlusIcon } from '@mezzanine-ui/icons';
import {
  ButtonGroupOrientation,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { MznButton } from './button.directive';
import { MznButtonGroup } from './button-group.component';
import { MznIcon } from '../icon/icon.component';

const orientations: ButtonGroupOrientation[] = ['horizontal', 'vertical'];
const sizes: ButtonSize[] = ['main', 'sub', 'minor'];
const variants: ButtonVariant[] = [
  'base-primary',
  'base-secondary',
  'base-tertiary',
  'base-ghost',
  'base-dashed',
  'base-text-link',
  'destructive-primary',
  'destructive-secondary',
  'destructive-ghost',
  'destructive-text-link',
  'inverse',
  'inverse-ghost',
];

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
    disabled: {
      control: { type: 'boolean' },
      description:
        'If the disabled of a button inside group not provided, the disabled of group will override it.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'If true, set width: 100%.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    orientation: {
      options: orientations,
      control: { type: 'select' },
      description: 'The orientation of button group.',
      table: {
        type: {
          summary: orientations.map((o) => `'${o}'`).join(' | '),
        },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
      description:
        'If the size of a button inside group not provided, the size of group will override it.',
      table: {
        type: { summary: sizes.map((s) => `'${s}'`).join(' | ') },
        defaultValue: { summary: "'main'" },
      },
    },
    variant: {
      options: variants,
      control: { type: 'select' },
      description:
        'If the variant of a button inside group not provided, the variant of group will override it.',
      table: {
        type: { summary: variants.map((v) => `'${v}'`).join(' | ') },
        defaultValue: { summary: "'base-primary'" },
      },
    },
  },
  args: {
    disabled: false,
    fullWidth: false,
    orientation: 'horizontal',
    size: 'main',
    variant: 'base-primary',
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznButtonGroup
        [variant]="variant"
        [size]="size"
        [orientation]="orientation"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
      >
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
