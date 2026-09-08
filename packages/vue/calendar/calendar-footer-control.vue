<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import MznButton from '../button/button.vue';

/**
 * 日曆底部的快捷按鈕，例如「Today」、「This week」。
 *
 * 內容由預設 slot 提供，點擊時發出 `click`。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarFooterControl } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarFooterControl @click="selectToday">Today</MznCalendarFooterControl>
 * </template>
 * ```
 *
 * @see MznCalendarFooterActions 區間日曆底部的確認／取消按鈕
 */
defineOptions({ inheritAttrs: false });

const emit = defineEmits<{
  click: [];
}>();

defineSlots<{
  /** The button's label. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const hostClasses = computed((): string =>
  clsx(classes.footerControl, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <MznButton size="minor" variant="base-ghost" @click="emit('click')">
      <slot />
    </MznButton>
  </div>
</template>
