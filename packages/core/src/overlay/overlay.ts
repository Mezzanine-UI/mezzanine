export const overlayPrefix = 'mzn-overlay';

export const overlayClasses = {
  host: overlayPrefix,
  hostFixed: `${overlayPrefix}--fixed`,
  backdrop: `${overlayPrefix}__backdrop`,
  backdropFixed: `${overlayPrefix}__backdrop--fixed`,
  invisible: `${overlayPrefix}__backdrop--invisible`,
} as const;
