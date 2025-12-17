import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import { Severity, SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { formPrefix } from './form';
import { IconDefinition } from '@mezzanine-ui/icons';

export const formFieldPrefix = `${formPrefix}-field`;

export const formHintIcons: Record<SeverityWithInfo, IconDefinition> = {
  success: CheckedFilledIcon,
  warning: WarningFilledIcon,
  error: DangerousFilledIcon,
  info: InfoFilledIcon,
};

export const formFieldClasses = {
  host: formFieldPrefix,
  label: `${formFieldPrefix}__label`,
  asterisk: `${formFieldPrefix}__asterisk`,
  remark: `${formFieldPrefix}__remark`,
  hintText: `${formFieldPrefix}__hint-text`,
  hintTextIcon: `${formFieldPrefix}__hint-text__icon`,
  hintTextSeverity: (severity: SeverityWithInfo) =>
    `${formFieldPrefix}__hint-text--${severity}`,
  severityIcon: `${formFieldPrefix}__severity-icon`,
  disabled: `${formFieldPrefix}--disabled`,
  fullWidth: `${formFieldPrefix}--full-width`,
  severity: (severity: Severity) => `${formFieldPrefix}--${severity}`,
} as const;
