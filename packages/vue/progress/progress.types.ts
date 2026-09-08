import type { ProgressStatus, ProgressType } from '@mezzanine-ui/core/progress';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { TypographyProps } from '../typography/typography.types';

export interface ProgressProps {
  /**
   * Custom icons for different statuses.
   * If not provided, defaults to CheckedFilledIcon for success and DangerousFilledIcon for error.
   */
  icons?: {
    /**
     * Custom icon when status is 'error'.
     * If not provided, defaults to DangerousFilledIcon.
     */
    error?: IconDefinition;
    /**
     * Custom icon when status is 'success'.
     * If not provided, defaults to CheckedFilledIcon.
     */
    success?: IconDefinition;
  };
  /**
   * The progress percent(0~100).
   * @default 0
   */
  percent?: number;
  /**
   * Percent text props when status is 'enabled'.
   */
  percentProps?: Omit<TypographyProps, 'children'>;
  /**
   * Force mark the progress status. automatically set if not defined.
   * (enabled(0~99) or success(100) depending on percent)
   */
  status?: ProgressStatus;
  /**
   * The tick of progress.
   * @default 0
   */
  tick?: number;
  /**
   * The type of progress display.
   * @default 'progress'
   */
  type?: ProgressType;
}
