import { prefix as cssPrefix, toCssVar } from '../css';
import { prefix as palettePrefix } from '../palette';
import { TypographyCssVars } from './typings';

export function toTypographyCssVars(variables: TypographyCssVars) {
  const {
    align,
    color,
    display,
  } = variables;

  return {
    [`--${cssPrefix}-align`]: align,
    [`--${cssPrefix}-color`]: !color || color === 'inherit'
      ? color
      : toCssVar(`${palettePrefix}-${color}`),
    [`--${cssPrefix}-display`]: display,
  };
}
