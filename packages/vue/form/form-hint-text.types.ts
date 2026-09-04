import type { formHintIcons } from '@mezzanine-ui/core/form';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface FormHintTextProps {
  /**
   * The hint text to display below the input field.
   * Provides additional information or guidance to the user.
   */
  hintText?: string;
  /**
   * The icon to display alongside the hint text.
   * If provided, this icon will override the default severity icon.
   */
  hintTextIcon?: IconDefinition;
  /**
   * The severity of form message.
   * if not provided, no icon will be displayed.
   */
  severity?: keyof typeof formHintIcons | undefined;
  /**
   * Whether to display the hint text icon.
   * When false, neither the custom icon nor the default severity icon will be shown.
   * @default true
   */
  showHintTextIcon?: boolean;
}
