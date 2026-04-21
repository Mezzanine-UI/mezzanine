import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import clsx from 'clsx';
import { MznSkeleton } from '@mezzanine-ui/ng/skeleton';
import { MznFourThumbnailCardSkeleton } from '@mezzanine-ui/ng/four-thumbnail-card';
import { MznSingleThumbnailCardSkeleton } from '@mezzanine-ui/ng/single-thumbnail-card';
import { MznQuickActionCardSkeleton } from './quick-action-card-skeleton.component';

/** 卡片群組的卡片類型。 */
export type CardGroupType =
  | 'base'
  | 'quick-action'
  | 'single-thumbnail'
  | 'four-thumbnail';

/**
 * 卡片群組容器，以 CSS Grid 佈局排列多張卡片。
 *
 * 透過 `cardType` 指定群組內卡片類型以套用對應的排版樣式。
 * 設定 `loading` 為 `true` 時顯示 `loadingCount` 個骨架佔位元素。
 *
 * @example
 * ```html
 * import { MznCardGroup, MznBaseCard } from '@mezzanine-ui/ng/card';
 *
 * <div mznCardGroup cardType="base">
 *   <div mznBaseCard title="卡片一">內容</div>
 *   <div mznBaseCard title="卡片二">內容</div>
 * </div>
 *
 * <div mznCardGroup cardType="base" [loading]="true" [loadingCount]="4" ></div>
 * ```
 * @see MznBaseCard
 * @see MznQuickActionCard
 */
@Component({
  selector: '[mznCardGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MznFourThumbnailCardSkeleton,
    MznQuickActionCardSkeleton,
    MznSingleThumbnailCardSkeleton,
    MznSkeleton,
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.cardType]': 'null',
    '[attr.loading]': 'null',
    '[attr.loadingCount]': 'null',
    '[attr.loadingThumbnailAspectRatio]': 'null',
    '[attr.loadingThumbnailWidth]': 'null',
  },
  template: `
    <ng-content />
    @if (loading()) {
      @for (item of skeletonItems(); track $index) {
        @switch (cardType()) {
          @case ('quick-action') {
            <div mznQuickActionCardSkeleton></div>
          }
          @case ('single-thumbnail') {
            <div
              mznSingleThumbnailCardSkeleton
              [thumbnailAspectRatio]="loadingThumbnailAspectRatio() ?? '16/9'"
              [thumbnailWidth]="
                loadingThumbnailWidth() ??
                'var(--mzn-spacing-size-container-slim)'
              "
            ></div>
          }
          @case ('four-thumbnail') {
            <div
              mznFourThumbnailCardSkeleton
              [thumbnailWidth]="loadingThumbnailWidth() ?? 200"
            ></div>
          }
          @default {
            <div [class]="baseSkeletonClass">
              <div [class]="baseSkeletonHeaderClass">
                <div [class]="baseSkeletonHeaderContentClass">
                  <div mznSkeleton [height]="20" width="60%"></div>
                  <div mznSkeleton [height]="16" width="40%"></div>
                </div>
              </div>
              <div [class]="baseSkeletonContentClass">
                <div mznSkeleton [height]="16" width="100%"></div>
                <div
                  mznSkeleton
                  [height]="16"
                  width="80%"
                  style="margin-top: 8px;"
                ></div>
              </div>
            </div>
          }
        }
      }
    }
  `,
})
export class MznCardGroup {
  /**
   * 群組內卡片類型，決定排版樣式。
   * @default 'base'
   */
  readonly cardType = input<CardGroupType>('base');

  /**
   * 是否顯示載入骨架佔位。
   * @default false
   */
  readonly loading = input(false);

  /**
   * 載入狀態下骨架佔位的數量。
   * @default 3
   */
  readonly loadingCount = input(3);

  /**
   * 當 `cardType` 為 `'single-thumbnail'` 或 `'four-thumbnail'` 時，
   * 骨架佔位中縮圖的長寬比。
   */
  readonly loadingThumbnailAspectRatio = input<string>();

  /**
   * 當 `cardType` 為 `'single-thumbnail'` 或 `'four-thumbnail'` 時，
   * 骨架佔位中縮圖的寬度。
   */
  readonly loadingThumbnailWidth = input<number | string>();

  protected readonly baseSkeletonClass = clsx(
    classes.base,
    classes.baseReadOnly,
  );
  protected readonly baseSkeletonHeaderClass = classes.baseHeader;
  protected readonly baseSkeletonHeaderContentClass =
    classes.baseHeaderContentWrapper;
  protected readonly baseSkeletonContentClass = classes.baseContent;

  protected readonly skeletonItems = computed((): readonly null[] =>
    Array.from<null>({ length: this.loadingCount() }).fill(null),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.group, {
      [classes.groupQuickAction]: this.cardType() === 'quick-action',
      [classes.groupSingleThumbnail]: this.cardType() === 'single-thumbnail',
      [classes.groupFourThumbnail]: this.cardType() === 'four-thumbnail',
    }),
  );
}
