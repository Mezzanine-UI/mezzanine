import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { UploadInputProps } from './UploadInput';
import { UploadPictureWall } from '.';

export default {
  title: 'Data Entry/Upload/UploadPictureWall',
} as Meta;

interface BasicStoryArgs extends UploadInputProps {
  onDelete: VoidFunction;
}

export const Basic: Story<BasicStoryArgs> = ({
  accept,
  disabled,
  multiple,
  onDelete,
}) => {
  const [value, setValue] = useState<string[]>([]);
  // const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  // const [errorIndices, setErrorIndices] = useState<number[]>([]);
  // const [percentage, setPercentage] = useState<number>(0);

  return (
    <UploadPictureWall
      accept={accept}
      disabled={disabled}
      multiple={multiple}
      value={value}
      onUpload={(files) => {
        files.forEach((file, index) => {
          setTimeout(() => {
            setValue((v) => [...v, URL.createObjectURL(file)]);
          }, 1000 * (index + 1));
        });
      }}
      onDelete={onDelete}
    />
  );
};

Basic.args = {
  accept: 'image/*',
  disabled: false,
  multiple: true,
  onUpload: action('onUpload'),
  onDelete: action('onDelete'),
};
