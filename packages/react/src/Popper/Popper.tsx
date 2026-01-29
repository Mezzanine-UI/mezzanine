'use client';

import {
  forwardRef,
  Ref,
  useImperativeHandle,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  autoUpdate,
  useFloating,
  UseFloatingOptions,
  UseFloatingReturn,
  Placement,
  Strategy,
  arrow as arrowMiddleware,
} from '@floating-ui/react-dom';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import { ElementGetter, getElement } from '../utils/getElement';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Portal, { PortalProps } from '../Portal';
import { getCSSVariableValue } from '../utils/get-css-variable-value';

export type PopperPlacement = Placement;
export type PopperPositionStrategy = Strategy;
export type PopperController = UseFloatingReturn;

export interface PopperProps
  extends Pick<PortalProps, 'container' | 'disablePortal'>,
    NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The ref of trigger Element.
   */
  anchor?: ElementGetter;
  /**
   * Whether to show arrow element on the popper
   */
  arrow?: {
    enabled: boolean;
    className: string;
    padding?: number;
  } | null;
  /**
   * Provide `controllerRef` if you need access to `useFloating` results.
   */
  controllerRef?: Ref<PopperController>;
  /**
   * The portal element will show if open=true
   * @default false
   */
  open?: boolean;
  /**
   * The options of useFloating hook from @floating-ui/react-dom.
   */
  options?: UseFloatingOptions;
}

const Popper = forwardRef<HTMLDivElement, PopperProps>(
  function Popper(props, ref) {
    const {
      anchor,
      arrow,
      children,
      container,
      controllerRef,
      disablePortal,
      open = false,
      options,
      style,
      ...rest
    } = props;

    const arrowRef = useRef<SVGSVGElement>(null);
    const anchorEl = getElement(anchor);
    const floatingReturn = useFloating({
      ...options,
      whileElementsMounted: autoUpdate,
      middleware: [
        ...(options?.middleware ?? []),
        arrow?.enabled
          ? arrowMiddleware({
              element: arrowRef.current,
              padding: arrow.padding || 0,
            })
          : null,
      ],
      elements: {
        reference: anchorEl,
      },
    });

    const { refs, floatingStyles, update } = floatingReturn;
    const composedRef = useComposeRefs([ref, refs.setFloating]);

    useImperativeHandle(controllerRef, () => floatingReturn, [floatingReturn]);

    useEffect(() => {
      if (anchorEl) {
        refs.setReference(anchorEl);
      }
    }, [anchorEl, refs]);

    useEffect(() => {
      if (open && update) {
        update();
      }
    }, [open, update]);

    // 計算箭頭的位置和旋轉角度
    const arrowX = floatingReturn.middlewareData.arrow?.x;
    const arrowY = floatingReturn.middlewareData.arrow?.y;
    const placement = floatingReturn.placement;

    // 根據 placement 決定箭頭的靜態位置和旋轉
    const getArrowStyles = useCallback(() => {
      const staticSide = {
        top: {
          property: 'bottom',
          value: '-6px',
        },
        right: {
          property: 'left',
          value: '-8px',
        },
        bottom: {
          property: 'top',
          value: '-6px',
        },
        left: {
          property: 'right',
          value: '-8px',
        },
      }[placement.split('-')[0]] as { property: string; value: string };

      const arrowStyles: React.CSSProperties = {
        width: getCSSVariableValue(`--${spacingPrefix}-size-element-slim`),
        height: getCSSVariableValue(`--${spacingPrefix}-size-element-tight`),
        transformOrigin: 'center',
        position: 'absolute',
        left: typeof arrowX === 'number' ? `${arrowX}px` : undefined,
        top: typeof arrowY === 'number' ? `${arrowY}px` : undefined,
        [staticSide.property]: staticSide.value,
      };

      // 根據 placement 旋轉箭頭
      const rotation = {
        top: '0deg',
        right: '90deg',
        bottom: '180deg',
        left: '-90deg',
      }[placement.split('-')[0]];

      if (rotation) {
        arrowStyles.transform = `rotate(${rotation})`;
      }

      return arrowStyles;
    }, [arrowX, arrowY, placement]);

    if (!open) {
      return null;
    }

    return (
      <Portal container={container} disablePortal={disablePortal}>
        <div
          {...rest}
          ref={composedRef}
          // data-popper-placement 是為了支援舊版 react-popper migration 過來的測試碼
          // 不影響功能，所以若無什麼狀況請保留著
          data-popper-placement={floatingReturn.placement}
          style={{
            ...style,
            ...floatingStyles,
            visibility: floatingReturn.middlewareData.hide?.referenceHidden
              ? 'hidden'
              : 'visible',
          }}
        >
          {arrow?.enabled ? (
            <svg
              viewBox="0 0 12 6"
              fill="none"
              ref={arrowRef}
              className={arrow?.className}
              style={getArrowStyles()}
            >
              <path
                d="M6.70711 5.29289C6.31658 5.68342 5.68342 5.68342 5.29289 5.29289L0 0L12 6.05683e-07L6.70711 5.29289Z"
                fill="currentColor"
              />
            </svg>
          ) : null}
          {children}
        </div>
      </Portal>
    );
  },
);

export default Popper;
