import { toCssVar } from '../css';
import { palettePrefix } from '../palette';
import { typographyPrefix } from './constants';
import { TypographyCssVars } from './typings';

export function toTypographyCssVars(variables: TypographyCssVars) {
  const {
    align,
    color,
    display,
  } = variables;

  return {
    [`--${typographyPrefix}-align`]: align,
    [`--${typographyPrefix}-color`]: !color || color === 'inherit'
      ? color
      : toCssVar(`${palettePrefix}-${color}`),
    [`--${typographyPrefix}-display`]: display,
  };
}
