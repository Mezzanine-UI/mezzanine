'use client';

import { Children, forwardRef, isValidElement, MouseEvent } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import Icon from '../Icon';
import Thumbnail from './Thumbnail';
import ThumbnailCardInfo from './ThumbnailCardInfo';
import {
  FourThumbnailCardActionProps,
  FourThumbnailCardComponent,
  FourThumbnailCardOverflowProps,
  FourThumbnailCardProps,
} from './typings';

export type FourThumbnailCardComponentProps<
  C extends FourThumbnailCardComponent = 'div',
> = ComponentOverridableForwardRefComponentPropsFactory<
  FourThumbnailCardComponent,
  C,
  FourThumbnailCardProps
>;

const MAX_THUMBNAILS = 4;

/**
 * FourThumbnailCard displays a 2x2 grid of image thumbnails with optional tag, personal action,
 * and info section. Supports three action types: default, action, and overflow.
 *
 * Children must be Thumbnail components. If less than 4 are provided, empty slots will be rendered.
 * If more than 4 are provided, only the first 4 will be used (with a console warning in development).
 */
const FourThumbnailCard = forwardRef<
  HTMLDivElement,
  FourThumbnailCardComponentProps
>(function FourThumbnailCard(props, ref) {
  const {
    children,
    className,
    component: Component = 'div',
    filetype,
    personalActionActive = false,
    personalActionActiveIcon,
    personalActionIcon,
    personalActionOnClick,
    subtitle,
    tag,
    title,
    type = 'default',
    ...rest
  } = props;

  // Process children: filter valid Thumbnail elements and limit to MAX_THUMBNAILS
  const childArray = Children.toArray(children).filter((child) => {
    if (!isValidElement(child)) return false;

    // Check if the child is a Thumbnail component
    const isThumbnail = child.type === Thumbnail;

    if (!isThumbnail && process.env.NODE_ENV !== 'production') {
      const displayName =
        typeof child.type === 'string'
          ? child.type
          : (child.type as { displayName?: string }).displayName ||
            (child.type as { name?: string }).name ||
            'Unknown';

      console.warn(
        `[FourThumbnailCard] Invalid child type: <${displayName}>. ` +
          'FourThumbnailCard only accepts Thumbnail components as children.',
      );
    }

    return isThumbnail;
  });

  // Warn if more than MAX_THUMBNAILS children are provided
  if (
    childArray.length > MAX_THUMBNAILS &&
    process.env.NODE_ENV !== 'production'
  ) {
    console.warn(
      `[FourThumbnailCard] Received ${childArray.length} Thumbnail children, ` +
        `but only the first ${MAX_THUMBNAILS} will be rendered.`,
    );
  }

  // Take only the first MAX_THUMBNAILS
  const thumbnails = childArray.slice(0, MAX_THUMBNAILS);

  // Fill remaining slots with empty placeholders
  const emptySlots = MAX_THUMBNAILS - thumbnails.length;
  const emptyPlaceholders = Array.from({ length: emptySlots }, (_, index) => (
    <div
      key={`empty-${index}`}
      className={cx(
        classes.fourThumbnailThumbnail,
        classes.fourThumbnailThumbnailEmpty,
      )}
    />
  ));

  const hasPersonalAction = Boolean(personalActionIcon);
  const currentPersonalActionIcon = personalActionActive
    ? (personalActionActiveIcon ?? personalActionIcon)
    : personalActionIcon;

  const handlePersonalActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    personalActionOnClick?.(event, personalActionActive);
  };

  const getInfoProps = () => {
    if (type === 'action') {
      const { actionName, onActionClick } =
        props as FourThumbnailCardActionProps;

      return { actionName, onActionClick };
    }

    if (type === 'overflow') {
      const { onOptionSelect, options } =
        props as FourThumbnailCardOverflowProps;

      return { onOptionSelect, options };
    }

    return {};
  };

  // Filter out type-specific props before spreading
  const {
    actionName: _actionName,
    onActionClick: _onActionClick,
    onOptionSelect: _onOptionSelect,
    options: _options,
    type: _type,
    ...componentProps
  } = rest as Record<string, unknown>;

  return (
    <Component
      {...componentProps}
      ref={ref}
      className={cx(classes.thumbnail, className)}
    >
      <div className={classes.fourThumbnail}>
        {tag && <div className={classes.thumbnailTag}>{tag}</div>}
        {hasPersonalAction && currentPersonalActionIcon && (
          <button
            aria-label="Personal Action"
            className={classes.thumbnailPersonalAction}
            onClick={handlePersonalActionClick}
            type="button"
          >
            <Icon icon={currentPersonalActionIcon} size={24} />
          </button>
        )}
        {thumbnails}
        {emptyPlaceholders}
      </div>
      <ThumbnailCardInfo
        filetype={filetype}
        subtitle={subtitle}
        title={title}
        type={type}
        {...getInfoProps()}
      />
    </Component>
  );
});

FourThumbnailCard.displayName = 'FourThumbnailCard';

export default FourThumbnailCard;
