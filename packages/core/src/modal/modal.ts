import { Size } from '@mezzanine-ui/system/size';

export type ModalSize = Size | 'extraLarge';

export const modalPrefix = 'mzn-modal';

export const modalClasses = {
  host: modalPrefix,
  overlay: `${modalPrefix}__overlay`,
  closeIcon: `${modalPrefix}__close-icon`,
  size: (size: ModalSize) => `${modalPrefix}--${size === 'extraLarge' ? 'extra-large' : size}`,
  danger: `${modalPrefix}--danger`,
  withCloseIcon: `${modalPrefix}--close-icon`,

  /** Header */
  header: `${modalPrefix}__header`,
  titleIcon: `${modalPrefix}__title-icon`,
  title: `${modalPrefix}__title`,
  titleLarge: `${modalPrefix}__title--large`,

  /** Body */
  body: `${modalPrefix}__body`,

  /** Footer */
  footer: `${modalPrefix}__footer`,
  actions: `${modalPrefix}__actions`,
} as const;
