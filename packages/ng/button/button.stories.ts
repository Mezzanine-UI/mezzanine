import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { DotHorizontalIcon, PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import { ButtonSize, ButtonVariant } from '@mezzanine-ui/core/button';
import { MznButton } from './button.directive';
import { MznIcon } from '../icon/icon.component';
import { MznDropdown } from '../dropdown/dropdown.component';

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
      imports: [MznButton, MznIcon],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    variant: {
      options: variants,
      control: { type: 'select' },
      description: 'The variant of button.',
      table: {
        type: { summary: variants.map((v) => `'${v}'`).join(' | ') },
        defaultValue: { summary: "'base-primary'" },
      },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
      description: 'The size of button.',
      table: {
        type: { summary: "'main' | 'sub' | 'minor'" },
        defaultValue: { summary: "'main'" },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'If true, button will be disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: { type: 'boolean' },
      description: 'If true, show loading state with spinner icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    icon: {
      control: false,
      description: 'The icon to display.',
      table: {
        type: { summary: 'IconDefinition' },
        defaultValue: { summary: '-' },
      },
    },
    iconType: {
      options: [undefined, 'leading', 'trailing', 'icon-only'],
      control: { type: 'select' },
      description: 'The type of the icon relative to the text.',
      table: {
        type: { summary: "'leading' | 'trailing' | 'icon-only'" },
        defaultValue: { summary: '-' },
      },
    },
    tooltipText: {
      control: { type: 'text' },
      description:
        'Tooltip text for icon-only buttons. Only applies when iconType is `icon-only`.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
    disabledTooltip: {
      control: { type: 'boolean' },
      description:
        'If true, disable the tooltip for icon-only buttons. Only applies when iconType is `icon-only`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    tooltipPosition: {
      options: [undefined, 'top', 'bottom', 'left', 'right'],
      control: { type: 'select' },
      description:
        'The position of the tooltip. Only applies when iconType is `icon-only`.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: "'bottom'" },
      },
    },
  },
  args: {
    text: 'Button',
    variant: 'base-primary',
    size: 'main',
    disabled: false,
    loading: false,
    disabledTooltip: false,
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
      <div style="display: inline-grid; grid-template-columns: repeat(4, min-content); gap: 16px; align-items: center;">
        <!-- Leading icons -->
        <button mznButton variant="base-primary" iconType="leading"><i mznIcon [icon]="PlusIcon" [size]="16" ></i>Leading Icon</button>
        <button mznButton variant="base-secondary" iconType="leading"><i mznIcon [icon]="PlusIcon" [size]="16" ></i>Leading Icon</button>
        <button mznButton variant="destructive-primary" iconType="leading"><i mznIcon [icon]="PlusIcon" [size]="16" ></i>Leading Icon</button>
        <button mznButton variant="base-primary" iconType="leading" [disabled]="true"><i mznIcon [icon]="PlusIcon" [size]="16" ></i>Disabled</button>

        <!-- Trailing icons -->
        <button mznButton variant="base-primary" iconType="trailing">Trailing Icon<i mznIcon [icon]="SearchIcon" [size]="16" ></i></button>
        <button mznButton variant="base-secondary" iconType="trailing">Trailing Icon<i mznIcon [icon]="SearchIcon" [size]="16" ></i></button>
        <button mznButton variant="destructive-primary" iconType="trailing">Trailing Icon<i mznIcon [icon]="SearchIcon" [size]="16" ></i></button>
        <button mznButton variant="base-primary" iconType="trailing" size="sub">Sub Size<i mznIcon [icon]="SearchIcon" [size]="16" ></i></button>

        <!-- Icon only with tooltip (default behavior) -->
        <button mznButton variant="base-primary" iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>
        <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="SearchIcon" [size]="16" ></i></button>
        <button mznButton variant="destructive-primary" iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>
        <button mznButton variant="base-primary" iconType="icon-only" size="minor"><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>
      </div>
    `,
  }),
};

export const IconOnlyWithTooltip: Story = {
  render: () => ({
    props: {
      PlusIcon,
      SearchIcon,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(4, min-content); gap: 16px; align-items: center; padding: 60px;">
        <!-- Default tooltip (bottom) -->
        <button mznButton variant="base-primary" iconType="icon-only"
          tooltipText="Add new item"
        ><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>

        <!-- Tooltip on top -->
        <button mznButton variant="base-secondary" iconType="icon-only"
          tooltipText="Search" tooltipPosition="top"
        ><i mznIcon [icon]="SearchIcon" [size]="16" ></i></button>

        <!-- Disabled tooltip (no tooltip shown) -->
        <button mznButton variant="base-primary" iconType="icon-only"
          tooltipText="This tooltip is disabled" [disabledTooltip]="true"
        ><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>

        <!-- Without tooltipText - no tooltip -->
        <button mznButton variant="base-secondary" iconType="icon-only"
        ><i mznIcon [icon]="SearchIcon" [size]="16" ></i></button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    props: {
      PlusIcon,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(4, min-content); gap: 16px; align-items: center;">
        <button mznButton variant="base-primary" [loading]="true">Loading</button>
        <button mznButton variant="base-secondary" [loading]="true">Loading</button>
        <button mznButton variant="base-primary" iconType="leading" [loading]="true"><i mznIcon [icon]="PlusIcon" [size]="16" ></i>With Icon</button>
        <button mznButton variant="base-primary" iconType="icon-only" [loading]="true"><i mznIcon [icon]="PlusIcon" [size]="16" ></i></button>
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
    props: {
      SearchIcon,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(2, min-content); gap: 16px; align-items: center;">
        <!-- Native <a> tag -->
        <a mznButton variant="base-primary"
           href="https://github.com/Mezzanine-UI/mezzanine"
           target="_blank" rel="noopener noreferrer">
          GitHub (Opens in new tab)
        </a>

        <a mznButton variant="base-secondary" href="#example">
          Anchor Link
        </a>

        <a mznButton variant="base-text-link"
           iconType="trailing"
           href="https://www.npmjs.com/package/@mezzanine-ui/react"
           target="_blank" rel="noopener noreferrer">
          NPM Package<i mznIcon [icon]="SearchIcon" [size]="16" ></i>
        </a>

        <a mznButton variant="base-primary" [disabled]="true" href="#disabled-link">
          Disabled Link
        </a>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-button-with-dropdown',
  standalone: true,
  imports: [MznButton, MznIcon, MznDropdown],
  template: `
    <div>
      <button
        #anchorEl
        mznButton
        variant="base-secondary"
        iconType="icon-only"
        (click)="toggle()"
        ><i mznIcon [icon]="DotHorizontalIcon" [size]="16"></i
      ></button>
      <div
        mznDropdown
        [anchor]="anchorEl"
        [open]="open()"
        [options]="options"
        placement="bottom-start"
        (closed)="open.set(false)"
        (selected)="onSelect($event)"
      ></div>
    </div>
  `,
})
class ButtonWithDropdownComponent {
  readonly DotHorizontalIcon = DotHorizontalIcon;
  readonly open = signal(false);
  readonly options = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ];

  toggle(): void {
    this.open.set(!this.open());
  }

  onSelect(_option: { id: string; name: string }): void {
    this.open.set(false);
  }
}

export const WithDropdown: Story = {
  decorators: [
    moduleMetadata({
      imports: [ButtonWithDropdownComponent],
    }),
  ],
  render: () => ({
    template: `<story-button-with-dropdown />`,
  }),
};

@Component({
  selector: 'story-custom-link',
  standalone: true,
  template: `<a [href]="href" (click)="onClick($event)"><ng-content /></a>`,
})
class CustomLinkComponent {
  href = '';

  onClick(e: Event): void {
    e.preventDefault();
    alert(`Navigating to: ${this.href}`);
  }
}

export const CustomComponent: Story = {
  decorators: [
    moduleMetadata({
      imports: [MznButton, MznIcon, CustomLinkComponent],
    }),
  ],
  render: () => ({
    props: { PlusIcon },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(2, min-content); gap: 16px; align-items: center;">
        <a mznButton variant="base-primary"
           href="/dashboard"
           (click)="$event.preventDefault(); alert('Navigating to: /dashboard')">
          Custom Link Component
        </a>

        <a mznButton variant="base-secondary"
           iconType="leading"
           href="/profile"
           (click)="$event.preventDefault(); alert('Navigating to: /profile')">
          <i mznIcon [icon]="PlusIcon" [size]="16" ></i>With Icon
        </a>
      </div>
    `,
  }),
};
