import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { sectionClasses as classes } from '@mezzanine-ui/core/section';

/**
 * 區段容器元件，組合 ContentHeader、FilterArea、Tab 與主要內容。
 *
 * 透過 content projection 的具名插槽將子元件投影至對應位置，
 * 主要內容包裹在 `__content` 容器中。
 *
 * @example
 * ```html
 * import { MznSection } from '@mezzanine-ui/ng/section';
 * import { MznContentHeader } from '@mezzanine-ui/ng/content-header';
 *
 * <div mznSection>
 *   <header mznContentHeader title="區段標題" size="sub" ></header>
 *   <div>主要內容</div>
 * </div>
 * ```
 *
 * @see MznContentHeader
 * @see MznFilterArea
 * @see MznSectionGroup
 */
@Component({
  selector: '[mznSection]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <ng-content select="mzn-content-header" />
    <ng-content select="mzn-filter-area" />
    <ng-content select="mzn-tabs, [sectionTab]" />
    <div [class]="contentClass">
      <ng-content />
    </div>
  `,
})
export class MznSection {
  protected readonly contentClass = classes.hostContent;

  protected readonly hostClasses = computed((): string => classes.host);
}
