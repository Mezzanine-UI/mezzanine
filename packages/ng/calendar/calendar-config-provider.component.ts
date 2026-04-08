import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  CalendarLocaleValue,
  CalendarMethods,
} from '@mezzanine-ui/core/calendar';
import {
  CalendarConfigs,
  createCalendarConfig,
  MZN_CALENDAR_CONFIG,
} from './calendar-config';

/**
 * Calendar 配置提供者元件。
 *
 * 在模板中包裹需要日曆功能的子元件，透過 DI 提供 `CalendarConfigs`。
 * 相當於 React 版的 `CalendarConfigProvider`。
 *
 * @example
 * ```html
 * import { MznCalendarConfigProvider } from '@mezzanine-ui/ng/calendar';
 *
 * <div mznCalendarConfigProvider [methods]="dayjsMethods" locale="zh-TW">
 *   <div mznDatePicker [(ngModel)]="date" ></div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznCalendarConfigProvider]',
  host: {
    '[attr.methods]': 'null',
    '[attr.defaultDateFormat]': 'null',
    '[attr.defaultTimeFormat]': 'null',
    '[attr.locale]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MZN_CALENDAR_CONFIG,
      useFactory: (self: MznCalendarConfigProvider): CalendarConfigs =>
        createCalendarConfig(self.methods(), {
          defaultDateFormat: self.defaultDateFormat(),
          defaultTimeFormat: self.defaultTimeFormat(),
          locale: self.locale(),
        }),
      deps: [MznCalendarConfigProvider],
    },
  ],
  template: '<ng-content />',
})
export class MznCalendarConfigProvider {
  /** 日期函式庫的實作（如 CalendarMethodsDayjs）。 */
  readonly methods = input.required<CalendarMethods>();

  /** 預設日期格式。 */
  readonly defaultDateFormat = input('YYYY-MM-DD');

  /** 預設時間格式。 */
  readonly defaultTimeFormat = input('HH:mm:ss');

  /**
   * 語系設定，決定星期起始日、月份名稱等。
   * @default 'en-US'
   */
  readonly locale = input<CalendarLocaleValue>('en-US');
}
