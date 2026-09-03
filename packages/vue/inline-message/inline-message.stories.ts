import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznInlineMessage from './inline-message.vue';
import type { InlineMessageProps } from './inline-message.types';

const meta: Meta<typeof MznInlineMessage> = {
  title: 'Data Display/Inline Messages',
  component: MznInlineMessage,
  argTypes: {
    // React's docgen infers the radio and its options from the union behind
    // `severity`; Vue's cannot see through the imported type alias, so the
    // control is spelled out to keep both Controls panels identical.
    severity: {
      control: 'radio',
      options: ['info', 'warning', 'error'],
    },
  },
};

export default meta;

type Story = StoryObj<InlineMessageProps>;

export const Basic: Story = {
  args: {
    content: '系統正在處理您的請求，請稍候。',
    severity: 'info',
  },
};

export const InlineMessageWarning: Story = {
  args: {
    content: '系統正在處理您的請求，請稍候。',
    severity: 'warning',
  },
};

export const InlineMessageError: Story = {
  args: {
    content: '系統正在處理您的請求，請稍候。',
    severity: 'error',
  },
};

export const MultipleInlineMessages: Story = {
  render: () => ({
    components: { MznInlineMessage },
    template: `
      <MznInlineMessage content="系統正在處理您的請求，請稍候。" severity="info" />
      <MznInlineMessage content="系統正在處理您的請求，請稍候。" severity="warning" />
      <MznInlineMessage content="系統正在處理您的請求，請稍候。" severity="error" />
    `,
  }),
};
