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
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import { ClockIcon } from '@mezzanine-ui/icons';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznPickerTrigger } from '@mezzanine-ui/ng/picker';
import { MznTimePickerPanel } from './time-picker-panel.component';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 時間選擇器元件，點擊輸入框開啟時間面板。
 *
 * 採用兩階段提交：面板中的變更為 pending，
 * 點擊「Ok」提交，「Cancel」放棄。
 *
 * @example
 * ```html
 * import { MznTimePicker } from '@mezzanine-ui/ng/time-picker';
 *
 * <div mznTimePicker
 *   [(ngModel)]="selectedTime"
 *   placeholder="Select time"
 * ></div>
 * ```
 *
 * @see {@link MznTimePanel} 時間面板元件
 */
@Component({
  selector: '[mznTimePicker]',
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
    '[attr.size]': 'null',
    '[attr.format]': 'null',
    '[attr.required]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  imports: [MznIcon, MznPickerTrigger, MznTimePickerPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideValueAccessor(MznTimePicker)],
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
      [size]="size()"
      [validate]="validateFn"
      (inputFocused)="openPanel()"
      (cleared)="onClear()"
      (inputKeydown)="onKeydown($event)"
      (valueChanged)="onTriggerValueChange($event)"
    >
      <i mznIcon suffix [icon]="clockIcon" (click)="togglePanel($event)"></i>
    </div>
    <div
      mznTimePickerPanel
      [anchor]="triggerElement()"
      [open]="isOpen()"
      [value]="pendingValue()"
      [hideHour]="hideHour()"
      [hideMinute]="hideMinute()"
      [hideSecond]="hideSecond()"
      [hourStep]="hourStep()"
      [minuteStep]="minuteStep()"
      [secondStep]="secondStep()"
      (timeChanged)="onPanelChange($event)"
      (confirmed)="onConfirm()"
      (cancelled)="onCancel()"
    ></div>
  `,
})
export class MznTimePicker implements ControlValueAccessor {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 佔位文字。 */
  readonly placeholder = input('');
  /** 是否禁用。 */
  readonly disabled = input(false);
  /** 是否唯讀。 */
  readonly readOnly = input(false);
  /** 是否可清除。 */
  readonly clearable = input(true);
  /** 是否有錯誤。 */
  readonly error = input(false);
  /** 是否全寬。 */
  readonly fullWidth = input(false);
  /** 是否隱藏小時。 */
  readonly hideHour = input(false);
  /** 是否隱藏分鐘。 */
  readonly hideMinute = input(false);
  /** 是否隱藏秒鐘。 */
  readonly hideSecond = input(false);
  /** 小時步長。 */
  readonly hourStep = input(1);
  /** 分鐘步長。 */
  readonly minuteStep = input(1);
  /** 秒鐘步長。 */
  readonly secondStep = input(1);
  /** 輸入框尺寸。 */
  readonly size = input<TextFieldSize>('main');
  /** 顯示格式。 */
  readonly format = input<string | undefined>(undefined);
  /**
   * 是否為必填欄位。
   * @default false
   */
  readonly required = input(false);
  /** 外部值（受控模式）。 */
  readonly value = input<DateType | undefined>(undefined);

  /** 時間變更事件。 */
  readonly timeChanged = output<DateType | undefined>();
  /** 面板開關事件。 */
  readonly panelToggled = output<boolean>();

  protected readonly clockIcon = ClockIcon;

  private readonly triggerRef = viewChild<MznPickerTrigger, ElementRef>(
    'triggerEl',
    { read: ElementRef },
  );

  protected readonly triggerElement = computed(() => this.triggerRef());

  readonly isOpen = signal(false);
  readonly internalValue = signal<DateType | undefined>(undefined);
  readonly pendingValue = signal<DateType | undefined>(undefined);

  protected readonly resolvedFormat = computed(() => {
    if (this.format()) return this.format()!;
    return this.hideSecond() ? 'HH:mm' : this.config.defaultTimeFormat;
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

  private onChange: ((value: DateType | undefined) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor() {
    effect(() => {
      const v = this.value();
      if (v !== undefined) {
        this.internalValue.set(v);
      }
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
    const init = this.internalValue() ?? this.computeCurrentTime();
    this.pendingValue.set(init);
    this.isOpen.set(true);
    this.panelToggled.emit(true);
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
   * Validate predicate for typed time input.
   * Pass-through: any string that parses to a valid time is accepted.
   */
  protected readonly validateFn = (isoTime: string): boolean => {
    const c = this.config;
    return !!c.parseFormattedValue(isoTime, this.resolvedFormat(), c.locale);
  };

  /**
   * Handle typed time string from MznPickerTrigger.
   * Parses against resolvedFormat (HH:mm:ss / HH:mm) and commits.
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
    this.internalValue.set(parsed);
    this.onChange?.(parsed);
    this.timeChanged.emit(parsed);
    this.onTouched?.();
  }

  protected onPanelChange(val: DateType): void {
    this.pendingValue.set(val);
  }

  protected onConfirm(): void {
    const val = this.pendingValue();
    if (val) {
      this.internalValue.set(val);
      this.onChange?.(val);
      this.timeChanged.emit(val);
    }
    this.pendingValue.set(undefined);
    this.isOpen.set(false);
    this.panelToggled.emit(false);
    this.onTouched?.();
  }

  protected onCancel(): void {
    this.pendingValue.set(undefined);
    this.isOpen.set(false);
    this.panelToggled.emit(false);
  }

  protected onClear(): void {
    this.internalValue.set(undefined);
    this.onChange?.(undefined);
    this.timeChanged.emit(undefined);
    this.onTouched?.();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onCancel();
    }
    if (event.key === 'Enter') {
      this.onConfirm();
    }
  }

  private computeCurrentTime(): DateType {
    const c = this.config;
    const now = c.getNow();
    let result = now;

    if (!this.hideHour()) {
      const step = this.hourStep();
      result = c.setHour(
        result,
        Math.min(Math.round(c.getHour(now) / step) * step, 23),
      );
    }
    if (!this.hideMinute()) {
      const step = this.minuteStep();
      result = c.setMinute(
        result,
        Math.min(Math.round(c.getMinute(now) / step) * step, 59),
      );
    }
    if (!this.hideSecond()) {
      const step = this.secondStep();
      result = c.setSecond(
        result,
        Math.min(Math.round(c.getSecond(now) / step) * step, 59),
      );
    }

    return result;
  }
}
