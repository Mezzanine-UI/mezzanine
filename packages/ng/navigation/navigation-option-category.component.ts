import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { navigationOptionCategoryClasses as classes } from '@mezzanine-ui/core/navigation';

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
    <li [class]="hostClass" role="menuitem">
      <span [class]="titleClass">{{ title() }}</span>
      <ul>
        <ng-content />
      </ul>
    </li>
  `,
})
export class MznNavigationOptionCategory {
  protected readonly hostClass = classes.host;
  protected readonly titleClass = classes.title;

  /** 分類標題。 */
  readonly title = input.required<string>();
}
