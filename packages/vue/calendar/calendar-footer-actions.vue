<script setup lang="ts">
import { computed, h, useAttrs } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import type { ActionButtonsItem } from '../_internal/action-buttons';
import MznButton from '../button/button.vue';
import type { CalendarFooterActionsProps } from './calendar-footer-actions.types';

/**
 * 區間日曆底部的取消／確認按鈕列。
 *
 * `size` 與 `variant` 由元件決定，其餘由 `actions` 傳入的 props 覆寫，
 * 因此呼叫端可以改文字、停用狀態或事件處理。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarFooterActions } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarFooterActions
 *     :actions="{
 *       primaryButtonProps: { children: 'Ok', onClick: onConfirm },
 *       secondaryButtonProps: { children: 'Cancel', onClick: onCancel },
 *     }"
 *   />
 * </template>
 * ```
 *
 * @see MznRangeCalendar 使用這個按鈕列的日曆
 */
defineOptions({ inheritAttrs: false });

const props = defineProps<CalendarFooterActionsProps>();

const attrs = useAttrs();

const hostClasses = computed((): string =>
  clsx(classes.footerActions, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

function renderButton(
  button: ActionButtonsItem,
  variant: 'base-primary' | 'base-tertiary',
): VNode {
  const { children, ...rest } = button;

  return h(MznButton, { size: 'minor', variant, ...rest }, () => children);
}

const Actions: FunctionalComponent = () => [
  renderButton(props.actions.secondaryButtonProps, 'base-tertiary'),
  renderButton(props.actions.primaryButtonProps, 'base-primary'),
];
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <Actions />
  </div>
</template>
