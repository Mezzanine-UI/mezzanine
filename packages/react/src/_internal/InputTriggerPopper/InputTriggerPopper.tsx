import { inputTriggerPopperClasses as classes } from '@mezzanine-ui/core/_internal/input-trigger-popper';
import { offset, size } from '@floating-ui/react-dom';
import { forwardRef } from 'react';
import Popper, { PopperProps } from '../../Popper';
import { Fade, FadeProps } from '../../Transition';
import { cx } from '../../utils/cx';

export interface InputTriggerPopperProps extends PopperProps {
  /**
   * Other fade props you may provide to `Fade`.
   */
  fadeProps?: Omit<FadeProps, 'children' | 'in'>;
  /**
   * Whether to set the same width as its reference.
   */
  sameWidth?: boolean;
}

// Middleware to make the popper have the same min-width as the reference element
const sameWidthMiddleware = size({
  apply({ rects, elements }) {
    Object.assign(elements.floating.style, {
      minWidth: `${rects.reference.width}px`,
    });
  },
});

/**
 * The react component for `mezzanine` input popper.
 */
const InputTriggerPopper = forwardRef<HTMLDivElement, InputTriggerPopperProps>(
  function InputTriggerPopper(props, ref) {
    const {
      anchor,
      children,
      className,
      fadeProps,
      open,
      options,
      sameWidth,
      ...restPopperProps
    } = props;
    const { middleware = [], ...restPopperOptions } = options || {};

    return (
      <Fade {...fadeProps} in={open} ref={ref}>
        <Popper
          {...restPopperProps}
          open
          anchor={anchor}
          className={cx(classes.host, className)}
          disablePortal
          /** Prevent event bubble (Because popper may use portal, then click away function would be buggy) */
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          options={{
            placement: 'bottom-start',
            ...restPopperOptions,
            middleware: [
              offset({ mainAxis: 4 }),
              ...(sameWidth ? [sameWidthMiddleware] : []),
              ...middleware,
            ],
          }}
        >
          {children}
        </Popper>
      </Fade>
    );
  },
);

export default InputTriggerPopper;
