export interface FormElementFocusHandlers {
  /** 元素失去焦點時觸發。 */
  onBlur?: () => void;
  /** 元素取得焦點時觸發。 */
  onFocus?: () => void;
}
