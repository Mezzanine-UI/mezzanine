<script setup lang="ts">
import { computed, ref } from 'vue';
import { inputTriggerPopperClasses as classes } from '@mezzanine-ui/core/_internal/input-trigger-popper';
import { flip, offset, size } from '@floating-ui/dom';
import MznPopper from '../popper/popper.vue';
import type { PopperOptions } from '../popper/popper.types';
import MznFade from '../transition/fade.vue';
import type { InputTriggerPopperProps } from './input-trigger-popper.types';

/**
 * 由輸入框觸發的浮層：淡入淡出的 Popper。
 *
 * 預設對齊在錨點左下方並保留 4px 間距，空間不足時自動翻面；
 * `sameWidth` 會讓浮層的最小寬度跟著錨點。浮層內的點擊與觸控不會往外冒泡，
 * 否則 portal 出去的內容會被外部點擊關閉。
 *
 * @example
 * ```vue
 * <template>
 *   <MznInputTriggerPopper :anchor="anchor" :open="open">
 *     <MznTimePanel />
 *   </MznInputTriggerPopper>
 * </template>
 * ```
 *
 * @see MznPopper 底層的定位元件
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputTriggerPopperProps>(), {
  anchor: undefined,
  arrow: undefined,
  container: undefined,
  disablePortal: undefined,
  fadeProps: undefined,
  open: false,
  options: undefined,
  sameWidth: undefined,
});

defineSlots<{
  /** The popper's content. */
  default?: () => unknown;
}>();

const popper = ref<InstanceType<typeof MznPopper> | null>(null);

/**
 * React forwards a ref to the popper element; the same element is exposed
 * here, read through the floating controller because a template ref cannot
 * see through the Teleport.
 */
defineExpose({
  element: computed(
    (): HTMLElement | null =>
      (popper.value?.controllerRef.elements.floating.value as HTMLElement) ??
      null,
  ),
});

// Middleware to make the popper have the same min-width as the reference element
const sameWidthMiddleware = size({
  apply({ rects, elements }) {
    Object.assign(elements.floating.style, {
      minWidth: `${rects.reference.width}px`,
    });
  },
});

const resolvedOptions = computed((): PopperOptions => {
  const { middleware = [], ...restPopperOptions } = props.options || {};

  return {
    placement: 'bottom-start',
    ...restPopperOptions,
    middleware: [
      offset({ mainAxis: 4 }),
      flip({ fallbackAxisSideDirection: 'end', padding: 8 }),
      ...(props.sameWidth ? [sameWidthMiddleware] : []),
      ...middleware,
    ],
  };
});

/** Prevent event bubble (Because popper may use portal, then click away function would be buggy) */
function stopPropagation(event: Event): void {
  event.stopPropagation();
}

const hostClass = classes.host;
</script>

<template>
  <MznFade v-bind="fadeProps" :in="open">
    <MznPopper
      ref="popper"
      :anchor="anchor"
      :arrow="arrow"
      :class="hostClass"
      :container="container"
      :disable-portal="disablePortal"
      open
      :options="resolvedOptions"
      @click="stopPropagation"
      @touchend="stopPropagation"
      @touchmove="stopPropagation"
      @touchstart="stopPropagation"
    >
      <slot />
    </MznPopper>
  </MznFade>
</template>
