import { StoryObj, Meta } from '@storybook/react-webpack5';
import Badge, { BadgeProps } from '.';
import Typography from '../Typography';
import { NotificationIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { BadgeCountVariant, BadgeDotVariant } from '@mezzanine-ui/core/badge';
import { ReactNode } from 'react';

export default {
  title: 'Data Display/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>;

type Story = StoryObj<BadgeProps>;

const variants = [
  'dot-success',
  'dot-error',
  'dot-warning',
  'dot-info',
  'dot-inactive',
  'count-alert',
  'count-inactive',
  'count-inverse',
  'count-brand',
  'count-info',
] as const;

type PlaygroundArgs = {
  className: string;
  count: number;
  text: string;
  variant: BadgeDotVariant | BadgeCountVariant;
  overflowCount: number;
  children: ReactNode;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    className: '',
    count: undefined,
    text: '',
    variant: variants[0],
    overflowCount: undefined,
    children: undefined,
  },
  argTypes: {
    className: { control: 'text' },
    children: { control: false },
    count: { control: 'number' },
    overflowCount: { control: 'number' },
    text: { control: 'text' },
    variant: {
      control: 'select',
      options: variants,
    },
  },
};

const MockIconButton = () => (
  <button
    type="button"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      border: 'none',
      backgroundColor: 'transparent',
    }}
  >
    <Icon icon={NotificationIcon} size={16} />
  </button>
);

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Typography variant="h2">Dot</Typography>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body">Success</Typography>
          <Badge variant="dot-success">
            <MockIconButton />
          </Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body">Error</Typography>
          <Badge variant="dot-error">
            <MockIconButton />
          </Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body">Warning</Typography>
          <Badge variant="dot-warning">
            <MockIconButton />
          </Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body">Info</Typography>
          <Badge variant="dot-info">
            <MockIconButton />
          </Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="body">Inactive</Typography>
          <Badge variant="dot-inactive">
            <MockIconButton />
          </Badge>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Typography variant="h2">Dot with text</Typography>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Success
          <Badge variant="dot-success" text="States" />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Error
          <Badge variant="dot-error" text="States" />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Warning
          <Badge variant="dot-warning" text="States" />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Info
          <Badge variant="dot-info" text="States" />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Inactive
          <Badge variant="dot-inactive" text="States" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Typography variant="h2">Count</Typography>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Alert
          <Badge variant="count-alert" count={5} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Inactive
          <Badge variant="count-inactive" count={5} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Inverse
          <Badge variant="count-inverse" count={5} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Brand
          <Badge variant="count-brand" count={5} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Info
          <Badge variant="count-info" count={5} />
        </div>
      </div>
    </div>
  ),
};
