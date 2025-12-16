import { Meta } from '@storybook/react-webpack5';
import { Key, useState } from 'react';
import Tab, { TabItem } from '.';

export default {
  title: 'Navigation/Tab',
} as Meta;

export const All = () => {
  const [tabKey, setTabKey] = useState<Key>('1');

  function onChangeHandler(key: Key) {
    setTabKey(key);
  }

  return (
    <Tab activeKey={tabKey} onChange={onChangeHandler}>
      <TabItem key="1">TabItem 1</TabItem>
      <TabItem key="2">TabItem 2</TabItem>
      <TabItem key="3">TabItem 3</TabItem>
    </Tab>
  );
};
