import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DateType } from '@mezzanine-ui/core/calendar';
import { dateTimeRangePickerClasses as classes } from '@mezzanine-ui/core/date-time-range-picker';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import {
  LongTailArrowDownIcon,
  LongTailArrowRightIcon,
} from '@mezzanine-ui/icons';
import { MznDateTimePicker } from '@mezzanine-ui/ng/date-time-picker';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import clsx from 'clsx';

/**
 * 日期時間範圍選擇器元件，組合兩個 `MznDateTimePicker` 以選取起止時間。
 *
 * 鏡像 React `DateTimeRangePicker` 的組合模式：
 * 兩個獨立的 DateTimePicker + 方向箭頭 icon。
 *
 * @example
 * ```html
 * import { MznDateTimeRangePicker } from '@mezzanine-ui/ng/date-time-range-picker';
 *
 * <div mznDateTimeRangePicker
 *   [(ngModel)]="dateTimeRange"
 *   placeholderLeft="Select date"
 *   placeholderRight="Select time"
 * ></div>
 * ```
 *
 * @see {@link MznDateTimePicker} 日期時間選擇器元件
 */
@Component({
  selector: '[mznDateTimeRangePicker]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.clearable]': 'null',
    '[attr.direction]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.formatDate]': 'null',
    '[attr.formatTime]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.hideHour]': 'null',
    '[attr.hideMinute]': 'null',
    '[attr.hideSecond]': 'null',
    '[attr.hourStep]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.minuteStep]': 'null',
    '[attr.placeholderLeft]': 'null',
    '[attr.placeholderRight]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.required]': 'null',
    '[attr.secondStep]': 'null',
    '[attr.size]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  imports: [MznDateTimePicker, MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznDateTimeRangePicker)],
  template: `
    <div
      mznDateTimePicker
      [clearable]="clearable()"
      [disabled]="disabled()"
      [error]="error()"
      [formatDate]="formatDate()"
      [formatTime]="formatTime()"
      [fullWidth]="fullWidth()"
      [hideHour]="hideHour()"
      [hideMinute]="hideMinute()"
      [hideSecond]="hideSecond()"
      [hourStep]="hourStep()"
      [isDateDisabled]="isDateDisabled()"
      [minuteStep]="minuteStep()"
      [placeholderLeft]="placeholderLeft()"
      [placeholderRight]="placeholderRight()"
      [readOnly]="readOnly()"
      [required]="required()"
      [secondStep]="secondStep()"
      [size]="size()"
      [value]="fromValue()"
      (change)="onFromChange($event)"
    ></div>
    <i mznIcon [icon]="arrowIcon()" [class]="arrowClass"></i>
    <div
      mznDateTimePicker
      [clearable]="clearable()"
      [disabled]="disabled()"
      [error]="error()"
      [formatDate]="formatDate()"
      [formatTime]="formatTime()"
      [fullWidth]="fullWidth()"
      [hideHour]="hideHour()"
      [hideMinute]="hideMinute()"
      [hideSecond]="hideSecond()"
      [hourStep]="hourStep()"
      [isDateDisabled]="isDateDisabled()"
      [minuteStep]="minuteStep()"
      [placeholderLeft]="placeholderLeft()"
      [placeholderRight]="placeholderRight()"
      [readOnly]="readOnly()"
      [required]="required()"
      [secondStep]="secondStep()"
      [size]="size()"
      [value]="toValue()"
      (change)="onToChange($event)"
    ></div>
  `,
})
export class MznDateTimeRangePicker implements ControlValueAccessor {
  // ─── Inputs (alphabetical, mirroring React DateTimeRangePickerProps) ───

  readonly clearable = input(true);

  /**
   * 兩個日期時間選擇器的排列方向。
   * @default 'row'
   */
  readonly direction = input<'row' | 'column'>('row');

  readonly disabled = input(false);
  readonly error = input(false);

  /** 日期顯示格式。 */
  readonly formatDate = input<string | undefined>(undefined);

  /** 時間顯示格式。 */
  readonly formatTime = input<string | undefined>(undefined);

  readonly fullWidth = input(false);

  /** 是否隱藏小時。 */
  readonly hideHour = input(false);

  /** 是否隱藏分鐘。 */
  readonly hideMinute = input(false);

  readonly hideSecond = input(false);

  /** 小時步長。 */
  readonly hourStep = input(1);

  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );

  /** 分鐘步長。 */
  readonly minuteStep = input(1);

  /** 日期輸入的佔位文字。 */
  readonly placeholderLeft = input<string | undefined>(undefined);

  /** 時間輸入的佔位文字。 */
  readonly placeholderRight = input<string | undefined>(undefined);

  readonly readOnly = input(false);

  /**
   * 是否為必填欄位。
   * @default false
   */
  readonly required = input(false);

  /** 秒鐘步長。 */
  readonly secondStep = input(1);

  /**
   * 觸發器尺寸。
   * @default 'main'
   */
  readonly size = input<TextFieldSize>('main');

  readonly value = input<RangePickerValue | undefined>(undefined);

  // ─── Outputs ──────────────────────────────────────────────────────────

  readonly rangeChanged = output<RangePickerValue>();

  // ─── Internal state ───────────────────────────────────────────────────

  protected readonly arrowClass = classes.arrow;

  protected readonly arrowIcon = computed(() =>
    this.direction() === 'column'
      ? LongTailArrowDownIcon
      : LongTailArrowRightIcon,
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      this.direction() === 'column' ? classes.column : classes.row,
    ),
  );

  private readonly internalValue = signal<RangePickerValue>([
    undefined,
    undefined,
  ] as unknown as RangePickerValue);

  protected readonly fromValue = computed(
    (): DateType | undefined => this.internalValue()?.[0],
  );

  protected readonly toValue = computed(
    (): DateType | undefined => this.internalValue()?.[1],
  );

  private onChange: ((value: RangePickerValue) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    effect(() => {
      const v = this.value();
      if (v) this.internalValue.set(v);
    });
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────

  writeValue(value: RangePickerValue | undefined): void {
    this.internalValue.set(
      value ?? ([undefined, undefined] as unknown as RangePickerValue),
    );
  }

  registerOnChange(fn: (value: RangePickerValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // ─── Handlers ─────────────────────────────────────────────────────────

  protected onFromChange(newFrom: DateType | undefined): void {
    const range: RangePickerValue = [
      newFrom,
      this.toValue(),
    ] as RangePickerValue;

    this.internalValue.set(range);
    this.onChange?.(range);
    this.rangeChanged.emit(range);
    this.onTouched?.();
  }

  protected onToChange(newTo: DateType | undefined): void {
    const range: RangePickerValue = [
      this.fromValue(),
      newTo,
    ] as RangePickerValue;

    this.internalValue.set(range);
    this.onChange?.(range);
    this.rangeChanged.emit(range);
    this.onTouched?.();
  }
}
