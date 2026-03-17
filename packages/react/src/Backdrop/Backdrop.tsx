'use client';

import { forwardRef, MouseEventHandler } from 'react';
import {
  backdropClasses as classes,
  BackdropVariant,
} from '@mezzanine-ui/core/backdrop';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Portal, { PortalProps } from '../Portal';
import { Fade } from '../Transition';
import { useScrollLock } from '../hooks/useScrollLock';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

export interface BackdropProps
  extends Pick<PortalProps, 'children' | 'container' | 'disablePortal'>,
    NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Controls whether to disable closing element while backdrop clicked.
   * @default false
   */
  disableCloseOnBackdropClick?: boolean;
  /**
   * Controls whether to disable scroll locking when backdrop is open.
   * @default false
   */
  disableScrollLock?: boolean;
  /**
   * Click handler for backdrop.
   */
  onBackdropClick?: MouseEventHandler;
  /**
   * Callback fired while the element will be closed.
   */
  onClose?: VoidFunction;
  /**
   * Controls whether to show the element.
   * @default false
   */
  open?: boolean;
  /**
   * The variant of backdrop.
   * @default 'dark'
   */
  variant?: BackdropVariant;
}

/**
 * 用於 Modal、Drawer 等覆蓋層元件的遮罩底層元件。
 *
 * 透過 `Portal` 渲染至指定的 DOM 容器，並使用 `Fade` 動畫處理顯示與隱藏過渡。
 * 開啟時會自動鎖定 body 捲動（可透過 `disableScrollLock` 停用）。
 * 點擊遮罩時預設觸發 `onClose`，可透過 `disableCloseOnBackdropClick` 停用此行為。
 *
 * @example
 * ```tsx
 * import Backdrop from '@mezzanine-ui/react/Backdrop';
 *
 * // 基本用法
 * <Backdrop open={open} onClose={() => setOpen(false)}>
 *   <div>浮層內容</div>
 * </Backdrop>
 *
 * // 使用淺色遮罩並停用點擊關閉
 * <Backdrop
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   variant="light"
 *   disableCloseOnBackdropClick
 * >
 *   <div>強制顯示的內容</div>
 * </Backdrop>
 *
 * // 渲染至自訂容器
 * <Backdrop open={open} onClose={() => setOpen(false)} container={containerRef}>
 *   <div>相對定位的浮層</div>
 * </Backdrop>
 * ```
 *
 * @see {@link Modal} 對話框元件
 * @see {@link Drawer} 抽屜面板元件
 */
const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  function Backdrop(props, ref) {
    const {
      children,
      className,
      container,
      disableCloseOnBackdropClick = false,
      disablePortal,
      disableScrollLock = false,
      onBackdropClick,
      onClose,
      open = false,
      variant = 'dark',
      ...rest
    } = props;

    // Lock body scroll when backdrop is open
    useScrollLock({ enabled: open && !disableScrollLock });

    return (
      <Portal
        container={container}
        disablePortal={disablePortal}
        layer="default"
      >
        <div
          {...rest}
          ref={ref}
          aria-hidden={!open}
          className={cx(
            classes.host,
            classes.hostAbsolute,
            {
              [classes.hostOpen]: open,
            },
            className,
          )}
          role="presentation"
        >
          <div className={classes.main}>
            <Fade
              in={open}
              duration={{
                enter: MOTION_DURATION.fast,
                exit: MOTION_DURATION.fast,
              }}
              easing={{
                enter: MOTION_EASING.standard,
                exit: MOTION_EASING.standard,
              }}
            >
              <div
                aria-hidden="true"
                className={cx(
                  classes.backdrop,
                  classes.backdropVariant(variant),
                )}
                onClick={(event) => {
                  if (!disableCloseOnBackdropClick && onClose) {
                    onClose();
                  }

                  if (onBackdropClick) {
                    onBackdropClick(event);
                  }
                }}
              />
            </Fade>
            <div className={classes.content}>{children}</div>
          </div>
        </div>
      </Portal>
    );
  },
);

export default Backdrop;
