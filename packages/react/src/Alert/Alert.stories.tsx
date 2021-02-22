import { Meta, Story } from '@storybook/react';
import Alert, { AlertProps } from './Alert';

export default {
  title: 'Feedback/Alert',
} as Meta;

type PlaygroundArgs = Required<Pick<AlertProps, 'children' | 'severity'>>;

export const Playground: Story<PlaygroundArgs> = ({ children, severity, ...args }) => (
  <Alert severity={severity} {...args}>
    {children}
  </Alert>
);

Playground.args = {
  children: '提示訊息',
};

Playground.argTypes = {
  severity: {
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
