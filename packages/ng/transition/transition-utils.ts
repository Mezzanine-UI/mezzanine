/**
 * Transition utility functions ported from React's Transition helpers.
 *
 * These provide the same duration/easing/delay resolution logic used by
 * `useSetNodeTransition` and `getTransitionStyleProps` in the React package.
 */

import {
  type TransitionDelay,
  type TransitionDuration,
  type TransitionEasing,
  type TransitionMode,
} from './transition-types';

/** Resolve duration value for a given mode. */
export function getTransitionDuration(
  mode: TransitionMode,
  duration: TransitionDuration,
  resolveAuto?: number | ((mode: TransitionMode) => number),
): number {
  if (duration !== 'auto') {
    return typeof duration === 'number' ? duration : (duration[mode] ?? 0);
  }

  if (typeof resolveAuto === 'function') {
    return resolveAuto(mode);
  }

  return resolveAuto ?? 0;
}

/** Resolve easing (timing function) for a given mode. */
export function getTransitionTimingFunction(
  mode: TransitionMode,
  easing: TransitionEasing,
): string {
  return typeof easing === 'string' ? easing : (easing[mode] ?? 'ease');
}

/** Resolve delay value for a given mode. */
export function getTransitionDelay(
  mode: TransitionMode,
  delay: TransitionDelay,
): number {
  return typeof delay === 'number' ? delay : (delay[mode] ?? 0);
}

/** Resolved transition style properties for a single CSS property. */
export interface TransitionStyleProps {
  readonly delay: number;
  readonly duration: number;
  readonly timingFunction: string;
}

/** Resolve all transition style properties for a given mode. */
export function getTransitionStyleProps(
  mode: TransitionMode,
  config: {
    readonly delay: TransitionDelay;
    readonly duration: TransitionDuration;
    readonly easing: TransitionEasing;
    readonly resolveAutoDuration?: number | ((mode: TransitionMode) => number);
  },
): TransitionStyleProps {
  return {
    delay: getTransitionDelay(mode, config.delay),
    duration: getTransitionDuration(
      mode,
      config.duration,
      config.resolveAutoDuration,
    ),
    timingFunction: getTransitionTimingFunction(mode, config.easing),
  };
}

/**
 * Build a CSS `transition` string for the given properties and mode.
 *
 * Mirrors the React `useSetNodeTransition` hook logic.
 */
export function buildTransitionString(
  mode: TransitionMode,
  properties: readonly string[],
  config: {
    readonly delay: TransitionDelay;
    readonly duration: TransitionDuration;
    readonly easing: TransitionEasing;
    readonly resolveAutoDuration?: number | ((mode: TransitionMode) => number);
  },
): string {
  const resolved = getTransitionStyleProps(mode, config);

  return properties
    .map(
      (property) =>
        `${property} ${resolved.duration}ms ${resolved.timingFunction} ${resolved.delay}ms`,
    )
    .join(',');
}

/**
 * Compute auto size duration based on element height.
 *
 * Ported from React's `getAutoSizeDuration`.
 * Formula: https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
 */
export function getAutoSizeDuration(size?: number): number {
  if (!size) {
    return 0;
  }

  const constant = size / 36;

  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

/**
 * Force a browser reflow on the given element.
 *
 * Used to ensure transition start states are applied before
 * the transition end state is set.
 */
export function reflow(node: HTMLElement): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  node.scrollTop;
}
