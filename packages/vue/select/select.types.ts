import type {
  DropdownLoadingPosition,
  DropdownOption,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';
import type { SelectInputSize } from '@mezzanine-ui/core/select';
import type { SelectTriggerProps } from './select-trigger.types';

export interface SelectValue<T = string> {
  /** 選項的唯一識別值。 */
  id: T;
  /** 選項的顯示文字。 */
  name: string;
}

export interface SelectControl<T = string> {
  /** 選取變更時的回呼函式。 */
  onChange: (
    v: SelectValue<T> | null,
  ) => SelectValue<T>[] | SelectValue<T> | null;
  /** 當前選取的值，單選為 SelectValue | null，多選為 SelectValue[]。 */
  value: SelectValue<T>[] | SelectValue<T> | null;
}

/**
 * The single and multiple variants React expresses as a union, flattened into
 * one interface.
 *
 * Vue's `defineProps` resolves a union whose members discriminate on a literal
 * down to something unusable — the same limitation Input's and Tag's props
 * document — so `defaultValue`, `value` and `renderValue` accept both shapes
 * here. The prop names, their types and the runtime behaviour are unchanged;
 * what is lost is the compile-time guarantee that a `single` select cannot be
 * given an array.
 */
export interface SelectProps
  extends Omit<
    SelectTriggerProps,
    'active' | 'defaultValue' | 'renderValue' | 'type' | 'value'
  > {
  /**
   * The default selection.
   */
  defaultValue?: SelectValue[] | SelectValue;
  /**
   * The z-index of the dropdown.
   */
  dropdownZIndex?: number | string;
  /**
   * Whether to enable floating-ui `flip` middleware for the dropdown menu.
   * When `true`, the menu flips from below to above the input (and back) along
   * the main axis if it would overflow the viewport, keeping its width and
   * horizontal alignment with the input. Forwarded to the underlying `Dropdown`.
   * @default false
   */
  flip?: boolean;
  /**
   * Whether to enable portal for the dropdown.
   * @default true
   */
  globalPortal?: boolean;
  /**
   * Whether the dropdown is in a loading state.
   * @default false
   */
  loading?: boolean;
  /**
   * The position of the loading indicator.
   * @default 'bottom'
   */
  loadingPosition?: DropdownLoadingPosition;
  /**
   * The text displayed while loading.
   */
  loadingText?: string;
  /**
   * The max height of the dropdown list.
   */
  menuMaxHeight?: number | string;
  /**
   * Direct options array for dropdown (supports tree structure).
   * If provided, `type` will be automatically set.
   */
  options?: DropdownOption[];
  /**
   * select input placeholder
   */
  placeholder?: string;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * To customize rendering select input value.
   */
  renderValue?: (values: SelectValue[] | SelectValue | null) => string;
  /**
   * Whether the selection is required.
   * @default false
   */
  required?: boolean;
  /**
   * The size of input.
   */
  size?: SelectInputSize;
  /**
   * The type of dropdown.
   * @default 'default'
   */
  type?: DropdownType;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[] | SelectValue | null;
}
