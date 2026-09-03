import { getTransitionStyleProps } from './get-transition-style-props';
import type {
  TransitionDelay,
  TransitionDuration,
  TransitionEasing,
  TransitionMode,
} from './transition.types';

export interface FadeTransitionConfig {
  delay: TransitionDelay;
  duration: TransitionDuration;
  easing: TransitionEasing;
}

function applyTransition(
  node: HTMLElement,
  mode: TransitionMode,
  config: FadeTransitionConfig,
): number {
  const { delay, duration, timingFunction } = getTransitionStyleProps(
    mode,
    config,
  );

  node.style.transition = `opacity ${duration}ms ${timingFunction} ${delay}ms`;

  return duration + delay;
}

/**
 * Fade an element in, writing the same inline styles React's `Fade` writes.
 *
 * Shared by MznFade and by any component that has to drive the fade itself
 * because Vue's Transition cannot reach its element — a component child whose
 * root is a fragment (a slot outlet, or a Teleport) never receives the hooks,
 * and the failure is silent.
 */
export function fadeEnter(
  node: HTMLElement,
  config: FadeTransitionConfig,
  done?: () => void,
): void {
  node.style.visibility = '';
  node.style.opacity = '0';

  // Force a reflow so the starting opacity is committed before the transition
  // is armed — the same hack React's Fade performs.
  void node.scrollTop;

  const total = applyTransition(node, 'enter', config);

  node.style.opacity = '1';
  window.setTimeout(() => {
    node.style.transition = '';
    done?.();
  }, total);
}

/**
 * Fade an element out. `hideWhenDone` mirrors React's `keepMount`: the node
 * stays in the DOM, so it has to be hidden once the fade finishes.
 */
export function fadeExit(
  node: HTMLElement,
  config: FadeTransitionConfig,
  done?: () => void,
  hideWhenDone = false,
): void {
  const total = applyTransition(node, 'exit', config);

  node.style.opacity = '0';
  window.setTimeout(() => {
    node.style.transition = '';

    if (hideWhenDone) node.style.visibility = 'hidden';

    done?.();
  }, total);
}
