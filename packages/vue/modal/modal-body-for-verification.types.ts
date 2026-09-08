export interface ModalBodyForVerificationProps {
  /**
   * Whether to auto focus the first input when mounted.
   * @default true
   */
  autoFocus?: boolean;
  /**
   * Whether the inputs are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the inputs are in error state.
   * @default false
   */
  error?: boolean;
  /**
   * Number of verification code digits.
   * @default 4
   */
  length?: number;
  /**
   * Whether the inputs are readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Prompt text before resend link.
   * @default "收不到驗證碼？"
   */
  resendPrompt?: string;
  /**
   * Resend link text.
   * @default "點此重新寄送"
   */
  resendText?: string;
  /**
   * Current verification code value. Read once, when the inputs are created.
   */
  value?: string;
}
