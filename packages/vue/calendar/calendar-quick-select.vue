<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import { CheckedIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import type { CalendarQuickSelectProps } from './calendar-quick-select.types';

/**
 * 日曆左側的快速選取清單。
 *
 * 每個選項是一顆按鈕，`activeId` 相符的那顆會加上勾選圖示與選取樣式。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarQuickSelect } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarQuickSelect
 *     active-id="today"
 *     :options="[{ id: 'today', name: 'Today', onClick: selectToday }]"
 *   />
 * </template>
 * ```
 *
 * @see MznCalendar 透過 `quickSelect` prop 使用這個清單
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarQuickSelectProps>(), {
  activeId: undefined,
});

const attrs = useAttrs();

const hostClasses = computed((): string =>
  clsx(classes.quickSelect, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const buttonClasses = (id: string): string =>
  clsx(
    classes.quickSelectButton,
    id === props.activeId && classes.quickSelectButtonActive,
  );
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <button
      v-for="{ id, name, disabled, onClick } in options"
      :key="id"
      :aria-disabled="disabled"
      :class="buttonClasses(id)"
      :disabled="disabled"
      type="button"
      @click="onClick"
    >
      <span>{{ name }}</span>
      <MznIcon v-if="id === activeId" :icon="CheckedIcon" :size="16" />
    </button>
  </div>
</template>
