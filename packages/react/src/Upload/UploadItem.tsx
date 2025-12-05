'use client';

import {
  uploadItemClasses as classes,
  UploadItemSize,
  type UploadItemStatus
} from '@mezzanine-ui/core/upload';
import { forwardRef, MouseEventHandler, useMemo } from 'react';

import { DownloadIcon, FileIcon, IconDefinition, ResetIcon, SpinnerIcon, TrashIcon } from '@mezzanine-ui/icons';
import ClearActions from '../ClearActions';
import Icon from '../Icon';
import Typography from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import UploadPictureCard from './UploadPictureCard';

export interface UploadItemProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The file to display.
   */
  file: File;
  /**
   * The id of the file id to identify the file.
   */
  id?: string;
  /**
   * The file size to display (optional).
   */
  size?: UploadItemSize;
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
      onCancel,
      onDelete,
      onDownload,
      onReload,
      ...rest
    } = props;

    const isImage = props.file.type.startsWith('image/');

    const itemIcon = useMemo(() => {
      if (icon) {
        return <Icon icon={icon} className={classes.icon} size={16} />;
      }

      if (isImage) {
        return <UploadPictureCard file={props.file} size="minor" />;
      }

      return <Icon icon={FileIcon} className={classes.icon} size={16} />;
    }, [isImage, props.file, icon]);

    const loadingIcon = useMemo(() => {
      return (
        <div className={classes.loadingIcon}>
          <Icon icon={SpinnerIcon} color="brand" spin size={16} />
        </div>
      )
    }, []);

    const fileName = props.file.name;

    const fileSize = useMemo(() => {
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
    }, [props.file.size]);

    const isFinished = useMemo(() => {
      return /done|error/.test(status);
    }, [status]);

    return (
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
        <div {...rest} className={classes.container}>
          <div className={classes.contentWrapper}>
            <div className={classes.icon}>
              {itemIcon}
            </div>
            <div className={classes.content}>
              <Typography className={classes.name} ellipsis>
                {fileName}
              </Typography>
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
          isFinished && (
            <div className={classes.deleteContent}>
              <Icon icon={TrashIcon} size={16} className={classes.deleteIconIcon} onClick={onDelete} />
            </div>
          )
        }
      </div>
    );
  },
);

export default UploadItem;

