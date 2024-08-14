import { MouseEventHandler, useEffect, useRef } from 'react';
import {
  ImageUploader,
  uploadPictureWallClasses as classes,
} from '@mezzanine-ui/core/upload';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import UploadPictureBlock, {
  UploadPictureBlockProps,
} from './UploadPictureBlock';

export interface UploadPictureWallItemProps
  extends Pick<
      UploadPictureBlockProps,
      'defaultUploadErrorLabel' | 'defaultUploadingLabel' | 'defaultUploadLabel'
    >,
    Omit<
      NativeElementPropsWithoutKeyAndRef<'div'>,
      'value' | 'onChange' | 'children'
    > {
  accept?: string;
  disabled?: boolean;
  fileHost?: string;
  imageLoader: ImageUploader;
  multiple?: boolean;
  onDelete?: MouseEventHandler;
  onUpload?: (files: File[]) => void;
}

const UploadPictureWallItem = (props: UploadPictureWallItemProps) => {
  const {
    accept,
    defaultUploadErrorLabel,
    defaultUploadingLabel,
    defaultUploadLabel,
    disabled,
    imageLoader,
    multiple,
    onDelete,
    onUpload,
    fileHost,
  } = props;
  const loader = useRef(imageLoader);

  useEffect(() => {
    if (!loader.current.getPreview()) {
      loader.current.setPreview();
    }
  }, []);

  return (
    <div className={cx(classes.item)}>
      <UploadPictureBlock
        accept={accept}
        defaultUploadErrorLabel={defaultUploadErrorLabel}
        defaultUploadingLabel={defaultUploadingLabel}
        defaultUploadLabel={defaultUploadLabel}
        disabled={disabled}
        imageLoader={loader.current}
        multiple={multiple}
        onDelete={onDelete}
        onUpload={onUpload}
        fileHost={fileHost}
      />
    </div>
  );
};

export default UploadPictureWallItem;
