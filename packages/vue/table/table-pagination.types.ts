import type { PaginationProps } from '../pagination/pagination.types';

/**
 * React's `TablePaginationProps` is `PaginationProps` verbatim, its callbacks
 * included. Vue's MznPagination reports those two as emits, but the table takes
 * its pagination as a **config object** prop — an object cannot carry emits —
 * so they are named fields here, the way `CropperPropsBase` and
 * `DropdownActionConfig` already do it.
 */
export interface TablePaginationProps extends PaginationProps {
  /** Callback when the current page changes. */
  onChange?: (page: number) => void;
  /** Callback when the page size changes. */
  onChangePageSize?: (pageSize: number) => void;
}
