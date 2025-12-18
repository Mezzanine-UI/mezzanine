import { Meta } from '@storybook/react-webpack5';
import { Key, useState } from 'react';
import Tab, { TabItem } from '.';
import { FolderIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Navigation/Tab',
} as Meta;

export const All = () => {
  const [tabKey, setTabKey] = useState<Key>('1');

  function onChangeHandler(key: Key) {
    setTabKey(key);
  }

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      Basic (Horizontal)
      <Tab activeKey={tabKey} onChange={onChangeHandler} direction="horizontal">
        <TabItem key="1">TabItem 1</TabItem>
        <TabItem key="2">TabItem 2</TabItem>
        <TabItem key="3">TabItem 3</TabItem>
      </Tab>
      WithIcon and Badge
      <Tab activeKey={tabKey} onChange={onChangeHandler} direction="horizontal">
        <TabItem key="1" icon={FolderIcon}>
          TabItem 1
        </TabItem>
        <TabItem key="2" icon={FolderIcon}>
          TabItem 2
        </TabItem>
        <TabItem key="3" icon={FolderIcon} badgeCount={99}>
          TabItem 3
        </TabItem>
      </Tab>
      Vertical
      <Tab activeKey={tabKey} onChange={onChangeHandler} direction="vertical">
        <TabItem key="1" icon={FolderIcon}>
          TabItem 1
        </TabItem>
        <TabItem key="2" icon={FolderIcon}>
          TabItem 2
        </TabItem>
        <TabItem key="3" icon={FolderIcon} badgeCount={99}>
          TabItem 3
        </TabItem>
        <TabItem key="4" icon={FolderIcon} disabled>
          Disabled
        </TabItem>
      </Tab>
    </div>
  );
};
