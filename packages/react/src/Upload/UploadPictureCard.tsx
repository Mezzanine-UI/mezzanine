'use client';

import {
  forwardRef,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  uploadPictureCardClasses as classes,
  UploadItemStatus,
  UploadPictureCardImageFit,
  UploadPictureCardSize,
} from '@mezzanine-ui/core/upload';
import type { IconDefinition } from '@mezzanine-ui/icons';

import {
  DownloadIcon,
  FileIcon,
  ImageIcon,
  ResetIcon,
  SpinnerIcon,
  TrashIcon,
  ZoomInIcon,
} from '@mezzanine-ui/icons';

import Button from '../Button';
import ClearActions from '../ClearActions';
import Icon from '../Icon';
import Typography from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { isImageFile } from './upload-utils';

export interface UploadPictureCardAriaLabels {
  /**
   * Aria label for cancel upload button.
   * @default 'Cancel upload'
   */
  cancelUpload?: string;
  /**
   * Aria label for uploading status.
   * @default 'Uploading'
   */
  uploading?: string;
  /**
   * Aria label for zoom in button.
   * @default 'Zoom in image'
   */
  zoomIn?: string;
  /**
   * Aria label for download button.
   * @default 'Download file'
   */
  download?: string;
  /**
   * Aria label for delete button.
   * @default 'Delete file'
   */
  delete?: string;
  /**
   * Aria label for reload/retry button.
   * @default 'Retry upload'
   */
  reload?: string;
}

export interface UploadPictureCardProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Aria labels for accessibility. Allows customization for internationalization.
   */
  ariaLabels?: UploadPictureCardAriaLabels;
  /**
   * The file to display.
   * Required when displaying local files (before upload).
   * Optional when `url` is provided for already uploaded files.
   */
  file?: File;
  /**
   * The URL of the uploaded file.
   * When provided, this will be used instead of creating a blob URL from `file`.
   * Useful for displaying files that have already been uploaded to the server.
   *
   * @note If only `url` is provided (without `file`), the file type will be inferred
   * from the URL extension. For accurate type detection, provide `file` when available.
   */
  url?: string;
  /**
   * The id of the file id to identify the file.
   */
  id?: string;
  /**
   * The status of the upload picture card.
   * @default 'loading'
   */
  status?: UploadItemStatus;
  /**
   * The size of the upload picture card.
   * @default 'main'
   */
  size?: UploadPictureCardSize;
  /**
   * The image fit of the upload picture card.
   * @default 'cover'
   */
  imageFit?: UploadPictureCardImageFit;
  /**
   * Whether the upload picture card is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Error message to display when status is 'error'.
   */
  errorMessage?: string;
  /**
   * Error icon to display when status is 'error'.
   */
  errorIcon?: IconDefinition;
  /**
   * When delete icon is clicked, this callback will be fired.
   */
  onDelete?: MouseEventHandler;
  /**
   * When zoom in icon is clicked, this callback will be fired.
   */
  onZoomIn?: MouseEventHandler;
  /**
   * When download icon is clicked, this callback will be fired.
   */
  onDownload?: MouseEventHandler;
  /**
   * When reload icon is clicked, this callback will be fired.
   */
  onReload?: MouseEventHandler;
}

/**
 * The react component for `mezzanine` upload picture card.
 */
const UploadPictureCard = forwardRef<HTMLDivElement, UploadPictureCardProps>(
  function UploadPictureCard(props, ref) {
    const {
      ariaLabels,
      className,
      file,
      url,
      status = 'loading',
      imageFit = 'cover',
      size = 'main',
      disabled = false,
      errorMessage,
      errorIcon,
      onDelete,
      onZoomIn,
      onDownload,
      onReload,
      ...rest
    } = props;

    const defaultAriaLabels: Required<UploadPictureCardAriaLabels> = {
      cancelUpload: 'Cancel upload',
      uploading: 'Uploading',
      zoomIn: 'Zoom in image',
      download: 'Download file',
      delete: 'Delete file',
      reload: 'Retry upload',
    };

    const labels = { ...defaultAriaLabels, ...ariaLabels };

    const isImage = useMemo(() => {
      return isImageFile(file, url);
    }, [file, url]);

    const fileName = useMemo(() => {
      if (props.file?.name && !props.url) return props.file.name;
      if (props.url) {
        try {
          const url = new URL(props.url);
          const pathname = url.pathname;
          const filename = pathname.split('/').pop() || '';
          return filename;
        } catch {
          const urlWithoutQuery = props.url.split('?')[0].split('#')[0];
          return urlWithoutQuery.split('/').pop() || '';
        }
      }
      return '';
    }, [props.file?.name, props.url]);

    const [imageUrl, setImageUrl] = useState<string>('');

    const errorIconContent = useMemo(() => {
      if (errorIcon) {
        return errorIcon;
      }

      return isImage ? ImageIcon : FileIcon;
    }, [isImage, errorIcon]);

    const errorMessageContent = useMemo(() => {
      if (errorMessage) {
        return errorMessage;
      }

      return fileName ? fileName : 'Upload error';
    }, [fileName, errorMessage]);

    // Warn if both file and url are missing
    useEffect(() => {
      if (!file && !url) {
        console.warn(
          'UploadPictureCard: Both `file` and `url` props are missing. At least one should be provided to display the upload picture card.',
        );
      }
    }, [file, url]);

    useEffect(() => {
      if (url && isImage) {
        setImageUrl(url);
        return undefined;
      }

      if (file && isImage) {
        try {
          const blobUrl = URL.createObjectURL(file);
          setImageUrl(blobUrl);

          return () => {
            URL.revokeObjectURL(blobUrl);
          };
        } catch (error) {
          console.error('Failed to create object URL for image:', error);
          setImageUrl('');
        }
      } else {
        setImageUrl('');
      }

      return undefined;
    }, [file, url, isImage]);

    if (!isImage && size === 'minor') {
      console.warn(
        'UploadPictureCard: minor size is not supported for non-image files',
      );

      return null;
    }

    return (
      <div
        className={cx(
          classes.host,
          classes.size(size),
          disabled && classes.disabled,
          className,
        )}
        aria-disabled={disabled}
        ref={ref}
        role="group"
        tabIndex={disabled ? -1 : 0}
        {...rest}
      >
        <div className={classes.container}>
          {isImage && imageUrl && status !== 'error' && (
            <img
              alt={fileName}
              src={imageUrl}
              style={{
                objectFit: imageFit,
                objectPosition: 'center',
              }}
            />
          )}
          {status === 'done' && size !== 'minor' && !isImage && (
            <div className={classes.content}>
              <Icon icon={FileIcon} color="brand" size={16} />
              <Typography className={classes.name} ellipsis>
                {fileName}
              </Typography>
            </div>
          )}
          {status === 'error' && size !== 'minor' && (
            <div
              className={classes.errorMessage}
              role="alert"
              aria-live="polite"
            >
              <Icon icon={errorIconContent} color="error" size={16} />
              <Typography className={classes.errorMessageText}>
                {errorMessageContent}
              </Typography>
            </div>
          )}
          <div className={cx(classes.actions, classes.actionsStatus(status))}>
            {status === 'loading' && size !== 'minor' && (
              <>
                <ClearActions
                  type="embedded"
                  variant="contrast"
                  onClick={onDelete}
                  className={classes.clearActionsIcon}
                  aria-label={labels.cancelUpload}
                />
                <div
                  className={classes.loadingIcon}
                  aria-label={labels.uploading}
                >
                  <Icon icon={SpinnerIcon} color="fixed-light" spin size={32} />
                </div>
              </>
            )}
            {status === 'done' && size !== 'minor' && (
              <>
                <div className={classes.tools}>
                  <div className={classes.toolsContent}>
                    <Button
                      variant="base-secondary"
                      size="minor"
                      icon={ZoomInIcon}
                      iconType="icon-only"
                      onClick={onZoomIn}
                      aria-label={labels.zoomIn}
                    />
                    <Button
                      variant="base-secondary"
                      size="minor"
                      iconType="icon-only"
                      icon={DownloadIcon}
                      onClick={onDownload}
                      aria-label={labels.download}
                    />
                    <Button
                      variant="base-secondary"
                      size="minor"
                      iconType="icon-only"
                      icon={TrashIcon}
                      onClick={onDelete}
                      aria-label={labels.delete}
                    />
                  </div>
                </div>
              </>
            )}
            {status === 'error' && size !== 'minor' && (
              <>
                <div className={classes.tools}>
                  <div className={classes.toolsContent}>
                    <Button
                      variant="base-secondary"
                      size="minor"
                      iconType="icon-only"
                      icon={ResetIcon}
                      onClick={onReload}
                      aria-label={labels.reload}
                    />
                    <Button
                      variant="base-secondary"
                      size="minor"
                      iconType="icon-only"
                      icon={TrashIcon}
                      onClick={onDelete}
                      aria-label={labels.delete}
                    />
                  </div>
                </div>
              </>
            )}
            {size === 'minor' && (
              <Icon icon={ZoomInIcon} color="fixed-light" size={24} />
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default UploadPictureCard;
