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
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { ClockIcon } from '@mezzanine-ui/icons';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznCalendarFooterActions } from '@mezzanine-ui/ng/_internal';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { MznTimePanel } from '@mezzanine-ui/ng/time-panel';
import { MznPickerTrigger } from '@mezzanine-ui/ng/picker';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 時間範圍選擇器元件，以雙時間面板選取時間區間。
 *
 * @example
 * ```html
 * import { MznTimeRangePicker } from '@mezzanine-ui/ng/time-range-picker';
 *
 * <div mznTimeRangePicker
 *   [(ngModel)]="timeRange"
 *   placeholder="Select time range"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznTimeRangePicker]',
  host: {
    '[attr.placeholder]': 'null',
    '[attr.disabled]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.clearable]': 'null',
    '[attr.error]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.hideHour]': 'null',
    '[attr.hideMinute]': 'null',
    '[attr.hideSecond]': 'null',
    '[attr.hourStep]': 'null',
    '[attr.minuteStep]': 'null',
    '[attr.secondStep]': 'null',
    '[attr.format]': 'null',
    '[attr.required]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  imports: [
    MznCalendarFooterActions,
    MznIcon,
    MznPopper,
    MznTimePanel,
    MznPickerTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznTimeRangePicker)],
  template: `
    <div
      mznPickerTrigger
      #triggerEl
      [format]="resolvedFormat()"
      [value]="displayValue()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readOnly]="readOnly()"
      [clearable]="clearable()"
      [error]="error()"
      [fullWidth]="fullWidth()"
      [validate]="validateFn"
      (inputFocused)="openPanel()"
      (cleared)="onClear()"
      (inputKeydown)="onKeydown($event)"
      (valueChanged)="onTriggerValueChange($event)"
    >
      <i
        mznIcon
        suffix
        [clickable]="true"
        [icon]="clockIcon"
        (click)="togglePanel($event)"
      ></i>
    </div>
    <div
      mznPopper
      [anchor]="triggerElement()"
      [open]="isOpen()"
      placement="bottom-start"
      [offsetOptions]="{ mainAxis: 4 }"
    >
      <div style="display: flex">
        <div
          mznTimePanel
          [value]="pendingStart()"
          [hideHour]="hideHour()"
          [hideMinute]="hideMinute()"
          [hideSecond]="hideSecond()"
          [hourStep]="hourStep()"
          [minuteStep]="minuteStep()"
          [secondStep]="secondStep()"
          (timeChanged)="onStartChange($event)"
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
          (timeChanged)="onEndChange($event)"
          (confirmed)="onConfirm()"
          (cancelled)="onCancel()"
        ></div>
      </div>
    </div>
  `,
})
export class MznTimeRangePicker implements ControlValueAccessor {
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
   * 是否為必填欄位。
   * @default false
   */
  readonly required = input(false);
  readonly value = input<RangePickerValue | undefined>(undefined);

  /** 面板開關事件。 */
  readonly panelToggled = output<boolean>();
  readonly rangeChanged = output<RangePickerValue>();

  protected readonly clockIcon = ClockIcon;

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

  protected readonly resolvedFormat = computed(() => {
    if (this.format()) return this.format()!;
    return this.hideSecond() ? 'HH:mm' : this.config.defaultTimeFormat;
  });

  protected readonly displayValue = computed(() => {
    const val = this.committedValue();
    if (!val?.[0] || !val?.[1]) return '';
    const c = this.config;
    const fmt = this.resolvedFormat();
    return `${c.formatToString(c.locale, val[0], fmt)} ~ ${c.formatToString(c.locale, val[1], fmt)}`;
  });

  private onChange: ((value: RangePickerValue) => void) | null = null;
  private onTouched: (() => void) | null = null;

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
    this.isOpen.set(true);
    this.panelToggled.emit(true);
  }

  protected togglePanel(event: Event): void {
    event.stopPropagation();
    if (this.readOnly() || this.disabled()) return;
    if (this.isOpen()) this.onCancel();
    else this.openPanel();
  }

  /** Validate predicate for typed combined "start ~ end" time input. */
  protected readonly validateFn = (combined: string): boolean => {
    const c = this.config;
    const fmt = this.resolvedFormat();
    const parts = combined.split(' ~ ');
    if (parts.length !== 2) return false;
    const s = c.parseFormattedValue(parts[0], fmt, c.locale);
    const e = c.parseFormattedValue(parts[1], fmt, c.locale);
    return !!s && !!e;
  };

  /**
   * Handle typed combined time-range string. Splits on " ~ " and parses
   * each side; commits if both valid. Structural delta — single trigger
   * collapses React's dual-input range trigger.
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
    const s = c.parseFormattedValue(parts[0], fmt, c.locale);
    const e = c.parseFormattedValue(parts[1], fmt, c.locale);
    if (!s || !e) return;
    const range: RangePickerValue = [s, e];
    this.committedValue.set(range);
    this.onChange?.(range);
    this.rangeChanged.emit(range);
    this.onTouched?.();
  }

  protected onStartChange(time: DateType): void {
    this.pendingStart.set(time);
  }

  protected onEndChange(time: DateType): void {
    this.pendingEnd.set(time);
  }

  protected onConfirm(): void {
    const s = this.pendingStart();
    const e = this.pendingEnd();
    if (!s || !e) return;

    const range: RangePickerValue = [s, e];
    this.committedValue.set(range);
    this.onChange?.(range);
    this.rangeChanged.emit(range);
    this.isOpen.set(false);
    this.panelToggled.emit(false);
    this.onTouched?.();
  }

  protected onCancel(): void {
    this.pendingStart.set(undefined);
    this.pendingEnd.set(undefined);
    this.isOpen.set(false);
    this.panelToggled.emit(false);
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
