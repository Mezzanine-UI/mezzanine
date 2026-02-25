import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PlusIcon } from '@mezzanine-ui/icons';
import FloatingButton from '../FloatingButton';
import Layout from './Layout';

const meta: Meta<typeof Layout> = {
  title: 'Foundation/Layout',
  component: Layout,
};

export default meta;

export const Playground: StoryObj<typeof Layout> = {
  render: function Playground() {
    const [open, setOpen] = useState(false);

    return (
      <Layout defaultSidePanelWidth={320} open={open}>
        <Layout.Main>
          <div style={{ padding: '24px' }}>
            <h1>Main Content</h1>
            <p>
              This area uses the body scrollbar. Click the floating button to open the side panel,
              and drag the separator line to resize it.
            </p>
          </div>
          <FloatingButton
            autoHideWhenOpen
            icon={PlusIcon}
            iconType="icon-only"
            onClick={() => setOpen(true)}
            open={open}
          >
            Open Panel
          </FloatingButton>
        </Layout.Main>
        <Layout.SidePanel>
          <div style={{ padding: '24px' }}>
            <h2>Side Panel</h2>
            <p>This panel is position: fixed and scrolls independently.</p>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </Layout.SidePanel>
      </Layout>
    );
  },
};
