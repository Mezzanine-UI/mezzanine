import {
  ElementRef,
  PropsWithoutRef,
  ReactElement,
  RefAttributes,
} from 'react';
import Typography, { TypographyComponent, TypographyProps } from './Typography';

export type {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographyVariant,
  TypographyWeight,
} from '@mezzanine-ui/core/typography';

export type {
  TypographyComponent,
  TypographyProps,
};

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
type GenericTypography = <C extends TypographyComponent = 'p'>(
  props: PropsWithoutRef<TypographyProps<C>> & RefAttributes<ElementRef<C>>
) => ReactElement;

export default Typography as GenericTypography;
