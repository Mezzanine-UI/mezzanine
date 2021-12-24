import {
  useState,
  useEffect,
  MouseEventHandler,
} from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { UploadInputProps } from './UploadInput';
import UploadPicture from './UploadPicture';

export interface UploadPictureWallItemProps
  extends
  UploadInputProps,
  NativeElementPropsWithoutKeyAndRef<'div'> {
  onDelete?: MouseEventHandler;
  previewFile?: File;
}

const UploadPictureWallItem = (props: UploadPictureWallItemProps) => {
  const {
    accept,
    className,
    disabled,
    multiple,
    previewFile,
    onDelete,
    style,
  } = props;
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    if (previewFile) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        setPreviewImage(reader.result as string);
      });

      reader.readAsDataURL(previewFile);
    }
  }, [previewFile]);

  return (
    <div
      className={cx(
        className,
      )}
      style={style}
    >
      <UploadPicture
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        onDelete={onDelete}
        value={previewImage}
      />
    </div>
  );
};

export default UploadPictureWallItem;
