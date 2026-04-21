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
  calendarYearsBase,
  DateType,
  getCalendarYearRange,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendarCell } from './calendar-cell.component';

/**
 * 日曆年份面板元件，顯示 20 年的格子。
 *
 * @example
 * ```html
 * <div mznCalendarYears
 *   [referenceDate]="refDate"
 *   [value]="selectedDates"
 *   (yearClick)="onSelect($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznCalendarYears]',
  standalone: true,
  imports: [MznCalendarCell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'boardClass',
    '[attr.referenceDate]': 'null',
    '[attr.value]': 'null',
    '[attr.isYearDisabled]': 'null',
    '[attr.isYearInRange]': 'null',
  },
  template: `
    <div [class]="gridClass">
      @for (item of yearItems(); track item.year) {
        <div
          mznCalendarCell
          mode="year"
          [today]="item.isCurrentYear"
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
            (click)="onYearClick(item.date)"
            (mouseenter)="yearHover.emit(item.date)"
            >{{ item.year }}</button
          >
        </div>
      }
    </div>
  `,
})
export class MznCalendarYears {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 參考日期。 */
  readonly referenceDate = input.required<DateType>();
  /** 已選取日期。 */
  readonly value = input<ReadonlyArray<DateType> | undefined>(undefined);
  /** 自訂年份禁用判斷。 */
  readonly isYearDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  /** 自訂年份區間判斷。 */
  readonly isYearInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 年份點擊事件。 */
  readonly yearClick = output<DateType>();
  /** 年份 hover 事件。 */
  readonly yearHover = output<DateType>();

  protected readonly boardClass = classes.board;
  protected readonly gridClass = classes.twelveGrid;

  protected readonly yearItems = computed(() => {
    const c = this.config;
    const ref = this.referenceDate();
    const val = this.value();
    const disabledFn = this.isYearDisabled();
    const rangeFn = this.isYearInRange();
    const now = c.getNow();
    const [start] = getCalendarYearRange(c.getYear(ref));

    return calendarYearsBase.map((base) => {
      const thisYear = base + start;
      const yearDate = c.setYear(c.getCurrentYearFirstDate(now), thisYear);
      const disabled = disabledFn ? disabledFn(yearDate) : false;
      const active =
        !disabled && val ? c.isYearIncluded(yearDate, [...val]) : false;
      const inRange = rangeFn ? rangeFn(yearDate) : false;
      const isRangeStart =
        val && val.length > 0 ? c.isYearIncluded(yearDate, [val[0]]) : false;
      const isRangeEnd =
        val && val.length > 0
          ? c.isYearIncluded(yearDate, [val[val.length - 1]])
          : false;

      return {
        year: thisYear,
        date: yearDate,
        active,
        disabled,
        isCurrentYear: c.getYear(now) === thisYear,
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

  protected onYearClick(date: DateType): void {
    this.yearClick.emit(date);
  }
}
