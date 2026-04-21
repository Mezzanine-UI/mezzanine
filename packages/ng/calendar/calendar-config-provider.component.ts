import { computed, Directive, inject, input } from '@angular/core';
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
 * Calendar 配置提供者指令。
 *
 * 對應 React 版 `CalendarConfigProvider`。以屬性指令（非 Component）
 * 套在任意元素上，透過 DI 向子元件提供 `CalendarConfigs`，不新增 DOM。
 *
 * 實作細節：Angular 會在 directive 建構時解析 providers，而 required
 * input 尚未綁定，直接呼叫 `this.methods()` 會拋出 `NG0950`。解法是
 * 把 token 綁在一個 `Proxy<CalendarConfigs>` 上，每次子元件存取欄位
 * 時才 lazily 讀取 computed 訊號；訊號以 input signals 為依賴，
 * 因此綁定完成後即可正確解析，並能隨輸入變更自動更新。
 *
 * @example
 * ```html
 * import { MznCalendarConfigProvider } from '@mezzanine-ui/ng/calendar';
 *
 * <div mznCalendarConfigProvider [methods]="dayjsMethods" locale="zh-TW">
 *   <mzn-date-picker [(ngModel)]="date" />
 * </div>
 * ```
 */
@Directive({
  selector: '[mznCalendarConfigProvider]',
  standalone: true,
  host: {
    '[attr.methods]': 'null',
    '[attr.defaultDateFormat]': 'null',
    '[attr.defaultTimeFormat]': 'null',
    '[attr.locale]': 'null',
  },
  providers: [
    {
      provide: MZN_CALENDAR_CONFIG,
      useFactory: (): CalendarConfigs =>
        inject(MznCalendarConfigProvider).config,
    },
  ],
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

  /** 反應式 CalendarConfigs；input 變更時自動重建。 */
  private readonly configSignal = computed(
    (): CalendarConfigs =>
      createCalendarConfig(this.methods(), {
        defaultDateFormat: this.defaultDateFormat(),
        defaultTimeFormat: this.defaultTimeFormat(),
        locale: this.locale(),
      }),
  );

  /**
   * 對外暴露的 CalendarConfigs。以 Proxy 包裝，把讀取動作延後到
   * 真正被呼叫的時刻（由子元件的 method/event/computed 驅動），
   * 此時 required input 已綁定。
   *
   * 只攔截 `get`：其他 trap（ownKeys/has/getOwnPropertyDescriptor）
   * 會被 Angular devMode injector profiler 與 V8 inspector 於元件
   * 建構當下做 eager introspection，進而提早觸發 `configSignal()`
   * → NG0950。必要時以 try/catch 吞掉尚未綁定期間的存取，
   * 消費端只要在事件/生命週期後讀取就能拿到正確值。
   */
  readonly config: CalendarConfigs = new Proxy({} as CalendarConfigs, {
    get: (_target, prop: PropertyKey): unknown => {
      try {
        const cfg = this.configSignal() as unknown as Record<
          PropertyKey,
          unknown
        >;
        return cfg[prop];
      } catch {
        return undefined;
      }
    },
  });
}
