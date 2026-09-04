import type { InputStrength } from '@mezzanine-ui/core/input';
import type { FormHintTextProps } from '../form/form-hint-text.types';

export interface PasswordStrengthIndicatorProps {
  /**
   * The hint texts to show below the strength indicator bar.
   */
  hintTexts?: {
    hint: string;
    severity: FormHintTextProps['severity'];
  }[];
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
}
