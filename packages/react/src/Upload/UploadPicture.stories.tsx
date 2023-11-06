import { Meta, StoryFn } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { UploadPicture } from '.';

export default {
  title: 'Data Entry/Upload/UploadPicture',
} as Meta;

type PlaygroundStoryArgs = {
  accept: string;
  defaultValue: string;
  defaultUploadLabel: string;
  defaultUploadingLabel: string;
  defaultUploadErrorLabel: string;
  disabled: boolean;
  onChange: VoidFunction;
  onDelete: VoidFunction;
  onError: VoidFunction;
  onUploadSuccess: VoidFunction;
};

function delay(ms: number) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

export const Playground: StoryFn<PlaygroundStoryArgs> = ({
  accept,
  defaultValue,
  defaultUploadLabel,
  defaultUploadingLabel,
  defaultUploadErrorLabel,
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
        defaultUploadLabel={defaultUploadLabel}
        defaultUploadingLabel={defaultUploadingLabel}
        defaultUploadErrorLabel={defaultUploadErrorLabel}
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
        defaultUploadLabel={defaultUploadLabel}
        defaultUploadingLabel={defaultUploadingLabel}
        defaultUploadErrorLabel={defaultUploadErrorLabel}
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
  defaultUploadLabel: 'Upload',
  defaultUploadingLabel: 'Uploading...',
  defaultUploadErrorLabel: 'Upload Failed',
  disabled: false,
  onChange: action('onChange'),
  onDelete: action('onDelete'),
  onError: action('onError'),
  onUploadSuccess: action('onUploadSuccess'),
};
