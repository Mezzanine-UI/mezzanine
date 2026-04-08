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
import { DateType } from '@mezzanine-ui/core/calendar';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import { CalendarTimeIcon } from '@mezzanine-ui/icons';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznCalendar } from '@mezzanine-ui/ng/calendar';
import { MznCalendarFooterActions } from '@mezzanine-ui/ng/_internal';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { MznTimePanel } from '@mezzanine-ui/ng/time-panel';
import { MznPickerTrigger } from '@mezzanine-ui/ng/picker';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 日期時間選擇器元件，結合日曆與時間面板。
 *
 * 先選日期，再調整時間，最後按「Ok」提交。
 *
 * @example
 * ```html
 * import { MznDateTimePicker } from '@mezzanine-ui/ng/date-time-picker';
 *
 * <mzn-date-time-picker
 *   [(ngModel)]="selectedDateTime"
 *   placeholder="Select date and time"
 * />
 * ```
 */
@Component({
  selector: 'mzn-date-time-picker',
  standalone: true,
  imports: [
    MznCalendar,
    MznCalendarFooterActions,
    MznIcon,
    MznPopper,
    MznTimePanel,
    MznPickerTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznDateTimePicker)],
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
      [hostClassModifier]="datetimeHostClass"
      [validate]="validateFn()"
      (inputFocused)="openPanel()"
      (cleared)="onClear()"
      (inputKeydown)="onKeydown($event)"
      (valueChanged)="onTriggerValueChange($event)"
    >
      <i
        mznIcon
        suffix
        [clickable]="true"
        [icon]="calendarIcon"
        (click)="togglePanel($event)"
      ></i>
    </mzn-picker-trigger>
    <mzn-popper
      [anchor]="triggerElement()"
      [open]="isOpen()"
      placement="bottom-start"
      [offsetOptions]="{ mainAxis: 4 }"
    >
      <div style="display: flex">
        <mzn-calendar
          [referenceDate]="internalReferenceDate()"
          [value]="pendingValue()"
          mode="day"
          [isDateDisabled]="isDateDisabled()"
          [disabledFooterControl]="true"
          (dateChanged)="onDateSelect($event)"
        />
        <mzn-time-panel
          [value]="pendingValue()"
          [hideHour]="hideHour()"
          [hideMinute]="hideMinute()"
          [hideSecond]="hideSecond()"
          [hourStep]="hourStep()"
          [minuteStep]="minuteStep()"
          [secondStep]="secondStep()"
          (timeChanged)="onTimeChange($event)"
          (confirmed)="onConfirm()"
          (cancelled)="onCancel()"
        />
      </div>
    </mzn-popper>
  `,
})
export class MznDateTimePicker implements ControlValueAccessor {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly readOnly = input(false);
  readonly clearable = input(true);
  readonly error = input(false);
  readonly fullWidth = input(false);
  readonly hideHour = input(false);
  readonly hideMinute = input(false);
  readonly hideSecond = input(false);
  readonly hourStep = input(1);
  readonly minuteStep = input(1);
  readonly secondStep = input(1);
  readonly format = input<string | undefined>(undefined);
  /**
   * 日期部分的顯示格式（左側輸入框）。未設定時使用 config.defaultDateFormat。
   */
  readonly formatDate = input<string | undefined>(undefined);
  /**
   * 時間部分的顯示格式（右側輸入框）。未設定時依 hideSecond 決定格式。
   */
  readonly formatTime = input<string | undefined>(undefined);
  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  /**
   * 參考日期，控制日曆初始顯示的月份。預設為目前時間。
   */
  readonly referenceDate = input<DateType | undefined>(undefined);
  /**
   * 是否為必填欄位。
   * @default false
   */
  readonly required = input(false);
  readonly value = input<DateType | undefined>(undefined);

  readonly dateTimeChanged = output<DateType | undefined>();

  protected readonly calendarIcon = CalendarTimeIcon;
  protected readonly datetimeHostClass = pickerClasses.hostDatetime;

  private readonly triggerRef = viewChild<MznPickerTrigger, ElementRef>(
    'triggerEl',
    { read: ElementRef },
  );
  protected readonly triggerElement = computed(() => this.triggerRef());

  readonly isOpen = signal(false);
  readonly internalValue = signal<DateType | undefined>(undefined);
  readonly pendingValue = signal<DateType | undefined>(undefined);
  readonly internalReferenceDate = signal<DateType>('');

  protected readonly resolvedFormat = computed(() => {
    if (this.format()) return this.format()!;
    const dateFmt = this.formatDate() ?? this.config.defaultDateFormat;
    const timeFmt =
      this.formatTime() ??
      (this.hideSecond() ? 'HH:mm' : this.config.defaultTimeFormat);
    return `${dateFmt} ${timeFmt}`;
  });

  protected readonly displayValue = computed(() => {
    const val = this.internalValue();
    if (!val) return '';
    return this.config.formatToString(
      this.config.locale,
      val,
      this.resolvedFormat(),
    );
  });

  /** Validate predicate for typed combined date+time input. */
  protected readonly validateFn = computed(
    (): ((isoDate: string) => boolean) | undefined => {
      const isDateDis = this.isDateDisabled();
      if (!isDateDis) return undefined;
      return (isoDate: string): boolean => {
        const c = this.config;
        const parsed = c.parseFormattedValue(
          isoDate,
          this.resolvedFormat(),
          c.locale,
        );
        if (!parsed) return false;
        return !isDateDis(parsed);
      };
    },
  );

  private onChange: ((value: DateType | undefined) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    effect(() => {
      const v = this.value();
      if (v !== undefined) this.internalValue.set(v);
    });
    effect(() => {
      const ref = this.referenceDate();
      if (ref) this.internalReferenceDate.set(ref);
    });
    effect(() => {
      const v = this.internalValue();
      if (v) this.internalReferenceDate.set(v);
      else if (!this.referenceDate())
        this.internalReferenceDate.set(this.config.getNow());
    });
  }

  writeValue(value: DateType | undefined): void {
    this.internalValue.set(value ?? undefined);
  }

  registerOnChange(fn: (value: DateType | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected openPanel(): void {
    if (this.readOnly() || this.disabled()) return;
    this.pendingValue.set(this.internalValue() ?? this.config.getNow());
    this.isOpen.set(true);
  }

  protected togglePanel(event: Event): void {
    event.stopPropagation();
    if (this.readOnly() || this.disabled()) return;
    if (this.isOpen()) {
      this.onCancel();
    } else {
      this.openPanel();
    }
  }

  /**
   * Handle typed combined date+time string from MznPickerTrigger.
   * Parses according to resolvedFormat (e.g. "YYYY-MM-DD HH:mm:ss")
   * and commits if valid and not date-disabled.
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
    this.dateTimeChanged.emit(parsed);
    this.onTouched?.();
  }

  protected onDateSelect(date: DateType): void {
    const c = this.config;
    const current = this.pendingValue() ?? c.getNow();
    // Keep time from current, replace date
    const merged = c.setDate(
      c.setMonth(c.setYear(current, c.getYear(date)), c.getMonth(date)),
      c.getDate(date),
    );
    this.pendingValue.set(merged);
    this.internalReferenceDate.set(merged);
  }

  protected onTimeChange(time: DateType): void {
    this.pendingValue.set(time);
  }

  protected onConfirm(): void {
    const val = this.pendingValue();
    this.internalValue.set(val);
    this.onChange?.(val);
    this.dateTimeChanged.emit(val);
    this.pendingValue.set(undefined);
    this.isOpen.set(false);
    this.onTouched?.();
  }

  protected onCancel(): void {
    this.pendingValue.set(undefined);
    this.isOpen.set(false);
  }

  protected onClear(): void {
    this.internalValue.set(undefined);
    this.onChange?.(undefined);
    this.dateTimeChanged.emit(undefined);
    this.onTouched?.();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.onCancel();
    if (event.key === 'Enter') this.onConfirm();
  }
}
