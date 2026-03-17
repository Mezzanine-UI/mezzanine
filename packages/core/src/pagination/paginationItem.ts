export const paginationItemPrefix = 'mzn-pagination-item';

/**
 * 分頁元件中單一項目的類型。
 * - `'page'` — 頁碼按鈕
 * - `'ellipsis'` — 省略符號
 * - `'previous'` — 上一頁按鈕
 * - `'next'` — 下一頁按鈕
 */
export type PaginationItemType =
  | 'page'
  | 'ellipsis'
  | 'previous'
  | 'next'
  | string;

export const paginationItemClasses = {
  host: paginationItemPrefix,
  button: `${paginationItemPrefix}__button`,
  ellipsis: `${paginationItemPrefix}__ellipsis`,
  active: `${paginationItemPrefix}--active`,
  disabled: `${paginationItemPrefix}--disabled`,
} as const;
