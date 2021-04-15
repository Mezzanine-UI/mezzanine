export const overlayPrefix = 'mzn-overlay';

export const overlayClasses = {
  host: overlayPrefix,
  hostFixed: `${overlayPrefix}--fixed`,
  backdrop: `${overlayPrefix}__backdrop`,
  backdropOnSurface: `${overlayPrefix}__backdrop--on-surface`,
  backdropFixed: `${overlayPrefix}__backdrop--fixed`,
  invisible: `${overlayPrefix}__backdrop--invisible`,
} as const;
