import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { textareaClasses as classes } from '@mezzanine-ui/core/textarea';
import { ResizeHandleIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTextField } from '@mezzanine-ui/ng/text-field';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/** Textarea 的視覺狀態類型。 */
export type TextareaType = 'default' | 'warning' | 'error';

/** Textarea 的 resize 行為。 */
export type TextareaResize = 'none' | 'both' | 'horizontal' | 'vertical';

/**
 * 多行文字輸入區域元件，支援禁用、唯讀、警告與錯誤等視覺狀態。
 *
 * 以 `MznTextField` 作為外框容器，`type` 控制視覺樣式。
 * `resize` prop 控制拖曳調整大小行為，設為非 `none` 時會顯示右下角拖曳圖示。
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
 * ```
 */
@Component({
  selector: '[mznTextarea]',
  host: {
    '[attr.disabled]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.readonly]': 'null',
    '[attr.resize]': 'null',
    '[attr.rows]': 'null',
    '[attr.type]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTextField, MznIcon],
  providers: [provideValueAccessor(MznTextarea)],
  template: `
    <div
      mznTextField
      [class]="hostClasses()"
      [disabled]="isDisabled()"
      [error]="type() === 'error'"
      [readonly]="isReadonly()"
      [warning]="type() === 'warning'"
    >
      <textarea
        #textareaEl
        [class]="textareaClasses()"
        [attr.placeholder]="placeholder()"
        [attr.rows]="rows()"
        [disabled]="isDisabled()"
        [readOnly]="isReadonly()"
        [style.resize]="resize()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onBlur()"
      ></textarea>
      @if (resize() !== 'none') {
        <i mznIcon [class]="resizerClass" [icon]="resizeIcon" [size]="16"></i>
      }
    </div>
  `,
})
export class MznTextarea implements ControlValueAccessor {
  protected readonly resizerClass = classes.resizer;
  protected readonly resizeIcon = ResizeHandleIcon;

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected readonly value = signal('');

  /**
   * 是否停用（僅在 type="default" 時生效）。
   * @default false
   */
  readonly disabled = input(false);

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

  protected readonly hostClasses = computed((): string => clsx(classes.host));

  protected readonly textareaClasses = computed((): string =>
    clsx(classes.textarea),
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

    this.value.set(newValue);
    this.onChangeFn(newValue);
    this.valueChange.emit(newValue);
  }

  protected onBlur(): void {
    this.onTouchedFn();
  }
}
