import { Options as _PopperOptions } from '@popperjs/core';
import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  useState,
} from 'react';
import { Modifier, usePopper } from 'react-popper';
import { ElementGetter, getElement } from '../utils/getElement';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Portal, { PortalProps } from '../Portal';

export type {
  Placement as PopperPlacement,
  PositioningStrategy as PopperPositionStrategy,
} from '@popperjs/core';

export type PopperOptions<Modifiers> = Omit<Partial<_PopperOptions>, 'modifiers'> & {
  modifiers?: ReadonlyArray<Modifier<Modifiers>>;
};

export interface PopperProps
  extends
  Pick<PortalProps, 'container' | 'disablePortal'>,
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The ref of trigger Element.
   */
  anchor?: ElementGetter;
  /**
   * The portal element will show if open=true
   * @default false
   */
  open?: boolean;
  /**
   * The options of usePopper hook of react-popper.
   */
  options?: PopperOptions<any>;
}

const Popper = forwardRef<HTMLDivElement, PopperProps>(function Popper(props, ref) {
  const {
    anchor,
    children,
    container,
    disablePortal,
    open = false,
    options,
    ...rest
  } = props;
  const [popperEl, setPopperEl] = useState<HTMLElement | null>(null);
  const composedRef = useComposeRefs([ref, setPopperEl]);
  const anchorEl = getElement(anchor);
  const { styles, attributes } = usePopper(anchorEl, popperEl, options);

  if (!open) {
    return null;
  }

  return (
    <Portal
      container={container}
      disablePortal={disablePortal}
    >
      <div
        {...rest}
        ref={composedRef}
        style={styles.popper}
        {...attributes.popper}
      >
        {children}
      </div>
    </Portal>
  );
});

export default Popper;
