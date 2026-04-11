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
import { TypographyColor } from '@mezzanine-ui/core/typography';
import clsx from 'clsx';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendarCell } from './calendar-cell.component';
import { MznCalendarDayOfWeek } from './calendar-day-of-week.component';
import { MznTypography } from '@mezzanine-ui/ng/typography';

/** Annotation render result for a date cell. */
export interface CalendarDayAnnotation {
  readonly value: string;
  readonly color?: TypographyColor;
}

/**
 * 日曆日期面板元件，顯示一個月的日期格子。
 *
 * @example
 * ```html
 * <div mznCalendarDays
 *   [referenceDate]="refDate"
 *   [value]="selectedDates"
 *   (dateClick)="onSelect($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznCalendarDays]',
  standalone: true,
  imports: [MznCalendarCell, MznCalendarDayOfWeek, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'boardClass',
    '[attr.referenceDate]': 'null',
    '[attr.value]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.isDateInRange]': 'null',
    '[attr.isYearDisabled]': 'null',
    '[attr.isMonthDisabled]': 'null',
    '[attr.displayWeekDayLocale]': 'null',
    '[attr.renderAnnotations]': 'null',
  },
  template: `
    <div [class]="daysGridClass">
      <div
        mznCalendarDayOfWeek
        [displayWeekDayLocale]="displayWeekDayLocale()"
      ></div>
      @for (week of grid(); track weekIdx; let weekIdx = $index) {
        <div [class]="rowClass">
          @for (day of week; track dayIdx; let dayIdx = $index) {
            <div
              mznCalendarCell
              [active]="day.active"
              [disabled]="day.isPrevMonth || day.isNextMonth"
              [isRangeStart]="day.isRangeStart"
              [isRangeEnd]="day.isRangeEnd"
              [isWeekend]="day.isWeekend"
              [today]="day.isToday"
              [withAnnotation]="day.hasAnnotation"
              mode="day"
            >
              <button
                type="button"
                [disabled]="day.disabled"
                [attr.aria-disabled]="day.disabled"
                [attr.aria-pressed]="day.active"
                [attr.aria-current]="day.isToday ? 'date' : null"
                [class]="day.buttonClass"
                (click)="onDayClick(day.date)"
                (mouseenter)="dateHover.emit(day.date)"
                >{{ day.dateNum }}
                @if (day.hasAnnotation) {
                  <span
                    mznTypography
                    variant="annotation"
                    [color]="
                      day.active
                        ? 'text-fixed-light'
                        : (day.annotation?.color ?? 'text-neutral')
                    "
                    >{{ day.annotation?.value ?? '--' }}</span
                  >
                }
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MznCalendarDays {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 參考日期，用來決定顯示哪個月份。 */
  readonly referenceDate = input.required<DateType>();

  /** 已選取的日期陣列。 */
  readonly value = input<ReadonlyArray<DateType> | undefined>(undefined);

  /** 自訂日期禁用判斷。 */
  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 自訂日期區間判斷。 */
  readonly isDateInRange = input<((date: DateType) => boolean) | undefined>(
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

  /** 日期註解渲染函式。 */
  readonly renderAnnotations = input<
    ((date: DateType) => CalendarDayAnnotation) | undefined
  >(undefined);

  /** 日期點擊事件。 */
  readonly dateClick = output<DateType>();

  /** 日期 hover 事件。 */
  readonly dateHover = output<DateType>();

  protected readonly boardClass = classes.board;
  protected readonly daysGridClass = classes.daysGrid;
  protected readonly rowClass = classes.row;

  protected readonly grid = computed(() => {
    const c = this.config;
    const ref = this.referenceDate();
    const locale = this.displayWeekDayLocale() ?? c.locale;
    const weekends = c.getWeekends(locale);
    const rawGrid = c.getCalendarGrid(ref, locale);
    const val = this.value();
    const disabledFn = this.isDateDisabled();
    const rangeFn = this.isDateInRange();
    const yearDisabledFn = this.isYearDisabled();
    const monthDisabledFn = this.isMonthDisabled();
    const annotationFn = this.renderAnnotations();
    const thisMonth = c.getMonth(ref);
    const now = c.getNow();

    return rawGrid.map((week, weekIdx) =>
      week.map((dateNum, dayIdx) => {
        const isPrevMonth = weekIdx === 0 && dateNum > 7;
        const isNextMonth = weekIdx > 3 && dateNum <= 14;
        const month = isPrevMonth
          ? thisMonth - 1
          : isNextMonth
            ? thisMonth + 1
            : thisMonth;

        const date = c.setMillisecond(
          c.setSecond(
            c.setMinute(
              c.setHour(c.setDate(c.setMonth(ref, month), dateNum), 0),
              0,
            ),
            0,
          ),
          0,
        );

        const disabled =
          yearDisabledFn?.(date) ||
          monthDisabledFn?.(date) ||
          disabledFn?.(date) ||
          false;
        const inactive = !disabled && (isPrevMonth || isNextMonth);
        const inRange = !inactive && rangeFn ? rangeFn(date) : false;
        const active =
          !disabled && !inactive && val
            ? c.isDateIncluded(date, [...val])
            : false;
        const isRangeStart =
          !inactive && val && val.length > 0
            ? c.isSameDate(date, val[0])
            : false;
        const isRangeEnd =
          !inactive && val && val.length > 0
            ? c.isSameDate(date, val[val.length - 1])
            : false;
        const isToday = c.isSameDate(date, now);
        const annotation = annotationFn ? annotationFn(date) : undefined;

        return {
          dateNum,
          date,
          active,
          disabled,
          inactive,
          isPrevMonth,
          isNextMonth,
          isRangeStart,
          isRangeEnd,
          isWeekend: weekends[dayIdx],
          isToday,
          hasAnnotation: !!annotationFn,
          annotation,
          buttonClass: clsx(classes.button, {
            [classes.buttonInRange]: inRange,
            [classes.buttonActive]: active,
            [classes.buttonDisabled]: disabled,
          }),
        };
      }),
    );
  });

  protected onDayClick(date: DateType): void {
    this.dateClick.emit(date);
  }
}
