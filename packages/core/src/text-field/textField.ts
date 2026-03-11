import { GeneralSize } from '@mezzanine-ui/system/size';

export type TextFieldSize = Extract<GeneralSize, 'main' | 'sub'>;

export const textFieldPrefix = 'mzn-text-field';

export const textFieldClasses = {
  host: textFieldPrefix,
  monoInput: `${textFieldPrefix}--mono-input`,
  slimGap: `${textFieldPrefix}--slim-gap`,
  tinyGap: `${textFieldPrefix}--tiny-gap`,
  active: `${textFieldPrefix}--active`,
  clearIcon: `${textFieldPrefix}__clear-icon`,
  clearable: `${textFieldPrefix}--clearable`,
  clearing: `${textFieldPrefix}--clearing`,
  suffixContent: `${textFieldPrefix}__suffix-content`,
  suffixOverlay: `${textFieldPrefix}__suffix--overlay`,
  disabled: `${textFieldPrefix}--disabled`,
  error: `${textFieldPrefix}--error`,
  fullWidth: `${textFieldPrefix}--full-width`,
  inputPadding: `${textFieldPrefix}__input-padding`,
  inputPaddingMain: `${textFieldPrefix}__input-padding--main`,
  inputPaddingSub: `${textFieldPrefix}__input-padding--sub`,
  main: `${textFieldPrefix}--main`,
  noPadding: `${textFieldPrefix}--no-padding`,
  placeholder: `${textFieldPrefix}__placeholder`,
  prefix: `${textFieldPrefix}__prefix`,
  readonly: `${textFieldPrefix}--readonly`,
  sub: `${textFieldPrefix}--sub`,
  suffix: `${textFieldPrefix}__suffix`,
  typing: `${textFieldPrefix}--typing`,
  warning: `${textFieldPrefix}--warning`,
} as const;
