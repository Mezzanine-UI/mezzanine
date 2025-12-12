import { ReactElement, Ref } from 'react';
import Icon, { IconProps } from '../Icon';
import { SelectTriggerType } from '@mezzanine-ui/core/select';
import { TextFieldProps } from '../TextField';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface SelectValue<T = string> {
  id: T;
  name: string;
}

export interface TreeSelectOption<T = string> extends SelectValue<T> {
  dynamicChildrenFetching?: boolean;
  siblings?: TreeSelectOption<T>[];
}

export interface SelectControl<T = string> {
  value: SelectValue<T>[] | SelectValue<T> | null;
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
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  searchText?: string;
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
