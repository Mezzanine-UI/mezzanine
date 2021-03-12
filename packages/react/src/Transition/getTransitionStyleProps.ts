import {
  TransitionDelay,
  TransitionDuration,
  TransitionEasing,
  TransitionMode,
} from './Transition';

export function getTransitionDuration(
  mode: TransitionMode,
  duration: TransitionDuration,
  resolveAuto?: number | ((mode: TransitionMode) => number),
): number {
  if (duration !== 'auto') {
    return typeof duration === 'number' ? duration : duration[mode] || 0;
  }

  if (typeof resolveAuto === 'function') {
    return resolveAuto(mode);
  }

  return resolveAuto ?? 0;
}

export function getTransitionTimingFunction(mode: TransitionMode, easing: TransitionEasing): string {
  return typeof easing === 'string' ? easing : easing[mode] || 'ease';
}

export function getTransitionDelay(mode: TransitionMode, delay: TransitionDelay): number {
  return typeof delay === 'number' ? delay : delay[mode] || 0;
}

export interface GetTransitionStyleProps {
  delay: TransitionDelay;
  duration: TransitionDuration;
  easing: TransitionEasing;
  resolveAutoDuration?: Parameters<typeof getTransitionDuration>[2];
}

export interface TransitionStyleProps {
  delay: number;
  duration: number;
  timingFunction: string;
}

export function getTransitionStyleProps(mode: TransitionMode, props: GetTransitionStyleProps): TransitionStyleProps {
  const {
    delay,
    duration,
    easing,
    resolveAutoDuration,
  } = props;

  return {
    delay: getTransitionDelay(mode, delay),
    duration: getTransitionDuration(mode, duration, resolveAutoDuration),
    timingFunction: getTransitionTimingFunction(mode, easing),
  };
}
