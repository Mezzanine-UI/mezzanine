import { StoryObj, Meta } from '@storybook/react-webpack5';
import { ReactNode, useCallback, useState } from 'react';
import Modal, { ModalStatusType, ModalSize, ModalBodyForVerification } from '.';
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
  actionsButtonLayout?: 'fill' | 'fixed';
  annotation?: string;
  auxiliaryContentButtonText?: string;
  auxiliaryContentChecked?: boolean;
  auxiliaryContentLabel?: string;
  auxiliaryContentType?:
    | 'annotation'
    | 'button'
    | 'checkbox'
    | 'password'
    | 'toggle';
  body: ReactNode;
  cancelText?: string;
  confirmText?: string;
  disableCloseOnBackdropClick?: boolean;
  disableCloseOnEscapeKeyDown?: boolean;
  fullScreen?: boolean;
  loading?: boolean;
  modalStatusType?: ModalStatusType;
  modalType: ModalType;
  passwordButtonText?: string;
  passwordChecked?: boolean;
  passwordCheckedLabel?: string;
  passwordCheckedOnChange?: (checked: boolean) => void;
  showCancelButton?: boolean;
  showDismissButton?: boolean;
  showModalFooter?: boolean;
  showModalHeader?: boolean;
  showStatusTypeIcon: boolean;
  size?: ModalSize;
  statusTypeIconLayout?: 'vertical' | 'horizontal';
  supportingText?: string;
  supportingTextAlign?: 'left' | 'center';
  title?: ReactNode;
  titleAlign?: 'left' | 'center';
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    actionsButtonLayout: 'fixed',
    annotation: 'Annotation text',
    auxiliaryContentButtonText: 'Reset',
    auxiliaryContentChecked: false,
    auxiliaryContentLabel: 'Control label',
    auxiliaryContentType: undefined,
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum illum neque soluta atque. Eum dolores placeat unde, molestias exercitationem tempore perspiciatis quia porro sapiente vero impedit consequatur recusandae excepturi cumque.',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    fullScreen: false,
    loading: false,
    modalStatusType: 'info',
    modalType: 'standard',
    passwordButtonText: 'Forgot password?',
    passwordChecked: false,
    passwordCheckedLabel: 'Remember me',
    showCancelButton: true,
    showDismissButton: false,
    showModalFooter: true,
    showModalHeader: true,
    showStatusTypeIcon: false,
    size: 'regular',
    statusTypeIconLayout: 'vertical',
    supportingText: 'This is a supporting text',
    supportingTextAlign: 'left',
    title: 'Title',
    titleAlign: 'left',
  },
  argTypes: {
    actionsButtonLayout: {
      control: {
        type: 'select',
      },
      options: ['fixed', 'fill'],
    },
    auxiliaryContentType: {
      control: {
        type: 'select',
      },
      options: [
        undefined,
        'annotation',
        'button',
        'checkbox',
        'toggle',
        'password',
      ],
    },
    statusTypeIconLayout: {
      control: {
        type: 'select',
      },
      options: ['vertical', 'horizontal'],
    },
    supportingTextAlign: {
      control: {
        type: 'select',
      },
      options: ['left', 'center'],
    },
    titleAlign: {
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
      options: [
        'standard',
        'extended',
        'extendedSplit',
        'mediaPreview',
        'verification',
      ],
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
      actionsButtonLayout,
      annotation,
      auxiliaryContentButtonText,
      auxiliaryContentChecked,
      auxiliaryContentLabel,
      auxiliaryContentType,
      body,
      cancelText,
      confirmText,
      disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown,
      fullScreen,
      loading,
      modalStatusType,
      modalType,
      passwordButtonText,
      passwordChecked,
      passwordCheckedLabel,
      passwordCheckedOnChange,
      showCancelButton,
      showDismissButton,
      showModalFooter,
      showModalHeader,
      showStatusTypeIcon,
      size,
      statusTypeIconLayout,
      supportingText,
      supportingTextAlign,
      title,
      titleAlign,
    } = args;

    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), []);

    const baseProps = {
      actionsButtonLayout,
      annotation,
      auxiliaryContentButtonText,
      auxiliaryContentChecked,
      auxiliaryContentLabel,
      auxiliaryContentOnChange: () => {},
      auxiliaryContentOnClick: () => {},
      auxiliaryContentType,
      cancelText,
      disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown,
      fullScreen,
      loading,
      modalStatusType,
      onCancel: onClose,
      onClose,
      onConfirm: onClose,
      open,
      passwordButtonText,
      passwordChecked,
      passwordCheckedLabel,
      passwordCheckedOnChange: passwordCheckedOnChange || (() => {}),
      passwordOnClick: () => {},
      showCancelButton,
      showDismissButton,
      size,
    };

    // Extended split specific props
    const extendedSplitProps =
      modalType === 'extendedSplit'
        ? {
            extendedSplitLeftSideContent: (
              <div
                style={{
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>Left Side Content</span>
              </div>
            ),
            extendedSplitRightSideContent: (
              <div
                style={{
                  minHeight: '200px',
                  width: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>Right Side Content</span>
              </div>
            ),
          }
        : {};

    // Type-safe props construction based on modalType, showModalHeader and showModalFooter
    // Handle extendedSplit separately due to discriminated union
    if (modalType === 'extendedSplit') {
      if (showModalHeader && showModalFooter) {
        return (
          <>
            <Button onClick={() => setOpen(true)} variant="base-primary">
              open
            </Button>
            <Modal
              {...baseProps}
              {...extendedSplitProps}
              modalType="extendedSplit"
              size="wide"
              confirmText={confirmText || 'Confirm'}
              showStatusTypeIcon={showStatusTypeIcon}
              statusTypeIconLayout={statusTypeIconLayout}
              supportingText={supportingText}
              supportingTextAlign={supportingTextAlign}
              title={typeof title === 'string' ? title : 'Title'}
              titleAlign={titleAlign}
              showModalFooter
              showModalHeader
            />
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
              modalType="extendedSplit"
              size="wide"
              showStatusTypeIcon={showStatusTypeIcon}
              statusTypeIconLayout={statusTypeIconLayout}
              supportingText={supportingText}
              supportingTextAlign={supportingTextAlign}
              title={typeof title === 'string' ? title : 'Title'}
              titleAlign={titleAlign}
              showModalHeader
            />
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
              modalType="extendedSplit"
              size="wide"
              confirmText={confirmText || 'Confirm'}
              showModalFooter
            />
          </>
        );
      }

      return (
        <>
          <Button onClick={() => setOpen(true)} variant="base-primary">
            open
          </Button>
          <Modal
            {...baseProps}
            {...extendedSplitProps}
            modalType="extendedSplit"
            size="wide"
          />
        </>
      );
    }

    // Handle other modal types
    if (showModalHeader && showModalFooter) {
      return (
        <>
          <Button onClick={() => setOpen(true)} variant="base-primary">
            open
          </Button>
          <Modal
            {...baseProps}
            modalType={modalType}
            confirmText={confirmText || 'Confirm'}
            showStatusTypeIcon={showStatusTypeIcon}
            statusTypeIconLayout={statusTypeIconLayout}
            supportingText={supportingText}
            supportingTextAlign={supportingTextAlign}
            title={typeof title === 'string' ? title : 'Title'}
            titleAlign={titleAlign}
            showModalFooter
            showModalHeader
          >
            {body}
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
            modalType={modalType}
            showStatusTypeIcon={showStatusTypeIcon}
            statusTypeIconLayout={statusTypeIconLayout}
            supportingText={supportingText}
            supportingTextAlign={supportingTextAlign}
            title={typeof title === 'string' ? title : 'Title'}
            titleAlign={titleAlign}
            showModalHeader
          >
            {body}
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
            modalType={modalType}
            confirmText={confirmText || 'Confirm'}
            showModalFooter
          >
            {body}
          </Modal>
        </>
      );
    }

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          open
        </Button>
        <Modal {...baseProps} modalType={modalType}>
          {body}
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
          cancelText="Close"
          confirmText="OK"
          onCancel={() => setOpenInfo(false)}
          onConfirm={() => setOpenInfo(false)}
          showStatusTypeIcon
          supportingText="This is an informational message"
          title="Information"
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
          cancelText="Close"
          confirmText="OK"
          onCancel={() => setOpenError(false)}
          onConfirm={() => setOpenError(false)}
          showStatusTypeIcon
          supportingText="An error has occurred during the operation"
          title="Error"
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
          cancelText="Close"
          confirmText="OK"
          onCancel={() => setOpenWarning(false)}
          onConfirm={() => setOpenWarning(false)}
          showStatusTypeIcon
          supportingText="Please proceed with caution"
          title="Warning"
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
          cancelText="Close"
          confirmText="OK"
          onCancel={() => setOpenSuccess(false)}
          onConfirm={() => setOpenSuccess(false)}
          showStatusTypeIcon
          supportingText="Operation completed successfully"
          title="Success"
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
          cancelText="Close"
          confirmText="OK"
          onCancel={() => setOpenEmail(false)}
          onConfirm={() => setOpenEmail(false)}
          showStatusTypeIcon
          supportingText="You have new messages in your inbox"
          title="Email Notification"
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
          cancelText="Cancel"
          confirmText="Delete"
          confirmButtonProps={{ variant: 'destructive-primary' }}
          onCancel={() => setOpenDelete(false)}
          onConfirm={() => setOpenDelete(false)}
          showStatusTypeIcon
          supportingText="This action cannot be undone"
          title="Delete Confirmation"
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
          cancelText="Cancel"
          confirmText="Acknowledge"
          onCancel={onClose}
          onConfirm={onClose}
          showStatusTypeIcon
          statusTypeIconLayout="horizontal"
          supportingText="This modal demonstrates all header features combined together"
          supportingTextAlign="center"
          title="Complete Header Example"
          titleAlign="center"
          modalStatusType="warning"
          onClose={onClose}
          open={open}
          showModalFooter
          showModalHeader
        >
          <>
            This modal showcases all header features: status icon, horizontal
            layout, centered title and supporting text.
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
          cancelText="Cancel"
          confirmText="Confirm"
          onCancel={onClose}
          onConfirm={onClose}
          onClose={onClose}
          open={open}
          showModalFooter
          showModalHeader
          title="Modal with Footer"
        >
          <>
            This modal uses the new ModalFooter component with cancel and
            confirm buttons.
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
          actionsButtonLayout="fixed"
          cancelText="Cancel"
          confirmText="Confirm"
          onCancel={onCloseFixed}
          onConfirm={onCloseFixed}
          title="Fixed Layout"
          modalType="standard"
          onClose={onCloseFixed}
          open={openFixed}
          showModalFooter
          showModalHeader
        >
          <>
            This modal uses fixed width buttons (default behavior). The buttons
            maintain a consistent width.
          </>
        </Modal>
        <Modal
          actionsButtonLayout="fill"
          cancelText="Cancel"
          confirmText="Confirm"
          onCancel={onCloseFill}
          onConfirm={onCloseFill}
          title="Fill Layout"
          modalType="standard"
          onClose={onCloseFill}
          open={openFill}
          showModalFooter
          showModalHeader
        >
          <>
            This modal uses fill layout. The buttons expand to fill the
            available space equally. Note: This only works when there is no
            control on the left side.
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
          auxiliaryContentType="password"
          cancelText="Cancel"
          confirmText="Login"
          onCancel={onClose}
          onConfirm={handleLogin}
          passwordButtonText="Forgot password?"
          passwordChecked={rememberMe}
          passwordCheckedLabel="Remember me"
          passwordCheckedOnChange={setRememberMe}
          passwordOnClick={handleForgotPassword}
          title="Login"
          modalType="standard"
          onClose={onClose}
          open={open}
          showModalFooter
          showModalHeader
        >
          <>
            This modal uses the password type auxiliary content. It displays a
            checkbox for &quot;Remember me&quot; and a link button for
            &quot;Forgot password?&quot; in a special password mode layout.
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
            <div
              style={{
                minHeight: '300px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(147, 127, 199, 0.1)',
              }}
            >
              <Typography variant="body" color="text-neutral">
                Right Side Content (Slot) Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Distinctio id quibusdam quis
                similique vitae? A ab alias aperiam assumenda deleniti ducimus
                eligendi impedit magni obcaecati rerum? Ad aliquid amet
                blanditiis cum cumque dolor, ea eveniet exercitationem fugit hic
                id incidunt ipsam mollitia nemo porro qui quibusdam quisquam
                similique temporibus ullam, veniam voluptas voluptates
                voluptatum? Aliquid beatae consequatur ipsa minus perferendis
                quae, tempora? Accusantium aperiam, beatae consequuntur culpa
                cupiditate debitis delectus deleniti dignissimos dolor dolorum
                ducimus enim eos esse, eveniet id incidunt ipsa laboriosam
                laudantium magnam magni maxime molestiae natus nobis optio
                provident quasi quia quisquam quo repellat repellendus suscipit
                vitae?
              </Typography>
            </div>
          }
          extendedSplitLeftSideContent={
            <div
              style={{
                minHeight: '300px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(147, 127, 199, 0.1)',
              }}
            >
              <Typography variant="body" color="text-neutral">
                Left Side Content (Slot)
              </Typography>
            </div>
          }
          cancelText="匯出 CSV"
          confirmText="開始資料校正"
          onCancel={onClose}
          onConfirm={onClose}
          title="組織專案"
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
          cancelText="取消"
          confirmText="驗證"
          onCancel={onClose4Digit}
          onConfirm={() => {
            if (code4.length === 4) {
              alert(`Verifying code: ${code4}`);
              onClose4Digit();
            } else {
              alert('Please enter the complete verification code');
            }
          }}
          showStatusTypeIcon
          supportingText="請輸入我們寄送至您信箱的驗證碼"
          title="電子郵件驗證"
          modalStatusType="email"
          modalType="verification"
          onClose={onClose4Digit}
          open={open4Digit}
          showModalFooter
          showModalHeader
        >
          <ModalBodyForVerification
            length={4}
            onChange={setCode4}
            onComplete={handleComplete4}
            onResend={handleResend}
            resendPrompt="收不到驗證碼？"
            resendText="點此重新寄送"
            value={code4}
          />
        </Modal>

        <Modal
          cancelText="取消"
          confirmText="驗證"
          onCancel={onClose6Digit}
          onConfirm={() => {
            if (code6.length === 6) {
              alert(`Verifying code: ${code6}`);
              onClose6Digit();
            } else {
              alert('Please enter the complete verification code');
            }
          }}
          showStatusTypeIcon
          supportingText="請輸入6位數驗證碼以完成雙重驗證"
          title="雙重驗證 (2FA)"
          modalStatusType="info"
          modalType="verification"
          onClose={onClose6Digit}
          open={open6Digit}
          showModalFooter
          showModalHeader
        >
          <ModalBodyForVerification
            length={6}
            onChange={setCode6}
            onComplete={handleComplete6}
            onResend={handleResend}
            resendPrompt="沒收到驗證碼？"
            resendText="重新傳送"
            value={code6}
          />
        </Modal>
      </>
    );
  },
};
