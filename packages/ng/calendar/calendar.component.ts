import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  calendarClasses as classes,
  CalendarMode,
  calendarYearModuler,
  calendarQuarterYearsCount,
  calendarHalfYearYearsCount,
  DateType,
  getCalendarFooterControlLabel,
  getCalendarFooterControlTarget,
  getYearRange,
  isCalendarFooterControlDisabled,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendarControls } from './calendar-controls.component';
import { MznCalendarDays } from './calendar-days.component';
import { MznCalendarMonths } from './calendar-months.component';
import { MznCalendarYears } from './calendar-years.component';
import { MznCalendarWeeks } from './calendar-weeks.component';
import { MznCalendarQuarters } from './calendar-quarters.component';
import { MznCalendarHalfYears } from './calendar-half-years.component';
import {
  MznCalendarFooterControl,
  type MznCalendarFooterControlProps,
} from './calendar-footer-control.component';
import {
  MznCalendarQuickSelect,
  CalendarQuickSelectOption,
} from './calendar-quick-select.component';
import { CalendarDayAnnotation } from './calendar-days.component';

export {
  CalendarQuickSelectOption,
  CalendarDayAnnotation,
  type MznCalendarFooterControlProps,
};

/**
 * Host props of a calendar board, mirroring what `calendarDaysProps` and its
 * siblings effectively do in React: the rest of the bundle lands on the board
 * host. React also types the predicates here, but its flat props always
 * override them, so they are left out.
 */
export interface MznCalendarBoardProps {
  /** Extra class of the board host. */
  readonly className?: string;
  /** Inline style of the board host. */
  readonly style?: Readonly<Record<string, string>>;
}

/**
 * 日曆元件，支援 day/week/month/year/quarter/half-year 等模式。
 *
 * 內建模式堆疊（mode stack）機制：點擊月份/年份控制按鈕時，
 * 會推入新模式；選取後自動彈出回到原本模式。
 *
 * 必須在 `MznCalendarConfigProvider` 或同等 DI 提供者之下使用。
 *
 * @example
 * ```html
 * import { MznCalendar } from '@mezzanine-ui/ng/calendar';
 *
 * <div mznCalendar
 *   [referenceDate]="refDate"
 *   [value]="selected"
 *   mode="day"
 *   (dateChanged)="onSelect($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznCalendar]',
  standalone: true,
  imports: [
    MznCalendarControls,
    MznCalendarDays,
    MznCalendarMonths,
    MznCalendarYears,
    MznCalendarWeeks,
    MznCalendarQuarters,
    MznCalendarHalfYears,
    MznCalendarFooterControl,
    MznCalendarQuickSelect,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'application',
    '[attr.aria-label]': '"Calendar, " + currentMode() + " view"',
    '[class]': 'hostClasses()',
    '[attr.mode]': 'null',
    '[attr.referenceDate]': 'null',
    '[attr.value]': 'null',
    '[attr.calendarDaysProps]': 'null',
    '[attr.calendarFooterControlProps]': 'null',
    '[attr.calendarHalfYearsProps]': 'null',
    '[attr.calendarMonthsProps]': 'null',
    '[attr.calendarQuartersProps]': 'null',
    '[attr.calendarWeeksProps]': 'null',
    '[attr.calendarYearsProps]': 'null',
    '[attr.disabledFooterControl]': 'null',
    '[attr.disabledMonthSwitch]': 'null',
    '[attr.disabledYearSwitch]': 'null',
    '[attr.disableOnNext]': 'null',
    '[attr.disableOnDoubleNext]': 'null',
    '[attr.disableOnPrev]': 'null',
    '[attr.disableOnDoublePrev]': 'null',
    '[attr.noShadow]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.isDateInRange]': 'null',
    '[attr.isMonthDisabled]': 'null',
    '[attr.isMonthInRange]': 'null',
    '[attr.isYearDisabled]': 'null',
    '[attr.isYearInRange]': 'null',
    '[attr.isWeekDisabled]': 'null',
    '[attr.isWeekInRange]': 'null',
    '[attr.isQuarterDisabled]': 'null',
    '[attr.isQuarterInRange]': 'null',
    '[attr.isHalfYearDisabled]': 'null',
    '[attr.isHalfYearInRange]': 'null',
    '[attr.quickSelect]': 'null',
    '[attr.displayWeekDayLocale]': 'null',
    '[attr.displayMonthLocale]': 'null',
    '[attr.renderAnnotations]': 'null',
  },
  template: `
    @if (quickSelect()) {
      <div
        mznCalendarQuickSelect
        [activeId]="quickSelect()!.activeId"
        [options]="quickSelect()!.options"
      ></div>
    }
    <div [class]="mainWithFooterClass">
      <div [class]="mainClass">
        <!-- Controls -->
        <div
          mznCalendarControls
          [showPrev]="controlConfig().showPrev"
          [showDoublePrev]="controlConfig().showDoublePrev"
          [showNext]="controlConfig().showNext"
          [showDoubleNext]="controlConfig().showDoubleNext"
          [disableOnPrev]="disableOnPrev()"
          [disableOnDoublePrev]="disableOnDoublePrev()"
          [disableOnNext]="disableOnNext()"
          [disableOnDoubleNext]="disableOnDoubleNext()"
          (prev)="onPrev()"
          (doublePrev)="onDoublePrev()"
          (next)="onNext()"
          (doubleNext)="onDoubleNext()"
        >
          @if (currentMode() === 'day' || currentMode() === 'week') {
            <button
              type="button"
              [disabled]="disabledMonthSwitch()"
              [attr.aria-disabled]="disabledMonthSwitch()"
              [attr.aria-label]="'Select month, currently ' + displayMonth()"
              (click)="onMonthControlClick()"
              >{{ displayMonth() }}</button
            >
            <button
              type="button"
              [disabled]="disabledYearSwitch()"
              [attr.aria-disabled]="disabledYearSwitch()"
              [attr.aria-label]="'Select year, currently ' + displayYear()"
              (click)="onYearControlClick()"
              >{{ displayYear() }}</button
            >
          } @else if (currentMode() === 'month') {
            <button
              type="button"
              [disabled]="disabledYearSwitch()"
              [attr.aria-disabled]="disabledYearSwitch()"
              [attr.aria-label]="'Select year, currently ' + displayYear()"
              (click)="onYearControlClick()"
              >{{ displayYear() }}</button
            >
          } @else {
            <button
              type="button"
              disabled
              aria-disabled="true"
              [attr.aria-label]="'Year range ' + displayYearRange()"
            >
              {{ displayYearRange() }}
            </button>
          }
        </div>

        <!-- Board -->
        @switch (currentMode()) {
          @case ('day') {
            <div
              mznCalendarDays
              [class]="calendarDaysProps()?.className"
              [style]="calendarDaysProps()?.style"
              [referenceDate]="internalReferenceDate()"
              [value]="normalizedValue()"
              [isDateDisabled]="isDateDisabled()"
              [isDateInRange]="isDateInRange()"
              [isYearDisabled]="isYearDisabled()"
              [isMonthDisabled]="isMonthDisabled()"
              [displayWeekDayLocale]="displayWeekDayLocale()"
              [renderAnnotations]="renderAnnotations()"
              (dateClick)="onCellClick($event)"
              (dateHover)="cellHover.emit($event)"
            ></div>
          }
          @case ('week') {
            <div
              mznCalendarWeeks
              [class]="calendarWeeksProps()?.className"
              [style]="calendarWeeksProps()?.style"
              [referenceDate]="internalReferenceDate()"
              [value]="normalizedValue()"
              [isWeekDisabled]="isWeekDisabled()"
              [isWeekInRange]="isWeekInRange()"
              [isYearDisabled]="isYearDisabled()"
              [isMonthDisabled]="isMonthDisabled()"
              [displayWeekDayLocale]="displayWeekDayLocale()"
              (weekClick)="onCellClick($event)"
              (weekHover)="cellHover.emit($event)"
            ></div>
          }
          @case ('month') {
            <div
              mznCalendarMonths
              [class]="calendarMonthsProps()?.className"
              [style]="calendarMonthsProps()?.style"
              [referenceDate]="internalReferenceDate()"
              [value]="normalizedValue()"
              [isMonthDisabled]="isMonthDisabled()"
              [isMonthInRange]="isMonthInRange()"
              [isYearDisabled]="isYearDisabled()"
              [displayMonthLocale]="displayMonthLocale()"
              (monthClick)="onCellClick($event)"
              (monthHover)="cellHover.emit($event)"
            ></div>
          }
          @case ('year') {
            <div
              mznCalendarYears
              [class]="calendarYearsProps()?.className"
              [style]="calendarYearsProps()?.style"
              [referenceDate]="internalReferenceDate()"
              [value]="normalizedValue()"
              [isYearDisabled]="isYearDisabled()"
              [isYearInRange]="isYearInRange()"
              (yearClick)="onCellClick($event)"
              (yearHover)="cellHover.emit($event)"
            ></div>
          }
          @case ('quarter') {
            <div
              mznCalendarQuarters
              [class]="calendarQuartersProps()?.className"
              [style]="calendarQuartersProps()?.style"
              [referenceDate]="internalReferenceDate()"
              [value]="normalizedValue()"
              [isQuarterDisabled]="isQuarterDisabled()"
              [isQuarterInRange]="isQuarterInRange()"
              (quarterClick)="onCellClick($event)"
              (quarterHover)="cellHover.emit($event)"
            ></div>
          }
          @case ('half-year') {
            <div
              mznCalendarHalfYears
              [class]="calendarHalfYearsProps()?.className"
              [style]="calendarHalfYearsProps()?.style"
              [referenceDate]="internalReferenceDate()"
              [value]="normalizedValue()"
              [isHalfYearDisabled]="isHalfYearDisabled()"
              [isHalfYearInRange]="isHalfYearInRange()"
              (halfYearClick)="onCellClick($event)"
              (halfYearHover)="cellHover.emit($event)"
            ></div>
          }
        }
      </div>

      <!-- Footer control -->
      @if (!disabledFooterControl()) {
        <div
          mznCalendarFooterControl
          [class]="calendarFooterControlProps()?.className"
          [disabled]="isFooterDisabled()"
          (footerClick)="onFooterClick()"
          >{{ footerLabel() }}</div
        >
      }
    </div>
  `,
})
export class MznCalendar {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 日曆模式。 @default 'day' */
  readonly mode = input<CalendarMode>('day');
  /** 參考日期。 */
  readonly referenceDate = input<DateType>('');
  /** 已選取日期（單值或陣列）。 */
  readonly value = input<DateType | ReadonlyArray<DateType> | undefined>(
    undefined,
  );

  /** Other props of the day board host. */
  readonly calendarDaysProps = input<MznCalendarBoardProps | undefined>(
    undefined,
  );

  /** Other props of the half-year board host. */
  readonly calendarHalfYearsProps = input<MznCalendarBoardProps | undefined>(
    undefined,
  );

  /** Other props of the month board host. */
  readonly calendarMonthsProps = input<MznCalendarBoardProps | undefined>(
    undefined,
  );

  /** Other props of the quarter board host. */
  readonly calendarQuartersProps = input<MznCalendarBoardProps | undefined>(
    undefined,
  );

  /** Other props of the week board host. */
  readonly calendarWeeksProps = input<MznCalendarBoardProps | undefined>(
    undefined,
  );

  /** Other props of the year board host. */
  readonly calendarYearsProps = input<MznCalendarBoardProps | undefined>(
    undefined,
  );

  /**
   * Other props of the footer control. `children` customizes the label: a string
   * applies to every mode, while a map overrides the listed modes and keeps the
   * default label for the others.
   */
  readonly calendarFooterControlProps = input<
    MznCalendarFooterControlProps | undefined
  >(undefined);

  /** 是否禁用頁腳控制按鈕。 */
  readonly disabledFooterControl = input(false);
  /** 是否禁用月份切換按鈕。 */
  readonly disabledMonthSwitch = input(false);
  /** 是否禁用年份切換按鈕。 */
  readonly disabledYearSwitch = input(false);

  readonly disableOnNext = input(false);
  readonly disableOnDoubleNext = input(false);
  readonly disableOnPrev = input(false);
  readonly disableOnDoublePrev = input(false);

  /** 移除外框陰影（用於 RangeCalendar 內嵌時）。 */
  readonly noShadow = input(false);

  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isDateInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isMonthDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isMonthInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isYearDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isYearInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isWeekDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isWeekInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isQuarterDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isQuarterInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly isHalfYearDisabled = input<
    ((date: DateType) => boolean) | undefined
  >(undefined);
  readonly isHalfYearInRange = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** Quick select options (activeId + options array). */
  readonly quickSelect = input<
    | { activeId?: string; options: ReadonlyArray<CalendarQuickSelectOption> }
    | undefined
  >(undefined);

  readonly displayWeekDayLocale = input<string | undefined>(undefined);
  readonly displayMonthLocale = input<string | undefined>(undefined);

  /** 日期註解渲染函式，傳遞至 CalendarDays。 */
  readonly renderAnnotations = input<
    ((date: DateType) => CalendarDayAnnotation) | undefined
  >(undefined);

  /** 日期/月份/年份選取事件。 */
  readonly dateChanged = output<DateType>();
  /** Cell hover 事件。 */
  readonly cellHover = output<DateType>();
  /** 當上一步按鈕被點擊時觸發。傳出當前模式。 */
  readonly prevClicked = output<CalendarMode>();
  /** 當上一大步按鈕被點擊時觸發。傳出當前模式。 */
  readonly doublePrevClicked = output<CalendarMode>();
  /** 當下一步按鈕被點擊時觸發。傳出當前模式。 */
  readonly nextClicked = output<CalendarMode>();
  /** 當下一大步按鈕被點擊時觸發。傳出當前模式。 */
  readonly doubleNextClicked = output<CalendarMode>();
  /** 月份控制按鈕被點擊。 */
  readonly monthControlClicked = output<void>();
  /** 年份控制按鈕被點擊。 */
  readonly yearControlClicked = output<void>();

  /** Mode stack for drill-down navigation. */
  private readonly modeStack = signal<ReadonlyArray<CalendarMode>>([]);
  /** Internal reference date for navigation. */
  readonly internalReferenceDate = signal<DateType>('');

  readonly currentMode = computed((): CalendarMode => {
    const stack = this.modeStack();
    return stack.length > 0 ? stack[0] : this.mode();
  });

  readonly normalizedValue = computed(
    (): ReadonlyArray<DateType> | undefined => {
      const v = this.value();
      if (!v) return undefined;
      return Array.isArray(v) ? v : [v as DateType];
    },
  );

  protected readonly mainWithFooterClass = classes.mainWithFooter;
  protected readonly mainClass = classes.main;

  protected hostClasses(): string {
    return clsx(classes.host, classes.mode(this.currentMode()), {
      [classes.noShadowHost]: this.noShadow(),
    });
  }

  constructor() {
    // Sync referenceDate input → internal state on first non-empty value;
    // subsequent navigation is driven by internal state.
    effect(() => {
      const ref = this.referenceDate();
      if (ref) {
        this.internalReferenceDate.set(ref);
      }
    });
  }

  /** Control modifiers: what single/double arrows do per mode. */
  protected readonly controlConfig = computed(() => {
    const m = this.currentMode();
    const hasSingle = m === 'day' || m === 'week' || m === 'month';
    const hasDouble = m === 'day' || m === 'week';

    return {
      showPrev: hasSingle,
      showDoublePrev: hasDouble,
      showNext: hasSingle,
      showDoubleNext: hasDouble,
    };
  });

  protected readonly displayMonth = computed((): string => {
    const c = this.config;
    const locale = this.displayMonthLocale() ?? c.locale;
    return c.getMonthShortName(
      c.getMonth(this.internalReferenceDate()),
      locale,
    );
  });

  protected readonly displayYear = computed((): number =>
    this.config.getYear(this.internalReferenceDate()),
  );

  protected readonly displayYearRange = computed((): string => {
    const c = this.config;
    const year = c.getYear(this.internalReferenceDate());
    const m = this.currentMode();
    const mod =
      m === 'year'
        ? calendarYearModuler
        : m === 'quarter'
          ? calendarQuarterYearsCount
          : m === 'half-year'
            ? calendarHalfYearYearsCount
            : calendarYearModuler;
    const [start, end] = getYearRange(year, mod);
    return `${start} - ${end}`;
  });

  protected readonly footerLabel = computed((): string =>
    getCalendarFooterControlLabel(
      this.currentMode(),
      this.calendarFooterControlProps()?.children,
    ),
  );

  /** Navigation handlers */
  protected onPrev(): void {
    const c = this.config;
    const ref = this.internalReferenceDate();
    const m = this.currentMode();

    if (m === 'day' || m === 'week') {
      this.internalReferenceDate.set(c.addMonth(ref, -1));
    } else if (m === 'month') {
      this.internalReferenceDate.set(c.addYear(ref, -1));
    }
    this.prevClicked.emit(m);
  }

  protected onNext(): void {
    const c = this.config;
    const ref = this.internalReferenceDate();
    const m = this.currentMode();

    if (m === 'day' || m === 'week') {
      this.internalReferenceDate.set(c.addMonth(ref, 1));
    } else if (m === 'month') {
      this.internalReferenceDate.set(c.addYear(ref, 1));
    }
    this.nextClicked.emit(m);
  }

  protected onDoublePrev(): void {
    const c = this.config;
    const ref = this.internalReferenceDate();
    this.internalReferenceDate.set(c.addYear(ref, -1));
    this.doublePrevClicked.emit(this.currentMode());
  }

  protected onDoubleNext(): void {
    const c = this.config;
    const ref = this.internalReferenceDate();
    this.internalReferenceDate.set(c.addYear(ref, 1));
    this.doubleNextClicked.emit(this.currentMode());
  }

  protected onMonthControlClick(): void {
    this.modeStack.update((stack) => ['month' as CalendarMode, ...stack]);
    this.monthControlClicked.emit();
  }

  protected onYearControlClick(): void {
    this.modeStack.update((stack) => ['year' as CalendarMode, ...stack]);
    this.yearControlClicked.emit();
  }

  protected onCellClick(date: DateType): void {
    const m = this.currentMode();
    const baseMode = this.mode();

    if (m === baseMode) {
      // Direct selection in base mode
      this.dateChanged.emit(date);
    } else {
      // Drill-down selection: update reference date and pop mode stack
      this.internalReferenceDate.set(date);
      this.modeStack.update((stack) =>
        stack.length > 1 ? stack.slice(1) : [],
      );
    }
  }

  /**
   * A footer click behaves like a click on the target cell, so a drilled-down
   * panel only navigates instead of selecting a value.
   */
  protected onFooterClick(): void {
    if (this.isFooterDisabled()) return;

    this.onCellClick(this.getFooterTarget());
  }

  /**
   * A method rather than a `computed`: the target depends on the current time,
   * which is not a signal, so a cached value would go stale past midnight.
   */
  protected isFooterDisabled(): boolean {
    return (
      Boolean(this.calendarFooterControlProps()?.disabled) ||
      isCalendarFooterControlDisabled(
        this.currentMode(),
        this.getFooterTarget(),
        {
          isDateDisabled: this.isDateDisabled(),
          isHalfYearDisabled: this.isHalfYearDisabled(),
          isMonthDisabled: this.isMonthDisabled(),
          isQuarterDisabled: this.isQuarterDisabled(),
          isWeekDisabled: this.isWeekDisabled(),
          isYearDisabled: this.isYearDisabled(),
        },
      )
    );
  }

  private getFooterTarget(): DateType {
    return getCalendarFooterControlTarget(
      this.currentMode(),
      this.config,
      this.displayWeekDayLocale() ?? this.config.locale,
    );
  }

  /** Public API for external control (used by RangeCalendar). */
  updateReferenceDate(date: DateType): void {
    this.internalReferenceDate.set(date);
  }

  /** Push a new mode onto the mode stack (for external control). */
  pushMode(mode: CalendarMode): void {
    this.modeStack.update((stack) => [mode, ...stack]);
  }

  /** Pop the top mode from the stack (for external control). */
  popMode(): void {
    this.modeStack.update((stack) => (stack.length > 1 ? stack.slice(1) : []));
  }

  /** Get the internal reference date (for external synchronization). */
  getInternalReferenceDate(): DateType {
    return this.internalReferenceDate();
  }
}
