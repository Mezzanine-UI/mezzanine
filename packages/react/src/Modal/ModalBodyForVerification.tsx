'use client';

import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
} from 'react';
import { modalClasses } from '@mezzanine-ui/core/modal';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Typography from '../Typography';

export interface ModalBodyForVerificationProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onChange'> {
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
   * Called when verification code changes.
   */
  onChange?: (value: string) => void;
  /**
   * Called when all digits are filled.
   */
  onComplete?: (value: string) => void;
  /**
   * Called when resend link is clicked.
   */
  onResend?: () => void;
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
   * Current verification code value.
   */
  value?: string;
}

/**
 * The react component for verification code input in modal.
 */
const ModalBodyForVerification = forwardRef<
  HTMLDivElement,
  ModalBodyForVerificationProps
>(function ModalBodyForVerification(props, ref) {
  const {
    autoFocus = true,
    className,
    disabled = false,
    error = false,
    length = 4,
    onChange,
    onComplete,
    onResend,
    readOnly = false,
    resendPrompt = '收不到驗證碼？',
    resendText = '點此重新寄送',
    value = '',
    ...rest
  } = props;

  const [codes, setCodes] = useState<string[]>(
    value
      .split('')
      .slice(0, length)
      .concat(Array(length - value.length).fill('')),
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus first input when mounted
  useEffect(() => {
    if (autoFocus && !disabled && !readOnly) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus, disabled, readOnly]);

  const handleChange = (index: number, newValue: string) => {
    if (disabled || readOnly) return;

    // Only allow single digit/letter
    const sanitized = newValue.slice(-1);

    const newCodes = [...codes];
    newCodes[index] = sanitized;
    setCodes(newCodes);

    const fullValue = newCodes.join('');
    onChange?.(fullValue);

    // Auto focus next input
    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all filled
    if (fullValue.length === length) {
      onComplete?.(fullValue);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (disabled || readOnly) return;

      if (!codes[index] && index > 0) {
        // If current is empty, focus previous
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newCodes = [...codes];
        newCodes[index] = '';
        setCodes(newCodes);
        onChange?.(newCodes.join(''));
      }
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const newCodes = pastedData
      .split('')
      .concat(Array(length - pastedData.length).fill(''));

    setCodes(newCodes);
    onChange?.(pastedData);

    // Focus the next empty input or the last input
    const nextEmptyIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextEmptyIndex]?.focus();

    if (pastedData.length === length) {
      onComplete?.(pastedData);
    }
  };

  const handleInputChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    handleChange(index, e.target.value);
  };

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(modalClasses.modalBodyVerification, className)}
    >
      <div className={modalClasses.modalBodyVerificationInputs}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={codes[index] || ''}
            onChange={(e) => handleInputChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cx(modalClasses.modalBodyVerificationInput, {
              [modalClasses.modalBodyVerificationInputError]: error,
            })}
            autoComplete="off"
            disabled={disabled}
            readOnly={readOnly}
          />
        ))}
      </div>
      {onResend && (
        <div className={modalClasses.modalBodyVerificationResend}>
          <Typography variant="caption" color="text-neutral">
            {resendPrompt}
          </Typography>
          <Typography
            variant="caption"
            color="text-neutral"
            className={modalClasses.modalBodyVerificationResendLink}
            onClick={onResend}
            component="span"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {resendText}
          </Typography>
        </div>
      )}
    </div>
  );
});

export default ModalBodyForVerification;
