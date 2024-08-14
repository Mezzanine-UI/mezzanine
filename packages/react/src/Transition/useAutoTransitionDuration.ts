import { useRef, useEffect } from 'react';
import { TransitionDuration, TransitionProps } from './Transition';

export function useAutoTransitionDuration(duration?: TransitionDuration) {
  const timer = useRef(NaN);
  const autoTransitionDuration = useRef(NaN);
  const addEndListener: TransitionProps['addEndListener'] = (_, next) => {
    if (duration === 'auto') {
      timer.current = window.setTimeout(
        () => next(),
        autoTransitionDuration.current || 0,
      );
    }
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { autoTransitionDuration, addEndListener };
}
