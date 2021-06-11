import { Meta } from '@storybook/react';
import { Key, useState } from 'react';
import Badge, { BadgeContainer } from '../Badge';
import Button from '../Button';
import Tabs, { Tab, TabPane } from '.';

export default {
  title: 'Navigation/Tabs',
} as Meta;

export const Basic = () => {
  const [tabKey, setTabKey] = useState<Key>('1');

  function onChangeHandler(key: Key) {
    setTabKey(key);
  }

  return (
    <Tabs
      activeKey={tabKey}
      onChange={onChangeHandler}
    >
      <TabPane
        key="1"
        tab={(<Tab>Tab 1</Tab>)}
      >
        TabPane 1
      </TabPane>
      <TabPane
        key="2"
        tab={(<Tab disabled>Tab 2</Tab>)}
      >
        TabPane 2
      </TabPane>
      <TabPane
        key="3"
        tab={(<Tab>Tab 3</Tab>)}
      >
        TabPane 3
      </TabPane>
    </Tabs>
  );
};

export const WithBadge = () => (
  <Tabs>
    <TabPane
      tab={(
        <Tab>
          <BadgeContainer>
            <Badge dot />
            Tab1
          </BadgeContainer>
        </Tab>
      )}
    >
      TabPane 1
    </TabPane>
    <TabPane
      tab={(
        <Tab>
          <BadgeContainer>
            <Badge>{999}</Badge>
            Tab2
          </BadgeContainer>
        </Tab>
      )}
    >
      TabPane 2
    </TabPane>
    <TabPane
      tab={(
        <Tab>
          <BadgeContainer>
            <Badge overflowCount={999}>{1000}</Badge>
            Tab3
          </BadgeContainer>
        </Tab>
      )}
    >
      TabPane 3
    </TabPane>
  </Tabs>
);

export const WithActions = () => (
  <Tabs actions={(
    <Button
      variant="outlined"
    >
      Action
    </Button>
  )}
  >
    {Array.from('012').map((tab) => (
      <TabPane
        key={tab}
        tab={(
          <Tab>
            Tab
            {tab}
          </Tab>
        )}
      >
        TabPane
        {tab}
      </TabPane>
    ))}
  </Tabs>
);

export const Overflow = () => (
  <Tabs>
    {Array.from('0123456789ABCDEFGHIJK').map((tab) => (
      <TabPane
        key={tab}
        tab={(
          <Tab>
            Tab
            {tab}
          </Tab>
        )}
      >
        TabPane
        {tab}
      </TabPane>
    ))}
  </Tabs>
);
