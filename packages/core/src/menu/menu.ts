import { CssVarInterpolations } from '../css';
import { MznSize } from '../size';

export type MenuSize = MznSize;

export interface MenuCssVars {
  itemsInView: number;
  maxHeight?: number;
}

export const menuPrefix = 'mzn-menu';

export const menuClasses = {
  host: menuPrefix,
  size: (size: MenuSize) => `${menuPrefix}--${size}`,
} as const;

export function toMenuCssVars(variables: MenuCssVars): CssVarInterpolations {
  const {
    itemsInView,
    maxHeight,
  } = variables;

  return {
    [`--${menuPrefix}-max-height`]: typeof maxHeight === 'number'
      ? `${maxHeight}px`
      : null,
    [`--${menuPrefix}-items-in-view`]: itemsInView,
  };
}
