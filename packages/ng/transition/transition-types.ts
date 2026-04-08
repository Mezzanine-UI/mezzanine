/**
 * Core transition type definitions for the Angular transition system.
 *
 * Maps React's `react-transition-group` concepts to Angular equivalents:
 * - React `TransitionState` → Angular animation states (`entering`, `entered`, `exiting`, `exited`)
 * - React `TransitionMode` → `'enter' | 'exit'`
 * - React lifecycle callbacks → Angular `(@trigger.start)` / `(@trigger.done)` events
 */

/** Transition state, mirroring React's `TransitionStatus`. */
export type TransitionState =
  | 'entering'
  | 'entered'
  | 'exiting'
  | 'exited'
  | 'unmounted';

/** Transition mode: enter or exit phase. */
export type TransitionMode = 'enter' | 'exit';

/**
 * Duration config. Accepts a single number (ms) or per-mode object.
 * `'auto'` is supported by Collapse for height-based auto-calculation.
 */
export type TransitionDuration =
  | 'auto'
  | number
  | { readonly [mode in TransitionMode]?: number };

/** Easing config. Accepts a single string or per-mode object. */
export type TransitionEasing =
  | string
  | { readonly [mode in TransitionMode]?: string };

/** Delay config. Accepts a single number (ms) or per-mode object. */
export type TransitionDelay =
  | number
  | { readonly [mode in TransitionMode]?: number };

/**
 * Callback fired during enter transitions.
 * In Angular, wired via `(@trigger.start)` / `(@trigger.done)` events.
 */
export type TransitionEnterHandler = (
  element: HTMLElement,
  isAppearing: boolean,
) => void;

/**
 * Callback fired during exit transitions.
 * In Angular, wired via `(@trigger.start)` / `(@trigger.done)` events.
 */
export type TransitionExitHandler = (element: HTMLElement) => void;
