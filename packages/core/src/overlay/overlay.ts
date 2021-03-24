export const overlayPrefix = 'mzn-overlay';

export const overlayClasses = {
  host: overlayPrefix,
  backdrop: `${overlayPrefix}__backdrop`,
  invisible: `${overlayPrefix}__backdrop--invisible`,
} as const;
