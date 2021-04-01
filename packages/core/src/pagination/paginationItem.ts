export const paginationItemPrefix = 'mzn-pagination-item';

export type PaginationItemType = 'page' | 'ellipsis' | 'previous' | 'next' | string;

export const paginationItemClasses = {
  host: paginationItemPrefix,
  button: `${paginationItemPrefix}__button`,
  ellipsis: `${paginationItemPrefix}__ellipsis`,
  active: `${paginationItemPrefix}--active`,
  disabled: `${paginationItemPrefix}--disabled`,
} as const;
