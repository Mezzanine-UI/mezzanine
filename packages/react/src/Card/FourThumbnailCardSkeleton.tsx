'use client';

import { forwardRef } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Skeleton from '../Skeleton';

export interface FourThumbnailCardSkeletonProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Width of the card skeleton container.
   * @default 360
   */
  thumbnailWidth?: number | string;
  /**
   * Aspect ratio of each thumbnail skeleton.
   * For four-thumbnail layout, force to '4/3' to maintain the grid layout.
   * @default '4/3'
   */
  thumbnailAspectRatio?: string;
}

/**
 * Skeleton placeholder for FourThumbnailCard component.
 * Renders a skeleton that mimics the FourThumbnailCard layout.
 */
const FourThumbnailCardSkeleton = forwardRef<
  HTMLDivElement,
  FourThumbnailCardSkeletonProps
>(function FourThumbnailCardSkeleton(props, ref) {
  const {
    className,
    // thumbnailAspectRatio = '4/3',
    thumbnailWidth = 200,
    ...rest
  } = props;

  return (
    <div {...rest} ref={ref} className={cx(classes.thumbnail, className)}>
      <div className={classes.fourThumbnail}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            key={index}
            className={classes.fourThumbnailThumbnail}
            width={thumbnailWidth}
            style={{ aspectRatio: '4/3' }}
          />
        ))}
      </div>
      <div className={classes.thumbnailInfo}>
        <div className={classes.thumbnailInfoMain}>
          <div
            className={classes.thumbnailInfoContent}
            style={{ width: '100%' }}
          >
            <Skeleton height={20} width="100%" />
            <Skeleton height={16} width="100%" />
          </div>
        </div>
      </div>
    </div>
  );
});

FourThumbnailCardSkeleton.displayName = 'FourThumbnailCardSkeleton';

export default FourThumbnailCardSkeleton;
