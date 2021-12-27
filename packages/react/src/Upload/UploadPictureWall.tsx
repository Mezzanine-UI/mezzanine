import {
  forwardRef,
  useState,
  useCallback,
  MouseEvent,
} from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { UploadInputProps } from './UploadInput';
import UploadPicture from './UploadPicture';
import UploadPictureWallItem from './UploadPictureWallItem';

export interface UploadPictureWallProps
  extends
  UploadInputProps,
  NativeElementPropsWithoutKeyAndRef<'div'> {
  onDelete?(event: MouseEvent<HTMLButtonElement>, index: number): void;
  value?: string[] ;
}

const UploadPictureWall = forwardRef<HTMLDivElement, UploadPictureWallProps>(function UploadPictureWall(props, ref) {
  const {
    accept,
    className,
    disabled,
    multiple,
    onUpload,
    onDelete,
    style,
    // value,
  } = props;
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);

  const onImagesUpload = useCallback(
    (files) => {
      if (files.length) {
        setPreviewFiles(files);

        if (onUpload) {
          onUpload(files);
        }
      }
    },
    [onUpload],
  );

  const onImagesDelete = useCallback((event: MouseEvent<HTMLButtonElement>, index: number) => {
    setPreviewFiles((p) => [
      ...p.slice(0, index),
      ...p.slice(index + 1),
    ]);

    if (onDelete) {
      onDelete(event, index);
    }
  }, [onDelete]);

  return (
    <div
      ref={ref}
      className={cx(
        className,
      )}
      style={style}
    >
      {previewFiles.map((previewFile, index) => (
        <UploadPictureWallItem
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          accept={accept}
          disabled={disabled}
          multiple={multiple}
          previewFile={previewFile}
          onDelete={(event: MouseEvent<HTMLButtonElement>) => onImagesDelete(event, index)}
        />
      ))}
      <UploadPicture
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        onUpload={onImagesUpload}
      />
    </div>
  );
});

export default UploadPictureWall;
