<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { useTransitionImplementation } from './use-transition-implementation';
import type { TransitionRunnerConfig } from './transition-styles';
import type { SlideFrom, SlideProps } from './slide.types';

/**
 * 滑入轉場：整塊內容從畫面邊緣滑入，用於抽屜這類覆蓋層。
 *
 * 位移量是元素自身的 100%，且不帶淡入 —— 與 MznTranslate 的 4px 微幅位移是
 * 不同用途。
 *
 * @example
 * ```vue
 * <MznSlide from="right" :in="open">
 *   <div>抽屜內容</div>
 * </MznSlide>
 * ```
 *
 * @see MznTranslate 小幅位移的轉場
 */
const props = withDefaults(defineProps<SlideProps>(), {
  appear: true,
  delay: 0,
  duration: () => ({
    enter: MOTION_DURATION.slow,
    exit: MOTION_DURATION.slow,
  }),
  easing: () => ({
    enter: MOTION_EASING.standard,
    exit: MOTION_EASING.standard,
  }),
  from: 'right',
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
  default?: () => unknown;
}>();

const OFFSETS: Record<SlideFrom, string> = {
  top: 'translate3d(0, -100%, 0)',
  right: 'translate3d(100%, 0, 0)',
};

const config = computed(
  (): TransitionRunnerConfig => ({
    delay: props.delay,
    duration:
      props.duration === 'auto'
        ? { enter: MOTION_DURATION.slow, exit: MOTION_DURATION.slow }
        : props.duration,
    easing: props.easing,
    entered: { transform: 'translate3d(0, 0, 0)' },
    entering: { transform: 'translate3d(0, 0, 0)' },
    exited: { transform: OFFSETS[props.from] },
    properties: ['transform'],
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
