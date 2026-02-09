import { Meta, StoryObj } from '@storybook/react-webpack5';
import Separator, { SeparatorProps } from '.';

const meta: Meta<typeof Separator> = {
  title: 'Internal/Separator',
  component: Separator,
};

export default meta;

type Story = StoryObj<SeparatorProps>;

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
      table: {
        type: { summary: 'SeparatorOrientation' },
        defaultValue: { summary: "'horizontal'" },
      },
    },
  },
};

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: '100%', padding: '16px' }}>
      <Separator orientation="horizontal" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '100px', padding: '16px', gap: '16px' }}>
      <div>Left content</div>
      <Separator orientation="vertical" />
      <div>Right content</div>
    </div>
  ),
};

export const Examples: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Horizontal Separator</h3>
        <p style={{ marginBottom: '16px' }}>Content above the separator</p>
        <Separator orientation="horizontal" />
        <p style={{ marginTop: '16px' }}>Content below the separator</p>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px' }}>Vertical Separator</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Left</span>
          <Separator orientation="vertical" />
          <span>Middle</span>
          <Separator orientation="vertical" />
          <span>Right</span>
        </div>
      </div>
    </div>
  ),
};

