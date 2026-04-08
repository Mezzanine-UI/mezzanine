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
} from '@angular/core';
import {
  textFieldClasses as classes,
  TextFieldSize,
} from '@mezzanine-ui/core/text-field';
import clsx from 'clsx';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';

/**
 * 文字欄位容器元件，包裝 input/textarea 並提供前後綴、清除按鈕、狀態樣式。
 *
 * 自動偵測內部 input/textarea 的 focus/blur/hover/value 狀態。
 * 支援 `clearable` 清除按鈕、`prefix`/`suffix` 插槽、`disabled`/`readonly`/`error`/`warning` 狀態。
 *
 * @example
 * ```html
 * import { MznTextField } from '@mezzanine-ui/ng/text-field';
 *
 * <mzn-text-field>
 *   <input placeholder="請輸入" />
 * </mzn-text-field>
 *
 * <mzn-text-field [clearable]="true" (cleared)="onClear()">
 *   <span prefix>$</span>
 *   <input placeholder="金額" />
 *   <span suffix>.00</span>
 * </mzn-text-field>
 * ```
 */
@Component({
  selector: 'mzn-text-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznClearActions],
  host: {
    '[class]': 'hostClasses()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  template: `
    @if (hasPrefix()) {
      <div [class]="classes.prefix">
        <ng-content select="[prefix]" />
      </div>
    }
    <ng-content />
    @if (!hideSuffixWhenClearable() && shouldShowClearable()) {
      <mzn-clear-actions
        type="clearable"
        [class]="classes.clearIcon"
        (clicked)="onClearClick($event)"
      />
    }
    <div [class]="suffixClasses()" [hidden]="!hasSuffix()">
      <ng-content select="[suffix]" />
      @if (hideSuffixWhenClearable() && clearable()) {
        <mzn-clear-actions
          type="clearable"
          [class]="classes.clearIcon"
          (clicked)="onClearClick($event)"
        />
      }
    </div>
  `,
})
export class MznTextField implements AfterViewInit {
  protected readonly classes = classes;

  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  private readonly isHovered = signal(false);
  private readonly isFocused = signal(false);
  private readonly isTyping = signal(false);
  private readonly hasValue = signal(false);

  /**
   * 是否處於 active 狀態。
   * @default false
   */
  readonly active = input(false);

  /**
   * 是否顯示清除按鈕。
   * @default false
   */
  readonly clearable = input(false);

  /**
   * 強制顯示清除按鈕，即使欄位目前無值。
   * @default false
   */
  readonly forceShowClearable = input(false);

  /**
   * 當清除按鈕顯示時，隱藏後綴內容（[suffix]）。
   * @default false
   */
  readonly hideSuffixWhenClearable = input(false);

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否為錯誤狀態。
   * @default false
   */
  readonly error = input(false);

  /**
   * 是否全寬。
   * @default true
   */
  readonly fullWidth = input(true);

  /**
   * 是否有前綴內容（用於計算 slim gap）。
   * @default false
   */
  readonly hasPrefix = input(false);

  /**
   * 是否有後綴內容（用於計算 slim gap）。
   * @default false
   */
  readonly hasSuffix = input(false);

  /**
   * 是否唯讀。
   * @default false
   */
  readonly readonly = input(false);

  /**
   * 欄位尺寸。
   * @default 'main'
   */
  readonly size = input<TextFieldSize>('main');

  /**
   * 是否正在輸入。
   */
  readonly typing = input<boolean>();

  /**
   * 是否為警告狀態。
   * @default false
   */
  readonly warning = input(false);

  /** 清除按鈕點擊事件。 */
  readonly cleared = output<MouseEvent>();

  protected readonly resolvedTyping = computed((): boolean => {
    if (this.disabled() || this.readonly()) return false;

    const typingProp = this.typing();

    return typingProp !== undefined ? typingProp : this.isTyping();
  });

  protected readonly shouldShowClearable = computed((): boolean => {
    if (!this.clearable()) return false;
    if (this.forceShowClearable()) return true;
    return (
      this.hasValue() &&
      (this.isHovered() || this.resolvedTyping() || this.isFocused())
    );
  });

  protected readonly suffixClasses = computed((): string =>
    clsx(classes.suffix, {
      [classes.suffixOverlay]: this.hideSuffixWhenClearable(),
    }),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.slimGap]:
        (this.hasPrefix() && this.hasSuffix()) || this.clearable(),
      [classes.main]: this.size() === 'main',
      [classes.sub]: this.size() === 'sub',
      [classes.clearable]: this.clearable(),
      [classes.clearing]: this.shouldShowClearable(),
      [classes.disabled]: this.disabled(),
      [classes.error]: this.error(),
      [classes.fullWidth]: this.fullWidth(),
      [classes.readonly]: this.readonly(),
      [classes.typing]: this.resolvedTyping(),
      [classes.active]: this.active(),
      [classes.warning]: this.warning(),
    }),
  );

  ngAfterViewInit(): void {
    const host = this.hostRef.nativeElement;

    const input = host.querySelector('input, textarea') as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;

    if (!input) return;

    const checkValue = (): void => {
      this.hasValue.set((input.value || '').trim().length > 0);
    };

    const handleInput = (): void => {
      this.isTyping.set(true);
      checkValue();
    };

    const handleFocus = (): void => {
      this.isFocused.set(true);
      checkValue();
    };

    const handleBlur = (): void => {
      this.isTyping.set(false);
      this.isFocused.set(false);
      checkValue();
    };

    checkValue();

    input.addEventListener('input', handleInput);
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('change', checkValue);

    this.destroyRef.onDestroy(() => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('change', checkValue);
    });
  }

  protected onMouseEnter(): void {
    this.isHovered.set(true);
  }

  protected onMouseLeave(): void {
    this.isHovered.set(false);
  }

  protected onClearClick(event: MouseEvent): void {
    if (!this.disabled() && !this.readonly()) {
      this.cleared.emit(event);
    }
  }
}
