import {
  forwardRef,
  ReactElement,
  MouseEventHandler,
  useRef,
  ReactNode,
  useCallback,
  useState,
  RefObject,
} from 'react';
import { tooltipClasses as classes } from '@mezzanine-ui/core/tooltip';
import { flip, offset, shift } from '@floating-ui/react-dom';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import Popper, { PopperProps } from '../Popper';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useDelayMouseEnterLeave } from './useDelayMouseEnterLeave';
import { cx } from '../utils/cx';
import { getCSSVariableValue } from '../utils/get-css-variable-value';

export interface TooltipProps
  extends Omit<PopperProps, 'arrow' | 'children' | 'disablePortal' | 'title'> {
  /**
   * show arrow or not
   * @default true
   */
  arrow?: boolean;
  /**
   * child function that can receive events and ref
   */
  children(opt: {
    onMouseEnter: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
    ref: React.RefCallback<HTMLElement>;
  }): ReactElement<any>;
  /**
   * Whether to disable portal. If true, it will be a normal component.
   * @default true
   */
  disablePortal?: boolean;
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
      arrow: showArrow = true,
      children,
      className,
      disablePortal = true,
      mouseLeaveDelay = 0.1,
      open = false,
      options = {},
      title,
      ...rest
    } = props;

    const { middleware: middlewareProp = [] } = options;
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [targetRef, _setTargetRef] = useState<RefObject<HTMLElement | null>>({
      current: null,
    });

    const composedRef = useComposeRefs([ref, tooltipRef]);

    const { onLeave, onPopperEnter, onTargetEnter, visible } =
      useDelayMouseEnterLeave({ mouseLeaveDelay });

    /** tooltip shown only when title existed && visible is true */
    const isTooltipVisible = open || (visible && Boolean(title));

    const offsetValue =
      Number(
        getCSSVariableValue(`--${spacingPrefix}-gap-base`).replace('rem', ''),
      ) * 16;

    const placement = options.placement || 'top';
    const isPlacementAtEdge =
      placement.endsWith('-start') || placement.endsWith('-end');

    // 設置 target element，並重新渲染
    const setTargetRef = useCallback((element: HTMLElement | null) => {
      _setTargetRef({ current: element });
    }, []);

    // middleware (shift, flip 會衝突，所以依照官方推薦設定 https://floating-ui.com/docs/flip#combining-with-shift)
    const middleware = [offset({ mainAxis: offsetValue })];
    const flipMiddleware = flip({
      crossAxis: 'alignment',
      fallbackAxisSideDirection: 'end',
    });
    const shiftMiddleware = shift();

    if (placement.includes('-')) {
      middleware.push(flipMiddleware, shiftMiddleware);
    } else {
      middleware.push(shiftMiddleware, flipMiddleware);
    }

    return (
      <>
        <Popper
          {...rest}
          ref={composedRef}
          anchor={anchorProp || targetRef.current}
          arrow={
            showArrow
              ? {
                  className: classes.arrow,
                  enabled: true,
                  padding: isPlacementAtEdge
                    ? Number(
                        getCSSVariableValue(
                          `--${spacingPrefix}-padding-horizontal-comfort`,
                        ).replace('rem', ''),
                      ) * 16
                    : 0,
                }
              : undefined
          }
          className={cx(classes.host, className)}
          disablePortal={disablePortal}
          onMouseEnter={onPopperEnter}
          onMouseLeave={onLeave}
          open={isTooltipVisible}
          options={{
            ...options,
            placement,
            middleware: [...middleware, ...middlewareProp],
          }}
        >
          {title}
        </Popper>
        {typeof children === 'function' &&
          children({
            onMouseEnter: onTargetEnter,
            onMouseLeave: onLeave,
            ref: setTargetRef,
          })}
      </>
    );
  },
);

export default Tooltip;
