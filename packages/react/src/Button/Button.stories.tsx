import { StoryObj, Meta } from '@storybook/react-webpack5';
import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import Button, { ButtonSize, ButtonVariant, ButtonProps } from '.';

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
      <Button
        variant="base-primary"
        icon={{ position: 'leading', src: PlusIcon }}
      >
        Leading Icon
      </Button>
      <Button
        variant="base-secondary"
        icon={{ position: 'leading', src: PlusIcon }}
      >
        Leading Icon
      </Button>
      <Button
        variant="destructive-primary"
        icon={{ position: 'leading', src: PlusIcon }}
      >
        Leading Icon
      </Button>
      <Button
        variant="base-primary"
        icon={{ position: 'leading', src: PlusIcon }}
        disabled
      >
        Disabled
      </Button>

      {/* Trailing icons */}
      <Button
        variant="base-primary"
        icon={{ position: 'trailing', src: SearchIcon }}
      >
        Trailing Icon
      </Button>
      <Button
        variant="base-secondary"
        icon={{ position: 'trailing', src: SearchIcon }}
      >
        Trailing Icon
      </Button>
      <Button
        variant="destructive-primary"
        icon={{ position: 'trailing', src: SearchIcon }}
      >
        Trailing Icon
      </Button>
      <Button
        variant="base-primary"
        icon={{ position: 'trailing', src: SearchIcon }}
        size="sub"
      >
        Sub Size
      </Button>

      {/* Icon only */}
      <Button
        variant="base-primary"
        icon={{ position: 'icon-only', src: PlusIcon }}
      />
      <Button
        variant="base-secondary"
        icon={{ position: 'icon-only', src: SearchIcon }}
      />
      <Button
        variant="destructive-primary"
        icon={{ position: 'icon-only', src: PlusIcon }}
      />
      <Button
        variant="base-primary"
        icon={{ position: 'icon-only', src: PlusIcon }}
        size="minor"
      />
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
      <Button variant="base-primary" loading>
        Loading
      </Button>
      <Button variant="base-secondary" loading>
        Loading
      </Button>
      <Button
        variant="base-primary"
        loading
        icon={{ position: 'leading', src: PlusIcon }}
      >
        With Icon
      </Button>
      <Button
        variant="base-primary"
        loading
        icon={{ position: 'icon-only', src: PlusIcon }}
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
        target="_blank"
        rel="noopener noreferrer"
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
        target="_blank"
        rel="noopener noreferrer"
        variant="base-text-link"
        icon={{ position: 'trailing', src: SearchIcon }}
      >
        NPM Package
      </Button>

      <Button<'a'>
        component="a"
        href="#disabled-link"
        variant="base-primary"
        disabled
      >
        Disabled Link
      </Button>
    </div>
  ),
};

export const CustomComponent: Story = {
  render: () => {
    // Example: Custom Link component
    // This could be useful with Next.js Link, React Router Link, etc.
    const CustomLink = ({ href, children, ...props }: any) => (
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
          variant="base-secondary"
          icon={{ position: 'leading', src: PlusIcon }}
        >
          With Icon
        </Button>
      </div>
    );
  },
};
