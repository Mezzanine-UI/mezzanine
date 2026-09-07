import type { CascaderSize } from '@mezzanine-ui/core/cascader';

export type { CascaderSize };

export interface CascaderOption {
  /** The options one level down; a leaf has none. */
  children?: CascaderOption[];
  /** Whether the option refuses selection. */
  disabled?: boolean;
  /** The option's identity, unique among its siblings. */
  id: string;
  /** The label shown in the panel. */
  name: string;
}

export interface CascaderBaseProps {
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
   * The z-index of the dropdown.
   */
  dropdownZIndex?: number | string;
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
   * Whether to enable portal for the dropdown.
   * @default true
   */
  globalPortal?: boolean;
  /**
   * The max height of each cascader panel column.
   */
  menuMaxHeight?: number | string;
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
   * Controlled value (array from root to leaf).
   */
  value?: CascaderOption[];
}
