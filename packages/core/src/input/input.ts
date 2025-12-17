import { TextFieldSize } from '../text-field';

export type InputSize = TextFieldSize;
export type InputStrength = 'weak' | 'medium' | 'strong';

export const inputPrefix = 'mzn-input';

export const inputSpinnerButtonClasses = {
  host: `${inputPrefix}__spinner-button`,
  disabled: `${inputPrefix}__spinner-button--disabled`,
  main: `${inputPrefix}__spinner-button--main`,
  sub: `${inputPrefix}__spinner-button--sub`,
} as const;

export const inputActionButtonClasses = {
  host: `${inputPrefix}__action-button`,
  disabled: `${inputPrefix}__action-button--disabled`,
  icon: `${inputPrefix}__action-button__icon`,
  text: `${inputPrefix}__action-button__text`,
  main: `${inputPrefix}__action-button--main`,
  sub: `${inputPrefix}__action-button--sub`,
} as const;

export const inputSelectButtonClasses = {
  host: `${inputPrefix}__select-button`,
  disabled: `${inputPrefix}__select-button--disabled`,
  icon: `${inputPrefix}__select-button__icon`,
  text: `${inputPrefix}__select-button__text`,
  main: `${inputPrefix}__select-button--main`,
  sub: `${inputPrefix}__select-button--sub`,
} as const;

export const inputPasswordStrengthIndicatorClasses = {
  host: `${inputPrefix}__password-strength-indicator`,
  bar: `${inputPrefix}__password-strength-indicator__bar`,
  barState: (strength: InputStrength) =>
    `${inputPrefix}__password-strength-indicator__bar--${strength}`,
  text: `${inputPrefix}__password-strength-indicator__text`,
  hintTextGroup: `${inputPrefix}__password-strength-indicator__hint-text-group`,
} as const;

export const inputClasses = {
  container: `${inputPrefix}-container`,
  indicatorContainer: `${inputPrefix}__indicator-container`,
  host: inputPrefix,
  withPrefixExternalAction: `${inputPrefix}--with-prefix-external-action`,
  withSuffixExternalAction: `${inputPrefix}--with-suffix-external-action`,
  field: `${inputPrefix}__field`,
  number: `${inputPrefix}--number`,
  size: (size: InputSize) => `${inputPrefix}--${size}`,
  spinners: `${inputPrefix}__spinners`,
} as const;
