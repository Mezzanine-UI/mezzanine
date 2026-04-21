import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { sectionGroupClasses as classes } from '@mezzanine-ui/core/section';
import clsx from 'clsx';

/** SectionGroup 方向類型。 */
export type SectionGroupDirection = 'horizontal' | 'vertical';

/**
 * 區段群組容器元件，將多個 MznSection 以水平或垂直方向排列。
 *
 * @example
 * ```html
 * import { MznSectionGroup } from '@mezzanine-ui/ng/section';
 * import { MznSection } from '@mezzanine-ui/ng/section';
 *
 * <div mznSectionGroup direction="horizontal">
 *   <div mznSection>...</div>
 *   <div mznSection>...</div>
 * </div>
 * ```
 *
 * @see MznSection
 */
@Component({
  selector: '[mznSectionGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.direction]': 'null',
  },
  template: `<ng-content />`,
})
export class MznSectionGroup {
  /**
   * 排列方向。
   * @default 'vertical'
   */
  readonly direction = input<SectionGroupDirection>('vertical');

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.hostHorizontal]: this.direction() === 'horizontal',
    }),
  );
}
