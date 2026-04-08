import { ChangeDetectionStrategy, Component } from '@angular/core';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';

/**
 * 將多組 Description 排列成群組。
 *
 * @example
 * ```html
 * <mzn-description-group>
 *   <mzn-description>...</mzn-description>
 *   <mzn-description>...</mzn-description>
 * </mzn-description-group>
 * ```
 */
@Component({
  selector: 'mzn-description-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class MznDescriptionGroup {
  protected readonly hostClass = classes.groupHost;
}
