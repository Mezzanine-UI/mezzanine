import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  MinusCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { Severity } from '@mezzanine-ui/system/severity';
import { formPrefix } from './form';

export const formFieldPrefix = `${formPrefix}-field`;

export const formMessageIcons = {
  success: CheckCircleFilledIcon,
  warning: ExclamationCircleFilledIcon,
  error: MinusCircleFilledIcon,
} as const;

export const formFieldClasses = {
  host: formFieldPrefix,
  label: `${formFieldPrefix}__label`,
  asterisk: `${formFieldPrefix}__asterisk`,
  remark: `${formFieldPrefix}__remark`,
  message: `${formFieldPrefix}__message`,
  severityIcon: `${formFieldPrefix}__severity-icon`,
  disabled: `${formFieldPrefix}--disabled`,
  fullWidth: `${formFieldPrefix}--full-width`,
  severity: (severity:Severity) => `${formFieldPrefix}--${severity}`,
} as const;
