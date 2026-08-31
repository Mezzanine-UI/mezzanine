import {
  forwardRef,
  ReactElement,
  FocusEventHandler,
  MouseEventHandler,
  useRef,
  ReactNode,
  useCallback,
  useId,
  useState,
  RefObject,
} from 'react';
import { tooltipClasses as classes } from '@mezzanine-ui/core/tooltip';
import { flip, offset, shift } from '@floating-ui/react-dom';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import Popper, { PopperProps } from '../Popper';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import { useDelayMouseEnterLeave } from './useDelayMouseEnterLeave';
import { cx } from '../utils/cx';
import { getCSSVariableValue } from '../utils/get-css-variable-value';
import { Fade } from '../Transition';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

export interface TooltipProps
  extends Omit<PopperProps, 'arrow' | 'children' | 'disablePortal' | 'title'> {
  /**
   * show arrow or not
   * @default true
   */
  arrow?: boolean;
  /**
   * child function that can receive events and ref.
   *
   * Spread every field onto the trigger element: the mouse handlers drive the
   * pointer flow, `onFocus`/`onBlur` make the tooltip reachable by keyboard,
   * and `aria-describedby` exposes the tooltip content to assistive tech while
   * it is open.
   */
  children(opt: {
    /**
     * Id of the tooltip content node while it is open, otherwise `undefined`.
     * Apply it to the trigger so assistive technology can read the tooltip.
     */
    'aria-describedby': string | undefined;
    onBlur: FocusEventHandler;
    onFocus: FocusEventHandler;
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
   * Override tooltip distance to anchor on main axis. Unit: px.
   * @default value of spacing token `gap-base`
   */
  offsetMainAxis?: number;
  /**
   * title of tooltip
   */
  title?: ReactNode;
}

/**
 * 滑鼠懸停時顯示的提示框元件。
 *
 * 採用 render prop 模式，`children` 為接收 `ref`、滑鼠與焦點事件、以及 `aria-describedby` 的函式；
 * 將整包 payload 攤到觸發元素上，提示才會同時對滑鼠、鍵盤與輔助科技可用（開啟中按 Escape 可關閉）。
 * 內部使用 `Popper` 進行定位，並整合 `flip`、`shift` 等 floating-ui middleware 自動調整位置以避免溢出視窗。
 * 支援自訂偏移量、顯示箭頭及滑鼠離開延遲時間。
 *
 * @example
 * ```tsx
 * import Tooltip from '@mezzanine-ui/react/Tooltip';
 *
 * // 基本用法（攤開整包 payload，滑鼠與鍵盤皆可觸發）
 * <Tooltip title="這是提示文字">
 *   {(tooltipProps) => (
 *     <button {...tooltipProps}>
 *       Hover me
 *     </button>
 *   )}
 * </Tooltip>
 *
 * // 自訂位置與關閉箭頭
 * <Tooltip title="底部提示" arrow={false} options={{ placement: 'bottom' }}>
 *   {({ ref, onMouseEnter, onMouseLeave }) => (
 *     <span ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
 *       文字
 *     </span>
 *   )}
 * </Tooltip>
 *
 * // 增加滑鼠離開延遲
 * <Tooltip title="可懸停的提示" mouseLeaveDelay={0.3}>
 *   {({ ref, onMouseEnter, onMouseLeave }) => (
 *     <button ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
 *       按鈕
 *     </button>
 *   )}
 * </Tooltip>
 * ```
 *
 * @see {@link Popper} 浮動定位元件
 */
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      anchor: anchorProp,
      arrow: showArrow = true,
      children,
      className,
      disablePortal = true,
      id: idProp,
      mouseLeaveDelay = 0.1,
      offsetMainAxis,
      open = false,
      options = {},
      role: roleProp,
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

    /** keyboard focus opens the tooltip alongside the pointer flow */
    const [focused, setFocused] = useState(false);
    /**
     * Escape hides the tooltip without moving the pointer or the focus
     * (WCAG 1.4.13). Reset whenever the trigger is entered/focused again so the
     * tooltip can be brought back.
     */
    const [dismissed, setDismissed] = useState(false);

    const generatedId = useId();
    const tooltipId = idProp ?? generatedId;

    /** tooltip shown only when title existed && hovered or focused */
    const isTriggerVisible =
      !dismissed && (visible || focused) && Boolean(title);
    const isTooltipVisible = open || isTriggerVisible;

    const onTargetFocus = useCallback(() => {
      setDismissed(false);
      setFocused(true);
    }, []);

    const onTargetBlur = useCallback(() => {
      setFocused(false);
    }, []);

    const onTargetMouseEnter = useCallback(
      (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setDismissed(false);
        onTargetEnter(event);
      },
      [onTargetEnter],
    );

    // Escape only dismisses the hover/focus driven tooltip — a controlled
    // `open` tooltip stays under the consumer's control.
    useDocumentEscapeKeyDown(() => {
      if (!isTriggerVisible) return;

      return () => setDismissed(true);
    }, [isTriggerVisible]);

    const offsetValue =
      offsetMainAxis ??
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
        <Fade
          in={isTooltipVisible}
          duration={{
            enter: MOTION_DURATION.fast,
            exit: MOTION_DURATION.fast,
          }}
          easing={{
            enter: MOTION_EASING.standard,
            exit: MOTION_EASING.standard,
          }}
        >
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
            id={tooltipId}
            onMouseEnter={onPopperEnter}
            onMouseLeave={onLeave}
            open={isTooltipVisible}
            role={roleProp ?? 'tooltip'}
            options={{
              ...options,
              placement,
              middleware: [...middleware, ...middlewareProp],
            }}
          >
            {title}
          </Popper>
        </Fade>
        {typeof children === 'function' &&
          children({
            'aria-describedby': isTooltipVisible ? tooltipId : undefined,
            onBlur: onTargetBlur,
            onFocus: onTargetFocus,
            onMouseEnter: onTargetMouseEnter,
            onMouseLeave: onLeave,
            ref: setTargetRef,
          })}
      </>
    );
  },
);

export default Tooltip;
