import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import Typography, { TypographyComponent, TypographyProps } from './Typography';

export type {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
export type { TypographySemanticType } from '@mezzanine-ui/system/typography';

export type { TypographyComponent, TypographyProps };

type GenericTypography = <C extends TypographyComponent = 'p'>(
  props: PropsWithoutRef<TypographyProps<C>> & RefAttributes<HTMLElement>,
) => ReactElement<any>;

export default Typography as GenericTypography;
