<script setup lang="ts">
import 'overlayscrollbars/overlayscrollbars.css';

import {
  computed,
  onMounted,
  useAttrs,
  type ComponentPublicInstance,
} from 'vue';
import {
  ClickScrollPlugin,
  OverlayScrollbars,
  type EventListeners,
  type PartialOptions,
} from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';
import { scrollbarClasses as classes } from '@mezzanine-ui/core/scrollbar';
import { toCssLength } from '../_internal/css-length';
import clsx from 'clsx';
import type { ScrollbarProps } from './scrollbar.types';

/**
 * 自訂捲軸容器，在所有瀏覽器上提供一致的捲軸外觀。
 *
 * 以 OverlayScrollbars 實作，透過 `maxHeight` / `maxWidth` 限制容器尺寸並觸發捲動。
 * `disabled` 為 true 時退回原生捲軸的純 div，適合巢狀情境。
 * 初始化完成後會發出 `viewportReady`，可用來銜接虛擬捲動或拖放等外部整合。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznScrollbar } from '@mezzanine-ui/vue/scrollbar';
 * <\/script>
 *
 * <template>
 *   <MznScrollbar :max-height="300">
 *     <LongContent />
 *   </MznScrollbar>
 * </template>
 * ```
 */
const props = withDefaults(defineProps<ScrollbarProps>(), {
  defer: true,
  disabled: false,
});

const emit = defineEmits<{
  viewportReady: [viewport: HTMLDivElement, instance?: OverlayScrollbars];
}>();

defineSlots<{
  default?: () => unknown;
}>();

/**
 * React merges the consumer style *under* maxHeight/maxWidth and puts both
 * `...rest` and `className` on the scroll container. Vue's default fallthrough
 * would let the consumer style win instead, so inheritance is disabled and the
 * attributes are bound before the computed style, which restores React's
 * precedence.
 */
defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

/** Register ClickScrollPlugin once (required for the clickScroll option). */
onMounted(() => {
  OverlayScrollbars.plugin(ClickScrollPlugin);
});

/**
 * In the disabled branch React forwards the plain div through a callback ref.
 * Vue's function ref is the direct equivalent: it is invoked during patch, so
 * the event fires synchronously on attach just as React's does. A `watch` on a
 * template ref would only deliver it on the next tick.
 */
function setDisabledElement(
  element: Element | ComponentPublicInstance | null,
): void {
  if (element instanceof HTMLDivElement) emit('viewportReady', element);
}

const mergedOptions = computed(
  (): PartialOptions => ({
    ...props.options,
    overflow: {
      x: 'scroll',
      y: 'scroll',
    },
    scrollbars: {
      autoHide: 'scroll',
      autoHideDelay: 600,
      clickScroll: true,
      ...props.options?.scrollbars,
    },
  }),
);

const containerStyle = computed(() => ({
  maxHeight: toCssLength(props.maxHeight),
  maxWidth: toCssLength(props.maxWidth),
}));

const hostClasses = computed((): string => clsx(classes.host));

/**
 * React skips the events object entirely when neither `onViewportReady` nor
 * `events` is supplied. `$attrs` tells us whether a `viewportReady` listener is
 * bound, which is the same signal React reads from its props.
 */
const mergedEvents = computed((): EventListeners | undefined => {
  const { events } = props;

  if (!attrs.onViewportReady && !events) return undefined;

  const listeners = events && typeof events !== 'boolean' ? events : undefined;

  return {
    ...listeners,
    initialized: (instance: OverlayScrollbars) => {
      const { viewport } = instance.elements();

      emit('viewportReady', viewport as HTMLDivElement, instance);

      const initialized = listeners?.initialized;

      if (!initialized) return;

      if (Array.isArray(initialized)) {
        initialized.forEach((handler) => handler(instance));
      } else {
        initialized(instance);
      }
    },
  };
});
</script>

<template>
  <div
    v-if="disabled"
    :ref="setDisabledElement"
    v-bind="$attrs"
    :style="containerStyle"
  >
    <slot />
  </div>

  <OverlayScrollbarsComponent
    v-else
    v-bind="$attrs"
    :class="hostClasses"
    :defer="defer"
    element="div"
    :events="mergedEvents"
    :options="mergedOptions"
    :style="containerStyle"
  >
    <slot />
  </OverlayScrollbarsComponent>
</template>
