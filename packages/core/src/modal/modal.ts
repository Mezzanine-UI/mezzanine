import {
  CheckedOutlineIcon,
  ErrorOutlineIcon,
  InfoOutlineIcon,
  MailIcon,
  TrashIcon,
  WarningOutlineIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export type ModalStatusType = SeverityWithInfo | 'email' | 'delete';

export type ModalSize = 'tight' | 'narrow' | 'regular' | 'wide';

export type ModalType =
  | 'extended'
  | 'extendedSplit'
  | 'standard'
  | 'mediaPreview'
  | 'verification';

export const modalPrefix = 'mzn-modal';

export const modalStatusTypeIcons = {
  success: CheckedOutlineIcon,
  warning: WarningOutlineIcon,
  error: ErrorOutlineIcon,
  info: InfoOutlineIcon,
  email: MailIcon,
  delete: TrashIcon,
} as const;

export const modalClasses = {
  host: modalPrefix,
  overlay: `${modalPrefix}__overlay`,
  closeIcon: `${modalPrefix}__close-icon`,
  modalStatusType: (severity: ModalStatusType) => `${modalPrefix}--${severity}`,
  size: (size: ModalSize) => `${modalPrefix}--${size}`,
  fullScreen: `${modalPrefix}--full-screen`,
  withCloseIcon: `${modalPrefix}--close-icon`,

  /** Header */
  modalHeader: `${modalPrefix}__header`,
  modalHeaderStatusTypeIcon: `${modalPrefix}__header__status-type-icon`,
  modalHeaderTitleAndSupportingTextContainer: `${modalPrefix}__header__title-supporting-text-container`,
  modalHeaderTitle: `${modalPrefix}__header__title`,
  modalHeaderSupportingText: `${modalPrefix}__header__supporting-text`,

  /** Body */
  modalBodyContainer: `${modalPrefix}__body-container`,
  modalBodyContainerExtendedSplit: `${modalPrefix}__body-container__extended-split`,
  modalBodyContainerExtendedSplitRight: `${modalPrefix}__body-container__extended-split-right`,
  modalBodyContainerExtendedSplitLeft: `${modalPrefix}__body-container__extended-split-left`,
  modalBodyContainerExtendedSplitLeftSideContent: `${modalPrefix}__body-container__extended-split-left__content`,

  /** Footer */
  modalFooter: `${modalPrefix}__footer`,
  modalFooterPasswordContainer: `${modalPrefix}__footer__password-container`,
  modalFooterAuxiliaryContentContainer: `${modalPrefix}__footer__auxiliary-content-container`,
  modalFooterActionsButtonContainer: `${modalPrefix}__footer__actions-button-container`,
  modalFooterActionsButton: `${modalPrefix}__footer__actions-button`,

  /** Body Verification */
  modalBodyVerification: `${modalPrefix}__body-verification`,
  modalBodyVerificationInputs: `${modalPrefix}__body-verification__inputs`,
  modalBodyVerificationInput: `${modalPrefix}__body-verification__input`,
  modalBodyVerificationInputError: `${modalPrefix}__body-verification__input--error`,
  modalBodyVerificationResend: `${modalPrefix}__body-verification__resend`,
  modalBodyVerificationResendLink: `${modalPrefix}__body-verification__resend-link`,

  /** Media Preview */
  mediaPreview: `${modalPrefix}--media-preview`,
  mediaPreviewCloseButton: `${modalPrefix}__media-preview-close-button`,
  mediaPreviewContent: `${modalPrefix}__media-preview-content`,
  mediaPreviewMediaContainer: `${modalPrefix}__media-preview-media-container`,
  mediaPreviewImage: `${modalPrefix}__media-preview-image`,
  mediaPreviewNavButton: `${modalPrefix}__media-preview-nav-button`,
  mediaPreviewNavButtonPrev: `${modalPrefix}__media-preview-nav-button--prev`,
  mediaPreviewNavButtonNext: `${modalPrefix}__media-preview-nav-button--next`,
  mediaPreviewPaginationIndicator: `${modalPrefix}__media-preview-pagination-indicator`,
} as const;
