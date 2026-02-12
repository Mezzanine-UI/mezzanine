'use client';

import { forwardRef } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Skeleton from '../Skeleton';

export interface QuickActionCardSkeletonProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Layout mode matching QuickActionCard
   * @default 'horizontal'
   */
  mode?: 'horizontal' | 'vertical';
}

/**
 * Skeleton placeholder for QuickActionCard component.
 * Renders a skeleton that mimics the QuickActionCard layout.
 */
const QuickActionCardSkeleton = forwardRef<
  HTMLDivElement,
  QuickActionCardSkeletonProps
>(function QuickActionCardSkeleton(props, ref) {
  const { className, mode = 'horizontal', ...rest } = props;

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.quickAction,
        classes.quickActionReadOnly,
        mode === 'vertical' && classes.quickActionVertical,
        className,
      )}
    >
      <Skeleton circle height={24} width={24} />
      <div className={classes.quickActionContent}>
        <Skeleton height={20} width="70%" />
        <Skeleton height={16} width="50%" />
      </div>
    </div>
  );
});

QuickActionCardSkeleton.displayName = 'QuickActionCardSkeleton';

export default QuickActionCardSkeleton;
