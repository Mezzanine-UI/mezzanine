import { useState, useCallback } from 'react';

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

export function useDelayMouseEnterLeave(opt: UseDelayMouseEnterLeave): DelayMouseEnterLeave {
  const {
    mouseLeaveDelay = 0.1,
  } = opt || {};

  /** state that control tooltip visible/invisible */
  const [visible, setVisible] = useState<boolean>(false);
  /** tooltip reference anchor */
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  /** timer for mouse leaving delay */
  let timer: ReturnType<typeof setTimeout>;

  const clearVisibilityDelayTimeout = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
    }
  }, []);

  const onLeave = useCallback(() => {
    timer = setTimeout(() => {
      setVisible(false);
      clearVisibilityDelayTimeout();
    }, mouseLeaveDelay * 1000);
  }, [mouseLeaveDelay]);

  const onPopperEnter = useCallback(() => {
    clearVisibilityDelayTimeout();
    setVisible(true);
  }, []);

  const onTargetEnter = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    setAnchor(event.currentTarget);
    clearVisibilityDelayTimeout();
    setVisible(true);
  }, []);

  return {
    anchor,
    onLeave,
    onPopperEnter,
    onTargetEnter,
    visible,
  };
}
