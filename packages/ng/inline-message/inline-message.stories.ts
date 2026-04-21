import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznInlineMessage } from './inline-message.component';

export default {
  title: 'Data Display/Inline Messages',
  decorators: [
    moduleMetadata({
      imports: [MznInlineMessage],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `
      <div mznInlineMessage severity="info" content="系統正在處理您的請求，請稍候。" ></div>
    `,
  }),
};

export const InlineMessageWarning: Story = {
  render: () => ({
    template: `
      <div mznInlineMessage severity="warning" content="系統正在處理您的請求，請稍候。" ></div>
    `,
  }),
};

export const InlineMessageError: Story = {
  render: () => ({
    template: `
      <div mznInlineMessage severity="error" content="系統正在處理您的請求，請稍候。" ></div>
    `,
  }),
};

export const MultipleInlineMessages: Story = {
  render: () => ({
    template: `
      <div mznInlineMessage severity="info" content="系統正在處理您的請求，請稍候。" ></div>
      <div mznInlineMessage severity="warning" content="系統正在處理您的請求，請稍候。" ></div>
      <div mznInlineMessage severity="error" content="系統正在處理您的請求，請稍候。" ></div>
    `,
  }),
};
