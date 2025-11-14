import { forwardRef } from 'react';
import { skeletonClasses as classes } from '@mezzanine-ui/core/skeleton';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { TypographySemanticType } from '../Typography';

export interface SkeletonProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Whether the skeleton should be circular.
   */
  circle?: boolean;
  /**
   * Height of the skeleton.
   * @default 100%
   */
  height?: number | string;
  /**
   * Typography variant for strip skeleton height calculation.
   * Only effective when circle and height are not set.
   */
  variant?: TypographySemanticType;
  /**
   * Width of the skeleton.
   * @default 100%
   */
  width?: number | string;
}

/**
 * The react component for `mezzanine` Skeleton.
 */
const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(props, ref) {
    const {
      circle,
      className,
      height: skeletonHeight,
      style: skeletonStyle,
      variant,
      width: skeletonWidth,
      ...rest
    } = props;

    // strip type
    if (!skeletonHeight && !circle && variant) {
      return (
        <div
          {...rest}
          ref={ref}
          className={cx(classes.host, classes.type(variant), className)}
          style={{
            width: skeletonWidth,
            ...skeletonStyle,
          }}
        >
          <span className={classes.bg} />
        </div>
      );
    }

    // circle / square type
    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.bg,
          circle && classes.circle,
          className,
        )}
        style={{
          height: skeletonHeight,
          width: skeletonWidth,
          ...skeletonStyle,
        }}
      />
    );
  },
);

export default Skeleton;
