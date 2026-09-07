import type { PaginationItemType } from '@mezzanine-ui/core/pagination';

export interface PaginationItemProps {
  /**
   * If `true`, the pagination item is active.
   * @default false
   */
  active?: boolean;
  /**
   * If `true`, the pagination item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The page number.
   * @default 1
   */
  page?: number;
  /**
   * The type of pagination item.
   * @default 'page'
   */
  type?: PaginationItemType;
}
