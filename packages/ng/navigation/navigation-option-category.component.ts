import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { navigationOptionCategoryClasses as classes } from '@mezzanine-ui/core/navigation';

/**
 * 導覽選項分類元件，用於將多個 NavigationOption 分組並顯示分類標題。
 *
 * @example
 * ```html
 * <li mznNavigationOptionCategory title="管理">
 *   <li mznNavigationOption title="使用者" ></li>
 *   <li mznNavigationOption title="角色" ></li>
 * </li>
 * ```
 */
@Component({
  selector: '[mznNavigationOptionCategory]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    role: 'menuitem',
    '[attr.title]': 'null',
  },
  template: `
    <span [class]="titleClass">{{ title() }}</span>
    <ul>
      <ng-content />
    </ul>
  `,
})
export class MznNavigationOptionCategory {
  protected readonly hostClass = classes.host;
  protected readonly titleClass = classes.title;

  /** 分類標題。 */
  readonly title = input.required<string>();
}
