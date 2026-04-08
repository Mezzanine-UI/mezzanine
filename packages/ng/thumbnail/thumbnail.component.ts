import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';

export type ThumbnailHostComponent = 'div' | 'a' | 'button';

const THUMBNAIL_CLASS = classes.fourThumbnailThumbnail;
const OVERLAY_CLASS = classes.fourThumbnailOverlay;

/**
 * 縮圖元件，用於 FourThumbnailCard / SingleThumbnailCard 等卡片的子元素。
 *
 * 支援三種渲染模式：`div`（靜態）、`button`（可點擊）、`a`（連結），
 * 透過 `hostComponent` 切換，統一使用 `mzn-thumbnail` 選擇器。
 *
 * @example
 * ```html
 * import { MznThumbnail } from '@mezzanine-ui/ng/thumbnail';
 *
 * <!-- 靜態模式（預設） -->
 * <mzn-thumbnail title="Photo 1">
 *   <img alt="thumbnail" src="..." />
 * </mzn-thumbnail>
 *
 * <!-- 按鈕模式 -->
 * <mzn-thumbnail hostComponent="button" title="Click me" (clicked)="onClick($event)">
 *   <img alt="..." src="..." />
 * </mzn-thumbnail>
 *
 * <!-- 連結模式 -->
 * <mzn-thumbnail hostComponent="a" href="https://example.com" target="_blank" title="Link">
 *   <img alt="..." src="..." />
 * </mzn-thumbnail>
 * ```
 *
 * @see MznFourThumbnailCard
 * @see MznSingleThumbnailCard
 */
@Component({
  selector: 'mzn-thumbnail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (hostComponent()) {
      @case ('button') {
        <div (click)="onClick($event)">
          <ng-content />
          <div [class]="overlayClass">
            @if (title()) {
              <span>{{ title() }}</span>
            }
          </div>
        </div>
      }
      @case ('a') {
        <ng-content />
        <div [class]="overlayClass">
          @if (title()) {
            <span>{{ title() }}</span>
          }
        </div>
      }
      @default {
        <ng-content />
        <div [class]="overlayClass">
          @if (title()) {
            <span>{{ title() }}</span>
          }
        </div>
      }
    }
  `,
})
export class MznThumbnail {
  /**
   * 渲染模式，決定元件的語義行為。
   * @default 'div'
   */
  readonly hostComponent = input<ThumbnailHostComponent>('div');

  /** 滑鼠懸停時顯示的標題文字。 */
  readonly title = input<string>();

  /**
   * 是否禁用（僅 `button` 模式適用）。
   * @default false
   */
  readonly disabled = input(false);

  /** 連結網址（僅 `a` 模式適用）。 */
  readonly href = input<string>();

  /** 連結開啟目標（僅 `a` 模式適用）。 */
  readonly target = input<string>();

  /** 點擊事件（僅 `button` 模式適用）。 */
  readonly clicked = output<MouseEvent>();

  @HostBinding('class')
  protected readonly hostClass = THUMBNAIL_CLASS;

  @HostBinding('attr.href')
  protected get hostHref(): string | null {
    return this.hostComponent() === 'a' ? (this.href() ?? '') : null;
  }

  @HostBinding('attr.target')
  protected get hostTarget(): string | null {
    return this.hostComponent() === 'a' ? (this.target() ?? null) : null;
  }

  @HostBinding('attr.type')
  protected get hostType(): string | null {
    return this.hostComponent() === 'button' ? 'button' : null;
  }

  @HostBinding('attr.disabled')
  protected get hostDisabled(): boolean | null {
    return this.hostComponent() === 'button' && this.disabled() ? true : null;
  }

  protected readonly overlayClass = OVERLAY_CLASS;

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) return;
    this.clicked.emit(event);
  }
}
