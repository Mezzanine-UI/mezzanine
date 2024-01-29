import { inputTriggerPopperClasses as classes } from '@mezzanine-ui/core/_internal/input-trigger-popper';
import { Modifier } from '@popperjs/core';
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
    const {
      modifiers = [],
      ...restPopperOptions
    } = options || {};

    const sameWidthModifier: Modifier<'sameWidth', Record<string, any>> = {
      name: 'sameWidth',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: ({ state }) => {
        const reassignState = state;

        reassignState.styles.popper.minWidth = `${state.rects.reference.width}px`;
      },
      effect: ({ state }) => {
        const reassignState = state;

        reassignState.elements.popper.style.minWidth = `${
          state.elements.reference.getBoundingClientRect().width
        }px`;
      },
    };

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
            classes.host,
            className,
          )}
          /** Prevent event bubble (Because popper may use portal, then click away function would be buggy) */
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
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
              ...(sameWidth ? [sameWidthModifier] : []),
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

export default InputTriggerPopper;
