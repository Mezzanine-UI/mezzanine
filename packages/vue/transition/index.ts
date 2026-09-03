/**
 * Only the fade implementation is ported so far. The rest of React's
 * transition family (Collapse, Rotate, Scale, Slide, Translate) is deferred
 * until its stories can run: they render Buttons and a Toggle, so the parity
 * harness cannot verify them yet, and porting components that cannot be
 * checked is exactly what this project avoids.
 */
export { default as MznFade } from './fade.vue';
export type {
  TransitionDelay,
  TransitionDuration,
  TransitionEasing,
  TransitionImplementationProps,
  TransitionMode,
} from './transition.types';
export {
  getTransitionDelay,
  getTransitionDuration,
  getTransitionStyleProps,
  getTransitionTimingFunction,
} from './get-transition-style-props';
export type { TransitionStyleProps } from './get-transition-style-props';
