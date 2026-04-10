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
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { MZN_CALENDAR_CONFIG } from '@mezzanine-ui/ng/calendar';
import { MznMessageService } from '@mezzanine-ui/ng/message';
import clsx from 'clsx';
import {
  findPreviousMaskSegment,
  FormatSegment,
  getTemplateWithoutBrackets,
  isMaskSegmentFilled,
  parseFormatSegments,
} from './format-utils';
import { getMaskRange, MaskFormat } from './mask-format';

/**
 * 錯誤訊息設定。
 */
export interface FormattedInputErrorMessages {
  /** 是否啟用錯誤提示。 @default true */
  readonly enabled?: boolean;
  /** 輸入值無效時的訊息。 @default 'Input value is not valid.' */
  readonly invalidInput?: string;
  /** 貼上內容無效時的訊息。 @default 'Pasted content is not valid.' */
  readonly invalidPaste?: string;
}

/**
 * 格式化日期輸入元件，提供混合色彩的遮罩佔位顯示。
 *
 * 內建完整的 mask 輸入邏輯（鍵盤導覽、退格、貼上），
 * 對應 React 版的 `FormattedInput` + `useDateInputFormatter`。
 *
 * 需要在父層提供 `MZN_CALENDAR_CONFIG`（透過 `MznCalendarConfigProvider`）。
 *
 * @example
 * ```html
 * <!-- 在 @mezzanine-ui/ng/picker 中使用 -->
 * <div mznFormattedInput
 *   [format]="'YYYY-MM-DD'"
 *   [value]="currentValue"
 *   [placeholder]="'Select date'"
 *   [disabled]="false"
 *   (valueChanged)="onValueChange($event)"
 *   (pasteIsoValue)="onPasteIso($event)"
 * ></div>
 * ```
 *
 * @see {@link MaskFormat} 格式解析工具類別
 * @see {@link MznPickerTrigger} Picker 觸發器元件
 */
@Component({
  selector: '[mznFormattedInput]',
  host: {
    '[class]': 'hostClass',
    '[attr.disabled]': 'null',
    '[attr.errorMessages]': 'null',
    '[attr.format]': 'null',
    '[attr.inputSize]': 'null',
    '[attr.hoverValue]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.validate]': 'null',
    '[attr.value]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      #inputEl
      type="text"
      [class]="inputClass"
      [disabled]="disabled()"
      [attr.aria-disabled]="disabled()"
      [attr.size]="inputSize() ?? null"
      [value]="inputDisplayValue()"
      [placeholder]="resolvedPlaceholder()"
      (keydown)="onKeyDown($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
      (paste)="onPaste($event)"
      (change)="$event.stopPropagation()"
    />
    @if (showDisplayOverlay()) {
      <div aria-hidden="true" [class]="displayClass">
        @for (segment of displaySegments(); track $index) {
          <span [class]="segmentClass(segment)">{{ segment.text }}</span>
        }
      </div>
    }
  `,
})
export class MznFormattedInput {
  private readonly config = inject(MZN_CALENDAR_CONFIG);
  private readonly messageService = inject(MznMessageService);

  // -------------------------------------------------------------------------
  // Inputs (alphabetical order)
  // -------------------------------------------------------------------------

  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 各種驗證場景的錯誤訊息設定。
   * @default { enabled: true, invalidInput: 'Input value is not valid.', invalidPaste: 'Pasted content is not valid.' }
   */
  readonly errorMessages = input<FormattedInputErrorMessages>({
    enabled: true,
    invalidInput: 'Input value is not valid.',
    invalidPaste: 'Pasted content is not valid.',
  });

  /**
   * 格式字串（例如 `'YYYY-MM-DD'`、`'HH:mm:ss'`）。
   */
  readonly format = input.required<string>();

  /**
   * 未聚焦且值為空時，以佔位色預覽的日期字串（例如日曆滑鼠懸停預覽）。
   */
  readonly hoverValue = input<string | undefined>(undefined);

  /**
   * 未聚焦且值為空時顯示的佔位文字。
   */
  readonly placeholder = input<string | undefined>(undefined);

  /**
   * 自訂驗證函式，回傳 `true` 表示合法，`false` 則清空值。
   * 在格式驗證通過後才會呼叫。
   */
  readonly validate = input<((isoDate: string) => boolean) | undefined>(
    undefined,
  );

  /**
   * 原生 input 的 `size` 屬性值（字元寬度）。
   * 單獨使用時由 DatePicker 傳 `format.length + 2`；
   * RangePicker 則不傳（讓 flex 自由伸展）。
   */
  readonly inputSize = input<number | undefined>(undefined);

  /**
   * 當前值（ISO date string 或格式化字串）。
   */
  readonly value = input<string | undefined>(undefined);

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  /**
   * 值變更事件，回傳 ISO date string 與原始數字字串。
   * 僅在值完整且合法時觸發。
   */
  readonly valueChanged = output<{ isoValue: string; rawDigits: string }>();

  /**
   * 輸入框聚焦事件。
   */
  readonly inputFocused = output<FocusEvent>();

  /**
   * 輸入框失焦事件。
   */
  readonly inputBlurred = output<FocusEvent>();

  /**
   * 值被清空事件（失焦時值不完整、或驗證失敗）。
   */
  readonly valueCleared = output<void>();

  /**
   * 鍵盤按下事件（轉發自 input 的 keydown）。
   */
  readonly inputKeydown = output<KeyboardEvent>();

  /**
   * 貼上有效 ISO 日期時觸發，供父元件做跨欄位同步。
   */
  readonly pasteIsoValue = output<string>();

  // -------------------------------------------------------------------------
  // ViewChild
  // -------------------------------------------------------------------------

  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  // -------------------------------------------------------------------------
  // Internal state
  // -------------------------------------------------------------------------

  protected readonly focused = signal(false);
  protected readonly internalValue = signal('');

  // Cached computed values — rebuilt when format changes
  private maskFormat!: MaskFormat;
  private segments!: readonly FormatSegment[];
  private templateValue!: string;

  // -------------------------------------------------------------------------
  // Derived class names
  // -------------------------------------------------------------------------

  protected readonly hostClass = classes.formattedInput;
  protected readonly inputClass = clsx(
    classes.inputMono,
    classes.formattedInputHidden,
  );
  protected readonly displayClass = classes.formattedInputDisplay;

  // -------------------------------------------------------------------------
  // Computed display state
  // -------------------------------------------------------------------------

  protected readonly isComplete = computed(
    () => this.maskFormat?.match(this.internalValue()) ?? false,
  );

  protected readonly inputDisplayValue = computed(() => {
    const val = this.internalValue();
    return val === this.templateValue ? '' : val;
  });

  protected readonly resolvedPlaceholder = computed(() => {
    const val = this.internalValue();
    if (val !== this.templateValue) return undefined;

    const hover = this.hoverValue();
    if (hover) return undefined;

    if (this.focused()) return this.templateValue;
    return this.placeholder();
  });

  protected readonly showDisplayOverlay = computed(() => {
    const val = this.internalValue();
    const isTemplate = val === this.templateValue;
    const hover = this.hoverValue();

    // Show native placeholder when no value and no hover preview
    if (isTemplate && !hover && this.placeholder()) return false;
    return true;
  });

  protected readonly displaySegments = computed(
    (): Array<{ text: string; filled: boolean }> => {
      const val = this.internalValue();
      const hover = this.hoverValue();
      const isTemplate = val === this.templateValue;
      const isHoverPreview = isTemplate && !!hover;
      const currentValue = isHoverPreview ? hover : val || '';

      const result: Array<{ text: string; filled: boolean }> = [];

      for (const segment of this.segments) {
        if (segment.type === 'mask') {
          for (let i = segment.start; i < segment.end; i++) {
            result.push({
              text: currentValue[i] ?? segment.text[i - segment.start],
              filled: isHoverPreview ? false : /\d/.test(currentValue[i]),
            });
          }
        } else {
          const prevMask = findPreviousMaskSegment(
            this.segments,
            segment.start,
          );
          const isFilled = isHoverPreview
            ? false
            : prevMask
              ? isMaskSegmentFilled(currentValue, prevMask)
              : false;

          result.push({ text: segment.text, filled: isFilled });
        }
      }

      return result;
    },
  );

  constructor() {
    // Sync external value → internal when it changes
    effect(() => {
      const externalValue = this.value();
      const fmt = this.format();
      this.rebuildFormat(fmt);

      if (externalValue) {
        this.internalValue.set(externalValue);
      } else {
        this.internalValue.set(this.templateValue);
      }
    });
  }

  // -------------------------------------------------------------------------
  // Segment class helper
  // -------------------------------------------------------------------------

  protected segmentClass(segment: { filled: boolean }): string {
    return clsx(
      classes.formattedInputSegment,
      segment.filled &&
        (this.isComplete()
          ? classes.formattedInputSegmentFilled
          : classes.formattedInputSegmentFilling),
      this.disabled() && classes.formattedInputSegmentDisabled,
    );
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** 程式化設定聚焦。 */
  focus(): void {
    this.inputEl()?.nativeElement.focus();
  }

  /** 程式化設定選取範圍。 */
  setSelectionRange(start: number, end: number): void {
    this.inputEl()?.nativeElement.setSelectionRange(start, end);
  }

  // -------------------------------------------------------------------------
  // Event handlers
  // -------------------------------------------------------------------------

  protected onFocus(event: FocusEvent): void {
    this.focused.set(true);
    this.inputFocused.emit(event);

    // If value doesn't match format, reset to template
    if (!this.maskFormat.match(this.internalValue())) {
      this.applyChange(this.templateValue);
    }
  }

  protected onBlur(event: FocusEvent): void {
    this.focused.set(false);
    this.inputBlurred.emit(event);

    const current = this.internalValue();

    if (!this.maskFormat.match(current)) {
      this.internalValue.set(this.templateValue);
      this.valueCleared.emit();
      return;
    }

    // Value is complete — validate
    const isoDate = this.config.parseFormattedValue(
      current,
      this.format(),
      this.config.locale,
    );
    const validateFn = this.validate();

    if (!isoDate || (validateFn && !validateFn(isoDate as string))) {
      this.internalValue.set(this.templateValue);
      this.valueCleared.emit();
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const { key } = event;

    // Always emit keydown for parent components to handle (e.g., Escape/Enter to close picker)
    this.inputKeydown.emit(event);

    if (key === 'Tab') {
      event.stopPropagation();
      return;
    }

    if (key === 'Backspace') {
      event.preventDefault();
      this.handleBackspace(event);
      return;
    }

    if (/^\d$/.test(key)) {
      event.preventDefault();
      this.handleDigitInput(event, key);
      return;
    }

    // Block non-digit printable chars (allow ctrl/meta combos)
    if (key.length === 1 && !/[\dBackspace]/.test(key)) {
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        event.preventDefault();
      }
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('Text') ?? '';

    if (this.config.isValid(pasteData)) {
      const parsed = this.config.formatToString(
        this.config.locale,
        pasteData,
        this.format(),
      );
      if (parsed) {
        this.pasteIsoValue.emit(pasteData);
        this.applyChange(parsed);
        return;
      }
    }

    const newValueArray = this.internalValue().split('');
    let pasteIndex = 0;

    for (const cell of this.maskFormat.maskCells) {
      for (let i = cell.start; i < cell.end; i++) {
        if (pasteIndex >= pasteData.length) break;
        const char = pasteData[pasteIndex];
        if (/\d/.test(char)) {
          newValueArray[i] = char;
          pasteIndex++;
        } else {
          pasteIndex++;
          i--;
        }
      }
      if (pasteIndex >= pasteData.length) break;
    }

    const newValue = newValueArray.join('');
    if (newValue === this.templateValue) {
      const msgs = this.errorMessages();
      if (msgs.enabled !== false) {
        this.messageService.error(
          msgs.invalidPaste ?? 'Pasted content is not valid.',
        );
      }
    }

    this.applyChange(newValue);
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private rebuildFormat(format: string): void {
    this.maskFormat = new MaskFormat(format);
    this.segments = parseFormatSegments(format);
    this.templateValue = getTemplateWithoutBrackets(format);
  }

  private applyChange(newValue: string, cursorPosition?: number): void {
    this.internalValue.set(newValue);

    if (this.maskFormat.match(newValue)) {
      const isoDate = this.config.parseFormattedValue(
        newValue,
        this.format(),
        this.config.locale,
      );
      const validateFn = this.validate();

      if (isoDate && (!validateFn || validateFn(isoDate as string))) {
        const rawDigits = newValue.replace(/[^0-9]/g, '');
        this.valueChanged.emit({ isoValue: isoDate as string, rawDigits });
      } else {
        const msgs = this.errorMessages();
        if (msgs.enabled !== false) {
          this.messageService.error(
            msgs.invalidInput ?? 'Input value is not valid.',
          );
        }
      }
    }

    if (cursorPosition !== undefined) {
      requestAnimationFrame(() => {
        this.inputEl()?.nativeElement.setSelectionRange(
          cursorPosition,
          cursorPosition,
        );
      });
    }
  }

  private handleBackspace(event: KeyboardEvent): void {
    const cursorPos = (event.target as HTMLInputElement).selectionStart ?? 0;
    if (cursorPos === 0) return;

    const current = this.internalValue();
    const maskCells = this.maskFormat.maskCells;

    // Is cursor on a separator?
    let isSeparatorPos = true;
    for (const cell of maskCells) {
      if (cursorPos > cell.start && cursorPos <= cell.end) {
        isSeparatorPos = false;
        break;
      }
    }

    if (isSeparatorPos) {
      // Move back to find a digit and clear it
      let prevPos = cursorPos - 1;
      while (prevPos >= 0) {
        let found = false;
        for (const cell of maskCells) {
          if (prevPos >= cell.start && prevPos < cell.end) {
            if (/\d/.test(current[prevPos])) {
              found = true;
              break;
            }
          }
        }
        if (found) break;
        prevPos--;
      }
      if (prevPos < 0) return;

      const newValue = current.split('');
      newValue[prevPos] = this.templateValue[prevPos];
      this.applyChange(newValue.join(''), prevPos);
      return;
    }

    // Find which cell cursor is in
    let targetCellIndex = -1;
    let posInCell = -1;
    for (let i = 0; i < maskCells.length; i++) {
      const cell = maskCells[i];
      if (cursorPos > cell.start && cursorPos <= cell.end) {
        targetCellIndex = i;
        posInCell = cursorPos - cell.start;
        break;
      }
    }
    if (targetCellIndex === -1) return;

    const targetCell = maskCells[targetCellIndex];

    if (posInCell === 1) {
      // At first position in cell — check if cell is fully empty
      let cellIsEmpty = true;
      for (let i = targetCell.start; i < targetCell.end; i++) {
        if (/\d/.test(current[i])) {
          cellIsEmpty = false;
          break;
        }
      }

      if (cellIsEmpty && targetCellIndex > 0) {
        const prevCell = maskCells[targetCellIndex - 1];
        let lastDigitPos = prevCell.end - 1;
        while (lastDigitPos >= prevCell.start) {
          if (/\d/.test(current[lastDigitPos])) break;
          lastDigitPos--;
        }
        if (lastDigitPos >= prevCell.start) {
          const newValue = current.split('');
          newValue[lastDigitPos] = this.templateValue[lastDigitPos];
          this.applyChange(newValue.join(''), lastDigitPos);
          return;
        }
      }
    }

    // Normal clear at cursorPos - 1
    const clearPos = targetCell.start + posInCell - 1;
    const newValue = current.split('');
    newValue[clearPos] = this.templateValue[clearPos];
    this.applyChange(newValue.join(''), clearPos);
  }

  private handleDigitInput(event: KeyboardEvent, key: string): void {
    const cursorPos = (event.target as HTMLInputElement).selectionStart ?? 0;
    const maskCells = this.maskFormat.maskCells;
    const current = this.internalValue();

    // Find actual editable position (skip separators)
    let isSeparatorPos = true;
    let nextEditablePos = cursorPos;

    for (const cell of maskCells) {
      if (cursorPos >= cell.start && cursorPos < cell.end) {
        isSeparatorPos = false;
        break;
      }
    }

    if (isSeparatorPos) {
      for (const cell of maskCells) {
        if (cell.start >= cursorPos) {
          nextEditablePos = cell.start;
          break;
        }
      }
    }

    // Find which cell the editable position is in
    let targetCellIndex = -1;
    for (let i = 0; i < maskCells.length; i++) {
      const cell = maskCells[i];
      if (nextEditablePos >= cell.start && nextEditablePos < cell.end) {
        targetCellIndex = i;
        break;
      }
    }
    if (targetCellIndex === -1) return;

    const targetCell = maskCells[targetCellIndex];
    const [minVal, maxVal] = getMaskRange(targetCell.mask ?? '');

    const currentCellValue = current.slice(targetCell.start, targetCell.end);
    const newCellValue = currentCellValue.split('');
    const posInCell = nextEditablePos - targetCell.start;
    newCellValue[posInCell] = key;
    const newCellStr = newCellValue.join('');

    if (!/^\d+$/.test(newCellStr)) {
      // Not all positions filled yet — allow partial input
      const newValue = current.split('');
      newValue[nextEditablePos] = key;
      let nextPos = nextEditablePos + 1;
      if (nextPos >= targetCell.end && targetCellIndex < maskCells.length - 1) {
        nextPos = maskCells[targetCellIndex + 1].start;
      }
      this.applyChange(newValue.join(''), nextPos);
      return;
    }

    // All positions filled — validate range
    const cellNum = parseInt(newCellStr, 10);
    if (cellNum < minVal || cellNum > maxVal) {
      return; // Block invalid value
    }

    const newValue = current.split('');
    newValue[nextEditablePos] = key;
    let nextPos = nextEditablePos + 1;
    if (nextPos >= targetCell.end && targetCellIndex < maskCells.length - 1) {
      nextPos = maskCells[targetCellIndex + 1].start;
    }
    this.applyChange(newValue.join(''), nextPos);
  }
}
