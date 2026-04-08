import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { pickerClasses } from '@mezzanine-ui/core/picker';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import { CalendarIcon } from '@mezzanine-ui/icons';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPickerTrigger } from '@mezzanine-ui/ng/picker';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import { MznDatePickerCalendar } from './date-picker-calendar.component';

/**
 * 日期選擇器元件，點擊輸入框開啟日曆彈出層。
 *
 * 支援 day/week/month/year/quarter/half-year 等模式。
 * 實作 ControlValueAccessor，可搭配 Angular Forms 使用。
 *
 * @example
 * ```html
 * import { MznDatePicker } from '@mezzanine-ui/ng/date-picker';
 *
 * <mzn-date-picker
 *   [(ngModel)]="selectedDate"
 *   mode="day"
 *   placeholder="Select date"
 * />
 * ```
 *
 * @see {@link MznCalendar} 日曆元件
 * @see {@link MznDateRangePicker} 日期範圍選擇器
 */
@Component({
  selector: 'mzn-date-picker',
  standalone: true,
  imports: [MznDatePickerCalendar, MznIcon, MznPickerTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznDatePicker)],
  template: `
    <mzn-picker-trigger
      #triggerEl
      [format]="resolvedFormat()"
      [value]="displayValue()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readOnly]="readOnly()"
      [clearable]="clearable()"
      [error]="error()"
      [fullWidth]="fullWidth()"
      [hostClassModifier]="dateHostClass"
      [size]="size()"
      [validate]="validateFn()"
      (inputFocused)="openCalendar()"
      (cleared)="onClear()"
      (inputKeydown)="onKeydown($event)"
      (valueChanged)="onTriggerValueChange($event)"
    >
      <i
        mznIcon
        suffix
        [icon]="calendarIcon"
        (click)="toggleCalendar($event)"
      ></i>
    </mzn-picker-trigger>
    <mzn-date-picker-calendar
      [anchor]="triggerElement()"
      [open]="isOpen()"
      [mode]="mode()"
      [referenceDate]="internalReferenceDate()"
      [value]="internalValue()"
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
      (dateChanged)="onCalendarChange($event)"
    />
  `,
})
export class MznDatePicker implements ControlValueAccessor {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 是否可清除。 @default true */
  readonly clearable = input(true);

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

  /** 日曆模式。 @default 'day' */
  readonly mode = input<CalendarMode>('day');

  /** 尺寸。 @default 'main' */
  readonly size = input<TextFieldSize>('main');

  /** 佔位文字。 */
  readonly placeholder = input('');

  /** 是否唯讀。 @default false */
  readonly readOnly = input(false);

  /** 參考日期。 */
  readonly referenceDate = input<DateType | undefined>(undefined);

  /** 外部值（受控模式）。 */
  readonly value = input<DateType | undefined>(undefined);

  /** 日期變更事件。 */
  readonly dateChanged = output<DateType | undefined>();
  /** 日曆開關事件。 */
  readonly calendarToggled = output<boolean>();

  protected readonly calendarIcon = CalendarIcon;
  protected readonly dateHostClass = pickerClasses.hostDate;

  private readonly triggerRef = viewChild<MznPickerTrigger, ElementRef>(
    'triggerEl',
    { read: ElementRef },
  );

  protected readonly triggerElement = computed(() => this.triggerRef());

  readonly isOpen = signal(false);
  readonly internalValue = signal<DateType | undefined>(undefined);
  readonly internalReferenceDate = signal<DateType>('');

  protected readonly resolvedFormat = computed(
    () => this.format() ?? getDefaultModeFormat(this.mode()),
  );

  protected readonly formatLength = computed(
    () => this.resolvedFormat().length + 2,
  );

  protected readonly displayValue = computed(() => {
    const val = this.internalValue();
    if (!val) return '';
    return this.config.formatToString(
      this.config.locale,
      val,
      this.resolvedFormat(),
    );
  });

  /**
   * Validate predicate passed to MznPickerTrigger.
   * Combines isDateDisabled / isMonthDisabled / isYearDisabled / isWeekDisabled
   * / isQuarterDisabled / isHalfYearDisabled to reject typed input that
   * resolves to a disabled date.
   */
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

  private onChange: ((value: DateType | undefined) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    // Sync external value to internal
    effect(() => {
      const v = this.value();
      if (v !== undefined) {
        this.internalValue.set(v);
      }
    });

    // Sync internal value to reference date
    effect(() => {
      const v = this.internalValue();
      if (v) {
        this.internalReferenceDate.set(v);
      }
    });

    // Init reference date
    effect(() => {
      const ref = this.referenceDate();
      if (ref) {
        this.internalReferenceDate.set(ref);
      } else if (!this.internalReferenceDate()) {
        this.internalReferenceDate.set(this.config.getNow());
      }
    });
  }

  writeValue(value: DateType | undefined): void {
    this.internalValue.set(value ?? undefined);
    if (value) {
      this.internalReferenceDate.set(value);
    }
  }

  registerOnChange(fn: (value: DateType | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected openCalendar(): void {
    if (this.readOnly() || this.disabled()) return;
    this.isOpen.set(true);
    this.calendarToggled.emit(true);
  }

  protected toggleCalendar(event: Event): void {
    event.stopPropagation();
    if (this.readOnly() || this.disabled()) return;

    const next = !this.isOpen();
    this.isOpen.set(next);
    this.calendarToggled.emit(next);
  }

  /**
   * Handle typed-input changes from MznPickerTrigger.
   * Parses the formatted string and commits if it resolves to a valid,
   * non-disabled date. Mirrors React DatePicker.onInputChange path.
   */
  protected onTriggerValueChange({
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
    this.internalValue.set(parsed);
    this.internalReferenceDate.set(parsed);
    this.onChange?.(parsed);
    this.dateChanged.emit(parsed);
    this.onTouched?.();
  }

  protected onCalendarChange(date: DateType): void {
    this.internalValue.set(date);
    this.onChange?.(date);
    this.dateChanged.emit(date);
    this.isOpen.set(false);
    this.calendarToggled.emit(false);
    this.onTouched?.();
  }

  protected onClear(): void {
    this.internalValue.set(undefined);
    this.onChange?.(undefined);
    this.dateChanged.emit(undefined);
    this.onTouched?.();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen.set(false);
      this.calendarToggled.emit(false);
    }
    if (event.key === 'Enter') {
      this.isOpen.set(false);
      this.calendarToggled.emit(false);
    }
  }
}
