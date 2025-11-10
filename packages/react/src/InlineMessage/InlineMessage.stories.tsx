import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ComponentProps } from 'react';

import InlineMessage from '.';

const meta: Meta<typeof InlineMessage> = {
  title: 'Data Display/Inline Messages',
  component: InlineMessage,
};

export default meta;

export const Basic: StoryObj<ComponentProps<typeof InlineMessage>> = {
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