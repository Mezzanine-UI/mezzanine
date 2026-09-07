/**
 * Card type for loading skeleton
 */
export type CardGroupLoadingType =
  | 'base'
  | 'four-thumbnail'
  | 'quick-action'
  | 'single-thumbnail';

export interface CardGroupProps {
  /**
   * Whether to show loading skeletons
   * @default false
   */
  loading?: boolean;
  /**
   * Number of skeleton items to render when loading
   * @default 3
   */
  loadingCount?: number;
  /**
   * Aspect ratio of thumbnail skeletons when loadingType is 'single-thumbnail' or 'four-thumbnail'.
   * For single-thumbnail, defaults to '16/9'. For four-thumbnail, defaults to '4/3'.
   */
  loadingThumbnailAspectRatio?: string;
  /**
   * Width of each thumbnail skeleton when loadingType is 'single-thumbnail' or 'four-thumbnail'.
   * @default 360
   */
  loadingThumbnailWidth?: number | string;
  /**
   * Type of card skeleton to render when loading.
   * Required when loading is true.
   */
  loadingType?: CardGroupLoadingType;
}
