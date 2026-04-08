import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import clsx from 'clsx';
import { MznScrollbar } from '@mezzanine-ui/ng/scrollbar';

/**
 * 佈局主內容區域，自動包裹於 scrollable 容器中。
 *
 * 必須作為 `<mzn-layout>` 的子元件使用，會被投射至 content-wrapper 中央。
 *
 * @example
 * ```html
 * import { MznLayout, MznLayoutMain } from '@mezzanine-ui/ng/layout';
 *
 * <mzn-layout>
 *   <mzn-layout-main>
 *     <h1>Page Content</h1>
 *   </mzn-layout-main>
 * </mzn-layout>
 * ```
 *
 * @see MznLayout
 */
@Component({
  selector: 'mzn-layout-main',
  standalone: true,
  imports: [MznScrollbar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClasses()' },
  template: `
    <mzn-scrollbar
      [disabled]="scrollbarDisabled()"
      [maxHeight]="scrollbarMaxHeight()"
      [maxWidth]="scrollbarMaxWidth()"
    >
      <div [class]="mainContentClass"><ng-content /></div>
    </mzn-scrollbar>
  `,
})
export class MznLayoutMain {
  /**
   * 附加至主內容元素的額外 CSS class 名稱。
   */
  readonly className = input<string>();

  /**
   * 是否停用內建的捲軸元件，退回原生捲軸行為。
   * @default false
   */
  readonly scrollbarDisabled = input(false);

  /**
   * 捲軸容器最大高度。
   */
  readonly scrollbarMaxHeight = input<string>();

  /**
   * 捲軸容器最大寬度。
   */
  readonly scrollbarMaxWidth = input<string>();

  protected readonly mainContentClass = classes.mainContent;

  protected readonly hostClasses = computed((): string =>
    clsx(classes.main, this.className()),
  );
}
