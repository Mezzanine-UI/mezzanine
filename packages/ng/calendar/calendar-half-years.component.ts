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
  calendarHalfYears,
  calendarHalfYearYearsCount,
  DateType,
  getYearRange,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendarCell } from './calendar-cell.component';

/**
 * 日曆半年度面板元件，顯示 5 年 × 2 個半年共 10 格。
 *
 * @example
 * ```html
 * <div mznCalendarHalfYears
 *   [referenceDate]="refDate"
 *   [value]="selectedDates"
 *   (halfYearClick)="onSelect($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznCalendarHalfYears]',
  standalone: true,
  imports: [MznCalendarCell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'boardClass',
    '[attr.referenceDate]': 'null',
    '[attr.value]': 'null',
    '[attr.isHalfYearDisabled]': 'null',
    '[attr.isHalfYearInRange]': 'null',
  },
  template: `
    @for (yearRow of yearRows(); track yearRow.year; let yearIdx = $index) {
      <div [class]="yearRow.rowClass">
        <div mznCalendarCell [disabled]="true" mode="half-year">
          {{ yearRow.year }}
        </div>
        @for (item of yearRow.halfYears; track item.halfYear) {
          <div
            mznCalendarCell
            mode="half-year"
            [today]="item.isCurrentHalfYear"
            [active]="item.active"
            [isRangeStart]="item.isRangeStart"
            [isRangeEnd]="item.isRangeEnd"
          >
            <button
              type="button"
              [disabled]="item.disabled"
              [attr.aria-disabled]="item.disabled"
              [attr.aria-pressed]="item.active"
              [attr.aria-label]="item.ariaLabel"
              [class]="item.buttonClass"
              (click)="onHalfYearClick(item.date)"
              (mouseenter)="halfYearHover.emit(item.date)"
              >H{{ item.halfYear }}</button
            >
          </div>
        }
      </div>
    }
  `,
})
export class MznCalendarHalfYears {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 參考日期，用來決定顯示哪個年度範圍。 */
  readonly referenceDate = input.required<DateType>();

  /** 已選取日期。 */
  readonly value = input<ReadonlyArray<DateType> | undefined>(undefined);

  /** 自訂半年度禁用判斷。 */
  readonly isHalfYearDisabled = input<
    ((date: DateType) => boolean) | undefined
  >(undefined);

  /** 自訂半年度區間判斷。 */
  readonly isHalfYearInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 半年度點擊事件。 */
  readonly halfYearClick = output<DateType>();

  /** 半年度 hover 事件。 */
  readonly halfYearHover = output<DateType>();

  protected readonly boardClass = classes.board;

  protected readonly yearRows = computed(() => {
    const c = this.config;
    const ref = this.referenceDate();
    const val = this.value();
    const disabledFn = this.isHalfYearDisabled();
    const rangeFn = this.isHalfYearInRange();
    const now = c.getNow();

    const currentYear = c.getYear(ref);
    const [start] = getYearRange(currentYear, calendarHalfYearYearsCount);

    const halfYearMonthNames: ReadonlyArray<string> = [
      'January to June',
      'July to December',
    ];

    return Array.from({ length: calendarHalfYearYearsCount }, (_, i) => {
      const year = start + i;
      return {
        year,
        rowClass: clsx(classes.row, { [classes.rowWithBorder]: i > 0 }),
        halfYears: calendarHalfYears.map((halfYear) => {
          const halfYearStartMonth = (halfYear - 1) * 6;
          const halfYearDate = c.setMonth(
            c.setYear(c.getCurrentHalfYearFirstDate(ref), year),
            halfYearStartMonth,
          );

          const disabled = disabledFn ? disabledFn(halfYearDate) : false;
          const inRange = !disabled && rangeFn ? rangeFn(halfYearDate) : false;
          const active =
            !disabled && val
              ? c.isHalfYearIncluded(halfYearDate, [...val])
              : false;
          const isRangeStart =
            val && val.length > 0
              ? c.isHalfYearIncluded(halfYearDate, [val[0]])
              : false;
          const isRangeEnd =
            val && val.length > 0
              ? c.isHalfYearIncluded(halfYearDate, [val[val.length - 1]])
              : false;

          const ariaLabelParts = [
            `Half ${halfYear}, ${year}`,
            halfYearMonthNames[halfYear - 1],
            active ? 'Selected' : null,
            disabled ? 'Not available' : null,
          ].filter(Boolean);

          return {
            halfYear,
            date: halfYearDate,
            active,
            disabled,
            isCurrentHalfYear: c.isHalfYearIncluded(halfYearDate, [now]),
            isRangeStart,
            isRangeEnd,
            ariaLabel: ariaLabelParts.join(', '),
            buttonClass: clsx(classes.button, {
              [classes.buttonDisabled]: disabled,
              [classes.buttonInRange]: inRange,
              [classes.buttonActive]: active,
            }),
          };
        }),
      };
    });
  });

  protected onHalfYearClick(date: DateType): void {
    this.halfYearClick.emit(date);
  }
}
