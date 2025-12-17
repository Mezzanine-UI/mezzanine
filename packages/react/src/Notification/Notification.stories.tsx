import { Meta } from '@storybook/react-webpack5';
import { useEffect } from 'react';
import { NotificationSeverity } from '@mezzanine-ui/core/notification';
import Button, { ButtonGroup } from '../Button';
import Notification from '.';

export default {
  title: 'Feedback/Notification',
} as Meta;

export const Severity = () => {
  const severities: NotificationSeverity[] = [
    'success',
    'warning',
    'error',
    'info',
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridGap: 16,
      }}
    >
      {severities.map((severity) => (
        <Notification
          key={severity}
          severity={severity}
          title={`${severity} notification`}
        >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </Notification>
      ))}
    </div>
  );
};

export const Action = () => (
  <Notification
    title="Notification"
    confirmText="OK"
    cancelText="cancel"
    onConfirm={() => {}}
  >
    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
  </Notification>
);

export const API = () => {
  useEffect(() => () => Notification.destroy(), []);

  return (
    <ButtonGroup orientation="vertical">
      <Button
        variant="contained"
        onClick={() => {
          Notification.add({
            title: 'Demo Title',
            children: 'Demo String',
          });
        }}
      >
        add
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Notification.destroy();
        }}
      >
        destroy
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Notification.success({
            title: 'Demo Title',
            children: 'Demo String',
          });
        }}
      >
        success
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Notification.warning({
            title: 'Demo Title',
            children: 'Demo String',
          });
        }}
      >
        warning
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Notification.error({
            title: 'Demo Title',
            children: 'Demo String',
          });
        }}
      >
        error
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Notification.info({
            title: 'Demo Title',
            children: 'Demo String',
          });
        }}
      >
        info
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Notification.add({
            title: 'Demo Title',
            children: 'Demo String',
            onConfirm: () => {},
            confirmText: 'OK',
            cancelText: 'cancel',
          });
        }}
      >
        Action
      </Button>
    </ButtonGroup>
  );
};
