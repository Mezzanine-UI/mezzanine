import type { OverflowTooltipProps } from './overflow-tooltip.types';

export interface OverflowCounterTagProps
  extends Pick<
    OverflowTooltipProps,
    'placement' | 'readOnly' | 'tags' | 'tagSize'
  > {
  /**
   * Whether the trigger tag is disabled.
   * @default false
   */
  disabled?: boolean;
}
