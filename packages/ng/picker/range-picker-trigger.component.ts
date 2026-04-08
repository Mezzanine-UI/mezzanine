import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { TextFieldSize, textFieldClasses } from '@mezzanine-ui/core/text-field';
import {
  CalendarIcon,
  CloseIcon,
  LongTailArrowRightIcon,
} from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import clsx from 'clsx';
import {
  FormattedInputErrorMessages,
  MznFormattedInput,
} from './formatted-input.component';

/**
 * 日期範圍選擇器觸發器元件（內部共用）。
 *
 * 包含兩個獨立的格式化輸入框（from / to），以箭頭圖示分隔，
 * 通常由 DateRangePicker 使用。
 *
 * 對應 React 版的 `RangePickerTrigger`（TextField + 2 × FormattedInput 組合）。
 *
 * @example
 * ```html
 * <mzn-range-picker-trigger
 *   [format]="'YYYY-MM-DD'"
 *   [inputFromValue]="fromValue"
 *   [inputToValue]="toValue"
 *   (inputFromChanged)="onFromChange($event)"
 *   (inputToChanged)="onToChange($event)"
 * />
 * ```
 *
 * @see {@link MznFormattedInput}
 */
@Component({
  selector: 'mzn-range-picker-trigger',
  standalone: true,
  imports: [MznIcon, MznFormattedInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  template: `
    <div
      mznFormattedInput
      [attr.aria-label]="'Start date'"
      [disabled]="disabled()"
      [errorMessages]="errorMessagesFrom()"
      [format]="format()"
      [hoverValue]="hoverFromValue()"
      [placeholder]="inputFromPlaceholder()"
      [validate]="validateFrom()"
      [value]="inputFromValue()"
      (inputBlurred)="fromBlurred.emit($event)"
      (inputFocused)="onFromFocus($event)"
      (valueChanged)="onFromChanged($event)"
      (valueCleared)="fromValueCleared.emit()"
    ></div>
    <i
      mznIcon
      [icon]="arrowIcon"
      [class]="arrowIconClass"
      aria-hidden="true"
    ></i>
    <div
      mznFormattedInput
      [attr.aria-label]="'End date'"
      [disabled]="disabled()"
      [errorMessages]="errorMessagesTo()"
      [format]="format()"
      [hoverValue]="hoverToValue()"
      [placeholder]="inputToPlaceholder()"
      [validate]="validateTo()"
      [value]="inputToValue()"
      (inputBlurred)="toBlurred.emit($event)"
      (inputFocused)="onToFocus($event)"
      (valueChanged)="onToChanged($event)"
      (valueCleared)="toValueCleared.emit()"
    ></div>
    @if (shouldShowClearable()) {
      <button
        type="button"
        [class]="clearIconClass"
        (click)="cleared.emit(); $event.stopPropagation()"
      >
        <i mznIcon [icon]="closeIcon"></i>
      </button>
    } @else {
      <ng-content select="[suffix]">
        <i mznIcon [icon]="calendarIcon" (click)="iconClick.emit($event)"></i>
      </ng-content>
    }
  `,
})
export class MznRangePickerTrigger implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  // -------------------------------------------------------------------------
  // Internal hover/focus/value state
  // -------------------------------------------------------------------------

  private readonly isHovered = signal(false);
  private readonly isFocused = signal(false);
  private readonly hasFromValue = signal(false);
  private readonly hasToValue = signal(false);

  // -------------------------------------------------------------------------
  // Inputs (alphabetical order)
  // -------------------------------------------------------------------------

  /** 是否可清除。 @default true */
  readonly clearable = input(true);

  /** 是否禁用。 @default false */
  readonly disabled = input(false);

  /** 是否有錯誤。 @default false */
  readonly error = input(false);

  /** 'from' 輸入框的錯誤訊息設定。 */
  readonly errorMessagesFrom = input<FormattedInputErrorMessages>({
    enabled: true,
    invalidInput: 'Input value is not valid.',
    invalidPaste: 'Pasted content is not valid.',
  });

  /** 'to' 輸入框的錯誤訊息設定。 */
  readonly errorMessagesTo = input<FormattedInputErrorMessages>({
    enabled: true,
    invalidInput: 'Input value is not valid.',
    invalidPaste: 'Pasted content is not valid.',
  });

  /** 日期格式（例如 `'YYYY-MM-DD'`）。 */
  readonly format = input.required<string>();

  /** 是否全寬。 @default false */
  readonly fullWidth = input(false);

  /** 額外的 host class 修飾。 */
  readonly hostClassModifier = input('');

  /** 'from' 輸入框的 hoverValue（日曆懸停預覽）。 */
  readonly hoverFromValue = input<string | undefined>(undefined);

  /** 'to' 輸入框的 hoverValue（日曆懸停預覽）。 */
  readonly hoverToValue = input<string | undefined>(undefined);

  /** 'from' 輸入框佔位文字。 */
  readonly inputFromPlaceholder = input<string | undefined>(undefined);

  /** 'from' 輸入框當前值。 */
  readonly inputFromValue = input<string | undefined>(undefined);

  /** 'to' 輸入框佔位文字。 */
  readonly inputToPlaceholder = input<string | undefined>(undefined);

  /** 'to' 輸入框當前值。 */
  readonly inputToValue = input<string | undefined>(undefined);

  /** 是否唯讀。 @default false */
  readonly readOnly = input(false);

  /** 是否必填。 @default false */
  readonly required = input(false);

  /** 尺寸。 @default 'main' */
  readonly size = input<TextFieldSize>('main');

  /** 'from' 輸入框自訂驗證函式。 */
  readonly validateFrom = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );

  /** 'to' 輸入框自訂驗證函式。 */
  readonly validateTo = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  /** 清除事件。 */
  readonly cleared = output<void>();

  /** 日曆圖示點擊事件。 */
  readonly iconClick = output<MouseEvent>();

  /** 'from' 輸入框聚焦事件。 */
  readonly fromFocused = output<FocusEvent>();

  /** 'from' 輸入框失焦事件。 */
  readonly fromBlurred = output<FocusEvent>();

  /** 'from' 值被清空事件。 */
  readonly fromValueCleared = output<void>();

  /** 'from' 輸入框變更事件。 */
  readonly inputFromChanged = output<{ isoValue: string; rawDigits: string }>();

  /** 'to' 輸入框聚焦事件。 */
  readonly toFocused = output<FocusEvent>();

  /** 'to' 輸入框失焦事件。 */
  readonly toBlurred = output<FocusEvent>();

  /** 'to' 值被清空事件。 */
  readonly toValueCleared = output<void>();

  /** 'to' 輸入框變更事件。 */
  readonly inputToChanged = output<{ isoValue: string; rawDigits: string }>();

  // -------------------------------------------------------------------------
  // ViewChildren
  // -------------------------------------------------------------------------

  readonly formattedInputEls = viewChildren(MznFormattedInput);

  // -------------------------------------------------------------------------
  // Static class / icon references
  // -------------------------------------------------------------------------

  protected readonly arrowIcon = LongTailArrowRightIcon;
  protected readonly arrowIconClass = classes.arrowIcon;
  protected readonly calendarIcon = CalendarIcon;
  protected readonly clearIconClass = textFieldClasses.clearIcon;
  protected readonly closeIcon = CloseIcon;

  // -------------------------------------------------------------------------
  // Computed classes
  // -------------------------------------------------------------------------

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.hostRange,
      textFieldClasses.host,
      this.size() === 'sub' ? textFieldClasses.sub : textFieldClasses.main,
      this.hostClassModifier(),
      {
        [textFieldClasses.clearable]: !this.readOnly() && this.clearable(),
        [textFieldClasses.clearing]: this.shouldShowClearable(),
        [textFieldClasses.disabled]: this.disabled(),
        [textFieldClasses.error]: this.error(),
        [textFieldClasses.fullWidth]: this.fullWidth(),
        [textFieldClasses.readonly]: this.readOnly(),
      },
    ),
  );

  protected readonly shouldShowClearable = computed((): boolean => {
    if (this.readOnly() || !this.clearable()) return false;
    if (this.disabled()) return false;
    return (
      (this.hasFromValue() || this.hasToValue()) &&
      (this.isHovered() || this.isFocused())
    );
  });

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;
    const inputs = Array.from(
      host.querySelectorAll('input'),
    ) as HTMLInputElement[];

    const checkValues = (): void => {
      const [fromInput, toInput] = inputs;
      this.hasFromValue.set((fromInput?.value || '').trim().length > 0);
      this.hasToValue.set((toInput?.value || '').trim().length > 0);
    };

    const handleFocus = (): void => {
      this.isFocused.set(true);
      checkValues();
    };

    const handleBlur = (): void => {
      this.isFocused.set(false);
      checkValues();
    };

    checkValues();
    for (const input of inputs) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      input.addEventListener('change', checkValues);
    }

    this.destroyRef.onDestroy(() => {
      for (const input of inputs) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
        input.removeEventListener('change', checkValues);
      }
    });
  }

  // -------------------------------------------------------------------------
  // Event handlers
  // -------------------------------------------------------------------------

  protected onMouseEnter(): void {
    this.isHovered.set(true);
  }

  protected onMouseLeave(): void {
    this.isHovered.set(false);
  }

  protected onFromFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.fromFocused.emit(event);
  }

  protected onToFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.toFocused.emit(event);
  }

  protected onFromChanged(payload: {
    isoValue: string;
    rawDigits: string;
  }): void {
    this.hasFromValue.set(true);
    this.inputFromChanged.emit(payload);
  }

  protected onToChanged(payload: {
    isoValue: string;
    rawDigits: string;
  }): void {
    this.hasToValue.set(true);
    this.inputToChanged.emit(payload);
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** 程式化設定 from 輸入框聚焦。 */
  focusFrom(): void {
    this.formattedInputEls()[0]?.focus();
  }

  /** 程式化設定 to 輸入框聚焦。 */
  focusTo(): void {
    this.formattedInputEls()[1]?.focus();
  }
}
