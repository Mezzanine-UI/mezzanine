import type {
  CalendarLocaleValue,
  CalendarMethods,
} from '@mezzanine-ui/core/calendar';

export interface CalendarConfigProviderProps {
  /**
   * The date format used when a consumer provides none.
   * @default 'YYYY-MM-DD'
   */
  defaultDateFormat?: string;
  /**
   * The time format used when a consumer provides none.
   * @default 'HH:mm:ss'
   */
  defaultTimeFormat?: string;
  /**
   * The unified locale for all calendar display and value processing.
   * This determines the first day of week, month names, weekday names, etc.
   * Use CalendarLocale enum for type-safe locale values.
   * @example CalendarLocale.EN_US, CalendarLocale.ZH_TW, CalendarLocale.DE_DE
   * @default CalendarLocale.EN_US
   */
  locale?: CalendarLocaleValue;
  /**
   * The date library adapter every calendar below this provider will use.
   */
  methods: CalendarMethods;
}

/**
 * The props of a provider that already carries its own `methods` —
 * `MznCalendarConfigProviderDayjs` and friends.
 */
export type CalendarConfigProviderPresetProps = Omit<
  CalendarConfigProviderProps,
  'methods'
>;
