import {
  CheckCircleFilledIcon,
  ExclamationCircleFilledIcon,
  InfoCircleFilledIcon,
  MinusCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { Size } from '@mezzanine-ui/system/size';

export type ModalSeverity = SeverityWithInfo;

export type ModalSize = Size | 'extraLarge';

export const modalPrefix = 'mzn-modal';

export const modalSeverityIcons = {
  success: CheckCircleFilledIcon,
  warning: ExclamationCircleFilledIcon,
  error: MinusCircleFilledIcon,
  info: InfoCircleFilledIcon,
} as const;

export const modalClasses = {
  host: modalPrefix,
  overlay: `${modalPrefix}__overlay`,
  closeIcon: `${modalPrefix}__close-icon`,
  severity: (severity: ModalSeverity) => `${modalPrefix}--${severity}`,
  size: (size: ModalSize) => `${modalPrefix}--${size === 'extraLarge' ? 'extra-large' : size}`,
  fullScreen: `${modalPrefix}--full-screen`,
  withCloseIcon: `${modalPrefix}--close-icon`,

  /** Header */
  header: `${modalPrefix}__header`,
  severityIcon: `${modalPrefix}__severity-icon`,
  title: `${modalPrefix}__title`,
  titleLarge: `${modalPrefix}__title--large`,

  /** Body */
  body: `${modalPrefix}__body`,

  /** Footer */
  footer: `${modalPrefix}__footer`,
  actions: `${modalPrefix}__actions`,
} as const;

