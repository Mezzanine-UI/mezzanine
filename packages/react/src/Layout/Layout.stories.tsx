import type { Meta, StoryObj } from '@storybook/react';
import Layout from './Layout';

const meta: Meta<typeof Layout> = {
  title: 'General/Layout',
  component: Layout,
  argTypes: {
    defaultSidePanelWidth: {
      control: { type: 'number' },
    },
  },
};

export default meta;

export const Playground: StoryObj<typeof Layout> = {
  args: {
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Main Content</h1>
        <p>This area uses the body scrollbar. Resize the panel by dragging the separator line.</p>
      </div>
    ),
    defaultSidePanelWidth: 320,
    sidePanelChildren: (
      <div style={{ padding: '24px' }}>
        <h2>Side Panel</h2>
        <p>This panel is position: fixed and scrolls independently.</p>
      </div>
    ),
  },
};
