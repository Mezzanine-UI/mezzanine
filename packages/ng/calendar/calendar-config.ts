import { InjectionToken } from '@angular/core';
import {
  CalendarLocale,
  CalendarLocaleValue,
  CalendarMethods,
  normalizeLocale,
} from '@mezzanine-ui/core/calendar';

/**
 * Calendar 配置介面，擴展 CalendarMethods 加上預設格式與語系。
 *
 * Angular 中對應 React 的 `CalendarContext`。
 * 透過 `MZN_CALENDAR_CONFIG` InjectionToken 注入，
 * 所有 Calendar/Picker 元件從中取得日期操作方法與語系設定。
 *
 * @example
 * ```ts
 * import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
 *
 * const config = inject(MZN_CALENDAR_CONFIG);
 * const today = config.getNow();
 * ```
 */
export interface CalendarConfigs extends CalendarMethods {
  /** 預設日期格式。 */
  readonly defaultDateFormat: string;
  /** 預設時間格式。 */
  readonly defaultTimeFormat: string;
  /** 已正規化的語系字串（lowercase）。 */
  readonly locale: string;
}

/**
 * Calendar 配置注入 Token。
 *
 * 提供 `CalendarMethods`（日期操作方法）、語系與預設格式，
 * 供所有 Calendar/Picker 子元件注入使用。
 *
 * @example
 * ```ts
 * providers: [
 *   {
 *     provide: MZN_CALENDAR_CONFIG,
 *     useValue: createCalendarConfig(CalendarMethodsDayjs, { locale: CalendarLocale.ZH_TW }),
 *   },
 * ]
 * ```
 *
 * @see {@link CalendarConfigs} 配置介面
 * @see {@link createCalendarConfig} 建立配置的輔助函式
 */
export const MZN_CALENDAR_CONFIG = new InjectionToken<CalendarConfigs>(
  'MZN_CALENDAR_CONFIG',
);

/** createCalendarConfig 的選項。 */
export interface CalendarConfigOptions {
  readonly defaultDateFormat?: string;
  readonly defaultTimeFormat?: string;
  readonly locale?: CalendarLocaleValue;
}

/**
 * 從 CalendarMethods 與選項建立 CalendarConfigs 物件。
 *
 * @param methods - 日期函式庫的實作（如 CalendarMethodsDayjs）
 * @param options - 語系與格式選項
 * @returns 完整的 CalendarConfigs，可直接用於 provide
 *
 * @example
 * ```ts
 * import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
 *
 * const config = createCalendarConfig(CalendarMethodsDayjs, {
 *   locale: CalendarLocale.ZH_TW,
 *   defaultDateFormat: 'YYYY/MM/DD',
 * });
 * ```
 */
export function createCalendarConfig(
  methods: CalendarMethods,
  options: CalendarConfigOptions = {},
): CalendarConfigs {
  const {
    defaultDateFormat = 'YYYY-MM-DD',
    defaultTimeFormat = 'HH:mm:ss',
    locale = CalendarLocale.EN_US,
  } = options;

  return {
    ...methods,
    defaultDateFormat,
    defaultTimeFormat,
    locale: normalizeLocale(locale),
  };
}

export { CalendarLocale };
