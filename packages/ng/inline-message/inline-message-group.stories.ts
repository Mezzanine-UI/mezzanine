import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  InlineMessageGroupItem,
  MznInlineMessageGroup,
} from './inline-message-group.component';

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

export default {
  title: 'Data Display/Inline Messages/InlineMessageGroup',
  decorators: [
    moduleMetadata({
      imports: [MznInlineMessageGroup],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    items: defaultItems,
  },
  render: (args) => ({
    props: {
      ...args,
      onItemClose: (key: string | number): void => {
        console.log('itemClose:', key);
      },
    },
    template: `
      <div mznInlineMessageGroup
        [items]="items"
        (itemClose)="onItemClose($event)"
      ></div>
    `,
  }),
};
