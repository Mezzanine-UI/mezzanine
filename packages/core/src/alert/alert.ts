import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  MinusCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { Severity } from '@mezzanine-ui/system/severity';

export type AlertSeverity = Severity;

export const alertPrefix = 'mzn-alert';
export const alertIcons = {
  success: CheckCircleFilledIcon,
  warning: ExclamationCircleFilledIcon,
  error: MinusCircleFilledIcon,
} as const;

export const alertClasses = {
  host: alertPrefix,
  icon: `${alertPrefix}__icon`,
  closeIcon: `${alertPrefix}__close-icon`,
  message: `${alertPrefix}__message`,
  severity: (severity: AlertSeverity) => `${alertPrefix}--${severity}`,
} as const;
