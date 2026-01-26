export type SelectionDirection = 'horizontal' | 'vertical';

export type SelectionType = 'radio' | 'checkbox';

export type SelectionImageObjectFit =
  | 'cover'
  | 'contain'
  | 'fill'
  | 'none'
  | 'scale-down';

export const selectionPrefix = 'mzn-selection';

export const selectionClasses = {
  host: selectionPrefix,
  group: `${selectionPrefix}-group`,
  container: `${selectionPrefix}__container`,
  selectionImage: `${selectionPrefix}__selection-image`,
  text: `${selectionPrefix}__text`,
  supportingText: `${selectionPrefix}__supporting-text`,
  content: `${selectionPrefix}__content`,
  direction: (direction: SelectionDirection) =>
    `${selectionPrefix}--${direction}`,
  disabled: `${selectionPrefix}--disabled`,
  readonly: `${selectionPrefix}--readonly`,
  selected: `${selectionPrefix}--selected`,
  focused: `${selectionPrefix}--focused`,
  icon: `${selectionPrefix}__icon`,
  input: `${selectionPrefix}__input`,
};
