import { classes as cssClasses } from '../css';
import { TypographyVariant } from './typings';
import { prefix } from './constants';

export const classes = {
  variant: (variant: TypographyVariant) => `${prefix}--${variant}`,
  align: cssClasses.prop('text-align'),
  color: cssClasses.prop('color'),
  display: cssClasses.prop('display'),
  ellipsis: `${prefix}--ellipsis`,
  noWrap: `${prefix}--nowrap`,
};
