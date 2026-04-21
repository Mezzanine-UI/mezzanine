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
  DateType,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendarCell } from './calendar-cell.component';
import { MznCalendarDayOfWeek } from './calendar-day-of-week.component';

/**
 * 日曆週面板元件，顯示一個月的週次格子，每列為一週。
 *
 * @example
 * ```html
 * <div mznCalendarWeeks
 *   [referenceDate]="refDate"
 *   [value]="selectedWeeks"
 *   (weekClick)="onSelect($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznCalendarWeeks]',
  standalone: true,
  imports: [MznCalendarCell, MznCalendarDayOfWeek],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'boardClass',
    '[attr.referenceDate]': 'null',
    '[attr.value]': 'null',
    '[attr.isWeekDisabled]': 'null',
    '[attr.isWeekInRange]': 'null',
    '[attr.isYearDisabled]': 'null',
    '[attr.isMonthDisabled]': 'null',
    '[attr.displayWeekDayLocale]': 'null',
  },
  template: `
    <div [class]="weekColumnClass">
      @for (item of weekItems(); track item.weekFirstDate) {
        <div [class]="weekRowClass">
          <div mznCalendarCell [disabled]="true">
            {{ item.weekNum }}
          </div>
        </div>
      }
    </div>
    <div [class]="daysGridClass">
      <div
        mznCalendarDayOfWeek
        [displayWeekDayLocale]="displayWeekDayLocale()"
      ></div>
      @for (item of weekItems(); track weekIdx; let weekIdx = $index) {
        <button
          type="button"
          [class]="item.rowButtonClass"
          [disabled]="item.disabled"
          [attr.aria-disabled]="item.disabled"
          [attr.aria-pressed]="item.weekIncluded"
          [attr.aria-label]="item.ariaLabel"
          (click)="onWeekClick(item.weekFirstDate)"
          (mouseenter)="weekHover.emit(item.weekFirstDate)"
        >
          @for (day of item.days; track dayIdx; let dayIdx = $index) {
            <div
              mznCalendarCell
              mode="week"
              [active]="day.cellActive"
              [disabled]="day.cellDisabled"
              [isRangeStart]="day.isRangeStart"
              [isRangeEnd]="day.isRangeEnd"
              [isWeekend]="day.isWeekend"
              [today]="day.isToday"
            >
              <div
                [class]="day.innerDivClass"
                style="width: 100%; height: 100%; pointer-events: none;"
              >
                {{ day.dateNum }}
              </div>
            </div>
          }
        </button>
      }
    </div>
  `,
})
export class MznCalendarWeeks {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 參考日期，用來決定顯示哪個月份。 */
  readonly referenceDate = input.required<DateType>();

  /** 已選取的週起始日期陣列。 */
  readonly value = input<ReadonlyArray<DateType> | undefined>(undefined);

  /** 自訂週禁用判斷（傳入週首日）。 */
  readonly isWeekDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂週區間判斷（傳入週首日）。 */
  readonly isWeekInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂年份禁用判斷。 */
  readonly isYearDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂月份禁用判斷。 */
  readonly isMonthDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 顯示星期名稱的語系。 */
  readonly displayWeekDayLocale = input<string | undefined>(undefined);

  /** 週點擊事件（傳出週首日）。 */
  readonly weekClick = output<DateType>();

  /** 週 hover 事件（傳出週首日）。 */
  readonly weekHover = output<DateType>();

  protected readonly boardClass = classes.board;
  protected readonly weekColumnClass = classes.week;
  protected readonly weekRowClass = classes.weekRow;
  protected readonly daysGridClass = classes.daysGrid;

  protected readonly weekItems = computed(() => {
    const c = this.config;
    const ref = this.referenceDate();
    const locale = this.displayWeekDayLocale() ?? c.locale;
    const weekends = c.getWeekends(locale);
    const rawGrid = c.getCalendarGrid(ref, locale);
    const val = this.value();
    const isWeekDisabledFn = this.isWeekDisabled();
    const isYearDisabledFn = this.isYearDisabled();
    const isMonthDisabledFn = this.isMonthDisabled();
    const isWeekInRangeFn = this.isWeekInRange();
    const thisMonth = c.getMonth(ref);
    const now = c.getNow();

    // Compute range endpoints for active cell marking
    const rangeFirstDate = val && val.length > 0 ? val[0] : null;
    let rangeLastDate: DateType | null = null;
    let lastWeekLastDate: DateType | null = null;

    if (val && val.length > 0) {
      const lastVal =
        val.length === 1
          ? c.setDate(val[0], c.getDate(val[0]) + 6)
          : val[val.length - 1];
      rangeLastDate = lastVal;
      const lastWeekFirstDate = c.getCurrentWeekFirstDate(lastVal, locale);
      lastWeekLastDate = c.setDate(
        lastWeekFirstDate,
        c.getDate(lastWeekFirstDate) + 6,
      );
    }

    return rawGrid.map((week, weekIdx) => {
      const dates: DateType[] = week.map((dateNum) => {
        const isPrevMonth = weekIdx === 0 && dateNum > 7;
        const isNextMonth = weekIdx > 3 && dateNum <= 14;
        const month = isPrevMonth
          ? thisMonth - 1
          : isNextMonth
            ? thisMonth + 1
            : thisMonth;
        return c.setMillisecond(
          c.setSecond(
            c.setMinute(
              c.setHour(c.setDate(c.setMonth(ref, month), dateNum), 0),
              0,
            ),
            0,
          ),
          0,
        );
      });

      const weekStartInPrevMonth = weekIdx === 0 && week[0] > 7;
      const weekStartInNextMonth = weekIdx > 3 && week[0] <= 14;
      const weekFirstDate = c.getCurrentWeekFirstDate(dates[0], locale);

      const disabled =
        isYearDisabledFn?.(dates[0]) ||
        isMonthDisabledFn?.(dates[0]) ||
        isWeekDisabledFn?.(dates[0]) ||
        false;
      const inactive =
        !disabled && (weekStartInPrevMonth || weekStartInNextMonth);
      const weekIncluded =
        !disabled &&
        !inactive &&
        !!val &&
        c.isWeekIncluded(dates[0], [...val], locale);
      const inRange =
        !disabled && !!isWeekInRangeFn && isWeekInRangeFn(dates[0]);

      const weekNum = c.getWeek(weekFirstDate, locale);
      const firstDateObj = new Date(dates[0] as string);
      const lastDateObj = new Date(dates[dates.length - 1] as string);
      const startMonth = firstDateObj.toLocaleDateString(locale, {
        month: 'short',
      });
      const endMonth = lastDateObj.toLocaleDateString(locale, {
        month: 'short',
      });
      const ariaLabelParts = [
        `Week ${weekNum}`,
        `${startMonth} ${firstDateObj.getDate()} to ${endMonth} ${lastDateObj.getDate()}`,
        weekIncluded ? 'Selected' : null,
        disabled ? 'Not available' : null,
        inactive ? 'Outside current month' : null,
      ].filter(Boolean);
      const ariaLabel = ariaLabelParts.join(', ');

      const days = week.map((dateNum, dayIdx) => {
        const date = dates[dayIdx];
        const isPrevMonth = weekIdx === 0 && dateNum > 7;
        const isNextMonth = weekIdx > 3 && dateNum <= 14;
        const cellDisabled = disabled || isPrevMonth || isNextMonth;

        let cellActive = false;
        let isRangeStart = false;
        let isRangeEnd = false;

        if (
          weekIncluded &&
          rangeFirstDate &&
          rangeLastDate &&
          lastWeekLastDate
        ) {
          isRangeStart =
            c.isWeekIncluded(date, [rangeFirstDate], locale) &&
            c.isSameDate(date, rangeFirstDate);
          isRangeEnd =
            c.isWeekIncluded(date, [rangeLastDate], locale) &&
            c.isSameDate(date, lastWeekLastDate);
          cellActive = isRangeStart || isRangeEnd;
        }

        return {
          dateNum,
          date,
          cellActive,
          cellDisabled,
          isRangeStart,
          isRangeEnd,
          isWeekend: weekends[dayIdx],
          isToday: c.isSameDate(date, now),
          innerDivClass: clsx(classes.button, {
            [classes.buttonInRange]: weekIncluded,
            [classes.buttonActive]: cellActive,
          }),
        };
      });

      return {
        weekFirstDate,
        weekNum,
        disabled,
        inactive,
        weekIncluded,
        ariaLabel,
        rowButtonClass: clsx(classes.button, classes.row, {
          [classes.buttonInRange]: inRange,
          [classes.buttonDisabled]: disabled,
        }),
        days,
      };
    });
  });

  protected onWeekClick(weekFirstDate: DateType): void {
    this.weekClick.emit(weekFirstDate);
  }
}
