import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { DateType } from '@mezzanine-ui/core/calendar';
import {
  getUnits,
  timePanelClasses as classes,
  TimePanelUnit,
} from '@mezzanine-ui/core/time-panel';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznCalendarFooterActions } from '@mezzanine-ui/ng/_internal';
import { getCSSVariablePixelValue } from '@mezzanine-ui/ng/utils';
import { MznTimePanelColumn } from './time-panel-column.component';

/**
 * 時間面板元件，顯示時/分/秒的可滾動欄位，附帶 Cancel/Ok 按鈕。
 *
 * 採用兩階段提交模式：欄位變更更新 pending value，
 * 點擊「Ok」才正式提交，「Cancel」則放棄修改。
 *
 * @example
 * ```html
 * import { MznTimePanel } from '@mezzanine-ui/ng/time-panel';
 *
 * <div mznTimePanel
 *   [value]="pendingTime"
 *   (timeChanged)="onTimeChange($event)"
 *   (confirmed)="onConfirm()"
 *   (cancelled)="onCancel()"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznTimePanel]',
  standalone: true,
  imports: [MznTimePanelColumn, MznCalendarFooterActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.hideHour]': 'null',
    '[attr.hideMinute]': 'null',
    '[attr.hideSecond]': 'null',
    '[attr.hourStep]': 'null',
    '[attr.minuteStep]': 'null',
    '[attr.secondStep]': 'null',
    '[attr.cellHeight]': 'null',
    '[attr.value]': 'null',
  },
  template: `
    <div [class]="columnsClass">
      @if (!hideHour()) {
        <div
          mznTimePanelColumn
          [units]="hourUnits()"
          [activeUnit]="activeHour()"
          [cellHeight]="cellHeight()"
          (unitChanged)="onColumnChange('hour', $event)"
        ></div>
      }
      @if (!hideMinute()) {
        <div
          mznTimePanelColumn
          [units]="minuteUnits()"
          [activeUnit]="activeMinute()"
          [cellHeight]="cellHeight()"
          (unitChanged)="onColumnChange('minute', $event)"
        ></div>
      }
      @if (!hideSecond()) {
        <div
          mznTimePanelColumn
          [units]="secondUnits()"
          [activeUnit]="activeSecond()"
          [cellHeight]="cellHeight()"
          (unitChanged)="onColumnChange('second', $event)"
        ></div>
      }
    </div>
    <div
      mznCalendarFooterActions
      cancelText="Cancel"
      confirmText="Ok"
      (cancelled)="cancelled.emit()"
      (confirmed)="confirmed.emit()"
    ></div>
  `,
})
export class MznTimePanel {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 是否隱藏小時欄。 */
  readonly hideHour = input(false);
  /** 是否隱藏分鐘欄。 */
  readonly hideMinute = input(false);
  /** 是否隱藏秒鐘欄。 */
  readonly hideSecond = input(false);
  /** 小時步長。 @default 1 */
  readonly hourStep = input(1);
  /** 分鐘步長。 @default 1 */
  readonly minuteStep = input(1);
  /** 秒鐘步長。 @default 1 */
  readonly secondStep = input(1);
  /**
   * 每個儲存格的高度（px），控制捲動定位。
   * 預設從 CSS variable `--mzn-spacing-size-element-loose` 讀取。
   */
  readonly cellHeight = input(
    getCSSVariablePixelValue('--mzn-spacing-size-element-loose', 32),
  );
  /** 當前顯示值。 */
  readonly value = input<DateType | undefined>(undefined);

  /** 時間變更事件（pending，尚未提交）。 */
  readonly timeChanged = output<DateType>();
  /** 確認事件。 */
  readonly confirmed = output<void>();
  /** 取消事件。 */
  readonly cancelled = output<void>();

  protected readonly hostClass = classes.host;
  protected readonly columnsClass = classes.columns;

  protected readonly hourUnits = computed(() =>
    this.hideHour() ? [] : getUnits(0, 23, this.hourStep()),
  );
  protected readonly minuteUnits = computed(() =>
    this.hideMinute() ? [] : getUnits(0, 59, this.minuteStep()),
  );
  protected readonly secondUnits = computed(() =>
    this.hideSecond() ? [] : getUnits(0, 59, this.secondStep()),
  );

  protected readonly activeHour = computed(() => {
    const v = this.value();
    return v ? this.config.getHour(v) : undefined;
  });
  protected readonly activeMinute = computed(() => {
    const v = this.value();
    return v ? this.config.getMinute(v) : undefined;
  });
  protected readonly activeSecond = computed(() => {
    const v = this.value();
    return v ? this.config.getSecond(v) : undefined;
  });

  protected onColumnChange(
    granularity: 'hour' | 'minute' | 'second',
    unit: TimePanelUnit,
  ): void {
    const c = this.config;
    const current = this.value() ?? c.startOf(c.getNow(), 'day');

    const setters = {
      hour: c.setHour,
      minute: c.setMinute,
      second: c.setSecond,
    } as const;

    const result = setters[granularity](current, unit.value);
    this.timeChanged.emit(result);
  }
}
