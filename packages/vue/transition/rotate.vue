<script setup lang="ts">
import { cloneVNode, computed, useSlots } from 'vue';
import type { CSSProperties, FunctionalComponent, VNode } from 'vue';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import type { RotateProps } from './rotate.types';

/**
 * 旋轉轉場。
 *
 * 與其他轉場不同，Rotate 不負責掛載與卸載 —— 它只依 `in` 旋轉既有的元素，
 * 典型用途是展開／收合指示用的箭頭。
 *
 * @example
 * ```vue
 * <MznRotate :in="open">
 *   <MznIcon :icon="ChevronDownIcon" />
 * </MznRotate>
 * ```
 *
 * @see MznScale 會控制掛載的縮放轉場
 */
const props = withDefaults(defineProps<RotateProps>(), {
  degrees: 180,
  duration: MOTION_DURATION.fast,
  easing: MOTION_EASING.standard,
  in: false,
  transformOrigin: 'center',
});

defineSlots<{
  default?: () => unknown;
}>();

const slots = useSlots();

const style = computed(
  (): CSSProperties => ({
    transform: props.in ? `rotate(${props.degrees}deg)` : 'rotate(0deg)',
    transformOrigin: props.transformOrigin,
    transition: `transform ${props.duration}ms ${props.easing}`,
  }),
);

/**
 * React clones the child with the rotation style merged over the child's own,
 * and renders nothing of its own. Cloning the vnode is the same operation, and
 * the child's style still wins — `cloneVNode` merges `style` the way the
 * template compiler does.
 */
const RotateChild: FunctionalComponent = () => {
  const [child] = (slots.default?.() ?? []) as VNode[];

  if (!child) return null;

  // The child's own style is repeated after the rotation so it still wins:
  // `cloneVNode` merges styles into an array where the later entry takes
  // precedence, and React puts `...children.props.style` last too.
  const childStyle = (child.props as { style?: unknown })?.style;

  return cloneVNode(child, { style: [style.value, childStyle] });
};
</script>

<template>
  <RotateChild />
</template>
