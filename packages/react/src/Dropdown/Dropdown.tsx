import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useRef,
} from 'react';
import Popper, { PopperOptions, PopperProps } from '../Popper';
import { ClickAwayEvent, useClickAway } from '../hooks/useClickAway';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface DropdownProps extends
  Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref' | 'children'> {
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

const popperOptions: PopperOptions<any> = {
  modifiers: [
    {
      name: 'sameWidth',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: ({ state }) => {
        const reassignState = state;

        reassignState.styles.popper.width = 'auto';
        reassignState.styles.popper.minWidth = `${state.rects.reference.width}px`;
      },
      effect: ({ state }) => {
        const reassignState = state;

        reassignState.elements.popper.style.width = 'auto';
        reassignState.elements.popper.style.minWidth = `${state.elements.reference.getBoundingClientRect().width}px`;
      },
    },
  ],
};

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(props, ref) {
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

  const modifiers = popperProps?.options?.modifiers || [];

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
    [
      disableClickAway,
      onClose,
      open,
      popperRef,
    ],
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
          modifiers: [
            ...(popperOptions.modifiers || []),
            ...modifiers,
          ],
        }}
      >
        {menu}
      </Popper>
    </>
  );
});

export default Dropdown;
