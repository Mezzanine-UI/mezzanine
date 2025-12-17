import { GeneralSize } from '@mezzanine-ui/system/size';

export type TextFieldSize = Extract<GeneralSize, 'main' | 'sub'>;

export const textFieldPrefix = 'mzn-text-field';

export const textFieldClasses = {
  host: textFieldPrefix,
  slimGap: `${textFieldPrefix}--slim-gap`,
  active: `${textFieldPrefix}--active`,
  clearIcon: `${textFieldPrefix}__clear-icon`,
  clearable: `${textFieldPrefix}--clearable`,
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
