<script setup lang="ts">
import CalendarMethodsTemporal from '@mezzanine-ui/core/calendarMethodsTemporal';
import MznCalendarConfigProvider from './calendar-config-provider.vue';
import type { CalendarConfigProviderPresetProps } from './calendar-config-provider.types';

/**
 * 已綁定 Temporal methods 的 MznCalendarConfigProvider。
 *
 * 與 MznCalendarConfigProvider 完全相同，只是省去自行匯入並傳入 `methods` 的步驟。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarConfigProviderTemporal } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarConfigProviderTemporal locale="zh-TW">
 *     <MznCalendar :reference-date="referenceDate" />
 *   </MznCalendarConfigProviderTemporal>
 * </template>
 * ```
 *
 * @see MznCalendarConfigProvider 自行提供 methods 的版本
 */
defineProps<CalendarConfigProviderPresetProps>();

defineSlots<{
  /** The calendars that read these configs. */
  default?: () => unknown;
}>();
</script>

<template>
  <MznCalendarConfigProvider
    :default-date-format="defaultDateFormat"
    :default-time-format="defaultTimeFormat"
    :locale="locale"
    :methods="CalendarMethodsTemporal"
  >
    <slot />
  </MznCalendarConfigProvider>
</template>
