import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';

const THUMBNAIL_CLASS = classes.fourThumbnailThumbnail;
const OVERLAY_CLASS = classes.fourThumbnailOverlay;

/**
 * 縮圖元件，用於 FourThumbnailCard / SingleThumbnailCard 等卡片的子元素。
 *
 * 用 attribute selector 套在 `<div>`、`<a>`、`<button>` 等 host element 上：
 * host 保留原本的語意（連結、按鈕、靜態容器），MznThumbnail 只負責套上
 * `mzn-four-thumbnail-card__thumbnail` class 與 title overlay 子節點。
 *
 * @example
 * ```html
 * import { MznThumbnail } from '@mezzanine-ui/ng/thumbnail';
 *
 * <!-- 靜態模式 -->
 * <div mznThumbnail title="Photo 1">
 *   <img alt="thumbnail" src="..." />
 * </div>
 *
 * <!-- 按鈕模式 -->
 * <button mznThumbnail type="button" title="Click me" (click)="onClick($event)">
 *   <img alt="..." src="..." />
 * </button>
 *
 * <!-- 連結模式 -->
 * <a mznThumbnail href="https://example.com" target="_blank" title="Link">
 *   <img alt="..." src="..." />
 * </a>
 * ```
 *
 * @see MznFourThumbnailCard
 * @see MznSingleThumbnailCard
 */
@Component({
  selector: '[mznThumbnail]',
  host: {
    '[attr.title]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    <div [class]="overlayClass">
      @if (title()) {
        <span>{{ title() }}</span>
      }
    </div>
  `,
})
export class MznThumbnail {
  /** 滑鼠懸停時顯示的標題文字。 */
  readonly title = input<string>();

  @HostBinding('class')
  protected readonly hostClass = THUMBNAIL_CLASS;

  protected readonly overlayClass = OVERLAY_CLASS;
}
