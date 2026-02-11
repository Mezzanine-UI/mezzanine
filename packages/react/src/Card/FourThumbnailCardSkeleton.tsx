'use client';

import { forwardRef } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Skeleton from '../Skeleton';

export type FourThumbnailCardSkeletonProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'div'>,
  'children'
>;

/**
 * Skeleton placeholder for FourThumbnailCard component.
 * Renders a skeleton that mimics the FourThumbnailCard layout.
 */
const FourThumbnailCardSkeleton = forwardRef<
  HTMLDivElement,
  FourThumbnailCardSkeletonProps
>(function FourThumbnailCardSkeleton(props, ref) {
  const { className, ...rest } = props;

  return (
    <div {...rest} ref={ref} className={cx(classes.thumbnail, className)}>
      <div className={classes.fourThumbnail}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            key={index}
            className={classes.fourThumbnailThumbnail}
            height="100%"
            width="100%"
          />
        ))}
      </div>
      <div className={classes.thumbnailInfo}>
        <div className={classes.thumbnailInfoMain}>
          <Skeleton height={32} width={32} />
          <div className={classes.thumbnailInfoContent}>
            <Skeleton height={20} width="70%" />
            <Skeleton height={16} width="50%" />
          </div>
        </div>
      </div>
    </div>
  );
});

FourThumbnailCardSkeleton.displayName = 'FourThumbnailCardSkeleton';

export default FourThumbnailCardSkeleton;
