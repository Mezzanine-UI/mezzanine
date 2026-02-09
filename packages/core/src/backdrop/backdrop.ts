export const backdropPrefix = 'mzn-backdrop';

export type BackdropVariant = 'dark' | 'light';

export const backdropClasses = {
  host: backdropPrefix,
  hostOpen: `${backdropPrefix}--open`,
  hostAbsolute: `${backdropPrefix}--absolute`,
  main: `${backdropPrefix}__main`,
  backdrop: `${backdropPrefix}__backdrop`,
  backdropVariant: (variant: BackdropVariant) =>
    `${backdropPrefix}__backdrop--${variant}`,
  content: `${backdropPrefix}__content`,
} as const;
