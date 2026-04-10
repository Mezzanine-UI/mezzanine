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
import { pickerClasses, RangePickerValue } from '@mezzanine-ui/core/picker';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
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
 * 日期時間範圍選擇器元件，結合雙日曆與雙時間面板。
 *
 * @example
 * ```html
 * import { MznDateTimeRangePicker } from '@mezzanine-ui/ng/date-time-range-picker';
 *
 * <div mznDateTimeRangePicker
 *   [(ngModel)]="dateTimeRange"
 *   placeholder="Select date-time range"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznDateTimeRangePicker]',
  host: {
    '[attr.placeholder]': 'null',
    '[attr.clearable]': 'null',
    '[attr.direction]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.format]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.hideHour]': 'null',
    '[attr.hideMinute]': 'null',
    '[attr.hideSecond]': 'null',
    '[attr.hourStep]': 'null',
    '[attr.isDateDisabled]': 'null',
    '[attr.minuteStep]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.required]': 'null',
    '[attr.secondStep]': 'null',
    '[attr.size]': 'null',
    '[attr.value]': 'null',
  },
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
  providers: [provideValueAccessor(MznDateTimeRangePicker)],
  template: `
    <div
      mznPickerTrigger
      #triggerEl
      [clearable]="clearable()"
      [disabled]="disabled()"
      [error]="error()"
      [format]="resolvedFormat()"
      [fullWidth]="fullWidth()"
      [hostClassModifier]="hostClass"
      [placeholder]="placeholder()"
      [readOnly]="readOnly()"
      [size]="size()"
      [validate]="validateFn()"
      [value]="displayValue()"
      (cleared)="onClear()"
      (inputFocused)="openPanel()"
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
    </div>
    <div
      mznPopper
      [anchor]="triggerElement()"
      [open]="isOpen()"
      placement="bottom-start"
      [offsetOptions]="{ mainAxis: 4 }"
      style="z-index: var(--mzn-z-index-popover)"
    >
      <div>
        <div
          [style.display]="'flex'"
          [style.flex-direction]="direction() === 'column' ? 'column' : 'row'"
        >
          <div
            mznCalendar
            [referenceDate]="firstRef()"
            [value]="calendarValue()"
            mode="day"
            [isDateDisabled]="isDateDisabled()"
            [disabledFooterControl]="true"
            (dateChanged)="onCalendarClick($event)"
          ></div>
          <div
            mznCalendar
            [referenceDate]="secondRef()"
            [value]="calendarValue()"
            mode="day"
            [isDateDisabled]="isDateDisabled()"
            [disabledFooterControl]="true"
            (dateChanged)="onCalendarClick($event)"
          ></div>
        </div>
        <div style="display: flex; justify-content: space-around">
          <div
            mznTimePanel
            [value]="pendingStart()"
            [hideHour]="hideHour()"
            [hideMinute]="hideMinute()"
            [hideSecond]="hideSecond()"
            [hourStep]="hourStep()"
            [minuteStep]="minuteStep()"
            [secondStep]="secondStep()"
            (timeChanged)="onStartTimeChange($event)"
            (confirmed)="onConfirm()"
            (cancelled)="onCancel()"
          ></div>
          <div
            mznTimePanel
            [value]="pendingEnd()"
            [hideHour]="hideHour()"
            [hideMinute]="hideMinute()"
            [hideSecond]="hideSecond()"
            [hourStep]="hourStep()"
            [minuteStep]="minuteStep()"
            [secondStep]="secondStep()"
            (timeChanged)="onEndTimeChange($event)"
            (confirmed)="onConfirm()"
            (cancelled)="onCancel()"
          ></div>
        </div>
        <div
          mznCalendarFooterActions
          (confirmed)="onConfirm()"
          (cancelled)="onCancel()"
        ></div>
      </div>
    </div>
  `,
})
export class MznDateTimeRangePicker implements ControlValueAccessor {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  readonly placeholder = input('');
  readonly clearable = input(true);
  /**
   * 兩個日期時間選擇器的排列方向。
   * @default 'row'
   */
  readonly direction = input<'row' | 'column'>('row');
  readonly disabled = input(false);
  readonly error = input(false);
  readonly format = input<string | undefined>(undefined);
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

  readonly rangeChanged = output<RangePickerValue>();

  protected readonly calendarIcon = CalendarTimeIcon;
  protected readonly hostClass = `${pickerClasses.hostRange} ${pickerClasses.hostDatetime}`;

  private readonly triggerRef = viewChild<MznPickerTrigger, ElementRef>(
    'triggerEl',
    { read: ElementRef },
  );
  protected readonly triggerElement = computed(() => this.triggerRef());

  readonly isOpen = signal(false);
  readonly committedValue = signal<RangePickerValue>([
    undefined,
    undefined,
  ] as unknown as RangePickerValue);
  readonly pendingStart = signal<DateType | undefined>(undefined);
  readonly pendingEnd = signal<DateType | undefined>(undefined);
  private readonly pickPhase = signal<0 | 1>(0); // 0 = picking start, 1 = picking end

  readonly firstRef = signal<DateType>('');
  readonly secondRef = signal<DateType>('');

  protected readonly resolvedFormat = computed(() => {
    if (this.format()) return this.format()!;
    const timeFmt = this.hideSecond() ? 'HH:mm' : this.config.defaultTimeFormat;
    return `${this.config.defaultDateFormat} ${timeFmt}`;
  });

  protected readonly displayValue = computed(() => {
    const val = this.committedValue();
    if (!val?.[0] || !val?.[1]) return '';
    const c = this.config;
    const fmt = this.resolvedFormat();
    return `${c.formatToString(c.locale, val[0], fmt)} ~ ${c.formatToString(c.locale, val[1], fmt)}`;
  });

  /**
   * Validate predicate for typed combined range input.
   * Splits "start ~ end" and validates each side against isDateDisabled.
   */
  protected readonly validateFn = computed(
    (): ((isoDate: string) => boolean) | undefined => {
      const isDateDis = this.isDateDisabled();
      if (!isDateDis) return undefined;
      return (combined: string): boolean => {
        const c = this.config;
        const fmt = this.resolvedFormat();
        const parts = combined.split(' ~ ');
        if (parts.length !== 2) return false;
        const start = c.parseFormattedValue(parts[0], fmt, c.locale);
        const end = c.parseFormattedValue(parts[1], fmt, c.locale);
        if (!start || !end) return false;
        return !isDateDis(start) && !isDateDis(end);
      };
    },
  );

  protected readonly calendarValue = computed((): ReadonlyArray<DateType> => {
    const s = this.pendingStart();
    const e = this.pendingEnd();
    if (s && e) return [s, e];
    if (s) return [s];
    return [];
  });

  private onChange: ((value: RangePickerValue) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    effect(() => {
      const v = this.value();
      if (v) this.committedValue.set(v);
    });

    effect(() => {
      const c = this.config;
      const val = this.committedValue();
      const now = c.getNow();
      const ref = val?.[0] ?? now;
      this.firstRef.set(ref);
      this.secondRef.set(c.addMonth(ref, 1));
    });
  }

  writeValue(value: RangePickerValue | undefined): void {
    this.committedValue.set(
      value ?? ([undefined, undefined] as unknown as RangePickerValue),
    );
  }

  registerOnChange(fn: (value: RangePickerValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected openPanel(): void {
    if (this.readOnly() || this.disabled()) return;
    const c = this.config;
    const val = this.committedValue();
    this.pendingStart.set(val?.[0] ?? c.getNow());
    this.pendingEnd.set(val?.[1] ?? c.addHour(c.getNow(), 1));
    this.pickPhase.set(0);
    this.isOpen.set(true);
  }

  protected togglePanel(event: Event): void {
    event.stopPropagation();
    if (this.readOnly() || this.disabled()) return;
    if (this.isOpen()) this.onCancel();
    else this.openPanel();
  }

  /**
   * Handle typed combined "start ~ end" input.
   * Note: structural delta — single trigger collapses React's 4-slot
   * separator into one combined string. Typed editing requires the
   * "YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss" form.
   */
  protected onTriggerValueChange({
    isoValue,
  }: {
    isoValue: string;
    rawDigits: string;
  }): void {
    if (!isoValue) return;
    const c = this.config;
    const fmt = this.resolvedFormat();
    const parts = isoValue.split(' ~ ');
    if (parts.length !== 2) return;
    const start = c.parseFormattedValue(parts[0], fmt, c.locale);
    const end = c.parseFormattedValue(parts[1], fmt, c.locale);
    if (!start || !end) return;
    const validate = this.validateFn();
    if (validate && !validate(isoValue)) return;
    const [lo, hi] = c.isBefore(start, end) ? [start, end] : [end, start];
    const range: RangePickerValue = [lo, hi];
    this.committedValue.set(range);
    this.onChange?.(range);
    this.rangeChanged.emit(range);
    this.onTouched?.();
  }

  protected onCalendarClick(date: DateType): void {
    const c = this.config;
    if (this.pickPhase() === 0) {
      // Set start date, keep time from pendingStart
      const current = this.pendingStart() ?? c.getNow();
      const merged = c.setDate(
        c.setMonth(c.setYear(current, c.getYear(date)), c.getMonth(date)),
        c.getDate(date),
      );
      this.pendingStart.set(merged);
      this.pickPhase.set(1);
    } else {
      // Set end date
      const current = this.pendingEnd() ?? c.getNow();
      const merged = c.setDate(
        c.setMonth(c.setYear(current, c.getYear(date)), c.getMonth(date)),
        c.getDate(date),
      );
      this.pendingEnd.set(merged);
      this.pickPhase.set(0);
    }
  }

  protected onStartTimeChange(time: DateType): void {
    this.pendingStart.set(time);
  }

  protected onEndTimeChange(time: DateType): void {
    this.pendingEnd.set(time);
  }

  protected onConfirm(): void {
    const c = this.config;
    const s = this.pendingStart();
    const e = this.pendingEnd();
    if (!s || !e) return;

    const [lo, hi] = c.isBefore(s, e) ? [s, e] : [e, s];
    const range: RangePickerValue = [lo, hi];
    this.committedValue.set(range);
    this.onChange?.(range);
    this.rangeChanged.emit(range);
    this.isOpen.set(false);
    this.onTouched?.();
  }

  protected onCancel(): void {
    this.pendingStart.set(undefined);
    this.pendingEnd.set(undefined);
    this.isOpen.set(false);
  }

  protected onClear(): void {
    const empty: RangePickerValue = [
      undefined,
      undefined,
    ] as unknown as RangePickerValue;
    this.committedValue.set(empty);
    this.onChange?.(empty);
    this.rangeChanged.emit(empty);
    this.onTouched?.();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.onCancel();
  }
}
