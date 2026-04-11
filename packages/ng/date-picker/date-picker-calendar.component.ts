import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
} from '@angular/core';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import {
  MznCalendar,
  type CalendarDayAnnotation,
  type CalendarQuickSelectOption,
} from '@mezzanine-ui/ng/calendar';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import type {
  PopperOffsetOptions,
  PopperPlacement,
} from '@mezzanine-ui/ng/popper';

/**
 * DatePicker 專用的日曆彈出層子元件。
 *
 * 將 `MznPopper` 與 `MznCalendar` 封裝在一起，
 * 根據 `open` 狀態控制彈出層的顯示，並將日曆的 `dateChanged` 事件向上傳遞。
 * 可獨立使用，也可搭配 `MznDatePicker` 組合使用。
 *
 * @example
 * ```html
 * import { MznDatePickerCalendar } from '@mezzanine-ui/ng/date-picker';
 *
 * <div mznDatePickerCalendar
 *   [anchor]="triggerElement"
 *   [open]="isOpen"
 *   [mode]="'day'"
 *   [referenceDate]="refDate"
 *   [value]="selectedDate"
 *   (dateChanged)="onSelect($event)"
 * ></div>
 * ```
 *
 * @see {@link MznDatePicker} 完整日期選擇器
 * @see {@link MznCalendar} 日曆元件
 * @see {@link MznPopper} 浮動定位元件
 */
@Component({
  selector: '[mznDatePickerCalendar]',
  host: {
    '[attr.anchor]': 'null',
    '[attr.open]': 'null',
    '[attr.mode]': 'null',
    '[attr.referenceDate]': 'null',
    '[attr.value]': 'null',
    '[attr.disableOnDoubleNext]': 'null',
    '[attr.disableOnDoublePrev]': 'null',
    '[attr.disableOnNext]': 'null',
    '[attr.disableOnPrev]': 'null',
    '[attr.disabledMonthSwitch]': 'null',
    '[attr.disabledYearSwitch]': 'null',
    '[attr.displayMonthLocale]': 'null',
    '[attr.displayWeekDayLocale]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.isHalfYearDisabled]': 'null',
    '[attr.isMonthDisabled]': 'null',
    '[attr.isQuarterDisabled]': 'null',
    '[attr.isWeekDisabled]': 'null',
    '[attr.isYearDisabled]': 'null',
    '[attr.popperOffsetOptions]': 'null',
    '[attr.quickSelect]': 'null',
    '[attr.renderAnnotations]': 'null',
  },
  standalone: true,
  imports: [MznCalendar, MznPopper],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      mznPopper
      [anchor]="anchor()"
      [open]="open()"
      [placement]="popperPlacement()"
      [offsetOptions]="popperOffsetOptions()"
      style="z-index: var(--mzn-z-index-popover)"
    >
      <div (mouseleave)="leave.emit()">
        <div
          mznCalendar
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
          [isHalfYearDisabled]="isHalfYearDisabled()"
          [isMonthDisabled]="isMonthDisabled()"
          [isQuarterDisabled]="isQuarterDisabled()"
          [isWeekDisabled]="isWeekDisabled()"
          [isYearDisabled]="isYearDisabled()"
          [quickSelect]="quickSelect()"
          [renderAnnotations]="renderAnnotations()"
          (cellHover)="hover.emit($event)"
          (dateChanged)="dateChanged.emit($event)"
        ></div>
      </div>
    </div>
  `,
})
export class MznDatePickerCalendar {
  /**
   * 錨定元素，Popper 相對此元素定位。
   * @default null
   */
  readonly anchor = input<HTMLElement | ElementRef<HTMLElement> | null>(null);

  /**
   * 是否顯示日曆彈出層。
   * @default false
   */
  readonly open = input(false);

  /**
   * 日曆模式。
   * @default 'day'
   */
  readonly mode = input<CalendarMode>('day');

  /**
   * 參考日期，用於決定日曆顯示的月份/年份。
   */
  readonly referenceDate = input<DateType>('');

  /**
   * 已選取的日期值。
   */
  readonly value = input<DateType | undefined>(undefined);

  /** 禁用日曆控制列的「向後跳兩個月/年」按鈕。 @default false */
  readonly disableOnDoubleNext = input(false);

  /** 禁用日曆控制列的「向前跳兩個月/年」按鈕。 @default false */
  readonly disableOnDoublePrev = input(false);

  /** 禁用日曆控制列的「向後一個月/年」按鈕。 @default false */
  readonly disableOnNext = input(false);

  /** 禁用日曆控制列的「向前一個月/年」按鈕。 @default false */
  readonly disableOnPrev = input(false);

  /** 是否禁用月份切換按鈕。 @default false */
  readonly disabledMonthSwitch = input(false);

  /** 是否禁用年份切換按鈕。 @default false */
  readonly disabledYearSwitch = input(false);

  /** 顯示月份標題的語系。 */
  readonly displayMonthLocale = input<string | undefined>(undefined);

  /** 顯示星期列標題的語系。 */
  readonly displayWeekDayLocale = input<string | undefined>(undefined);

  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isHalfYearDisabled = input<
    ((date: DateType) => boolean) | undefined
  >(undefined);
  readonly isMonthDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isQuarterDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isWeekDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isYearDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** Quick select shortcut options (activeId + options array). */
  readonly quickSelect = input<
    | { activeId?: string; options: ReadonlyArray<CalendarQuickSelectOption> }
    | undefined
  >(undefined);

  /** Per-date annotation render function. */
  readonly renderAnnotations = input<
    ((date: DateType) => CalendarDayAnnotation) | undefined
  >(undefined);

  /**
   * Popper 定位方向。
   * @default 'bottom-start'
   */
  readonly popperPlacement = input<PopperPlacement>('bottom-start');

  /**
   * Popper 位移設定，覆寫預設的 `{ mainAxis: 4 }`。
   * @default { mainAxis: 4 }
   */
  readonly popperOffsetOptions = input<PopperOffsetOptions>({ mainAxis: 4 });

  /** 日期選取事件。 */
  readonly dateChanged = output<DateType>();

  /** 日曆格子 hover 事件（對應 React DatePickerCalendar 的 `onHover`）。 */
  readonly hover = output<DateType>();

  /** 滑鼠離開日曆面板事件（對應 React DatePickerCalendar 的 `onLeave`）。 */
  readonly leave = output<void>();
}
