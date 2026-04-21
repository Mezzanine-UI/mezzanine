import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import clsx from 'clsx';

/**
 * 主要佈局容器，負責排列 Navigation、側邊面板與主內容區。
 *
 * 透過具名 `ng-content` 選擇器自動將子元件排列至正確的 DOM 位置：
 * Navigation 位於頂部，LeftPanel / Main / RightPanel 排列於 content-wrapper 中。
 *
 * @example
 * ```html
 * import { MznLayout, MznLayoutMain, MznLayoutLeftPanel, MznLayoutRightPanel } from '@mezzanine-ui/ng/layout';
 *
 * <div mznLayout>
 *   <nav mznNavigation>...</nav>
 *   <aside mznLayoutLeftPanel [open]="true">Side Content</aside>
 *   <div mznLayoutMain>Main Content</div>
 *   <aside mznLayoutRightPanel [open]="true">Right Content</aside>
 * </div>
 * ```
 *
 * @see MznLayoutMain
 * @see MznLayoutLeftPanel
 * @see MznLayoutRightPanel
 */
@Component({
  selector: '[mznLayout]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.contentWrapperClassName]': 'null',
    '[attr.navigationClassName]': 'null',
  },
  template: `
    <div [class]="navigationClasses()">
      <ng-content select="[mznNavigation]" />
    </div>
    <div [class]="contentWrapperClasses()">
      <ng-content select="[mznLayoutLeftPanel]" />
      <ng-content select="[mznLayoutMain]" />
      <ng-content select="[mznLayoutRightPanel]" />
    </div>
  `,
})
export class MznLayout {
  protected readonly hostClass = classes.host;

  /**
   * 附加至 content-wrapper 元素的額外 CSS class 名稱。
   */
  readonly contentWrapperClassName = input<string>();

  /**
   * 附加至 navigation 包裝元素的額外 CSS class 名稱。
   * 僅在有提供 `<nav mznNavigation>` 子元件時有效。
   */
  readonly navigationClassName = input<string>();

  protected readonly contentWrapperClasses = computed((): string =>
    clsx(classes.contentWrapper, this.contentWrapperClassName()),
  );

  protected readonly navigationClasses = computed((): string =>
    clsx(classes.navigation, this.navigationClassName()),
  );
}
