import { CssVarInterpolations, toCssVar } from '../css';
import { Color, palettePrefix } from '../palette';
import { iconPrefix } from './constants';
import { IconCssVars } from './typings';

export function toIconCssVars(variables: IconCssVars): CssVarInterpolations {
  const { color } = variables;

  if (!color) {
    return {};
  }

  let colorValue: string;

  if (color === 'inherit') {
    colorValue = color;
  } else {
    /**
     * Use `action-disabled` color of palette as `disabled` color of icon.
     */
    const colorName: Color = color === 'disabled'
      ? 'action-disabled'
      : color;

    colorValue = toCssVar(`${palettePrefix}-${colorName}`);
  }

  return {
    [`--${iconPrefix}-color`]: colorValue,
  };
}
