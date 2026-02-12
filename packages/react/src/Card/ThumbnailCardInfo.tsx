'use client';

import { forwardRef, MouseEvent } from 'react';
import {
  cardClasses as classes,
  getFileTypeCategory,
} from '@mezzanine-ui/core/card';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import Button from '../Button';
import Dropdown from '../Dropdown';
import {
  SingleThumbnailCardActionProps,
  SingleThumbnailCardOverflowProps,
  SingleThumbnailCardProps,
} from './typings';

export interface ThumbnailCardInfoProps
  extends Pick<
    SingleThumbnailCardProps,
    'filetype' | 'subtitle' | 'title' | 'type'
  > {
  /**
   * Label text for the action button (when type="action")
   */
  actionName?: string;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Whether the action is disabled
   */
  disabled?: boolean;
  /**
   * Click handler for the action button (when type="action")
   */
  onActionClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Callback when an option is selected (when type="overflow")
   */
  onOptionSelect?: SingleThumbnailCardOverflowProps['onOptionSelect'];
  /**
   * Dropdown options (when type="overflow")
   */
  options?: SingleThumbnailCardOverflowProps['options'];
}

/**
 * ThumbnailCardInfo is a shared component for rendering card info section
 * Used by SingleThumbnailCard and FourThumbnailCard
 */
const ThumbnailCardInfo = forwardRef<HTMLDivElement, ThumbnailCardInfoProps>(
  function ThumbnailCardInfo(props, ref) {
    const {
      className,
      disabled = false,
      filetype,
      subtitle,
      title,
      type = 'default',
    } = props;

    const filetypeCategory = filetype
      ? getFileTypeCategory(filetype)
      : undefined;
    const filetypeClassName = filetypeCategory
      ? `${classes.thumbnailInfoFiletype}--${filetypeCategory}`
      : undefined;

    const renderAction = () => {
      if (type === 'default') {
        return null;
      }

      if (type === 'action') {
        const { actionName: name, onActionClick: onClick } =
          props as SingleThumbnailCardActionProps;

        return (
          <div className={classes.thumbnailInfoAction}>
            <Button
              disabled={disabled}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                onClick?.(event);
              }}
              size="sub"
              type="button"
              variant="base-text-link"
            >
              {name}
            </Button>
          </div>
        );
      }

      if (type === 'overflow') {
        const { onOptionSelect: onSelect, options: opts } =
          props as SingleThumbnailCardOverflowProps;

        return (
          <div className={classes.thumbnailInfoAction}>
            <Dropdown
              disabled={disabled}
              globalPortal={false}
              mode="single"
              onSelect={onSelect}
              options={opts}
            >
              <Button
                disabled={disabled}
                icon={DotHorizontalIcon}
                iconType="icon-only"
                size="sub"
                type="button"
                variant="base-text-link"
              />
            </Dropdown>
          </div>
        );
      }

      return null;
    };

    return (
      <div ref={ref} className={cx(classes.thumbnailInfo, className)}>
        <div className={classes.thumbnailInfoMain}>
          {filetype && (
            <div
              className={cx(classes.thumbnailInfoFiletype, filetypeClassName)}
            >
              {filetype.toUpperCase()}
            </div>
          )}
          <div className={classes.thumbnailInfoContent}>
            {title && (
              <span className={classes.thumbnailInfoTitle}>{title}</span>
            )}
            {subtitle && (
              <span className={classes.thumbnailInfoSubtitle}>{subtitle}</span>
            )}
          </div>
        </div>
        {renderAction()}
      </div>
    );
  },
);

ThumbnailCardInfo.displayName = 'ThumbnailCardInfo';

export default ThumbnailCardInfo;
