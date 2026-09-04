import type {
  CheckboxGroupLayout,
  CheckboxGroupOption,
  CheckboxMode,
} from '@mezzanine-ui/core/checkbox';
import type { CheckboxProps } from './checkbox.types';

export interface CheckboxGroupChangeEventTarget extends HTMLInputElement {
  /** The values the group holds after this change. */
  values: string[];
}

export type CheckboxGroupChangeEvent = Event & {
  target: CheckboxGroupChangeEventTarget;
};

export type CheckboxGroupOptionInput = CheckboxGroupOption &
  Omit<
    CheckboxProps,
    | 'checked'
    | 'mode'
    | 'defaultChecked'
    | 'indeterminate'
    | 'inputProps'
    | 'name'
    | 'value'
  > & {
    /**
     * The id of input element.
     * If not provided, will be auto-generated as `{name}-{value}`.
     */
    id?: string;
    /**
     * Additional props for the input element.
     */
    inputProps?: CheckboxProps['inputProps'];
  };

export interface CheckboxGroupLevelConfig {
  /**
   * Whether the level control is active.
   */
  active: boolean;
  /**
   * Whether the level control checkbox is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The label displayed for the level control checkbox.
   * @default 'Select all'
   */
  label?: string;
  /**
   * The mode of level control checkbox.
   * @default 'main'
   */
  mode?: CheckboxMode;
  /**
   * Custom change handler for the level control.
   * If not provided, the default behavior (select/deselect all) will be used.
   */
  onChange?: (event: Event) => void;
}

/**
 * React splits this into two interfaces so `children` and `options` cannot be
 * given together; Vue's `defineProps` collapses a union discriminated with
 * `never` to `never`, so the two are flattened here — as TextField's props are
 * — and the combination is rejected at runtime, exactly as React does with its
 * own console error.
 */
export interface CheckboxGroupProps {
  /**
   * The default value of checkbox group.
   */
  defaultValue?: string[];
  /**
   * Whether the checkbox group is disabled.
   * Control the disabled of checkboxes in group if disabled not passed to checkbox.
   */
  disabled?: boolean;
  /**
   * The layout of checkbox group.
   * @default 'horizontal'
   */
  layout?: CheckboxGroupLayout;
  /**
   * The level control configuration.
   * When provided, a "select all" checkbox will be rendered above the group.
   */
  level?: CheckboxGroupLevelConfig;
  /**
   * The mode of checkboxes in the group.
   * Control the mode of checkboxes in group if mode not passed to checkbox.
   */
  mode?: CheckboxMode;
  /**
   * The name of checkbox group.
   * Control the name of checkboxes in group if name not passed to checkbox.
   */
  name?: string;
  /**
   * The options rendered as checkboxes. Mutually exclusive with the default slot.
   */
  options?: CheckboxGroupOptionInput[];
  /**
   * The value of checkbox group.
   */
  value?: string[];
}
