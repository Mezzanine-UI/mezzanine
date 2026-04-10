import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
} from '@angular/core';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import { MznRangeCalendar } from '@mezzanine-ui/ng/calendar';
import { CalendarQuickSelectOption } from '@mezzanine-ui/ng/calendar';
import {
  MznPopper,
  PopperOffsetOptions,
  PopperPlacement,
} from '@mezzanine-ui/ng/popper';

/**
 * 日期範圍選取日曆彈窗元件。
 *
 * 將 `MznRangeCalendar` 包裝於 `MznPopper` 中，
 * 提供附著在觸發元素旁的浮動雙日曆面板。
 * 為薄層元件，主要職責為轉發 props 至內部元件。
 *
 * @example
 * ```html
 * import { MznDateRangePickerCalendar } from '@mezzanine-ui/ng/date-range-picker';
 *
 * <div mznDateRangePickerCalendar
 *   [anchor]="triggerElRef"
 *   [open]="isOpen"
 *   [referenceDate]="refDate"
 *   [value]="selectedRange"
 *   mode="day"
 *   (rangeChanged)="onRangeChange($event)"
 *   (cellHover)="onHover($event)"
 *   (mouseLeave)="onLeave()"
 * ></div>
 * ```
 *
 * @see {@link MznRangeCalendar} 雙日曆範圍選取核心元件
 * @see {@link MznDateRangePicker} 完整日期範圍選擇器
 */
@Component({
  selector: '[mznDateRangePickerCalendar]',
  host: {
    '[attr.anchor]': 'null',
    '[attr.offsetOptions]': 'null',
    '[attr.open]': 'null',
    '[attr.placement]': 'null',
    '[attr.disabledMonthSwitch]': 'null',
    '[attr.disabledYearSwitch]': 'null',
    '[attr.disableOnDoubleNext]': 'null',
    '[attr.disableOnDoublePrev]': 'null',
    '[attr.disableOnNext]': 'null',
    '[attr.disableOnPrev]': 'null',
    '[attr.displayMonthLocale]': 'null',
    '[attr.displayWeekDayLocale]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.isDateInRange]': 'null',
    '[attr.isHalfYearDisabled]': 'null',
    '[attr.isHalfYearInRange]': 'null',
    '[attr.isMonthDisabled]': 'null',
    '[attr.isMonthInRange]': 'null',
    '[attr.isQuarterDisabled]': 'null',
    '[attr.isQuarterInRange]': 'null',
    '[attr.isWeekDisabled]': 'null',
    '[attr.isWeekInRange]': 'null',
    '[attr.isYearDisabled]': 'null',
    '[attr.isYearInRange]': 'null',
    '[attr.mode]': 'null',
    '[attr.quickSelect]': 'null',
    '[attr.referenceDate]': 'null',
    '[attr.showFooterActions]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  imports: [MznPopper, MznRangeCalendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      mznPopper
      [anchor]="anchor()"
      [open]="open()"
      [placement]="placement()"
      [offsetOptions]="offsetOptions()"
      style="z-index: var(--mzn-z-index-popover)"
    >
      <div (mouseleave)="mouseLeave.emit()">
        <div
          mznRangeCalendar
          [referenceDate]="referenceDate()"
          [value]="value()"
          [mode]="mode()"
          [disabledMonthSwitch]="disabledMonthSwitch()"
          [disabledYearSwitch]="disabledYearSwitch()"
          [disableOnNext]="disableOnNext()"
          [disableOnPrev]="disableOnPrev()"
          [disableOnDoubleNext]="disableOnDoubleNext()"
          [disableOnDoublePrev]="disableOnDoublePrev()"
          [displayMonthLocale]="displayMonthLocale()"
          [displayWeekDayLocale]="displayWeekDayLocale()"
          [isDateDisabled]="isDateDisabled()"
          [isDateInRange]="isDateInRange()"
          [isHalfYearDisabled]="isHalfYearDisabled()"
          [isHalfYearInRange]="isHalfYearInRange()"
          [isMonthDisabled]="isMonthDisabled()"
          [isMonthInRange]="isMonthInRange()"
          [isQuarterDisabled]="isQuarterDisabled()"
          [isQuarterInRange]="isQuarterInRange()"
          [isWeekDisabled]="isWeekDisabled()"
          [isWeekInRange]="isWeekInRange()"
          [isYearDisabled]="isYearDisabled()"
          [isYearInRange]="isYearInRange()"
          [quickSelect]="quickSelect()"
          [showFooterActions]="showFooterActions()"
          (rangeChanged)="rangeChanged.emit($event)"
          (cellHover)="cellHover.emit($event)"
          (confirmed)="confirmed.emit()"
          (cancelled)="cancelled.emit()"
        ></div>
      </div>
    </div>
  `,
})
export class MznDateRangePickerCalendar {
  // ─── Popper inputs ─────────────────────────────────────────────

  /**
   * 錨定元素（觸發元素），Popper 將浮動定位於其旁。
   */
  readonly anchor = input<HTMLElement | ElementRef<HTMLElement> | null>(null);

  /**
   * Popper 位移設定。
   * @default { mainAxis: 4 }
   */
  readonly offsetOptions = input<PopperOffsetOptions>({ mainAxis: 4 });

  /**
   * 是否顯示日曆面板。
   * @default false
   */
  readonly open = input(false);

  /**
   * Popper 定位方向。
   * @default 'bottom-start'
   */
  readonly placement = input<PopperPlacement>('bottom-start');

  // ─── RangeCalendar inputs ──────────────────────────────────────

  /** 是否禁用月份切換按鈕。 @default false */
  readonly disabledMonthSwitch = input(false);

  /** 是否禁用年份切換按鈕。 @default false */
  readonly disabledYearSwitch = input(false);

  /** 禁用右側日曆的「向後跳兩個月/年」按鈕。 @default false */
  readonly disableOnDoubleNext = input(false);

  /** 禁用左側日曆的「向前跳兩個月/年」按鈕。 @default false */
  readonly disableOnDoublePrev = input(false);

  /** 禁用右側日曆的「向後一個月/年」按鈕。 @default false */
  readonly disableOnNext = input(false);

  /** 禁用左側日曆的「向前一個月/年」按鈕。 @default false */
  readonly disableOnPrev = input(false);

  /** 顯示月份標題的語系。 */
  readonly displayMonthLocale = input<string | undefined>(undefined);

  /** 顯示星期列標題的語系。 */
  readonly displayWeekDayLocale = input<string | undefined>(undefined);

  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isDateInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isHalfYearDisabled = input<
    ((date: DateType) => boolean) | undefined
  >(undefined);
  readonly isHalfYearInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isMonthDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isMonthInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isQuarterDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isQuarterInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isWeekDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isWeekInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isYearDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isYearInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 日曆模式。 @default 'day' */
  readonly mode = input<CalendarMode>('day');

  /**
   * 快速選取選項設定。
   */
  readonly quickSelect = input<
    | {
        activeId?: string;
        options: ReadonlyArray<CalendarQuickSelectOption>;
      }
    | undefined
  >(undefined);

  /**
   * 日曆初始顯示的參考日期（左側日曆）。
   */
  readonly referenceDate = input<DateType>('');

  /**
   * 是否顯示 Footer 的 Cancel/Ok 按鈕列。
   * @default false
   */
  readonly showFooterActions = input(false);

  /**
   * 目前已選取或選取中的日期值（單值或陣列）。
   */
  readonly value = input<DateType | ReadonlyArray<DateType> | undefined>(
    undefined,
  );

  // ─── Outputs ───────────────────────────────────────────────────

  /** Footer 取消按鈕事件。 */
  readonly cancelled = output<void>();

  /** Cell hover 事件，傳回滑鼠懸停的日期。 */
  readonly cellHover = output<DateType>();

  /** Footer 確認按鈕事件。 */
  readonly confirmed = output<void>();

  /** 滑鼠離開日曆面板事件。 */
  readonly mouseLeave = output<void>();

  /** 範圍選取完成或更新起始日時的事件。 */
  readonly rangeChanged = output<[DateType, DateType | undefined]>();
}
