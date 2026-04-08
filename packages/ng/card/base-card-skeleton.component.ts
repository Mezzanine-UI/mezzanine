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
 * BaseCard 的骨架屏元件，模擬 BaseCard 的佈局結構。
 *
 * @example
 * ```html
 * import { MznBaseCardSkeleton } from '@mezzanine-ui/ng/card';
 *
 * <mzn-base-card-skeleton />
 * <mzn-base-card-skeleton [showContent]="false" />
 * ```
 *
 * @see MznBaseCard
 */
@Component({
  selector: 'mzn-base-card-skeleton',
  standalone: true,
  imports: [MznSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <div [class]="classes.baseHeader">
      <div [class]="classes.baseHeaderContentWrapper">
        <mzn-skeleton [height]="20" width="60%" />
        <mzn-skeleton [height]="16" width="40%" />
      </div>
    </div>
    @if (showContent()) {
      <div [class]="classes.baseContent">
        <mzn-skeleton [height]="16" width="100%" />
        <mzn-skeleton [height]="16" width="80%" style="margin-top: 8px" />
      </div>
    }
  `,
})
export class MznBaseCardSkeleton {
  protected readonly classes = classes;

  /**
   * 是否顯示內容區域的骨架屏。
   * @default true
   */
  readonly showContent = input(true);

  protected readonly hostClasses = computed((): string =>
    clsx(classes.base, classes.baseReadOnly),
  );
}
