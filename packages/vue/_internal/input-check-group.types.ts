import type {
  InputCheckGroupOrientation,
  InputCheckSize,
} from '@mezzanine-ui/core/_internal/input-check';

export interface InputCheckGroupProps {
  /**
   * The orientation of input check group.
   * @default 'horizontal'
   */
  orientation?: InputCheckGroupOrientation;
  /**
   * Whether the input check group use segment style.
   * @default false
   */
  segmentedStyle?: boolean;
  /**
   * The size of input check group.
   * @default 'main'
   */
  size?: InputCheckSize;
}
