import { modalClasses as classes, ModalSize, ModalStatusType, ModalType, } from '@mezzanine-ui/core/modal';
import { forwardRef, useMemo } from 'react';
import { cx } from '../utils/cx';
import { ModalControl, ModalControlContext } from './ModalControl';
import useModalContainer, { ModalContainerProps } from './useModalContainer';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import ModalHeader, { ModalHeaderProps } from './ModalHeader';
import ModalFooter, { ModalFooterProps } from './ModalFooter';
import ClearActions from '../ClearActions';

interface BaseModalProps
  extends Omit<ModalContainerProps, 'children'>,
    Pick<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'>,
    Partial<
      Omit<
        ModalHeaderProps,
        'children' | 'className' | 'modalHeaderClearAction' | 'modalHeaderTitle'
      >
    >,
    Partial<
      Omit<
        ModalFooterProps,
        'children' | 'className' | 'modalFooterConfirmText'
      >
    > {
  /**
   * Content for the left side in extendedSplit layout.
   * Only used when modalType is 'extendedSplit'.
   */
  extendedSplitLeftSideContent?: React.ReactNode;
  /**
   * Content for the right side in extendedSplit layout.
   * Only used when modalType is 'extendedSplit'.
   */
  extendedSplitRightSideContent?: React.ReactNode;
  /**
   * Whether to force full screen on any breakpoint.
   * @default false
   */
  fullScreen?: boolean;
  /**
   * Whether the modal is loading.
   * Controls the loading prop of confirm button in modal actions.
   */
  loading?: boolean;
  /**
   * Controls whether or not to display status icon before title.
   * Notice that giving a status will only display the regular title.
   * @default 'info'
   */
  modalStatusType?: ModalStatusType;
  /**
   * Controls the type/layout of the modal.
   * - 'standard': Default modal with body container
   * - 'extended': Modal with left and right content areas
   * - 'extendedSplit': Modal with split layout (footer inside left content)
   * - 'mediaPreview': Modal for media preview
   * - 'verification': Modal for verification flows
   * @default 'standard'
   */
  modalType: ModalType;
  /**
   * Controls whether or not to hide close button at top-end.
   * @default false
   */
  showDismissButton?: boolean;
  /**
   * Controls the size of the modal.
   * @default 'regular'
   */
  size?: ModalSize;
}

type ModalHeaderPropsWithHeader = {
  /**
   * Whether to show modal header.
   */
  showModalHeader: true;
  /**
   * The title of the modal header (required when showModalHeader is true).
   */
  modalHeaderTitle: string;
};

type ModalHeaderPropsWithoutHeader = {
  /**
   * Whether to show modal header.
   * @default false
   */
  showModalHeader?: false;
  /**
   * The title of the modal header.
   */
  modalHeaderTitle?: string;
};

type ModalFooterPropsWithFooter = {
  /**
   * Whether to show modal footer.
   */
  showModalFooter: true;
  /**
   * The confirm button text of the modal footer (required when showModalFooter is true).
   */
  modalFooterConfirmText: string;
};

type ModalFooterPropsWithoutFooter = {
  /**
   * Whether to show modal footer.
   * @default false
   */
  showModalFooter?: false;
  /**
   * The confirm button text of the modal footer.
   */
  modalFooterConfirmText?: string;
};

export type ModalProps = BaseModalProps &
  (
    | (ModalHeaderPropsWithHeader & ModalFooterPropsWithFooter)
    | (ModalHeaderPropsWithHeader & ModalFooterPropsWithoutFooter)
    | (ModalHeaderPropsWithoutHeader & ModalFooterPropsWithFooter)
    | (ModalHeaderPropsWithoutHeader & ModalFooterPropsWithoutFooter)
  );

/**
 * The react component for `mezzanine` modal.
 */
const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(props, ref) {
    const {
      children,
      className,
      container,
      disableCloseOnBackdropClick = false,
      disableCloseOnEscapeKeyDown = false,
      disablePortal = false,
      extendedSplitLeftSideContent,
      extendedSplitRightSideContent,
      fullScreen = false,
      loading = false,
      modalFooterActionsButtonLayout,
      modalFooterAnnotation,
      modalFooterAuxiliaryContentButtonProps,
      modalFooterAuxiliaryContentButtonText,
      modalFooterAuxiliaryContentChecked,
      modalFooterAuxiliaryContentLabel,
      modalFooterAuxiliaryContentOnChange,
      modalFooterAuxiliaryContentOnClick,
      modalFooterAuxiliaryContentType,
      modalFooterCancelButtonProps,
      modalFooterCancelText,
      modalFooterConfirmButtonProps,
      modalFooterConfirmText,
      modalFooterLoading,
      modalFooterOnCancel,
      modalFooterOnConfirm,
      modalFooterPasswordButtonProps,
      modalFooterPasswordButtonText,
      modalFooterPasswordChecked,
      modalFooterPasswordCheckedLabel,
      modalFooterPasswordCheckedOnChange,
      modalFooterPasswordOnClick,
      modalFooterShowCancelButton,
      modalHeaderShowModalStatusTypeIcon,
      modalHeaderStatusTypeIconLayout,
      modalHeaderSupportingText,
      modalHeaderSupportingTextAlign,
      modalHeaderTitle,
      modalHeaderTitleAlign,
      modalStatusType = 'info',
      modalType = 'standard',
      onBackdropClick,
      onClose,
      open,
      showDismissButton = false,
      showModalFooter = false,
      showModalHeader,
      size = 'regular',
      ...rest
    } = props;

    const modalControl: ModalControl = useMemo(
      () => ({
        loading,
        modalStatusType: modalStatusType,
      }),
      [loading, modalStatusType],
    );

    const { Container: ModalContainer } = useModalContainer();

    const renderModalFooter = () => (
      <ModalFooter
        modalFooterActionsButtonLayout={modalFooterActionsButtonLayout}
        modalFooterAnnotation={modalFooterAnnotation}
        modalFooterAuxiliaryContentButtonProps={modalFooterAuxiliaryContentButtonProps}
        modalFooterAuxiliaryContentButtonText={modalFooterAuxiliaryContentButtonText}
        modalFooterAuxiliaryContentChecked={modalFooterAuxiliaryContentChecked}
        modalFooterAuxiliaryContentLabel={modalFooterAuxiliaryContentLabel}
        modalFooterAuxiliaryContentOnChange={modalFooterAuxiliaryContentOnChange}
        modalFooterAuxiliaryContentOnClick={modalFooterAuxiliaryContentOnClick}
        modalFooterAuxiliaryContentType={modalFooterAuxiliaryContentType}
        modalFooterCancelButtonProps={modalFooterCancelButtonProps}
        modalFooterCancelText={modalFooterCancelText}
        modalFooterConfirmButtonProps={modalFooterConfirmButtonProps}
        modalFooterConfirmText={modalFooterConfirmText}
        modalFooterLoading={modalFooterLoading}
        modalFooterOnCancel={modalFooterOnCancel}
        modalFooterOnConfirm={modalFooterOnConfirm}
        modalFooterPasswordButtonProps={modalFooterPasswordButtonProps}
        modalFooterPasswordButtonText={modalFooterPasswordButtonText}
        modalFooterPasswordChecked={modalFooterPasswordChecked}
        modalFooterPasswordCheckedLabel={modalFooterPasswordCheckedLabel}
        modalFooterPasswordCheckedOnChange={modalFooterPasswordCheckedOnChange}
        modalFooterPasswordOnClick={modalFooterPasswordOnClick}
        modalFooterShowCancelButton={modalFooterShowCancelButton}
      />
    )

    return (
      <ModalControlContext.Provider value={modalControl}>
        <ModalContainer
          className={classes.overlay}
          container={container}
          disableCloseOnBackdropClick={disableCloseOnBackdropClick}
          disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
          disablePortal={disablePortal}
          onBackdropClick={onBackdropClick}
          onClose={onClose}
          open={open}
          ref={ref}
        >
          <div
            {...rest}
            className={cx(
              classes.host,
              classes.modalStatusType(modalStatusType),
              classes.size(size),
              {
                [classes.fullScreen]: fullScreen,
                [classes.withCloseIcon]: !showDismissButton,
              },
              className,
            )}
            role="dialog"
          >
            {showModalHeader && (
              <ModalHeader
                modalHeaderShowModalStatusTypeIcon={
                  modalHeaderShowModalStatusTypeIcon
                }
                modalHeaderStatusTypeIconLayout={
                  modalHeaderStatusTypeIconLayout
                }
                modalHeaderSupportingText={modalHeaderSupportingText}
                modalHeaderSupportingTextAlign={modalHeaderSupportingTextAlign}
                modalHeaderTitle={modalHeaderTitle}
                modalHeaderTitleAlign={modalHeaderTitleAlign}
              />
            )}
            {modalType === 'extendedSplit' && (
              <div className={classes.modalBodyContainerExtendedSplit}>
                <div className={classes.modalBodyContainerExtendedSplitRight}>
                  {extendedSplitRightSideContent}
                </div>
                <div className={classes.modalBodyContainerExtendedSplitLeft}>
                  <div className={classes.modalBodyContainerExtendedSplitLeftSideContent}>
                    {extendedSplitLeftSideContent}
                  </div>
                  {showModalFooter && renderModalFooter()}
                </div>
              </div>
            )}
            {modalType === 'standard' && (
              <>
                <div className={classes.modalBodyContainer}>
                  {children}
                </div>
                {showModalFooter && renderModalFooter()}
              </>
            )}
            {showDismissButton && (
              <ClearActions
                onClick={onClose}
                className={classes.closeIcon}
                variant="base"
              />
            )}
          </div>
        </ModalContainer>
      </ModalControlContext.Provider>
    );
  },
);

export default Modal;
