import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MznModal } from '@mezzanine-ui/ng/modal';

/**
 * 單圖片預覽 Modal，對應 React `MediaPreviewModal` 之單圖行為。
 *
 * 僅於 `MznUpload` 的 cards / card-wall 模式按下 ZoomIn 時開啟，
 * 顯示 `mediaItems` 陣列中的第一張圖片。
 *
 * @example
 * ```html
 * <mzn-upload-media-preview-modal
 *   [open]="isPreviewOpen"
 *   [mediaItems]="[imageUrl]"
 *   (close)="isPreviewOpen = false"
 * />
 * ```
 *
 * @see MznUpload
 */
@Component({
  selector: 'mzn-upload-media-preview-modal',
  standalone: true,
  imports: [MznModal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      mznModal
      size="wide"
      [open]="open()"
      [showDismissButton]="true"
      (closed)="onClose()"
    >
      @if (currentImage()) {
        <img
          class="mzn-upload-media-preview-modal__image"
          [src]="currentImage()"
          alt=""
          style="width: 100%; height: 100%; object-fit: contain;"
        />
      }
    </div>
  `,
})
export class MznUploadMediaPreviewModal {
  /** 是否顯示預覽。 */
  readonly open = input(false);

  /** 要預覽的媒體 URL 清單（目前僅使用第一項）。 */
  readonly mediaItems = input<readonly string[]>([]);

  /** 關閉時觸發。 */
  readonly close = output<void>();

  protected readonly currentImage = computed(
    (): string | undefined => this.mediaItems()[0],
  );

  protected onClose(): void {
    this.close.emit();
  }
}
