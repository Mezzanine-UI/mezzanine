import { Meta } from '@storybook/react-webpack5';
import { Key, useState } from 'react';
import Tab, { TabItem } from '.';
import { FolderIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Navigation/Tab',
} as Meta;

export const All = () => {
  const [tabKey, setTabKey] = useState<Key>('0');

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      Basic (Horizontal)
      <Tab activeKey={tabKey} onChange={setTabKey} direction="horizontal">
        <TabItem key="0">TabItem 1</TabItem>
        <TabItem key="1">TabItem 2</TabItem>
        <TabItem key="2">TabItem 3</TabItem>
      </Tab>
      WithIcon and Badge
      <Tab activeKey={tabKey} onChange={setTabKey} direction="horizontal">
        <TabItem key="0" icon={FolderIcon}>
          TabItem 1
        </TabItem>
        <TabItem key="1" icon={FolderIcon}>
          TabItem 2
        </TabItem>
        <TabItem key="2" icon={FolderIcon} badgeCount={99}>
          TabItem 3
        </TabItem>
      </Tab>
      Vertical
      <Tab activeKey={tabKey} onChange={setTabKey} direction="vertical">
        <TabItem key="0" icon={FolderIcon}>
          TabItem 1
        </TabItem>
        <TabItem key="1" icon={FolderIcon}>
          TabItem 2
        </TabItem>
        <TabItem key="2" icon={FolderIcon} badgeCount={99}>
          TabItem 3
        </TabItem>
        <TabItem key="3" icon={FolderIcon} disabled>
          Disabled
        </TabItem>
      </Tab>
      <Tab direction="vertical">
        <TabItem icon={FolderIcon}>TabItem 1</TabItem>
        <TabItem icon={FolderIcon}>TabItem 2</TabItem>
        <TabItem icon={FolderIcon}>TabItem 3</TabItem>
      </Tab>
    </div>
  );
};

export const Error = () => {
  const [tabKey, setTabKey] = useState<Key>('0');

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      Error (Horizontal)
      <Tab activeKey={tabKey} onChange={setTabKey} direction="horizontal">
        <TabItem key="0" icon={FolderIcon} badgeCount={99} error>
          Tab1
        </TabItem>
        <TabItem key="1">Tab2</TabItem>
        <TabItem key="2">Tab3</TabItem>
      </Tab>
      Error (Vertical)
      <Tab activeKey={tabKey} onChange={setTabKey} direction="vertical">
        <TabItem key="0" icon={FolderIcon} badgeCount={99} error>
          Tab1
        </TabItem>
        <TabItem key="1">Tab2</TabItem>
        <TabItem key="2">Tab3</TabItem>
      </Tab>
    </div>
  );
};

export const TabsSize = () => {
  const [tabKey, setTabKey] = useState<Key>('0');

  const horizontalTabs = (
    <>
      <TabItem key="0">Tab 1</TabItem>
      <TabItem key="1">Tab 2</TabItem>
      <TabItem key="2">Tab 3</TabItem>
      <TabItem key="3">Tab 4</TabItem>
      <TabItem key="4">Tab 5</TabItem>
      <TabItem key="5">Tab 6</TabItem>
      <TabItem key="6">Tab 7</TabItem>
    </>
  );

  const verticalTabs = (
    <>
      <TabItem key="0">Tab 1</TabItem>
      <TabItem key="1">Tab 2</TabItem>
      <TabItem key="2">Tab 3</TabItem>
      <TabItem key="3">Tab 4</TabItem>
      <TabItem key="4">Tab 5</TabItem>
      <TabItem key="5">Tab 6</TabItem>
      <TabItem key="6">Tab 7</TabItem>
      <TabItem key="7">Tab 8</TabItem>
      <TabItem key="8">Tab 9</TabItem>
      <TabItem key="9">Tab 10</TabItem>
    </>
  );

  return (
    <div style={{ display: 'grid', gap: 48 }}>
      分頁列尺寸（Tabs Size）
      水平分頁列（Horizontal Tabs）
      <div style={{ display: 'grid', gap: 24 }}>
        Main
        <Tab activeKey={tabKey} onChange={setTabKey} direction="horizontal" size="main">
          {horizontalTabs}
        </Tab>
        Sub
        <Tab activeKey={tabKey} onChange={setTabKey} direction="horizontal" size="sub">
          {horizontalTabs}
        </Tab>
      </div>
      垂直分頁列（Vertical Tabs）
      <div style={{ display: 'grid', gap: 24 }}>
        Main
        <Tab activeKey={tabKey} onChange={setTabKey} direction="vertical" size="main">
          {verticalTabs}
        </Tab>
        Sub
        <Tab activeKey={tabKey} onChange={setTabKey} direction="vertical" size="sub">
          {verticalTabs}
        </Tab>
      </div>
    </div>
  );
};
