import type { ButtonHTMLAttributes } from 'vue';
import type {
  FilterAreaActionsAlign,
  FilterAreaRowAlign,
  FilterAreaSize,
} from '@mezzanine-ui/core/filter-area';

export interface FilterAreaProps {
  /**
   * The alignment of the actions.
   * @default 'end'
   */
  actionsAlign?: FilterAreaActionsAlign;
  /**
   * Whether the form has been modified from its initial state.
   * When false, the reset button will be disabled.
   * @default true
   */
  isDirty?: boolean;
  /**
   * The type of the reset button.
   * @default 'button'
   */
  resetButtonType?: ButtonHTMLAttributes['type'];
  /**
   * The text of the reset button.
   * @default 'Reset'
   */
  resetText?: string;
  /**
   * The vertical alignment of the row (cross-axis align-items).
   * @default 'center'
   */
  rowAlign?: FilterAreaRowAlign;
  /**
   * The size of the filter area.
   * @default 'main'
   */
  size?: FilterAreaSize;
  /**
   * The type of the submit button.
   * @default 'button'
   */
  submitButtonType?: ButtonHTMLAttributes['type'];
  /**
   * The text of the submit button.
   * @default 'Search'
   */
  submitText?: string;
}
