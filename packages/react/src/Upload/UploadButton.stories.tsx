import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { UploadInputProps } from './UploadInput';
import { UploadButton } from '.';

export default {
  title: 'Data Entry/Upload/UploadButton',
} as Meta;

type PlaygroundStoryArgs = Required<UploadInputProps>;

export const Playground: Story<PlaygroundStoryArgs> = ({
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
