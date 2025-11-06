import { Meta, StoryObj } from '@storybook/react-webpack5';
import { Key, useEffect, useState } from 'react';
import Button, { ButtonGroup } from '../Button';
import { createNotifier } from '.';
import { NotifierData } from './typings';

export default {
  title: 'Utility/Notifier',
} as Meta;

type TestNotifierData = NotifierData & {
  reference?: Key;
};

const Notifier = createNotifier<TestNotifierData>({
  duration: 3000,
  maxCount: 4,
  render: ({ children, reference }) => (
    <div
      key={reference}
      style={{
        padding: '12px 16px',
        marginBottom: '8px',
        background: '#1976d2',
        color: 'white',
        borderRadius: '4px',
      }}
    >
      {children}
    </div>
  ),
  setRoot: (root) => {
    root.style.position = 'fixed';
    root.style.top = '16px';
    root.style.right = '16px';
    root.style.zIndex = '9999';
    root.style.minWidth = '300px';
  },
});

function CommonExample() {
  const [messageKeys, setMessageKeys] = useState<Key[]>([]);

  useEffect(
    () => () => {
      Notifier.destroy();
    },
    [],
  );

  return (
    <ButtonGroup style={{ marginBottom: 16 }}>
      <Button
        variant="base-primary"
        onClick={() => {
          const key = Notifier.add({
            children: 'foo',
          });

          setMessageKeys([...messageKeys, key]);
        }}
      >
        Add a notification
      </Button>
      <Button
        variant="base-primary"
        onClick={() => {
          Notifier.destroy();

          setMessageKeys([]);
        }}
      >
        Destroy all notifications
      </Button>
      {messageKeys.length ? (
        <Button
          variant="base-primary"
          onClick={() => {
            Notifier.remove(messageKeys[0]);

            setMessageKeys(messageKeys.slice(1));
          }}
        >
          remove first notification
        </Button>
      ) : null}
    </ButtonGroup>
  );
}

export const Common: StoryObj = {
  render: () => <CommonExample />,
};
