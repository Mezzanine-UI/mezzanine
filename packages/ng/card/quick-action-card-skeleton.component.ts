import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import clsx from 'clsx';
import { MznSkeleton } from '@mezzanine-ui/ng/skeleton';

/**
 * Skeleton placeholder for QuickActionCard component.
 * Renders a skeleton that mimics the QuickActionCard layout
 * with a circle icon skeleton and two text skeletons.
 *
 * @example
 * ```html
 * import { MznQuickActionCardSkeleton } from '@mezzanine-ui/ng/card';
 *
 * <mzn-quick-action-card-skeleton />
 * <mzn-quick-action-card-skeleton mode="vertical" />
 * ```
 *
 * @see MznQuickActionCard
 */
@Component({
  selector: 'mzn-quick-action-card-skeleton',
  standalone: true,
  imports: [MznSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <mzn-skeleton [circle]="true" [height]="24" [width]="24" />
    <div [class]="contentClass">
      <mzn-skeleton [height]="20" width="70%" />
      <mzn-skeleton [height]="16" width="50%" />
    </div>
  `,
})
export class MznQuickActionCardSkeleton {
  /**
   * Layout mode matching QuickActionCard.
   * @default 'horizontal'
   */
  readonly mode = input<'horizontal' | 'vertical'>('horizontal');

  protected readonly contentClass = classes.quickActionContent;

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.quickAction,
      classes.quickActionReadOnly,
      this.mode() === 'vertical' && classes.quickActionVertical,
    ),
  );
}
