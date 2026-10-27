import type { ButtonHTMLAttributes } from 'vue';
import type {
  FilterAreaActionsAlign,
  FilterAreaRowAlign,
  FilterAreaSize,
} from '@mezzanine-ui/core/filter-area';
import type { ButtonProps } from '../button/button.types';

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
   * Whether the submit button shows the loading state.
   * Clicks on the submit button are ignored while loading.
   * Takes precedence over `submitButtonProps.loading`.
   */
  loading?: boolean;
  /**
   * Additional props for the reset button.
   * `size` and `type` are controlled by FilterArea; `disabled` is combined with `isDirty`.
   */
  resetButtonProps?: ButtonProps;
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
   * Additional props for the submit button.
   * `size` and `type` are controlled by FilterArea; `loading` is overridden by the `loading` prop when set.
   */
  submitButtonProps?: ButtonProps;
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
