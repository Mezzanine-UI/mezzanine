<script setup lang="ts">
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import MznCalendarConfigProvider from './calendar-config-provider.vue';
import type { CalendarConfigProviderPresetProps } from './calendar-config-provider.types';

/**
 * 已綁定 Luxon methods 的 MznCalendarConfigProvider。
 *
 * 與 MznCalendarConfigProvider 完全相同，只是省去自行匯入並傳入 `methods` 的步驟。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarConfigProviderLuxon } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarConfigProviderLuxon locale="zh-TW">
 *     <MznCalendar :reference-date="referenceDate" />
 *   </MznCalendarConfigProviderLuxon>
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
    :methods="CalendarMethodsLuxon"
  >
    <slot />
  </MznCalendarConfigProvider>
</template>
