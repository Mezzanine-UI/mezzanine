import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import {
  uploadPictureCardClasses as classes,
  UploadItemStatus,
  UploadPictureCardImageFit,
  UploadPictureCardSize,
} from '@mezzanine-ui/core/upload';
import {
  DownloadIcon,
  FileIcon,
  IconDefinition,
  ImageIcon,
  ResetIcon,
  TrashIcon,
  ZoomInIcon,
} from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznSpin } from '@mezzanine-ui/ng/spin';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import clsx from 'clsx';
import { extractFileNameFromUrl, isImageFile } from './upload-utils';

/**
 * Aria labels for the upload picture card sub-components.
 */
export interface UploadPictureCardAriaLabels {
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
 * 以卡片形式呈現的上傳檔案元件，支援圖片與非圖片的預覽與操作。
 *
 * 根據 `status` 切換載入中、完成、錯誤三種外觀，並以 hover/focus 顯示下載、縮放、刪除、
 * 重試等操作。單檔 card 模式可透過 parent 組件觸發 `replaced` 事件進行替換。
 *
 * @example
 * ```html
 * import { MznUploadPictureCard } from '@mezzanine-ui/ng/upload';
 *
 * <div mznUploadPictureCard [file]="file" status="loading"
 *      (deleted)="onDelete($event)"></div>
 *
 * <div mznUploadPictureCard [url]="imageUrl" status="done" imageFit="cover"
 *      (zoomed)="onZoom($event)"
 *      (downloaded)="onDownload($event)"
 *      (deleted)="onDelete($event)"></div>
 * ```
 *
 * @see MznUpload
 */
@Component({
  selector: '[mznUploadPictureCard]',
  exportAs: 'mznUploadPictureCard',
  standalone: true,
  imports: [MznButton, MznIcon, MznSpin, MznClearActions, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': '"group"',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'hostTabIndex()',
    '(click)': 'onHostClick($event)',
    '(keydown)': 'onHostKeydown($event)',
  },
  template: `
    <div [class]="containerClass">
      @if (showImage()) {
        <img
          [alt]="resolvedFileName()"
          [src]="imageSrc()"
          [style.object-fit]="imageFit()"
          style="object-position: center;"
        />
      }
      @if (status() === 'done' && size() !== 'minor' && !resolvedIsImage()) {
        <div [class]="contentClass">
          <i mznIcon [icon]="fileIconDef" color="brand" [size]="16"></i>
          <p mznTypography [class]="nameClass" [ellipsis]="true">{{
            resolvedFileName()
          }}</p>
        </div>
      }
      @if (status() === 'error' && size() !== 'minor') {
        <div [class]="errorMessageClass" role="alert" aria-live="polite">
          <i mznIcon [icon]="resolvedErrorIcon()" color="error" [size]="16"></i>
          <p mznTypography [class]="errorMessageTextClass">{{
            resolvedErrorMessage()
          }}</p>
        </div>
      }
      <div [class]="actionsClasses()">
        @if (status() === 'loading' && size() !== 'minor' && !readable()) {
          <button
            mznClearActions
            type="embedded"
            variant="contrast"
            [class]="clearActionsIconClass"
            [attr.aria-label]="resolvedAriaLabels().cancelUpload"
            (clicked)="onDelete($event)"
          ></button>
          <div
            [class]="loadingIconClass"
            [attr.aria-label]="resolvedAriaLabels().uploading"
          >
            <div mznSpin [loading]="true" size="sub"></div>
          </div>
        }
        @if (status() === 'done' && size() !== 'minor' && !readable()) {
          <div [class]="toolsClass">
            <div [class]="toolsContentClass">
              @if (zoomInEnabled()) {
                <button
                  mznButton
                  variant="base-secondary"
                  size="minor"
                  iconType="icon-only"
                  [icon]="zoomInIconDef"
                  type="button"
                  [attr.aria-label]="resolvedAriaLabels().zoomIn"
                  (click)="onZoomIn($event)"
                ></button>
              }
              @if (downloadEnabled()) {
                <button
                  mznButton
                  variant="base-secondary"
                  size="minor"
                  iconType="icon-only"
                  [icon]="downloadIconDef"
                  type="button"
                  [attr.aria-label]="resolvedAriaLabels().download"
                  (click)="onDownload($event)"
                ></button>
              }
              <button
                mznButton
                variant="base-secondary"
                size="minor"
                iconType="icon-only"
                [icon]="trashIconDef"
                type="button"
                [attr.aria-label]="resolvedAriaLabels().delete"
                (click)="onDelete($event)"
              ></button>
            </div>
          </div>
          @if (replaceEnabled()) {
            <span [class]="replaceLabelClass">
              {{ resolvedAriaLabels().clickToReplace }}
            </span>
          }
        }
        @if (status() === 'error' && size() !== 'minor' && !readable()) {
          <div [class]="toolsClass">
            <div [class]="toolsContentClass">
              <button
                mznButton
                variant="base-secondary"
                size="minor"
                iconType="icon-only"
                [icon]="resetIconDef"
                type="button"
                [attr.aria-label]="resolvedAriaLabels().reload"
                (click)="onReload($event)"
              ></button>
              <button
                mznButton
                variant="base-secondary"
                size="minor"
                iconType="icon-only"
                [icon]="trashIconDef"
                type="button"
                [attr.aria-label]="resolvedAriaLabels().delete"
                (click)="onDelete($event)"
              ></button>
            </div>
          </div>
        }
        @if (size() === 'minor' && !readable()) {
          <i mznIcon [icon]="zoomInIconDef" color="fixed-light" [size]="24"></i>
        }
      </div>
    </div>
  `,
})
export class MznUploadPictureCard {
  /** 要顯示的 File 物件。 */
  readonly file = input<File>();

  /** 檔案 URL（用於已上傳檔案顯示）。 */
  readonly url = input<string>();

  /** 檔案識別碼。 */
  readonly id = input<string>();

  /** 卡片狀態。@default 'loading' */
  readonly status = input<UploadItemStatus>('loading');

  /** 卡片尺寸。@default 'main' */
  readonly size = input<UploadPictureCardSize>('main');

  /** 圖片 object-fit。@default 'cover' */
  readonly imageFit = input<UploadPictureCardImageFit>('cover');

  /** 是否禁用。@default false */
  readonly disabled = input(false);

  /** 錯誤訊息（status='error' 時顯示）。 */
  readonly errorMessage = input<string>();

  /** 錯誤圖示。未提供時依是否為圖片回傳 ImageIcon / FileIcon。 */
  readonly errorIcon = input<IconDefinition>();

  /** 是否為唯讀模式（隱藏所有操作）。@default false */
  readonly readable = input(false);

  /** Aria 標籤（無障礙與 i18n）。 */
  readonly ariaLabels = input<UploadPictureCardAriaLabels>();

  /**
   * 是否啟用 Replace 模式。當為 true 且 status='done'、非 readable 時，
   * 點擊卡片會觸發 `replaced` 事件，並顯示 "Click to Replace" 標籤。
   *
   * @default false
   */
  readonly replaceEnabled = input(false);

  /** 是否顯示 Zoom 按鈕（done 狀態）。@default false */
  readonly zoomInEnabled = input(false);

  /** 是否顯示 Download 按鈕（done 狀態）。@default false */
  readonly downloadEnabled = input(false);

  /** 刪除按鈕被點擊。 */
  readonly deleted = output<MouseEvent>();

  /** 下載按鈕被點擊。 */
  readonly downloaded = output<MouseEvent>();

  /** 重試按鈕被點擊。 */
  readonly reloaded = output<MouseEvent>();

  /** Replace 模式下卡片被點擊。 */
  readonly replaced = output<MouseEvent>();

  /** Zoom 按鈕被點擊。 */
  readonly zoomed = output<MouseEvent>();

  // Icon defs
  protected readonly fileIconDef = FileIcon;
  protected readonly zoomInIconDef = ZoomInIcon;
  protected readonly downloadIconDef = DownloadIcon;
  protected readonly trashIconDef = TrashIcon;
  protected readonly resetIconDef = ResetIcon;

  // Class constants
  protected readonly containerClass = classes.container;
  protected readonly contentClass = classes.content;
  protected readonly nameClass = classes.name;
  protected readonly errorMessageClass = classes.errorMessage;
  protected readonly errorMessageTextClass = classes.errorMessageText;
  protected readonly clearActionsIconClass = classes.clearActionsIcon;
  protected readonly loadingIconClass = classes.loadingIcon;
  protected readonly toolsClass = classes.tools;
  protected readonly toolsContentClass = classes.toolsContent;
  protected readonly replaceLabelClass = classes.replaceLabel;

  private readonly _imageUrl = signal('');

  constructor() {
    // Manage blob URL lifecycle. When a File that is an image is provided,
    // create an object URL; clean up when inputs change or component is destroyed.
    effect((onCleanup) => {
      const file = this.file();
      const url = this.url();
      const image = isImageFile(file, url);

      if (url && image) {
        this._imageUrl.set(url);
        return;
      }

      if (file && image) {
        try {
          const blobUrl = URL.createObjectURL(file);

          this._imageUrl.set(blobUrl);
          onCleanup(() => URL.revokeObjectURL(blobUrl));
        } catch {
          this._imageUrl.set('');
        }
      } else {
        this._imageUrl.set('');
      }
    });
  }

  protected readonly resolvedIsImage = computed((): boolean =>
    isImageFile(this.file(), this.url()),
  );

  protected readonly showImage = computed(
    (): boolean =>
      this.resolvedIsImage() && !!this._imageUrl() && this.status() !== 'error',
  );

  protected readonly imageSrc = computed((): string => this._imageUrl());

  protected readonly resolvedFileName = computed((): string => {
    const file = this.file();
    const url = this.url();

    if (file?.name && !url) return file.name;
    if (url) return extractFileNameFromUrl(url);

    return '';
  });

  protected readonly resolvedAriaLabels = computed(
    (): Required<UploadPictureCardAriaLabels> => {
      const labels = this.ariaLabels() ?? {};

      return {
        cancelUpload: labels.cancelUpload ?? 'Cancel upload',
        clickToReplace: labels.clickToReplace ?? 'Click to Replace',
        delete: labels.delete ?? 'Delete file',
        download: labels.download ?? 'Download file',
        reload: labels.reload ?? 'Retry upload',
        uploading: labels.uploading ?? 'Uploading',
        zoomIn: labels.zoomIn ?? 'Zoom in image',
      };
    },
  );

  protected readonly resolvedErrorIcon = computed((): IconDefinition => {
    const custom = this.errorIcon();

    if (custom) return custom;

    return this.resolvedIsImage() ? ImageIcon : FileIcon;
  });

  protected readonly resolvedErrorMessage = computed((): string => {
    const custom = this.errorMessage();

    if (custom) return custom;

    return this.resolvedFileName() || 'Upload error';
  });

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size()), {
      [classes.disabled]: this.disabled(),
      [classes.readable]: this.readable(),
      [classes.replaceMode]:
        !this.readable() && this.replaceEnabled() && this.status() === 'done',
    }),
  );

  protected readonly actionsClasses = computed((): string =>
    clsx(classes.actions, classes.actionsStatus(this.status())),
  );

  protected readonly hostTabIndex = computed((): number =>
    this.disabled() || this.readable() ? -1 : 0,
  );

  protected onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.deleted.emit(event);
  }

  protected onDownload(event: MouseEvent): void {
    event.stopPropagation();
    this.downloaded.emit(event);
  }

  protected onReload(event: MouseEvent): void {
    event.stopPropagation();
    this.reloaded.emit(event);
  }

  protected onZoomIn(event: MouseEvent): void {
    event.stopPropagation();
    this.zoomed.emit(event);
  }

  protected onHostClick(event: MouseEvent): void {
    if (!this.readable() && this.replaceEnabled() && this.status() === 'done') {
      this.replaced.emit(event);
    }
  }

  protected onHostKeydown(event: KeyboardEvent): void {
    if (
      !this.readable() &&
      this.replaceEnabled() &&
      this.status() === 'done' &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      (event.currentTarget as HTMLElement).click();
    }
  }
}
