import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostBinding,
  input,
  output,
  signal,
} from '@angular/core';
import {
  UploadItemStatus,
  UploadPictureCardImageFit,
  UploadPictureCardSize,
  uploadPictureCardClasses,
} from '@mezzanine-ui/core/upload';
import type { IconDefinition } from '@mezzanine-ui/icons';
import {
  DownloadIcon,
  FileIcon,
  ImageIcon,
  ResetIcon,
  TrashIcon,
  ZoomInIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznSpin } from '@mezzanine-ui/ng/spin';
import { MznTypography } from '@mezzanine-ui/ng/typography';

const IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'bmp',
  'ico',
] as const;

const upc = uploadPictureCardClasses;

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
 * UploadPictureCard displays a file upload preview card with loading, done, and error states.
 * Supports both image and non-image files with a toolbar for zoom, download, delete, and reload actions.
 *
 * @example
 * ```html
 * import { MznUploadPictureCard } from '@mezzanine-ui/ng/upload-picture-card';
 *
 * <div mznUploadPictureCard
 *   [file]="file"
 *   status="loading"
 *   size="main"
 *   (deleted)="onDelete($event)"
 * ></div>
 *
 * <div mznUploadPictureCard
 *   [url]="'https://example.com/image.jpg'"
 *   status="done"
 *   [imageFit]="'cover'"
 *   (deleted)="onDelete($event)"
 *   (zoomed)="onZoom($event)"
 *   (downloaded)="onDownload($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznUploadPictureCard]',
  host: {
    '[class]': 'containerClass()',
    '[attr.file]': 'null',
    '[attr.url]': 'null',
    '[attr.id]': 'null',
    '[attr.status]': 'null',
    '[attr.size]': 'null',
    '[attr.imageFit]': 'null',
    '[attr.disabled]': 'null',
    '[attr.errorMessage]': 'null',
    '[attr.errorIcon]': 'null',
    '[attr.readable]': 'null',
    '[attr.ariaLabels]': 'null',
  },
  standalone: true,
  imports: [MznButton, MznIcon, MznSpin, MznClearActions, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isImageFile() && resolvedImageUrl() && status() !== 'error') {
      <img
        [class]="upc.content"
        [src]="resolvedImageUrl()"
        [alt]="fileName()"
        [style]="imageStyle()"
      />
    }

    @if (status() === 'done' && size() !== 'minor' && !isImageFile()) {
      <div [class]="upc.content">
        <i mznIcon [icon]="fileIcon" color="brand" [size]="16"></i>
        <span
          [class]="upc.name"
          mznTypography
          variant="caption"
          [ellipsis]="true"
        >
          {{ fileName() }}
        </span>
      </div>
    }

    @if (status() === 'error' && size() !== 'minor') {
      <div [class]="upc.errorMessage" role="alert" aria-live="polite">
        <i mznIcon [icon]="errorIconContent()" color="error" [size]="16"></i>
        <span [class]="upc.errorMessageText" mznTypography variant="caption">
          {{ errorMessageContent() }}
        </span>
      </div>
    }

    <div [class]="actionClasses()">
      @if (status() === 'loading' && size() !== 'minor' && !readable()) {
        <button
          mznClearActions
          type="embedded"
          variant="contrast"
          [ariaLabel]="resolvedAriaLabels().cancelUpload"
          (clicked)="onDelete($event)"
        ></button>
        <div
          [class]="upc.loadingIcon"
          [attr.aria-label]="resolvedAriaLabels().uploading"
        >
          <div mznSpin [loading]="true" size="sub"></div>
        </div>
      }

      @if (status() === 'done' && size() !== 'minor' && !readable()) {
        <div [class]="upc.tools">
          <div [class]="upc.toolsContent">
            @if (zoomed) {
              <button
                mznButton
                variant="base-secondary"
                size="minor"
                iconType="icon-only"
                [icon]="zoomInIcon"
                [tooltipText]="resolvedAriaLabels().zoomIn"
                type="button"
                (click)="onZoomIn($event)"
              ></button>
            }
            @if (downloaded) {
              <button
                mznButton
                variant="base-secondary"
                size="minor"
                iconType="icon-only"
                [icon]="downloadIcon"
                [tooltipText]="resolvedAriaLabels().download"
                type="button"
                (click)="onDownload($event)"
              ></button>
            }
            <button
              mznButton
              variant="base-secondary"
              size="minor"
              iconType="icon-only"
              [icon]="trashIcon"
              [tooltipText]="resolvedAriaLabels().delete"
              type="button"
              (click)="onDelete($event)"
            ></button>
          </div>
        </div>
        @if (replaced) {
          <span [class]="upc.replaceLabel">{{
            resolvedAriaLabels().clickToReplace
          }}</span>
        }
      }

      @if (status() === 'error' && size() !== 'minor' && !readable()) {
        <div [class]="upc.tools">
          <div [class]="upc.toolsContent">
            @if (reloaded) {
              <button
                mznButton
                variant="base-secondary"
                size="minor"
                iconType="icon-only"
                [icon]="resetIcon"
                [tooltipText]="resolvedAriaLabels().reload"
                type="button"
                (click)="onReload($event)"
              ></button>
            }
            <button
              mznButton
              variant="base-secondary"
              size="minor"
              iconType="icon-only"
              [icon]="trashIcon"
              [tooltipText]="resolvedAriaLabels().delete"
              type="button"
              (click)="onDelete($event)"
            ></button>
          </div>
        </div>
      }

      @if (size() === 'minor' && !readable()) {
        <i mznIcon [icon]="zoomInIcon" color="fixed-light" [size]="24"></i>
      }
    </div>
  `,
})
export class MznUploadPictureCard {
  protected readonly upc = uploadPictureCardClasses;

  /** The file to display. */
  readonly file = input<File>();

  /** The URL of the uploaded file. */
  readonly url = input<string>();

  /** The id of the file to identify the file. */
  readonly id = input<string>();

  /** The status of the upload picture card. @default 'loading' */
  readonly status = input<UploadItemStatus>('loading');

  /** The size of the upload picture card. @default 'main' */
  readonly size = input<UploadPictureCardSize>('main');

  /** The image fit of the upload picture card. @default 'cover' */
  readonly imageFit = input<UploadPictureCardImageFit>('cover');

  /** Whether the upload picture card is disabled. @default false */
  readonly disabled = input(false);

  /** Error message to display when status is 'error'. */
  readonly errorMessage = input<string>();

  /** Error icon to display when status is 'error'. */
  readonly errorIcon = input<IconDefinition>();

  /** Whether the upload picture card is readable. @default false */
  readonly readable = input(false);

  /** Aria labels for accessibility. */
  readonly ariaLabels = input<UploadPictureCardAriaLabels>();

  /** Emitted when the delete button is clicked. */
  readonly deleted = output<MouseEvent>();

  /** Emitted when the download button is clicked. */
  readonly downloaded = output<MouseEvent>();

  /** Emitted when the reload/retry button is clicked. */
  readonly reloaded = output<MouseEvent>();

  /** Emitted when the card body is clicked in replace mode. */
  readonly replaced = output<MouseEvent>();

  /** Emitted when the zoom in button is clicked. */
  readonly zoomed = output<MouseEvent>();

  readonly _imageUrl = signal('');

  constructor() {
    // Manage blob URL lifecycle: create when file is an image, revoke on cleanup
    effect(() => {
      const f = this.file();
      const u = this.url();
      const image = this._isImage(f, u);

      if (u && image) {
        this._imageUrl.set(u);
        return;
      }

      if (f && image) {
        try {
          const blobUrl = URL.createObjectURL(f);
          this._imageUrl.set(blobUrl);
          // Return cleanup function to revoke URL when file changes
          return () => URL.revokeObjectURL(blobUrl);
        } catch {
          this._imageUrl.set('');
        }
      } else {
        this._imageUrl.set('');
      }
    });
  }

  // CSS class helpers
  protected readonly containerClass = computed((): string => upc.container);

  protected readonly actionClasses = computed((): string =>
    clsx(upc.actions, upc.actionsStatus(this.status())),
  );

  protected readonly imageStyle = computed(
    (): Record<string, string> => ({
      objectFit: this.imageFit(),
      objectPosition: 'center',
    }),
  );

  // Icon references
  protected readonly fileIcon = FileIcon;
  protected readonly zoomInIcon = ZoomInIcon;
  protected readonly downloadIcon = DownloadIcon;
  protected readonly trashIcon = TrashIcon;
  protected readonly resetIcon = ResetIcon;

  // Computed values
  protected readonly isImageFile = computed((): boolean => {
    return this._isImage(this.file(), this.url());
  });

  protected readonly fileName = computed((): string => {
    const f = this.file();
    const u = this.url();

    if (f?.name && !u) return f.name;
    if (u) {
      try {
        const urlObj = new URL(u);
        return urlObj.pathname.split('/').pop() || '';
      } catch {
        const withoutQuery = u.split('?')[0].split('#')[0];
        return withoutQuery.split('/').pop() || '';
      }
    }
    return '';
  });

  protected readonly resolvedImageUrl = computed((): string =>
    this._imageUrl(),
  );

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

  protected readonly errorIconContent = computed((): IconDefinition => {
    const customIcon = this.errorIcon();
    if (customIcon) return customIcon;
    return this.isImageFile() ? ImageIcon : FileIcon;
  });

  protected readonly errorMessageContent = computed((): string => {
    const custom = this.errorMessage();
    if (custom) return custom;
    const name = this.fileName();
    return name || 'Upload error';
  });

  @HostBinding('class')
  protected readonly hostClass = computed((): string =>
    clsx(upc.host, upc.size(this.size()), {
      [upc.disabled]: this.disabled(),
      [upc.readable]: this.readable(),
      [upc.replaceMode]:
        !this.readable() && !!this.replaced && this.status() === 'done',
    }),
  );

  @HostBinding('attr.aria-disabled')
  protected get hostAriaDisabled(): boolean {
    return this.disabled();
  }

  @HostBinding('attr.tabindex')
  protected get hostTabindex(): number {
    return this.disabled() || this.readable() ? -1 : 0;
  }

  @HostBinding('attr.role')
  protected readonly hostRole = 'group';

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

  protected onCardClick(event: MouseEvent): void {
    if (!this.readable() && this.status() === 'done') {
      event.stopPropagation();
      this.replaced.emit(event);
    }
  }

  private _isImage(file: File | undefined, url: string | undefined): boolean {
    if (file?.type?.startsWith('image/')) return true;
    if (url) {
      const ext = url.split('.').pop()?.toLowerCase() ?? '';
      if (IMAGE_EXTENSIONS.includes(ext as (typeof IMAGE_EXTENSIONS)[number]))
        return true;
    }
    return false;
  }
}
