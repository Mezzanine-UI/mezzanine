import {
  CheckedOutlineIcon,
  ErrorOutlineIcon,
  InfoOutlineIcon,
  MailIcon,
  TrashIcon,
  WarningOutlineIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

/**
 * Modal 的狀態類型，用於顯示對應的狀態圖示。
 * - `'success'` — 成功狀態
 * - `'warning'` — 警告狀態
 * - `'error'` — 錯誤狀態
 * - `'info'` — 資訊狀態
 * - `'email'` — 電子郵件相關操作
 * - `'delete'` — 刪除操作
 */
export type ModalStatusType = SeverityWithInfo | 'email' | 'delete';

/**
 * Modal 的寬度尺寸。
 * - `'tight'` — 最窄尺寸
 * - `'narrow'` — 較窄尺寸
 * - `'regular'` — 標準尺寸
 * - `'wide'` — 寬尺寸
 */
export type ModalSize = 'tight' | 'narrow' | 'regular' | 'wide';

/**
 * Modal 的版面配置類型。
 * - `'extended'` — 延伸版面，內容區域較大
 * - `'extendedSplit'` — 延伸分割版面，左右兩欄配置
 * - `'standard'` — 標準版面
 * - `'mediaPreview'` — 媒體預覽版面
 * - `'verification'` — 驗證碼輸入版面
 */
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
  contentWrapper: `${modalPrefix}__content-wrapper`,
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
  modalBodyContainerWithTopSeparator: `${modalPrefix}__body-container--with-top-separator`,
  modalBodyContainerWithBottomSeparator: `${modalPrefix}__body-container--with-bottom-separator`,
  modalBodyContainerExtendedSplit: `${modalPrefix}__body-container__extended-split`,
  modalBodyContainerExtendedSplitSidebarLeft: `${modalPrefix}__body-container__extended-split--sidebar-left`,
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
  modalBodyVerificationInputsExtended: `${modalPrefix}__body-verification__inputs--extended`,
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
