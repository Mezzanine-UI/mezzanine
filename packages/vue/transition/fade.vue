<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { useTransitionImplementation } from './use-transition-implementation';
import type { TransitionRunnerConfig } from './transition-styles';
import type { FadeProps } from './fade.types';

/**
 * 淡入淡出轉場。
 *
 * 依 D10 建在 Vue 內建的 `Transition` 之上，但以 JS hook 直接寫 inline style
 * （`:css="false"`），與 React 版一致 — React 的實作同樣是把 `opacity` 與
 * `transition` 寫進元素的 style，而非套用 CSS class。
 *
 * @example
 * ```vue
 * <MznFade :in="visible">
 *   <div>內容</div>
 * </MznFade>
 * ```
 *
 * @see MznScale 縮放轉場
 */
const props = withDefaults(defineProps<FadeProps>(), {
  appear: true,
  delay: 0,
  duration: () => ({
    enter: MOTION_DURATION.moderate,
    exit: MOTION_DURATION.moderate,
  }),
  easing: () => ({
    enter: MOTION_EASING.entrance,
    exit: MOTION_EASING.exit,
  }),
  in: false,
  keepMount: false,
  lazyMount: true,
});

/**
 * React's transition reports six moments, and `isAppearing` tells the enter
 * three whether this is the first mount. Vue routes the initial run through
 * `appear` instead of `enter`, so both are bound below and the flag comes from
 * which one fired.
 */
const emit = defineEmits<{
  enter: [node: HTMLElement, isAppearing: boolean];
  entered: [node: HTMLElement, isAppearing: boolean];
  entering: [node: HTMLElement, isAppearing: boolean];
  exit: [node: HTMLElement];
  exited: [node: HTMLElement];
  exiting: [node: HTMLElement];
}>();

defineSlots<{
  default?: () => unknown;
}>();

/** `duration: 'auto'` has no meaning for a fade; React falls back the same way. */
const config = computed(
  (): TransitionRunnerConfig => ({
    delay: props.delay,
    duration:
      props.duration === 'auto'
        ? { enter: MOTION_DURATION.moderate, exit: MOTION_DURATION.moderate }
        : props.duration,
    easing: props.easing,
    entered: { opacity: 1 },
    entering: { opacity: 1 },
    exited: { opacity: 0 },
    properties: ['opacity'],
  }),
);

const slots = useSlots();

const { TransitionChild, onAppear, onEnter, onLeave, shown } =
  useTransitionImplementation({
    child: () => slots.default?.(),
    config: () => config.value,
    in: () => props.in,
    keepMount: () => props.keepMount,
    lazyMount: () => props.lazyMount,
    on: {
      enter: (node, isAppearing) => emit('enter', node, isAppearing),
      entered: (node, isAppearing) => emit('entered', node, isAppearing),
      entering: (node, isAppearing) => emit('entering', node, isAppearing),
      exit: (node) => emit('exit', node),
      exited: (node) => emit('exited', node),
      exiting: (node) => emit('exiting', node),
    },
  });
</script>

<template>
  <Transition
    :appear="appear"
    :css="false"
    @appear="onAppear"
    @enter="onEnter"
    @leave="onLeave"
  >
    <TransitionChild v-if="shown" />
  </Transition>
</template>
