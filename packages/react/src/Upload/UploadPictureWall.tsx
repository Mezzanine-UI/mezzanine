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
  } = props;
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const onImagesUpload = useCallback(
    (files) => {
      if (files.length) {
        files.forEach((currentFile: File) => {
          const reader = new FileReader();

          reader.addEventListener('load', () => {
            setPreviewImages((p) => [...p, reader.result as string]);
          });

          reader.readAsDataURL(currentFile);
        });

        if (onUpload) {
          onUpload(files);
        }
      }
    },
    [onUpload],
  );

  const onImagesDelete = useCallback((event: MouseEvent<HTMLButtonElement>, index: number) => {
    setPreviewImages((p) => [
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
      {previewImages.map((previewImage, index) => (
        <UploadPicture
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          accept={accept}
          disabled={disabled}
          multiple={multiple}
          value={previewImage}
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
