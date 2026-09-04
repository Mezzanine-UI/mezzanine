<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import type { FunctionalComponent, VNode, VNodeChild } from 'vue';
import { resultStateClasses as classes } from '@mezzanine-ui/core/result-state';
import type { ResultStateType } from '@mezzanine-ui/core/result-state';
import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  ErrorFilledIcon,
  InfoFilledIcon,
  QuestionFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { resolveActionButtons } from '../_internal/action-buttons';
import { flattenChildren } from '../_internal/flatten-children';
import MznButtonGroup from '../button/button-group.vue';
import MznIcon from '../icon/icon.vue';
import type { ResultStateProps } from './result-state.types';

/**
 * 結果狀態元件，用於操作完成、失敗或需要說明的頁面。
 *
 * `type` 決定圖示與色調，`size` 控制字級與間距。動作按鈕可用 `actions` 設定物件，
 * 或直接把 MznButton 放進預設 slot —— 兩者同時存在時 `actions` 優先。第一顆按鈕
 * 視為次要、第二顆為主要。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznButton } from '@mezzanine-ui/vue/button';
 * import { MznResultState } from '@mezzanine-ui/vue/result-state';
 * <\/script>
 *
 * <template>
 *   <MznResultState
 *     description="Your operation has been completed successfully."
 *     title="Success"
 *     type="success"
 *   />
 *
 *   <MznResultState title="Operation Failed" type="error">
 *     <MznButton>Go Back</MznButton>
 *     <MznButton>Try Again</MznButton>
 *   </MznResultState>
 * </template>
 * ```
 *
 * @see MznEmpty 無資料時的空狀態
 */
const props = withDefaults(defineProps<ResultStateProps>(), {
  actions: undefined,
  description: undefined,
  size: 'main',
  type: 'information',
});

defineSlots<{
  /**
   * Up to two MznButton elements. The first is treated as secondary, the
   * second as primary. Ignored when `actions` is given.
   */
  default?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const ICONS: Record<ResultStateType, IconDefinition> = {
  information: InfoFilledIcon,
  success: CheckedFilledIcon,
  help: QuestionFilledIcon,
  warning: WarningFilledIcon,
  error: ErrorFilledIcon,
  failure: DangerousFilledIcon,
};

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    classes.type(props.type),
    classes.size(props.size),
    attrs.class as string,
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const icon = computed((): IconDefinition => ICONS[props.type]);

const actionButtons = computed((): VNodeChild[] | null =>
  resolveActionButtons({
    actions: props.actions,
    children: flattenChildren(slots.default?.()),
    componentName: 'ResultState',
    size: props.size,
  }),
);

const showActions = computed((): boolean =>
  Boolean(props.actions || slots.default),
);

const Actions: FunctionalComponent = () => actionButtons.value as VNode[];

const containerClass = classes.container;
const iconClass = classes.icon;
const titleClass = classes.title;
const descriptionClass = classes.description;
const actionsClass = classes.actions;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="containerClass">
      <MznIcon :class="iconClass" :icon="icon" />
      <h3 :class="titleClass">{{ title }}</h3>
      <p v-if="description" :class="descriptionClass">{{ description }}</p>
      <MznButtonGroup v-if="showActions" :class="actionsClass">
        <Actions />
      </MznButtonGroup>
    </div>
  </div>
</template>
