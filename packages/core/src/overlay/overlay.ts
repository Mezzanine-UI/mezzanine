export const overlayPrefix = 'mzn-overlay';

export type OverlayVariant = 'dark' | 'light';

export const overlayClasses = {
  host: overlayPrefix,
  hostOpen: `${overlayPrefix}--open`,
  hostAbsolute: `${overlayPrefix}--absolute`,
  backdrop: `${overlayPrefix}__backdrop`,
  backdropVariant: (variant: OverlayVariant) =>
    `${overlayPrefix}__backdrop--${variant}`,
  content: `${overlayPrefix}__content`,
} as const;
