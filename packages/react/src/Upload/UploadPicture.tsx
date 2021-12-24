import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  MouseEventHandler,
  MouseEvent,
} from 'react';
import {
  toUploadPictureCssVars,
  uploadPictureClasses as classes,
} from '@mezzanine-ui/core/upload';
import {
  SpinnerIcon,
  TimesIcon,
  TrashIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import UploadInput, { UploadInputProps } from './UploadInput';

export interface UploadPictureProps
  extends
  UploadInputProps,
  NativeElementPropsWithoutKeyAndRef<'button'> {
  /**
   * Whether the input is error.
   * @default false
   */
  error?: boolean;
  /**
   * Whether the image is uploading.
   * @default false
   */
  loading?: boolean;
  /**
  * Fired after user delete image.
  */
  onDelete?: MouseEventHandler;
  /**
  * The percentage of the upload process.
  * Need loading=true.
  */
  percentage?: number;
  /**
  * The value of image url.
  */
  value?: string;
}

const UploadPicture = forwardRef<HTMLButtonElement, UploadPictureProps>(function UploadPicture(props, ref) {
  const {
    accept = 'image/*',
    className,
    disabled,
    error = false,
    loading = false,
    multiple = false,
    onDelete,
    onUpload,
    percentage,
    style: styleProp,
    value,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
  const cssVars = toUploadPictureCssVars({ percentage });
  const style = {
    ...cssVars,
    ...styleProp,
  };

  useEffect(() => {
    if (value) {
      setPreviewImage(null);
    }
  }, [value]);

  const onImageUpload = useCallback(
    (files) => {
      if (files.length) {
        const currentFile = files[0];

        const reader = new FileReader();

        reader.addEventListener('load', () => {
          setPreviewImage(reader.result);
        });

        reader.readAsDataURL(currentFile);

        if (onUpload) {
          onUpload(files);
        }
      }
    },
    [onUpload],
  );

  const onImageDelete = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setPreviewImage(null);

    if (onDelete) {
      onDelete(event);
    }
  }, [onDelete]);

  const showImage = useMemo(() => (
    (value || previewImage) && !error
  ), [previewImage, value, error]);

  const canDeleteImage = useMemo(() => (
    (showImage || error) && !loading
  ), [showImage, error, loading]);

  return (
    <button
      ref={ref}
      type="button"
      aria-disabled={disabled}
      disabled={disabled}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (!showImage && !error) {
          inputRef.current?.click();
        }

        if (canDeleteImage) {
          onImageDelete(event);
        }
      }}
      className={cx(
        classes.host,
        {
          [classes.loading]: loading,
          [classes.error]: error,
          [classes.disabled]: disabled,
        },
        className,
      )}
      style={style}
    >
      <UploadInput
        ref={inputRef}
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        onUpload={onImageUpload}
      />
      {error ? (
        <div className={classes.group}>
          <Icon icon={TimesIcon} />
          <span className={classes.status}>上傳錯誤</span>
        </div>
      ) : (
        <>
          {showImage ? (
            <>
              <img alt="" src={(value || previewImage) as string} className={classes.preview} />
              {loading ? (
                <div className={classes.group}>
                  <Icon
                    icon={SpinnerIcon}
                    spin
                  />
                  <span className={classes.status}>上傳中...</span>
                </div>
              ) : null}
            </>
          ) : (
            <div className={classes.group}>
              <Icon icon={UploadIcon} />
              <span className={classes.status}>上傳影像</span>
            </div>
          )}
        </>
      )}
      {!disabled && canDeleteImage && (
        <div className={classes.delete}>
          <Icon icon={TrashIcon} />
        </div>
      )}
    </button>
  );
});

export default UploadPicture;
