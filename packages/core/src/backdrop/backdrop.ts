export const backdropPrefix = 'mzn-backdrop';

/**
 * Backdrop 的遮罩顏色變體。
 * - `'dark'` — 深色半透明遮罩
 * - `'light'` — 淺色半透明遮罩
 */
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
