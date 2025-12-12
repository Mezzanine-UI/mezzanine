export const paginationPrefix = 'mzn-pagination';

export const paginationClasses = {
  host: paginationPrefix,
  container: `${paginationPrefix}__container`,
  item: `${paginationPrefix}__item`,
  itemList: `${paginationPrefix}__item-list`,
  jumper: `${paginationPrefix}__jumper`,
  pageSize: `${paginationPrefix}__page-size`,
} as const;
