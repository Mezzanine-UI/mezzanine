export const filterAreaPrefix = 'mzn-filter-area';

export type FilterAreaSize = 'main' | 'sub';

export type FilterAreaActionsAlign = 'start' | 'center' | 'end';

export type FilterSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type FilterAlign = 'start' | 'center' | 'end' | 'stretch';

export const filterAreaClasses = {
  host: filterAreaPrefix,
  panelHost: `${filterAreaPrefix}--panel`,
  actions: `${filterAreaPrefix}__actions`,
  actionsAlignStart: (align: FilterAreaActionsAlign) =>
    `${filterAreaPrefix}__actions--align-${align}`,
  actionsExpanded: `${filterAreaPrefix}__actions--expanded`,
  row: `${filterAreaPrefix}__row`,
  size: (size: FilterAreaSize) => `${filterAreaPrefix}--${size}`,
  line: `${filterAreaPrefix}__line`,
  filter: `${filterAreaPrefix}__filter`,
  filterGrow: `${filterAreaPrefix}__filter--grow`,
  filterAlign: (align: FilterAlign) =>
    `${filterAreaPrefix}__filter--align-${align}`,
};
