import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  calendarClasses as classes,
  calendarMonths,
  DateType,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendarCell } from './calendar-cell.component';

/**
 * 日曆月份面板元件，顯示 12 個月份格子。
 *
 * @example
 * ```html
 * <mzn-calendar-months
 *   [referenceDate]="refDate"
 *   [value]="selectedDates"
 *   (monthClick)="onSelect($event)"
 * />
 * ```
 */
@Component({
  selector: 'mzn-calendar-months',
  standalone: true,
  imports: [MznCalendarCell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'boardClass',
  },
  template: `
    <div [class]="gridClass">
      @for (item of monthItems(); track item.month) {
        <mzn-calendar-cell
          mode="month"
          [today]="item.isCurrentMonth"
          [active]="item.active"
          [isRangeStart]="item.isRangeStart"
          [isRangeEnd]="item.isRangeEnd"
        >
          <button
            type="button"
            [disabled]="item.disabled"
            [attr.aria-disabled]="item.disabled"
            [attr.aria-pressed]="item.active"
            [class]="item.buttonClass"
            (click)="onMonthClick(item.date)"
            (mouseenter)="monthHover.emit(item.date)"
            >{{ item.name }}</button
          >
        </mzn-calendar-cell>
      }
    </div>
  `,
})
export class MznCalendarMonths {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 參考日期。 */
  readonly referenceDate = input.required<DateType>();
  /** 已選取日期。 */
  readonly value = input<ReadonlyArray<DateType> | undefined>(undefined);
  /** 顯示月份名稱的語系。 */
  readonly displayMonthLocale = input<string | undefined>(undefined);
  /** 自訂月份禁用判斷。 */
  readonly isMonthDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  /** 自訂月份區間判斷。 */
  readonly isMonthInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  /** 自訂年份禁用判斷。 */
  readonly isYearDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 月份點擊事件。 */
  readonly monthClick = output<DateType>();
  /** 月份 hover 事件。 */
  readonly monthHover = output<DateType>();

  protected readonly boardClass = classes.board;
  protected readonly gridClass = classes.twelveGrid;

  protected readonly monthItems = computed(() => {
    const c = this.config;
    const ref = this.referenceDate();
    const locale = this.displayMonthLocale() ?? c.locale;
    const monthNames = c.getMonthShortNames(locale);
    const val = this.value();
    const disabledFn = this.isMonthDisabled();
    const yearDisabledFn = this.isYearDisabled();
    const rangeFn = this.isMonthInRange();
    const now = c.getNow();

    return calendarMonths.map((month) => {
      const monthDate = c.setMonth(c.getCurrentMonthFirstDate(ref), month);
      const active = val ? c.isMonthIncluded(monthDate, [...val]) : false;
      const disabled =
        yearDisabledFn?.(monthDate) || disabledFn?.(monthDate) || false;
      const inRange = rangeFn ? rangeFn(monthDate) : false;
      const isRangeStart =
        val && val.length > 0 ? c.isMonthIncluded(monthDate, [val[0]]) : false;
      const isRangeEnd =
        val && val.length > 0
          ? c.isMonthIncluded(monthDate, [val[val.length - 1]])
          : false;

      return {
        month,
        date: monthDate,
        name: monthNames[month],
        active,
        disabled,
        isCurrentMonth: c.isInMonth(monthDate, c.getMonth(now)),
        isRangeStart,
        isRangeEnd,
        buttonClass: clsx(classes.button, {
          [classes.buttonActive]: active,
          [classes.buttonInRange]: inRange,
          [classes.buttonDisabled]: disabled,
        }),
      };
    });
  });

  protected onMonthClick(date: DateType): void {
    this.monthClick.emit(date);
  }
}
