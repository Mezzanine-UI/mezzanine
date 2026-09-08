<script setup lang="ts">
import {
  computed,
  ref,
  shallowRef,
  useAttrs,
  useId,
  useSlots,
  watch,
} from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { tooltipClasses as classes } from '@mezzanine-ui/core/tooltip';
import { flip, offset, shift } from '@floating-ui/dom';
import type { Middleware } from '@floating-ui/dom';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import { getCSSVariableValue } from '../_internal/css-variable';
import { resolveElement } from '../_internal/resolve-element';
import { useDocumentEscapeKeyDown } from '../_internal/use-document-escape-key-down';
import MznPopper from '../popper/popper.vue';
import { fadeEnter } from '../transition/fade-transition';
import type {
  PopperArrow,
  PopperController,
  PopperOptions,
  PopperPlacement,
} from '../popper/popper.types';
import { useDelayMouseEnterLeave } from './use-delay-mouse-enter-leave';
import type { TooltipProps, TooltipTriggerProps } from './tooltip.types';

/**
 * 滑鼠懸停時顯示的提示框元件。
 *
 * 預設 slot 是 scoped slot，會收到 `ref`、滑鼠與焦點事件、以及 `aria-describedby`；
 * 把整包 payload 攤到觸發元素上，提示才會同時對滑鼠、鍵盤與輔助科技可用
 * （開啟中按 Escape 可關閉）。內部使用 MznPopper 定位，並整合 `flip`、`shift`
 * middleware 自動調整位置以避免溢出視窗。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTooltip } from '@mezzanine-ui/vue/tooltip';
 * <\/script>
 *
 * <template>
 *   <MznTooltip title="這是提示文字">
 *     <template #default="tooltipProps">
 *       <button v-bind="tooltipProps">Hover me</button>
 *     </template>
 *   </MznTooltip>
 *
 *   <MznTooltip :arrow="false" :options="bottomPlacement" title="底部提示">
 *     <template #default="tooltipProps">
 *       <span v-bind="tooltipProps">文字</span>
 *     </template>
 *   </MznTooltip>
 * </template>
 * ```
 *
 * @see MznPopper 浮動定位元件
 */
/**
 * The trigger and the popper are siblings, so there is no single root to
 * inherit attributes onto — React spreads its rest props onto the Popper, and
 * that is done explicitly below.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipProps>(), {
  anchor: undefined,
  arrow: true,
  container: undefined,
  disablePortal: true,
  mouseLeaveDelay: 0.1,
  offsetMainAxis: undefined,
  open: false,
  options: undefined,
  title: undefined,
});

const emit = defineEmits<{
  placementChange: [placement: PopperPlacement];
}>();

defineSlots<{
  /**
   * The trigger. Spread the payload onto the element that opens the tooltip.
   */
  default?: (props: TooltipTriggerProps) => unknown;
  /**
   * Tooltip content, for anything richer than the `title` string.
   */
  title?: () => unknown;
}>();

/**
 * 滑鼠點擊在 Chrome / Firefox 也會 focus button，若不收斂，
 * 點一下就會跳出 tooltip，且滑鼠移開後仍不收（要等失焦）。
 * `:focus-visible` 是瀏覽器維護的「這次 focus 該不該給視覺提示」判準，
 * 用它把 tooltip 的 focus 觸發限縮在鍵盤情境。
 *
 * WCAG 2.1 SC 1.4.13 只規範 focus 觸發的內容要可 dismiss / hover / persist，
 * 不要求滑鼠 focus 也必須觸發，因此仍然合規。
 */
function isFocusVisible(element: Element): boolean {
  try {
    return element.matches(':focus-visible');
  } catch {
    // 不支援該 pseudo-class 的環境退回原本行為：
    // 寧可多顯示，也不要讓鍵盤使用者拿不到提示。
    return true;
  }
}

const attrs = useAttrs();
const slots = useSlots();

const targetElement = ref<HTMLElement | null>(null);

const { onLeave, onPopperEnter, onTargetEnter, visible } =
  useDelayMouseEnterLeave({ mouseLeaveDelay: () => props.mouseLeaveDelay });

/** keyboard focus opens the tooltip alongside the pointer flow */
const focused = ref(false);
/**
 * Escape hides the tooltip without moving the pointer or the focus
 * (WCAG 1.4.13). Reset whenever the trigger is entered/focused again so the
 * tooltip can be brought back.
 */
const dismissed = ref(false);

const generatedId = useId();
const tooltipId = computed((): string => (attrs.id as string) ?? generatedId);
const role = computed((): string => (attrs.role as string) ?? 'tooltip');

const hasTitle = computed((): boolean => Boolean(props.title || slots.title));

/** tooltip shown only when title existed && hovered or focused */
const isTriggerVisible = computed(
  (): boolean =>
    !dismissed.value && (visible.value || focused.value) && hasTitle.value,
);

const isTooltipVisible = computed(
  (): boolean => props.open || isTriggerVisible.value,
);

function onTargetFocus(event: FocusEvent): void {
  // 只有鍵盤（focus-visible）觸發的 focus 才開啟提示，
  // 否則滑鼠點一下按鈕就會跳出 tooltip 並黏著不放。
  if (!isFocusVisible(event.currentTarget as Element)) return;

  dismissed.value = false;
  focused.value = true;
}

function onTargetBlur(): void {
  focused.value = false;
}

function onTargetMouseEnter(event: MouseEvent): void {
  dismissed.value = false;
  onTargetEnter(event);
}

// Escape only dismisses the hover/focus driven tooltip — a controlled
// `open` tooltip stays under the consumer's control.
useDocumentEscapeKeyDown(() => {
  if (!isTriggerVisible.value) return undefined;

  return () => {
    dismissed.value = true;
  };
});

const remToPx = (variableName: string): number =>
  Number(getCSSVariableValue(variableName).replace('rem', '')) * 16;

const offsetValue = computed(
  (): number => props.offsetMainAxis ?? remToPx(`--${spacingPrefix}-gap-base`),
);

const placement = computed(
  (): PopperPlacement => props.options?.placement || 'top',
);

const isPlacementAtEdge = computed(
  (): boolean =>
    placement.value.endsWith('-start') || placement.value.endsWith('-end'),
);

const arrowOptions = computed((): PopperArrow | undefined =>
  props.arrow
    ? {
        className: classes.arrow,
        enabled: true,
        padding: isPlacementAtEdge.value
          ? remToPx(`--${spacingPrefix}-padding-horizontal-comfort`)
          : 0,
      }
    : undefined,
);

/**
 * shift 與 flip 會互相干擾，順序依官方建議調整：
 * https://floating-ui.com/docs/flip#combining-with-shift
 */
const popperOptions = computed((): PopperOptions => {
  const middleware: Middleware[] = [offset({ mainAxis: offsetValue.value })];
  const flipMiddleware = flip({
    crossAxis: 'alignment',
    fallbackAxisSideDirection: 'end',
  });
  const shiftMiddleware = shift();

  if (placement.value.includes('-')) {
    middleware.push(flipMiddleware, shiftMiddleware);
  } else {
    middleware.push(shiftMiddleware, flipMiddleware);
  }

  return {
    ...props.options,
    placement: placement.value,
    middleware: [...middleware, ...(props.options?.middleware ?? [])],
  };
});

const popperClasses = computed((): string =>
  clsx(classes.host, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, id: _id, role: _role, ...rest } = attrs;

  return rest;
});

/**
 * The trigger may be a component rather than an element — React's refs reach
 * the DOM node either way, Vue's hand back the instance.
 */
const setTargetRef = (
  element: Element | ComponentPublicInstance | null,
): void => {
  targetElement.value = resolveElement(element);
};

const triggerProps = computed(
  (): TooltipTriggerProps => ({
    'aria-describedby': isTooltipVisible.value ? tooltipId.value : undefined,
    onBlur: onTargetBlur,
    onFocus: onTargetFocus,
    onMouseenter: onTargetMouseEnter,
    onMouseleave: onLeave,
    ref: setTargetRef,
  }),
);

const FADE_CONFIG = {
  delay: 0,
  duration: {
    enter: MOTION_DURATION.fast,
    exit: MOTION_DURATION.fast,
  },
  easing: {
    enter: MOTION_EASING.standard,
    exit: MOTION_EASING.standard,
  },
};

/**
 * React wraps the whole Popper in a Fade. Vue's Transition cannot: it reaches
 * a component child only when that child renders a single root *element*, and
 * MznPopper's root is MznPortal, whose own root is a Teleport or a slot outlet
 * — both fragments. The hooks never fire and nothing warns.
 *
 * So the fade is driven from here instead, on the floating element the popper
 * controller exposes. The DOM is identical either way, because React's Fade
 * renders nothing of its own: it only writes `opacity` and `transition` onto
 * the element, which is exactly what `fadeEnter` does.
 *
 * Only the enter is animated, and React is the same: `open` reaches the Popper
 * at the same moment it reaches the Fade, so React's Popper has already
 * returned null by the time the exit would run, leaving its Fade with no node
 * to animate.
 */
const popperRef = shallowRef<{ controllerRef: PopperController } | null>(null);

const floatingElement = computed(
  (): HTMLElement | null =>
    (popperRef.value?.controllerRef.elements.floating.value as HTMLElement) ??
    null,
);

watch(
  floatingElement,
  (node, previous) => {
    if (node && !previous) fadeEnter(node, FADE_CONFIG);
  },
  { flush: 'post' },
);
</script>

<template>
  <MznPopper
    :id="tooltipId"
    ref="popperRef"
    v-bind="forwardedAttrs"
    :anchor="anchor || targetElement"
    :arrow="arrowOptions"
    :class="popperClasses"
    :disable-portal="disablePortal"
    :open="isTooltipVisible"
    :options="popperOptions"
    :role="role"
    @mouseenter="onPopperEnter"
    @mouseleave="onLeave"
    @placement-change="emit('placementChange', $event)"
  >
    <slot name="title">{{ title }}</slot>
  </MznPopper>
  <slot v-bind="triggerProps" />
</template>
