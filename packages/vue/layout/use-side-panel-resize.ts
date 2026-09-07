import { computed, inject, onBeforeUnmount, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { useDocumentEvents } from '../_internal/use-document-events';
import { LAYOUT_CONTEXT } from './layout-context';

export const MIN_PANEL_WIDTH = 240;
export const CONTENT_WRAPPER_MIN_WIDTH = 480;
export const ARROW_KEY_STEP = 10;

export interface UseSidePanelResizeOptions {
  /** The width the panel starts at, before clamping. */
  defaultWidth: () => number;
  /** Which side the panel sits on; it decides which way dragging grows it. */
  side: 'left' | 'right';
  /** Called with every new width, as the panel is dragged or stepped. */
  onWidthChange: (width: number) => void;
}

export interface UseSidePanelResizeReturn {
  /** Whether a drag is in progress; the divider is styled from it. */
  isDragging: Ref<boolean>;
  /** Steps the width with the arrow keys. */
  onDividerKeydown: (event: KeyboardEvent) => void;
  /** Starts a drag. */
  onDividerMousedown: (event: MouseEvent) => void;
  /** The panel's current width in pixels. */
  width: ComputedRef<number>;
}

/**
 * 側邊面板拖曳改變寬度的行為，左右兩側共用。
 *
 * 寬度下限固定 240px，上限則留給主要區域至少 480px。拖曳期間以
 * `requestAnimationFrame` 節流，避免每個 mousemove 都觸發重新渲染。
 *
 * @example
 * ```ts
 * const { isDragging, onDividerKeydown, onDividerMousedown, width } =
 *   useSidePanelResize({
 *     defaultWidth: () => props.defaultWidth,
 *     onWidthChange: (next) => emit('widthChange', next),
 *     side: 'left',
 *   });
 * ```
 */
export function useSidePanelResize(
  options: UseSidePanelResizeOptions,
): UseSidePanelResizeReturn {
  const context = inject(LAYOUT_CONTEXT, undefined);

  const isDragging = ref(false);
  const internalWidth = ref(Math.max(MIN_PANEL_WIDTH, options.defaultWidth()));

  let dragStart: { maxWidth: number; width: number; x: number } | null = null;
  let rafId: number | null = null;

  function cancelPending(): void {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /** The panel may grow until the main area is down to its own minimum. */
  function maxWidthNow(): number {
    const mainWidth = context?.mainRef.value?.offsetWidth || window.innerWidth;

    return (
      internalWidth.value + Math.max(0, mainWidth - CONTENT_WRAPPER_MIN_WIDTH)
    );
  }

  function onDividerMousedown(event: MouseEvent): void {
    event.preventDefault();

    const maxWidth = maxWidthNow();

    isDragging.value = true;
    dragStart = { maxWidth, width: internalWidth.value, x: event.clientX };
  }

  function onDividerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();

    const maxWidth = maxWidthNow();
    const grows = options.side === 'left' ? 'ArrowRight' : 'ArrowLeft';
    const step = event.key === grows ? ARROW_KEY_STEP : -ARROW_KEY_STEP;
    const newWidth = Math.min(
      maxWidth,
      Math.max(MIN_PANEL_WIDTH, internalWidth.value + step),
    );

    internalWidth.value = newWidth;
    options.onWidthChange(newWidth);
  }

  useDocumentEvents(() => {
    if (!isDragging.value) return undefined;

    return {
      mousemove: (event: MouseEvent) => {
        if (!dragStart) return;

        cancelPending();

        rafId = window.requestAnimationFrame(() => {
          rafId = null;

          if (!dragStart) return;

          const delta = event.clientX - dragStart.x;
          const newWidth =
            options.side === 'left'
              ? dragStart.width + delta
              : dragStart.width - delta;
          const clamped = Math.min(
            dragStart.maxWidth,
            Math.max(MIN_PANEL_WIDTH, newWidth),
          );

          internalWidth.value = clamped;
          options.onWidthChange(clamped);
        });
      },
      mouseup: () => {
        cancelPending();
        isDragging.value = false;
        dragStart = null;
      },
    };
  });

  onBeforeUnmount(cancelPending);

  return {
    isDragging,
    onDividerKeydown,
    onDividerMousedown,
    width: computed((): number => internalWidth.value),
  };
}
