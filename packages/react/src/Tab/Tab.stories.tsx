import { Meta } from '@storybook/react-webpack5';
import { Key, useState } from 'react';
import Tab, { TabItem } from '.';
import { FolderIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Navigation/Tab',
} as Meta;

export const All = () => {
  const [tabKey, setTabKey] = useState<Key>('s1');

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
