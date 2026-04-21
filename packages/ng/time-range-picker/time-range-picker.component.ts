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
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import { ClockIcon } from '@mezzanine-ui/icons';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { MznTimePanel } from '@mezzanine-ui/ng/time-panel';
import { MznRangePickerTrigger } from '@mezzanine-ui/ng/picker';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 時間範圍選擇器元件，以雙時間面板選取時間區間。
 *
 * 使用 `MznRangePickerTrigger` 提供雙輸入框 + 箭頭分隔，
 * 對齊 React 的 `TimeRangePicker` 渲染結構。
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
    '[attr.size]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  imports: [MznIcon, MznPopper, MznTimePanel, MznRangePickerTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznTimeRangePicker)],
  template: `
    <div
      mznRangePickerTrigger
      #triggerEl
      [format]="resolvedFormat()"
      [inputFromValue]="displayFromValue()"
      [inputToValue]="displayToValue()"
      [inputFromPlaceholder]="placeholder() || 'HH:mm:ss'"
      [inputToPlaceholder]="placeholder() || 'HH:mm:ss'"
      [disabled]="disabled()"
      [readOnly]="readOnly()"
      [clearable]="clearable()"
      [error]="error()"
      [fullWidth]="fullWidth()"
      [size]="size()"
      (fromFocused)="openPanel('from')"
      (toFocused)="openPanel('to')"
      (cleared)="onClear()"
      (inputFromChanged)="onFromInputChange($event)"
      (inputToChanged)="onToInputChange($event)"
      (iconClick)="togglePanel($event)"
    >
      <i
        mznIcon
        suffix
        [clickable]="true"
        [icon]="clockIcon"
        (click)="togglePanel($event)"
      ></i>
    </div>
    @if (focusedInput()) {
      <div
        mznPopper
        [anchor]="triggerElement()"
        [open]="true"
        placement="bottom-start"
        [offsetOptions]="{ mainAxis: 4 }"
        style="z-index: var(--mzn-z-index-popover)"
      >
        <div
          mznTimePanel
          [value]="focusedInput() === 'from' ? pendingStart() : pendingEnd()"
          [hideHour]="hideHour()"
          [hideMinute]="hideMinute()"
          [hideSecond]="hideSecond()"
          [hourStep]="hourStep()"
          [minuteStep]="minuteStep()"
          [secondStep]="secondStep()"
          (timeChanged)="onPanelTimeChange($event)"
          (confirmed)="onConfirm()"
          (cancelled)="onCancel()"
        ></div>
      </div>
    }
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
  readonly required = input(false);
  readonly size = input<TextFieldSize>('main');
  readonly value = input<RangePickerValue | undefined>(undefined);

  readonly panelToggled = output<boolean>();
  readonly rangeChanged = output<RangePickerValue>();

  protected readonly clockIcon = ClockIcon;

  private readonly triggerRef = viewChild<MznRangePickerTrigger, ElementRef>(
    'triggerEl',
    { read: ElementRef },
  );
  protected readonly triggerElement = computed(() => this.triggerRef());

  readonly focusedInput = signal<'from' | 'to' | null>(null);
  private readonly committedFrom = signal<DateType | undefined>(undefined);
  private readonly committedTo = signal<DateType | undefined>(undefined);
  readonly pendingStart = signal<DateType | undefined>(undefined);
  readonly pendingEnd = signal<DateType | undefined>(undefined);

  protected readonly resolvedFormat = computed((): string => {
    if (this.format()) return this.format()!;

    return this.hideSecond() ? 'HH:mm' : this.config.defaultTimeFormat;
  });

  protected readonly displayFromValue = computed((): string | undefined => {
    const from = this.committedFrom();

    if (!from) return undefined;

    const c = this.config;

    return c.formatToString(c.locale, from, this.resolvedFormat());
  });

  protected readonly displayToValue = computed((): string | undefined => {
    const to = this.committedTo();

    if (!to) return undefined;

    const c = this.config;

    return c.formatToString(c.locale, to, this.resolvedFormat());
  });

  private onChange: ((value: RangePickerValue) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    effect(() => {
      const v = this.value();

      if (v) {
        this.committedFrom.set(v[0]);
        this.committedTo.set(v[1]);
      }
    });
  }

  writeValue(value: RangePickerValue | undefined): void {
    this.committedFrom.set(value?.[0]);
    this.committedTo.set(value?.[1]);
  }

  registerOnChange(fn: (value: RangePickerValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private emitIfComplete(): void {
    const from = this.committedFrom();
    const to = this.committedTo();

    if (from && to) {
      const range: RangePickerValue = [from, to];

      this.onChange?.(range);
      this.rangeChanged.emit(range);
    }
  }

  protected openPanel(side: 'from' | 'to'): void {
    if (this.readOnly() || this.disabled()) return;

    const c = this.config;

    if (side === 'from') {
      this.pendingStart.set(this.committedFrom() ?? c.getNow());
    } else {
      this.pendingEnd.set(this.committedTo() ?? c.getNow());
    }

    this.focusedInput.set(side);
    this.panelToggled.emit(true);
  }

  protected togglePanel(event: Event): void {
    event.stopPropagation();

    if (this.readOnly() || this.disabled()) return;
    if (this.focusedInput()) this.onCancel();
    else this.openPanel('from');
  }

  protected onPanelTimeChange(time: DateType): void {
    if (this.focusedInput() === 'from') {
      this.pendingStart.set(time);
    } else {
      this.pendingEnd.set(time);
    }
  }

  protected onFromInputChange({
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

    this.committedFrom.set(parsed);
    this.emitIfComplete();
    this.onTouched?.();
  }

  protected onToInputChange({
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

    this.committedTo.set(parsed);
    this.emitIfComplete();
    this.onTouched?.();
  }

  protected onConfirm(): void {
    const side = this.focusedInput();

    if (side === 'from') {
      const s = this.pendingStart();

      if (s) this.committedFrom.set(s);
    } else {
      const e = this.pendingEnd();

      if (e) this.committedTo.set(e);
    }

    this.emitIfComplete();
    this.focusedInput.set(null);
    this.panelToggled.emit(false);
    this.onTouched?.();
  }

  protected onCancel(): void {
    this.pendingStart.set(undefined);
    this.pendingEnd.set(undefined);
    this.focusedInput.set(null);
    this.panelToggled.emit(false);
  }

  protected onClear(): void {
    this.committedFrom.set(undefined);
    this.committedTo.set(undefined);

    const empty: RangePickerValue = [
      undefined,
      undefined,
    ] as unknown as RangePickerValue;

    this.onChange?.(empty);
    this.rangeChanged.emit(empty);
    this.onTouched?.();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.onCancel();
  }
}
