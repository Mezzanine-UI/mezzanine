'use client';

import {
  uploadItemClasses as classes,
  UploadItemSize,
  type UploadItemStatus,
  type UploadItemType
} from '@mezzanine-ui/core/upload';
import { forwardRef, MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';

import { DangerousFilledIcon, DownloadIcon, FileIcon, IconDefinition, ResetIcon, SpinnerIcon, TrashIcon } from '@mezzanine-ui/icons';
import ClearActions from '../ClearActions';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import Typography from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import UploadPictureCard from './UploadPictureCard';

export interface UploadItemProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The file to display.
   * Required when displaying local files (before upload).
   * Optional when `url` is provided for already uploaded files.
   */
  file?: File;
  /**
   * The URL of the uploaded file.
   * When provided, this will be used to display files that have already been uploaded to the server.
   * Useful for loading file lists from the backend.
   */
  url?: string;
  /**
   * The id of the file id to identify the file.
   */
  id?: string;
  /**
   * The file size to display (optional).
   */
  size?: UploadItemSize;
  /**
   * The type of the item.
   * @default 'icon'
   */
  type?: UploadItemType;
  /**
   * Custom icon for the item.
   */
  icon?: IconDefinition;
  /**
   * Whether to show the file size.
   */
  showFileSize?: boolean;
  /**
   * Whether the item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
  * The status of the item.
  * @default 'loading'
  */
  status: UploadItemStatus;
  /**
   * The error message to display when status is 'error'.
   */
  errorMessage?: string;
  /**
   * The error icon to display when status is 'error'.
   */
  errorIcon?: IconDefinition;
  /**
   * When cancel icon is clicked, this callback will be fired.
   */
  onCancel?: MouseEventHandler;
  /**
   * When delete icon is clicked, this callback will be fired.
   */
  onDelete?: MouseEventHandler;
  /**
   * When reload icon is clicked, this callback will be fired.
   */
  onReload?: MouseEventHandler;
  /**
   * When download icon is clicked, this callback will be fired.
   */
  onDownload?: MouseEventHandler;
}

/**
 * The react component for `mezzanine` upload item.
 */
const UploadItem = forwardRef<HTMLDivElement, UploadItemProps>(
  function UploadItem(props, ref) {
    const {
      className,
      icon,
      status = 'loading',
      size = 'main',
      showFileSize = true,
      disabled = false,
      type = 'icon',
      onCancel,
      onDelete,
      onDownload,
      onReload,
      errorMessage,
      errorIcon,
      ...rest
    } = props;

    // Determine file type: prefer file.type, otherwise infer from URL extension
    const resolvedFileType = useMemo(() => {
      if (props.file?.type) return props.file.type;
      if (props.url) {
        const extension = props.url.split('.').pop()?.toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
        if (extension && imageExtensions.includes(extension)) {
          return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
        }
      }
      return '';
    }, [props.file, props.url]);

    const isImage = resolvedFileType.startsWith('image/');
    const fileName = props.file?.name ?? props.url?.split('/').pop() ?? '';

    const itemIcon = useMemo(() => {
      if (type === 'thumbnail') {
        return isImage
          ? (<UploadPictureCard file={props.file} url={props.url} size="minor" className={classes.thumbnail} />)
          : (
            <div className={classes.thumbnail}>
              <Icon icon={FileIcon} className={classes.icon} size={16} />
            </div>
          )
      }

      return <Icon icon={icon ?? FileIcon} className={classes.icon} size={16} />;
    }, [type, icon, props.file, props.url, isImage]);

    const loadingIcon = useMemo(() => {
      return (
        <div className={classes.loadingIcon}>
          <Icon icon={SpinnerIcon} color="brand" spin size={16} />
        </div>
      )
    }, []);


    // Ref to track the Typography element for ellipsis detection
    const fileNameRef = useRef<HTMLParagraphElement>(null);
    // State to store whether the text is truncated
    // This can be used to conditionally show tooltip, adjust layout, etc.
    // Example usage: if (isTextTruncated) { /* show tooltip or adjust UI */ }
    const [isTextTruncated, setIsTextTruncated] = useState(false);

    // Function to check if text is truncated
    const checkTextTruncation = () => {
      const element = fileNameRef.current;
      if (element) {
        // Compare scrollWidth (full content width) with clientWidth (visible width)
        // If scrollWidth > clientWidth, the text is truncated
        const isTruncated = element.scrollWidth > element.clientWidth;
        setIsTextTruncated(isTruncated);
      }
    };

    // Effect to check truncation on mount and when fileName or size changes
    useEffect(() => {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        checkTextTruncation();
      }, 0);

      return () => clearTimeout(timeoutId);
    }, [fileName, size]);

    // Use ResizeObserver to detect when container size changes
    useEffect(() => {
      const element = fileNameRef.current;
      if (!element) return;

      // Check truncation when element is resized
      const resizeObserver = new ResizeObserver(() => {
        checkTextTruncation();
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, [fileName]);

    const fileSize = useMemo(() => {
      // Only show file size if file object is available
      if (!props.file) {
        return null;
      }

      const bytes = props.file.size;

      if (bytes === 0) {
        return '0 B';
      }

      const k = 1024;
      const sizes = ['B', 'KB', 'MB'];
      let i = 0;
      let size = bytes;

      while (size >= k && i < sizes.length - 1) {
        size /= k;
        i++;
      }

      return `${Math.round(size * 10) / 10} ${sizes[i]}`;
    }, [props.file]);

    const isFinished = useMemo(() => {
      return /done|error/.test(status);
    }, [status]);

    return (
      <>
        <div
          ref={ref}
          className={cx(
            classes.host,
            classes.size(size),
            {
              [classes.alignCenter]: status !== 'done',
              [classes.error]: status === 'error',
              [classes.disabled]: disabled,
            },
            className,
          )}
        >
          <div
            {...rest}
            aria-disabled={disabled}
            className={classes.container}
            role="group"
            tabIndex={disabled ? -1 : 0}
          >
            <div className={classes.contentWrapper}>
              <div className={classes.icon}>
                {itemIcon}
              </div>
              <div className={classes.content}>
                {
                  isTextTruncated ? (
                    <Tooltip title={fileName} options={{ placement: 'bottom' }}>
                      {({ onMouseEnter, onMouseLeave, ref }) => (
                        <Typography ref={ref}
                          className={classes.name}
                          ellipsis
                          onMouseEnter={onMouseEnter}
                          onMouseLeave={onMouseLeave}
                        >
                          {fileName}
                        </Typography>
                      )}
                    </Tooltip>
                  ) : (
                    <Typography ref={fileNameRef} className={classes.name} ellipsis>
                      {fileName}
                    </Typography>
                  )
                }
                {showFileSize && fileSize && isFinished && (
                  <Typography className={classes.fontSize}>
                    {fileSize}
                  </Typography>
                )}
              </div>
            </div>
            <div className={classes.actions}>
              {
                status === 'loading' && (
                  <>
                    {loadingIcon}
                    <ClearActions
                      onClick={onCancel}
                      className={classes.closeIcon}
                      role="button"
                    />
                  </>
                )
              }
              {
                status === 'done' && !disabled && (
                  <Icon icon={DownloadIcon} size={16} className={classes.downloadIcon} onClick={onDownload} />
                )
              }
              {
                status === 'error' && !disabled && (
                  <Icon icon={ResetIcon} size={16} className={classes.resetIcon} onClick={onReload} />
                )
              }
            </div>
          </div>
          {
            isFinished && !disabled && (
              <div className={classes.deleteContent}>
                <Icon
                  icon={TrashIcon}
                  size={16}
                  className={classes.deleteIcon}
                  onClick={onDelete}
                />
              </div>
            )
          }
        </div>
        {status === 'error' && errorMessage && (
          <div className={classes.errorMessage}>
            <Icon
              icon={errorIcon ?? DangerousFilledIcon}
              size={14}
              color="error"
              className={classes.errorIcon}
            />
            <Typography color="text-error" variant="caption" className={classes.errorMessageText}>
              {errorMessage}
            </Typography>
          </div>
        )}
      </>
    );
  },
);

export default UploadItem;

