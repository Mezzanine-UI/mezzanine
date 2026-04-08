import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  uploaderClasses as classes,
  UploadType,
} from '@mezzanine-ui/core/upload';
import {
  DangerousFilledIcon,
  IconDefinition,
  InfoFilledIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import clsx from 'clsx';
import {
  UploadHint,
  UploaderIconConfig,
  UploaderLabelConfig,
} from './upload.component';

/**
 * 檔案上傳觸發器元件，提供隱藏的 file input 與拖放支援。
 *
 * 可透過 `type` 切換基本拖放區域或按鈕觸發模式，
 * 並透過 `<ng-content>` 自訂觸發區域的內容。
 * 支援拖放上傳與點擊上傳兩種互動方式。
 *
 * @example
 * ```html
 * import { MznUploader } from '@mezzanine-ui/ng/upload';
 *
 * <label mznUploader accept=".pdf,.doc" [multiple]="true" (filesSelected)="onSelect($event)">
 *   <span>點擊或拖放檔案至此</span>
 * </label>
 * ```
 *
 * @see MznUpload
 */
@Component({
  selector: '[mznUploader]',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'openFileDialog()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
    '[attr.accept]': 'null',
    '[attr.disabled]': 'null',
    '[attr.externalHints]': 'null',
    '[attr.id]': 'null',
    '[attr.fillWidth]': 'null',
    '[attr.icon]': 'null',
    '[attr.label]': 'null',
    '[attr.multiple]': 'null',
    '[attr.name]': 'null',
    '[attr.type]': 'null',
  },
  template: `
    <input
      #fileInput
      type="file"
      [class]="inputClass"
      [accept]="accept()"
      [attr.id]="id() ?? null"
      [multiple]="multiple()"
      [name]="name() ?? id() ?? null"
      [disabled]="disabled()"
      (change)="onInputChange($event)"
    />
    <div [class]="contentClass">
      <i mznIcon [class]="uploadIconClass" [icon]="resolvedUploadIcon()"></i>
      <span [class]="uploadLabelClass">{{ resolvedUploadLabel() }}</span>
      <ng-content />
    </div>
    @if (externalHints() && externalHints()!.length > 0) {
      <ul [class]="externalHintsClass">
        @for (hint of externalHints(); track hint.label) {
          <li [class]="externalHintClass(hint.type)">
            <i mznIcon [icon]="hintIcon(hint.type)"></i>
            {{ hint.label }}
          </li>
        }
      </ul>
    }
  `,
})
export class MznUploader {
  /**
   * 接受的檔案類型（對應 input accept 屬性）。
   */
  readonly accept = input<string>();

  /**
   * 是否禁用上傳器。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 顯示於上傳器外部（label 元素下方）的提示項目列表，所有模式下皆可見。
   */
  readonly externalHints = input<readonly UploadHint[]>();

  /**
   * 傳遞給隱藏 file input 元素的 id 屬性，方便搭配 label 的 htmlFor/for 使用。
   */
  readonly id = input<string>();

  /**
   * 是否填滿父容器寬度。
   * @default false
   */
  readonly fillWidth = input(false);

  /**
   * 上傳器圖示設定，可覆蓋預設的上傳圖示。
   */
  readonly icon = input<UploaderIconConfig>();

  /**
   * 上傳器標籤文字設定。
   */
  readonly label = input<UploaderLabelConfig>();

  /**
   * 是否允許多檔上傳。
   * @default false
   */
  readonly multiple = input(false);

  /**
   * 傳遞給隱藏 file input 元素的 name 屬性。
   */
  readonly name = input<string>();

  /**
   * 上傳器的觸發類型。
   * @default 'base'
   */
  readonly type = input<UploadType>('base');

  /** 使用者選擇檔案後觸發，發送 FileList。 */
  readonly filesSelected = output<FileList>();

  private readonly fileInputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly dragging = signal(false);

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.type(this.type()), {
      [classes.fillWidth]: this.fillWidth(),
      [classes.dragging]: this.dragging(),
      [classes.disabled]: this.disabled(),
    }),
  );

  protected readonly inputClass = classes.input;

  protected readonly contentClass = classes.uploadContent;

  protected readonly uploadIconClass = classes.uploadIcon;

  protected readonly uploadLabelClass = classes.uploadLabel;

  protected readonly externalHintsClass = classes.externalHints;

  protected readonly resolvedUploadIcon = computed(
    (): IconDefinition => this.icon()?.upload ?? UploadIcon,
  );

  protected readonly resolvedUploadLabel = computed(
    (): string => this.label()?.uploadLabel ?? 'Upload',
  );

  protected externalHintClass(type: 'info' | 'error' | undefined): string {
    return classes.externalHint(type ?? 'info');
  }

  protected hintIcon(type: 'info' | 'error' | undefined): IconDefinition {
    return type === 'error' ? DangerousFilledIcon : InfoFilledIcon;
  }

  openFileDialog(): void {
    if (this.disabled()) return;

    this.fileInputRef().nativeElement.click();
  }

  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.filesSelected.emit(input.files);
    }

    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disabled()) {
      this.dragging.set(true);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragging.set(false);

    if (this.disabled()) return;

    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      this.filesSelected.emit(files);
    }
  }
}
