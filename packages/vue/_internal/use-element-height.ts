import { onBeforeUnmount, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { resolveElement } from './resolve-element';

export interface ElementHeight {
  /** The measured height, or 0 while disabled or unmounted. */
  height: Ref<number>;
}

/**
 * 以 ResizeObserver 量測元素高度。
 *
 * `enabled` 為 false 時高度歸零並停止觀察，與 React 版一致。
 *
 * @example
 * ```ts
 * const element = ref<HTMLElement | null>(null);
 * const { height } = useElementHeight(element, () => Boolean(props.maxHeight));
 * ```
 *
 * @see MznDropdownItem 用它扣掉 header 與 action 的高度
 */
export function useElementHeight(
  elementRef: Ref<unknown>,
  enabled: () => boolean,
): ElementHeight {
  const height = ref(0);
  let observer: ResizeObserver | null = null;

  const disconnect = (): void => {
    observer?.disconnect();
    observer = null;
  };

  watch(
    [elementRef, enabled],
    ([value, isEnabled]) => {
      disconnect();

      const element = resolveElement(
        value as Parameters<typeof resolveElement>[0],
      );

      if (!isEnabled || !element) {
        height.value = 0;

        return;
      }

      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          height.value = entry.contentRect.height;
        }
      });

      observer.observe(element);
    },
    { immediate: true },
  );

  onBeforeUnmount(disconnect);

  return { height };
}
