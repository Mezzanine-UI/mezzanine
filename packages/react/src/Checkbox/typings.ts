import { CheckboxMode } from '@mezzanine-ui/core/checkbox';
import { JSXElementConstructor } from 'react';

export type CheckboxComponent = 'label' | JSXElementConstructor<any>;

export interface CheckboxPropsBase {
  /**
   * Whether the checkbox is checked.
   */
  checked?: boolean;
  /**
   * Whether the checkbox is checked by default.
   * Only used for uncontrolled.
   */
  defaultChecked?: boolean;
  /**
   * The description text displayed below the label.
   */
  description?: string;
  /**
   * Whether the checkbox is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the checkbox is in indeterminate state.
   * @default false
   */
  indeterminate?: boolean;
  /**
   * The label text displayed beside the checkbox.
   */
  label?: string;
  /**
   * The mode of checkbox.
   * @default 'main'
   */
  mode?: CheckboxMode;
}
