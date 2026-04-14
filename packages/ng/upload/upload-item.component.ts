import {
  AfterViewChecked,
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
  uploadItemClasses as classes,
  UploadItemSize,
  UploadItemStatus,
  UploadItemType,
} from '@mezzanine-ui/core/upload';
import {
  CloseIcon,
  DangerousFilledIcon,
  DownloadIcon,
  FileIcon,
  IconDefinition,
  ResetIcon,
  SpinnerIcon,
  TrashIcon,
} from '@mezzanine-ui/icons';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznSpin } from '@mezzanine-ui/ng/spin';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import clsx from 'clsx';
import { extractFileNameFromUrl, isImageFile } from './upload-utils';
import { MznUploadPictureCard } from './upload-picture-card.component';

/**
 * 單一上傳檔案的列表項目元件。
 *
 * 根據 `status` 渲染三種狀態：`loading`（旋轉圖 + 取消）、`done`（下載）、`error`（重試）。
 * 檔案結束（`done` / `error`）時額外顯示刪除按鈕。`type` 為 `'thumbnail'` 時以縮圖呈現，
 * 圖片檔案會內嵌 `MznUploadPictureCard` 作為縮圖。
 *
 * @example
 * ```html
 * import { MznUploadItem } from '@mezzanine-ui/ng/upload';
 *
 * <div mznUploadItem
 *   [file]="file"
 *   status="done"
 *   (delete)="onDelete($event)"
 *   (download)="onDownload($event)"
 * ></div>
 * ```
 *
 * @see MznUpload
 */
@Component({
  selector: '[mznUploadItem]',
  exportAs: 'mznUploadItem',
  standalone: true,
  imports: [
    MznIcon,
    MznTypography,
    MznSpin,
    MznClearActions,
    MznUploadPictureCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <div
      [class]="containerClass"
      role="group"
      [attr.aria-disabled]="disabled()"
      [attr.tabindex]="disabled() ? -1 : 0"
    >
      <div [class]="contentWrapperClass">
        <div [class]="iconWrapperClass">
          @if (type() === 'thumbnail') {
            @if (resolvedIsImage()) {
              <div
                mznUploadPictureCard
                size="minor"
                [file]="file()"
                [url]="url()"
                [class]="thumbnailClass"
              ></div>
            } @else {
              <div [class]="thumbnailClass">
                <i
                  mznIcon
                  [icon]="fileIcon"
                  [class]="iconClass"
                  [size]="16"
                ></i>
              </div>
            }
          } @else {
            <i
              mznIcon
              [icon]="resolvedIcon()"
              [class]="iconClass"
              [size]="16"
            ></i>
          }
        </div>
        <div [class]="contentClass">
          <p #nameEl mznTypography [class]="nameClass" [ellipsis]="true">{{
            resolvedFileName()
          }}</p>
          @if (shouldShowFileSize()) {
            <p mznTypography [class]="fontSizeClass">{{
              formattedFileSize()
            }}</p>
          }
        </div>
      </div>
      <div [class]="actionsClass">
        @if (status() === 'loading') {
          <div [class]="loadingIconClass">
            <div mznSpin [loading]="true" size="minor"></div>
          </div>
          <button
            mznClearActions
            type="standard"
            [class]="closeIconClass"
            (clicked)="onCancel($event)"
          ></button>
        }
        @if (status() === 'done' && !disabled()) {
          <i
            mznIcon
            [icon]="downloadIconDef"
            [class]="downloadIconClass"
            [size]="16"
            (click)="onDownload($event)"
          ></i>
        }
        @if (status() === 'error' && !disabled()) {
          <i
            mznIcon
            [icon]="resetIconDef"
            [class]="resetIconClass"
            [size]="16"
            (click)="onReload($event)"
          ></i>
        }
      </div>
    </div>
    @if (isFinished() && !disabled()) {
      <div [class]="deleteContentClass">
        <i
          mznIcon
          [icon]="trashIconDef"
          [class]="deleteIconClass"
          [size]="16"
          color="neutral-solid"
          (click)="onDelete($event)"
        ></i>
      </div>
    }
    @if (status() === 'error' && errorMessage()) {
      <div [class]="errorMessageClass">
        <i
          mznIcon
          [icon]="resolvedErrorIcon()"
          [class]="errorIconClass"
          [size]="14"
          color="error"
        ></i>
        <p
          mznTypography
          color="text-error"
          variant="caption"
          [class]="errorMessageTextClass"
          >{{ errorMessage() }}</p
        >
      </div>
    }
  `,
})
export class MznUploadItem implements AfterViewChecked {
  /** 要顯示的 File 物件（優先於 url 用於檔名與大小）。 */
  readonly file = input<File>();

  /** 檔案 URL。當 file 未提供時用於顯示與判斷圖片類型。 */
  readonly url = input<string>();

  /** 檔案識別碼。 */
  readonly id = input<string>();

  /**
   * 預覽形式：
   * - `'icon'` 顯示檔案圖示
   * - `'thumbnail'` 顯示縮圖（圖片檔案內嵌 MznUploadPictureCard）
   *
   * @default 'icon'
   */
  readonly type = input<UploadItemType>('icon');

  /** 上傳項目的尺寸。@default 'main' */
  readonly size = input<UploadItemSize>('main');

  /** 上傳項目的狀態。@default 'loading' */
  readonly status = input<UploadItemStatus>('loading');

  /** 明確指定的檔案大小（bytes），優先於 file.size。 */
  readonly fileSize = input<number>();

  /** 是否顯示檔案大小（done/error 狀態且有大小資料時）。@default true */
  readonly showFileSize = input(true);

  /** 是否禁用操作按鈕。@default false */
  readonly disabled = input(false);

  /** 錯誤訊息，僅在 status 為 'error' 時顯示。 */
  readonly errorMessage = input<string>();

  /** 自訂錯誤圖示。未提供時使用 DangerousFilledIcon。 */
  readonly errorIcon = input<IconDefinition>();

  /** 自訂檔案類型圖示。未提供時使用 FileIcon。 */
  readonly icon = input<IconDefinition>();

  /** 覆寫自動解析的檔名。 */
  readonly fileName = input<string>();

  /** 保留兼容舊版的 thumbnail URL（等同 url）。 */
  readonly thumbnailUrl = input<string>();

  /** 使用者點擊取消（loading 狀態）。 */
  readonly cancel = output<MouseEvent>();

  /** 使用者點擊下載（done 狀態）。 */
  readonly download = output<MouseEvent>();

  /** 使用者點擊重新上傳（error 狀態）。 */
  readonly reload = output<MouseEvent>();

  /** 使用者點擊刪除（finished 狀態）。 */
  readonly delete = output<MouseEvent>();

  /** 保留兼容舊版 API 的 remove 輸出（同 delete）。 */
  readonly remove = output<MouseEvent>();

  // Icon defs (constants)
  protected readonly fileIcon = FileIcon;
  protected readonly closeIconDef = CloseIcon;
  protected readonly downloadIconDef = DownloadIcon;
  protected readonly resetIconDef = ResetIcon;
  protected readonly spinnerIconDef = SpinnerIcon;
  protected readonly trashIconDef = TrashIcon;

  // Class constants
  protected readonly containerClass = classes.container;
  protected readonly iconClass = classes.icon;
  protected readonly thumbnailClass = classes.thumbnail;
  protected readonly contentWrapperClass = classes.contentWrapper;
  protected readonly contentClass = classes.content;
  protected readonly nameClass = classes.name;
  protected readonly fontSizeClass = classes.fontSize;
  protected readonly actionsClass = classes.actions;
  protected readonly closeIconClass = classes.closeIcon;
  protected readonly deleteContentClass = classes.deleteContent;
  protected readonly deleteIconClass = classes.deleteIcon;
  protected readonly downloadIconClass = classes.downloadIcon;
  protected readonly errorMessageClass = classes.errorMessage;
  protected readonly errorIconClass = classes.errorIcon;
  protected readonly errorMessageTextClass = classes.errorMessageText;
  protected readonly loadingIconClass = classes.loadingIcon;
  protected readonly resetIconClass = classes.resetIcon;
  protected readonly iconWrapperClass = classes.icon;

  private readonly _nameEl =
    viewChild<ElementRef<HTMLParagraphElement>>('nameEl');

  private readonly _isTruncated = signal(false);

  protected readonly resolvedIsImage = computed((): boolean =>
    isImageFile(this.file(), this.url() ?? this.thumbnailUrl()),
  );

  protected readonly resolvedIcon = computed(
    (): IconDefinition => this.icon() ?? FileIcon,
  );

  protected readonly resolvedErrorIcon = computed(
    (): IconDefinition => this.errorIcon() ?? DangerousFilledIcon,
  );

  protected readonly resolvedFileName = computed((): string => {
    const explicit = this.fileName();

    if (explicit) return explicit;

    const file = this.file();
    const url = this.url() ?? this.thumbnailUrl();

    if (file?.name && !url) return file.name;
    if (url) return extractFileNameFromUrl(url);

    return '';
  });

  protected readonly isFinished = computed((): boolean =>
    /done|error/.test(this.status()),
  );

  protected readonly formattedFileSize = computed((): string => {
    const file = this.file();
    const explicit = this.fileSize();
    const bytes = file?.size ?? explicit;

    if (bytes == null) return '';
    if (bytes === 0) return '0 B';

    const k = 1024;
    const units = ['B', 'KB', 'MB'];
    let size = bytes;
    let i = 0;

    while (size >= k && i < units.length - 1) {
      size /= k;
      i += 1;
    }

    return `${Math.round(size * 10) / 10} ${units[i]}`;
  });

  protected readonly shouldShowFileSize = computed((): boolean => {
    if (!this.showFileSize()) return false;
    if (!this.isFinished()) return false;

    return this.formattedFileSize().length > 0;
  });

  protected readonly shouldSingleLineCenter = computed((): boolean =>
    Boolean(
      this.type() === 'thumbnail' &&
        this.resolvedFileName() &&
        !this.shouldShowFileSize(),
    ),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size()), {
      [classes.alignCenter]: this.status() !== 'done',
      [classes.error]: this.status() === 'error',
      [classes.disabled]: this.disabled(),
      [classes.singleLineContent]: this.shouldSingleLineCenter(),
    }),
  );

  ngAfterViewChecked(): void {
    const el = this._nameEl()?.nativeElement;

    if (!el) {
      if (this._isTruncated()) this._isTruncated.set(false);
      return;
    }

    const isTruncated = el.scrollWidth > el.clientWidth;

    if (isTruncated !== this._isTruncated()) {
      this._isTruncated.set(isTruncated);
    }
  }

  protected onCancel(event: MouseEvent): void {
    event.stopPropagation();
    this.cancel.emit(event);
  }

  protected onDownload(event: MouseEvent): void {
    event.stopPropagation();
    this.download.emit(event);
  }

  protected onReload(event: MouseEvent): void {
    event.stopPropagation();
    this.reload.emit(event);
  }

  protected onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(event);
    this.remove.emit(event);
  }
}
