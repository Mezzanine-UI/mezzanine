import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  defaultUploadPictureCardErrorMessage,
  uploadClasses as classes,
  UploadMode,
  UploadSize,
  UploadItemStatus,
  UploaderMode,
} from '@mezzanine-ui/core/upload';
import {
  DangerousFilledIcon,
  IconDefinition,
  InfoFilledIcon,
} from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import clsx from 'clsx';
import { MznUploader } from './uploader.component';
import { MznUploadItem } from './upload-item.component';
import { MznUploadPictureCard } from './upload-picture-card.component';
import { MznUploadMediaPreviewModal } from './media-preview-modal.component';
import { UploadFile } from './upload-file';
import { isImageFile } from './upload-utils';

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

/** Aria labels for the upload picture card sub-components. */
export interface UploadAriaLabels {
  cancelUpload?: string;
  clickToReplace?: string;
  delete?: string;
  download?: string;
  reload?: string;
  uploading?: string;
  zoomIn?: string;
}

/** Event payload for file-level actions (delete/download/reload/zoomIn). */
export interface UploadFileActionEvent {
  fileId: string;
  file: File;
}

/** Event payload for maxFilesExceeded. */
export interface UploadMaxFilesExceededEvent {
  maxFiles: number;
  selectedCount: number;
  currentCount: number;
}

/** Result payload shapes accepted by `uploadHandler`. */
export type UploadHandlerResult =
  | readonly UploadFile[]
  | readonly { id: string }[]
  | void
  | undefined;

/**
 * Handler invoked when the user selects files. Mirrors React `onUpload`.
 *
 * - Return `UploadFile[]` to replace temp files with server-assigned entries.
 * - Return `{ id: string }[]` to keep the temp entry but assign a real id.
 * - Return void to mark all temp files as `done`.
 * - Throw / reject to mark all temp files as `error`.
 *
 * Call `setProgress(index, progress)` to update upload progress per file.
 */
export type UploadHandler = (
  files: File[],
  setProgress?: (fileIndex: number, progress: number) => void,
) => Promise<UploadHandlerResult> | UploadHandlerResult;

interface UploaderModeConfig {
  type: 'base' | 'button';
  mode: UploaderMode;
}

/**
 * 主要的上傳編排元件，整合 `MznUploader`、`MznUploadItem`、`MznUploadPictureCard`
 * 成完整的上傳體驗。
 *
 * 支援五種顯示模式（`list` / `basic-list` / `button-list` / `cards` / `card-wall`），
 * 並透過 `uploadHandler` 管理上傳生命週期（含進度回報、成功替換、失敗降級）。
 * 在 cards 模式 + `maxFiles=1` 時自動啟用 Replace 流程。
 *
 * @example
 * ```html
 * import { MznUpload } from '@mezzanine-ui/ng/upload';
 *
 * <div mznUpload mode="list" accept=".pdf,.doc"
 *      [files]="files" [multiple]="true"
 *      [uploadHandler]="handler"
 *      (filesChange)="files = $event"
 *      (delete)="onDelete($event)"></div>
 * ```
 *
 * @see MznUploader
 * @see MznUploadItem
 * @see MznUploadPictureCard
 */
@Component({
  selector: '[mznUpload]',
  exportAs: 'mznUpload',
  standalone: true,
  imports: [
    MznIcon,
    MznUploader,
    MznUploadItem,
    MznUploadPictureCard,
    MznUploadMediaPreviewModal,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    @if (topUploaderConfig(); as topCfg) {
      <label
        mznUploader
        [accept]="accept()"
        [disabled]="effectiveDisabled()"
        [id]="topInputId()"
        [multiple]="multiple()"
        [label]="uploaderLabel()"
        [icon]="uploaderIcon()"
        [inputProps]="inputProps()"
        [hints]="dropzoneHints()"
        [mode]="topCfg.mode"
        [type]="topCfg.type"
        [fillWidth]="true"
        [name]="name()"
        (upload)="handleUpload($event)"
      ></label>
    }

    @if (mode() === 'card-wall' && hints() && hints()!.length) {
      <ul [class]="fillWidthHintsClass">
        @for (hint of hints(); track hint.label) {
          <li [class]="hintClass(hint.type)">
            <i
              mznIcon
              [icon]="hintIcon(hint.type)"
              [color]="hint.type === 'info' ? 'info' : 'error'"
              [size]="14"
            ></i>
            {{ hint.label }}
          </li>
        }
      </ul>
    }

    @if (!shouldUsePictureCard()) {
      <div [class]="uploadButtonListClass">
        <label
          mznUploader
          #mainUploader
          [accept]="accept()"
          [disabled]="effectiveDisabled()"
          [id]="id()"
          [multiple]="multiple()"
          [label]="uploaderLabel()"
          [icon]="uploaderIcon()"
          [inputProps]="inputProps()"
          [hints]="uploaderHints()"
          [mode]="mainUploaderConfig().mode"
          [type]="mainUploaderConfig().type"
          [fillWidth]="mainUploaderFillWidth()"
          [name]="name()"
          (upload)="handleUpload($event)"
        ></label>
        @if (hints() && hints()!.length && mode() !== 'card-wall') {
          <ul [class]="listHintsClass()">
            @for (hint of hints(); track hint.label) {
              <li [class]="hintClass(hint.type)">
                <i
                  mznIcon
                  [icon]="hintIcon(hint.type)"
                  [color]="hint.type === 'info' ? 'info' : 'error'"
                  [size]="14"
                ></i>
                {{ hint.label }}
              </li>
            }
          </ul>
        }
      </div>
    }

    <div [class]="uploadListClass()">
      @if (shouldUsePictureCard()) {
        @for (file of imageFiles(); track file.id) {
          <div
            mznUploadPictureCard
            [ariaLabels]="ariaLabels()"
            [file]="file.file"
            [url]="file.url"
            [id]="file.id"
            [status]="file.status"
            [size]="cardSize()"
            [disabled]="disabled()"
            [errorMessage]="file.errorMessage"
            [downloadEnabled]="!isSingleFileCardMode()"
            [zoomInEnabled]="!isSingleFileCardMode()"
            [replaceEnabled]="isSingleFileCardMode()"
            (deleted)="handleDelete(file.id)"
            (reloaded)="handleReload(file.id)"
            (downloaded)="handleDownload(file.id)"
            (zoomed)="handleZoomIn(file.id)"
            (replaced)="triggerReplace(file.id, $event)"
          ></div>
        }
        @for (file of nonImageFiles(); track file.id) {
          <div
            mznUploadPictureCard
            [ariaLabels]="ariaLabels()"
            [file]="file.file"
            [url]="file.url"
            [id]="file.id"
            [status]="file.status"
            [size]="cardSize()"
            [disabled]="disabled()"
            [errorMessage]="file.errorMessage"
            [downloadEnabled]="!isSingleFileCardMode()"
            (deleted)="handleDelete(file.id)"
            (reloaded)="handleReload(file.id)"
            (downloaded)="handleDownload(file.id)"
          ></div>
        }
        @if (shouldShowInlineCardUploader()) {
          <label
            mznUploader
            [accept]="accept()"
            [disabled]="effectiveDisabled()"
            [id]="inlineCardInputId()"
            [multiple]="multiple()"
            [label]="uploaderLabel()"
            [icon]="uploaderIcon()"
            [inputProps]="inputProps()"
            [hints]="dropzoneHints()"
            [mode]="mainUploaderConfig().mode"
            [type]="mainUploaderConfig().type"
            [name]="name()"
            (upload)="handleUpload($event)"
          ></label>
        }
        @if (isSingleFileCardMode()) {
          <input
            #replaceInput
            type="file"
            [accept]="accept()"
            style="display: none;"
            (change)="handleReplaceChange($event)"
          />
        }
      } @else {
        @for (file of nonImageFiles(); track file.id) {
          <div
            mznUploadItem
            [disabled]="disabled()"
            [errorIcon]="errorIcon()"
            [errorMessage]="file.errorMessage ?? errorMessage()"
            [file]="file.file"
            [fileName]="file.name"
            [id]="file.id"
            [showFileSize]="showFileSize()"
            [size]="size()"
            [status]="file.status"
            type="icon"
            [url]="file.url ?? file.thumbnailUrl"
            (cancel)="handleDelete(file.id)"
            (delete)="handleDelete(file.id)"
            (download)="handleDownload(file.id)"
            (reload)="handleReload(file.id)"
          ></div>
        }
        @for (file of imageFiles(); track file.id) {
          <div
            mznUploadItem
            [disabled]="disabled()"
            [errorIcon]="errorIcon()"
            [errorMessage]="file.errorMessage ?? errorMessage()"
            [file]="file.file"
            [fileName]="file.name"
            [id]="file.id"
            [showFileSize]="showFileSize()"
            [size]="size()"
            [status]="file.status"
            type="thumbnail"
            [url]="file.url ?? file.thumbnailUrl"
            (cancel)="handleDelete(file.id)"
            (delete)="handleDelete(file.id)"
            (download)="handleDownload(file.id)"
            (reload)="handleReload(file.id)"
          ></div>
        }
      }
    </div>

    @if (mode() === 'cards' && hints() && hints()!.length) {
      <ul [class]="fillWidthHintsClass">
        @for (hint of hints(); track hint.label) {
          <li [class]="hintClass(hint.type)">
            <i
              mznIcon
              [icon]="hintIcon(hint.type)"
              [color]="hint.type === 'info' ? 'info' : 'error'"
              [size]="14"
            ></i>
            {{ hint.label }}
          </li>
        }
      </ul>
    }

    @if (showPreview()) {
      <mzn-upload-media-preview-modal
        [open]="isPreviewOpen()"
        [mediaItems]="previewMediaItems()"
        (close)="closePreview()"
      />
    }
  `,
})
export class MznUpload {
  /** 接受的檔案類型（對應 input accept）。 */
  readonly accept = input<string>();

  /** 圖片卡片模式下的 Aria 標籤設定。 */
  readonly ariaLabels = input<UploadAriaLabels>();

  /** 是否禁用上傳功能。@default false */
  readonly disabled = input(false);

  /** 拖放區域（dropzone）內顯示的提示項目列表。 */
  readonly dropzoneHints = input<readonly UploadHint[]>();

  /** 上傳失敗時預設錯誤圖示。 */
  readonly errorIcon = input<IconDefinition>();

  /** 上傳失敗時預設錯誤訊息。 */
  readonly errorMessage = input<string>();

  /** 目前的上傳檔案清單。 */
  readonly files = input<readonly UploadFile[]>([]);

  /** Uploader 區塊外的提示列表。 */
  readonly hints = input<readonly UploadHint[]>();

  /** 隱藏 file input 元素的 id 屬性。 */
  readonly id = input<string>();

  /** 透傳給隱藏 `<input>` 元素的任意屬性集合。 */
  readonly inputProps = input<Record<string, string | number | boolean>>();

  /** 最多允許上傳的檔案數量。 */
  readonly maxFiles = input<number>();

  /** 上傳元件的顯示模式。@default 'list' */
  readonly mode = input<UploadMode>('list');

  /** 是否允許多檔上傳。@default false */
  readonly multiple = input(false);

  /** 隱藏 file input 元素的 name 屬性。 */
  readonly name = input<string>();

  /** 是否在清單模式下顯示檔案大小。@default true */
  readonly showFileSize = input(true);

  /** 上傳元件尺寸。@default 'main' */
  readonly size = input<UploadSize>('main');

  /**
   * 上傳處理函式，對應 React `onUpload`。
   * 使用者選擇檔案後，元件會先建立臨時 UploadFile，再呼叫此 handler。
   * 支援三種返回型別：`UploadFile[]`、`{ id }[]`、或 void。
   */
  readonly uploadHandler = input<UploadHandler>();

  /** Uploader 圖示設定。 */
  readonly uploaderIcon = input<UploaderIconConfig>();

  /** Uploader 文字設定。 */
  readonly uploaderLabel = input<UploaderLabelConfig>();

  /** 檔案清單變更，對應 React `onChange`。 */
  readonly filesChange = output<readonly UploadFile[]>();

  /** 使用者選擇新檔案（副通知），對應 React `onUpload` 的 event 形式。 */
  readonly upload = output<File[]>();

  /** 刪除檔案時觸發，對應 React `onDelete`。 */
  readonly delete = output<UploadFileActionEvent>();

  /** 下載檔案時觸發。 */
  readonly download = output<UploadFileActionEvent>();

  /** 重試上傳時觸發。 */
  readonly reload = output<UploadFileActionEvent>();

  /** 放大預覽時觸發。 */
  readonly zoomIn = output<UploadFileActionEvent>();

  /** 使用者選取數量超過 `maxFiles` 時觸發。 */
  readonly maxFilesExceeded = output<UploadMaxFilesExceededEvent>();

  /** 保留兼容：原有 fileSelect（等同 upload）。 */
  readonly fileSelect = output<File[]>();

  private readonly _replaceInput =
    viewChild<ElementRef<HTMLInputElement>>('replaceInput');

  private readonly _destroyRef = inject(DestroyRef);

  // Mutable cache of the latest files (mirrors React `filesRef`)
  private _filesCache: readonly UploadFile[] = [];

  private _replaceFileId: string | null = null;

  protected readonly previewFile = signal<UploadFile | null>(null);

  protected readonly isPreviewOpen = signal(false);

  protected readonly previewObjectUrl = signal<string | null>(null);

  constructor() {
    // Keep an up-to-date mutable cache so handlers see the freshest file list.
    effect(() => {
      this._filesCache = this.files();
    });

    // Manage preview object URL lifecycle.
    effect((onCleanup) => {
      const file = this.previewFile();

      if (!file || file.url || !file.file) {
        this.previewObjectUrl.set(null);
        return;
      }

      if (!isImageFile(file.file, file.url)) {
        this.previewObjectUrl.set(null);
        return;
      }

      const objectUrl = URL.createObjectURL(file.file);

      this.previewObjectUrl.set(objectUrl);
      onCleanup(() => URL.revokeObjectURL(objectUrl));
    });

    this._destroyRef.onDestroy(() => {
      const objectUrl = this.previewObjectUrl();

      if (objectUrl) URL.revokeObjectURL(objectUrl);
    });
  }

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.hostCards]: this.mode() === 'cards',
    }),
  );

  protected readonly shouldUsePictureCard = computed((): boolean =>
    /cards|card-wall/.test(this.mode()),
  );

  protected readonly cardSize = computed((): UploadSize => this.size());

  protected readonly isSingleFileCardMode = computed(
    (): boolean => this.shouldUsePictureCard() && this.maxFiles() === 1,
  );

  protected readonly effectiveDisabled = computed((): boolean => {
    const max = this.maxFiles();

    if (this.disabled()) return true;
    if (max == null) return false;

    return this.files().length >= max;
  });

  protected readonly uploadButtonListClass = classes.uploadButtonList;
  protected readonly fillWidthHintsClass = classes.fillWidthHints;

  protected hintClass(type: 'info' | 'error' | undefined): string {
    return classes.hint(type ?? 'info');
  }

  protected hintIcon(type: 'info' | 'error' | undefined): IconDefinition {
    return type === 'error' ? DangerousFilledIcon : InfoFilledIcon;
  }

  protected readonly listHintsClass = computed((): string =>
    this.mode() === 'list' ? classes.fillWidthHints : classes.hints,
  );

  protected readonly uploadListClass = computed((): string =>
    clsx(classes.uploadList, {
      [classes.uploadListCards]: this.shouldUsePictureCard(),
    }),
  );

  protected readonly mainUploaderConfig = computed((): UploaderModeConfig => {
    switch (this.mode()) {
      case 'list':
        return { mode: 'dropzone', type: 'base' };
      case 'basic-list':
        return { mode: 'basic', type: 'base' };
      case 'button-list':
        return { mode: 'basic', type: 'button' };
      case 'cards':
      case 'card-wall':
      default:
        return { mode: 'basic', type: 'base' };
    }
  });

  protected readonly mainUploaderFillWidth = computed(
    (): boolean => this.mode() === 'list' || this.mode() === 'basic-list',
  );

  protected readonly topUploaderConfig = computed(
    (): UploaderModeConfig | null =>
      this.mode() === 'card-wall' ? { mode: 'dropzone', type: 'base' } : null,
  );

  protected readonly uploaderHints = computed(
    (): readonly UploadHint[] | undefined =>
      this.mainUploaderConfig().mode === 'dropzone'
        ? this.dropzoneHints()
        : undefined,
  );

  protected readonly topInputId = computed((): string | undefined => {
    const id = this.id();

    return id ? `${id}-top` : undefined;
  });

  protected readonly inlineCardInputId = computed((): string | undefined => {
    const id = this.id();

    return id ? `${id}-inline` : undefined;
  });

  protected readonly shouldShowInlineCardUploader = computed((): boolean => {
    if (this.topUploaderConfig()) return false;
    if (!this.isSingleFileCardMode()) return true;

    return this.imageFiles().length === 0 && this.nonImageFiles().length === 0;
  });

  protected readonly imageFiles = computed((): readonly UploadFile[] =>
    this.files().filter((f) => isImageFile(f.file, f.url)),
  );

  protected readonly nonImageFiles = computed((): readonly UploadFile[] =>
    this.files().filter((f) => !isImageFile(f.file, f.url)),
  );

  protected readonly previewIsImage = computed((): boolean => {
    const file = this.previewFile();

    return file ? isImageFile(file.file, file.url) : false;
  });

  protected readonly previewImageSrc = computed((): string => {
    const file = this.previewFile();

    if (!file) return '';

    return file.url ?? this.previewObjectUrl() ?? '';
  });

  protected readonly showPreview = computed(
    (): boolean =>
      !!this.previewFile() && this.previewIsImage() && !!this.previewImageSrc(),
  );

  protected readonly previewMediaItems = computed((): readonly string[] => {
    const src = this.previewImageSrc();

    return src ? [src] : [];
  });

  // --- Event handlers -------------------------------------------------------

  protected async handleUpload(selectedFiles: File[]): Promise<void> {
    if (!selectedFiles.length) return;

    this.upload.emit(selectedFiles);
    this.fileSelect.emit(selectedFiles);

    // If a replace is in progress, drop the target file from the current list.
    if (this._replaceFileId != null) {
      const id = this._replaceFileId;

      this._replaceFileId = null;
      this._filesCache = this._filesCache.filter((f) => f.id !== id);
    }

    // Enforce maxFiles limit (slice + emit overflow).
    const maxFiles = this.maxFiles();
    let filesToUpload = selectedFiles;

    if (maxFiles != null) {
      const currentCount = this._filesCache.length;
      const selectedCount = selectedFiles.length;
      const totalCount = currentCount + selectedCount;

      if (totalCount > maxFiles) {
        const allowedCount = Math.max(0, maxFiles - currentCount);

        if (allowedCount <= 0) {
          this.maxFilesExceeded.emit({
            maxFiles,
            selectedCount,
            currentCount,
          });

          return;
        }

        filesToUpload = selectedFiles.slice(0, allowedCount);
        this.maxFilesExceeded.emit({
          maxFiles,
          selectedCount,
          currentCount,
        });
      }
    }

    // Build temp entries and emit "loading" state.
    const batchId = Date.now();
    const tempFiles: UploadFile[] = filesToUpload.map((file, index) => ({
      file,
      id: `temp-${batchId}-${index}`,
      name: file.name,
      status: 'loading' as UploadItemStatus,
      progress: 0,
    }));

    const tempIdToIndex = new Map<string, number>();

    tempFiles.forEach((tf, idx) => tempIdToIndex.set(tf.id, idx));

    this.emitChange([...this._filesCache, ...tempFiles]);

    const handler = this.uploadHandler();

    if (!handler) {
      const next = this._filesCache.map((f) =>
        tempFiles.some((tf) => tf.id === f.id)
          ? { ...f, status: 'done' as UploadItemStatus, progress: 100 }
          : f,
      );

      this.emitChange(next);

      return;
    }

    const setProgress = (fileIndex: number, progress: number): void => {
      const target = tempFiles[fileIndex];

      if (!target) return;

      const next = this._filesCache.map((f) =>
        f.id === target.id ? { ...f, progress } : f,
      );

      this.emitChange(next);
    };

    try {
      const result = await Promise.resolve(handler(filesToUpload, setProgress));

      if (Array.isArray(result) && result.length > 0) {
        const first = result[0];
        const isFull = first != null && 'status' in (first as object);

        if (isFull) {
          const backend = result as readonly UploadFile[];
          const next = this._filesCache.map((f) => {
            const idx = tempIdToIndex.get(f.id);

            if (idx != null && idx < backend.length) {
              const be = backend[idx];

              if (be.status === 'error') {
                return {
                  ...be,
                  errorMessage:
                    be.errorMessage ??
                    this.errorMessage() ??
                    defaultUploadPictureCardErrorMessage,
                };
              }

              return be;
            }

            return f;
          });

          this.emitChange(next);
        } else {
          const ids = result as readonly { id: string }[];
          const next = this._filesCache.map((f) => {
            const idx = tempIdToIndex.get(f.id);

            if (idx != null && idx < ids.length) {
              return {
                ...f,
                id: ids[idx].id,
                status: 'done' as UploadItemStatus,
                progress: 100,
              };
            }

            return f;
          });

          this.emitChange(next);
        }
      } else {
        const next = this._filesCache.map((f) =>
          tempFiles.some((tf) => tf.id === f.id)
            ? { ...f, status: 'done' as UploadItemStatus, progress: 100 }
            : f,
        );

        this.emitChange(next);
      }
    } catch {
      const next = this._filesCache.map((f) => {
        if (tempFiles.some((tf) => tf.id === f.id)) {
          return {
            ...f,
            status: 'error' as UploadItemStatus,
            errorMessage:
              f.errorMessage ??
              this.errorMessage() ??
              defaultUploadPictureCardErrorMessage,
          };
        }

        return f;
      });

      this.emitChange(next);
    }
  }

  protected handleDelete(fileId: string): void {
    const file = this._filesCache.find((f) => f.id === fileId);

    if (!file) return;

    const next = this._filesCache.filter((f) => f.id !== fileId);

    this.emitChange(next);

    if (file.file) {
      this.delete.emit({ fileId, file: file.file });
    }
  }

  protected handleReload(fileId: string): void {
    const file = this._filesCache.find((f) => f.id === fileId);

    if (!file) return;

    const next = this._filesCache.map((f) =>
      f.id === fileId
        ? { ...f, status: 'loading' as UploadItemStatus, progress: 0 }
        : f,
    );

    this.emitChange(next);

    if (file.file) {
      this.reload.emit({ fileId, file: file.file });
    }
  }

  protected handleDownload(fileId: string): void {
    const file = this._filesCache.find((f) => f.id === fileId);

    if (file?.file) {
      this.download.emit({ fileId, file: file.file });
    }
  }

  protected handleZoomIn(fileId: string): void {
    const file = this._filesCache.find((f) => f.id === fileId);

    if (!file) return;

    this.previewFile.set(file);
    this.isPreviewOpen.set(true);

    if (file.file) {
      this.zoomIn.emit({ fileId, file: file.file });
    }
  }

  protected triggerReplace(fileId: string, event: MouseEvent): void {
    event.stopPropagation();
    this._replaceFileId = fileId;
    this._replaceInput()?.nativeElement.click();
  }

  protected handleReplaceChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;

    input.value = '';

    if (!fileList || fileList.length === 0) return;

    const files: File[] = [];

    for (let i = 0; i < fileList.length; i += 1) {
      files.push(fileList[i]);
    }

    this.handleUpload(files);
  }

  protected closePreview(): void {
    this.isPreviewOpen.set(false);
    this.previewFile.set(null);
  }

  private emitChange(next: readonly UploadFile[]): void {
    this._filesCache = next;
    this.filesChange.emit(next);
  }
}
