/**
 * 選擇卡片的排列方向。
 * - `'horizontal'` — 水平排列
 * - `'vertical'` — 垂直排列
 */
export type SelectionCardDirection = 'horizontal' | 'vertical';

/**
 * 選擇卡片的選取類型。
 * - `'radio'` — 單選
 * - `'checkbox'` — 多選
 */
export type SelectionCardType = 'radio' | 'checkbox';

export type SelectionCardImageObjectFit =
  | 'cover'
  | 'contain'
  | 'fill'
  | 'none'
  | 'scale-down';

export const selectionCardPrefix = 'mzn-selection-card';

export const selectionCardClasses = {
  host: selectionCardPrefix,
  group: `${selectionCardPrefix}-group`,
  container: `${selectionCardPrefix}__container`,
  selectionImage: `${selectionCardPrefix}__selection-image`,
  text: `${selectionCardPrefix}__text`,
  supportingText: `${selectionCardPrefix}__supporting-text`,
  content: `${selectionCardPrefix}__content`,
  direction: (direction: SelectionCardDirection) =>
    `${selectionCardPrefix}--${direction}`,
  disabled: `${selectionCardPrefix}--disabled`,
  readonly: `${selectionCardPrefix}--readonly`,
  selected: `${selectionCardPrefix}--selected`,
  focused: `${selectionCardPrefix}--focused`,
  icon: `${selectionCardPrefix}__icon`,
  input: `${selectionCardPrefix}__input`,
};
