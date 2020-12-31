import { prefix as cssPrefix, toCssVar } from '../css';
import { Color, prefix as palettePrefix } from '../palette';
import { IconCssVars } from './typings';

export function toIconCssVars(variables: IconCssVars): Record<string, any> {
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
    [`--${cssPrefix}-color`]: colorValue,
  };
}
