<script setup lang="ts">
import { computed } from 'vue';
import { normalizeLocale, CalendarLocale } from '@mezzanine-ui/core/calendar';
import {
  provideCalendarContext,
  type CalendarConfigs,
} from './calendar-context';
import type { CalendarConfigProviderProps } from './calendar-config-provider.types';

/**
 * 提供日曆所需的日期函式庫與語系設定。
 *
 * 所有日曆相關元件都必須放在這個 provider 底下；`methods` 決定日期運算採用哪一套
 * 函式庫（Moment／Dayjs／Luxon／Temporal），`locale` 決定每週起始日、月份與星期名稱。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendar, MznCalendarConfigProvider } from '@mezzanine-ui/vue/calendar';
 * import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
 * <\/script>
 *
 * <template>
 *   <MznCalendarConfigProvider :methods="CalendarMethodsMoment" locale="en-US">
 *     <MznCalendar :reference-date="referenceDate" />
 *   </MznCalendarConfigProvider>
 * </template>
 * ```
 *
 * @see MznCalendarConfigProviderDayjs 已內建 Dayjs methods 的版本
 * @see useCalendarContext 讀取這裡提供的設定
 */
const props = withDefaults(defineProps<CalendarConfigProviderProps>(), {
  defaultDateFormat: 'YYYY-MM-DD',
  defaultTimeFormat: 'HH:mm:ss',
  locale: CalendarLocale.EN_US,
});

defineSlots<{
  /** The calendars that read these configs. */
  default?: () => unknown;
}>();

provideCalendarContext(
  computed(
    (): CalendarConfigs => ({
      ...props.methods,
      defaultDateFormat: props.defaultDateFormat,
      defaultTimeFormat: props.defaultTimeFormat,
      locale: normalizeLocale(props.locale),
    }),
  ),
);
</script>

<template>
  <slot />
</template>
