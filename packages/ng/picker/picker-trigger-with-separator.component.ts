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
import { CloseIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import clsx from 'clsx';
import {
  FormattedInputErrorMessages,
  MznFormattedInput,
} from './formatted-input.component';

/**
 * 含分隔線的 Picker 觸發器元件（內部共用）。
 *
 * 包含兩個獨立的格式化輸入框（左側 / 右側），以垂直分隔線分隔，
 * 通常由 DateTimePicker 使用（左側日期、右側時間）。
 *
 * 對應 React 版的 `PickerTriggerWithSeparator`（TextField + 2 × FormattedInput 組合）。
 *
 * @example
 * ```html
 * <div mznPickerTriggerWithSeparator
 *   [formatLeft]="'YYYY-MM-DD'"
 *   [formatRight]="'HH:mm:ss'"
 *   [valueLeft]="dateValue"
 *   [valueRight]="timeValue"
 *   (leftChanged)="onDateChange($event)"
 *   (rightChanged)="onTimeChange($event)"
 * ></div>
 * ```
 *
 * @see {@link MznFormattedInput}
 */
@Component({
  selector: '[mznPickerTriggerWithSeparator]',
  standalone: true,
  imports: [MznIcon, MznFormattedInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '[attr.clearable]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.errorMessagesLeft]': 'null',
    '[attr.errorMessagesRight]': 'null',
    '[attr.formatLeft]': 'null',
    '[attr.formatRight]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.hoverValueLeft]': 'null',
    '[attr.hostClassModifier]': 'null',
    '[attr.placeholderLeft]': 'null',
    '[attr.placeholderRight]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.required]': 'null',
    '[attr.size]': 'null',
    '[attr.validateLeft]': 'null',
    '[attr.validateRight]': 'null',
    '[attr.valueLeft]': 'null',
    '[attr.valueRight]': 'null',
  },
  template: `
    <div [class]="separatorInputsClass">
      <div [class]="separatorInputClass">
        <div
          mznFormattedInput
          [attr.aria-label]="'Date input'"
          [disabled]="disabled()"
          [errorMessages]="errorMessagesLeft()"
          [format]="formatLeft()"
          [hoverValue]="hoverValueLeft()"
          [placeholder]="placeholderLeft()"
          [validate]="validateLeft()"
          [value]="valueLeft()"
          (inputBlurred)="leftBlurred.emit($event)"
          (inputFocused)="onLeftFocus($event)"
          (pasteIsoValue)="pasteIsoValueLeft.emit($event)"
          (valueChanged)="onLeftChanged($event)"
          (valueCleared)="leftValueCleared.emit()"
        ></div>
      </div>
      <div [class]="separatorClass"></div>
      <div [class]="separatorInputClass">
        <div
          mznFormattedInput
          [attr.aria-label]="'Time input'"
          [disabled]="disabled()"
          [errorMessages]="errorMessagesRight()"
          [format]="formatRight()"
          [placeholder]="placeholderRight()"
          [validate]="validateRight()"
          [value]="valueRight()"
          (inputBlurred)="rightBlurred.emit($event)"
          (inputFocused)="onRightFocus($event)"
          (pasteIsoValue)="pasteIsoValueRight.emit($event)"
          (valueChanged)="onRightChanged($event)"
          (valueCleared)="rightValueCleared.emit()"
        ></div>
      </div>
    </div>
    @if (shouldShowClearable()) {
      <button
        type="button"
        [class]="clearIconClass"
        (click)="cleared.emit(); $event.stopPropagation()"
      >
        <i mznIcon [icon]="closeIconSvg"></i>
      </button>
    } @else {
      <ng-content select="[suffix]" />
    }
  `,
})
export class MznPickerTriggerWithSeparator implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  // -------------------------------------------------------------------------
  // Internal hover/focus/value state
  // -------------------------------------------------------------------------

  private readonly isHovered = signal(false);
  private readonly isFocused = signal(false);
  private readonly hasLeftValue = signal(false);
  private readonly hasRightValue = signal(false);

  // -------------------------------------------------------------------------
  // Inputs (alphabetical order)
  // -------------------------------------------------------------------------

  /** 是否可清除。 @default true */
  readonly clearable = input(true);

  /** 是否禁用。 @default false */
  readonly disabled = input(false);

  /** 是否有錯誤。 @default false */
  readonly error = input(false);

  /** 左側輸入框的錯誤訊息設定。 */
  readonly errorMessagesLeft = input<FormattedInputErrorMessages>({
    enabled: true,
    invalidInput: 'Input value is not valid.',
    invalidPaste: 'Pasted content is not valid.',
  });

  /** 右側輸入框的錯誤訊息設定。 */
  readonly errorMessagesRight = input<FormattedInputErrorMessages>({
    enabled: true,
    invalidInput: 'Input value is not valid.',
    invalidPaste: 'Pasted content is not valid.',
  });

  /** 左側輸入框的格式（例如 `'YYYY-MM-DD'`）。 */
  readonly formatLeft = input.required<string>();

  /** 右側輸入框的格式（例如 `'HH:mm:ss'`）。 */
  readonly formatRight = input.required<string>();

  /** 是否全寬。 @default false */
  readonly fullWidth = input(false);

  /** 左側輸入框的 hoverValue（日曆懸停預覽）。 */
  readonly hoverValueLeft = input<string | undefined>(undefined);

  /** 額外的 host class 修飾。 */
  readonly hostClassModifier = input('');

  /** 左側輸入框佔位文字。 */
  readonly placeholderLeft = input<string | undefined>(undefined);

  /** 右側輸入框佔位文字。 */
  readonly placeholderRight = input<string | undefined>(undefined);

  /** 是否唯讀。 @default false */
  readonly readOnly = input(false);

  /** 是否必填。 @default false */
  readonly required = input(false);

  /** 尺寸。 @default 'main' */
  readonly size = input<TextFieldSize>('main');

  /** 左側輸入框自訂驗證函式。 */
  readonly validateLeft = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );

  /** 右側輸入框自訂驗證函式。 */
  readonly validateRight = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );

  /** 左側輸入框當前值。 */
  readonly valueLeft = input<string | undefined>(undefined);

  /** 右側輸入框當前值。 */
  readonly valueRight = input<string | undefined>(undefined);

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  /** 清除事件。 */
  readonly cleared = output<void>();

  /** 左側輸入框聚焦事件。 */
  readonly leftFocused = output<FocusEvent>();

  /** 左側輸入框失焦事件。 */
  readonly leftBlurred = output<FocusEvent>();

  /** 左側完成回呼（所有 mask 位置填滿）。 */
  readonly leftComplete = output<void>();

  /** 左側值被清空事件。 */
  readonly leftValueCleared = output<void>();

  /** 左側輸入框變更事件。 */
  readonly leftChanged = output<{ isoValue: string; rawDigits: string }>();

  /** 左側貼上有效 ISO 日期時觸發。 */
  readonly pasteIsoValueLeft = output<string>();

  /** 右側輸入框聚焦事件。 */
  readonly rightFocused = output<FocusEvent>();

  /** 右側輸入框失焦事件。 */
  readonly rightBlurred = output<FocusEvent>();

  /** 右側完成回呼（所有 mask 位置填滿）。 */
  readonly rightComplete = output<void>();

  /** 右側值被清空事件。 */
  readonly rightValueCleared = output<void>();

  /** 右側輸入框變更事件。 */
  readonly rightChanged = output<{ isoValue: string; rawDigits: string }>();

  /** 右側貼上有效 ISO 日期時觸發。 */
  readonly pasteIsoValueRight = output<string>();

  // -------------------------------------------------------------------------
  // ViewChildren
  // -------------------------------------------------------------------------

  readonly formattedInputEls = viewChildren(MznFormattedInput);

  // -------------------------------------------------------------------------
  // Static class references
  // -------------------------------------------------------------------------

  protected readonly closeIconSvg = CloseIcon;
  protected readonly clearIconClass = textFieldClasses.clearIcon;
  protected readonly separatorInputsClass = classes.separatorInputs;
  protected readonly separatorInputClass = classes.separatorInput;
  protected readonly separatorClass = classes.separator;

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
    return (
      (this.hasLeftValue() || this.hasRightValue()) &&
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
      const [leftInput, rightInput] = inputs;
      this.hasLeftValue.set((leftInput?.value || '').trim().length > 0);
      this.hasRightValue.set((rightInput?.value || '').trim().length > 0);
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

  protected onLeftFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.leftFocused.emit(event);
  }

  protected onRightFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.rightFocused.emit(event);
  }

  protected onLeftChanged(payload: {
    isoValue: string;
    rawDigits: string;
  }): void {
    this.hasLeftValue.set(true);
    this.leftChanged.emit(payload);
    if (payload.isoValue) {
      this.leftComplete.emit();
    }
  }

  protected onRightChanged(payload: {
    isoValue: string;
    rawDigits: string;
  }): void {
    this.hasRightValue.set(true);
    this.rightChanged.emit(payload);
    if (payload.isoValue) {
      this.rightComplete.emit();
    }
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** 程式化設定左側輸入框聚焦。 */
  focusLeft(): void {
    this.formattedInputEls()[0]?.focus();
  }

  /** 程式化設定右側輸入框聚焦。 */
  focusRight(): void {
    this.formattedInputEls()[1]?.focus();
  }
}
