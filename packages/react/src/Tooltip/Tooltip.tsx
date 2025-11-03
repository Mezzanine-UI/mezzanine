import {
  forwardRef,
  ReactElement,
  MouseEventHandler,
  useRef,
  ReactNode,
} from 'react';
import { tooltipClasses as classes } from '@mezzanine-ui/core/tooltip';
import { StrictModifiers } from '@popperjs/core';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import Popper, { PopperProps } from '../Popper';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useDelayMouseEnterLeave } from './useDelayMouseEnterLeave';
import { cx } from '../utils/cx';
import { getCSSVariableValue } from '../utils/get-css-variable-value';

export interface TooltipProps extends Omit<PopperProps, 'children' | 'title'> {
  /**
   * child function that can receive events
   */
  children(opt: {
    onMouseEnter: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
  }): ReactElement<any>;
  /**
   * delay time to hide when mouse leave. unit: s.
   * @default 0.1
   */
  mouseLeaveDelay?: number;
  /**
   * title of tooltip
   */
  title?: ReactNode;
}

/**
 * The react component for `mezzanine` tooltip.
 */
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      anchor: anchorProp,
      children,
      className,
      mouseLeaveDelay = 0.1,
      open = false,
      options = {},
      title,
      ...rest
    } = props;

    const { modifiers = [] } = options;
    const tooltipRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposeRefs([ref, tooltipRef]);

    const { anchor, onLeave, onPopperEnter, onTargetEnter, visible } =
      useDelayMouseEnterLeave({ mouseLeaveDelay });

    /** tooltip shown only when title existed && visible is true */
    const isTooltipVisible = open || (visible && Boolean(title));

    const offset =
      Number(
        getCSSVariableValue(`--${spacingPrefix}-gap-base`).replace('rem', ''),
      ) * 16;

    const offsetModifier: StrictModifiers = {
      name: 'offset',
      options: { offset: [0, offset] },
    };

    return (
      <>
        <Popper
          {...rest}
          ref={composedRef}
          anchor={anchorProp || anchor}
          className={cx(classes.host, className)}
          onMouseEnter={onPopperEnter}
          onMouseLeave={onLeave}
          open={isTooltipVisible}
          options={{ ...options, modifiers: [...modifiers, offsetModifier] }}
        >
          {title}
        </Popper>
        {typeof children === 'function' &&
          children({ onMouseEnter: onTargetEnter, onMouseLeave: onLeave })}
      </>
    );
  },
);

export default Tooltip;
