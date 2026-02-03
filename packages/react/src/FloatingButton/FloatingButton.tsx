'use client';

import { forwardRef } from 'react';
import Button, { ButtonProps } from '../Button';
import { floatingButtonClasses as classes } from '@mezzanine-ui/core/floating-button';
import { cx } from '../utils/cx';

export interface FloatingButtonProps
  extends Omit<
    ButtonProps,
    'variant' | 'size' | 'className' | 'tooltipPosition'
  > {
  /**
   * Auto hide floating button when `open` is true.
   * @default false
   */
  autoHideWhenOpen?: boolean;
  /**
   * The class name of the root element.
   */
  className?: string;
  /**
   * Whether the floating button is in open state.
   */
  open?: boolean;
}

/**
 * The react component for `mezzanine` floating button.
 */
const FloatingButton = forwardRef<HTMLDivElement, FloatingButtonProps>(
  function FloatingButton(props, ref) {
    const {
      autoHideWhenOpen = false,
      children,
      className,
      open = false,
      ...rest
    } = props;

    return (
      <div ref={ref} className={cx(classes.host, className)}>
        <Button
          {...rest}
          className={cx(classes.button, {
            [classes.buttonHidden]: autoHideWhenOpen && open,
          })}
          variant="base-primary"
          size="main"
          tooltipPosition="left"
        >
          {children}
        </Button>
      </div>
    );
  },
);

export default FloatingButton;
