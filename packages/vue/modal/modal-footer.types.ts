import type { VNodeChild } from 'vue';
import type { ButtonProps } from '../button/button.types';

/**
 * React 以 `showCancelButton` 的字面值判別的兩個成員（有取消鈕時 `cancelText`
 * 必填、沒有時禁止給）攤平成單一 interface。Vue 的 `defineProps` 解析這種
 * union 會得到無法使用的結果，因此兩者都列成選用的 prop；prop 名稱、型別與
 * 執行期行為不變，失去的只是編譯期保證。
 *
 * `annotation` 這類 React 的 `ReactNode` 在這裡是 `VNodeChild`：它們是資料而不是
 * 版位，抽取器也把它們算成 input，所以維持 prop 而不是 slot。
 */
export interface ModalFooterProps {
  /**
   * Layout of action buttons.
   * - 'fixed': Buttons maintain fixed width
   * - 'fill': Buttons expand to fill available space equally
   * @default 'fixed'
   */
  actionsButtonLayout?: 'fill' | 'fixed';
  /**
   * Text to display as annotation on the left side.
   * Only used when auxiliaryContentType is 'annotation'.
   */
  annotation?: VNodeChild;
  /**
   * Props for the auxiliary content button.
   * Only used when auxiliaryContentType is 'button'.
   */
  auxiliaryContentButtonProps?: ButtonProps;
  /**
   * Text for the auxiliary content button.
   * Only used when auxiliaryContentType is 'button'.
   */
  auxiliaryContentButtonText?: VNodeChild;
  /**
   * Whether the auxiliary content control (checkbox/toggle) is checked.
   * Only used when auxiliaryContentType is 'checkbox' or 'toggle'.
   */
  auxiliaryContentChecked?: boolean;
  /**
   * Label text for the auxiliary content control (checkbox/toggle).
   * Only used when auxiliaryContentType is 'checkbox' or 'toggle'.
   */
  auxiliaryContentLabel?: string;
  /**
   * Change handler for auxiliary content control (checkbox/toggle).
   * Only used when auxiliaryContentType is 'checkbox' or 'toggle'.
   */
  auxiliaryContentOnChange?: (checked: boolean) => void;
  /**
   * Click handler for the auxiliary content button.
   * Only used when auxiliaryContentType is 'button'.
   */
  auxiliaryContentOnClick?: (event: MouseEvent) => void;
  /**
   * Type of auxiliary content to show on the left side of the footer.
   * - 'annotation': Display text annotation
   * - 'button': Display a button
   * - 'checkbox': Display a checkbox control
   * - 'toggle': Display a toggle control
   * - 'password': Display password-specific controls (remember me + forgot password)
   * @default undefined (no auxiliary content)
   */
  auxiliaryContentType?:
    | 'annotation'
    | 'button'
    | 'checkbox'
    | 'password'
    | 'toggle';
  /**
   * Additional props for the cancel button.
   */
  cancelButtonProps?: ButtonProps;
  /**
   * Text content of the cancel button.
   * Required when the cancel button is shown.
   */
  cancelText?: VNodeChild;
  /**
   * Additional props for the confirm button.
   */
  confirmButtonProps?: ButtonProps;
  /**
   * Text content of the confirm button.
   */
  confirmText?: VNodeChild;
  /**
   * Whether confirm button is loading and cancel button is disabled.
   */
  loading?: boolean;
  /**
   * Props for the password auxiliary button.
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordButtonProps?: ButtonProps;
  /**
   * Text for the password auxiliary button (e.g., "Forgot password?").
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordButtonText?: VNodeChild;
  /**
   * Whether the password checkbox is checked (e.g., "Remember me").
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordChecked?: boolean;
  /**
   * Label for the password checkbox (e.g., "Remember me").
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordCheckedLabel?: string;
  /**
   * Change handler for the password checkbox.
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordCheckedOnChange?: (checked: boolean) => void;
  /**
   * Click handler for the password auxiliary button.
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordOnClick?: (event: MouseEvent) => void;
  /**
   * Whether to show the cancel button.
   * @default true
   */
  showCancelButton?: boolean;
}
