import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { navigationOptionCategoryClasses as classes } from '@mezzanine-ui/core/navigation';

/** Mirrors React's `useId()` for the category title / nested-list association. */
let nextCategoryTitleId = 0;

/**
 * 導覽選項分類元件，用於將多個 NavigationOption 分組並顯示分類標題。
 *
 * 使用 element selector 以避免 HTML5 `<li>` auto-close 問題，host 套
 * `display: contents` 讓自訂元素在 layout 上透明。
 *
 * @example
 * ```html
 * <mzn-navigation-option-category title="管理">
 *   <mzn-navigation-option title="使用者" />
 *   <mzn-navigation-option title="角色" />
 * </mzn-navigation-option-category>
 * ```
 */
@Component({
  selector: 'mzn-navigation-option-category',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': "'contents'",
  },
  template: `
    <li [class]="hostClass">
      <span [class]="titleClass" [id]="titleId">{{ title() }}</span>
      <ul [attr.aria-labelledby]="titleId">
        <ng-content />
      </ul>
    </li>
  `,
})
export class MznNavigationOptionCategory {
  protected readonly hostClass = classes.host;
  protected readonly titleClass = classes.title;
  /**
   * `role="menuitem"` used to sit on this `<li>`. It requires a
   * menu/menubar/group ancestor that Navigation never renders, and it overrode
   * the implicit `listitem`, leaving the parent `<ul>` with a non-listitem
   * child. The native list semantics are already correct; the title id below
   * keeps the grouping explicit via `aria-labelledby`.
   */
  protected readonly titleId = `mzn-navigation-option-category-${nextCategoryTitleId++}`;

  /** 分類標題。 */
  readonly title = input.required<string>();
}
