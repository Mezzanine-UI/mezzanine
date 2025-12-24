import { forwardRef, ReactNode } from 'react';
import {
  inputCheckGroupClasses as classes,
  InputCheckGroupOrientation,
  InputCheckSize,
} from '@mezzanine-ui/core/_internal/input-check';
import { cx } from '../../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';

export interface InputCheckGroupProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The input check elements in group.
   */
  children?: ReactNode;
  /**
   * The orientation of input check group.
   */
  orientation?: InputCheckGroupOrientation;
  /**
   * Whether the input check group use segment style.
   * @default false
   */
  segmentedStyle?: boolean;
  /**
   * The size of input check group.
   * @default 'main'
   */
  size?: InputCheckSize;
}

/**
 * The react component for `mezzanine` input check group.
 */
const InputCheckGroup = forwardRef<HTMLDivElement, InputCheckGroupProps>(
  function InputCheckGroup(props, ref) {
    const {
      children,
      className,
      orientation = 'horizontal',
      segmentedStyle = false,
      size = 'main',
      ...rest
    } = props;

    return (
      <div
        {...rest}
        ref={ref}
        aria-orientation={orientation}
        className={cx(
          classes.host,
          classes.orientation(orientation),
          classes.size(size),
          {
            [classes.segmented]: segmentedStyle,
          },
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

export default InputCheckGroup;
