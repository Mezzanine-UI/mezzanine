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
  calendarClasses,
  CalendarMode,
  calendarYearModuler,
  calendarQuarterYearsCount,
  calendarHalfYearYearsCount,
  DateType,
} from '@mezzanine-ui/core/calendar';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendar, CalendarDayAnnotation } from './calendar.component';
import { MznCalendarFooterActions } from '@mezzanine-ui/ng/_internal';
import {
  MznCalendarQuickSelect,
  CalendarQuickSelectOption,
} from './calendar-quick-select.component';

export { CalendarQuickSelectOption };

/**
 * 雙日曆範圍選取元件。
 *
 * 並排顯示兩個日曆，支援以點擊方式選取起始與結束日期。
 * 第一次點擊設為起始日，第二次點擊設為結束日，自動正規化為 [start, end]。
 * 支援 hover 預覽高亮、disabled 日期範圍偵測，以及 Footer 操作按鈕與快速選取。
 *
 * 必須在 `MznCalendarConfigProvider` 或同等 DI 提供者之下使用。
 *
 * @example
 * ```html
 * import { MznRangeCalendar } from '@mezzanine-ui/ng/calendar';
 *
 * <div mznRangeCalendar
 *   [referenceDate]="refDate"
 *   [value]="selectedRange"
 *   mode="day"
 *   (rangeChanged)="onRangeChange($event)"
 * ></div>
 * ```
 *
 * @see {@link MznCalendar} 單日曆元件
 */
@Component({
  selector: '[mznRangeCalendar]',
  standalone: true,
  imports: [MznCalendar, MznCalendarFooterActions, MznCalendarQuickSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'application',
    '[attr.aria-label]': '"Range calendar, " + mode() + " view"',
    '[class]': 'hostClass',
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
    '[attr.renderAnnotations]': 'null',
    '[attr.showFooterActions]': 'null',
    '[attr.value]': 'null',
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
      <div [class]="rangeWrapperClass">
        <div
          mznCalendar
          [referenceDate]="firstRef()"
          [value]="calendarValue()"
          [mode]="currentMode()"
          [noShadow]="true"
          [disabledFooterControl]="true"
          [disabledMonthSwitch]="disabledMonthSwitch()"
          [disabledYearSwitch]="disabledYearSwitch()"
          [disableOnNext]="true"
          [disableOnDoubleNext]="true"
          [disableOnPrev]="disableOnPrev()"
          [disableOnDoublePrev]="disableOnDoublePrev()"
          [displayMonthLocale]="displayMonthLocale()"
          [displayWeekDayLocale]="displayWeekDayLocale()"
          [renderAnnotations]="renderAnnotations()"
          [isDateDisabled]="isDateDisabled()"
          [isDateInRange]="effectiveIsDateInRange()"
          [isHalfYearDisabled]="isHalfYearDisabled()"
          [isHalfYearInRange]="effectiveIsHalfYearInRange()"
          [isMonthDisabled]="isMonthDisabled()"
          [isMonthInRange]="effectiveIsMonthInRange()"
          [isQuarterDisabled]="isQuarterDisabled()"
          [isQuarterInRange]="effectiveIsQuarterInRange()"
          [isWeekDisabled]="isWeekDisabled()"
          [isWeekInRange]="effectiveIsWeekInRange()"
          [isYearDisabled]="isYearDisabled()"
          [isYearInRange]="effectiveIsYearInRange()"
          (dateChanged)="onFirstCalendarClick($event)"
          (cellHover)="onCellHover($event)"
          (prevClicked)="onFirstPrev()"
          (doublePrevClicked)="onFirstDoublePrev()"
          (monthControlClicked)="onMonthControlClick()"
          (yearControlClicked)="onYearControlClick()"
        ></div>
        <div
          mznCalendar
          [referenceDate]="secondRef()"
          [value]="calendarValue()"
          [mode]="currentMode()"
          [noShadow]="true"
          [disabledFooterControl]="true"
          [disabledMonthSwitch]="disabledMonthSwitch()"
          [disabledYearSwitch]="disabledYearSwitch()"
          [disableOnNext]="disableOnNext()"
          [disableOnDoubleNext]="disableOnDoubleNext()"
          [disableOnPrev]="true"
          [disableOnDoublePrev]="true"
          [displayMonthLocale]="displayMonthLocale()"
          [displayWeekDayLocale]="displayWeekDayLocale()"
          [renderAnnotations]="renderAnnotations()"
          [isDateDisabled]="isDateDisabled()"
          [isDateInRange]="effectiveIsDateInRange()"
          [isHalfYearDisabled]="isHalfYearDisabled()"
          [isHalfYearInRange]="effectiveIsHalfYearInRange()"
          [isMonthDisabled]="isMonthDisabled()"
          [isMonthInRange]="effectiveIsMonthInRange()"
          [isQuarterDisabled]="isQuarterDisabled()"
          [isQuarterInRange]="effectiveIsQuarterInRange()"
          [isWeekDisabled]="isWeekDisabled()"
          [isWeekInRange]="effectiveIsWeekInRange()"
          [isYearDisabled]="isYearDisabled()"
          [isYearInRange]="effectiveIsYearInRange()"
          (dateChanged)="onSecondCalendarClick($event)"
          (cellHover)="onCellHover($event)"
          (nextClicked)="onSecondNext()"
          (doubleNextClicked)="onSecondDoubleNext()"
          (monthControlClicked)="onMonthControlClick()"
          (yearControlClicked)="onYearControlClick()"
        ></div>
      </div>
      @if (showFooterActions()) {
        <div
          mznCalendarFooterActions
          [confirmDisabled]="!canConfirm()"
          (confirmed)="confirmed.emit()"
          (cancelled)="onCancelledInternal()"
        ></div>
      }
    </div>
  `,
})
export class MznRangeCalendar {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  // ─── Inputs ────────────────────────────────────────────────────

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

  /** 快速選取選項設定。 */
  readonly quickSelect = input<
    | {
        activeId?: string;
        options: ReadonlyArray<CalendarQuickSelectOption>;
      }
    | undefined
  >(undefined);

  /** 日曆初始顯示的參考日期（左側日曆）。 */
  readonly referenceDate = input<DateType>('');

  /** 日期註解渲染函式。 */
  readonly renderAnnotations = input<
    ((date: DateType) => CalendarDayAnnotation) | undefined
  >(undefined);

  /** 是否顯示 Footer 的 Cancel/Ok 按鈕列。 @default false */
  readonly showFooterActions = input(false);

  /** 目前已選取或選取中的日期值（單值或陣列）。 */
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

  /** 範圍選取完成或更新起始日時的事件。 */
  readonly rangeChanged = output<[DateType, DateType | undefined]>();

  // ─── Internal state ────────────────────────────────────────────

  private readonly pickingStart = signal<DateType | undefined>(undefined);
  private readonly pickingEnd = signal<DateType | undefined>(undefined);
  private readonly hoverDate = signal<DateType | undefined>(undefined);

  /** Whether the picking state has both start and end committed. */
  protected readonly canConfirm = computed(
    (): boolean => !!this.pickingStart() && !!this.pickingEnd(),
  );

  /** Managed reference dates for the two calendars. */
  private readonly internalFirstRef = signal<DateType>('');
  private readonly internalSecondRef = signal<DateType>('');

  /** Mode stack for synchronized drill-down navigation. */
  private readonly modeStack = signal<ReadonlyArray<CalendarMode>>([]);

  protected readonly hostClass = calendarClasses.host;
  protected readonly mainWithFooterClass = calendarClasses.mainWithFooter;
  protected readonly rangeWrapperClass =
    calendarClasses.mainRangeCalendarWrapper;

  readonly currentMode = computed((): CalendarMode => {
    const stack = this.modeStack();
    return stack.length > 0 ? stack[0] : this.mode();
  });

  private readonly referenceDateInitialized = signal(false);

  constructor() {
    // Sync referenceDate input -> internal refs on first non-empty value.
    effect(() => {
      const ref = this.referenceDate();
      if (ref && !this.referenceDateInitialized()) {
        this.referenceDateInitialized.set(true);
        this.internalFirstRef.set(ref);
        this.internalSecondRef.set(this.getSecondCalendarDate(ref));
      }
    });

    // Sync internal picking state with external `value` input.
    // 兩步選取 UX 的 picking 狀態是必要的(第一擊後等第二擊),但當外部
    // 直接改寫 value(例如 QuickSelect onClick 把 parent state 設成新的
    // [start, end])時,pickingStart/pickingEnd 仍停留在上次使用者點選
    // 的邊界 → calendarValue computed 優先回傳舊 picking → 頭尾 cell
    // 高亮卡在舊日期。React 沒有獨立 picking state 直接從 value prop
    // 推算邊界,所以天然無此問題。這段 effect 鏡像 React 行為:
    // value 變動時把 picking 對齊新值。寫入相同值時 Angular signal 以
    // `===` 判等 skip 傳遞,所以一般使用者點擊(先自己 set picking 再
    // emit 給 parent → value 回饋)不會產生無限迴圈。
    effect(() => {
      const val = this.value();

      if (!val) {
        this.pickingStart.set(undefined);
        this.pickingEnd.set(undefined);

        return;
      }

      // DateType = string，用 typeof 比 Array.isArray 能更精確 narrow
      // readonly array（TS 對 `ReadonlyArray` 的 isArray 收斂有已知限制）。
      if (typeof val === 'string') {
        this.pickingStart.set(val);
        this.pickingEnd.set(undefined);

        return;
      }

      this.pickingStart.set(val[0] ?? undefined);
      this.pickingEnd.set(val.length >= 2 ? val[1] : undefined);
    });
  }

  /** Calculate the offset between two calendars based on mode. */
  private getSecondCalendarDate(firstDate: DateType): DateType {
    const c = this.config;
    const m = this.mode();
    switch (m) {
      case 'year':
        return c.addYear(firstDate, calendarYearModuler);
      case 'month':
        return c.addYear(firstDate, 1);
      case 'quarter':
        return c.addYear(firstDate, calendarQuarterYearsCount);
      case 'half-year':
        return c.addYear(firstDate, calendarHalfYearYearsCount);
      case 'week':
      case 'day':
      default:
        return c.addMonth(firstDate, 1);
    }
  }

  readonly firstRef = computed((): DateType => {
    const internal = this.internalFirstRef();
    if (internal) return internal;
    const ref = this.referenceDate();
    return ref || this.config.getNow();
  });

  readonly secondRef = computed((): DateType => {
    const internal = this.internalSecondRef();
    if (internal) return internal;
    return this.getSecondCalendarDate(this.firstRef());
  });

  readonly calendarValue = computed((): ReadonlyArray<DateType> => {
    const start = this.pickingStart();
    const end = this.pickingEnd();
    const val = this.value();

    if (start && end) return [start, end];
    if (start) return [start];

    if (val) {
      return Array.isArray(val) ? val : [val as DateType];
    }

    return [];
  });

  /**
   * Hover 高亮範圍函式。
   * 僅在「已選取起始日但尚未選取結束日」時啟用。
   */
  private readonly hoverRangeFn = computed(
    (): ((date: DateType) => boolean) | undefined => {
      const start = this.pickingStart();
      const end = this.pickingEnd();
      const hover = this.hoverDate();
      const c = this.config;

      // Only show hover range when picking start but not yet picking end
      if (!start || end || !hover) return undefined;

      return (date: DateType): boolean => {
        const [lo, hi] = c.isBefore(start, hover)
          ? [start, hover]
          : [hover, start];
        return c.isBetween(date, lo, hi, 'day');
      };
    },
  );

  /**
   * Fallback in-range function derived from the currently committed value.
   * When no external `isDateInRange` is provided but a fully selected
   * [start, end] value exists, highlight cells between them — matching
   * React's DateRangePicker `getIsInRangeHandler` behavior.
   */
  private readonly committedRangeFn = computed(
    (): ((date: DateType) => boolean) | undefined => {
      const val = this.value();
      if (!val || !Array.isArray(val) || val.length < 2) return undefined;
      const start = val[0];
      const end = val[val.length - 1];
      if (!start || !end) return undefined;
      const c = this.config;
      const [lo, hi] = c.isBefore(start, end) ? [start, end] : [end, start];
      return (date: DateType): boolean => c.isBetween(date, lo, hi, 'day');
    },
  );

  readonly effectiveIsDateInRange = computed(
    (): ((date: DateType) => boolean) | undefined =>
      this.hoverRangeFn() ?? this.isDateInRange() ?? this.committedRangeFn(),
  );

  readonly effectiveIsMonthInRange = computed(
    (): ((date: DateType) => boolean) | undefined =>
      this.hoverRangeFn() ? undefined : this.isMonthInRange(),
  );

  readonly effectiveIsWeekInRange = computed(
    (): ((date: DateType) => boolean) | undefined =>
      this.hoverRangeFn() ? undefined : this.isWeekInRange(),
  );

  readonly effectiveIsYearInRange = computed(
    (): ((date: DateType) => boolean) | undefined =>
      this.hoverRangeFn() ? undefined : this.isYearInRange(),
  );

  readonly effectiveIsQuarterInRange = computed(
    (): ((date: DateType) => boolean) | undefined =>
      this.hoverRangeFn() ? undefined : this.isQuarterInRange(),
  );

  readonly effectiveIsHalfYearInRange = computed(
    (): ((date: DateType) => boolean) | undefined =>
      this.hoverRangeFn() ? undefined : this.isHalfYearInRange(),
  );

  // ─── Navigation modifiers ─────────────────────────────────────

  private getModifiers(m: CalendarMode): {
    single: [(date: DateType) => DateType, (date: DateType) => DateType] | null;
    double: [(date: DateType) => DateType, (date: DateType) => DateType] | null;
  } {
    const c = this.config;
    switch (m) {
      case 'day':
      case 'week':
        return {
          single: [(d) => c.addMonth(d, -1), (d) => c.addMonth(d, 1)],
          double: [(d) => c.addYear(d, -1), (d) => c.addYear(d, 1)],
        };
      case 'month':
        return {
          single: [(d) => c.addYear(d, -1), (d) => c.addYear(d, 1)],
          double: null,
        };
      case 'year':
        return {
          single: [
            (d) => c.addYear(d, -calendarYearModuler),
            (d) => c.addYear(d, calendarYearModuler),
          ],
          double: null,
        };
      case 'quarter':
        return {
          single: [
            (d) => c.addYear(d, -calendarQuarterYearsCount),
            (d) => c.addYear(d, calendarQuarterYearsCount),
          ],
          double: null,
        };
      case 'half-year':
        return {
          single: [
            (d) => c.addYear(d, -calendarHalfYearYearsCount),
            (d) => c.addYear(d, calendarHalfYearYearsCount),
          ],
          double: null,
        };
      default:
        return { single: null, double: null };
    }
  }

  private updateBothReferenceDates(newFirst: DateType): void {
    this.internalFirstRef.set(newFirst);
    this.internalSecondRef.set(this.getSecondCalendarDate(newFirst));
  }

  // ─── Handlers ──────────────────────────────────────────────────

  protected onFirstPrev(): void {
    const mods = this.getModifiers(this.currentMode());
    if (!mods.single) return;
    const newFirst = mods.single[0](this.firstRef());
    this.updateBothReferenceDates(newFirst);
  }

  protected onFirstDoublePrev(): void {
    const mods = this.getModifiers(this.currentMode());
    if (!mods.double) return;
    const newFirst = mods.double[0](this.firstRef());
    this.updateBothReferenceDates(newFirst);
  }

  protected onSecondNext(): void {
    const mods = this.getModifiers(this.currentMode());
    if (!mods.single) return;
    const newFirst = mods.single[1](this.firstRef());
    this.updateBothReferenceDates(newFirst);
  }

  protected onSecondDoubleNext(): void {
    const mods = this.getModifiers(this.currentMode());
    if (!mods.double) return;
    const newFirst = mods.double[1](this.firstRef());
    this.updateBothReferenceDates(newFirst);
  }

  protected onMonthControlClick(): void {
    const c = this.config;
    this.internalSecondRef.set(c.addYear(this.firstRef(), 1));
    this.modeStack.update((stack) => ['month' as CalendarMode, ...stack]);
  }

  protected onYearControlClick(): void {
    const c = this.config;
    this.internalSecondRef.set(c.addYear(this.firstRef(), calendarYearModuler));
    this.modeStack.update((stack) => ['year' as CalendarMode, ...stack]);
  }

  protected onFirstCalendarClick(date: DateType): void {
    this.handleCalendarClick(date, 0);
  }

  protected onSecondCalendarClick(date: DateType): void {
    this.handleCalendarClick(date, 1);
  }

  private handleCalendarClick(date: DateType, calendarIndex: 0 | 1): void {
    const cm = this.currentMode();
    const baseMode = this.mode();
    const c = this.config;

    if (cm === baseMode) {
      // Direct selection in base mode — handle range logic
      this.handleRangeSelection(date);
    } else {
      // Drill-down: update reference date and pop mode
      const targetRef =
        calendarIndex === 0 ? this.firstRef() : this.secondRef();
      let resultDate: DateType;

      if (cm === 'month') {
        resultDate = c.setMonth(targetRef, c.getMonth(date));
      } else if (cm === 'year') {
        resultDate = c.setYear(targetRef, c.getYear(date));
      } else {
        resultDate = date;
      }

      this.updateBothReferenceDates(resultDate);
      this.modeStack.update((stack) =>
        stack.length > 1 ? stack.slice(1) : [],
      );
    }
  }

  private handleRangeSelection(target: DateType): void {
    const start = this.pickingStart();
    const end = this.pickingEnd();
    const c = this.config;

    if (!start || (start && end)) {
      // No start or already complete: begin new selection
      this.pickingStart.set(target);
      this.pickingEnd.set(undefined);
      this.hoverDate.set(undefined);
      this.rangeChanged.emit([target, undefined]);
    } else {
      // Have start, finalizing range
      const isEndBeforeStart = c.isBefore(target, start);
      const [lo, hi] = isEndBeforeStart ? [target, start] : [start, target];

      this.pickingStart.set(lo);
      this.pickingEnd.set(hi);
      this.hoverDate.set(undefined);
      this.rangeChanged.emit([lo, hi]);
    }
  }

  protected onCellHover(date: DateType): void {
    this.hoverDate.set(date);
    this.cellHover.emit(date);
  }

  protected onCancelledInternal(): void {
    this.resetPickingState();
    this.cancelled.emit();
  }

  /**
   * 重置內部的 picking 與 hover 狀態。供父元件在關閉/取消時呼叫。
   */
  resetPickingState(): void {
    this.pickingStart.set(undefined);
    this.pickingEnd.set(undefined);
    this.hoverDate.set(undefined);
  }
}
