import { Meta, StoryFn } from '@storybook/react';
import Alert, { AlertProps } from './Alert';

export default {
  title: 'Feedback/Alert',
} as Meta;

type PlaygroundArgs = Required<Pick<AlertProps, 'children' | 'severity'>>;

export const Playground: StoryFn<PlaygroundArgs> = ({ children, severity, ...args }) => (
  <Alert severity={severity} {...args}>
    {children}
  </Alert>
);

Playground.args = {
  children: '提示訊息',
};

Playground.argTypes = {
  severity: {
    options: [
      'success',
      'warning',
      'error',
    ],
    control: {
      type: 'select',
    },
  },
};
