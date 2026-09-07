<script setup lang="ts">
import { computed, h, TransitionGroup } from 'vue';
import type { FunctionalComponent, VNode, VNodeArrayChildren } from 'vue';
import { tagClasses as classes } from '@mezzanine-ui/core/tag';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { flattenChildren } from '../_internal/flatten-children';
import MznOverflowCounterTag from '../overflow-tooltip/overflow-counter-tag.vue';
import {
  runEnterTransition,
  runExitTransition,
} from '../transition/transition-styles';
import type { TransitionRunnerConfig } from '../transition/transition-styles';
import MznTag from './tag.vue';
import type { TagGroupProps } from './tag-group.types';

/**
 * 標籤群組，把一組標籤排在同一列並統一間距。
 *
 * 只接受 MznTag 與 MznOverflowCounterTag 作為子節點，其餘會在 console 報錯並整組不渲染。
 * 每個子節點都會被包進一層 `span`；`transition="fade"` 時新增與移除的標籤會淡入淡出。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTag, MznTagGroup } from '@mezzanine-ui/vue/tag';
 * <\/script>
 *
 * <template>
 *   <MznTagGroup transition="fade">
 *     <MznTag v-for="tag in tags" :key="tag" :label="tag" type="dismissable" @close="remove(tag)" />
 *   </MznTagGroup>
 * </template>
 * ```
 *
 * @see MznTag 群組內唯一允許的標籤元件
 */
const props = withDefaults(defineProps<TagGroupProps>(), {
  transition: 'none',
});

const slots = defineSlots<{
  /** The tags of the group. */
  default?: () => unknown;
}>();

/**
 * The same fade React hands every child through `fadeProps`, expressed as the
 * runner config the Vue transitions share.
 */
const fadeConfig: TransitionRunnerConfig = {
  delay: 0,
  duration: { enter: MOTION_DURATION.fast, exit: MOTION_DURATION.fast },
  easing: { enter: MOTION_EASING.standard, exit: MOTION_EASING.standard },
  entered: { opacity: 1 },
  entering: { opacity: 1 },
  exited: { opacity: 0 },
  properties: ['opacity'],
};

const children = (): VNode[] =>
  flattenChildren((slots.default?.() ?? []) as VNodeArrayChildren);

const hasInvalidChild = computed((): boolean =>
  children().some((child) => {
    if (child.type !== MznTag && child.type !== MznOverflowCounterTag) {
      console.error('<TagGroup> only accepts <Tag> or <OverflowCounterTag>');

      return true;
    }

    return false;
  }),
);

function onEnter(element: Element, done: () => void): void {
  runEnterTransition(element as HTMLElement, fadeConfig, done);
}

function onLeave(element: Element, done: () => void): void {
  runExitTransition(element as HTMLElement, fadeConfig, done);
}

/**
 * React wraps every child in a `span` and, for the fade transition, hands the
 * list to a `TransitionGroup`. A `TransitionGroup` reads its own slot's vnodes,
 * so the wrapping has to happen where the group can see it — a template `v-for`
 * inside a slot outlet would hide the children behind a component.
 */
const GroupChildren: FunctionalComponent = () => {
  const wrapped = children().map((child, index) =>
    h('span', { key: child.key ?? index }, [child]),
  );

  if (props.transition !== 'fade') return wrapped;

  return h(TransitionGroup, { css: false, onEnter, onLeave }, () => wrapped);
};

const hostClass = classes.group;
</script>

<template>
  <div v-if="!hasInvalidChild" :class="hostClass">
    <GroupChildren />
  </div>
</template>
