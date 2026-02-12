'use client';

import { forwardRef } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Skeleton from '../Skeleton';
import { getNumericCSSVariablePixelValue } from '../utils/get-css-variable-value';

export type SingleThumbnailCardSkeletonProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'div'>,
  'children'
>;

/**
 * Skeleton placeholder for SingleThumbnailCard component.
 * Renders a skeleton that mimics the SingleThumbnailCard layout.
 */
const SingleThumbnailCardSkeleton = forwardRef<
  HTMLDivElement,
  SingleThumbnailCardSkeletonProps
>(function SingleThumbnailCardSkeleton(props, ref) {
  const { className, ...rest } = props;

  return (
    <div {...rest} ref={ref} className={cx(classes.thumbnail, className)}>
      <div className={classes.singleThumbnail}>
        <Skeleton
          height="100%"
          style={{ aspectRatio: '16/9' }}
          width={getNumericCSSVariablePixelValue(
            '--mzn-spacing-size-container-slim',
          )}
        />
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

SingleThumbnailCardSkeleton.displayName = 'SingleThumbnailCardSkeleton';

export default SingleThumbnailCardSkeleton;
