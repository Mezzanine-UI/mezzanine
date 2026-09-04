import type { ActionButtonData } from '../_internal/action-buttons';

export interface CalendarFooterActionsProps {
  /**
   * Footer action buttons props.
   */
  actions: {
    /** The confirming button, rendered as `base-primary`. */
    primaryButtonProps: ActionButtonData;
    /** The dismissing button, rendered as `base-tertiary`. */
    secondaryButtonProps: ActionButtonData;
  };
}
