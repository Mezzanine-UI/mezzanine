import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  MinusCircleFilledIcon,
} from '@mezzanine-ui/icons';

export type AlertStatus = 'success' | 'warning' | 'error';

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
  status: (status: AlertStatus) => `${alertPrefix}--${status}`,
} as const;
