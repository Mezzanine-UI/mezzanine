import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznInlineMessageGroup from './inline-message-group.vue';
import type {
  InlineMessageGroupItem,
  InlineMessageGroupProps,
} from './inline-message-group.types';

const meta: Meta<typeof MznInlineMessageGroup> = {
  title: 'Data Display/Inline Messages/InlineMessageGroup',
  component: MznInlineMessageGroup,
};

export default meta;

type Story = StoryObj<InlineMessageGroupProps>;

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
  },
};
