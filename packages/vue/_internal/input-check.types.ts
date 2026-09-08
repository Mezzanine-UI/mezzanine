import type { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';
import type { VNodeChild } from 'vue';

export interface InputCheckProps {
  /**
   * The control of input check.
   *
   * React takes a rendered node so the caller can build the control itself; a
   * VNode is the same thing here, as `SelectTrigger`'s `suffixActionIcon` is.
   */
  control?: VNodeChild;
  /**
   * Whether the input check is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the input check is error.
   * @default false
   */
  error?: boolean;
  /**
   * Whether the input check is focused.
   * @default false
   */
  focused?: boolean;
  /**
   * Support text of input check.
   */
  hint?: string;
  /**
   * Whether the input check use segment style.
   * @default false
   */
  segmentedStyle?: boolean;
  /**
   * The size of input check.
   * @default 'main'
   */
  size?: InputCheckSize;
}
