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
   * Manual confirm mode 下的暫存選取值。
   * 只有按 Confirm 才會 promote 到 committedValue；
   * Cancel / click-away 會清掉，還原到 committedValue。
   */
  private readonly stagedValue = signal<RangePickerValue | undefined>(
    undefined,
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
   */
  protected readonly inputFromValue = computed((): string | undefined => {
    const val = this.committedValue();
    if (!val?.[0]) return undefined;
    const c = this.config;
    return (
      c.formatToString(c.locale, val[0], this.resolvedFormat()) ?? undefined
    );
  });

  /**
   * 結束日期的格式化字串，供 to 輸入框顯示。
   */
  protected readonly inputToValue = computed((): string | undefined => {
    const val = this.committedValue();
    if (!val?.[1]) return undefined;
    const c = this.config;
    return (
      c.formatToString(c.locale, val[1], this.resolvedFormat()) ?? undefined
    );
  });

  /**
   * 傳入 MznDateRangePickerCalendar 的 value。
   * Manual mode 下優先顯示暫存的 stagedValue，未 staged 時 fallback 到 committed。
   */
  protected readonly calendarDisplayValue = computed(
    (): ReadonlyArray<DateType> => {
      const staged = this.stagedValue();
      if (staged && staged[0] && staged[1]) return [staged[0], staged[1]];
      const val = this.committedValue();
      if (!val || !val[0] || !val[1]) return [];
      return [val[0], val[1]];
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
   * Handle typed-input from the "from" slot. Parses, validates, and stages
   * into committedValue[0]; if a "to" already exists and the new "from" is
   * after it, swap to keep [start, end] order.
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
    const current = this.committedValue();
    const to = current?.[1];
    const next: RangePickerValue =
      to && c.isBefore(to, parsed)
        ? ([to, parsed] as RangePickerValue)
        : ([parsed, to] as unknown as RangePickerValue);
    this.committedValue.set(next);
    if (next[0] && next[1]) {
      this._onChange?.(next);
      this.rangeChanged.emit(next);
      this._onTouched?.();
    }
  }

  /** Handle typed-input from the "to" slot. */
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
    const current = this.committedValue();
    const from = current?.[0];
    const next: RangePickerValue =
      from && c.isBefore(parsed, from)
        ? ([parsed, from] as RangePickerValue)
        : ([from, parsed] as unknown as RangePickerValue);
    this.committedValue.set(next);
    if (next[0] && next[1]) {
      this._onChange?.(next);
      this.rangeChanged.emit(next);
      this._onTouched?.();
    }
  }

  protected onRangeChanged([start, end]: [
    DateType,
    DateType | undefined,
  ]): void {
    if (end === undefined) {
      // First click — do not commit yet; picking state tracked in MznRangeCalendar
      return;
    }

    // Second click — commit range
    if (this.confirmMode() === 'immediate') {
      this.commitRange(start, end);
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
