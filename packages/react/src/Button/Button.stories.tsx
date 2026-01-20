import { DotHorizontalIcon, PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import { Meta, StoryObj } from '@storybook/react-webpack5';

import Button, { ButtonProps, ButtonSize, ButtonVariant } from '.';
import { DropdownOption } from '..';
import Dropdown from '../Dropdown';

export default {
  title: 'Foundation/Button',
  component: Button,
} satisfies Meta<typeof Button>;

type Story = StoryObj<ButtonProps>;

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

export const Playground: Story = {
  argTypes: {
    variant: {
      options: variants,
      control: {
        type: 'select',
      },
    },
    size: {
      options: sizes,
      control: {
        type: 'select',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    loading: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    children: 'Button',
    variant: 'base-primary',
    size: 'main',
    disabled: false,
    loading: false,
  },
  render: (props) => <Button {...props} />,
};

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gap: '16px',
      }}
    >
      <Button variant="base-primary">Primary</Button>
      <Button variant="base-secondary">Secondary</Button>
      <Button variant="base-tertiary">Tertiary</Button>

      <Button variant="base-ghost">Ghost</Button>
      <Button variant="base-dashed">Dashed</Button>
      <Button variant="base-text-link">Text Link</Button>

      <Button variant="destructive-primary">Destructive Primary</Button>
      <Button variant="destructive-secondary">Destructive Secondary</Button>
      <Button variant="destructive-ghost">Destructive Ghost</Button>

      <Button variant="destructive-text-link">Destructive Text Link</Button>
      <Button variant="inverse">Inverse</Button>
      <Button variant="inverse-ghost">Inverse Ghost</Button>
      <Button variant="base-primary" disabled>
        Disabled
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <Button size="main">Main</Button>
      <Button size="sub">Sub</Button>
      <Button size="minor">Minor</Button>

      <Button variant="base-secondary" size="main">
        Main
      </Button>
      <Button variant="base-secondary" size="sub">
        Sub
      </Button>
      <Button variant="base-secondary" size="minor">
        Minor
      </Button>

      <Button variant="destructive-primary" size="main">
        Main
      </Button>
      <Button variant="destructive-primary" size="sub">
        Sub
      </Button>
      <Button variant="destructive-primary" size="minor">
        Minor
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(4, min-content)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      {/* Leading icons */}
      <Button icon={PlusIcon} iconType="leading" variant="base-primary">
        Leading Icon
      </Button>
      <Button icon={PlusIcon} iconType="leading" variant="base-secondary">
        Leading Icon
      </Button>
      <Button icon={PlusIcon} iconType="leading" variant="destructive-primary">
        Leading Icon
      </Button>
      <Button
        disabled
        icon={PlusIcon}
        iconType="leading"
        variant="base-primary"
      >
        Disabled
      </Button>

      {/* Trailing icons */}
      <Button icon={SearchIcon} iconType="trailing" variant="base-primary">
        Trailing Icon
      </Button>
      <Button icon={SearchIcon} iconType="trailing" variant="base-secondary">
        Trailing Icon
      </Button>
      <Button
        icon={SearchIcon}
        iconType="trailing"
        variant="destructive-primary"
      >
        Trailing Icon
      </Button>
      <Button
        icon={SearchIcon}
        iconType="trailing"
        size="sub"
        variant="base-primary"
      >
        Sub Size
      </Button>

      {/* Icon only with tooltip (default behavior) */}
      <Button icon={PlusIcon} iconType="icon-only" variant="base-primary">
        Add new item
      </Button>
      <Button icon={SearchIcon} iconType="icon-only" variant="base-secondary">
        Search
      </Button>
      <Button
        icon={PlusIcon}
        iconType="icon-only"
        variant="destructive-primary"
      >
        Delete
      </Button>
      <Button
        icon={PlusIcon}
        iconType="icon-only"
        size="minor"
        variant="base-primary"
      >
        Add
      </Button>
    </div>
  ),
};

export const IconOnlyWithTooltip: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(4, min-content)',
        gap: '16px',
        alignItems: 'center',
        padding: '60px',
      }}
    >
      {/* Default tooltip (bottom) */}
      <Button icon={PlusIcon} iconType="icon-only" variant="base-primary">
        Add new item
      </Button>

      {/* Tooltip on top */}
      <Button
        icon={SearchIcon}
        iconType="icon-only"
        tooltipPosition="top"
        variant="base-secondary"
      >
        Search
      </Button>

      {/* Disabled tooltip */}
      <Button
        disabledTooltip
        icon={PlusIcon}
        iconType="icon-only"
        variant="base-primary"
      >
        This tooltip is disabled
      </Button>

      {/* Without children - no tooltip */}
      <Button icon={SearchIcon} iconType="icon-only" variant="base-secondary" />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(4, min-content)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <Button loading variant="base-primary">
        Loading
      </Button>
      <Button loading variant="base-secondary">
        Loading
      </Button>
      <Button icon={PlusIcon} iconType="leading" loading variant="base-primary">
        With Icon
      </Button>
      <Button
        icon={PlusIcon}
        iconType="icon-only"
        loading
        variant="base-primary"
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <Button variant="base-primary">Normal</Button>
      <Button variant="base-primary" disabled>
        Disabled
      </Button>
      <Button variant="base-primary" loading>
        Loading
      </Button>

      <Button variant="base-secondary">Normal</Button>
      <Button variant="base-secondary" disabled>
        Disabled
      </Button>
      <Button variant="base-secondary" loading>
        Loading
      </Button>

      <Button variant="destructive-primary">Normal</Button>
      <Button variant="destructive-primary" disabled>
        Disabled
      </Button>
      <Button variant="destructive-primary" loading>
        Loading
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, min-content)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      {/* Native <a> tag */}
      <Button<'a'>
        component="a"
        href="https://github.com/Mezzanine-UI/mezzanine"
        rel="noopener noreferrer"
        target="_blank"
        variant="base-primary"
      >
        GitHub (Opens in new tab)
      </Button>

      <Button<'a'> component="a" href="#example" variant="base-secondary">
        Anchor Link
      </Button>

      <Button<'a'>
        component="a"
        href="https://www.npmjs.com/package/@mezzanine-ui/react"
        icon={SearchIcon}
        iconType="trailing"
        rel="noopener noreferrer"
        target="_blank"
        variant="base-text-link"
      >
        NPM Package
      </Button>

      <Button<'a'>
        component="a"
        disabled
        href="#disabled-link"
        variant="base-primary"
      >
        Disabled Link
      </Button>
    </div>
  ),
};

const dropdownOptions: DropdownOption[] = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
];

export const WithDropdown: Story = {
  render: () => (
    <div>
      <Dropdown options={dropdownOptions} placement="right-start">
        <Button icon={DotHorizontalIcon} iconType="icon-only" variant="base-secondary" />
      </Dropdown>
    </div>
  ),
};

export const CustomComponent: Story = {
  render: () => {
    // Example: Custom Link component
    // This could be useful with Next.js Link, React Router Link, etc.
    const CustomLink = ({ children, href, ...props }: any) => (
      <a
        {...props}
        href={href}
        onClick={(e) => {
          e.preventDefault();
          alert(`Navigating to: ${href}`);
        }}
      >
        {children}
      </a>
    );

    return (
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(2, min-content)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Button<typeof CustomLink>
          component={CustomLink}
          href="/dashboard"
          variant="base-primary"
        >
          Custom Link Component
        </Button>

        <Button<typeof CustomLink>
          component={CustomLink}
          href="/profile"
          icon={PlusIcon}
          iconType="leading"
          variant="base-secondary"
        >
          With Icon
        </Button>
      </div>
    );
  },
};
