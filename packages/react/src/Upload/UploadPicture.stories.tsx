import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { UploadInputProps } from './UploadInput';
import { UploadPicture } from '.';

export default {
  title: 'Data Entry/Upload/UploadPicture',
} as Meta;

type PlaygroundStoryArgs = UploadInputProps;

export const Playground: Story<PlaygroundStoryArgs> = ({
  accept,
  disabled,
  multiple,
}) => {
  const [value, setValue] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  return (
    <UploadPicture
      accept={accept}
      disabled={disabled}
      multiple={multiple}
      value={value}
      loading={loading}
      percentage={percentage}
      error={error}
      onUpload={((uploadFiles) => {
        const random = Math.floor(Math.random() * 2);

        setError(false);
        setLoading(true);
        setPercentage(60);

        setTimeout(() => {
          if (random > 0) {
            setValue(URL.createObjectURL(uploadFiles[0]));
          } else {
            setError(true);
          }

          setLoading(false);
          setPercentage(0);
        }, 1000);
      })}
      onDelete={() => {
        setValue('');
        setError(false);
      }}
    />
  );
};

Playground.args = {
  accept: 'image/*',
  disabled: false,
  multiple: false,
};

interface BasicStoryArgs extends UploadInputProps {
  onDelete: VoidFunction;
}

export const Basic: Story<BasicStoryArgs> = ({
  accept,
  disabled,
  multiple,
  onUpload,
  onDelete,
}) => (
  <div
    style={{
      display: 'inline-grid',
      gridAutoFlow: 'column',
      gap: '16px',
    }}
  >
    <UploadPicture
      accept={accept}
      disabled={disabled}
      multiple={multiple}
      onUpload={onUpload}
      onDelete={onDelete}
    />
    <UploadPicture
      accept={accept}
      disabled={disabled}
      multiple={multiple}
      value="https://rytass.com/logo.png"
      loading
      percentage={55}
      onUpload={onUpload}
      onDelete={onDelete}
    />
    <UploadPicture
      accept={accept}
      disabled={disabled}
      multiple={multiple}
      value="https://rytass.com/logo.png"
      onUpload={onUpload}
      onDelete={onDelete}
    />
    <UploadPicture
      accept={accept}
      disabled={disabled}
      multiple={multiple}
      error
      onDelete={onDelete}
    />
  </div>
);

Basic.args = {
  accept: 'image/*',
  disabled: false,
  multiple: false,
  onUpload: action('onUpload'),
  onDelete: action('onDelete'),
};
