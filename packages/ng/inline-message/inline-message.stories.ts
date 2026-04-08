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
      <mzn-inline-message severity="info" content="系統正在處理您的請求，請稍候。" />
    `,
  }),
};

export const InlineMessageWarning: Story = {
  render: () => ({
    template: `
      <mzn-inline-message severity="warning" content="系統正在處理您的請求，請稍候。" />
    `,
  }),
};

export const InlineMessageError: Story = {
  render: () => ({
    template: `
      <mzn-inline-message severity="error" content="系統正在處理您的請求，請稍候。" />
    `,
  }),
};

export const MultipleInlineMessages: Story = {
  render: () => ({
    template: `
      <mzn-inline-message severity="info" content="系統正在處理您的請求，請稍候。" />
      <mzn-inline-message severity="warning" content="系統正在處理您的請求，請稍候。" />
      <mzn-inline-message severity="error" content="系統正在處理您的請求，請稍候。" />
    `,
  }),
};
