import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  effect,
  input,
  output,
  signal,
  viewChildren,
  ElementRef,
} from '@angular/core';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import clsx from 'clsx';

/**
 * Modal 驗證碼輸入元件，用於 OTP / 驗證碼輸入場景。
 *
 * 提供多個單字元輸入欄位，支援自動前進、Backspace 退格、方向鍵導覽、貼上分配，
 * 以及全部填滿時的 `completed` 事件。可選配重新傳送連結。
 *
 * @example
 * ```html
 * import { MznModalBodyForVerification } from '@mezzanine-ui/ng/modal';
 *
 * <mzn-modal-body-for-verification
 *   [length]="6"
 *   [autoFocus]="true"
 *   resendText="點此重新寄送"
 *   (valueChange)="onCodeChange($event)"
 *   (completed)="onComplete($event)"
 *   (resent)="onResend()"
 * />
 * ```
 *
 * @see MznModal
 * @see MznModalFooter
 */
@Component({
  selector: 'mzn-modal-body-for-verification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="verificationClass">
      <div [class]="inputsClass()">
        @for (code of codes(); track $index) {
          <input
            #codeInput
            [class]="inputClass()"
            type="text"
            inputMode="numeric"
            maxlength="1"
            autocomplete="off"
            [value]="code"
            [disabled]="disabled()"
            [readOnly]="readOnly()"
            (input)="onInput($index, $event)"
            (keydown)="onKeyDown($index, $event)"
            (paste)="onPaste($index, $event)"
          />
        }
      </div>
      @if (resendText()) {
        <div [class]="resendClass">
          <span class="mzn-typography--caption mzn-typography--text-neutral">{{
            resendPrompt()
          }}</span>
          <a [class]="resendLinkClass" (click)="onResendClick()">{{
            resendText()
          }}</a>
        </div>
      }
    </div>
  `,
})
export class MznModalBodyForVerification {
  /** 是否在掛載後自動聚焦第一個輸入框。 @default true */
  readonly autoFocus = input(true);

  /** 是否禁用所有輸入框。 @default false */
  readonly disabled = input(false);

  /** 是否顯示錯誤樣式。 @default false */
  readonly error = input(false);

  /** 驗證碼欄位數量。 @default 4 */
  readonly length = input(4);

  /** 是否為唯讀模式。 @default false */
  readonly readOnly = input(false);

  /** 重新傳送連結前的提示文字。 @default '收不到驗證碼？' */
  readonly resendPrompt = input('收不到驗證碼？');

  /** 可點擊的重新傳送連結文字，有值時才顯示重新傳送區塊。 */
  readonly resendText = input<string>();

  /** 初始值，依序填入各欄位。 @default '' */
  readonly value = input('');

  /** 任一欄位變更時發出，值為所有欄位串接後的字串。 */
  readonly valueChange = output<string>();

  /** 所有欄位填滿時發出，值為完整驗證碼字串。 */
  readonly completed = output<string>();

  /** 點擊重新傳送連結時發出。 */
  readonly resent = output<void>();

  /** 各欄位的單字元陣列。 */
  readonly codes = signal<string[]>([]);

  private readonly inputRefs =
    viewChildren<ElementRef<HTMLInputElement>>('codeInput');

  protected readonly verificationClass = classes.modalBodyVerification;
  protected readonly resendClass = classes.modalBodyVerificationResend;
  protected readonly resendLinkClass = classes.modalBodyVerificationResendLink;

  protected readonly inputsClass = computed((): string =>
    clsx(classes.modalBodyVerificationInputs, {
      [classes.modalBodyVerificationInputsExtended]: this.length() > 4,
    }),
  );

  protected readonly inputClass = computed((): string =>
    clsx(classes.modalBodyVerificationInput, {
      [classes.modalBodyVerificationInputError]: this.error(),
    }),
  );

  constructor() {
    // Seed codes array from value input
    effect(() => {
      const val = this.value();
      const len = this.length();
      const chars = val.split('').slice(0, len);
      const padded = chars.concat(Array<string>(len - chars.length).fill(''));

      this.codes.set(padded);
    });

    // Auto-focus first input after initial render
    afterNextRender(() => {
      if (this.autoFocus() && !this.disabled() && !this.readOnly()) {
        const refs = this.inputRefs();

        if (refs.length > 0) {
          refs[0].nativeElement.focus();
        }
      }
    });
  }

  protected onInput(index: number, event: Event): void {
    if (this.disabled() || this.readOnly()) return;

    const input = event.target as HTMLInputElement;
    const sanitized = input.value.slice(-1);

    const newCodes = [...this.codes()];

    newCodes[index] = sanitized;
    this.codes.set(newCodes);

    const fullValue = newCodes.join('');

    this.valueChange.emit(fullValue);

    // Auto-advance to next input
    if (sanitized && index < this.length() - 1) {
      const refs = this.inputRefs();

      refs[index + 1]?.nativeElement.focus();
    }

    // Check completion
    if (newCodes.every((c) => c !== '')) {
      this.completed.emit(fullValue);
    }
  }

  protected onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      if (this.disabled() || this.readOnly()) return;

      const currentCodes = this.codes();

      if (!currentCodes[index] && index > 0) {
        // Current empty — focus previous
        const refs = this.inputRefs();

        refs[index - 1]?.nativeElement.focus();
      } else {
        // Clear current
        const newCodes = [...currentCodes];

        newCodes[index] = '';
        this.codes.set(newCodes);
        this.valueChange.emit(newCodes.join(''));
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      const refs = this.inputRefs();

      refs[index - 1]?.nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      const refs = this.inputRefs();

      refs[index + 1]?.nativeElement.focus();
    }
  }

  protected onPaste(index: number, event: ClipboardEvent): void {
    if (this.disabled() || this.readOnly()) return;

    event.preventDefault();

    const pastedData = event.clipboardData?.getData('text') ?? '';
    const len = this.length();
    const sliced = pastedData.slice(0, len - index);
    const chars = sliced.split('');
    const newCodes = [...this.codes()];

    chars.forEach((char, i) => {
      newCodes[index + i] = char;
    });

    this.codes.set(newCodes);

    const fullValue = newCodes.join('');

    this.valueChange.emit(fullValue);

    // Focus the next empty input or the last filled position
    const nextFocusIndex = Math.min(index + chars.length, len - 1);
    const refs = this.inputRefs();

    refs[nextFocusIndex]?.nativeElement.focus();

    if (newCodes.every((c) => c !== '')) {
      this.completed.emit(fullValue);
    }
  }

  protected onResendClick(): void {
    this.resent.emit();
  }
}
