import { ChangeDetectionStrategy, Component } from '@angular/core';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';

/**
 * 將多組 Description 排列成群組。
 *
 * @example
 * ```html
 * <div mznDescriptionGroup>
 *   <div mznDescription>...</div>
 *   <div mznDescription>...</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznDescriptionGroup]',
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
