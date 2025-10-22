import { useState, useCallback, useRef } from 'react';

export interface UseDelayMouseEnterLeave {
  mouseLeaveDelay?: number;
}

export interface DelayMouseEnterLeave {
  anchor: HTMLButtonElement | null;
  onLeave(v: any): void;
  onPopperEnter(v: any): void;
  onTargetEnter(v: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  visible: boolean;
}

export function useDelayMouseEnterLeave(
  opt: UseDelayMouseEnterLeave,
): DelayMouseEnterLeave {
  const { mouseLeaveDelay = 0.1 } = opt || {};

  /** state that control tooltip visible/invisible */
  const [visible, setVisible] = useState<boolean>(false);
  /** tooltip reference anchor */
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
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
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();

      setAnchor(event.currentTarget);
      clearVisibilityDelayTimeout();
      setVisible(true);
    },
    [clearVisibilityDelayTimeout],
  );

  return {
    anchor,
    onLeave,
    onPopperEnter,
    onTargetEnter,
    visible,
  };
}
