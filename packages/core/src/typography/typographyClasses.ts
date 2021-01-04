import { TypographyVariant } from './typings';
import { typographyPrefix } from './constants';

export const typographyClasses = {
  variant: (variant: TypographyVariant) => `${typographyPrefix}--${variant}`,
  align: `${typographyPrefix}--align`,
  color: `${typographyPrefix}--color`,
  display: `${typographyPrefix}--display`,
  ellipsis: `${typographyPrefix}--ellipsis`,
  noWrap: `${typographyPrefix}--nowrap`,
};
