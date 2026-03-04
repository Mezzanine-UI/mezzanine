import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HomeIcon, FileIcon, UserIcon } from '@mezzanine-ui/icons';
import { PlusIcon } from '@mezzanine-ui/icons';
import Navigation, {
  NavigationFooter,
  NavigationHeader,
  NavigationOption,
} from '../Navigation';
import FloatingButton from '../FloatingButton';
import Layout from './Layout';

const meta: Meta<typeof Layout> = {
  title: 'Foundation/Layout',
  component: Layout,
};

export default meta;

export const Playground: StoryObj<typeof Layout> = {
  render: function Playground() {
    const [activatedPath, setActivatedPath] = useState(['首頁']);
    const [rightOpen, setRightOpen] = useState(false);

    return (
      <Layout navigationClassName="foo" contentWrapperClassName="bar">
        <Navigation
          activatedPath={activatedPath}
          onOptionClick={(path) => {
            if (path) setActivatedPath(path);
          }}
        >
          <NavigationHeader title="Mezzanine" />
          <NavigationOption icon={HomeIcon} title="首頁" />
          <NavigationOption icon={FileIcon} title="數據分析">
            <NavigationOption title="流量報表" />
            <NavigationOption title="轉換率分析" />
          </NavigationOption>
          <NavigationOption icon={UserIcon} title="會員管理" />
          <NavigationFooter />
        </Navigation>
        <Layout.Main className="main-foo">
          <div
            style={{
              height: '100vh',
              padding: 'var(--mzn-spacing-primitive-24)',
            }}
          >
            <h1>Main Content</h1>
            <p>
              Click the floating button to open the right panel, and drag the
              separator line to resize it.
            </p>
          </div>
          <FloatingButton
            autoHideWhenOpen
            icon={PlusIcon}
            iconType="icon-only"
            onClick={() => setRightOpen(true)}
            open={rightOpen}
          >
            Open Panel
          </FloatingButton>
        </Layout.Main>
        <Layout.RightPanel defaultWidth={320} open={rightOpen}>
          <div style={{ padding: 'var(--mzn-spacing-primitive-24)' }}>
            <h2>Right Panel</h2>
            <p>This panel is in-flow and scrolls independently.</p>
            <button onClick={() => setRightOpen(false)}>Close</button>
          </div>
        </Layout.RightPanel>
      </Layout>
    );
  },
};

export const WithDualPanels: StoryObj<typeof Layout> = {
  name: 'With Dual Panels (Left + Right)',
  render: function WithDualPanels() {
    const [activatedPath, setActivatedPath] = useState(['首頁']);
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(false);

    return (
      <Layout>
        <Navigation
          activatedPath={activatedPath}
          onOptionClick={(path) => {
            if (path) setActivatedPath(path);
          }}
        >
          <NavigationHeader title="Mezzanine" />
          <NavigationOption icon={HomeIcon} title="首頁" />
          <NavigationOption icon={FileIcon} title="數據分析">
            <NavigationOption title="流量報表" />
            <NavigationOption title="轉換率分析" />
          </NavigationOption>
          <NavigationOption icon={UserIcon} title="會員管理" />
          <NavigationFooter />
        </Navigation>
        <Layout.LeftPanel defaultWidth={240} open={leftOpen}>
          <div style={{ padding: 'var(--mzn-spacing-primitive-24)' }}>
            <h2>Left Panel</h2>
            <p>Sidebar content, navigation trees, filters, etc.</p>
            <button onClick={() => setLeftOpen(false)}>Close</button>
          </div>
        </Layout.LeftPanel>
        <Layout.Main>
          <div
            style={{
              height: '100vh',
              padding: 'var(--mzn-spacing-primitive-24)',
            }}
          >
            <h1>Main Content</h1>
            <p>
              The main area fills remaining space and scrolls independently.
            </p>
            <div
              style={{ display: 'flex', gap: 'var(--mzn-spacing-primitive-8)' }}
            >
              {!leftOpen && (
                <button onClick={() => setLeftOpen(true)}>Open Left</button>
              )}
              {!rightOpen && (
                <button onClick={() => setRightOpen(true)}>Open Right</button>
              )}
            </div>
          </div>
        </Layout.Main>
        <Layout.RightPanel defaultWidth={320} open={rightOpen}>
          <div style={{ padding: 'var(--mzn-spacing-primitive-24)' }}>
            <h2>Right Panel</h2>
            <p>Detail view, preview, contextual actions, etc.</p>
            <button onClick={() => setRightOpen(false)}>Close</button>
          </div>
        </Layout.RightPanel>
      </Layout>
    );
  },
};
