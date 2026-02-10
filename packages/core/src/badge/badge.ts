export const badgePrefix = 'mzn-badge';

export type BadgeVariant =
  | BadgeDotVariant
  | BadgeCountVariant
  | BadgeTextVariant;

export type BadgeTextVariant =
  | 'text-success'
  | 'text-error'
  | 'text-warning'
  | 'text-info'
  | 'text-inactive';

export type BadgeDotVariant =
  | 'dot-success'
  | 'dot-error'
  | 'dot-warning'
  | 'dot-info'
  | 'dot-inactive';

export type BadgeCountVariant =
  | 'count-alert'
  | 'count-inactive'
  | 'count-inverse'
  | 'count-brand'
  | 'count-info';

export const badgeClasses = {
  host: badgePrefix,
  variant: (variant: BadgeDotVariant | BadgeCountVariant | BadgeTextVariant) =>
    `${badgePrefix}--${variant}`,
  container: (hasChilden: boolean) =>
    hasChilden
      ? `${badgePrefix}__container--has-children`
      : `${badgePrefix}__container`,
  hide: `${badgePrefix}--hide`,
} as const;
