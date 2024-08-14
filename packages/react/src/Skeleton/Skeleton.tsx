import { forwardRef } from 'react';
import { skeletonClasses as classes } from '@mezzanine-ui/core/skeleton';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface SkeletonProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Height of the skeleton.
   */
  height?: number | string;
  /**
   * Type of the skeleton.
   * @default 'rectangle'
   */
  type?: 'rectangle' | 'circle';
  /**
   * Width of the skeleton.
   */
  width?: number | string;
}

/**
 * The react component for `mezzanine` Skeleton.
 */
const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(props, ref) {
    const {
      className,
      height: skeletonHeight,
      style: skeletonStyle,
      type,
      width: skeletonWidth,
      ...rest
    } = props;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          type === 'circle' && classes.circle,
          className,
        )}
        style={{
          width: skeletonWidth,
          height: skeletonHeight,
          ...skeletonStyle,
        }}
        {...rest}
      />
    );
  },
);

export default Skeleton;
