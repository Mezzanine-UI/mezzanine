'use client';

import { forwardRef } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Skeleton from '../Skeleton';

export interface BaseCardSkeletonProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Whether to show content skeleton
   * @default true
   */
  showContent?: boolean;
}

/**
 * Skeleton placeholder for BaseCard component.
 * Renders a skeleton that mimics the BaseCard layout.
 */
const BaseCardSkeleton = forwardRef<HTMLDivElement, BaseCardSkeletonProps>(
  function BaseCardSkeleton(props, ref) {
    const { className, showContent = true, ...rest } = props;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(classes.base, classes.baseReadOnly, className)}
      >
        <div className={classes.baseHeader}>
          <div className={classes.baseHeaderContentWrapper}>
            <Skeleton height={20} width="60%" />
            <Skeleton height={16} width="40%" />
          </div>
        </div>
        {showContent && (
          <div className={classes.baseContent}>
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} style={{ marginTop: 8 }} width="80%" />
            <Skeleton height={16} style={{ marginTop: 8 }} width="90%" />
          </div>
        )}
      </div>
    );
  },
);

BaseCardSkeleton.displayName = 'BaseCardSkeleton';

export default BaseCardSkeleton;
