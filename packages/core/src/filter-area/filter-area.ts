export const filterAreaPrefix = 'mzn-filter-area';

/**
 * FilterArea 的整體尺寸。
 * - `'main'` — 主要尺寸
 * - `'sub'` — 次要尺寸
 */
export type FilterAreaSize = 'main' | 'sub';

/**
 * FilterArea 操作按鈕區塊的對齊方式。
 * - `'start'` — 靠起始端對齊
 * - `'center'` — 置中對齊
 * - `'end'` — 靠結尾端對齊
 */
export type FilterAreaActionsAlign = 'start' | 'center' | 'end';

/**
 * FilterArea `__row` 的 cross-axis 對齊方式。
 * - `'start'` — 靠起始端對齊（`flex-start`）
 * - `'center'` — 置中對齊（`center`）
 * - `'end'` — 靠結尾端對齊（`flex-end`）
 */
export type FilterAreaRowAlign = 'start' | 'center' | 'end';

export type FilterSpan = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 單一篩選欄位的對齊方式。
 * - `'start'` — 靠起始端對齊
 * - `'center'` — 置中對齊
 * - `'end'` — 靠結尾端對齊
 * - `'stretch'` — 延伸填滿格子
 */
export type FilterAlign = 'start' | 'center' | 'end' | 'stretch';

export const filterAreaClasses = {
  host: filterAreaPrefix,
  actions: `${filterAreaPrefix}__actions`,
  actionsAlign: (align: FilterAreaActionsAlign) =>
    `${filterAreaPrefix}__actions--align-${align}`,
  actionsExpanded: `${filterAreaPrefix}__actions--expanded`,
  row: `${filterAreaPrefix}__row`,
  rowAlign: (align: FilterAreaRowAlign) => `${filterAreaPrefix}__row--align-${align}`,
  size: (size: FilterAreaSize) => `${filterAreaPrefix}--${size}`,
  line: `${filterAreaPrefix}__line`,
  filter: `${filterAreaPrefix}__filter`,
  filterGrow: `${filterAreaPrefix}__filter--grow`,
  filterAlign: (align: FilterAlign) =>
    `${filterAreaPrefix}__filter--align-${align}`,
};
