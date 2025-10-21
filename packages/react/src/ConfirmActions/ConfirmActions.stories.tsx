import { action } from 'storybook/actions';
import { StoryFn, Meta } from '@storybook/react-webpack5';
import { ButtonSize } from '../Button';
import ConfirmActions, { ConfirmActionsProps } from '.';

export default {
  title: 'Feedback/ConfirmActions',
} as Meta;

const sizes: ButtonSize[] = ['small', 'medium', 'large'];

type PlaygroundStoryArgs = ConfirmActionsProps;

export const Playground: StoryFn<PlaygroundStoryArgs> = ({
  cancelText,
  confirmText,
  danger,
  loading,
  onCancel,
  onConfirm,
  size,
}) => (
  <ConfirmActions
    cancelText={cancelText}
    confirmText={confirmText}
    danger={danger}
    loading={loading}
    onCancel={onCancel}
    onConfirm={onConfirm}
    size={size}
  />
);

Playground.args = {
  cancelText: 'cancel',
  confirmText: 'ok',
  danger: false,
  loading: false,
  onCancel: action('onCancel'),
  onConfirm: action('onConfirm'),
  size: 'medium',
};

Playground.argTypes = {
  size: {
    options: sizes,
    control: {
      type: 'select',
    },
  },
};
