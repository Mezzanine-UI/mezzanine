import { TextFieldSize } from '../text-field';

export type CascaderSize = TextFieldSize;

export const cascaderPrefix = 'mzn-cascader';

export const cascaderClasses = {
  host: cascaderPrefix,
  hostFullWidth: `${cascaderPrefix}--full-width`,

  dropdownPanels: `${cascaderPrefix}-dropdown-panels`,

  panel: `${cascaderPrefix}-panel`,

  triggerPartial: `${cascaderPrefix}-trigger--partial`,

  item: `${cascaderPrefix}-item`,
  itemActive: `${cascaderPrefix}-item--active`,
  itemDisabled: `${cascaderPrefix}-item--disabled`,
  itemFocused: `${cascaderPrefix}-item--focused`,
  itemSelected: `${cascaderPrefix}-item--selected`,
  itemLabel: `${cascaderPrefix}-item-label`,
  itemAppend: `${cascaderPrefix}-item-append`,
} as const;
