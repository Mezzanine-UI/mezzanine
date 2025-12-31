import { Meta, StoryFn } from '@storybook/react-webpack5';
import Alert, { AlertProps } from './Alert';

export default {
  title: 'V1/Alert',
} as Meta;

type PlaygroundArgs = Required<Pick<AlertProps, 'children' | 'severity'>>;

export const Playground: StoryFn<PlaygroundArgs> = ({
  children,
  severity,
  ...args
}) => (
  <Alert severity={severity} {...args}>
    {children}
  </Alert>
);

Playground.args = {
  children: '提示訊息',
};

Playground.argTypes = {
  severity: {
    options: ['success', 'warning', 'error'],
    control: {
      type: 'select',
    },
  },
};
