export const badgePrefix = 'mzn-badge';

export type BadgeVariant =
  // dot types
  | 'dot-success'
  | 'dot-error'
  | 'dot-warning'
  | 'dot-info'
  | 'dot-inactive'

  // count types
  | 'count-alert'
  | 'count-inactive'
  | 'count-inverse'
  | 'count-brand'
  | 'count-info';

export const badgeClasses = {
  host: badgePrefix,
  variant: (variant: BadgeVariant) => `${badgePrefix}--${variant}`,
  container: `${badgePrefix}__container`,
  hide: `${badgePrefix}--hide`,
};
