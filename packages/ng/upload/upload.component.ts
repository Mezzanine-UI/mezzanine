import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  uploadClasses as classes,
  UploadMode,
  UploadSize,
} from '@mezzanine-ui/core/upload';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznUploader } from './uploader.component';
import { MznUploadItem } from './upload-item.component';
import { UploadFile } from './upload-file';

/** A single hint item displayed inside or outside the uploader area. */
export interface UploadHint {
  /** The label text of the hint. */
  label: string;
  /** The icon/severity type of the hint. */
  type?: 'info' | 'error';
}

/** Customizable label texts for the uploader area. */
export interface UploaderLabelConfig {
  /** Label text for "Click to upload" link in dropzone mode. @default 'Click to upload' */
  clickToUpload?: string;
  /** Label text for upload error state. */
  error?: string;
  /** Label text for upload success state. */
  success?: string;
  /** Label text for idle upload state. */
  uploadLabel?: string;
  /** Label text for uploading (in-progress) state. */
  uploadingLabel?: string;
}

/** Customizable icon definitions for uploader actions and states. */
export interface UploaderIconConfig {
  /** Icon for the delete action. */
  delete?: IconDefinition;
  /** Icon for document type files. */
  document?: IconDefinition;
  /** Icon for the download action. */
  download?: IconDefinition;
  /** Icon for upload error state. */
  error?: IconDefinition;
  /** Icon for the reload/retry action. */
  reload?: IconDefinition;
  /** Icon for upload success state. */
  success?: IconDefinition;
  /** Icon for the upload action. Overrides the default upload icon. */
  upload?: IconDefinition;
  /** Icon for the zoom in action. */
  zoom?: IconDefinition;
}

/**
 * Aria labels for the upload picture card sub-components.
 * Useful for customizing text for internationalization.
 */
export interface UploadAriaLabels {
  /** Aria label for cancel upload button. @default 'Cancel upload' */
  cancelUpload?: string;
  /** Aria label for the click-to-replace overlay label. @default 'Click to Replace' */
  clickToReplace?: string;
  /** Aria label for delete button. @default 'Delete file' */
  delete?: string;
  /** Aria label for download button. @default 'Download file' */
  download?: string;
  /** Aria label for reload/retry button. @default 'Retry upload' */
  reload?: string;
  /** Aria label for uploading status. @default 'Uploading' */
  uploading?: string;
  /** Aria label for zoom in button. @default 'Zoom in image' */
  zoomIn?: string;
}

/**
 * 主要的上傳編排元件，整合 `MznUploader` 與 `MznUploadItem` 組成完整的上傳體驗。
 *
 * 透過 `mode` 切換不同的上傳顯示模式（清單、按鈕清單、卡片等），
 * 自動管理檔案選取與檔案清單的渲染。
 *
 * @example
 * ```html
 * import { MznUpload } from '@mezzanine-ui/ng/upload';
 *
 * <mzn-upload
 *   [files]="uploadedFiles"
 *   mode="list"
 *   accept=".pdf,.doc"
 *   (fileSelect)="onFileSelect($event)"
 *   (filesChange)="onFilesChange($event)"
 * />
 * ```
 *
 * @see MznUploader
 * @see MznUploadItem
 */
@Component({
  selector: 'mzn-upload',
  standalone: true,
  imports: [MznUploader, MznUploadItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <mzn-uploader
      [accept]="accept()"
      [disabled]="effectiveDisabled()"
      [externalHints]="resolvedHints()"
      [fillWidth]="uploaderFillWidth()"
      [icon]="uploaderIcon()"
      [id]="id()"
      [label]="uploaderLabel()"
      [multiple]="multiple()"
      [name]="name()"
      [type]="uploaderType()"
      (filesSelected)="onFilesSelected($event)"
    >
      <ng-content />
    </mzn-uploader>

    @if (files().length > 0) {
      <div [class]="listClasses()">
        @for (file of files(); track file.id) {
          <mzn-upload-item
            [disabled]="disabled()"
            [errorIcon]="errorIcon()"
            [errorMessage]="file.errorMessage ?? errorMessage()"
            [fileName]="file.name"
            [progress]="file.progress"
            [showFileSize]="showFileSize()"
            [size]="size()"
            [status]="file.status"
            [thumbnailUrl]="file.thumbnailUrl"
            (remove)="onRemoveFile(file)"
          />
        }
      </div>
    }
  `,
})
export class MznUpload {
  /**
   * 接受的檔案類型（對應 input accept 屬性）。
   */
  readonly accept = input<string>();

  /**
   * 圖片卡片模式下的 Aria 標籤設定，用於無障礙與國際化。
   */
  readonly ariaLabels = input<UploadAriaLabels>();

  /**
   * 目前已上傳的檔案數量，可用於顯示「n / maxFiles」等計數資訊。
   */
  readonly currentCount = input<number>();

  /**
   * 是否禁用上傳功能。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 拖放區域（dropzone）內顯示的提示項目列表。
   * 僅在 list 或 card-wall 模式下可見。
   */
  readonly dropzoneHints = input<readonly UploadHint[]>();

  /**
   * 上傳失敗時預設顯示的錯誤圖示（IconDefinition）。
   * 當檔案狀態為 'error' 且未提供個別 errorIcon 時使用。
   */
  readonly errorIcon = input<IconDefinition>();

  /**
   * 上傳失敗時預設顯示的錯誤訊息。
   * 當檔案狀態為 'error' 且未提供個別 errorMessage 時使用。
   */
  readonly errorMessage = input<string>();

  /**
   * 目前的上傳檔案清單。
   * @default []
   */
  readonly files = input<readonly UploadFile[]>([]);

  /**
   * 顯示於 Uploader 外部的提示項目列表，所有模式下皆可見。
   */
  readonly hints = input<readonly UploadHint[]>();

  /**
   * 傳遞給隱藏 file input 元素的 id 屬性。
   * 同時作為 input 的 name，方便搭配 label 元素使用。
   */
  readonly id = input<string>();

  /**
   * 最多允許上傳的檔案數量。達到上限時自動禁用 Uploader。
   */
  readonly maxFiles = input<number>();

  /**
   * 上傳元件的顯示模式。
   * @default 'list'
   */
  readonly mode = input<UploadMode>('list');

  /**
   * 是否允許多檔上傳。
   * @default true
   */
  readonly multiple = input(true);

  /**
   * 傳遞給 input 元素的 name 屬性。
   */
  readonly name = input<string>();

  /**
   * 是否在清單模式下顯示檔案大小。
   * @default true
   */
  readonly showFileSize = input(true);

  /**
   * 上傳元件的尺寸，影響 UploadItem 的顯示大小。
   * @default 'main'
   */
  readonly size = input<UploadSize>('main');

  /**
   * 上傳器圖示設定，傳遞給內部的 `MznUploader`。
   */
  readonly uploaderIcon = input<UploaderIconConfig>();

  /**
   * 上傳器標籤文字設定，傳遞給內部的 `MznUploader`。
   */
  readonly uploaderLabel = input<UploaderLabelConfig>();

  /** 檔案清單變更時觸發（例如移除檔案）。 */
  readonly filesChange = output<readonly UploadFile[]>();

  /** 使用者選擇新檔案時觸發。 */
  readonly fileSelect = output<FileList>();

  /**
   * 使用者選取的檔案數量超過 `maxFiles` 上限時觸發。
   * 超出的檔案將被捨棄，並透過此 output 通知消費端。
   */
  readonly maxFilesExceeded = output<{
    maxFiles: number;
    selectedCount: number;
  }>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.hostCards]:
        this.mode() === 'cards' || this.mode() === 'card-wall',
    }),
  );

  protected readonly listClasses = computed((): string =>
    clsx(
      this.mode() === 'button-list'
        ? classes.uploadButtonList
        : classes.uploadList,
      {
        [classes.uploadListCards]:
          this.mode() === 'cards' || this.mode() === 'card-wall',
      },
    ),
  );

  protected readonly uploaderType = computed((): 'base' | 'button' =>
    this.mode() === 'button-list' ? 'button' : 'base',
  );

  protected readonly uploaderFillWidth = computed(
    (): boolean => this.mode() === 'list' || this.mode() === 'basic-list',
  );

  /** Auto-disable uploader when maxFiles limit is reached. */
  protected readonly effectiveDisabled = computed((): boolean => {
    const max = this.maxFiles();

    if (this.disabled()) return true;
    if (max == null) return false;

    return this.files().length >= max;
  });

  /**
   * Merges `hints` and `dropzoneHints` for dropzone modes.
   * In dropzone modes (list, card-wall), both hint arrays are combined and
   * passed to the uploader's `externalHints`. In other modes only `hints` is used.
   */
  protected readonly resolvedHints = computed(
    (): readonly UploadHint[] | undefined => {
      const mode = this.mode();
      const hints = this.hints();
      const dropzoneHints = this.dropzoneHints();
      const isDropzoneMode = mode === 'list' || mode === 'card-wall';

      if (isDropzoneMode && dropzoneHints && dropzoneHints.length > 0) {
        return [...(hints ?? []), ...dropzoneHints];
      }

      return hints;
    },
  );

  protected onFilesSelected(fileList: FileList): void {
    const maxFiles = this.maxFiles();

    if (maxFiles != null) {
      const currentCount = this.files().length;
      const selectedCount = fileList.length;
      const totalCount = currentCount + selectedCount;

      if (totalCount > maxFiles) {
        this.maxFilesExceeded.emit({ maxFiles, selectedCount });
      }
    }

    this.fileSelect.emit(fileList);
  }

  protected onRemoveFile(file: UploadFile): void {
    const updated = this.files().filter((f) => f.id !== file.id);

    this.filesChange.emit(updated);
  }
}
