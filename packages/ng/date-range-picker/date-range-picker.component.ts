import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  CalendarMode,
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import { pickerClasses, RangePickerValue } from '@mezzanine-ui/core/picker';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import {
  MZN_CALENDAR_CONFIG,
  type CalendarDayAnnotation,
  type CalendarQuickSelectOption,
} from '@mezzanine-ui/ng/calendar';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { MznRangePickerTrigger } from '@mezzanine-ui/ng/picker';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import { MznDateRangePickerCalendar } from './date-range-picker-calendar.component';

/**
 * 日期範圍選擇器元件，以雙日曆面板選取日期區間。
 *
 * 第一次點擊設為起始日，第二次點擊設為結束日，
 * 自動正規化為 [start, end]。
 *
 * @example
 * ```html
 * import { MznDateRangePicker } from '@mezzanine-ui/ng/date-range-picker';
 *
 * <div mznDateRangePicker
 *   [(ngModel)]="dateRange"
 *   inputFromPlaceholder="Start Date"
 *   inputToPlaceholder="End Date"
 * ></div>
 * ```
 *
 * @see {@link MznDatePicker} 單一日期選擇器
 */
@Component({
  selector: '[mznDateRangePicker]',
  host: {
    '[attr.clearable]': 'null',
    '[attr.confirmMode]': 'null',
    '[attr.disabled]': 'null',
    '[attr.disableOnDoubleNext]': 'null',
    '[attr.disableOnDoublePrev]': 'null',
    '[attr.disableOnNext]': 'null',
    '[attr.disableOnPrev]': 'null',
    '[attr.disabledMonthSwitch]': 'null',
    '[attr.disabledYearSwitch]': 'null',
    '[attr.displayMonthLocale]': 'null',
    '[attr.displayWeekDayLocale]': 'null',
    '[attr.error]': 'null',
    '[attr.format]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.inputFromPlaceholder]': 'null',
    '[attr.inputToPlaceholder]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.isHalfYearDisabled]': 'null',
    '[attr.isMonthDisabled]': 'null',
    '[attr.isQuarterDisabled]': 'null',
    '[attr.isWeekDisabled]': 'null',
    '[attr.isYearDisabled]': 'null',
    '[attr.quickSelect]': 'null',
    '[attr.renderAnnotations]': 'null',
    '[attr.mode]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.referenceDate]': 'null',
    '[attr.size]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  imports: [MznDateRangePickerCalendar, MznRangePickerTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznDateRangePicker)],
  template: `
    <div
      mznRangePickerTrigger
      #triggerEl
      [format]="resolvedFormat()"
      [inputFromValue]="inputFromValue()"
      [inputToValue]="inputToValue()"
      [inputFromPlaceholder]="inputFromPlaceholder()"
      [inputToPlaceholder]="inputToPlaceholder()"
      [disabled]="disabled()"
      [readOnly]="readOnly()"
      [clearable]="clearable()"
      [error]="error()"
      [fullWidth]="fullWidth()"
      [size]="size()"
      [hostClassModifier]="rangeHostClass()"
      [validateFrom]="validateFn()"
      [validateTo]="validateFn()"
      (fromFocused)="openCalendar()"
      (toFocused)="openCalendar()"
      (iconClick)="toggleCalendar($event)"
      (cleared)="onClear()"
      (inputFromChanged)="onTriggerFromChange($event)"
      (inputToChanged)="onTriggerToChange($event)"
    ></div>
    <div
      mznDateRangePickerCalendar
      [anchor]="triggerElement()"
      [open]="isOpen()"
      [referenceDate]="referenceRef()"
      [value]="calendarDisplayValue()"
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
      [showFooterActions]="confirmMode() === 'manual'"
      (rangeChanged)="onRangeChanged($event)"
      (confirmed)="onConfirm()"
      (cancelled)="onCancel()"
      (mouseLeave)="onMouseLeave()"
    ></div>
  `,
})
export class MznDateRangePicker implements ControlValueAccessor, AfterViewInit {
  private readonly config = inject(MZN_CALENDAR_CONFIG);
  private readonly clickAway = inject(ClickAwayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);

  /** 是否可清除。 @default true */
  readonly clearable = input(true);

  /** 確認模式。immediate = 選完兩個日期自動關閉；manual = 需按 Ok。 @default 'immediate' */
  readonly confirmMode = input<'immediate' | 'manual'>('immediate');

  /** 是否禁用。 @default false */
  readonly disabled = input(false);

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

  /** 是否有錯誤。 @default false */
  readonly error = input(false);

  /** 顯示格式。 */
  readonly format = input<string | undefined>(undefined);

  /** 是否全寬。 @default false */
  readonly fullWidth = input(false);

  /** 起始日期輸入框佔位文字。 */
  readonly inputFromPlaceholder = input<string | undefined>(undefined);

  /** 結束日期輸入框佔位文字。 */
  readonly inputToPlaceholder = input<string | undefined>(undefined);

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

  /** 日曆模式。 @default 'day' */
  readonly mode = input<CalendarMode>('day');

  /** 是否唯讀。 @default false */
  readonly readOnly = input(false);

  /**
   * 日曆初始顯示的參考日期。未設定時使用已選範圍的起始日或當前時間。
   */
  readonly referenceDate = input<DateType | undefined>(undefined);

  /** 尺寸。 @default 'main' */
  readonly size = input<TextFieldSize>('main');

  /** 外部值（受控模式）。 */
  readonly value = input<RangePickerValue | undefined>(undefined);

  readonly rangeChanged = output<RangePickerValue>();

  private readonly triggerRef = viewChild<MznRangePickerTrigger, ElementRef>(
    'triggerEl',
    { read: ElementRef },
  );
  protected readonly triggerElement = computed(() => this.triggerRef());

  /**
   * Directive instance of the trigger, used to imperatively focus the
   * "to" input after the first calendar click (matches React parity).
   */
  private readonly triggerComponent = viewChild(MznRangePickerTrigger);

  private readonly rangeCalendarRef = viewChild(MznDateRangePickerCalendar);

  readonly isOpen = signal(false);

  /**
   * 已 commit 的日期範圍（用於表單控制與 input 顯示）。
   */
  private readonly committedValue = signal<RangePickerValue>([
    undefined,
    undefined,
  ] as unknown as RangePickerValue);

  /**
   * 進行中的選取狀態（對應 React 的 internalFrom/internalTo + isSelecting）。
   *
   * - `undefined` 代表目前沒有在選取，input 顯示 committedValue
   * - `[start, undefined]` 代表第一次點擊後、尚未選完 end
   * - `[start, end]` 代表兩個日期都選了，等待 Confirm（manual）或已 commit（immediate 已清除）
   *
   * Input 顯示與 calendarDisplayValue 在 staged 存在時優先讀 staged，
   * 達成選取過程中 input 即時反映選取中日期的效果。
   */
  private readonly stagedValue = signal<
    [DateType | undefined, DateType | undefined] | undefined
  >(undefined);

  /**
   * 目前有效的範圍值：選取中時讀 staged，否則 fallback 到 committed。
   * 對應 React 的 `from = isSelecting ? internalFrom : (valueProp?.[0] ?? internalFrom)`。
   */
  private readonly effectiveRange = computed(
    (): readonly [DateType | undefined, DateType | undefined] => {
      const staged = this.stagedValue();
      if (staged) return staged;
      const committed = this.committedValue();
      return [committed?.[0], committed?.[1]] as const;
    },
  );

  protected readonly resolvedFormat = computed(
    () => this.format() ?? getDefaultModeFormat(this.mode()),
  );

  /**
   * 根據 mode 決定套用的 range host class。
   * - year mode: mzn-picker--range-year
   * - non-day non-year: mzn-picker--range-slim
   * - day: mzn-picker--range
   */
  protected readonly rangeHostClass = computed((): string => {
    const m = this.mode();
    if (m === 'year') return pickerClasses.hostRangeYear;
    if (m !== 'day') return pickerClasses.hostRangeSlim;
    return '';
  });

  /**
   * 起始日期的格式化字串，供 from 輸入框顯示。
   * 選取進行中會優先顯示 staged 值（對應 React 的 internalFrom + isSelecting）。
   */
  protected readonly inputFromValue = computed((): string | undefined => {
    const [from] = this.effectiveRange();
    if (!from) return undefined;
    const c = this.config;
    return c.formatToString(c.locale, from, this.resolvedFormat()) ?? undefined;
  });

  /**
   * 結束日期的格式化字串，供 to 輸入框顯示。
   * 選取進行中會優先顯示 staged 值（對應 React 的 internalTo + isSelecting）。
   */
  protected readonly inputToValue = computed((): string | undefined => {
    const [, to] = this.effectiveRange();
    if (!to) return undefined;
    const c = this.config;
    return c.formatToString(c.locale, to, this.resolvedFormat()) ?? undefined;
  });

  /**
   * 傳入 MznDateRangePickerCalendar 的 value。
   * 選取進行中優先顯示 staged，未 staged 時 fallback 到 committed。
   * 支援第一次點擊後單一日期的暫存顯示。
   */
  protected readonly calendarDisplayValue = computed(
    (): ReadonlyArray<DateType> => {
      const [from, to] = this.effectiveRange();
      if (from && to) return [from, to];
      if (from) return [from];
      return [];
    },
  );

  /**
   * 左側日曆的參考日期。
   */
  /** Validate predicate for typed-input on both from/to inputs. */
  protected readonly validateFn = computed(
    (): ((isoDate: string) => boolean) | undefined => {
      const checks = [
        this.isDateDisabled(),
        this.isMonthDisabled(),
        this.isYearDisabled(),
        this.isWeekDisabled(),
        this.isQuarterDisabled(),
        this.isHalfYearDisabled(),
      ].filter((fn): fn is (date: DateType) => boolean => !!fn);
      if (checks.length === 0) return undefined;
      return (isoDate: string): boolean => {
        const c = this.config;
        const parsed = c.parseFormattedValue(
          isoDate,
          this.resolvedFormat(),
          c.locale,
        );
        if (!parsed) return false;
        return !checks.some((fn) => fn(parsed));
      };
    },
  );

  protected readonly referenceRef = computed((): DateType => {
    const c = this.config;
    const extRef = this.referenceDate();
    const val = this.committedValue();
    return extRef ?? val?.[0] ?? c.getNow();
  });

  private _onChange: ((value: RangePickerValue) => void) | null = null;
  private _onTouched: (() => void) | null = null;

  constructor() {
    effect(() => {
      const v = this.value();
      if (v) this.committedValue.set(v);
    });
  }

  writeValue(value: RangePickerValue | undefined): void {
    this.committedValue.set(
      value ?? ([undefined, undefined] as unknown as RangePickerValue),
    );
  }

  registerOnChange(fn: (value: RangePickerValue) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  ngAfterViewInit(): void {
    this.clickAway.listen(
      this.hostElRef.nativeElement,
      () => {
        if (this.isOpen()) {
          this.onCancel();
          this._onTouched?.();
        }
      },
      this.destroyRef,
    );
  }

  protected openCalendar(): void {
    if (this.readOnly() || this.disabled()) return;
    this.isOpen.set(true);
  }

  protected toggleCalendar(event: Event): void {
    event.stopPropagation();
    if (this.readOnly() || this.disabled()) return;
    this.isOpen.set(!this.isOpen());
  }

  /**
   * Handle typed-input from the "from" slot. Parses, validates, and updates
   * staged state; if a "to" already exists and the new "from" is after it,
   * swap to keep [start, end] order. In immediate mode a complete range is
   * committed immediately; in manual mode the range remains staged until
   * Confirm (matches React).
   */
  protected onTriggerFromChange({
    isoValue,
  }: {
    isoValue: string;
    rawDigits: string;
  }): void {
    if (!isoValue) return;
    const c = this.config;
    const parsed = c.parseFormattedValue(
      isoValue,
      this.resolvedFormat(),
      c.locale,
    );
    if (!parsed) return;
    const validate = this.validateFn();
    if (validate && !validate(isoValue)) return;
    const [, currentTo] = this.effectiveRange();
    const [nextFrom, nextTo]: [DateType, DateType | undefined] =
      currentTo && c.isBefore(currentTo, parsed)
        ? [currentTo, parsed]
        : [parsed, currentTo];
    this.applyTypedRange(nextFrom, nextTo);
  }

  /** Handle typed-input from the "to" slot. See `onTriggerFromChange`. */
  protected onTriggerToChange({
    isoValue,
  }: {
    isoValue: string;
    rawDigits: string;
  }): void {
    if (!isoValue) return;
    const c = this.config;
    const parsed = c.parseFormattedValue(
      isoValue,
      this.resolvedFormat(),
      c.locale,
    );
    if (!parsed) return;
    const validate = this.validateFn();
    if (validate && !validate(isoValue)) return;
    const [currentFrom] = this.effectiveRange();
    const [nextFrom, nextTo]: [DateType | undefined, DateType] =
      currentFrom && c.isBefore(parsed, currentFrom)
        ? [parsed, currentFrom]
        : [currentFrom, parsed];
    this.applyTypedRange(nextFrom, nextTo);
  }

  /**
   * Shared commit/stage routing for typed input on both from/to slots.
   * Immediate mode commits a complete range or stages a partial one;
   * manual mode always stages until Confirm.
   */
  private applyTypedRange(
    nextFrom: DateType | undefined,
    nextTo: DateType | undefined,
  ): void {
    if (this.confirmMode() === 'immediate') {
      if (nextFrom && nextTo) {
        this.commitRange(nextFrom, nextTo);
        this.stagedValue.set(undefined);
      } else {
        this.stagedValue.set([nextFrom, nextTo]);
      }
    } else {
      this.stagedValue.set([nextFrom, nextTo]);
    }
  }

  protected onRangeChanged([start, end]: [
    DateType,
    DateType | undefined,
  ]): void {
    if (end === undefined) {
      // First click — stage [start, undefined] so the "from" input
      // immediately reflects the selection-in-progress, matching React's
      // `internalFrom + isSelecting` behaviour.
      this.stagedValue.set([start, undefined]);

      // React: "開始新的選取，則先清除值" — when starting a new selection
      // over a previously complete range, immediate mode clears the external
      // value. Manual mode preserves committed so Cancel can restore it.
      if (this.confirmMode() === 'immediate') {
        const committed = this.committedValue();
        if (committed?.[0] && committed?.[1]) {
          const empty: RangePickerValue = [
            undefined,
            undefined,
          ] as unknown as RangePickerValue;
          this.committedValue.set(empty);
          this._onChange?.(empty);
          this.rangeChanged.emit(empty);
        }
      }

      // React: `inputToRef.current?.focus()` — move focus to the "to" input.
      this.triggerComponent()?.focusTo();
      return;
    }

    // Second click — full range picked
    if (this.confirmMode() === 'immediate') {
      this.commitRange(start, end);
      this.stagedValue.set(undefined);
    } else {
      // In manual mode, stage the selection — do NOT touch committedValue
      // until the user presses Confirm.
      this.stagedValue.set([start, end]);
    }
  }

  protected onConfirm(): void {
    const staged = this.stagedValue();
    if (staged?.[0] && staged?.[1]) {
      this.commitRange(staged[0], staged[1]);
    }
    this.stagedValue.set(undefined);
  }

  protected onCancel(): void {
    this.stagedValue.set(undefined);
    this.rangeCalendarRef()?.resetPickingState();
    this.isOpen.set(false);
  }

  protected onMouseLeave(): void {
    // Mouse left the calendar panel — hover state is managed internally by MznRangeCalendar.
  }

  protected onClear(): void {
    const empty: RangePickerValue = [
      undefined,
      undefined,
    ] as unknown as RangePickerValue;
    this.committedValue.set(empty);
    this.stagedValue.set(undefined);
    this._onChange?.(empty);
    this.rangeChanged.emit(empty);
    this._onTouched?.();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }

  private commitRange(start: DateType, end: DateType): void {
    const range: RangePickerValue = [start, end];
    this.committedValue.set(range);
    this._onChange?.(range);
    this.rangeChanged.emit(range);
    this.isOpen.set(false);
    this._onTouched?.();
  }
}
