export const anchorPrefix = 'mzn-anchor';

export const anchorClasses = {
  host: anchorPrefix,
  anchor: `${anchorPrefix}__anchor`,
  anchorActive: `${anchorPrefix}__anchor--active`,
  anchorDisabled: `${anchorPrefix}__anchor--disabled`,
  defaultPadding: `${anchorPrefix}__anchor--default-padding`,
  nested: `${anchorPrefix}__nested`,
  nestedLevel1: `${anchorPrefix}__nested--level-1`,
  nestedLevel2: `${anchorPrefix}__nested--level-2`,
} as const;
