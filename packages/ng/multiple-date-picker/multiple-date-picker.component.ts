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
import { CalendarIcon } from '@mezzanine-ui/icons';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznCalendar } from '@mezzanine-ui/ng/calendar';
import { MznCalendarFooterActions } from '@mezzanine-ui/ng/_internal';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import {
  MznMultipleDatePickerTrigger,
  DateValue,
} from './multiple-date-picker-trigger.component';

/**
 * 多日期選擇器元件，允許選取多個日期。
 *
 * 觸發器以可關閉標籤的形式呈現已選日期（由 `MznMultipleDatePickerTrigger` 處理），
 * 支援 `'counter'` 與 `'wrap'` 兩種溢出策略。
 * 面板底部顯示 Confirm / Cancel 操作按鈕；按下 Confirm 才會正式提交選取結果。
 *
 * @example
 * ```html
 * import { MznMultipleDatePicker } from '@mezzanine-ui/ng/multiple-date-picker';
 *
 * <div mznMultipleDatePicker
 *   [(ngModel)]="selectedDates"
 *   placeholder="Select dates"
 * ></div>
 * ```
 *
 * @see MznMultipleDatePickerTrigger
 */
@Component({
  selector: '[mznMultipleDatePicker]',
  host: {
    '[attr.active]': 'null',
    '[attr.clearable]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.format]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.maxSelections]': 'null',
    '[attr.mode]': 'null',
    '[attr.overflowStrategy]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.referenceDate]': 'null',
    '[attr.required]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  imports: [
    MznCalendar,
    MznCalendarFooterActions,
    MznIcon,
    MznPopper,
    MznMultipleDatePickerTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznMultipleDatePicker)],
  template: `
    <div
      mznMultipleDatePickerTrigger
      #triggerEl
      [active]="isOpen()"
      [clearable]="clearable()"
      [disabled]="disabled()"
      [error]="error()"
      [fullWidth]="fullWidth()"
      [overflowStrategy]="overflowStrategy()"
      [placeholder]="placeholder()"
      [readOnly]="readOnly()"
      [required]="required()"
      [value]="pendingDateValues()"
      (cleared)="onClear()"
      (focused)="openCalendar()"
      (tagClosed)="onTagClose($event)"
    >
      <i
        mznIcon
        suffix
        [clickable]="true"
        [icon]="calendarIcon"
        (click)="toggleCalendar($event)"
      ></i>
    </div>
    <div
      mznPopper
      [anchor]="triggerElement()"
      [open]="isOpen()"
      placement="bottom-start"
      [offsetOptions]="{ mainAxis: 4 }"
    >
      <div
        mznCalendar
        [referenceDate]="internalReferenceDate()"
        [value]="pendingValue()"
        [mode]="mode()"
        [isDateDisabled]="resolvedIsDateDisabled()"
        (dateChanged)="onCalendarChange($event)"
      ></div>
      <div
        mznCalendarFooterActions
        [confirmDisabled]="pendingValue().length === 0"
        (confirmed)="onConfirm()"
        (cancelled)="onCancel()"
      ></div>
    </div>
  `,
})
export class MznMultipleDatePicker implements ControlValueAccessor {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  // ---------------------------------------------------------------------------
  // Inputs (alphabetical)
  // ---------------------------------------------------------------------------

  /**
   * 觸發器是否呈現 active（開啟）樣式。
   * 通常由 isOpen 內部狀態控制，此 input 允許外部覆寫顯示狀態。
   * @default false
   */
  readonly active = input(false);

  /** 是否可清除。 @default true */
  readonly clearable = input(true);

  /** 是否停用。 @default false */
  readonly disabled = input(false);

  /** 是否為錯誤狀態。 @default false */
  readonly error = input(false);

  /** 日曆格式字串。未設定時使用 mode 的預設格式。 */
  readonly format = input<string | undefined>(undefined);

  /** 是否全寬。 @default false */
  readonly fullWidth = input(false);

  /** 判斷特定日期是否禁用的函式。 */
  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 最多可選取日期數量。超過後未選取日期將被禁用。 */
  readonly maxSelections = input<number | undefined>(undefined);

  /** 日曆模式。 @default 'day' */
  readonly mode = input<CalendarMode>('day');

  /**
   * 標籤溢出時的顯示策略。
   * - `'counter'`：顯示 +N 數字
   * - `'wrap'`：換行顯示
   * @default 'counter'
   */
  readonly overflowStrategy = input<'counter' | 'wrap'>('counter');

  /** 佔位文字。 @default '' */
  readonly placeholder = input('');

  /** 是否唯讀。 @default false */
  readonly readOnly = input(false);

  /** 日曆的初始參考日期。未設定時預設為當前時間。 */
  readonly referenceDate = input<DateType | undefined>(undefined);

  /** 是否為必填欄位。 @default false */
  readonly required = input(false);

  /** 外部控制的日期值（非 CVA 模式時使用）。 */
  readonly value = input<ReadonlyArray<DateType> | undefined>(undefined);

  // ---------------------------------------------------------------------------
  // Outputs
  // ---------------------------------------------------------------------------

  /** 已選取日期變更事件（按下 Confirm 後觸發）。 */
  readonly datesChanged = output<ReadonlyArray<DateType>>();

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------

  protected readonly calendarIcon = CalendarIcon;

  private readonly triggerRef = viewChild<
    MznMultipleDatePickerTrigger,
    ElementRef
  >('triggerEl', { read: ElementRef });
  protected readonly triggerElement = computed(() => this.triggerRef());

  readonly isOpen = signal(false);

  /**
   * 已提交（confirmed）的日期值，作為 CVA 的真實值。
   */
  readonly committedValue = signal<ReadonlyArray<DateType>>([]);

  /**
   * 面板開啟期間的暫存選取值。按下 Confirm 才同步至 committedValue。
   */
  readonly pendingValue = signal<ReadonlyArray<DateType>>([]);

  readonly internalReferenceDate = signal<DateType>('');

  private readonly resolvedFormat = computed(
    () => this.format() ?? getDefaultModeFormat(this.mode()),
  );

  /** 將 pendingValue 轉換為 DateValue[] 供觸發器顯示標籤。 */
  protected readonly pendingDateValues = computed(
    (): ReadonlyArray<DateValue> => {
      const c = this.config;
      const fmt = this.resolvedFormat();

      return this.pendingValue().map((date) => ({
        id: date,
        name: c.formatToString(c.locale, date, fmt),
        date,
      }));
    },
  );

  /** 當 maxSelections 已達上限時，禁用尚未選取的日期。 */
  protected readonly resolvedIsDateDisabled = computed(
    (): ((date: DateType) => boolean) | undefined => {
      const externalFn = this.isDateDisabled();
      const maxSel = this.maxSelections();

      if (maxSel === undefined) return externalFn;

      return (date: DateType): boolean => {
        if (externalFn?.(date)) return true;
        const c = this.config;
        const current = this.pendingValue();
        const alreadySelected = current.some((d) => c.isSameDate(d, date));

        return !alreadySelected && current.length >= maxSel;
      };
    },
  );

  // ---------------------------------------------------------------------------
  // CVA
  // ---------------------------------------------------------------------------

  private onChange: ((value: ReadonlyArray<DateType>) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    // Sync external value input to committedValue
    effect(() => {
      const v = this.value();
      if (v) {
        this.committedValue.set(v);
        this.pendingValue.set(v);
      }
    });

    // Sync external referenceDate input when provided
    effect(() => {
      const ref = this.referenceDate();
      if (ref) this.internalReferenceDate.set(ref);
    });

    // Derive referenceDate from committed value when no explicit prop given
    effect(() => {
      const ref = this.committedValue();
      if (ref.length > 0) {
        this.internalReferenceDate.set(ref[ref.length - 1]);
      } else if (!this.referenceDate()) {
        this.internalReferenceDate.set(this.config.getNow());
      }
    });
  }

  writeValue(value: ReadonlyArray<DateType> | undefined): void {
    const v = value ?? [];
    this.committedValue.set(v);
    this.pendingValue.set(v);
  }

  registerOnChange(fn: (value: ReadonlyArray<DateType>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  protected openCalendar(): void {
    if (this.readOnly() || this.disabled()) return;
    // Reset pending to current committed value when opening
    this.pendingValue.set([...this.committedValue()]);
    this.isOpen.set(true);
  }

  protected toggleCalendar(event: Event): void {
    event.stopPropagation();
    if (this.readOnly() || this.disabled()) return;
    if (this.isOpen()) {
      this.onCancel();
    } else {
      this.openCalendar();
    }
  }

  protected onCalendarChange(date: DateType): void {
    const c = this.config;
    const current = [...this.pendingValue()];
    const existIdx = current.findIndex((d) => c.isSameDate(d, date));
    const maxSelections = this.maxSelections();

    // If max reached and date is not already selected, do not add
    if (
      existIdx < 0 &&
      maxSelections !== undefined &&
      current.length >= maxSelections
    ) {
      return;
    }

    const next =
      existIdx >= 0
        ? [...current.slice(0, existIdx), ...current.slice(existIdx + 1)]
        : [...current, date];

    this.pendingValue.set(next);
  }

  protected onTagClose(date: DateType): void {
    const c = this.config;
    const next = this.pendingValue().filter((d) => !c.isSameDate(d, date));
    this.pendingValue.set(next);
  }

  protected onConfirm(): void {
    const confirmed = [...this.pendingValue()];
    this.committedValue.set(confirmed);
    this.onChange?.(confirmed);
    this.datesChanged.emit(confirmed);
    this.onTouched?.();
    this.isOpen.set(false);
  }

  protected onCancel(): void {
    // Revert pending to committed
    this.pendingValue.set([...this.committedValue()]);
    this.isOpen.set(false);
  }

  protected onClear(): void {
    this.committedValue.set([]);
    this.pendingValue.set([]);
    this.onChange?.([]);
    this.datesChanged.emit([]);
    this.onTouched?.();
  }
}
