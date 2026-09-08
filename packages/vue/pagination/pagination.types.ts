import type { VNodeChild } from 'vue';
import type { PaginationItem } from './use-pagination';

export interface PaginationProps {
  /**
   * Number of always visible pages at the beginning and end.
   * @default 1
   */
  boundaryCount?: number;
  /**
   * The text displayed in the jumper `button` content.
   */
  buttonText?: string;
  /**
   * The current page number.
   * @default 1
   */
  current?: number;
  /**
   * If `true`, the fields are disabled.
   */
  disabled?: true;
  /**
   * The hint text displayed in front of jumper `input`.
   */
  hintText?: string;
  /**
   * The placeholder displayed in the jumper input before the user enters a value.
   */
  inputPlaceholder?: string;
  /**
   * Render the item.
   * @param item The props to spread on a pagination item.
   * @default (item) => h(MznPaginationItem, item)
   */
  itemRender?: (item: PaginationItem) => VNodeChild;
  /**
   * Number of items per page.
   * @default 10
   */
  pageSize?: number;
  /**
   * Label displayed before page size selector.
   */
  pageSizeLabel?: string;
  /**
   * Page size options to render.
   */
  pageSizeOptions?: number[];
  /**
   * Render custom page size option name.
   */
  renderPageSizeOptionName?: (pageSize: number) => string;
  /**
   * Render custom result summary.
   * @param from Start index of current page.
   * @param to End index of current page.
   * @param total Total number of items.
   * @example (from, to, total) => `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`
   */
  renderResultSummary?: (from: number, to: number, total: number) => string;
  /**
   * If `true`, show jumper.
   * @default false
   */
  showJumper?: boolean;
  /**
   * If `true`, show page size options.
   * @default false
   */
  showPageSizeOptions?: boolean;
  /**
   * Number of always visible pages before and after the current page.
   * @default 1
   */
  siblingCount?: number;
  /**
   * Total number of items.
   * @default 0
   */
  total?: number;
}
