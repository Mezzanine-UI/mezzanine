import { Meta, StoryObj } from '@storybook/react-webpack5';
import Textarea, { TextareaProps } from '.';
import Typography from '../Typography';
import { ReactNode } from 'react';

export default {
  title: 'Data Entry/Textarea',
  component: Textarea,
} satisfies Meta<typeof Textarea>;

type Story = StoryObj<TextareaProps>;

export const Playground: Story = {
  args: {
    className: '',
    disabled: false,
    id: 'test-id-01',
    placeholder: '輸入文字...',
    readOnly: false,
    resize: 'none',
    type: 'default',
    textareaClassName: '',
  },
  argTypes: {
    className: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    resize: {
      control: 'inline-radio',
      options: ['none', 'both', 'horizontal', 'vertical'],
    },
    type: {
      control: 'select',
      options: ['default', 'warning', 'error'],
    },
    textareaClassName: { control: 'text' },
    textareaRef: { table: { disable: true } },
  },
  render: (args: TextareaProps) => (
    <Textarea {...args} textareaClassName="aa" />
  ),
};

const TypeRow = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div>
    <Typography variant="h2">{title}</Typography>
    <div style={{ display: 'flex', gap: '24px' }}>{children}</div>
  </div>
);

const TypeRowItem = ({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Typography variant="caption">{caption}</Typography>
    {children}
  </div>
);

export const Types = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <TypeRow title="Default">
        <TypeRowItem caption="Default">
          <Textarea
            type="default"
            placeholder="Enter a description..."
            resize="horizontal"
          />
        </TypeRowItem>
        <TypeRowItem caption="Filled">
          <Textarea
            type="default"
            placeholder="輸入文字..."
            defaultValue="Lorem ipsum dolor sit amet"
          />
        </TypeRowItem>
      </TypeRow>
      <TypeRow title="Warning">
        <TypeRowItem caption="Default">
          <Textarea type="warning" placeholder="Enter a description..." />
        </TypeRowItem>
        <TypeRowItem caption="Filled">
          <Textarea
            type="warning"
            placeholder="輸入文字..."
            defaultValue="Lorem ipsum dolor sit amet"
          />
        </TypeRowItem>
      </TypeRow>
      <TypeRow title="Error">
        <TypeRowItem caption="Default">
          <Textarea type="error" placeholder="Enter a description..." />
        </TypeRowItem>
        <TypeRowItem caption="Filled">
          <Textarea
            type="error"
            placeholder="輸入文字..."
            defaultValue="Lorem ipsum dolor sit amet"
          />
        </TypeRowItem>
      </TypeRow>
    </div>
  ),
};
