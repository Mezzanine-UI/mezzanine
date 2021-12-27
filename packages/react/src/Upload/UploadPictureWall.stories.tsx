import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { UploadInputProps } from './UploadInput';
import { UploadPictureWall } from '.';

export default {
  title: 'Data Entry/Upload/UploadPictureWall',
} as Meta;

interface BasicStoryArgs extends UploadInputProps {
  onDelete: VoidFunction;
}

// function uploadImage(file: File) {
//   const random = Math.floor(Math.random() * 2);

//   return new Promise<string>((resolve, reject) => {
//     setTimeout(() => {
//       if (random > 0) {
//         resolve(URL.createObjectURL(file));
//       } else {
//         reject();
//       }
//     }, 1000);
//   });
// }

export const Basic: Story<BasicStoryArgs> = ({
  accept,
  disabled,
  multiple,
  onUpload,
  onDelete,
}) => (
  <UploadPictureWall
    accept={accept}
    disabled={disabled}
    multiple={multiple}
    onUpload={onUpload}
    onDelete={onDelete}
  />
);

Basic.args = {
  accept: 'image/*',
  disabled: false,
  multiple: true,
  onUpload: action('onUpload'),
  onDelete: action('onDelete'),
};
