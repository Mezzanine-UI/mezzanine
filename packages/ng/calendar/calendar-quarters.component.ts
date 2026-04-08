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
  calendarQuarters,
  calendarQuarterYearsCount,
  DateType,
  getYearRange,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendarCell } from './calendar-cell.component';

/**
 * 日曆季度面板元件，顯示 3 年 × 4 季共 12 個季度格子。
 *
 * @example
 * ```html
 * <mzn-calendar-quarters
 *   [referenceDate]="refDate"
 *   [value]="selectedDates"
 *   (quarterClick)="onSelect($event)"
 * />
 * ```
 */
@Component({
  selector: 'mzn-calendar-quarters',
  standalone: true,
  imports: [MznCalendarCell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'boardClass',
  },
  template: `
    @for (yearRow of yearRows(); track yearRow.year; let yearIdx = $index) {
      <div [class]="yearRow.rowClass">
        <mzn-calendar-cell [disabled]="true" mode="quarter">
          {{ yearRow.year }}
        </mzn-calendar-cell>
        @for (item of yearRow.quarters; track item.quarter) {
          <mzn-calendar-cell
            mode="quarter"
            [today]="item.isCurrentQuarter"
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
              (click)="onQuarterClick(item.date)"
              (mouseenter)="quarterHover.emit(item.date)"
              >Q{{ item.quarter }}</button
            >
          </mzn-calendar-cell>
        }
      </div>
    }
  `,
})
export class MznCalendarQuarters {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 參考日期，用來決定顯示哪個年度範圍。 */
  readonly referenceDate = input.required<DateType>();

  /** 已選取日期。 */
  readonly value = input<ReadonlyArray<DateType> | undefined>(undefined);

  /** 自訂季度禁用判斷。 */
  readonly isQuarterDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂季度區間判斷。 */
  readonly isQuarterInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 季度點擊事件。 */
  readonly quarterClick = output<DateType>();

  /** 季度 hover 事件。 */
  readonly quarterHover = output<DateType>();

  protected readonly boardClass = classes.board;

  protected readonly yearRows = computed(() => {
    const c = this.config;
    const ref = this.referenceDate();
    const val = this.value();
    const disabledFn = this.isQuarterDisabled();
    const rangeFn = this.isQuarterInRange();
    const now = c.getNow();

    const currentYear = c.getYear(ref);
    const [start] = getYearRange(currentYear, calendarQuarterYearsCount);

    const quarterMonthNames: ReadonlyArray<string> = [
      'January, February, March',
      'April, May, June',
      'July, August, September',
      'October, November, December',
    ];

    return Array.from({ length: calendarQuarterYearsCount }, (_, i) => {
      const year = start + i;
      return {
        year,
        rowClass: clsx(classes.row, { [classes.rowWithBorder]: i > 0 }),
        quarters: calendarQuarters.map((quarter) => {
          const quarterStartMonth = (quarter - 1) * 3;
          const quarterDate = c.setMonth(
            c.setYear(
              c.getCurrentQuarterFirstDate(c.getCurrentQuarterFirstDate(ref)),
              year,
            ),
            quarterStartMonth,
          );

          const active = val
            ? c.isQuarterIncluded(quarterDate, [...val])
            : false;
          const disabled = disabledFn ? disabledFn(quarterDate) : false;
          const inRange = rangeFn ? rangeFn(quarterDate) : false;
          const isRangeStart =
            val && val.length > 0
              ? c.isQuarterIncluded(quarterDate, [val[0]])
              : false;
          const isRangeEnd =
            val && val.length > 0
              ? c.isQuarterIncluded(quarterDate, [val[val.length - 1]])
              : false;

          const ariaLabelParts = [
            `Quarter ${quarter}, ${year}`,
            quarterMonthNames[quarter - 1],
            active ? 'Selected' : null,
            disabled ? 'Not available' : null,
          ].filter(Boolean);

          return {
            quarter,
            date: quarterDate,
            active,
            disabled,
            isCurrentQuarter: c.isQuarterIncluded(quarterDate, [now]),
            isRangeStart,
            isRangeEnd,
            ariaLabel: ariaLabelParts.join(', '),
            buttonClass: clsx(classes.button, {
              [classes.buttonActive]: active,
              [classes.buttonInRange]: inRange,
              [classes.buttonDisabled]: disabled,
            }),
          };
        }),
      };
    });
  });

  protected onQuarterClick(date: DateType): void {
    this.quarterClick.emit(date);
  }
}
