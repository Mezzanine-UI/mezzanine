<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { useTransitionImplementation } from './use-transition-implementation';
import type { TransitionRunnerConfig } from './transition-styles';
import type { TranslateFrom, TranslateProps } from './translate.types';

/**
 * 小幅位移轉場：從指定方向位移 4px 進場並淡入。
 *
 * 位移距離刻意很小，用於選單、提示這類「就地出現」的內容；需要整塊滑入請用
 * MznSlide。
 *
 * @example
 * ```vue
 * <MznTranslate from="bottom" :in="visible">
 *   <div>內容</div>
 * </MznTranslate>
 * ```
 *
 * @see MznSlide 整段滑入的轉場
 */
const props = withDefaults(defineProps<TranslateProps>(), {
  appear: true,
  delay: 0,
  duration: () => ({
    enter: MOTION_DURATION.moderate,
    exit: MOTION_DURATION.moderate,
  }),
  easing: () => ({
    enter: MOTION_EASING.standard,
    exit: MOTION_EASING.standard,
  }),
  from: 'top',
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

const OFFSETS: Record<TranslateFrom, string> = {
  top: 'translate3d(0, -4px, 0)',
  right: 'translate3d(4px, 0, 0)',
  bottom: 'translate3d(0, 4px, 0)',
  left: 'translate3d(-4px, 0, 0)',
};

const config = computed(
  (): TransitionRunnerConfig => ({
    delay: props.delay,
    duration:
      props.duration === 'auto'
        ? { enter: MOTION_DURATION.moderate, exit: MOTION_DURATION.moderate }
        : props.duration,
    easing: props.easing,
    entered: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    entering: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    exited: { opacity: 0, transform: OFFSETS[props.from] },
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
