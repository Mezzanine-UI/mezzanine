import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import {
  forwardRef,
  ReactNode,
} from 'react';
import Popper, { PopperProps } from '../Popper';
import { Fade, FadeProps } from '../Transition';
import { cx } from '../utils/cx';

export interface PickerPopperProps
  extends
  Pick<PopperProps, 'anchor' | 'open'> {
  children?: ReactNode;
  /**
   * Other fade props you may provide to `Fade`.
   */
  fadeProps?: Omit<FadeProps, 'children' | 'in'>;
  /**
   * Other popper props you may provide to `Popper`.
   */
  popperProps?: Omit<PopperProps, 'anchor' | 'open'>;
}

/**
 * The react component for `mezzanine` picker popper.
 */
const PickerPopper = forwardRef<HTMLDivElement, PickerPopperProps>(
  function PickerPopper(props, ref) {
    const {
      anchor,
      children,
      fadeProps,
      open,
      popperProps,
    } = props;
    const {
      options,
      className: popperClassName,
      ...restPopperProps
    } = popperProps || {};
    const {
      modifiers = [],
      ...restPopperOptions
    } = options || {};

    return (
      <Fade
        {...fadeProps}
        in={open}
        ref={ref}
      >
        <Popper
          {...restPopperProps}
          open
          anchor={anchor}
          className={cx(
            classes.popper,
            popperClassName,
          )}
          options={{
            placement: 'bottom-start',
            ...restPopperOptions,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 4],
                },
              },
              ...modifiers,
            ],
          }}
        >
          {children}
        </Popper>
      </Fade>
    );
  },
);

export default PickerPopper;
