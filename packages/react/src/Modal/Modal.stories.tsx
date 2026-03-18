import { StoryObj, Meta } from '@storybook/react-webpack5';
import { ReactNode, useCallback, useState } from 'react';
import Modal, {
  ModalBodyForVerification,
  ModalFooterCancelProps,
  ModalHeaderLayoutProps,
  ModalSize,
  ModalStatusType,
} from '.';
import Button from '../Button';
import { ModalType } from '@mezzanine-ui/core/modal';
import Typography from '../Typography';

export default {
  component: Modal,
  title: 'Feedback/Modal',
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
    showDismissButton: true,
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
      options: ['standard', 'extended', 'extendedSplit', 'verification'],
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

    const cancelProps: ModalFooterCancelProps = showCancelButton
      ? { cancelText: cancelText ?? '' }
      : { showCancelButton: false };

    const baseProps = {
      actionsButtonLayout,
      annotation,
      auxiliaryContentButtonText,
      auxiliaryContentChecked,
      auxiliaryContentLabel,
      auxiliaryContentOnChange: () => {},
      auxiliaryContentOnClick: () => {},
      auxiliaryContentType,
      ...cancelProps,
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
      showDismissButton,
      size,
    };

    const layoutProps: ModalHeaderLayoutProps =
      statusTypeIconLayout === 'horizontal'
        ? {
            statusTypeIconLayout: 'horizontal',
            supportingTextAlign:
              supportingTextAlign === 'center'
                ? undefined
                : supportingTextAlign,
            titleAlign: titleAlign === 'center' ? undefined : titleAlign,
          }
        : titleAlign === 'center'
          ? {
              statusTypeIconLayout: statusTypeIconLayout as
                | 'vertical'
                | undefined,
              supportingTextAlign,
              titleAlign: 'center',
            }
          : {
              statusTypeIconLayout: statusTypeIconLayout as
                | 'vertical'
                | undefined,
              supportingTextAlign:
                supportingTextAlign === 'center'
                  ? undefined
                  : supportingTextAlign,
              titleAlign: titleAlign as 'left' | undefined,
            };

    // Extended split specific props
    const extendedSplitLeftSideContent = (
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
    );

    const extendedSplitRightSideContent = (
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
    );

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
              {...layoutProps}
              extendedSplitLeftSideContent={extendedSplitLeftSideContent}
              extendedSplitRightSideContent={extendedSplitRightSideContent}
              modalType="extendedSplit"
              size="wide"
              confirmText={confirmText || 'Confirm'}
              showStatusTypeIcon={showStatusTypeIcon}
              supportingText={supportingText}
              title={typeof title === 'string' ? title : 'Title'}
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
              {...layoutProps}
              extendedSplitLeftSideContent={extendedSplitLeftSideContent}
              extendedSplitRightSideContent={extendedSplitRightSideContent}
              modalType="extendedSplit"
              size="wide"
              showStatusTypeIcon={showStatusTypeIcon}
              supportingText={supportingText}
              title={typeof title === 'string' ? title : 'Title'}
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
              extendedSplitLeftSideContent={extendedSplitLeftSideContent}
              extendedSplitRightSideContent={extendedSplitRightSideContent}
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
            extendedSplitLeftSideContent={extendedSplitLeftSideContent}
            extendedSplitRightSideContent={extendedSplitRightSideContent}
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
            {...layoutProps}
            modalType={modalType}
            confirmText={confirmText || 'Confirm'}
            showStatusTypeIcon={showStatusTypeIcon}
            supportingText={supportingText}
            title={typeof title === 'string' ? title : 'Title'}
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
            {...layoutProps}
            modalType={modalType}
            showStatusTypeIcon={showStatusTypeIcon}
            supportingText={supportingText}
            title={typeof title === 'string' ? title : 'Title'}
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

export const ModalHeaderCombinations: StoryObj = {
  render: function Render() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const onClose = useCallback(() => setOpenIndex(null), []);

    const baseProps = {
      confirmText: 'OK',
      modalType: 'standard' as const,
      onClose,
      onConfirm: onClose,
      showCancelButton: false as const,
      showModalFooter: true as const,
      showModalHeader: true as const,
    };

    const body = <>Modal body content.</>;

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <Typography color="text-neutral-strong" variant="body">
              No Icon
            </Typography>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              <Button onClick={() => setOpenIndex(0)} variant="base-primary">
                Title
              </Button>
              <Button onClick={() => setOpenIndex(1)} variant="base-primary">
                Title (Center)
              </Button>
              <Button onClick={() => setOpenIndex(2)} variant="base-primary">
                Title + Supporting
              </Button>
              <Button onClick={() => setOpenIndex(3)} variant="base-primary">
                Both Center
              </Button>
            </div>
          </div>
          <div>
            <Typography color="text-neutral-strong" variant="body">
              Vertical Icon
            </Typography>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              <Button onClick={() => setOpenIndex(4)} variant="base-primary">
                Title
              </Button>
              <Button onClick={() => setOpenIndex(5)} variant="base-primary">
                Title (Center)
              </Button>
              <Button onClick={() => setOpenIndex(6)} variant="base-primary">
                Title + Supporting
              </Button>
              <Button onClick={() => setOpenIndex(7)} variant="base-primary">
                Both Center
              </Button>
            </div>
          </div>
          <div>
            <Typography color="text-neutral-strong" variant="body">
              Horizontal Icon
            </Typography>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              <Button onClick={() => setOpenIndex(8)} variant="base-primary">
                Title
              </Button>
              <Button onClick={() => setOpenIndex(9)} variant="base-primary">
                Title + Supporting
              </Button>
            </div>
          </div>
        </div>

        {/* No Icon */}
        <Modal {...baseProps} open={openIndex === 0} title="Title Only">
          {body}
        </Modal>
        <Modal
          {...baseProps}
          open={openIndex === 1}
          title="Title Only (Center)"
          titleAlign="center"
        >
          {body}
        </Modal>
        <Modal
          {...baseProps}
          open={openIndex === 2}
          supportingText="Supporting text displayed below the title."
          title="Title + Supporting"
        >
          {body}
        </Modal>
        <Modal
          {...baseProps}
          open={openIndex === 3}
          supportingText="Supporting text aligned center."
          supportingTextAlign="center"
          title="Both Center"
          titleAlign="center"
        >
          {body}
        </Modal>

        {/* Vertical Icon */}
        <Modal
          {...baseProps}
          open={openIndex === 4}
          showStatusTypeIcon
          title="Vertical Icon"
        >
          {body}
        </Modal>
        <Modal
          {...baseProps}
          open={openIndex === 5}
          showStatusTypeIcon
          title="Vertical Icon (Center)"
          titleAlign="center"
        >
          {body}
        </Modal>
        <Modal
          {...baseProps}
          open={openIndex === 6}
          showStatusTypeIcon
          supportingText="Supporting text displayed below the title."
          title="Vertical Icon + Supporting"
        >
          {body}
        </Modal>
        <Modal
          {...baseProps}
          open={openIndex === 7}
          showStatusTypeIcon
          supportingText="Supporting text aligned center."
          supportingTextAlign="center"
          title="Vertical Icon + Both Center"
          titleAlign="center"
        >
          {body}
        </Modal>

        {/* Horizontal Icon */}
        <Modal
          {...baseProps}
          open={openIndex === 8}
          showStatusTypeIcon
          statusTypeIconLayout="horizontal"
          title="Horizontal Icon"
        >
          {body}
        </Modal>
        <Modal
          {...baseProps}
          open={openIndex === 9}
          showStatusTypeIcon
          statusTypeIconLayout="horizontal"
          supportingText="Supporting text displayed below the title."
          title="Horizontal Icon + Supporting"
        >
          {body}
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
          supportingTextAlign="left"
          title="Complete Header Example"
          titleAlign="left"
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
          modalType="standard"
          onCancel={onCloseFixed}
          onClose={onCloseFixed}
          onConfirm={onCloseFixed}
          open={openFixed}
          showModalFooter
          showModalHeader
          title="Fixed Layout"
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
          modalType="standard"
          onCancel={onCloseFill}
          onClose={onCloseFill}
          onConfirm={onCloseFill}
          open={openFill}
          showModalFooter
          showModalHeader
          title="Fill Layout"
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

const LONG_BODY_TEXT = Array.from({ length: 12 }, (_, i) => (
  <p key={i} style={{ margin: '0 0 12px' }}>
    Paragraph {i + 1} — Lorem ipsum dolor sit amet, consectetur adipisicing
    elit. Dolorum illum neque soluta atque eum dolores placeat unde molestias
    exercitationem tempore perspiciatis quia porro sapiente vero impedit
    consequatur recusandae excepturi cumque.
  </p>
));

export const BodySeparator: StoryObj = {
  render: function Render() {
    const [openStandard, setOpenStandard] = useState(false);
    const [openExtended, setOpenExtended] = useState(false);
    const onCloseStandard = useCallback(() => setOpenStandard(false), []);
    const onCloseExtended = useCallback(() => setOpenExtended(false), []);

    return (
      <>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => setOpenStandard(true)} variant="base-primary">
            Scroll-based Separator
          </Button>
          <Button onClick={() => setOpenExtended(true)} variant="base-primary">
            Extended (Always Visible)
          </Button>
        </div>

        <Modal
          cancelText="Cancel"
          confirmText="Confirm"
          modalType="standard"
          onCancel={onCloseStandard}
          onClose={onCloseStandard}
          onConfirm={onCloseStandard}
          open={openStandard}
          showModalFooter
          showModalHeader
          size="regular"
          title="Scroll-based Separator"
        >
          {LONG_BODY_TEXT}
        </Modal>

        <Modal
          cancelText="Cancel"
          confirmText="Confirm"
          modalType="extended"
          onCancel={onCloseExtended}
          onClose={onCloseExtended}
          onConfirm={onCloseExtended}
          open={openExtended}
          showModalFooter
          showModalHeader
          size="regular"
          title="Extended (Always Visible)"
        >
          <>Both separators are always visible in Extended Modal.</>
        </Modal>
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
      alert(`Verification code entered: ${value}`);
    }, []);

    const handleComplete6 = useCallback((value: string) => {
      alert(`Verification code entered: ${value}`);
    }, []);

    const handleResend = useCallback(() => {
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
