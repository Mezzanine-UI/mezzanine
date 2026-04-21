import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import {
  uploaderClasses as classes,
  UploaderMode,
  UploadType,
} from '@mezzanine-ui/core/upload';
import {
  DangerousFilledIcon,
  IconDefinition,
  InfoFilledIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import clsx from 'clsx';
import {
  UploadHint,
  UploaderIconConfig,
  UploaderLabelConfig,
} from './upload.component';

/**
 * 檔案上傳觸發器元件，提供隱藏的 file input、點擊選檔、拖放上傳與 label 包裹。
 *
 * 依 `type` 與 `mode` 組合出三種外觀：
 * - `type='base' + mode='dropzone'`：可拖放的大塊區域，含 "Drag the file here or" 與 "Click to upload" 連結
 * - `type='base' + mode='basic'`：純圖示 + 標籤的小塊上傳區
 * - `type='button'`：一般按鈕
 *
 * 透過 `exportAs` 可取得實例以程式呼叫 `click()` / `reset()`。
 *
 * @example
 * ```html
 * import { MznUploader } from '@mezzanine-ui/ng/upload';
 *
 * <label mznUploader accept=".pdf" mode="dropzone" [multiple]="true"
 *        (upload)="onUpload($event)"></label>
 * ```
 *
 * @see MznUpload
 */
@Component({
  selector: '[mznUploader]',
  exportAs: 'mznUploader',
  standalone: true,
  imports: [MznIcon, MznTypography, MznButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(dragenter)': 'onDragEnter($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(dragover)': 'onDragOver($event)',
    '(drop)': 'onDrop($event)',
  },
  template: `
    @if (type() === 'base' && isDropzone()) {
      <div [class]="contentClass">
        <i mznIcon [class]="uploadIconClass" [icon]="resolvedUploadIcon()"></i>
        <p mznTypography [class]="uploadLabelClass">
          @if (resolvedUploadLabel()) {
            {{ resolvedUploadLabel() }}<span>&nbsp;</span>
          }
          <span
            [class]="clickToUploadClass"
            (click)="handleClickToUpload($event)"
          >
            {{ resolvedClickToUploadLabel() }}
          </span>
        </p>
        @for (hint of hints(); track hint.label) {
          <p mznTypography [class]="fillWidthHintsClass">
            {{ hint.label }}
          </p>
        }
      </div>
    }
    @if (type() === 'base' && !isDropzone()) {
      <div [class]="contentClass">
        <i mznIcon [class]="uploadIconClass" [icon]="resolvedUploadIcon()"></i>
        <p mznTypography [class]="uploadLabelClass">
          {{ resolvedUploadLabel() }}
        </p>
      </div>
    }
    @if (type() === 'button') {
      <button
        mznButton
        type="button"
        [disabled]="disabled()"
        iconType="leading"
        [icon]="resolvedUploadIcon()"
        (click)="handleClickToUpload($event)"
      >
        <i mznIcon [icon]="resolvedUploadIcon()" [size]="16"></i>
        <p
          mznTypography
          align="center"
          color="text-fixed-light"
          variant="button-highlight"
          [class]="uploadButtonTextClass"
        >
          {{ resolvedUploadLabel() }}
        </p>
      </button>
    }
    <input
      #inputEl
      type="file"
      [class]="inputClass"
      [accept]="accept()"
      [attr.aria-disabled]="disabled()"
      [attr.id]="finalInputId()"
      [multiple]="multiple()"
      [name]="resolvedName()"
      [disabled]="disabled()"
      (change)="handleChange($event)"
    />
    <ng-content />
    @if (externalHints() && externalHints()!.length > 0) {
      <ul [class]="externalHintsClass">
        @for (hint of externalHints(); track hint.label) {
          <li [class]="externalHintClass(hint.type)">
            <i
              mznIcon
              [icon]="hintIcon(hint.type)"
              [color]="hint.type === 'error' ? 'error' : 'info'"
              [size]="14"
            ></i>
            {{ hint.label }}
          </li>
        }
      </ul>
    }
  `,
})
export class MznUploader {
  /** 接受的檔案類型（對應 input accept 屬性）。 */
  readonly accept = input<string>();

  /** 是否禁用上傳器。@default false */
  readonly disabled = input(false);

  /**
   * 拖放區域內部顯示的提示文字列表（僅 `mode='dropzone'` 時顯示）。
   * 對應 React `hints` prop。
   */
  readonly hints = input<readonly UploadHint[]>();

  /**
   * 於 label 外部顯示的提示列表（`<ul class="mzn-uploader__external-hints">`）。
   * 對應 React `externalHints` prop，所有模式下皆可見。
   */
  readonly externalHints = input<readonly UploadHint[]>();

  /** 隱藏 file input 元素的 id 屬性，方便與外部 label 綁定。 */
  readonly id = input<string>();

  /** 是否填滿父容器寬度（只在 `type='base' + mode='dropzone'` 有效）。@default false */
  readonly fillWidth = input(false);

  /** 上傳器圖示設定，可覆蓋預設上傳圖示與各操作圖示。 */
  readonly icon = input<UploaderIconConfig>();

  /**
   * 透傳給隱藏 `<input>` 元素的任意屬性集合。
   * 透過 `Renderer2.setAttribute` 於變更時套用，對應 React `inputProps`。
   */
  readonly inputProps = input<Record<string, string | number | boolean>>();

  /** 上傳器文字設定（uploadLabel / clickToUpload 等）。 */
  readonly label = input<UploaderLabelConfig>();

  /**
   * 上傳器模式。
   * - `'basic'`：基本模式，只顯示圖示與標籤
   * - `'dropzone'`：拖放模式，顯示 "Drag the file here or Click to upload" 並支援拖放
   *
   * @default 'basic'
   */
  readonly mode = input<UploaderMode>('basic');

  /** 是否允許多檔上傳。@default false */
  readonly multiple = input(false);

  /** 隱藏 file input 元素的 name 屬性。 */
  readonly name = input<string>();

  /**
   * 上傳器的觸發類型。
   * - `'base'`：label + 拖放區/基本區（依 `mode` 決定）
   * - `'button'`：按鈕觸發
   *
   * @default 'base'
   */
  readonly type = input<UploadType>('base');

  /** 使用者選擇檔案後觸發（拖放或點擊選檔），對應 React `onUpload`。 */
  readonly upload = output<File[]>();

  /** 原生 input change 事件透傳，對應 React `onChange`。 */
  readonly change = output<Event>();

  private readonly _inputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  private readonly _generatedId = `mzn-uploader-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;

  private readonly _renderer = inject(Renderer2);

  /** 暴露給 parent component 直接存取 native input element。 */
  get inputRef(): ElementRef<HTMLInputElement> {
    return this._inputRef();
  }

  /** 以程式方式觸發檔案選擇對話框（對應 React `controllerRef`）。 */
  click(): void {
    if (this.disabled()) return;

    this._inputRef().nativeElement.click();
  }

  /** 清除 input value 以重新選擇同一檔案。 */
  reset(): void {
    this._inputRef().nativeElement.value = '';
  }

  protected readonly dragging = signal(false);

  protected readonly isDropzone = computed(
    (): boolean => this.mode() === 'dropzone',
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.type(this.type()), {
      [classes.fillWidth]:
        this.type() !== 'button' && this.isDropzone() && this.fillWidth(),
      [classes.dragging]: this.dragging(),
      [classes.disabled]: this.type() !== 'button' && this.disabled(),
    }),
  );

  protected readonly finalInputId = computed(
    (): string =>
      this.id() ??
      (this.inputProps()?.['id'] as string | undefined) ??
      this._generatedId,
  );

  protected readonly resolvedName = computed(
    (): string =>
      this.name() ??
      (this.inputProps()?.['name'] as string | undefined) ??
      this.finalInputId(),
  );

  protected readonly resolvedUploadIcon = computed(
    (): IconDefinition => this.icon()?.upload ?? UploadIcon,
  );

  protected readonly resolvedUploadLabel = computed((): string => {
    const custom = this.label()?.uploadLabel;

    if (custom != null) return custom;

    return this.isDropzone() ? 'Drag the file here or' : 'Upload';
  });

  protected readonly resolvedClickToUploadLabel = computed(
    (): string => this.label()?.clickToUpload ?? 'Click to upload',
  );

  protected readonly inputClass = classes.input;
  protected readonly contentClass = classes.uploadContent;
  protected readonly uploadIconClass = classes.uploadIcon;
  protected readonly uploadLabelClass = classes.uploadLabel;
  protected readonly clickToUploadClass = classes.clickToUpload;
  protected readonly fillWidthHintsClass = classes.fillWidthHints;
  protected readonly uploadButtonTextClass = classes.uploadButtonText;
  protected readonly externalHintsClass = classes.externalHints;

  protected externalHintClass(type: 'info' | 'error' | undefined): string {
    return classes.externalHint(type ?? 'info');
  }

  protected hintIcon(type: 'info' | 'error' | undefined): IconDefinition {
    return type === 'error' ? DangerousFilledIcon : InfoFilledIcon;
  }

  constructor() {
    // Transparently apply `inputProps` to native input via Renderer2.
    // The viewChild signal re-triggers this effect once the view is ready.
    effect(() => {
      const props = this.inputProps();
      const ref = this._inputRef();

      if (!props) return;

      const el = ref.nativeElement;

      for (const [key, value] of Object.entries(props)) {
        if (key === 'id' || key === 'name') continue;

        if (value === false || value == null) {
          this._renderer.removeAttribute(el, key);
        } else {
          this._renderer.setAttribute(el, key, String(value));
        }
      }
    });
  }

  protected handleClickToUpload(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.click();
  }

  protected handleChange(event: Event): void {
    this.change.emit(event);

    const input = event.target as HTMLInputElement;
    const fileList = input.files;

    if (fileList && fileList.length > 0) {
      const files: File[] = [];

      for (let i = 0; i < fileList.length; i += 1) {
        files.push(fileList[i]);
      }

      this.upload.emit(files);
    }

    // Allow selecting the same file again.
    input.value = '';
  }

  protected onDragEnter(event: DragEvent): void {
    if (this.disabled() || this.type() === 'button') return;

    event.preventDefault();
    event.stopPropagation();
    this.dragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    if (this.disabled() || this.type() === 'button') return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const { clientX: x, clientY: y } = event;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      this.dragging.set(false);
    }
  }

  protected onDragOver(event: DragEvent): void {
    if (this.disabled() || this.type() === 'button') return;

    event.preventDefault();
    event.stopPropagation();
  }

  protected onDrop(event: DragEvent): void {
    if (this.disabled() || this.type() === 'button') return;

    event.preventDefault();
    event.stopPropagation();
    this.dragging.set(false);

    const fileList = event.dataTransfer?.files;

    if (fileList && fileList.length > 0) {
      const files: File[] = [];

      for (let i = 0; i < fileList.length; i += 1) {
        files.push(fileList[i]);
      }

      this.upload.emit(files);
    }
  }
}
