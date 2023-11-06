import { Meta, StoryFn } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { UploadPictureWall } from '.';

export default {
  title: 'Data Entry/Upload/UploadPictureWall',
} as Meta;

function delay(ms: number) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

function upload(file: File) {
  const random = Math.floor(Math.random() * 10);

  return new Promise<string>((resolve, reject) => {
    if (random > 1) {
      const url = URL.createObjectURL(file);

      resolve(url);
    } else {
      reject();
    }
  });
}

interface SingleStoryArgs {
  accept: string;
  defaultValues: string[];
  defaultUploadLabel: string;
  defaultUploadingLabel: string;
  defaultUploadErrorLabel: string;
  disabled: boolean;
  fileHost: string;
  multiple: boolean;
  onChange: VoidFunction;
  onDelete: VoidFunction;
  onError: VoidFunction;
  onUploadSuccess: VoidFunction;
  parallel: boolean;
}

export const Single: StoryFn<SingleStoryArgs> = ({
  accept,
  defaultValues,
  defaultUploadLabel,
  defaultUploadingLabel,
  defaultUploadErrorLabel,
  disabled,
  fileHost,
  multiple,
  onChange,
  onDelete,
  onError,
  onUploadSuccess,
  parallel,
}) => {
  const uploadImage = async (file: File, setProgress: (progress: number) => void) => {
    setProgress(35);

    await delay(1000);

    setProgress(65);

    await delay(1000);

    setProgress(99);

    return upload(file);
  };

  return (
    <div style={{ display: 'flex' }}>
      <UploadPictureWall
        accept={accept}
        defaultValues={defaultValues}
        defaultUploadLabel={defaultUploadLabel}
        defaultUploadingLabel={defaultUploadingLabel}
        defaultUploadErrorLabel={defaultUploadErrorLabel}
        disabled={disabled}
        fileHost={fileHost}
        maxLength={3}
        multiple={multiple}
        onChange={onChange}
        onDelete={onDelete}
        onError={onError}
        onUpload={uploadImage}
        onUploadSuccess={onUploadSuccess}
        parallel={parallel}
      />
    </div>
  );
};

Single.args = {
  accept: 'image/*',
  defaultValues: ['https://rytass.com/logo.png', 'https://rytass.com/logo.png', 'https://rytass.com/logo.png'],
  defaultUploadLabel: 'Upload',
  defaultUploadingLabel: 'Uploading...',
  defaultUploadErrorLabel: 'Upload Failed',
  disabled: false,
  fileHost: '',
  multiple: true,
  onChange: action('onChange'),
  onDelete: action('onDelete'),
  onError: action('onError'),
  onUploadSuccess: action('onUploadSuccess'),
  parallel: false,
};

interface MultipleStoryArgs {
  accept: string;
  defaultValues: string[];
  defaultUploadLabel: string;
  defaultUploadingLabel: string;
  defaultUploadErrorLabel: string;
  disabled: boolean;
  fileHost: string;
  multiple: boolean;
  onChange: VoidFunction;
  onDelete: VoidFunction;
  onError: VoidFunction;
  onUploadSuccess: VoidFunction;
}

export const Multiple: StoryFn<MultipleStoryArgs> = ({
  accept,
  defaultValues,
  defaultUploadLabel,
  defaultUploadingLabel,
  defaultUploadErrorLabel,
  disabled,
  fileHost,
  multiple,
  onChange,
  onDelete,
  onError,
  onUploadSuccess,
}) => {
  const uploadImages = async (files: File[], setProgress: (progress: number) => void) => {
    setProgress(25);

    await delay(1000);

    setProgress(55);

    await delay(1000);

    setProgress(85);

    return Promise.all(files.map((file) => upload(file)));
  };

  return (
    <div style={{ display: 'flex' }}>
      <UploadPictureWall
        accept={accept}
        defaultValues={defaultValues}
        defaultUploadLabel={defaultUploadLabel}
        defaultUploadingLabel={defaultUploadingLabel}
        defaultUploadErrorLabel={defaultUploadErrorLabel}
        disabled={disabled}
        fileHost={fileHost}
        multiple={multiple}
        onChange={onChange}
        onDelete={onDelete}
        onError={onError}
        onMultiUpload={uploadImages}
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
};

Multiple.args = {
  accept: 'image/*',
  defaultValues: ['https://rytass.com/logo.png', 'https://rytass.com/logo.png', 'https://rytass.com/logo.png'],
  defaultUploadLabel: 'Upload',
  defaultUploadingLabel: 'Uploading...',
  defaultUploadErrorLabel: 'Upload Failed',
  disabled: false,
  fileHost: '',
  multiple: true,
  onChange: action('onChange'),
  onDelete: action('onDelete'),
  onError: action('onError'),
  onUploadSuccess: action('onUploadSuccess'),
};
