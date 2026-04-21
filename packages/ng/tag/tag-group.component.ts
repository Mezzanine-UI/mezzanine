import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { tagClasses as classes } from '@mezzanine-ui/core/tag';
import clsx from 'clsx';

/**
 * 標籤群組容器，用於包裹多個 `MznTag` 或 `MznOverflowCounterTag`。
 *
 * 支援 `fade` 過場動畫，在標籤新增/移除時以漸變效果呈現。
 *
 * @example
 * ```html
 * import { MznTagGroup } from '@mezzanine-ui/ng/tag';
 * import { MznTag } from '@mezzanine-ui/ng/tag';
 *
 * <div mznTagGroup>
 *   <span mznTag type="static" label="標籤一" ></span>
 *   <span mznTag type="static" label="標籤二" ></span>
 * </div>
 * ```
 *
 * @see MznTag
 */
@Component({
  selector: '[mznTagGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.transition]': 'null',
  },
  template: `<ng-content />`,
})
export class MznTagGroup {
  /**
   * 過場動畫模式。
   * @default 'none'
   */
  readonly transition = input<'fade' | 'none'>('none');

  protected readonly hostClasses = computed((): string => clsx(classes.group));
}
