import {
  cloneVNode,
  computed,
  normalizeStyle,
  onMounted,
  shallowRef,
  watch,
} from 'vue';
import type {
  ComponentPublicInstance,
  ComputedRef,
  CSSProperties,
  FunctionalComponent,
  VNode,
} from 'vue';
import {
  applyExitedStyles,
  runEnterTransition,
  runExitTransition,
} from './transition-styles';
import type { TransitionRunnerConfig } from './transition-styles';

export interface TransitionCallbacks {
  enter?: (node: HTMLElement, isAppearing: boolean) => void;
  entered?: (node: HTMLElement, isAppearing: boolean) => void;
  entering?: (node: HTMLElement, isAppearing: boolean) => void;
  exit?: (node: HTMLElement) => void;
  exited?: (node: HTMLElement) => void;
  exiting?: (node: HTMLElement) => void;
}

export interface UseTransitionImplementationOptions {
  /**
   * Reads the default slot. Passed in rather than read here so the slot is
   * visible in the component that declares it — both to a reader and to the
   * slot checker.
   */
  child: () => VNode[] | undefined;
  config: () => TransitionRunnerConfig;
  in: () => boolean;
  keepMount: () => boolean;
  on: TransitionCallbacks;
}

export interface TransitionImplementation {
  /**
   * Renders the default slot's single child with a ref attached, so the
   * transition can reach an element the component does not own — React's
   * `cloneElement` does exactly this, and a `slot` outlet cannot take a ref.
   */
  TransitionChild: FunctionalComponent;
  onAppear: (element: Element, done: () => void) => void;
  onEnter: (element: Element, done: () => void) => void;
  onLeave: (element: Element, done: () => void) => void;
  /**
   * Whether the child is rendered at all: `keepMount` holds it in the DOM
   * after exiting, which is React's `unmountOnExit: false`.
   */
  shown: ComputedRef<boolean>;
}

/**
 * The shared body of every transition implementation.
 *
 * Vue's `Transition` handles mounting and the enter/leave hooks; the styles are
 * written by the runner, in the same order and with the same values React
 * writes them. `keepMount` is driven here instead, because a child that never
 * leaves the DOM never triggers Vue's leave hooks.
 */
export function useTransitionImplementation(
  options: UseTransitionImplementationOptions,
): TransitionImplementation {
  const node = shallowRef<Element | ComponentPublicInstance | null>(null);
  /** The child's own inline style, which outranks the transition's. */
  let childStyle: CSSProperties = {};

  const TransitionChild: FunctionalComponent = () => {
    const [child] = options.child() ?? [];

    if (!child) return null;

    childStyle = (normalizeStyle((child.props as { style?: unknown })?.style) ??
      {}) as CSSProperties;

    return cloneVNode(child, { ref: node });
  };

  const config = (): TransitionRunnerConfig => ({
    ...options.config(),
    override: childStyle,
  });

  const shown = computed((): boolean => options.in() || options.keepMount());

  function element(): HTMLElement | null {
    const current = node.value;

    if (!current) return null;

    const el = current instanceof Element ? current : current.$el;

    return el instanceof HTMLElement ? el : null;
  }

  let cancelPending: (() => void) | null = null;

  function cancel(): void {
    cancelPending?.();
    cancelPending = null;
  }

  function enter(
    node: HTMLElement,
    isAppearing: boolean,
    done?: () => void,
  ): void {
    cancel();
    options.on.enter?.(node, isAppearing);
    cancelPending = runEnterTransition(node, config(), () => {
      options.on.entered?.(node, isAppearing);
      done?.();
    });
    // The runner writes the entering styles synchronously, so the entering
    // state is applied by here — which is the moment React reports.
    options.on.entering?.(node, isAppearing);
  }

  function exit(node: HTMLElement, done?: () => void): void {
    cancel();
    options.on.exit?.(node);
    cancelPending = runExitTransition(
      node,
      config(),
      () => {
        options.on.exited?.(node);
        done?.();
      },
      options.keepMount(),
    );
    options.on.exiting?.(node);
  }

  watch(options.in, (value) => {
    const el = element();

    if (!options.keepMount() || !el) return;

    if (value) enter(el, false);
    else exit(el);
  });

  onMounted(() => {
    const el = element();

    if (!el) return;

    // Mounted in the exited state: no animation, just the resting styles.
    if (options.keepMount() && !options.in()) {
      applyExitedStyles(el, config());
    }
  });

  return {
    TransitionChild,
    onAppear: (el, done) => enter(el as HTMLElement, true, done),
    onEnter: (el, done) => enter(el as HTMLElement, false, done),
    onLeave: (el, done) => exit(el as HTMLElement, done),
    shown,
  };
}
