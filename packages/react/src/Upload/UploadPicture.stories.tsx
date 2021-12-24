import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { UploadInputProps } from './UploadInput';
import { UploadPicture } from '.';

export default {
  title: 'Data Entry/Upload/UploadPicture',
} as Meta;

type PlaygroundStoryArgs = Omit<UploadInputProps, 'multiple'>;

export const Playground: Story<PlaygroundStoryArgs> = ({
  accept,
  disabled,
}) => {
  const [value, setValue] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  return (
    <UploadPicture
      accept={accept}
      disabled={disabled}
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
};

interface BasicStoryArgs extends Omit<UploadInputProps, 'multiple'> {
  onDelete: VoidFunction;
}

export const Basic: Story<BasicStoryArgs> = ({
  accept,
  disabled,
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
      onUpload={onUpload}
      onDelete={onDelete}
    />
    <UploadPicture
      accept={accept}
      disabled={disabled}
      value="https://rytass.com/logo.png"
      loading
      percentage={55}
      onUpload={onUpload}
      onDelete={onDelete}
    />
    <UploadPicture
      accept={accept}
      disabled={disabled}
      value="https://rytass.com/logo.png"
      onUpload={onUpload}
      onDelete={onDelete}
    />
    <UploadPicture
      accept={accept}
      disabled={disabled}
      error
      onDelete={onDelete}
    />
  </div>
);

Basic.args = {
  accept: 'image/*',
  disabled: false,
  onUpload: action('onUpload'),
  onDelete: action('onDelete'),
};
