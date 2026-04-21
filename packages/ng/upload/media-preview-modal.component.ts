import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
} from '@angular/core';
import { modalClasses } from '@mezzanine-ui/core/modal';
import { MznBackdrop } from '@mezzanine-ui/ng/backdrop';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';

/**
 * 單圖片預覽 Modal，對應 React `MediaPreviewModal` 的單圖行為。
 *
 * 只使用 `MznBackdrop` 當作遮罩容器（非完整 `MznModal`），overlay 不會帶白色
 * 面板背景，支援 PNG 透明通道。關閉按鈕（`ClearActions`）絕對定位在整個
 * overlay 右上角，結構與 React 版本一致。
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
  imports: [MznBackdrop, MznClearActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div mznBackdrop [open]="open()" (closed)="onClose()">
      <div [class]="dialogClass" role="dialog">
        <div [class]="contentClass">
          <div [class]="mediaContainerClass">
            @if (currentImage()) {
              <img
                [class]="imageClass"
                [src]="currentImage()"
                alt="Media preview"
              />
            }
          </div>
        </div>
      </div>
      <button
        mznClearActions
        type="embedded"
        variant="contrast"
        [class]="closeButtonClass"
        (clicked)="onClose()"
      ></button>
    </div>
  `,
})
export class MznUploadMediaPreviewModal {
  /** 是否顯示預覽。 */
  readonly open = input(false);

  /** 要預覽的媒體 URL 清單（目前僅使用第一項）。 */
  readonly mediaItems = input<readonly string[]>([]);

  /** 關閉時觸發（背景點擊、ESC 或關閉按鈕）。 */
  readonly close = output<void>();

  protected readonly currentImage = computed(
    (): string | undefined => this.mediaItems()[0],
  );

  protected readonly dialogClass = `${modalClasses.host} ${modalClasses.mediaPreview}`;
  protected readonly contentClass = modalClasses.mediaPreviewContent;
  protected readonly mediaContainerClass =
    modalClasses.mediaPreviewMediaContainer;
  protected readonly imageClass = modalClasses.mediaPreviewImage;
  protected readonly closeButtonClass = modalClasses.mediaPreviewCloseButton;

  constructor() {
    // Escape key closes the preview (only while open).
    effect((onCleanup) => {
      if (!this.open()) return;

      const onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') this.close.emit();
      };

      document.addEventListener('keydown', onKeyDown);
      onCleanup(() => document.removeEventListener('keydown', onKeyDown));
    });
  }

  protected onClose(): void {
    this.close.emit();
  }
}
