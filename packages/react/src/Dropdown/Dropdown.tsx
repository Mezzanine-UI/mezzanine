import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useRef,
} from 'react';
import { size } from '@floating-ui/react-dom';
import Popper, { PopperProps } from '../Popper';
import { ClickAwayEvent, useClickAway } from '../hooks/useClickAway';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface DropdownProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'ref' | 'children'
  > {
  children: (ref: Ref<any>) => ReactNode;
  /**
   * Whether to disable triggering onClose while clicked away.
   * @default false
   */
  disableClickAway?: boolean;
  /**
   * The dropdown menu
   */
  menu?: ReactNode;
  /**
   * The handler fired while clicked away.
   */
  onClose?: (event: ClickAwayEvent) => void;
  /**
   * the props of popper
   */
  popperProps?: PopperProps;
}

// Middleware to make the dropdown menu have the same width as the reference element
const sameWidthMiddleware = size({
  apply({ rects, elements }) {
    Object.assign(elements.floating.style, {
      width: 'auto',
      minWidth: `${rects.reference.width}px`,
    });
  },
});

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(props, ref) {
    const {
      children,
      disableClickAway = false,
      menu,
      onClose,
      popperProps,
      ...rest
    } = props;
    const anchor = useRef<HTMLDivElement>(null);
    const popperRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposeRefs([ref, popperRef]);

    const open = popperProps?.open;

    const middleware = popperProps?.options?.middleware || [];

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
      popperRef,
      [disableClickAway, onClose, open, popperRef],
    );

    return (
      <>
        {children(anchor)}
        <Popper
          {...popperProps}
          ref={composedRef}
          {...rest}
          anchor={anchor}
          options={{
            placement: 'top-start',
            ...popperProps?.options,
            middleware: [sameWidthMiddleware, ...middleware],
          }}
        >
          {menu}
        </Popper>
      </>
    );
  },
);

export default Dropdown;
