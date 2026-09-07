<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { MOTION_EASING } from '@mezzanine-ui/system/motion';
import { getAutoSizeDuration } from './get-auto-size-duration';
import { getTransitionStyleProps } from './get-transition-style-props';
import type { TransitionMode } from './transition.types';
import type { CollapseProps } from './collapse.types';

/**
 * 展開／收合轉場：以高度為動畫對象。
 *
 * 與其他轉場不同，它渲染自己的三層 `div` 而不是包住 slot 的元素：高度必須量測
 * 內容後才知道，所以 `duration: 'auto'` 會依內容高度換算。`collapsedHeight`
 * 不是 0 時會強制 `keepMount`，否則收合後就看不到那段保留高度。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCollapse } from '@mezzanine-ui/vue/transition';
 * <\/script>
 *
 * <template>
 *   <MznCollapse :in="expanded">
 *     <div>內容</div>
 *   </MznCollapse>
 * </template>
 * ```
 *
 * @see MznFade 純淡入淡出
 * @deprecated 設計師未定義，暫時標記為 deprecated。
 * 目前 Accordion、Cascader、Navigation 與 FilterArea 正在使用此元件。
 */
const props = withDefaults(defineProps<CollapseProps>(), {
  appear: true,
  collapsedHeight: 0,
  delay: 0,
  duration: 'auto',
  easing: () => ({
    enter: MOTION_EASING.entrance,
    exit: MOTION_EASING.exit,
  }),
  in: false,
  keepMount: false,
  lazyMount: true,
});

const emit = defineEmits<{
  enter: [node: HTMLElement, isAppearing: boolean];
  entered: [node: HTMLElement, isAppearing: boolean];
  entering: [node: HTMLElement, isAppearing: boolean];
  exit: [node: HTMLElement];
  exited: [node: HTMLElement];
  exiting: [node: HTMLElement];
}>();

defineSlots<{
  /** The content the collapse reveals. */
  default?: () => unknown;
}>();

const node = ref<HTMLElement | null>(null);
const wrapper = ref<HTMLElement | null>(null);

const collapsedHeight = computed((): string =>
  typeof props.collapsedHeight === 'number'
    ? `${props.collapsedHeight}px`
    : props.collapsedHeight,
);

/** A collapse that keeps a visible height has to stay mounted to show it. */
const keepMount = computed((): boolean =>
  collapsedHeight.value !== '0px' ? true : props.keepMount,
);

const getWrapperHeight = (): number => wrapper.value?.clientHeight || 0;

/** The duration `duration: 'auto'` resolves to, recomputed on every run. */
let autoTransitionDuration = 0;

function transitionStyleProps(mode: TransitionMode): {
  delay: number;
  duration: number;
  timingFunction: string;
} {
  return getTransitionStyleProps(mode, {
    delay: props.delay,
    duration: props.duration ?? 'auto',
    easing: props.easing ?? '',
    resolveAutoDuration: () => {
      autoTransitionDuration = getAutoSizeDuration(getWrapperHeight());

      return autoTransitionDuration;
    },
  });
}

function setNodeTransition(element: HTMLElement, mode: TransitionMode): number {
  const { delay, duration, timingFunction } = transitionStyleProps(mode);

  element.style.transition = `height ${duration}ms ${timingFunction} ${delay}ms`;

  return duration + delay;
}

const attrs = useAttrs();

/**
 * React restores the caller's own `transition` once the run is over, reading it
 * off the `style` prop it was given. Here that arrives as a fallthrough
 * attribute.
 */
function resetNodeTransition(element: HTMLElement): void {
  const style = attrs.style as CSSProperties | string | undefined;
  const transition =
    style && typeof style === 'object' ? style.transition : undefined;

  element.style.transition = (transition as string | undefined) ?? '';
}

/**
 * Force a reflow so the starting height is committed before the transition is
 * armed. Same trick as the shared runner's.
 */
function reflow(element: HTMLElement): void {
  void element.scrollTop;
}

type CollapseState = 'entered' | 'entering' | 'exited' | 'exiting';

/**
 * react-transition-group starts in `entered` when it is already in and not
 * appearing, and in `exited` otherwise.
 */
const state = ref<CollapseState>(
  props.in && !props.appear ? 'entered' : 'exited',
);

let cancelPending: number | null = null;

function cancel(): void {
  if (cancelPending !== null) {
    window.clearTimeout(cancelPending);
    cancelPending = null;
  }
}

function runEnter(
  element: HTMLElement,
  isAppearing: boolean,
  done?: () => void,
): void {
  cancel();

  element.style.height = collapsedHeight.value;
  reflow(element);
  emit('enter', element, isAppearing);

  const total = setNodeTransition(element, 'enter');

  element.style.height = `${getWrapperHeight()}px`;
  state.value = 'entering';
  emit('entering', element, isAppearing);

  cancelPending = window.setTimeout(() => {
    element.style.height = 'auto';
    resetNodeTransition(element);
    state.value = 'entered';
    emit('entered', element, isAppearing);
    done?.();
  }, total);
}

function runExit(element: HTMLElement, done?: () => void): void {
  cancel();

  element.style.height = `${getWrapperHeight()}px`;
  reflow(element);
  emit('exit', element);

  const total = setNodeTransition(element, 'exit');

  element.style.height = collapsedHeight.value;
  state.value = 'exiting';
  emit('exiting', element);

  cancelPending = window.setTimeout(() => {
    resetNodeTransition(element);
    state.value = 'exited';
    emit('exited', element);
    done?.();
  }, total);
}

const hasEntered = ref(false);

watch(
  () => props.in,
  (value) => {
    if (value) hasEntered.value = true;
  },
  { immediate: true },
);

/**
 * `lazyMount` is React's `mountOnEnter`: nothing is rendered until the first
 * enter. `keepMount` is `unmountOnExit: false`: it stays afterwards.
 */
const shown = computed(
  (): boolean =>
    props.in || (keepMount.value && (!props.lazyMount || hasEntered.value)),
);

/**
 * A child that never leaves the DOM never triggers Vue's leave hook, so the
 * kept-mounted case is driven from `in` instead — as the shared runner does.
 */
watch(
  () => props.in,
  (value) => {
    if (!keepMount.value || !node.value) return;

    if (value) runEnter(node.value, false);
    else runExit(node.value);
  },
);

onBeforeUnmount(cancel);

const hostStyle = computed((): CSSProperties => {
  const style: CSSProperties = {
    minHeight: collapsedHeight.value,
    overflow: 'hidden',
  };

  if (state.value === 'entered') {
    style.overflow = 'visible';
  } else if (
    state.value === 'exited' &&
    !props.in &&
    collapsedHeight.value === '0px'
  ) {
    style.visibility = 'hidden';
  }

  return style;
});

const wrapperStyle: CSSProperties = { display: 'flex', width: '100%' };
const innerStyle: CSSProperties = { width: '100%' };
</script>

<template>
  <Transition
    :appear="appear"
    :css="false"
    @appear="(element, done) => runEnter(element as HTMLElement, true, done)"
    @enter="(element, done) => runEnter(element as HTMLElement, false, done)"
    @leave="(element, done) => runExit(element as HTMLElement, done)"
  >
    <div v-if="shown" ref="node" :style="hostStyle">
      <div ref="wrapper" :style="wrapperStyle">
        <div :style="innerStyle"><slot /></div>
      </div>
    </div>
  </Transition>
</template>
