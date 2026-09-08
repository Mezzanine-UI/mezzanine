<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { arrow as arrowMiddleware } from '@floating-ui/dom';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import { getCSSVariableValue } from '../_internal/css-variable';
import { getElement } from '../_internal/get-element';
import MznPortal from '../portal/portal.vue';
import { useFloating } from './use-floating';
import type { FloatingMiddleware } from './use-floating';
import type {
  PopperController,
  PopperPlacement,
  PopperProps,
} from './popper.types';

/**
 * 依錨點元素定位的浮層容器，位置計算由 `@floating-ui/dom` 負責。
 *
 * `open` 為 false 時完全不渲染。內容預設會經由 MznPortal 送出文件流，可用
 * `container` 或 `disablePortal` 改變目的地。`options` 直接餵給位置計算，
 * `arrow` 開啟後會渲染箭頭並自動套用對應的旋轉與偏移。
 *
 * 位置解析完成後（含 flip 之類 middleware 造成的翻轉）會發出 `placementChange`，
 * 帶著實際採用的 placement。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref, useTemplateRef } from 'vue';
 * import { MznPopper } from '@mezzanine-ui/vue/popper';
 *
 * const anchor = useTemplateRef('anchor');
 * const open = ref(false);
 * <\/script>
 *
 * <template>
 *   <button ref="anchor" @click="open = !open">Toggle</button>
 *   <MznPopper :anchor="anchor" :open="open" :options="{ placement: 'bottom-start' }">
 *     <div>Popper content</div>
 *   </MznPopper>
 * </template>
 * ```
 *
 * @see MznPortal 決定浮層落在 DOM 的哪個位置
 */
/**
 * Everything that is not a declared prop belongs on the floating div — React
 * spreads its rest props there — and `style` has to be merged by hand so the
 * computed position wins over a caller's style, which is React's order.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopperProps>(), {
  anchor: undefined,
  arrow: undefined,
  container: undefined,
  disablePortal: undefined,
  open: false,
  options: undefined,
});

const emit = defineEmits<{
  placementChange: [placement: PopperPlacement];
}>();

defineSlots<{
  default?: () => unknown;
}>();

const attrs = useAttrs();
const floating = ref<HTMLDivElement | null>(null);
const arrowElement = ref<SVGSVGElement | null>(null);

/**
 * Re-read on every change, so the arrow middleware picks up its element once
 * the svg mounts. React gets the same effect from re-rendering with the ref
 * populated — its first render passes a null element, which the react-dom
 * wrapper turns into a no-op. `@floating-ui/dom`'s middleware types the
 * element as required, so the middleware is left out entirely until the svg
 * exists; a no-op and an absent middleware position identically.
 */
const middleware = computed(
  (): FloatingMiddleware => [
    ...(props.options?.middleware ?? []),
    props.arrow?.enabled && arrowElement.value
      ? arrowMiddleware({
          element: arrowElement.value,
          padding: props.arrow.padding || 0,
        })
      : null,
  ],
);

const controller = useFloating({
  floating: () => floating.value,
  middleware: () => middleware.value,
  open: () => props.options?.open,
  placement: () => props.options?.placement,
  reference: () => getElement(props.anchor),
  strategy: () => props.options?.strategy,
  transform: () => props.options?.transform,
});

const { floatingStyles, middlewareData, placement } = controller;

defineExpose({
  get controllerRef(): PopperController {
    return controller;
  },
});

watch(placement, (value) => emit('placementChange', value), {
  immediate: true,
});

const popperStyles = computed((): CSSProperties[] => [
  attrs.style as CSSProperties,
  floatingStyles.value,
  {
    visibility: middlewareData.value.hide?.referenceHidden
      ? 'hidden'
      : 'visible',
  },
]);

const forwardedAttrs = computed(() => {
  const { style: _style, ...rest } = attrs;

  return rest;
});

/**
 * Which edge of the popper the arrow sits against, and how far past it, for
 * each resolved side. The pixel values are React's own literals rather than
 * design tokens — the arrow's own size does come from the spacing tokens.
 */
const STATIC_SIDE: Record<string, { property: string; value: string }> = {
  top: { property: 'bottom', value: '-6px' },
  right: { property: 'left', value: '-8px' },
  bottom: { property: 'top', value: '-6px' },
  left: { property: 'right', value: '-8px' },
};

const ROTATION: Record<string, string> = {
  top: '0deg',
  right: '90deg',
  bottom: '180deg',
  left: '-90deg',
};

const arrowStyles = computed((): CSSProperties => {
  const side = placement.value.split('-')[0];
  const staticSide = STATIC_SIDE[side];
  const arrowX = middlewareData.value.arrow?.x;
  const arrowY = middlewareData.value.arrow?.y;

  const styles: CSSProperties = {
    width: getCSSVariableValue(`--${spacingPrefix}-size-element-slim`),
    height: getCSSVariableValue(`--${spacingPrefix}-size-element-tight`),
    transformOrigin: 'center',
    position: 'absolute',
    left: typeof arrowX === 'number' ? `${arrowX}px` : undefined,
    top: typeof arrowY === 'number' ? `${arrowY}px` : undefined,
    [staticSide.property]: staticSide.value,
  };

  const rotation = ROTATION[side];

  if (rotation) {
    styles.transform = `rotate(${rotation})`;
  }

  return styles;
});
</script>

<template>
  <MznPortal v-if="open" :container="container" :disable-portal="disablePortal">
    <div
      v-bind="forwardedAttrs"
      ref="floating"
      :data-popper-placement="placement"
      :style="popperStyles"
    >
      <svg
        v-if="arrow?.enabled"
        ref="arrowElement"
        :class="arrow.className"
        fill="none"
        :style="arrowStyles"
        viewBox="0 0 12 6"
      >
        <path
          d="M6.70711 5.29289C6.31658 5.68342 5.68342 5.68342 5.29289 5.29289L0 0L12 6.05683e-07L6.70711 5.29289Z"
          fill="currentColor"
        />
      </svg>
      <slot />
    </div>
  </MznPortal>
</template>
