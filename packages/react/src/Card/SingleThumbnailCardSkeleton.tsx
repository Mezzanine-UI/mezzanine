'use client';

import { forwardRef } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Skeleton from '../Skeleton';

export interface SingleThumbnailCardSkeletonProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Width of the thumbnail skeleton.
   * @default 'var(--mzn-spacing-size-container-slim)'
   */
  thumbnailWidth?: number | string;
  /**
   * Aspect ratio of the thumbnail skeleton.
   * @default '16/9'
   */
  thumbnailAspectRatio?: string;
}

/**
 * Skeleton placeholder for SingleThumbnailCard component.
 * Renders a skeleton that mimics the SingleThumbnailCard layout.
 */
const SingleThumbnailCardSkeleton = forwardRef<
  HTMLDivElement,
  SingleThumbnailCardSkeletonProps
>(function SingleThumbnailCardSkeleton(props, ref) {
  const {
    className,
    thumbnailAspectRatio = '16/9',
    thumbnailWidth = 'var(--mzn-spacing-size-container-slim)',
    ...rest
  } = props;

  return (
    <div {...rest} ref={ref} className={cx(classes.thumbnail, className)}>
      <div className={classes.singleThumbnail}>
        <Skeleton
          height="100%"
          style={{ aspectRatio: thumbnailAspectRatio }}
          width={thumbnailWidth}
        />
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

SingleThumbnailCardSkeleton.displayName = 'SingleThumbnailCardSkeleton';

export default SingleThumbnailCardSkeleton;
