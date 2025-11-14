export type ToggleSize = 'main' | 'sub';

export const togglePrefix = 'mzn-toggle';

export const toggleClasses = {
  host: togglePrefix,
  // status
  checked: `${togglePrefix}--checked`,
  disabled: `${togglePrefix}--disabled`,
  // size
  main: `${togglePrefix}--main`,
  sub: `${togglePrefix}--sub`,
  // controller
  inputContainer: `${togglePrefix}__input-container`,
  knob: `${togglePrefix}__knob`,
  input: `${togglePrefix}__input`,
  // text content
  textContainer: `${togglePrefix}__text-container`,
} as const;
