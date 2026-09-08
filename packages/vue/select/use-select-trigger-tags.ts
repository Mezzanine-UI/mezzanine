import { computed, h, onBeforeUnmount, ref, watch } from 'vue';
import type { ComputedRef, FunctionalComponent, Ref } from 'vue';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import type { TagSize } from '@mezzanine-ui/core/tag';
import MznTag from '../tag/tag.vue';
import type { SelectValue } from './select.types';

export interface UseSelectTriggerTagsOptions {
  /**
   * The wrapper that defines the available width.
   */
  containerRef: Ref<HTMLElement | null>;
  /**
   * Enable ellipsis calculation.
   */
  enabled: () => boolean;
  size: () => TagSize | undefined;
  /**
   * Container of the visible tags list.
   */
  tagsRef: Ref<HTMLElement | null>;
  value: () => SelectValue[] | undefined;
}

export interface UseSelectTriggerTagsValue {
  /**
   * Renders a hidden copy of every tag plus a counter, which is what the
   * measurement reads: the visible list is already truncated, so it cannot say
   * how wide the untruncated one would be.
   */
  FakeTags: FunctionalComponent;
  overflowSelections: ComputedRef<SelectValue[]>;
  takeCount: Ref<number>;
  visibleSelections: ComputedRef<SelectValue[]>;
}

const fakeTagClassName = 'mzn-select-trigger__fake-tag';
const fakeEllipsisClassName = 'mzn-select-trigger__fake-ellipsis';

function getFullWidth(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const marginStart =
    parseFloat(style.marginInlineStart || style.marginLeft || '0') || 0;
  const marginEnd =
    parseFloat(style.marginInlineEnd || style.marginRight || '0') || 0;

  return rect.width + marginStart + marginEnd;
}

/**
 * 計算多選觸發器裡放得下幾個標籤的 composable。
 *
 * 量測一份隱藏的完整標籤列，扣掉溢出計數標籤的寬度後決定 `takeCount`；
 * 容器尺寸改變時會重新量測。`enabled` 為 false 時全部顯示。
 *
 * @example
 * ```ts
 * const { FakeTags, overflowSelections, visibleSelections } = useSelectTriggerTags({
 *   containerRef: wrapper,
 *   enabled: () => props.overflowStrategy === 'counter',
 *   size: () => props.size,
 *   tagsRef: tags,
 *   value: () => props.value,
 * });
 * ```
 *
 * @see MznSelectTriggerTags 使用這個 composable 的元件
 */
export function useSelectTriggerTags(
  options: UseSelectTriggerTagsOptions,
): UseSelectTriggerTagsValue {
  const { containerRef, enabled, size, tagsRef, value } = options;

  const selections = computed((): SelectValue[] => value() ?? []);
  const takeCount = ref(selections.value.length);
  const fakeContainer = ref<HTMLElement | null>(null);

  function measure(): void {
    if (!enabled()) {
      takeCount.value = selections.value.length;

      return;
    }

    const container = containerRef.value ?? tagsRef.value;
    const fake = fakeContainer.value;

    // Keep the current count when the refs are temporarily unavailable, to
    // avoid flicker.
    if (!container || !fake) return;

    const fakeTags = Array.from(
      fake.getElementsByClassName(fakeTagClassName),
    ) as HTMLElement[];
    const fakeEllipsis = fake.getElementsByClassName(
      fakeEllipsisClassName,
    )[0] as HTMLElement | undefined;

    // Keep the current count until the fake tags are in the DOM.
    if (!fakeTags.length) return;

    const computedStyleTarget = tagsRef.value ?? container;
    const containerWidth = container.clientWidth;
    const style = computedStyleTarget
      ? window.getComputedStyle(computedStyleTarget)
      : null;
    const paddingLeft = style ? parseFloat(style.paddingLeft) || 0 : 0;
    const paddingRight = style ? parseFloat(style.paddingRight) || 0 : 0;
    const maxWidth = containerWidth - paddingLeft - paddingRight;
    const ellipsisWidth = fakeEllipsis ? getFullWidth(fakeEllipsis) : 0;

    let nextCount = fakeTags.length;
    let consumedWidth = 0;

    for (let i = 0; i < fakeTags.length; i += 1) {
      const tagWidth = getFullWidth(fakeTags[i]);
      const hasOverflow = fakeTags.length - (i + 1) > 0;
      const reservedWidth = hasOverflow ? ellipsisWidth : 0;

      if (consumedWidth + tagWidth + reservedWidth > maxWidth) {
        nextCount = i;
        break;
      }

      consumedWidth += tagWidth;
      nextCount = i + 1;
    }

    takeCount.value = nextCount;
  }

  watch([selections, size, enabled], () => measure(), {
    flush: 'post',
    immediate: true,
  });

  let observer: ResizeObserver | null = null;

  watch(
    [tagsRef, enabled],
    ([element, isEnabled]) => {
      observer?.disconnect();
      observer = null;

      if (!isEnabled || !element) return;

      observer = new ResizeObserver(() => measure());
      observer.observe(element);
    },
    { flush: 'post', immediate: true },
  );

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });

  const FakeTags: FunctionalComponent = () => {
    if (!enabled() || !selections.value.length) return null;

    return h(
      'div',
      {
        'aria-hidden': true,
        class: classes.triggerTags,
        ref: fakeContainer,
        style: {
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
          opacity: 0,
          inset: 0,
        },
      },
      [
        ...selections.value.map((selection) =>
          h('span', { class: fakeTagClassName, key: `fake-${selection.id}` }, [
            h(MznTag, {
              disabled: true,
              label: selection.name,
              size: size(),
              type: 'dismissable',
            }),
          ]),
        ),
        h('span', { class: fakeEllipsisClassName }, [
          h(MznTag, { count: 99, size: size(), type: 'overflow-counter' }),
        ]),
      ],
    );
  };

  return {
    FakeTags,
    overflowSelections: computed((): SelectValue[] =>
      selections.value.slice(takeCount.value),
    ),
    takeCount,
    visibleSelections: computed((): SelectValue[] =>
      selections.value.slice(0, takeCount.value),
    ),
  };
}
