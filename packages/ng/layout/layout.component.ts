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
 *   <mzn-navigation>...</mzn-navigation>
 *   <mzn-layout-left-panel [open]="true">Side Content</mzn-layout-left-panel>
 *   <mzn-layout-main>Main Content</mzn-layout-main>
 *   <mzn-layout-right-panel [open]="true">Right Content</mzn-layout-right-panel>
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
      <ng-content select="mzn-navigation" />
    </div>
    <div [class]="contentWrapperClasses()">
      <ng-content select="mzn-layout-left-panel" />
      <ng-content select="mzn-layout-main" />
      <ng-content select="mzn-layout-right-panel" />
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
   * 僅在有提供 `<mzn-navigation>` 子元件時有效。
   */
  readonly navigationClassName = input<string>();

  protected readonly contentWrapperClasses = computed((): string =>
    clsx(classes.contentWrapper, this.contentWrapperClassName()),
  );

  protected readonly navigationClasses = computed((): string =>
    clsx(classes.navigation, this.navigationClassName()),
  );
}
