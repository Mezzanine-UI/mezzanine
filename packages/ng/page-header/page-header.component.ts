import { ChangeDetectionStrategy, Component } from '@angular/core';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';

/**
 * 頁面標頭容器，組合 Breadcrumb 與 ContentHeader。
 *
 * @example
 * ```html
 * import { MznPageHeader } from '@mezzanine-ui/ng/page-header';
 *
 * <mzn-page-header>
 *   <mzn-breadcrumb>...</mzn-breadcrumb>
 *   <header mznContentHeader>...</header>
 * </mzn-page-header>
 * ```
 */
@Component({
  selector: 'mzn-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'banner',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class MznPageHeader {
  protected readonly hostClass = classes.host;
}
