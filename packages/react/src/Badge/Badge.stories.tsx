import { StoryObj, Meta } from '@storybook/react-webpack5';
import Badge, { BadgeContainer, BadgeProps } from '.';
import { BadgeVariant } from '@mezzanine-ui/core/badge';
import Typography from '../Typography';

export default {
  title: 'Data Display/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>;

type Story = StoryObj<BadgeProps>;

const variants: BadgeVariant[] = [
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
];

export const Playground: Story = {
  args: {
    variant: variants[0],
    overflowCount: undefined,
    children: 'test',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
    overflowCount: {
      control: 'number',
    },
  },
};

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant="h2">Dot</Typography>

        <BadgeContainer>
          <div style={{ padding: '8px 16px', width: 'fit-content' }}>
            <Typography variant="body">Success</Typography>
          </div>
          <Badge variant="dot-success" />
        </BadgeContainer>

        <BadgeContainer>
          <div style={{ padding: '8px 16px', width: 'fit-content' }}>
            <Typography variant="body">Error</Typography>
          </div>
          <Badge variant="dot-error" />
        </BadgeContainer>

        <BadgeContainer>
          <div style={{ padding: '8px 16px', width: 'fit-content' }}>
            <Typography variant="body">Warning</Typography>
          </div>
          <Badge variant="dot-warning" />
        </BadgeContainer>

        <BadgeContainer>
          <div style={{ padding: '8px 16px', width: 'fit-content' }}>
            <Typography variant="body">Info</Typography>
          </div>
          <Badge variant="dot-info" />
        </BadgeContainer>

        <BadgeContainer>
          <div style={{ padding: '8px 16px', width: 'fit-content' }}>
            <Typography variant="body">Inactive</Typography>
          </div>
          <Badge variant="dot-inactive" />
        </BadgeContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant="h2">Dot with text</Typography>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Success
          <Badge variant="dot-success">States</Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Error
          <Badge variant="dot-error">States</Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Warning
          <Badge variant="dot-warning">States</Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Info
          <Badge variant="dot-info">States</Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Inactive
          <Badge variant="dot-inactive">States</Badge>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant="h2">Count</Typography>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Alert
          <Badge variant="count-alert">5</Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Inactive
          <Badge variant="count-inactive">5</Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Inverse
          <Badge variant="count-inverse">5</Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Brand
          <Badge variant="count-brand">5</Badge>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
          }}
        >
          Info
          <Badge variant="count-info">5</Badge>
        </div>
      </div>
    </div>
  ),
};
