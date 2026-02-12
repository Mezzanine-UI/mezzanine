'use client';

import { Children, forwardRef, MouseEvent } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import Icon from '../Icon';
import ThumbnailCardInfo from './ThumbnailCardInfo';
import {
  SingleThumbnailCardActionProps,
  SingleThumbnailCardComponent,
  SingleThumbnailCardOverflowProps,
  SingleThumbnailCardProps,
} from './typings';

export type SingleThumbnailCardComponentProps<
  C extends SingleThumbnailCardComponent = 'div',
> = ComponentOverridableForwardRefComponentPropsFactory<
  SingleThumbnailCardComponent,
  C,
  SingleThumbnailCardProps
>;

/**
 * SingleThumbnailCard displays a single image thumbnail with optional tag, personal action,
 * and info section. Supports three action types: default, action, and overflow.
 *
 * The card width is determined by the image child element.
 */
const SingleThumbnailCard = forwardRef<
  HTMLDivElement,
  SingleThumbnailCardComponentProps
>(function SingleThumbnailCard(props, ref) {
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

  // Ensure only one child is provided
  const child = Children.only(children);

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
        props as SingleThumbnailCardActionProps;

      return { actionName, onActionClick };
    }

    if (type === 'overflow') {
      const { onOptionSelect, options } =
        props as SingleThumbnailCardOverflowProps;

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
      <div className={classes.singleThumbnail}>
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
        {child}
        <div className={classes.singleThumbnailOverlay} />
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

SingleThumbnailCard.displayName = 'SingleThumbnailCard';

export default SingleThumbnailCard;
