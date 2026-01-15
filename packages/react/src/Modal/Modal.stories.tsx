import { StoryObj, Meta } from '@storybook/react-webpack5';
import { ReactNode, useCallback, useState } from 'react';
import Modal, {
  ModalStatusType,
  ModalSize,
  ModalBodyForVerification,
} from '.';
import Button from '../Button';
import { ModalType } from '@mezzanine-ui/core/modal';
import Typography from '../Typography';

export default {
  component: Modal,
  title: 'V1/Modal',
} as Meta<typeof Modal>;

const severities: ModalStatusType[] = ['info', 'error', 'warning', 'success'];

const sizes: ModalSize[] = ['tight', 'narrow', 'regular', 'wide'];

type PlaygroundArgs = {
  modalType: ModalType
  body: ReactNode;
  disableCloseOnBackdropClick?: boolean;
  disableCloseOnEscapeKeyDown?: boolean;
  fullScreen?: boolean;
  loading?: boolean;
  modalFooterActionsButtonLayout?: 'fill' | 'fixed';
  modalFooterAnnotation?: string;
  modalFooterAuxiliaryContentButtonText?: string;
  modalFooterAuxiliaryContentChecked?: boolean;
  modalFooterAuxiliaryContentLabel?: string;
  modalFooterAuxiliaryContentType?: 'checkbox' | 'toggle' | 'annotation' | 'button' | 'password';
  modalFooterCancelText?: string;
  modalFooterConfirmText?: string;
  modalFooterLoading?: boolean;
  modalFooterPasswordButtonText?: string;
  modalFooterPasswordChecked?: boolean;
  modalFooterPasswordCheckedLabel?: string;
  modalFooterShowCancelButton?: boolean;
  modalHeaderShowModalStatusTypeIcon: boolean;
  modalHeaderStatusTypeIconLayout?: 'vertical' | 'horizontal';
  modalHeaderSupportingText?: string;
  modalHeaderSupportingTextAlign?: 'left' | 'center';
  modalHeaderTitle: ReactNode;
  modalHeaderTitleAlign?: 'left' | 'center';
  modalStatusType?: ModalStatusType;
  showDismissButton?: boolean;
  showModalFooter?: boolean;
  showModalHeader?: boolean;
  size?: ModalSize;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    modalType: 'standard',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum illum neque soluta atque. Eum dolores placeat unde, molestias exercitationem tempore perspiciatis quia porro sapiente vero impedit consequatur recusandae excepturi cumque.',
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    fullScreen: false,
    loading: false,
    modalFooterActionsButtonLayout: 'fixed',
    modalFooterAnnotation: 'Annotation text',
    modalFooterAuxiliaryContentButtonText: 'Reset',
    modalFooterAuxiliaryContentChecked: false,
    modalFooterAuxiliaryContentLabel: 'Control label',
    modalFooterAuxiliaryContentType: undefined,
    modalFooterCancelText: 'Cancel',
    modalFooterConfirmText: 'Confirm',
    modalFooterLoading: false,
    modalFooterPasswordButtonText: 'Forgot password?',
    modalFooterPasswordChecked: false,
    modalFooterPasswordCheckedLabel: 'Remember me',
    modalFooterShowCancelButton: true,
    modalHeaderShowModalStatusTypeIcon: false,
    modalHeaderStatusTypeIconLayout: 'vertical',
    modalHeaderSupportingText: 'This is a supporting text',
    modalHeaderSupportingTextAlign: 'left',
    modalHeaderTitle: 'Title',
    modalHeaderTitleAlign: 'left',
    modalStatusType: 'info',
    showDismissButton: false,
    showModalFooter: true,
    showModalHeader: true,
    size: 'regular',
  },
  argTypes: {
    modalFooterActionsButtonLayout: {
      control: {
        type: 'select',
      },
      options: ['fixed', 'fill'],
    },
    modalFooterAuxiliaryContentType: {
      control: {
        type: 'select',
      },
      options: [undefined, 'annotation', 'button', 'checkbox', 'toggle', 'password'],
    },
    modalHeaderStatusTypeIconLayout: {
      control: {
        type: 'select',
      },
      options: ['vertical', 'horizontal'],
    },
    modalHeaderSupportingTextAlign: {
      control: {
        type: 'select',
      },
      options: ['left', 'center'],
    },
    modalHeaderTitleAlign: {
      control: {
        type: 'select',
      },
      options: ['left', 'center'],
    },
    modalStatusType: {
      control: {
        type: 'select',
      },
      options: severities,
    },
    modalType: {
      control: {
        type: 'select',
      },
      options: ['standard', 'extended', 'extendedSplit', 'mediaPreview', 'verification'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: sizes,
    },
  },
  render: function Render(args) {
    const {
      body,
      disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown,
      fullScreen,
      loading,
      modalFooterActionsButtonLayout,
      modalFooterAnnotation,
      modalFooterAuxiliaryContentButtonText,
      modalFooterAuxiliaryContentChecked,
      modalFooterAuxiliaryContentLabel,
      modalFooterAuxiliaryContentType,
      modalFooterCancelText,
      modalFooterConfirmText,
      modalFooterLoading,
      modalFooterPasswordButtonText,
      modalFooterPasswordChecked,
      modalFooterPasswordCheckedLabel,
      modalFooterShowCancelButton,
      modalHeaderShowModalStatusTypeIcon,
      modalHeaderStatusTypeIconLayout,
      modalHeaderSupportingText,
      modalHeaderSupportingTextAlign,
      modalHeaderTitle,
      modalHeaderTitleAlign,
      modalStatusType,
      modalType,
      showDismissButton,
      showModalFooter,
      showModalHeader,
      size,
    } = args;

    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);

    const baseProps = {
      disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown,
      fullScreen,
      loading,
      modalFooterActionsButtonLayout,
      modalFooterAnnotation,
      modalFooterAuxiliaryContentButtonText,
      modalFooterAuxiliaryContentChecked,
      modalFooterAuxiliaryContentLabel,
      modalFooterAuxiliaryContentOnChange: () => {},
      modalFooterAuxiliaryContentOnClick: () => {},
      modalFooterAuxiliaryContentType,
      modalFooterCancelText,
      modalFooterLoading,
      modalFooterOnCancel: onClose,
      modalFooterOnConfirm: onClose,
      modalFooterPasswordButtonText,
      modalFooterPasswordChecked,
      modalFooterPasswordCheckedLabel,
      modalFooterPasswordCheckedOnChange: () => {},
      modalFooterPasswordOnClick: () => {},
      modalFooterShowCancelButton,
      modalStatusType,
      onClose,
      open,
      showDismissButton,
      size,
    };

    // Extended split specific props
    const extendedSplitProps = modalType === 'extendedSplit' ? {
      extendedSplitLeftSideContent: (
        <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>Left Side Content</span>
        </div>
      ),
      extendedSplitRightSideContent: (
        <div style={{ minHeight: '200px', width: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>Right Side Content</span>
        </div>
      ),
    } : {};

    // Type-safe props construction based on showModalHeader and showModalFooter
    if (showModalHeader && showModalFooter) {
      return (
        <>
          <Button onClick={() => setOpen(true)} variant="base-primary">
            open
          </Button>
          <Modal
            {...baseProps}
            {...extendedSplitProps}
            modalType={modalType}
            modalFooterConfirmText={modalFooterConfirmText || 'Confirm'}
            modalHeaderShowModalStatusTypeIcon={modalHeaderShowModalStatusTypeIcon}
            modalHeaderStatusTypeIconLayout={modalHeaderStatusTypeIconLayout}
            modalHeaderSupportingText={modalHeaderSupportingText}
            modalHeaderSupportingTextAlign={modalHeaderSupportingTextAlign}
            modalHeaderTitle={typeof modalHeaderTitle === 'string' ? modalHeaderTitle : 'Title'}
            modalHeaderTitleAlign={modalHeaderTitleAlign}
            showModalFooter
            showModalHeader
          >
            {modalType !== 'extendedSplit' && body}
          </Modal>
        </>
      );
    }

    if (showModalHeader) {
      return (
        <>
          <Button onClick={() => setOpen(true)} variant="base-primary">
            open
          </Button>
          <Modal
            {...baseProps}
            {...extendedSplitProps}
            modalType={modalType}
            modalHeaderShowModalStatusTypeIcon={modalHeaderShowModalStatusTypeIcon}
            modalHeaderStatusTypeIconLayout={modalHeaderStatusTypeIconLayout}
            modalHeaderSupportingText={modalHeaderSupportingText}
            modalHeaderSupportingTextAlign={modalHeaderSupportingTextAlign}
            modalHeaderTitle={typeof modalHeaderTitle === 'string' ? modalHeaderTitle : 'Title'}
            modalHeaderTitleAlign={modalHeaderTitleAlign}
            showModalHeader
          >
            {modalType !== 'extendedSplit' && body}
          </Modal>
        </>
      );
    }

    if (showModalFooter) {
      return (
        <>
          <Button onClick={() => setOpen(true)} variant="base-primary">
            open
          </Button>
          <Modal
            {...baseProps}
            {...extendedSplitProps}
            modalType={modalType}
            modalFooterConfirmText={modalFooterConfirmText || 'Confirm'}
            showModalFooter
          >
            {modalType !== 'extendedSplit' && body}
          </Modal>
        </>
      );
    }

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          open
        </Button>
        <Modal {...baseProps} {...extendedSplitProps} modalType={modalType}>
          {modalType !== 'extendedSplit' && body}
        </Modal>
      </>
    );
  },
};

export const ModalHeaderStatusTypes: StoryObj = {
  render: function Render() {
    const [openInfo, setOpenInfo] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openWarning, setOpenWarning] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openEmail, setOpenEmail] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    return (
      <>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button onClick={() => setOpenInfo(true)} variant="base-primary">
            Info
          </Button>
          <Button onClick={() => setOpenError(true)} variant="base-primary">
            Error
          </Button>
          <Button onClick={() => setOpenWarning(true)} variant="base-primary">
            Warning
          </Button>
          <Button onClick={() => setOpenSuccess(true)} variant="base-primary">
            Success
          </Button>
          <Button onClick={() => setOpenEmail(true)} variant="base-primary">
            Email
          </Button>
          <Button onClick={() => setOpenDelete(true)} variant="base-primary">
            Delete
          </Button>
        </div>
        <Modal
          modalType="standard"
          modalFooterCancelText="Close"
          modalFooterConfirmText="OK"
          modalFooterOnCancel={() => setOpenInfo(false)}
          modalFooterOnConfirm={() => setOpenInfo(false)}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderSupportingText="This is an informational message"
          modalHeaderTitle="Information"
          modalStatusType="info"
          onClose={() => setOpenInfo(false)}
          open={openInfo}
          showModalFooter
          showModalHeader
        >
          <>Here are some details you should know about.</>
        </Modal>
        <Modal
          modalType="standard"
          modalFooterCancelText="Close"
          modalFooterConfirmText="OK"
          modalFooterOnCancel={() => setOpenError(false)}
          modalFooterOnConfirm={() => setOpenError(false)}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderSupportingText="An error has occurred during the operation"
          modalHeaderTitle="Error"
          modalStatusType="error"
          onClose={() => setOpenError(false)}
          open={openError}
          showModalFooter
          showModalHeader
        >
          <>Please try again or contact support if the problem persists.</>
        </Modal>
        <Modal
          modalType="standard"
          modalFooterCancelText="Close"
          modalFooterConfirmText="OK"
          modalFooterOnCancel={() => setOpenWarning(false)}
          modalFooterOnConfirm={() => setOpenWarning(false)}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderSupportingText="Please proceed with caution"
          modalHeaderTitle="Warning"
          modalStatusType="warning"
          onClose={() => setOpenWarning(false)}
          open={openWarning}
          showModalFooter
          showModalHeader
        >
          <>This action may have unintended consequences.</>
        </Modal>
        <Modal
          modalType="standard"
          modalFooterCancelText="Close"
          modalFooterConfirmText="OK"
          modalFooterOnCancel={() => setOpenSuccess(false)}
          modalFooterOnConfirm={() => setOpenSuccess(false)}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderSupportingText="Operation completed successfully"
          modalHeaderTitle="Success"
          modalStatusType="success"
          onClose={() => setOpenSuccess(false)}
          open={openSuccess}
          showModalFooter
          showModalHeader
        >
          <>Your changes have been saved and applied.</>
        </Modal>
        <Modal
          modalType="standard"
          modalFooterCancelText="Close"
          modalFooterConfirmText="OK"
          modalFooterOnCancel={() => setOpenEmail(false)}
          modalFooterOnConfirm={() => setOpenEmail(false)}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderSupportingText="You have new messages in your inbox"
          modalHeaderTitle="Email Notification"
          modalStatusType="email"
          onClose={() => setOpenEmail(false)}
          open={openEmail}
          showModalFooter
          showModalHeader
        >
          <>Check your inbox for important updates and notifications.</>
        </Modal>
        <Modal
          modalType="standard"
          modalFooterCancelText="Cancel"
          modalFooterConfirmText="Delete"
          modalFooterConfirmButtonProps={{ variant: 'destructive-primary' }}
          modalFooterOnCancel={() => setOpenDelete(false)}
          modalFooterOnConfirm={() => setOpenDelete(false)}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderSupportingText="This action cannot be undone"
          modalHeaderTitle="Delete Confirmation"
          modalStatusType="delete"
          onClose={() => setOpenDelete(false)}
          open={openDelete}
          showModalFooter
          showModalHeader
        >
          <>Are you sure you want to delete this item permanently?</>
        </Modal>
      </>
    );
  },
};

export const ModalHeaderComprehensive: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Comprehensive Header
        </Button>
        <Modal
          modalType="standard"
          modalFooterCancelText="Cancel"
          modalFooterConfirmText="Acknowledge"
          modalFooterOnCancel={onClose}
          modalFooterOnConfirm={onClose}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderStatusTypeIconLayout="horizontal"
          modalHeaderSupportingText="This modal demonstrates all header features combined together"
          modalHeaderSupportingTextAlign="center"
          modalHeaderTitle="Complete Header Example"
          modalHeaderTitleAlign="center"
          modalStatusType="warning"
          onClose={onClose}
          open={open}
          showModalFooter
          showModalHeader
        >
          <>
            This modal showcases all header features: status icon, horizontal layout,
            centered title and supporting text.
          </>
        </Modal>
      </>
    );
  },
};

export const ModalFooterBasic: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Modal with Footer
        </Button>
        <Modal
          modalType="standard"
          modalFooterCancelText="Cancel"
          modalFooterConfirmText="Confirm"
          modalFooterOnCancel={onClose}
          modalFooterOnConfirm={onClose}
          onClose={onClose}
          open={open}
          showModalFooter
          showModalHeader
          modalHeaderTitle="Modal with Footer"
        >
          <>
            This modal uses the new ModalFooter component with cancel and confirm buttons.
          </>
        </Modal>
      </>
    );
  },
};

export const ModalFooterButtonLayout: StoryObj = {
  render: function Render() {
    const [openFixed, setOpenFixed] = useState(false);
    const [openFill, setOpenFill] = useState(false);
    const onCloseFixed = useCallback(() => setOpenFixed(false), []);
    const onCloseFill = useCallback(() => setOpenFill(false), []);

    return (
      <>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => setOpenFixed(true)} variant="base-primary">
            Fixed Layout (Default)
          </Button>
          <Button onClick={() => setOpenFill(true)} variant="base-primary">
            Fill Layout
          </Button>
        </div>
        <Modal
          modalFooterActionsButtonLayout="fixed"
          modalFooterCancelText="Cancel"
          modalFooterConfirmText="Confirm"
          modalFooterOnCancel={onCloseFixed}
          modalFooterOnConfirm={onCloseFixed}
          modalHeaderTitle="Fixed Layout"
          modalType="standard"
          onClose={onCloseFixed}
          open={openFixed}
          showModalFooter
          showModalHeader
        >
          <>
            This modal uses fixed width buttons (default behavior). The buttons maintain
            a consistent width.
          </>
        </Modal>
        <Modal
          modalFooterActionsButtonLayout="fill"
          modalFooterCancelText="Cancel"
          modalFooterConfirmText="Confirm"
          modalFooterOnCancel={onCloseFill}
          modalFooterOnConfirm={onCloseFill}
          modalHeaderTitle="Fill Layout"
          modalType="standard"
          onClose={onCloseFill}
          open={openFill}
          showModalFooter
          showModalHeader
        >
          <>
            This modal uses fill layout. The buttons expand to fill the available space
            equally. Note: This only works when there is no control on the left side.
          </>
        </Modal>
      </>
    );
  },
};

export const ModalFooterWithPassword: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);

    const handleForgotPassword = () => {
      alert('Forgot password clicked!');
    };

    const handleLogin = () => {
      if (rememberMe) {
        // User chose to remember credentials
      }
      onClose();
    };

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Login Modal
        </Button>
        <Modal
          modalFooterAuxiliaryContentType="password"
          modalFooterCancelText="Cancel"
          modalFooterConfirmText="Login"
          modalFooterOnCancel={onClose}
          modalFooterOnConfirm={handleLogin}
          modalFooterPasswordButtonText="Forgot password?"
          modalFooterPasswordChecked={rememberMe}
          modalFooterPasswordCheckedLabel="Remember me"
          modalFooterPasswordCheckedOnChange={setRememberMe}
          modalFooterPasswordOnClick={handleForgotPassword}
          modalHeaderTitle="Login"
          modalType="standard"
          onClose={onClose}
          open={open}
          showModalFooter
          showModalHeader
        >
          <>
            This modal uses the password type auxiliary content. It displays a checkbox
            for &quot;Remember me&quot; and a link button for &quot;Forgot password?&quot;
            in a special password mode layout.
          </>
        </Modal>
      </>
    );
  },
};

export const ExtendedSplit: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    const onClose = useCallback(() => {
      setOpen(false);
    }, []);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Extended Split Layout
        </Button>
        <Modal
          extendedSplitRightSideContent={
            <div style={{ minHeight: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(147, 127, 199, 0.1)' }}>
              <Typography variant="body" color="text-neutral">Right Side Content (Slot) Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio id quibusdam quis similique vitae? A ab alias aperiam assumenda deleniti ducimus eligendi impedit magni obcaecati rerum? Ad aliquid amet blanditiis cum cumque dolor, ea eveniet exercitationem fugit hic id incidunt ipsam mollitia nemo porro qui quibusdam quisquam similique temporibus ullam, veniam voluptas voluptates voluptatum? Aliquid beatae consequatur ipsa minus perferendis quae, tempora? Accusantium aperiam, beatae consequuntur culpa cupiditate debitis delectus deleniti dignissimos dolor dolorum ducimus enim eos esse, eveniet id incidunt ipsa laboriosam laudantium magnam magni maxime molestiae natus nobis optio provident quasi quia quisquam quo repellat repellendus suscipit vitae?</Typography>
            </div>
          }
          extendedSplitLeftSideContent={
            <div style={{ minHeight: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(147, 127, 199, 0.1)' }}>
              <Typography variant="body" color="text-neutral">Left Side Content (Slot)</Typography>
            </div>
          }
          modalFooterCancelText="匯出 CSV"
          modalFooterConfirmText="開始資料校正"
          modalFooterOnCancel={onClose}
          modalFooterOnConfirm={onClose}
          modalHeaderTitle="組織專案"
          modalType="extendedSplit"
          size="wide"
          onClose={onClose}
          open={open}
          showDismissButton
          showModalFooter
          showModalHeader
        />
      </>
    );
  },
};

export const VerificationCodeInput: StoryObj = {
  render: function Render() {
    const [open4Digit, setOpen4Digit] = useState(false);
    const [open6Digit, setOpen6Digit] = useState(false);
    const [code4, setCode4] = useState('');
    const [code6, setCode6] = useState('');

    const onClose4Digit = useCallback(() => {
      setOpen4Digit(false);
      setCode4('');
    }, []);

    const onClose6Digit = useCallback(() => {
      setOpen6Digit(false);
      setCode6('');
    }, []);

    const handleComplete4 = useCallback((value: string) => {
      console.log('4-digit code completed:', value);
      alert(`Verification code entered: ${value}`);
    }, []);

    const handleComplete6 = useCallback((value: string) => {
      console.log('6-digit code completed:', value);
      alert(`Verification code entered: ${value}`);
    }, []);

    const handleResend = useCallback(() => {
      console.log('Resend verification code');
      alert('Verification code has been resent to your email!');
    }, []);

    return (
      <>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => setOpen4Digit(true)} variant="base-primary">
            4-Digit Verification
          </Button>
          <Button onClick={() => setOpen6Digit(true)} variant="base-primary">
            6-Digit Verification
          </Button>
        </div>

        <Modal
          modalFooterCancelText="取消"
          modalFooterConfirmText="驗證"
          modalFooterOnCancel={onClose4Digit}
          modalFooterOnConfirm={() => {
            if (code4.length === 4) {
              alert(`Verifying code: ${code4}`);
              onClose4Digit();
            } else {
              alert('Please enter the complete verification code');
            }
          }}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderSupportingText="請輸入我們寄送至您信箱的驗證碼"
          modalHeaderTitle="電子郵件驗證"
          modalStatusType="email"
          modalType="standard"
          onClose={onClose4Digit}
          open={open4Digit}
          showModalFooter
          showModalHeader
        >
          <ModalBodyForVerification
            length={4}
            value={code4}
            onChange={setCode4}
            onComplete={handleComplete4}
            onResend={handleResend}
            resendPrompt="收不到驗證碼？"
            resendText="點此重新寄送"
          />
        </Modal>

        <Modal
          modalFooterCancelText="取消"
          modalFooterConfirmText="驗證"
          modalFooterOnCancel={onClose6Digit}
          modalFooterOnConfirm={() => {
            if (code6.length === 6) {
              alert(`Verifying code: ${code6}`);
              onClose6Digit();
            } else {
              alert('Please enter the complete verification code');
            }
          }}
          modalHeaderShowModalStatusTypeIcon
          modalHeaderSupportingText="請輸入6位數驗證碼以完成雙重驗證"
          modalHeaderTitle="雙重驗證 (2FA)"
          modalStatusType="info"
          modalType="standard"
          onClose={onClose6Digit}
          open={open6Digit}
          showModalFooter
          showModalHeader
        >
          <ModalBodyForVerification
            length={6}
            value={code6}
            onChange={setCode6}
            onComplete={handleComplete6}
            onResend={handleResend}
            resendPrompt="沒收到驗證碼？"
            resendText="重新傳送"
          />
        </Modal>
      </>
    );
  },
};
