import { Meta, StoryObj } from '@storybook/react-webpack5';
import Scrollbar, { ScrollbarProps } from '.';
import Typography from '../Typography';

export default {
  title: 'Internal/Scrollbar',
  component: Scrollbar,
} satisfies Meta<typeof Scrollbar>;

type Story = StoryObj<ScrollbarProps>;

const LongContent = () => (
  <div style={{ padding: '16px' }}>
    {Array.from({ length: 20 }, (_, i) => (
      <Typography key={i} variant="body" style={{ marginBottom: '12px' }}>
        {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris.
      </Typography>
    ))}
  </div>
);

const WideContent = () => (
  <div
    style={{
      display: 'flex',
      flexFlow: 'row nowrap',
      padding: '16px',
      whiteSpace: 'nowrap',
    }}
  >
    {Array.from({ length: 10 }, (_, i) => (
      <Typography
        key={i}
        variant="body"
        style={{ marginBottom: '12px', flexShrink: 0 }}
      >
        {i + 1}. This is a very long line of text that will cause horizontal
        scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </Typography>
    ))}
  </div>
);

export const Playground: StoryObj<ScrollbarProps> = {
  args: {
    maxHeight: 300,
    maxWidth: undefined,
  },
  argTypes: {
    maxHeight: {
      control: 'number',
    },
    maxWidth: {
      control: 'number',
    },
  },
  render: (args) => (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      <Scrollbar {...args}>
        <LongContent />
      </Scrollbar>
    </div>
  ),
};

export const VerticalScroll: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      <Scrollbar maxHeight={300}>
        <LongContent />
      </Scrollbar>
    </div>
  ),
};

export const HorizontalScroll: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      <Scrollbar>
        <WideContent />
      </Scrollbar>
    </div>
  ),
};

export const NestedScrollable: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      <Scrollbar maxHeight={400}>
        <div style={{ padding: '16px' }}>
          <Typography variant="h3" style={{ marginBottom: '16px' }}>
            Outer Scrollable Container
          </Typography>

          <Typography variant="body" style={{ marginBottom: '16px' }}>
            This is the outer scrollable area. Below is a nested scrollable
            container.
          </Typography>

          <div
            style={{
              border: '1px dashed #999',
              borderRadius: '4px',
              marginBottom: '16px',
            }}
          >
            <Scrollbar maxHeight={150}>
              <div
                style={{ display: 'flex', flexFlow: 'column', padding: '12px' }}
              >
                <Typography
                  variant="body-highlight"
                  style={{ marginBottom: '8px' }}
                >
                  Nested Scrollable Container
                </Typography>
                {Array.from({ length: 10 }, (_, i) => (
                  <Typography
                    key={i}
                    variant="caption"
                    style={{ marginBottom: '8px' }}
                  >
                    Nested item {i + 1}: Lorem ipsum dolor sit amet.
                  </Typography>
                ))}
              </div>
            </Scrollbar>
          </div>

          {Array.from({ length: 15 }, (_, i) => (
            <Typography key={i} variant="body" style={{ marginBottom: '12px' }}>
              Outer content item {i + 1}: Sed do eiusmod tempor incididunt ut
              labore.
            </Typography>
          ))}
        </div>
      </Scrollbar>
    </div>
  ),
};
