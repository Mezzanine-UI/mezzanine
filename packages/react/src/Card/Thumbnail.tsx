'use client';

import { forwardRef } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import { ThumbnailComponent, ThumbnailPropsBase } from './typings';

export type ThumbnailComponentProps<C extends ThumbnailComponent = 'div'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    ThumbnailComponent,
    C,
    ThumbnailPropsBase
  >;

/**
 * Thumbnail is a child component for FourThumbnailCard.
 * It wraps an image with an overlay that shows the title on hover.
 * Supports polymorphic rendering as 'div', 'a', 'button', or custom components (e.g., Next.js Link).
 */
const Thumbnail = forwardRef<HTMLElement, ThumbnailComponentProps>(
  function Thumbnail(props, ref) {
    const {
      children,
      className,
      component: Component = 'div',
      title,
      ...rest
    } = props;

    return (
      <Component
        {...rest}
        ref={ref as any}
        className={cx(classes.fourThumbnailThumbnail, className)}
      >
        {children}
        <div className={classes.fourThumbnailOverlay}>
          {title && <span>{title}</span>}
        </div>
      </Component>
    );
  },
);

Thumbnail.displayName = 'Thumbnail';

export default Thumbnail;
