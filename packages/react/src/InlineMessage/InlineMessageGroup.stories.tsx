import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ComponentProps } from 'react';
import {
  InlineMessageGroup,
  InlineMessageGroupItem,
} from '.';

const meta: Meta<typeof InlineMessageGroup> = {
  title: 'Data Display/Inline Messages/InlineMessageGroup',
  component: InlineMessageGroup,
};

export default meta;

type Story = StoryObj<ComponentProps<typeof InlineMessageGroup>>;

const defaultItems: InlineMessageGroupItem[] = [
  {
    key: 'info-message',
    severity: 'info',
    content: '這是一則資訊訊息，可供使用者關閉。',
  },
  {
    key: 'warning-message',
    severity: 'warning',
    content: '這是一則警示訊息，提醒使用者注意狀態。',
  },
  {
    key: 'error-message',
    severity: 'error',
    content: '這是一則錯誤訊息，提示使用者需要採取行動。',
  },
];

export const Basic: Story = {
  args: {
    items: defaultItems,
    type: 'message',
  },
};

export const FormBasic: Story = {
  args: {
    items: defaultItems,
    placement: 'top',
    type: 'form',
  },
};

