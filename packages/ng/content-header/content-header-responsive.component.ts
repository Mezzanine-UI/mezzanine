import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  contentHeaderClasses as classes,
  ResponsiveBreakpoint,
} from '@mezzanine-ui/core/content-header';

export type { ResponsiveBreakpoint };

/**
 * 響應式內容區塊標題包裝元件。
 *
 * 等效於 React 版 `ContentHeaderResponsive`。
 * 透過 `breakpoint` input 套用對應的顯示/隱藏 CSS class，
 * 讓包裹的子元件在指定斷點下才顯示。
 *
 * @experimental 此元件仍在測試中，API 可能頻繁變更。
 *
 * @example
 * ```html
 * import { MznContentHeaderResponsive } from '@mezzanine-ui/ng/content-header';
 *
 * <mzn-content-header title="標題">
 *   <div contentHeaderActions>
 *     <!-- 僅在 1080px 以上顯示批次刪除按鈕 -->
 *     <mzn-content-header-responsive breakpoint="above1080px">
 *       <button mznButton variant="destructive-secondary">批次刪除</button>
 *     </mzn-content-header-responsive>
 *     <button mznButton variant="base-primary">查詢</button>
 *   </div>
 * </mzn-content-header>
 * ```
 *
 * @see MznContentHeader
 */
@Component({
  selector: 'mzn-content-header-responsive',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  template: `<ng-content />`,
})
export class MznContentHeaderResponsive {
  /**
   * 斷點控制。套用對應的 CSS class 以決定此區塊的顯示條件。
   *
   * - `'above1080px'` — 僅在 1080px 以上顯示
   * - `'above680px'` — 僅在 680px 以上顯示
   * - `'below1080px'` — 僅在 1080px 以下顯示
   * - `'below680px'` — 僅在 680px 以下顯示
   * - `'between680and1080px'` — 僅在 680px 至 1080px 之間顯示
   */
  readonly breakpoint = input.required<ResponsiveBreakpoint>();

  protected readonly hostClass = computed((): string =>
    classes.breakpoint(this.breakpoint()),
  );
}
