import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { MznSkeleton } from '@mezzanine-ui/ng/skeleton';

/**
 * Skeleton placeholder for FourThumbnailCard component.
 * Renders a skeleton that mimics the FourThumbnailCard layout with a 2x2 thumbnail grid.
 *
 * @example
 * ```html
 * import { MznFourThumbnailCardSkeleton } from '@mezzanine-ui/ng/four-thumbnail-card';
 *
 * <mzn-four-thumbnail-card-skeleton />
 * <mzn-four-thumbnail-card-skeleton [thumbnailWidth]="160" />
 * ```
 *
 * @see MznFourThumbnailCard
 */
@Component({
  selector: 'mzn-four-thumbnail-card-skeleton',
  standalone: true,
  imports: [MznSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
  },
  template: `
    <div [class]="thumbnailGridClass">
      @for (item of thumbnailSlots; track $index) {
        <div
          mznSkeleton
          [class]="thumbnailItemClass"
          [width]="thumbnailWidth()"
          [style.aspect-ratio]="'4/3'"
        ></div>
      }
    </div>
    <div [class]="infoClass">
      <div [class]="infoMainClass">
        <div [class]="infoContentClass" style="width: 100%;">
          <div mznSkeleton [height]="20" width="100%"></div>
          <div mznSkeleton [height]="16" width="100%"></div>
        </div>
      </div>
    </div>
  `,
})
export class MznFourThumbnailCardSkeleton {
  protected readonly hostClass = classes.thumbnail;
  protected readonly thumbnailGridClass = classes.fourThumbnail;
  protected readonly thumbnailItemClass = classes.fourThumbnailThumbnail;
  protected readonly infoClass = classes.thumbnailInfo;
  protected readonly infoMainClass = classes.thumbnailInfoMain;
  protected readonly infoContentClass = classes.thumbnailInfoContent;

  protected readonly thumbnailSlots: readonly null[] = Array.from({
    length: 4,
  });

  /**
   * Width of each thumbnail skeleton in the 2x2 grid.
   * Accepts a number (pixels) or a CSS string value.
   * @default 200
   */
  readonly thumbnailWidth = input<number | string>(200);
}
