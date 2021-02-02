import { alertPrefix } from './constants';
import { AlertStatus } from './typings';

export const alertClasses = {
  host: alertPrefix,
  icon: `${alertPrefix}__icon`,
  closeIcon: `${alertPrefix}__close-icon`,
  message: `${alertPrefix}__message`,
  status: (status: AlertStatus) => `${alertPrefix}--${status}`,
} as const;
