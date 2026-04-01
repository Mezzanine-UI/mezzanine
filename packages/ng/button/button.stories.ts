import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import { ButtonSize, ButtonVariant } from '@mezzanine-ui/core/button';
import { MznButton } from './button.directive';
import { MznButtonGroup } from './button-group.component';
import { MznIcon } from '../icon/icon.component';

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
  title: 'Foundation/Button',
  decorators: [
    moduleMetadata({
      imports: [MznButton, MznButtonGroup, MznIcon],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    variant: {
      options: variants,
      control: { type: 'select' },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
  args: {
    text: 'Button',
    variant: 'base-primary',
    size: 'main',
    disabled: false,
    loading: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <button
        mznButton
        [variant]="variant"
        [size]="size"
        [disabled]="disabled"
        [loading]="loading"
      >{{ text }}</button>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(3, min-content); gap: 16px;">
        <button mznButton variant="base-primary">Primary</button>
        <button mznButton variant="base-secondary">Secondary</button>
        <button mznButton variant="base-tertiary">Tertiary</button>

        <button mznButton variant="base-ghost">Ghost</button>
        <button mznButton variant="base-dashed">Dashed</button>
        <button mznButton variant="base-text-link">Text Link</button>

        <button mznButton variant="destructive-primary">Destructive Primary</button>
        <button mznButton variant="destructive-secondary">Destructive Secondary</button>
        <button mznButton variant="destructive-ghost">Destructive Ghost</button>

        <button mznButton variant="destructive-text-link">Destructive Text Link</button>
        <button mznButton variant="inverse">Inverse</button>
        <button mznButton variant="inverse-ghost">Inverse Ghost</button>

        <button mznButton variant="base-primary" [disabled]="true">Disabled</button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(3, min-content); gap: 16px; align-items: center;">
        <button mznButton size="main">Main</button>
        <button mznButton size="sub">Sub</button>
        <button mznButton size="minor">Minor</button>

        <button mznButton variant="base-secondary" size="main">Main</button>
        <button mznButton variant="base-secondary" size="sub">Sub</button>
        <button mznButton variant="base-secondary" size="minor">Minor</button>

        <button mznButton variant="destructive-primary" size="main">Main</button>
        <button mznButton variant="destructive-primary" size="sub">Sub</button>
        <button mznButton variant="destructive-primary" size="minor">Minor</button>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    props: {
      PlusIcon,
      SearchIcon,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(3, min-content); gap: 16px; align-items: center;">
        <!-- Leading icons -->
        <button mznButton variant="base-primary" iconType="leading" [icon]="PlusIcon">Leading Icon</button>
        <button mznButton variant="base-secondary" iconType="leading" [icon]="PlusIcon">Leading Icon</button>
        <button mznButton variant="destructive-primary" iconType="leading" [icon]="PlusIcon">Leading Icon</button>

        <!-- Trailing icons -->
        <button mznButton variant="base-primary" iconType="trailing" [icon]="SearchIcon">Trailing Icon</button>
        <button mznButton variant="base-secondary" iconType="trailing" [icon]="SearchIcon">Trailing Icon</button>
        <button mznButton variant="base-secondary" iconType="trailing" [icon]="SearchIcon" size="sub">Sub Size</button>

        <!-- Icon only -->
        <button mznButton variant="base-primary" iconType="icon-only" [icon]="PlusIcon"></button>
        <button mznButton variant="base-secondary" iconType="icon-only" [icon]="SearchIcon"></button>
        <button mznButton variant="destructive-primary" iconType="icon-only" [icon]="PlusIcon"></button>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(3, min-content); gap: 16px; align-items: center;">
        <button mznButton variant="base-primary">Normal</button>
        <button mznButton variant="base-primary" [disabled]="true">Disabled</button>
        <button mznButton variant="base-primary" [loading]="true">Loading</button>

        <button mznButton variant="base-secondary">Normal</button>
        <button mznButton variant="base-secondary" [disabled]="true">Disabled</button>
        <button mznButton variant="base-secondary" [loading]="true">Loading</button>

        <button mznButton variant="destructive-primary">Normal</button>
        <button mznButton variant="destructive-primary" [disabled]="true">Disabled</button>
        <button mznButton variant="destructive-primary" [loading]="true">Loading</button>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(2, min-content); gap: 16px; align-items: center;">
        <a mznButton variant="base-primary"
           href="https://github.com/Mezzanine-UI/mezzanine"
           target="_blank" rel="noopener noreferrer">
          GitHub (Opens in new tab)
        </a>

        <a mznButton variant="base-secondary" href="#example">
          Anchor Link
        </a>

        <a mznButton variant="base-text-link"
           href="https://www.npmjs.com/package/@mezzanine-ui/react"
           target="_blank" rel="noopener noreferrer">
          NPM Package
        </a>

        <a mznButton variant="base-primary" [disabled]="true" href="#disabled-link">
          Disabled Link
        </a>
      </div>
    `,
  }),
};

export const ButtonGroupStory: Story = {
  name: 'ButtonGroup',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Horizontal (default) -->
        <div>
          <p style="margin-bottom: 8px; font-size: 14px; opacity: 0.7;">Horizontal (default)</p>
          <mzn-button-group variant="base-secondary">
            <button mznButton>Button 1</button>
            <button mznButton>Button 2</button>
            <button mznButton>Button 3</button>
          </mzn-button-group>
        </div>

        <!-- Different variants -->
        <div>
          <p style="margin-bottom: 8px; font-size: 14px; opacity: 0.7;">Group variant: destructive-primary, size: sub</p>
          <mzn-button-group variant="destructive-primary" size="sub">
            <button mznButton>Delete</button>
            <button mznButton>Remove</button>
          </mzn-button-group>
        </div>

        <!-- Vertical -->
        <div>
          <p style="margin-bottom: 8px; font-size: 14px; opacity: 0.7;">Vertical orientation</p>
          <mzn-button-group variant="base-secondary" orientation="vertical">
            <button mznButton>Top</button>
            <button mznButton>Middle</button>
            <button mznButton>Bottom</button>
          </mzn-button-group>
        </div>

        <!-- Full width -->
        <div>
          <p style="margin-bottom: 8px; font-size: 14px; opacity: 0.7;">Full width</p>
          <mzn-button-group variant="base-primary" [fullWidth]="true">
            <button mznButton>Left</button>
            <button mznButton>Center</button>
            <button mznButton>Right</button>
          </mzn-button-group>
        </div>

        <!-- Child override -->
        <div>
          <p style="margin-bottom: 8px; font-size: 14px; opacity: 0.7;">Child overrides group variant</p>
          <mzn-button-group variant="base-secondary">
            <button mznButton>Default</button>
            <button mznButton variant="destructive-primary">Override</button>
            <button mznButton>Default</button>
          </mzn-button-group>
        </div>
      </div>
    `,
  }),
};
