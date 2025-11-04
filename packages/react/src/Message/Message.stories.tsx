import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect } from 'react';

import { messageIcons } from '@mezzanine-ui/core/message';
import Message from '.';
import Button, { ButtonGroup } from '../Button';

const meta: Meta<typeof Message> = {
  title: 'Data Display/Inline Messages',
  component: Message,
};

export default meta;

function createRandomNumber() {
  return Math.floor(Math.random() ** 7 * 1000000);
}

export const Basic: StoryObj = {
  render: () => {
    const BasicComponent = () => {
      useEffect(() => () => Message.destroy(), []);

      return (
        <ButtonGroup orientation="vertical">
          <Button
            onClick={() => {
              Message.warning(`${createRandomNumber()}`);
            }}
          >
            warning
          </Button>
          <Button
            onClick={() => {
              Message.error(`${createRandomNumber()}`);
            }}
          >
            error
          </Button>
          <Button
            onClick={() => {
              Message.info(`${createRandomNumber()}`);
            }}
          >
            info
          </Button>
        </ButtonGroup>
      );
    };

    return <BasicComponent />;
  },
};

export const MessageInfo: StoryObj<typeof Message> = {
  args: {
    children: '系統正在處理您的請求，請稍候。',
    severity: 'info',
  },
  render: (args) => (
    <Message {...args} />
  ),
};

export const MessageWarning: StoryObj<typeof Message> = {
  args: {
    children: '系統正在處理您的請求，請稍候。',
    severity: 'warning',
  },
  render: (args) => (
    <Message {...args} />
  ),
};

export const MessageError: StoryObj<typeof Message> = {
  args: {
    children: '系統正在處理您的請求，請稍候。',
    severity: 'error',
  },
  render: (args) => (
    <Message {...args} />
  ),
};

export const MutilpleMessages: StoryObj = {
  render: () => (
    <>
      <Message
        severity="info"
        icon={messageIcons.info}
        onClose={() => {
          // eslint-disable-next-line no-console
          console.log('message:onClose');
        }}
        onExited={() => {
          // eslint-disable-next-line no-console
          console.log('message:onExited');
        }}
      >
        This is an info message
      </Message>
      <Message
        severity="warning"
        icon={messageIcons.warning}
        onExited={() => {
          // eslint-disable-next-line no-console
          console.log('message:onExited');
        }}
      >
        This is a warning message
      </Message>
      <Message
        severity="error"
        icon={messageIcons.error}
        onExited={() => {
          // eslint-disable-next-line no-console
          console.log('message:onExited');
        }}
      >
        This is an error message
      </Message>
    </>
  ),
};