import {
  AfterViewInit,
  computed,
  DestroyRef,
  Directive,
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

/**
 * Attribute directive 負責套用 `mzn-text-field*` host classes 與追蹤 input/textarea
 * 的 focus/blur/input/hover 狀態。
 *
 * 設計上對應 React `<TextField>` component 的「host 元素行為層」:
 * - 所有 text-field 相關 class 的計算與綁定
 * - 自動偵測 descendant `<input>` / `<textarea>` 的 hasValue / isTyping / isFocused
 * - hover 狀態追蹤
 *
 * **不負責**渲染 prefix / suffix / clearable button 等 children slot,這是
 * `MznTextField` component 的職責。consuming component(例如 `MznSelectTrigger`、
 * `MznInput`)若需要完整 slot 行為,可透過 composition 使用 `MznTextField`;
 * 若只需要「host class + 狀態追蹤」,可透過 `hostDirectives` 掛上本 directive。
 *
 * @see MznTextField
 */
@Directive({
  selector: '[mznTextFieldHost]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class MznTextFieldHost implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly isHovered = signal(false);
  protected readonly isFocused = signal(false);
  protected readonly isTypingInternal = signal(false);
  protected readonly hasValueSignal = signal(false);

  /**
   * 是否處於 active 狀態(focused / opened / expanded)。
   * @default false
   */
  readonly active = input(false);

  /**
   * 是否啟用清除按鈕邏輯(會影響 host class 上的 `mzn-text-field--clearable`)。
   * @default false
   */
  readonly clearable = input(false);

  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否為錯誤狀態。
   * @default false
   */
  readonly error = input(false);

  /**
   * 是否全寬(對應 `mzn-text-field--full-width`)。
   * @default true
   */
  readonly fullWidth = input(true);

  /**
   * 是否有 prefix 子元素(影響 slim-gap 計算)。
   * @default false
   */
  readonly hasPrefix = input(false);

  /**
   * 是否有 suffix 子元素(影響 slim-gap 計算)。
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
   * 外部覆蓋 typing 狀態;未提供時由內部自動偵測。
   */
  readonly typing = input<boolean>();

  /**
   * 是否為警告狀態。
   * @default false
   */
  readonly warning = input(false);

  /** hover 狀態發生變化時發出。 */
  readonly hoveredChange = output<boolean>();

  /** focus 狀態發生變化時發出。 */
  readonly focusedChange = output<boolean>();

  /** value 狀態發生變化時發出(有值 / 無值)。 */
  readonly hasValueChange = output<boolean>();

  readonly resolvedTyping = computed((): boolean => {
    if (this.disabled() || this.readonly()) return false;

    const typingProp = this.typing();

    return typingProp !== undefined ? typingProp : this.isTypingInternal();
  });

  readonly isHoveredState = computed((): boolean => this.isHovered());
  readonly isFocusedState = computed((): boolean => this.isFocused());
  readonly hasValueState = computed((): boolean => this.hasValueSignal());

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.slimGap]:
        (this.hasPrefix() && this.hasSuffix()) || this.clearable(),
      [classes.main]: this.size() === 'main',
      [classes.sub]: this.size() === 'sub',
      [classes.clearable]: this.clearable(),
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

    const inputEl = host.querySelector('input, textarea') as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;

    if (!inputEl) return;

    const checkValue = (): void => {
      const next = (inputEl.value || '').trim().length > 0;
      const prev = this.hasValueSignal();

      if (next !== prev) {
        this.hasValueSignal.set(next);
        this.hasValueChange.emit(next);
      }
    };

    const handleInput = (): void => {
      this.isTypingInternal.set(true);
      checkValue();
    };

    const handleFocus = (): void => {
      this.isFocused.set(true);
      this.focusedChange.emit(true);
      checkValue();
    };

    const handleBlur = (): void => {
      this.isTypingInternal.set(false);
      this.isFocused.set(false);
      this.focusedChange.emit(false);
      checkValue();
    };

    checkValue();

    inputEl.addEventListener('input', handleInput);
    inputEl.addEventListener('focus', handleFocus);
    inputEl.addEventListener('blur', handleBlur);
    inputEl.addEventListener('change', checkValue);

    this.destroyRef.onDestroy(() => {
      inputEl.removeEventListener('input', handleInput);
      inputEl.removeEventListener('focus', handleFocus);
      inputEl.removeEventListener('blur', handleBlur);
      inputEl.removeEventListener('change', checkValue);
    });
  }

  protected onMouseEnter(): void {
    this.isHovered.set(true);
    this.hoveredChange.emit(true);
  }

  protected onMouseLeave(): void {
    this.isHovered.set(false);
    this.hoveredChange.emit(false);
  }
}
