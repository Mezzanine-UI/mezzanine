import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import clsx from 'clsx';
import { MznAnchorItem } from './anchor-item.component';
import { AnchorItemData } from './typings';

/**
 * 錨點群組元件，渲染一組錨點導航連結。
 *
 * 以 `anchors` 資料陣列驅動，支援最多三層巢狀結構。
 * 自動追蹤 URL hash 變化以標示當前錨點。
 *
 * @example
 * ```html
 * import { MznAnchorGroup } from '@mezzanine-ui/ng/anchor';
 *
 * <div mznAnchorGroup [anchors]="anchorData" ></div>
 * ```
 *
 * ```typescript
 * anchorData: AnchorItemData[] = [
 *   { id: 'section1', name: 'Section 1', href: '#section1' },
 *   { id: 'section2', name: 'Section 2', href: '#section2', children: [
 *     { id: 'section2-1', name: 'Section 2-1', href: '#section2-1' },
 *   ]},
 * ];
 * ```
 */
@Component({
  selector: '[mznAnchorGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznAnchorItem],
  host: {
    '[class]': 'hostClasses()',
    '[attr.anchors]': 'null',
    '[attr.className]': 'null',
  },
  template: `
    @for (item of anchors(); track item.id) {
      <div
        mznAnchorItem
        [autoScrollTo]="item.autoScrollTo"
        [disabled]="item.disabled"
        [href]="item.href"
        [itemId]="item.id"
        [name]="item.name"
        [clickHandler]="item.onClick"
        [subAnchors]="item.children"
        [itemTitle]="item.title"
      ></div>
    }
  `,
})
export class MznAnchorGroup {
  /** 錨點項目資料陣列。 */
  readonly anchors = input.required<readonly AnchorItemData[]>();

  /** 自訂 CSS class。 */
  readonly className = input<string>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, this.className()),
  );
}
