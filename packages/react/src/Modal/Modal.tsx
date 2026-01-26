import {
  modalClasses as classes,
  ModalSize,
  ModalStatusType,
} from '@mezzanine-ui/core/modal';
import { forwardRef, useMemo } from 'react';
import { cx } from '../utils/cx';
import { ModalControl, ModalControlContext } from './ModalControl';
import useModalContainer, { ModalContainerProps } from './useModalContainer';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import ModalHeader, { ModalHeaderProps } from './ModalHeader';
import ModalFooter, { ModalFooterProps } from './ModalFooter';
import ClearActions from '../ClearActions';

interface CommonModalProps
  extends Omit<ModalContainerProps, 'children'>,
    Pick<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'>,
    Partial<Omit<ModalHeaderProps, 'children' | 'className' | 'title'>>,
    Partial<Omit<ModalFooterProps, 'children' | 'className' | 'confirmText'>> {
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
   * Controls whether or not to show dismiss button at top-end.
   * @default false
   */
  showDismissButton?: boolean;
}

interface ExtendedSplitModalProps extends CommonModalProps {
  /**
   * Content for the left side in extendedSplit layout.
   * Required when modalType is 'extendedSplit'.
   */
  extendedSplitLeftSideContent: React.ReactNode;
  /**
   * Content for the right side in extendedSplit layout.
   * Required when modalType is 'extendedSplit'.
   */
  extendedSplitRightSideContent: React.ReactNode;
  /**
   * Controls the type/layout of the modal.
   * - 'extendedSplit': Modal with split layout (footer inside left content)
   */
  modalType: 'extendedSplit';
  /**
   * Controls the size of the modal.
   * For extendedSplit type, only 'wide' is allowed.
   * @default 'wide'
   */
  size?: 'wide';
}

interface OtherModalProps extends CommonModalProps {
  /**
   * Content for the left side in extendedSplit layout.
   * Cannot be provided when modalType is not 'extendedSplit'.
   */
  extendedSplitLeftSideContent?: never;
  /**
   * Content for the right side in extendedSplit layout.
   * Cannot be provided when modalType is not 'extendedSplit'.
   */
  extendedSplitRightSideContent?: never;
  /**
   * Controls the type/layout of the modal.
   * - 'standard': Default modal with body container
   * - 'extended': Modal with left and right content areas
   * - 'mediaPreview': Modal for media preview
   * - 'verification': Modal for verification flows
   * @default 'standard'
   */
  modalType: 'extended' | 'standard' | 'mediaPreview' | 'verification';
  /**
   * Controls the size of the modal.
   * @default 'regular'
   */
  size?: ModalSize;
}

type BaseModalProps = ExtendedSplitModalProps | OtherModalProps;

type ModalHeaderPropsWithHeader = {
  /**
   * Whether to show modal header.
   */
  showModalHeader: true;
  /**
   * The title of the modal header (required when showModalHeader is true).
   */
  title: string;
};

type ModalHeaderPropsWithoutHeader = {
  /**
   * Whether to show modal header.
   * @default false
   */
  showModalHeader?: false;
  /**
   * The title of the modal header.
   * Cannot be provided when showModalHeader is false.
   */
  title?: never;
};

type ModalFooterPropsWithFooter = {
  /**
   * Whether to show modal footer.
   */
  showModalFooter: true;
  /**
   * The confirm button text of the modal footer (required when showModalFooter is true).
   */
  confirmText: string;
};

type ModalFooterPropsWithoutFooter = {
  /**
   * Whether to show modal footer.
   * @default false
   */
  showModalFooter?: false;
  /**
   * The confirm button text of the modal footer.
   * Cannot be provided when showModalFooter is false.
   */
  confirmText?: never;
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
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  function Modal(props, ref) {
    const {
      actionsButtonLayout,
      annotation,
      auxiliaryContentButtonProps,
      auxiliaryContentButtonText,
      auxiliaryContentChecked,
      auxiliaryContentLabel,
      auxiliaryContentOnChange,
      auxiliaryContentOnClick,
      auxiliaryContentType,
      cancelButtonProps,
      cancelText,
      children,
      className,
      confirmButtonProps,
      confirmText,
      container,
      disableCloseOnBackdropClick = false,
      disableCloseOnEscapeKeyDown = false,
      disablePortal = false,
      extendedSplitLeftSideContent,
      extendedSplitRightSideContent,
      fullScreen = false,
      loading = false,
      modalStatusType = 'info',
      modalType = 'standard',
      onBackdropClick,
      onCancel,
      onClose,
      onConfirm,
      open,
      passwordButtonProps,
      passwordButtonText,
      passwordChecked,
      passwordCheckedLabel,
      passwordCheckedOnChange,
      passwordOnClick,
      showCancelButton,
      showDismissButton = false,
      showModalFooter = false,
      showModalHeader,
      showStatusTypeIcon,
      size = 'regular',
      statusTypeIconLayout,
      supportingText,
      supportingTextAlign,
      title,
      titleAlign,
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
        actionsButtonLayout={actionsButtonLayout}
        annotation={annotation}
        auxiliaryContentButtonProps={auxiliaryContentButtonProps}
        auxiliaryContentButtonText={auxiliaryContentButtonText}
        auxiliaryContentChecked={auxiliaryContentChecked}
        auxiliaryContentLabel={auxiliaryContentLabel}
        auxiliaryContentOnChange={auxiliaryContentOnChange}
        auxiliaryContentOnClick={auxiliaryContentOnClick}
        auxiliaryContentType={auxiliaryContentType}
        cancelButtonProps={cancelButtonProps}
        cancelText={cancelText}
        confirmButtonProps={confirmButtonProps}
        confirmText={confirmText as string}
        loading={loading}
        onCancel={onCancel}
        onConfirm={onConfirm}
        passwordButtonProps={passwordButtonProps}
        passwordButtonText={passwordButtonText}
        passwordChecked={passwordChecked}
        passwordCheckedLabel={passwordCheckedLabel}
        passwordCheckedOnChange={passwordCheckedOnChange}
        passwordOnClick={passwordOnClick}
        showCancelButton={showCancelButton}
      />
    );

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
                [classes.withCloseIcon]: showDismissButton,
              },
              className,
            )}
            role="dialog"
          >
            {showModalHeader && (
              <ModalHeader
                showStatusTypeIcon={showStatusTypeIcon}
                statusTypeIconLayout={statusTypeIconLayout}
                supportingText={supportingText}
                supportingTextAlign={supportingTextAlign}
                title={title as string}
                titleAlign={titleAlign}
              />
            )}
            {modalType === 'extendedSplit' && (
              <div className={classes.modalBodyContainerExtendedSplit}>
                <div className={classes.modalBodyContainerExtendedSplitRight}>
                  {extendedSplitRightSideContent}
                </div>
                <div className={classes.modalBodyContainerExtendedSplitLeft}>
                  <div
                    className={
                      classes.modalBodyContainerExtendedSplitLeftSideContent
                    }
                  >
                    {extendedSplitLeftSideContent}
                  </div>
                  {showModalFooter && renderModalFooter()}
                </div>
              </div>
            )}
            {(modalType === 'standard' ||
              modalType === 'verification' ||
              modalType === 'extended' ||
              modalType === 'mediaPreview') && (
              <>
                {children && (
                  <div className={classes.modalBodyContainer}>{children}</div>
                )}
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
