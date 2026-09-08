import { getTransitionStyleProps } from './get-transition-style-props';
import type { CSSProperties } from 'vue';
import type {
  TransitionDelay,
  TransitionDuration,
  TransitionEasing,
  TransitionMode,
} from './transition.types';

export interface TransitionPhaseStyles {
  /**
   * Applied once the enter transition has been armed. React reaches it by
   * re-rendering in the `entering` state.
   */
  entering: CSSProperties;
  /**
   * Applied when the enter transition finishes — Scale swaps its `scale(1)`
   * for `none` here, so it is not always the same as `entering`.
   */
  entered: CSSProperties;
  /**
   * The starting point of an enter, and where an exit lands.
   */
  exited: CSSProperties;
  /**
   * Always applied, whatever the phase: `transformOrigin`, for instance.
   */
  base?: CSSProperties;
  /**
   * The child's own inline style, re-applied after every phase so it keeps
   * winning. React merges `...children.props.style` last on every render, so a
   * child that sets its own `opacity` or `transformOrigin` overrides the
   * transition's; writing to the node directly would silently take that away.
   */
  override?: CSSProperties;
}

export interface TransitionRunnerConfig extends TransitionPhaseStyles {
  delay: TransitionDelay;
  duration: TransitionDuration;
  easing: TransitionEasing;
  /**
   * CSS properties to transition, in React's order — the resulting
   * `transition` string is compared character for character by nothing, but
   * the properties it covers decide what actually animates.
   */
  properties: string[];
}

function applyStyles(node: HTMLElement, styles: CSSProperties): void {
  Object.entries(styles).forEach(([property, value]) => {
    node.style.setProperty(
      property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`),
      value == null ? '' : String(value),
    );
  });
}

/** Base, then the phase, then the child's own style — React's merge order. */
function phase(
  config: TransitionRunnerConfig,
  styles: CSSProperties,
): CSSProperties {
  return { ...config.base, ...styles, ...config.override };
}

function writeTransition(
  node: HTMLElement,
  mode: TransitionMode,
  config: TransitionRunnerConfig,
): number {
  const { delay, duration, timingFunction } = getTransitionStyleProps(
    mode,
    config,
  );

  node.style.transition = config.properties
    .map((property) => `${property} ${duration}ms ${timingFunction} ${delay}ms`)
    .join(',');

  return duration + delay;
}

/**
 * Force a reflow so the starting styles are committed before the transition is
 * armed. Ported from React's `reflow`.
 */
function reflow(node: HTMLElement): void {
  void node.scrollTop;
}

/**
 * Run the enter transition, writing the same inline styles React writes.
 *
 * Shared by every transition implementation, and by any component that has to
 * drive one itself: Vue's `Transition` reaches a component child only when it
 * renders a single root element, and a Teleport or a slot outlet is neither.
 *
 * Returns a cancel function. It has to be called when another transition
 * starts: react-transition-group cancels its pending callback on every state
 * change, and without that an enter finishing after an exit began would snap
 * the element back to the entered styles.
 */
export function runEnterTransition(
  node: HTMLElement,
  config: TransitionRunnerConfig,
  done?: () => void,
): () => void {
  node.style.visibility = '';
  applyStyles(node, phase(config, config.exited));

  reflow(node);

  const total = writeTransition(node, 'enter', config);

  applyStyles(node, phase(config, config.entering));

  const timer = window.setTimeout(() => {
    applyStyles(node, phase(config, config.entered));
    node.style.transition = '';
    done?.();
  }, total);

  return () => window.clearTimeout(timer);
}

/**
 * Run the exit transition. `hideWhenDone` mirrors React's `keepMount`: the node
 * stays in the DOM, so it has to be hidden once the exit finishes.
 */
export function runExitTransition(
  node: HTMLElement,
  config: TransitionRunnerConfig,
  done?: () => void,
  hideWhenDone = false,
): () => void {
  const total = writeTransition(node, 'exit', config);

  applyStyles(node, phase(config, config.exited));

  const timer = window.setTimeout(() => {
    node.style.transition = '';

    if (hideWhenDone) node.style.visibility = 'hidden';

    done?.();
  }, total);

  return () => window.clearTimeout(timer);
}

/**
 * The resting styles of a node that is mounted but has never entered — what
 * React renders for the `exited` state while `keepMount` holds it in the DOM.
 */
export function applyExitedStyles(
  node: HTMLElement,
  config: TransitionRunnerConfig,
): void {
  applyStyles(node, phase(config, config.exited));
  node.style.visibility = 'hidden';
}
