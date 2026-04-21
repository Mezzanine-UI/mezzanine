import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { MznSkeleton } from '@mezzanine-ui/ng/skeleton';

/**
 * Skeleton placeholder for SingleThumbnailCard component.
 * Renders a skeleton that mimics the SingleThumbnailCard layout,
 * with configurable thumbnail aspect ratio and width.
 *
 * @example
 * ```html
 * import { MznSingleThumbnailCardSkeleton } from '@mezzanine-ui/ng/single-thumbnail-card';
 *
 * <div mznSingleThumbnailCardSkeleton ></div>
 * <div mznSingleThumbnailCardSkeleton thumbnailAspectRatio="4/3" thumbnailWidth="200px" ></div>
 * ```
 *
 * @see MznSingleThumbnailCard
 */
@Component({
  selector: '[mznSingleThumbnailCardSkeleton]',
  host: {
    '[class]': 'singleThumbnailClass',
    '[attr.thumbnailAspectRatio]': 'null',
    '[attr.thumbnailWidth]': 'null',
  },
  standalone: true,
  imports: [MznSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="singleThumbnailClass">
      <div
        mznSkeleton
        height="100%"
        [style.aspectRatio]="thumbnailAspectRatio()"
        [width]="thumbnailWidth()"
      ></div>
    </div>
    <div [class]="infoClass">
      <div [class]="infoMainClass">
        <div [class]="infoContentClass" style="width: 100%">
          <div mznSkeleton [height]="20" width="100%"></div>
          <div mznSkeleton [height]="16" width="100%"></div>
        </div>
      </div>
    </div>
  `,
})
export class MznSingleThumbnailCardSkeleton {
  /**
   * Aspect ratio of the thumbnail skeleton.
   * @default '16/9'
   */
  readonly thumbnailAspectRatio = input('16/9');

  /**
   * Width of the thumbnail skeleton.
   * @default 'var(--mzn-spacing-size-container-slim)'
   */
  readonly thumbnailWidth = input<number | string>(
    'var(--mzn-spacing-size-container-slim)',
  );

  @HostBinding('class')
  protected readonly hostClass = classes.thumbnail;

  protected readonly singleThumbnailClass = classes.singleThumbnail;
  protected readonly infoClass = classes.thumbnailInfo;
  protected readonly infoMainClass = classes.thumbnailInfoMain;
  protected readonly infoContentClass = classes.thumbnailInfoContent;
}
