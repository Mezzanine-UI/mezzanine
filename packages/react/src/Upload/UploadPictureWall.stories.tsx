import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { UploadInputProps } from './UploadInput';
import { UploadPictureWall } from '.';

export default {
  title: 'Data Entry/Upload/UploadPictureWall',
} as Meta;

interface BasicStoryArgs extends Omit<UploadInputProps, 'multiple'> {
  onDelete: VoidFunction;
}

export const Basic: Story<BasicStoryArgs> = () => (
  <UploadPictureWall />
);

Basic.args = {
  accept: 'image/*',
  disabled: false,
  onUpload: action('onUpload'),
  onDelete: action('onDelete'),
};
