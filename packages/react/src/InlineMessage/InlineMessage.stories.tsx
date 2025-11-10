import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ComponentProps } from 'react';

import InlineMessage from '.';

const meta: Meta<typeof InlineMessage> = {
  title: 'Data Display/Inline Messages',
  component: InlineMessage,
};

export default meta;

type Story = StoryObj<ComponentProps<typeof InlineMessage>>;

export const Basic: Story = {
  render: () => (
    <>
      <InlineMessage
        onClose={() => {
          // eslint-disable-next-line no-console
          console.log('message:onClose');
        }}
        severity="info"
      >
        This is an info message
      </InlineMessage>
      <InlineMessage
        severity="warning"
      >
        This is a warning message
      </InlineMessage>
      <InlineMessage
        severity="error"
      >
        This is an error message
      </InlineMessage>
    </>
  ),
};

export const InlineMessageInfo: StoryObj<ComponentProps<typeof InlineMessage>> = {
  args: {
    children: '系統正在處理您的請求，請稍候。',
    severity: 'info',
  },
};

export const InlineMessageWarning: StoryObj<ComponentProps<typeof InlineMessage>> = {
  args: {
    children: '系統正在處理您的請求，請稍候。',
    severity: 'warning',
  },
};

export const InlineMessageError: StoryObj<ComponentProps<typeof InlineMessage>> = {
  args: {
    children: '系統正在處理您的請求，請稍候。',
    severity: 'error',
  },
};