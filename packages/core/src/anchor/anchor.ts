export const anchorPrefix = 'mzn-anchor';

export const anchorClasses = {
  host: anchorPrefix,
  anchorItem: `${anchorPrefix}__anchorItem`,
  anchorItemActive: `${anchorPrefix}__anchorItem--active`,
  anchorItemDisabled: `${anchorPrefix}__anchorItem--disabled`,
  nested: `${anchorPrefix}__nested`,
  nestedLevel1: `${anchorPrefix}__nested--level-1`,
  nestedLevel2: `${anchorPrefix}__nested--level-2`,
} as const;
