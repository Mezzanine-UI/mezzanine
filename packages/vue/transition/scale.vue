<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { useTransitionImplementation } from './use-transition-implementation';
import type { TransitionRunnerConfig } from './transition-styles';
import type { ScaleProps } from './scale.types';

/**
 * 縮放轉場：進場時從 95% 放大並淡入，離場時反向。
 *
 * 進場結束後 `transform` 會設回 `none` 而不是 `scale(1)`，與 React 一致 ——
 * 留著 transform 會讓子元素建立新的 containing block，影響固定定位的內容。
 *
 * @example
 * ```vue
 * <MznScale :in="visible" transform-origin="top left">
 *   <div>內容</div>
 * </MznScale>
 * ```
 *
 * @see MznFade 純淡入淡出
 */
const props = withDefaults(defineProps<ScaleProps>(), {
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
  transformOrigin: 'center',
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
  default?: () => unknown;
}>();

const config = computed(
  (): TransitionRunnerConfig => ({
    base: { transformOrigin: props.transformOrigin },
    delay: props.delay,
    duration:
      props.duration === 'auto'
        ? { enter: MOTION_DURATION.moderate, exit: MOTION_DURATION.moderate }
        : props.duration,
    easing: props.easing,
    entered: { opacity: 1, transform: 'none' },
    entering: { opacity: 1, transform: 'scale(1)' },
    exited: { opacity: 0, transform: 'scale(0.95)' },
    properties: ['opacity', 'transform'],
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
