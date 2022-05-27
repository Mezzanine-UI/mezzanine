import { Meta } from '@storybook/react';
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
  render: ({ children, reference }) => <div key={reference}>{children}</div>,
});

export const Common = () => {
  const [messageKeys, setMessageKeys] = useState<Key[]>([]);

  useEffect(() => () => {
    Notifier.destroy();
  }, []);

  return (
    <ButtonGroup style={{ marginBottom: 16 }}>
      <Button
        variant="contained"
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
        variant="contained"
        onClick={() => {
          Notifier.destroy();

          setMessageKeys([]);
        }}
      >
        Destroy all notifications
      </Button>
      {messageKeys.length ? (
        <Button
          variant="contained"
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
};
