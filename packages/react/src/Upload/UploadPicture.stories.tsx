import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { UploadPicture } from '.';

export default {
  title: 'Data Entry/Upload/UploadPicture',
} as Meta;

type PlaygroundStoryArgs = {
  accept: string;
  defaultValue: string;
  disabled: boolean;
  onChange: VoidFunction;
  onDelete: VoidFunction;
  onError: VoidFunction;
  onUploadSuccess: VoidFunction;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Playground: Story<PlaygroundStoryArgs> = ({
  accept,
  defaultValue,
  disabled,
  onChange,
  onDelete,
  onError,
  onUploadSuccess,
}) => {
  const onUpload = async (file: File, setProgress: (progress: number) => void) => {
    const random = Math.floor(Math.random() * 2);

    setProgress(35);

    await delay(1000);

    setProgress(65);

    await delay(1000);

    return new Promise<string>((resolve, reject) => {
      setProgress(99);

      if (random > 0) {
        resolve(URL.createObjectURL(file));
      } else {
        reject();
      }
    });
  };

  return (
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
        onChange={onChange}
        onDelete={onDelete}
        onError={onError}
        onUpload={onUpload}
        onUploadSuccess={onUploadSuccess}
      />
      <UploadPicture
        accept={accept}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={onChange}
        onDelete={onDelete}
      />
    </div>
  );
};

Playground.args = {
  accept: 'image/*',
  defaultValue: 'https://rytass.com/logo.png',
  disabled: false,
  onChange: action('onChange'),
  onDelete: action('onDelete'),
  onError: action('onError'),
  onUploadSuccess: action('onUploadSuccess'),
};
