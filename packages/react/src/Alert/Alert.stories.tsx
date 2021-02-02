import { Meta, Story } from '@storybook/react';
import Alert, { AlertProps } from './Alert';

export default {
  title: 'Feedback/Alert',
} as Meta;

type PlaygroundArgs = Required<Pick<AlertProps, 'children' | 'status'>>;

export const Playground: Story<PlaygroundArgs> = ({ children, status, ...args }) => (
  <Alert status={status} {...args}>
    {children}
  </Alert>
);

Playground.args = {
  children: '提示訊息',
};

Playground.argTypes = {
  children: {
    control: {
      type: 'text',
    },
  },
  status: {
    control: {
      type: 'select',
      options: [
        'success',
        'warning',
        'error',
      ],
    },
  },
};
