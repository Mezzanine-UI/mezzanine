import { useState, useCallback, useRef } from 'react';

export interface UseDelayMouseEnterLeave {
  mouseLeaveDelay?: number;
}

export interface DelayMouseEnterLeave {
  onLeave(v: any): void;
  onPopperEnter(v: any): void;
  onTargetEnter(v: React.MouseEvent<HTMLElement, MouseEvent>): void;
  visible: boolean;
}

/**
 * 管理帶有延遲的滑鼠移入／移出可見性狀態的 Hook。
 *
 * 在滑鼠離開目標或 Popper 時，會等待 `mouseLeaveDelay` 秒後才隱藏，
 * 讓使用者有時間將游標移入 Popper 內容區域而不觸發消失。
 *
 * @example
 * ```tsx
 * import { useDelayMouseEnterLeave } from '@mezzanine-ui/react';
 *
 * const { visible, onTargetEnter, onLeave, onPopperEnter } = useDelayMouseEnterLeave({
 *   mouseLeaveDelay: 0.1,
 * });
 * ```
 *
 * @see {@link Tooltip} 搭配的元件
 */
export function useDelayMouseEnterLeave(
  opt: UseDelayMouseEnterLeave,
): DelayMouseEnterLeave {
  const { mouseLeaveDelay = 0.1 } = opt || {};

  /** state that control tooltip visible/invisible */
  const [visible, setVisible] = useState<boolean>(false);
  /** timer for mouse leaving delay - use ref to persist across renders */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearVisibilityDelayTimeout = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onLeave = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setVisible(false);
      clearVisibilityDelayTimeout();
    }, mouseLeaveDelay * 1000);
  }, [mouseLeaveDelay, clearVisibilityDelayTimeout]);

  const onPopperEnter = useCallback(() => {
    clearVisibilityDelayTimeout();
    setVisible(true);
  }, [clearVisibilityDelayTimeout]);

  const onTargetEnter = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();
      clearVisibilityDelayTimeout();
      setVisible(true);
    },
    [clearVisibilityDelayTimeout],
  );

  return {
    onLeave,
    onPopperEnter,
    onTargetEnter,
    visible,
  };
}
