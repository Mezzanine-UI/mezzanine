import {
  forwardRef,
  Ref,
  useRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import {
  ImageUploader,
  uploadPictureClasses as classes,
} from '@mezzanine-ui/core/upload';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import UploadPictureBlock from './UploadPictureBlock';

export type UploadPictureControl = {
  getData: () => void;
};

export interface UploadPictureProps
  extends
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>,
  | 'children'
  | 'onChange'
  | 'onError'
  | 'value'
  > {
  /**
   * The accept attributes of native input element.
   * @default 'image/*'
   */
  accept?: string;
  /**
   * Provide `controllerRef` if you need detail data of file.
   */
  controllerRef?: Ref<UploadPictureControl | null>;
  /**
   * The default value of uploader.
   */
  defaultValue?: string;
  /**
   * Whether the input which is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
  * Fired after value changed.
  */
  onChange?: (url: string) => void;
  /**
  * Fired after user delete image.
  */
  onDelete?: () => void;
  /**
  * Fired after user upload image failed.
  */
  onError?: (file: File) => void;
  /**
  * Fired when user upload image, need to return Promise<string>.
  * Arg1 is target file, arg2 `setProgress` can set the progress of uploading.
  */
  onUpload?: (file: File, setProgress: (progress: number) => void) => Promise<string>;
  /**
  * Fired after user upload image success.
  */
  onUploadSuccess?: (file: File, url: string) => void;
}

const UploadPicture = forwardRef<HTMLDivElement, UploadPictureProps>(function UploadPicture(props, ref) {
  const {
    accept = 'image/*',
    className,
    controllerRef,
    defaultValue,
    disabled = false,
    onChange,
    onDelete,
    onError,
    onUpload,
    onUploadSuccess,
    style,
  } = props;
  const defaultImageUploader = new ImageUploader(undefined, defaultValue);
  const uploadPictureImageLoader = useRef(defaultImageUploader);

  const onImageUpload = useCallback(
    (files) => {
      if (files.length) {
        const currentFile = files[0];

        uploadPictureImageLoader.current.setNewFile(currentFile);
        uploadPictureImageLoader.current.setPreview();

        if (onUpload) {
          const setProgress = (progress: number) => uploadPictureImageLoader.current.setPercentage(progress);

          uploadPictureImageLoader.current.setLoadingStatus(true);

          onUpload(currentFile, setProgress)
            .then((url: string) => {
              uploadPictureImageLoader.current.setUrl(url);
              uploadPictureImageLoader.current.setLoadingStatus(false);
              setProgress(100);

              if (onUploadSuccess) {
                onUploadSuccess(currentFile, url);
              }
            })
            .catch(() => {
              uploadPictureImageLoader.current.setErrorStatus(true);
              uploadPictureImageLoader.current.setLoadingStatus(false);
              setProgress(100);

              if (onError) {
                onError(currentFile);
              }
            });
        }
      }
    },
    [onUpload, onUploadSuccess, onError],
  );

  const onImageDelete = useCallback(() => {
    uploadPictureImageLoader.current.clear();

    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);

  useImperativeHandle(controllerRef, () => ({
    getData: () => uploadPictureImageLoader.current.getAll(),
  }));

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
      style={style}
    >
      <UploadPictureBlock
        accept={accept}
        disabled={disabled}
        imageLoader={uploadPictureImageLoader.current}
        multiple={false}
        onDelete={onImageDelete}
        onUpload={onImageUpload}
        onValueChange={onChange}
      />
    </div>
  );
});

export default UploadPicture;
