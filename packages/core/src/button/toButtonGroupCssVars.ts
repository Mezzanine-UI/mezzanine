import { CssVarInterpolations } from '../css';
import { toSpacingCssVar } from '../spacing';
import { ButtonGroupCssVars } from './typings';
import { buttonGroupPrefix } from './constants';

export function toButtonGroupCssVars(variables: ButtonGroupCssVars): CssVarInterpolations {
  const {
    size,
    spacing,
  } = variables;

  return {
    /**
     * The default is `3` for button size="small", or `4`.
     */
    [`--${buttonGroupPrefix}-spacing`]: toSpacingCssVar(spacing ?? (size === 'small' ? 3 : 4)),
  };
}
