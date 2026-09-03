import { computed, onScopeDispose, ref, watch } from 'vue';
import { autoUpdate, computePosition } from '@floating-ui/dom';
import type {
  FloatingElement,
  Middleware,
  MiddlewareData,
  Placement,
  ReferenceElement,
  Strategy,
} from '@floating-ui/dom';
import type { ComputedRef, CSSProperties, Ref } from 'vue';

export type FloatingMiddleware = Array<Middleware | null | undefined | false>;

export interface UseFloatingOptions {
  /**
   * Reads the floating element to position. Positioning waits for both
   * elements to exist.
   */
  floating: () => FloatingElement | null;
  /**
   * Reads the middleware to run. Re-read whenever it changes, which is how a
   * middleware that depends on a not-yet-mounted element (the arrow) starts
   * working once that element exists.
   */
  middleware?: () => FloatingMiddleware;
  /**
   * Reads whether the consumer considers the floating element open. Only
   * affects `isPositioned`, exactly as in `@floating-ui/react-dom`.
   */
  open?: () => boolean | undefined;
  /**
   * Reads the requested placement. The returned `placement` is the resolved
   * one, which middleware such as `flip` may change.
   */
  placement?: () => Placement | undefined;
  /**
   * Reads the reference element to position against.
   */
  reference: () => ReferenceElement | null;
  /**
   * Reads the CSS position strategy.
   */
  strategy?: () => Strategy | undefined;
  /**
   * Reads whether to position with `transform` instead of `top`/`left`.
   * @default true
   */
  transform?: () => boolean | undefined;
}

export interface UseFloatingReturn {
  floatingStyles: ComputedRef<CSSProperties>;
  isPositioned: Ref<boolean>;
  middlewareData: Ref<MiddlewareData>;
  placement: Ref<Placement>;
  strategy: ComputedRef<Strategy>;
  update: () => Promise<void>;
  x: Ref<number>;
  y: Ref<number>;
}

function getDPR(element: Element): number {
  if (typeof window === 'undefined') return 1;

  const win = element.ownerDocument.defaultView || window;

  return win.devicePixelRatio || 1;
}

function roundByDPR(element: Element, value: number): number {
  const dpr = getDPR(element);

  return Math.round(value * dpr) / dpr;
}

/**
 * Vue port of `useFloating` from `@floating-ui/react-dom`, built on
 * `@floating-ui/dom`.
 *
 * The React hook is a thin reactive wrapper around `computePosition` plus
 * `autoUpdate`, and `floatingStyles` — rounding by device pixel ratio, the
 * `transform` default, the `will-change` hint above 1.5 DPR — is reproduced
 * value for value, because that is what lands in the DOM and is what the
 * parity diff compares.
 */
export function useFloating(options: UseFloatingOptions): UseFloatingReturn {
  const x = ref(0);
  const y = ref(0);
  const strategy = computed((): Strategy => options.strategy?.() ?? 'absolute');
  const placement = ref<Placement>(options.placement?.() ?? 'bottom');
  const middlewareData = ref<MiddlewareData>({});
  const isPositioned = ref(false);

  async function update(): Promise<void> {
    const reference = options.reference();
    const floating = options.floating();

    if (!reference || !floating) return;

    const data = await computePosition(reference, floating, {
      middleware: options.middleware?.(),
      placement: options.placement?.() ?? 'bottom',
      strategy: strategy.value,
    });

    x.value = data.x;
    y.value = data.y;
    placement.value = data.placement;
    middlewareData.value = data.middlewareData;

    /**
     * The floating element's position may be recomputed while it is closed but
     * still mounted (transitioning out), so `isPositioned` must not be set
     * while `open` is explicitly false.
     */
    isPositioned.value = options.open?.() !== false;
  }

  let cleanup: (() => void) | null = null;

  function stop(): void {
    cleanup?.();
    cleanup = null;
  }

  watch(
    [
      options.reference,
      options.floating,
      (): FloatingMiddleware | undefined => options.middleware?.(),
      (): Placement | undefined => options.placement?.(),
      (): Strategy | undefined => options.strategy?.(),
    ],
    ([reference, floating]) => {
      stop();

      if (!reference || !floating) return;

      cleanup = autoUpdate(reference, floating, update);
    },
    { flush: 'post', immediate: true },
  );

  watch(
    (): boolean | undefined => options.open?.(),
    (open) => {
      if (open === false && isPositioned.value) isPositioned.value = false;
    },
  );

  onScopeDispose(stop);

  const floatingStyles = computed((): CSSProperties => {
    const floating = options.floating();
    const initialStyles: CSSProperties = {
      position: strategy.value,
      left: 0,
      top: 0,
    };

    if (!floating) return initialStyles;

    const roundedX = roundByDPR(floating, x.value);
    const roundedY = roundByDPR(floating, y.value);

    if (options.transform?.() ?? true) {
      return {
        ...initialStyles,
        transform: `translate(${roundedX}px, ${roundedY}px)`,
        ...(getDPR(floating) >= 1.5 && { willChange: 'transform' }),
      };
    }

    return {
      position: strategy.value,
      left: roundedX,
      top: roundedY,
    };
  });

  return {
    floatingStyles,
    isPositioned,
    middlewareData,
    placement,
    strategy,
    update,
    x,
    y,
  };
}
