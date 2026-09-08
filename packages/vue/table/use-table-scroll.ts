import { onBeforeUnmount, shallowRef } from 'vue';
import type { ShallowRef } from 'vue';
import type { OverlayScrollbars } from 'overlayscrollbars';

export interface UseTableScrollReturn {
  /** Ref object for internal use - points to the actual scrolling element */
  containerRef: ShallowRef<HTMLDivElement | null>;
  /** Container width (viewport width) */
  containerWidth: ShallowRef<number>;
  /** OverlayScrollbars scroll event handler */
  handleScrollbarScroll: (instance: OverlayScrollbars, event: Event) => void;
  /** Handler to be passed to MznScrollbar's `viewport-ready` listener */
  handleViewportReady: (
    viewport: HTMLDivElement,
    instance?: OverlayScrollbars,
  ) => void;
  /** Whether the scroll container ref has been set and is ready */
  isContainerReady: ShallowRef<boolean>;
  /** Whether the container is scrolled away from its left edge. */
  isScrollingHorizontally: ShallowRef<boolean>;
  /** How far the container is scrolled horizontally. */
  scrollLeft: ShallowRef<number>;
  /** Callback ref setter for the disabled-Scrollbar fallback (plain div) */
  setContainerRef: (element: HTMLDivElement | null) => void;
}

/**
 * 追蹤表格捲動容器的寬度與水平捲動位置。
 *
 * 容器可能是 MznScrollbar 的 viewport（透過 `viewport-ready`），也可能是
 * `disabled` 時退回的那個純 div（透過 function ref）；兩條路都會接上同一個
 * ResizeObserver。固定欄的位移與陰影都靠這裡量到的寬度與 `scrollLeft`。
 *
 * @example
 * ```ts
 * const scroll = useTableScroll({ enabled: () => !props.nested });
 * ```
 *
 * @see MznTable 使用這個 composable 的元件
 * @see useTableFixedOffsets 消費這些量測結果的 composable
 */
export function useTableScroll({
  enabled,
}: {
  enabled: () => boolean;
}): UseTableScrollReturn {
  const isScrollingHorizontally = shallowRef(false);
  const scrollLeft = shallowRef(0);
  const containerWidth = shallowRef(0);
  const isContainerReady = shallowRef(false);
  const containerRef = shallowRef<HTMLDivElement | null>(null);

  /** React keeps the observer in a ref; a plain binding is the equivalent. */
  let resizeObserver: ResizeObserver | null = null;

  const measureDimensions = (): void => {
    if (containerRef.value) {
      const newContainerWidth = containerRef.value.clientWidth;

      if (containerWidth.value !== newContainerWidth) {
        containerWidth.value = newContainerWidth;
      }
    }
  };

  // Setup ResizeObserver on an element
  const setupResizeObserver = (element: HTMLDivElement): void => {
    // Clean up previous observer
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    containerRef.value = element;

    if (element && enabled()) {
      // Mark container as ready
      isContainerReady.value = true;

      // Measure immediately
      measureDimensions();

      // Set up ResizeObserver
      resizeObserver = new ResizeObserver(() => {
        measureDimensions();
      });
      resizeObserver.observe(element);
    }
  };

  // Callback ref for disabled Scrollbar (plain div) fallback
  const setContainerRef = (element: HTMLDivElement | null): void => {
    if (element) {
      setupResizeObserver(element);

      return;
    }

    // Clean up when element is removed
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    containerRef.value = null;
    isContainerReady.value = false;
  };

  // Handler for MznScrollbar's `viewport-ready` - receives the viewport element
  const handleViewportReady = (viewport: HTMLDivElement): void => {
    setupResizeObserver(viewport);
  };

  // OverlayScrollbars scroll event handler
  const handleScrollbarScroll = (
    _instance: OverlayScrollbars,
    event: Event,
  ): void => {
    const target = event.target as HTMLElement;
    const newScrollLeft = target.scrollLeft;

    scrollLeft.value = newScrollLeft;
    isScrollingHorizontally.value = newScrollLeft > 0;
  };

  onBeforeUnmount(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });

  return {
    containerRef,
    containerWidth,
    handleScrollbarScroll,
    handleViewportReady,
    isContainerReady,
    isScrollingHorizontally,
    scrollLeft,
    setContainerRef,
  };
}
