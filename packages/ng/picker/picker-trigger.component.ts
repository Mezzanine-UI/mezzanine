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
  viewChild,
} from '@angular/core';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { TextFieldSize, textFieldClasses } from '@mezzanine-ui/core/text-field';
import { CloseIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import clsx from 'clsx';
import {
  FormattedInputErrorMessages,
  MznFormattedInput,
} from './formatted-input.component';

/**
 * Picker 輸入觸發器元件（內部共用）。
 *
 * 提供含格式化日期輸入（MznFormattedInput）和清除按鈕的 Picker 觸發器，
 * 對應 React 版的 `PickerTrigger`（TextField + FormattedInput 組合）。
 *
 * DatePicker / TimePicker 等透過此元件作為觸發 Popper 的 anchor。
 *
 * @example
 * ```html
 * <mzn-picker-trigger
 *   [format]="'YYYY-MM-DD'"
 *   [value]="displayValue"
 *   [placeholder]="'Select date'"
 *   [disabled]="false"
 *   [clearable]="true"
 *   (valueChanged)="onValueChange($event)"
 *   (cleared)="onClear()"
 * >
 *   <i mznIcon suffix [icon]="calendarIcon" ></i>
 * </mzn-picker-trigger>
 * ```
 *
 * @see {@link MznFormattedInput}
 */
@Component({
  selector: 'mzn-picker-trigger',
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
      [disabled]="disabled()"
      [errorMessages]="errorMessages()"
      [format]="format()"
      [hoverValue]="hoverValue()"
      [placeholder]="placeholder()"
      [validate]="validate()"
      [value]="value()"
      (inputBlurred)="onInputBlur($event)"
      (inputFocused)="onInputFocus($event)"
      (inputKeydown)="inputKeydown.emit($event)"
      (pasteIsoValue)="pasteIsoValue.emit($event)"
      (valueChanged)="onValueChanged($event)"
      (valueCleared)="onValueCleared()"
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
      <ng-content select="[suffix]" />
    }
  `,
})
export class MznPickerTrigger implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  // -------------------------------------------------------------------------
  // Internal hover/focus/typing state (mirrors MznTextField)
  // -------------------------------------------------------------------------

  private readonly isHovered = signal(false);
  private readonly isFocused = signal(false);
  private readonly hasValue = signal(false);

  // -------------------------------------------------------------------------
  // Inputs (alphabetical order)
  // -------------------------------------------------------------------------

  /** 是否可清除。 @default true */
  readonly clearable = input(true);

  /** 是否禁用。 @default false */
  readonly disabled = input(false);

  /** 各種驗證場景的錯誤訊息設定。 */
  readonly errorMessages = input<FormattedInputErrorMessages>({
    enabled: true,
    invalidInput: 'Input value is not valid.',
    invalidPaste: 'Pasted content is not valid.',
  });

  /** 是否有錯誤。 @default false */
  readonly error = input(false);

  /** 格式字串（例如 `'YYYY-MM-DD'`）。 */
  readonly format = input.required<string>();

  /** 是否全寬。 @default false */
  readonly fullWidth = input(false);

  /** 額外的 host class 修飾（例如 `mzn-picker--date`）。 */
  readonly hostClassModifier = input('');

  /**
   * 未聚焦且值為空時，以佔位色預覽的日期字串（日曆滑鼠懸停預覽）。
   */
  readonly hoverValue = input<string | undefined>(undefined);

  /** 未聚焦且值為空時顯示的佔位文字。 */
  readonly placeholder = input<string | undefined>(undefined);

  /** 是否唯讀。 @default false */
  readonly readOnly = input(false);

  /** 是否必填。 @default false */
  readonly required = input(false);

  /** 尺寸。 @default 'main' */
  readonly size = input<TextFieldSize>('main');

  /** 自訂驗證函式。 */
  readonly validate = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );

  /** 當前值（ISO date string 或格式化字串）。 */
  readonly value = input<string | undefined>(undefined);

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  /** 清除事件。 */
  readonly cleared = output<void>();

  /** 輸入框失焦事件。 */
  readonly inputBlurred = output<FocusEvent>();

  /** 輸入框聚焦事件。 */
  readonly inputFocused = output<FocusEvent>();

  /** 貼上有效 ISO 日期時觸發。 */
  readonly pasteIsoValue = output<string>();

  /** 值變更事件，回傳 ISO date string 與原始數字字串。 */
  readonly valueChanged = output<{ isoValue: string; rawDigits: string }>();

  /** 值被清空事件。 */
  readonly valueCleared = output<void>();

  /** 鍵盤按下事件（轉發自 FormattedInput）。 */
  readonly inputKeydown = output<KeyboardEvent>();

  // -------------------------------------------------------------------------
  // ViewChild
  // -------------------------------------------------------------------------

  readonly formattedInputEl = viewChild(MznFormattedInput);

  // -------------------------------------------------------------------------
  // Static class references
  // -------------------------------------------------------------------------

  protected readonly closeIcon = CloseIcon;
  protected readonly clearIconClass = textFieldClasses.clearIcon;

  // -------------------------------------------------------------------------
  // Computed classes
  // -------------------------------------------------------------------------

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
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
    return this.hasValue() && (this.isHovered() || this.isFocused());
  });

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;
    const input = host.querySelector('input') as HTMLInputElement | null;

    if (!input) return;

    const checkValue = (): void => {
      this.hasValue.set((input.value || '').trim().length > 0);
    };

    const handleFocus = (): void => {
      this.isFocused.set(true);
      checkValue();
    };

    const handleBlur = (): void => {
      this.isFocused.set(false);
      checkValue();
    };

    checkValue();
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('change', checkValue);

    this.destroyRef.onDestroy(() => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('change', checkValue);
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

  protected onInputFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.inputFocused.emit(event);
  }

  protected onInputBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.inputBlurred.emit(event);
  }

  protected onValueChanged(payload: {
    isoValue: string;
    rawDigits: string;
  }): void {
    this.hasValue.set(true);
    this.valueChanged.emit(payload);
  }

  protected onValueCleared(): void {
    this.hasValue.set(false);
    this.valueCleared.emit();
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** 程式化設定聚焦。 */
  focus(): void {
    this.formattedInputEl()?.focus();
  }
}
