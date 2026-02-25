import { CascaderSize } from '@mezzanine-ui/core/cascader';

export type { CascaderSize };

export interface CascaderOption {
  children?: CascaderOption[];
  disabled?: boolean;
  id: string;
  name: string;
}

export interface CascaderBaseProps {
  /**
   * Additional class name.
   */
  className?: string;
  /**
   * Whether to show the clear button when a value is selected.
   * @default false
   */
  clearable?: boolean;
  /**
   * Whether the cascader is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether to show in error state.
   * @default false
   */
  error?: boolean;
  /**
   * Whether the cascader takes full width.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The z-index of the dropdown.
   */
  dropdownZIndex?: number | string;
  /**
   * Whether to enable portal for the dropdown.
   * @default true
   */
  globalPortal?: boolean;
  /**
   * The max height of each cascader panel column.
   */
  menuMaxHeight?: number | string;
  /**
   * Callback fired when the dropdown is closed.
   */
  onBlur?: () => void;
  /**
   * Callback fired when the dropdown is opened.
   */
  onFocus?: () => void;
  /**
   * The tree options for the cascader.
   */
  options: CascaderOption[];
  /**
   * Placeholder text for the trigger input.
   */
  placeholder?: string;
  /**
   * Whether the cascader is read-only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the cascader is required.
   * @default false
   */
  required?: boolean;
  /**
   * The size of the trigger input.
   * @default 'main'
   */
  size?: CascaderSize;
}

export interface CascaderProps extends CascaderBaseProps {
  /**
   * Uncontrolled default value (array from root to leaf).
   */
  defaultValue?: CascaderOption[];
  /**
   * Callback fired when the final leaf option is selected.
   */
  onChange?: (value: CascaderOption[]) => void;
  /**
   * Controlled value (array from root to leaf).
   */
  value?: CascaderOption[];
}
