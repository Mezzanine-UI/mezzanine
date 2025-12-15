import { Meta } from '@storybook/react-webpack5';
import { Key, useState } from 'react';
import Tab, { TabItem, TabPane } from '.';

export default {
  title: 'Navigation/tab',
} as Meta;

export const All = () => {
  const [tabKey, setTabKey] = useState<Key>('1');

  function onChangeHandler(key: Key) {
    setTabKey(key);
  }

  return (
    <Tab activeKey={tabKey} onChange={onChangeHandler}>
      <TabPane key="1" tab={<TabItem>TabItem 1</TabItem>}>
        TabPane 1
      </TabPane>
      <TabPane key="2" tab={<TabItem disabled>TabItem 2</TabItem>}>
        TabPane 2
      </TabPane>
      <TabPane key="3" tab={<TabItem>TabItem 3</TabItem>}>
        TabPane 3
      </TabPane>
    </Tab>
  );
};
