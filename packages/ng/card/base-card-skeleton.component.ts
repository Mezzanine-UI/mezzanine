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
 * <div mznBaseCardSkeleton ></div>
 * <div mznBaseCardSkeleton [showContent]="false" ></div>
 * ```
 *
 * @see MznBaseCard
 */
@Component({
  selector: '[mznBaseCardSkeleton]',
  standalone: true,
  imports: [MznSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.showContent]': 'null',
  },
  template: `
    <div [class]="classes.baseHeader">
      <div [class]="classes.baseHeaderContentWrapper">
        <div mznSkeleton [height]="20" width="60%"></div>
        <div mznSkeleton [height]="16" width="40%"></div>
      </div>
    </div>
    @if (showContent()) {
      <div [class]="classes.baseContent">
        <div mznSkeleton [height]="16" width="100%"></div>
        <div
          mznSkeleton
          [height]="16"
          width="80%"
          style="margin-top: 8px"
        ></div>
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
