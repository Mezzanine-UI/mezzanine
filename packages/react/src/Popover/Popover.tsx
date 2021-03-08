import { forwardRef, ReactNode, useRef } from 'react';
import { popoverClasses as classes } from '@mezzanine-ui/core/popover';
import { StrictModifiers } from '@popperjs/core';
import { cx } from '../utils/cx';
import Popper, { PopperProps } from '../Popper';
import { ClickAwayEvent, useClickAway } from '../hooks/useClickAway';
import { useComposeRefs } from '../hooks/useComposeRefs';

const offsetModifier: StrictModifiers = {
  name: 'offset',
  options: {
    offset: [0, 8],
  },
};

export interface PopoverProps extends Omit<PopperProps, 'title'> {
  /**
   * Whether to disable triggering onClose while clicked away.
   * @default false
   */
  disableClickAway?: boolean;
  /**
   * The handler fired while clicked away.
   */
  onClose?: (event: ClickAwayEvent) => void;
  /**
   * the title of popover
   */
  title?: ReactNode;
}

/**
 * The react component for `mezzanine` popover.
 */
const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(props, ref) {
  const {
    children,
    className,
    disableClickAway = false,
    onClose,
    open,
    options = {},
    title,
    ...rest
  } = props;
  const { modifiers = [] } = options;
  const popoverRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRefs([ref, popoverRef]);

  useClickAway(
    () => {
      if (!open || disableClickAway || !onClose) {
        return;
      }

      return (event) => {
        if (onClose) {
          onClose(event);
        }
      };
    },
    popoverRef,
    [
      open,
      disableClickAway,
      onClose,
      popoverRef,
    ],
  );

  return (
    <Popper
      {...rest}
      ref={composedRef}
      className={cx(
        classes.host,
        className,
      )}
      open={open}
      options={{
        ...options,
        modifiers: [...modifiers, offsetModifier],
      }}
    >
      {title && <div className={classes.title}>{title}</div>}
      {children && <div className={classes.content}>{children}</div>}
    </Popper>
  );
});

export default Popover;
