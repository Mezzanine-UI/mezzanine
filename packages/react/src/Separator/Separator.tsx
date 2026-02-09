import { forwardRef } from 'react';
import {
  SeparatorOrientation,
  separatorClasses as classes,
} from '@mezzanine-ui/core/separator';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface SeparatorProps
  extends NativeElementPropsWithoutKeyAndRef<'hr'> {
  /**
   * The orientation of the separator.
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;
}

/**
 * The react component for `mezzanine` separator.
 */
const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  function Separator(props, ref) {
    const { className, orientation = 'horizontal', ...rest } = props;

    return (
      <hr
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          {
            [classes.horizontal]: orientation === 'horizontal',
            [classes.vertical]: orientation === 'vertical',
          },
          className,
        )}
      />
    );
  },
);

export default Separator;

