// Animation triggers (lightweight, no wrapper element)
export {
  mznCollapseAnimation,
  mznFadeAnimation,
  mznRotateAnimation,
  mznScaleAnimation,
  mznSlideRightAnimation,
  mznSlideTopAnimation,
  mznTranslateBottomAnimation,
  mznTranslateLeftAnimation,
  mznTranslateRightAnimation,
  mznTranslateTopAnimation,
} from './animations';

// Directive/Component wrappers (full lifecycle support, configurable inputs)
export { MznCollapse } from './collapse.directive';
export { MznFade } from './fade.directive';
export { MznRotate } from './rotate.directive';
export { MznScale } from './scale.directive';
export { MznSlide, type SlideFrom } from './slide.directive';
export { MznTranslate, type TranslateFrom } from './translate.directive';

// Types and utilities
export {
  type TransitionDelay,
  type TransitionDuration,
  type TransitionEasing,
  type TransitionEnterHandler,
  type TransitionExitHandler,
  type TransitionMode,
  type TransitionState,
} from './transition-types';

export {
  buildTransitionString,
  getAutoSizeDuration,
  getTransitionDelay,
  getTransitionDuration,
  getTransitionStyleProps,
  getTransitionTimingFunction,
  reflow,
  type TransitionStyleProps,
} from './transition-utils';
