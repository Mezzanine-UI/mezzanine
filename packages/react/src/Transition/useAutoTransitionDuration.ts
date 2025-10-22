import { useRef, useEffect } from 'react';
import { TransitionDuration, TransitionProps } from './Transition';

export function useAutoTransitionDuration(duration?: TransitionDuration) {
  const timer = useRef(NaN);
  const autoTransitionDurationRef = useRef(NaN);
  const addEndListener: TransitionProps['addEndListener'] = (_, next) => {
    if (duration === 'auto') {
      timer.current = window.setTimeout(
        () => next(),
        autoTransitionDurationRef.current || 0,
      );
    }
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { autoTransitionDurationRef, addEndListener };
}
