import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import { textareaClasses as classes } from '@mezzanine-ui/core/textarea';
import { ResizeHandleIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/** Textarea 的視覺狀態類型。 */
export type TextareaType = 'default' | 'warning' | 'error';

/** Textarea 的 resize 行為。 */
export type TextareaResize = 'none' | 'both' | 'horizontal' | 'vertical';

/**
 * 多行文字輸入區域元件，支援禁用、唯讀、警告與錯誤等視覺狀態。
 *
 * Host 元素本身就是 text field 外框（`mzn-text-field mzn-textarea`），對齊 React
 * `<Textarea>` 以 `TextField` 作為根節點的 DOM 結構。`type` 控制視覺樣式，
 * `resize` 控制拖曳調整大小行為，設為非 `none` 時會顯示右下角拖曳圖示。
 * 實作 `ControlValueAccessor`，可搭配 Angular Forms。
 *
 * @example
 * ```html
 * import { MznTextarea } from '@mezzanine-ui/ng/textarea';
 *
 * <div mznTextarea placeholder="請輸入內容..." [rows]="4" ></div>
 * <div mznTextarea resize="vertical" [rows]="3" ></div>
 * <div mznTextarea type="error" placeholder="此欄位有誤" ></div>
 * <div mznTextarea [disabled]="true" placeholder="已停用" ></div>
 * <div mznTextarea [fullWidth]="false" ></div>
 * ```
 *
 * @see MznInput 單行文字輸入元件
 */
@Component({
  selector: '[mznTextarea]',
  host: {
    role: 'presentation',
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.readonly]': 'null',
    '[attr.resize]': 'null',
    '[attr.rows]': 'null',
    '[attr.textareaClassName]': 'null',
    '[attr.textareaId]': 'null',
    '[attr.type]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  providers: [provideValueAccessor(MznTextarea)],
  template: `
    <textarea
      [class]="textareaClasses()"
      [attr.id]="textareaId()"
      [attr.placeholder]="placeholder()"
      [attr.rows]="rows()"
      [disabled]="isDisabled()"
      [readOnly]="isReadonly()"
      [style.resize]="resize()"
      [value]="value()"
      (blur)="onBlur()"
      (input)="onInput($event)"
      (mousedown)="onMouseDown()"
    ></textarea>
    @if (resize() !== 'none') {
      <i mznIcon [class]="resizerClass" [icon]="resizeIcon" [size]="16"></i>
    }
  `,
})
export class MznTextarea implements ControlValueAccessor {
  protected readonly resizerClass = classes.resizer;
  protected readonly resizeIcon = ResizeHandleIcon;

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected readonly value = signal('');

  /**
   * Mirrors React `TextField`'s internal typing state: set on mousedown and
   * input, cleared on blur.
   */
  private readonly isTyping = signal(false);

  /**
   * 是否停用（僅在 type="default" 時生效）。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * Whether the textarea should take the full width of its container.
   * @default true
   */
  readonly fullWidth = input(true);

  /** 佔位文字。 */
  readonly placeholder = input<string>();

  /**
   * 是否唯讀（僅在 type="default" 時生效）。
   * @default false
   */
  readonly readonly = input(false);

  /**
   * CSS resize 行為。
   * @default 'none'
   */
  readonly resize = input<TextareaResize>('none');

  /** 文字區域行數。 */
  readonly rows = input<number>();

  /** ClassName apply to the native textarea element. */
  readonly textareaClassName = input<string>();

  /**
   * `id` of the native textarea element, e.g. for `<label for>`. React takes
   * it as a native prop; the Angular host is the frame `<div>`, so it is
   * forwarded explicitly.
   */
  readonly textareaId = input<string>();

  /**
   * 視覺狀態類型。
   * @default 'default'
   */
  readonly type = input<TextareaType>('default');

  /** 值變更事件。 */
  readonly valueChange = output<string>();

  protected readonly isDisabled = computed(
    (): boolean => this.type() === 'default' && this.disabled(),
  );

  protected readonly isReadonly = computed(
    (): boolean => this.type() === 'default' && this.readonly(),
  );

  /**
   * The frame shows the readonly state only when not disabled — React hands
   * `TextField` either `disabled` or `readonly`, with disabled winning.
   */
  private readonly isFieldReadonly = computed(
    (): boolean => this.isReadonly() && !this.isDisabled(),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      textFieldClasses.host,
      {
        [textFieldClasses.main]: true,
        [textFieldClasses.disabled]: this.isDisabled(),
        [textFieldClasses.error]: this.type() === 'error',
        [textFieldClasses.fullWidth]: this.fullWidth(),
        [textFieldClasses.readonly]: this.isFieldReadonly(),
        [textFieldClasses.typing]:
          this.isTyping() && !this.isDisabled() && !this.isFieldReadonly(),
        [textFieldClasses.warning]: this.type() === 'warning',
      },
      classes.host,
    ),
  );

  protected readonly textareaClasses = computed((): string =>
    clsx(classes.textarea, this.textareaClassName()),
  );

  // ControlValueAccessor
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;

    this.isTyping.set(true);
    this.value.set(newValue);
    this.onChangeFn(newValue);
    this.valueChange.emit(newValue);
  }

  protected onMouseDown(): void {
    this.isTyping.set(true);
  }

  protected onBlur(): void {
    this.isTyping.set(false);
    this.onTouchedFn();
  }
}
