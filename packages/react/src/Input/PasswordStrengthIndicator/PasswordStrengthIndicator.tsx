'use client';

import {
  inputPasswordStrengthIndicatorClasses as classes,
  InputStrength,
} from '@mezzanine-ui/core/input';
import { forwardRef } from 'react';
import FormHintText from '../../Form/FormHintText';
import type { FormHintTextProps } from '../../Form/FormHintText';
import { cx } from '../../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';

export interface PasswordStrengthIndicatorProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The strength of password.
   * @default 'weak'
   */
  strength?: InputStrength;
  /**
   * The text to show beside the strength indicator bar.
   */
  strengthText?: string;
  /**
   * The prefix text for strength text.
   * @default '密碼強度：'
   */
  strengthTextPrefix?: string;
  /**
   * The hint texts to show below the strength indicator bar.
   */
  hintTexts?: {
    severity: FormHintTextProps['severity'];
    hint: string;
  }[];
}

/**
 * The react component for `mezzanine` password strength indicator.
 */
const PasswordStrengthIndicator = forwardRef<
  HTMLDivElement,
  PasswordStrengthIndicatorProps
>(function PasswordStrengthIndicator(props, ref) {
  const {
    className,
    strength = 'weak',
    strengthText: strengthTextProp,
    strengthTextPrefix = '密碼強度：',
    hintTexts,
    ...rest
  } = props;

  const strengthText =
    strengthTextProp ||
    (strength === 'weak' ? '低' : strength === 'medium' ? '中' : '高');

  return (
    <div ref={ref} className={cx(classes.host, className)} {...rest}>
      <div className={cx(classes.bar, classes.barState(strength))} />
      <span className={classes.text}>
        {strengthTextPrefix}
        <mark>{strengthText}</mark>
      </span>
      {hintTexts && hintTexts.length > 0 && (
        <div className={classes.hintTextGroup}>
          {hintTexts.map((hintText, idx) => (
            <FormHintText
              key={idx}
              hintText={hintText.hint}
              severity={hintText.severity}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default PasswordStrengthIndicator;
