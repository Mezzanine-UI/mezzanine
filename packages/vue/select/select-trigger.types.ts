import type {
  SelectInputSize,
  SelectTriggerType,
} from '@mezzanine-ui/core/select';
import type { InputHTMLAttributes, VNodeChild } from 'vue';
import type { TextFieldProps } from '../text-field/text-field.types';
import type { SelectValue } from './select.types';

export type SelectTriggerInputProps = Omit<
  InputHTMLAttributes,
  | 'autoComplete'
  | 'children'
  | 'defaultValue'
  | 'disabled'
  | 'required'
  | 'type'
  | 'value'
  | `aria-${'autocomplete' | 'disabled' | 'haspopup' | 'multiline' | 'required'}`
>;

/**
 * The single and multiple trigger variants React expresses as a union,
 * flattened into one interface — the same reason `SelectProps` is flat.
 */
export interface SelectTriggerProps
  extends Omit<
    TextFieldProps,
    'active' | 'defaultChecked' | 'disabled' | 'readonly' | 'typing'
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
   * Other props you may provide to input element.
   */
  inputProps?: SelectTriggerInputProps;
  /**
   * Whether to force show clearable icon regardless of value state.
   * @default false
   */
  isForceClearable?: boolean;
  /**
   * Controls the layout of trigger.
   * @default 'single'
   */
  mode?: 'multiple' | 'single';
  /**
   * Tag overflow strategy. Only available on multiple selector.
   * - counter: collapse extra tags into a counter tag showing the remaining count.
   * - wrap: wrap to new lines to display all tags.
   * @default 'counter'
   */
  overflowStrategy?: 'counter' | 'wrap';
  /** Placeholder text when not selected */
  placeholder?: string;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Provide if you have a customize value rendering logic.
   * By default will have a comma between values. Only available on single selector.
   */
  renderValue?: (value?: SelectValue | null) => string;
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
  /**
   * The size of input.
   * @default 'main'
   */
  size?: SelectInputSize;
  /** Suffix icon click event handler */
  suffixAction?: () => void;
  /**
   * Customize suffix icon. React takes a rendered `<Icon>` element so the
   * caller can configure it; a VNode is the same thing here.
   */
  suffixActionIcon?: VNodeChild;
  /** Type default/error of the SelectTrigger */
  type?: SelectTriggerType;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[] | SelectValue;
}
