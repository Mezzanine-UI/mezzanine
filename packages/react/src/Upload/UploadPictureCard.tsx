'use client';

import {
  uploadPictureCardClasses as classes,
  defaultUploadPictureCardErrorMessage,
  UploadItemStatus,
  UploadPictureCardImageFit,
  UploadPictureCardSize,
} from '@mezzanine-ui/core/upload';
import { forwardRef, MouseEventHandler, useEffect, useState, type ReactNode } from 'react';

import { DownloadIcon, ImageIcon, ResetIcon, SpinnerIcon, TrashIcon, ZoomInIcon } from '@mezzanine-ui/icons';

import Button from '../Button';
import ClearActions from '../ClearActions';
import Icon from '../Icon';
import Typography from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface UploadPictureCardProps
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
  errorIcon?: ReactNode;
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
      className,
      file,
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

    // Default error icon when status is error and no errorIcon is provided
    const defaultErrorIcon = errorIcon ?? (status === 'error' ? <Icon icon={ImageIcon} color="error" size={16} /> : null);

    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
      if (file && file.type.startsWith('image/')) {
        try {
          const url = URL.createObjectURL(file);
          setImageUrl(url);

          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (error) {
          console.error('Failed to create object URL for image:', error);
          setImageUrl('');
        }
      } else {
        setImageUrl('');
      }

      return undefined;
    }, [file]);

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.size(size),
          disabled && classes.disabled,
          className
        )}
      >
        {imageUrl && (
          <div className={classes.image}>
            {status !== 'error' && (
              <img
                alt={file.name}
                src={imageUrl}
                style={{
                  objectFit: imageFit,
                  objectPosition: 'center',
                }}
              />
            )}
            <div className={cx(
              classes.actions,
              classes.actionsStatus(status),
            )}>
              {
                status === 'loading' && size !== 'minor' && (
                  <>
                    <ClearActions
                      type="embedded"
                      variant="contrast"
                      onClick={onDelete}
                      className={classes.clearActionsIcon}
                      aria-label="取消上傳"
                    />
                    <div className={classes.loadingIcon} aria-label="上傳中">
                      <Icon icon={SpinnerIcon} color="fixed-light" spin size={32} />
                    </div>
                  </>
                )
              }
              {
                status === 'done' && size !== 'minor' && (
                  <div className={classes.tools}>
                    <div className={classes.toolsContent}>
                      <Button
                        variant="base-secondary"
                        size="minor"
                        icon={{ position: 'icon-only', src: ZoomInIcon }}
                        onClick={onZoomIn}
                        aria-label="放大圖片"
                      />
                      <Button
                        variant="base-secondary"
                        size="minor"
                        icon={{ position: 'icon-only', src: DownloadIcon }}
                        onClick={onDownload}
                        aria-label="下載檔案"
                      />
                      <Button
                        variant="base-secondary"
                        size="minor"
                        icon={{ position: 'icon-only', src: TrashIcon }}
                        onClick={onDelete}
                        aria-label="刪除檔案"
                      />
                    </div>
                  </div>
                )
              }
              {
                status === 'error' && size !== 'minor' && (
                  <>
                    {(errorMessage ?? defaultUploadPictureCardErrorMessage) || defaultErrorIcon ? (
                      <div className={classes.errorMessage} role="alert" aria-live="polite">
                        {defaultErrorIcon && (
                          <div className={classes.errorIcon} aria-hidden="true">
                            {defaultErrorIcon}
                          </div>
                        )}
                        {(errorMessage ?? defaultUploadPictureCardErrorMessage) && (
                          <Typography className={classes.errorMessageText}>
                            {errorMessage ?? defaultUploadPictureCardErrorMessage}
                          </Typography>
                        )}
                      </div>
                    ) : null}
                    <div className={classes.tools}>
                      <div className={classes.toolsContent}>
                        <Button
                          variant="base-secondary"
                          size="minor"
                          icon={{ position: 'icon-only', src: ResetIcon }}
                          onClick={onReload}
                          aria-label="重新上傳"
                        />
                        <Button
                          variant="base-secondary"
                          size="minor"
                          icon={{ position: 'icon-only', src: TrashIcon }}
                          onClick={onDelete}
                          aria-label="刪除檔案"
                        />
                      </div>
                    </div>
                  </>
                )
              }
              {
                size === 'minor' && (
                  <Icon icon={ZoomInIcon} color="fixed-light" size={24} />
                )
              }
            </div>
          </div>
        )}
        {
          size !== 'minor' && (
            <div className={classes.content}>
              <Typography className={classes.name} ellipsis>{file.name}</Typography>
            </div>
          )
        }
      </div>
    );
  },
);

export default UploadPictureCard;

