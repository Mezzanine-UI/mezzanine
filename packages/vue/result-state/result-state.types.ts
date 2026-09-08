import type {
  ResultStateSize,
  ResultStateType,
} from '@mezzanine-ui/core/result-state';
import type { ActionButtonsItem } from '../_internal/action-buttons';

/**
 * Actions can be either single button or two buttons.
 *
 * React writes it as a union of two shapes so a primary button without a
 * secondary one cannot type-check. `defineProps` collapses such a union to
 * `never`, so it is one shape here with `primaryButton` optional; the runtime
 * behaviour is the same, since a primary-only object renders nothing for the
 * missing secondary either way.
 */
export interface ResultStateActions {
  primaryButton?: ActionButtonsItem;
  secondaryButton: ActionButtonsItem;
}

export interface ResultStateProps {
  /**
   * Action buttons configuration.
   * - Single button: Only `secondaryButton`
   * - Two buttons: Both `secondaryButton` and `primaryButton`
   */
  actions?: ResultStateActions;
  /**
   * Optional description text displayed below the title.
   * Provides additional context or details about the result state.
   */
  description?: string;
  /**
   * The size variant of the result state.
   * Controls typography, spacing, and overall dimensions.
   * @default 'main'
   */
  size?: ResultStateSize;
  /**
   * The title text for the result state.
   * This is the main heading that describes the state.
   */
  title: string;
  /**
   * The type of result state, which determines the icon and color theme.
   * @default 'information'
   */
  type?: ResultStateType;
}
