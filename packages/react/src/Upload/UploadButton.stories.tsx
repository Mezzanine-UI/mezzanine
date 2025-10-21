import { Meta, StoryFn } from '@storybook/react-webpack5';
import { action } from 'storybook/actions';
import { UploadInputProps } from './UploadInput';
import { UploadButton } from '.';

export default {
  title: 'Data Entry/Upload/UploadButton',
} as Meta;

type PlaygroundStoryArgs = Required<UploadInputProps>;

export const Playground: StoryFn<PlaygroundStoryArgs> = ({
  accept,
  disabled,
  multiple,
  onUpload,
}) => (
  <UploadButton
    variant="outlined"
    accept={accept}
    disabled={disabled}
    multiple={multiple}
    onUpload={onUpload}
  >
    upload
  </UploadButton>
);

Playground.args = {
  accept: 'image/*',
  disabled: false,
  multiple: false,
  onUpload: action('onUpload'),
};
