import { MainColor } from '@mezzanine-ui/system/palette';
import { Size } from '@mezzanine-ui/system/size';

export type CardColor = Extract<MainColor, 'primary' | 'secondary'>;
export type CardSize = Size;
export type CardVariant = 'contained' | 'outlined' | 'text';

export const cardPrefix = 'mzn-card';

export const cardClasses = {
  host: cardPrefix,
  media: `${cardPrefix}__media`,
  cardSpace: `${cardPrefix}__cardSpace`,
  header: `${cardPrefix}__header`,
  title: `${cardPrefix}__title`,
  subhead: `${cardPrefix}__subhead`,
  content: `${cardPrefix}__content`,
  footer: `${cardPrefix}__footer`,
} as const;
