import {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  MouseEventHandler,
  MouseEvent,
} from 'react';
import {
  ImageUploader,
  toUploadPictureBlockCssVars,
  uploadPictureBlockClasses as classes,
} from '@mezzanine-ui/core/upload';
import {
  SpinnerIcon,
  TimesIcon,
  TrashIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { usePreviousValue } from '../hooks/usePreviousValue';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import UploadInput from './UploadInput';

export interface UploadPictureBlockProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'button'>,
    'children' | 'onChange' | 'value'
  > {
  accept?: string;
  /** @default '上傳錯誤' */
  defaultUploadErrorLabel?: string;
  /** @default '上傳中...' */
  defaultUploadingLabel?: string;
  /** @default '上傳影像' */
  defaultUploadLabel?: string;
  fileHost?: string;
  imageLoader: ImageUploader;
  multiple?: boolean;
  onDelete?: MouseEventHandler;
  onUpload?: (files: File[]) => void;
  onValueChange?: (value: string) => void;
}

const UploadPictureBlock = forwardRef<
  HTMLButtonElement,
  UploadPictureBlockProps
>(function UploadPictureBlock(props, ref) {
  const {
    accept = 'image/*',
    defaultUploadErrorLabel = '上傳錯誤',
    defaultUploadingLabel = '上傳中...',
    defaultUploadLabel = '上傳影像',
    disabled = false,
    imageLoader,
    multiple = false,
    onDelete,
    onUpload,
    onValueChange,
    fileHost,
  } = props;
  const [previewImage, setPreviewImage] = useState<string>(
    imageLoader.getPreview() || '',
  );
  const [value, setValue] = useState<string>(imageLoader.getUrl() || '');
  const [percentage, setPercentage] = useState<number>(
    imageLoader.getPercentage() || 0,
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    imageLoader.getIsLoading() || false,
  );
  const [isError, setIsError] = useState<boolean>(
    imageLoader.getIsError() || false,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const prevValue = usePreviousValue(value);

  useEffect(() => {
    if (onValueChange && value !== prevValue) {
      onValueChange(value);
    }
  }, [onValueChange, prevValue, value]);

  const setImageUploaderData = useCallback(() => {
    const data = imageLoader.getAll();

    setPreviewImage(data.preview);
    setValue(data.url);
    setPercentage(data.percentage);
    setIsLoading(data.isLoading);
    setIsError(data.isError);
  }, [imageLoader]);

  useEffect(() => {
    imageLoader.on('fileChange', () => {
      setImageUploaderData();
    });

    imageLoader.on('previewChange', () => {
      setPreviewImage(imageLoader.getPreview());
    });

    imageLoader.on('percentageChange', () => {
      setPercentage(imageLoader.getPercentage());
    });

    imageLoader.on('urlChange', () => {
      setValue(imageLoader.getUrl());
    });

    imageLoader.on('loadingStatusChange', () => {
      setIsLoading(imageLoader.getIsLoading());
    });

    imageLoader.on('errorStatusChange', () => {
      setIsError(imageLoader.getIsError());
    });

    imageLoader.on('clear', () => {
      setImageUploaderData();
    });

    return () => {
      imageLoader.removeAllListeners();
    };
  }, [imageLoader, setImageUploaderData]);

  const cssVars = toUploadPictureBlockCssVars({ percentage });
  const style = {
    ...cssVars,
  };

  const showImage = useMemo(
    () => (value || previewImage) && !isError,
    [previewImage, value, isError],
  );

  const canDeleteImage = useMemo(
    () => (showImage || isError) && !isLoading,
    [showImage, isError, isLoading],
  );

  return (
    <button
      ref={ref}
      type="button"
      aria-disabled={disabled}
      disabled={disabled}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (!showImage && !isError) {
          inputRef.current?.click();
        }

        if (canDeleteImage && onDelete) {
          onDelete(event);
        }
      }}
      className={cx(classes.host, {
        [classes.loading]: isLoading,
        [classes.error]: isError,
        [classes.disabled]: disabled,
      })}
      style={style}
    >
      <UploadInput
        ref={inputRef}
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        onUpload={onUpload}
      />
      {isError ? (
        <div className={classes.group}>
          <Icon icon={TimesIcon} />
          <span className={classes.status}>{defaultUploadErrorLabel}</span>
        </div>
      ) : (
        <>
          {showImage ? (
            <>
              <img
                alt=""
                src={
                  (value ? `${fileHost || ''}${value}` : previewImage) as string
                }
                className={classes.preview}
              />
              {isLoading ? (
                <div className={classes.group}>
                  <Icon icon={SpinnerIcon} spin />
                  <span className={classes.status}>
                    {defaultUploadingLabel}
                  </span>
                </div>
              ) : null}
            </>
          ) : (
            <div className={classes.group}>
              <Icon icon={UploadIcon} />
              <span className={classes.status}>{defaultUploadLabel}</span>
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

export default UploadPictureBlock;
