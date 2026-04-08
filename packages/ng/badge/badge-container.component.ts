import { ChangeDetectionStrategy, Component } from '@angular/core';
import { badgeClasses as classes } from '@mezzanine-ui/core/badge';

/**
 * @deprecated 請使用 `MznBadge` 元件替代。
 *
 * 徽章容器，包裹子元素並在角落顯示 Badge。
 *
 * @example
 * ```html
 * import { MznBadgeContainer, MznBadge } from '@mezzanine-ui/ng/badge';
 *
 * <mzn-badge-container>
 *   <i mznIcon [icon]="bellIcon" ></i>
 *   <mzn-badge variant="dot" />
 * </mzn-badge-container>
 * ```
 */
@Component({
  selector: 'mzn-badge-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class MznBadgeContainer {
  protected readonly hostClass = classes.container;
}
