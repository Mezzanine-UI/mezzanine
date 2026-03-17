import { SelectTriggerType } from '@mezzanine-ui/core/select';
import { ReactElement, Ref } from 'react';
import Icon, { IconProps } from '../Icon';
import { TextFieldProps } from '../TextField';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface SelectValue<T = string> {
  /** 選項的唯一識別值。 */
  id: T;
  /** 選項的顯示文字。 */
  name: string;
}

export interface SelectControl<T = string> {
  /** 當前選取的值，單選為 SelectValue | null，多選為 SelectValue[]。 */
  value: SelectValue<T>[] | SelectValue<T> | null;
  /** 選取變更時的回呼函式。 */
  onChange: (
    v: SelectValue<T> | null,
  ) => SelectValue<T>[] | SelectValue<T> | null;
}

export type SelectTriggerInputProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'input'>,
  | 'autoComplete'
  | 'children'
  | 'defaultValue'
  | 'disabled'
  | 'required'
  | 'type'
  | 'value'
  | `aria-${
      | 'autocomplete'
      | 'disabled'
      | 'haspopup'
      | 'multiline'
      | 'required'}`
>;

export interface SelectTriggerBaseProps
  extends Omit<
    TextFieldProps,
    | 'active'
    | 'children'
    | 'defaultChecked'
    | 'suffix'
    | 'typing'
    | 'disabled'
    | 'readonly'
  > {
  /**
   * Controls the chevron icon layout.
   */
  active?: boolean;
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * force hide suffixAction icons
   */
  forceHideSuffixActionIcon?: boolean;
  /**
   * The ref for SelectTrigger root.
   */
  innerRef?: Ref<HTMLDivElement>;
  /**
   * Other props you may provide to input element.
   */
  inputProps?: SelectTriggerInputProps;
  /**
   * The ref object for input element.
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * The click handler for the cross icon on tags
   */
  onTagClose?: (target: SelectValue) => void;
  /** Placeholder text when not selected */
  placeholder?: string;
  /**
   * Whether to force show clearable icon regardless of value state.
   * @default false
   */
  isForceClearable?: boolean;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /** 觸發器輸入框中的搜尋/篩選文字，用於過濾下拉選項。 */
  searchText?: string;
  /**
   * 多選模式下是否在已選標籤後顯示文字輸入框，啟用行內搜尋。
   * @default false
   */
  showTextInputAfterTags?: boolean;
  /** Suffix icon click event handler */
  suffixAction?: VoidFunction;
  /** Customize suffix icon */
  suffixActionIcon?: ReactElement<IconProps, typeof Icon>;
  /** Type default/error of the SelectTrigger */
  type?: SelectTriggerType;
}

export type SelectTriggerSingleProps = SelectTriggerBaseProps & {
  /**
   * Controls the layout of trigger.
   * @default single
   */
  mode?: 'single';
  /**
   * Only available on multiple selector
   */
  overflowStrategy?: never;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue;
  /**
   * Provide if you have a customize value rendering logic.
   * By default will have a comma between values.
   */
  renderValue?: (value?: SelectValue | null) => string;
};

export type SelectTriggerMultipleProps = SelectTriggerBaseProps & {
  /**
   * Controls the layout of trigger.
   * @default single
   */
  mode: 'multiple';
  /**
   * Tag overflow strategy:
   * - counter: collapse extra tags into a counter tag showing the remaining count.
   * - wrap: wrap to new lines to display all tags.
   * @default counter
   */
  overflowStrategy?: 'counter' | 'wrap';
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[];
};

export type SelectTriggerComponentProps =
  | SelectTriggerSingleProps
  | SelectTriggerMultipleProps;

export type SelectTriggerProps = Omit<SelectTriggerComponentProps, 'innerRef'>;
