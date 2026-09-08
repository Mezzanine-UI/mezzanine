import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, h, ref } from 'vue';
import type { VNodeChild } from 'vue';
import type {
  ModalSize,
  ModalStatusType,
  ModalType,
} from '@mezzanine-ui/core/modal';
import MznButton from '../button/button.vue';
import MznTypography from '../typography/typography.vue';
import MznModalBodyForVerification from './modal-body-for-verification.vue';
import MznModal from './modal.vue';

export default {
  component: MznModal,
  title: 'Feedback/Modal',
} as Meta<typeof MznModal>;

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
  body: VNodeChild;
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
  statusTypeIconLayout?: 'horizontal' | 'vertical';
  supportingText?: string;
  supportingTextAlign?: 'center' | 'left';
  title?: VNodeChild;
  titleAlign?: 'center' | 'left';
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
  render: (args) => ({
    components: { MznButton, MznModal },
    setup: () => {
      const open = ref(false);
      const onClose = (): void => {
        open.value = false;
      };

      const isExtendedSplit = computed(
        (): boolean => args.modalType === 'extendedSplit',
      );

      /**
       * React splits this into eight branches purely to satisfy its
       * discriminated unions — the props are the same in each, and a branch
       * that hides the header simply leaves the header props out. Vue's props
       * are flat, so one binding covers all of them: a header that is not
       * shown ignores its props either way.
       */
      const modalBindings = computed(() => ({
        actionsButtonLayout: args.actionsButtonLayout,
        annotation: args.annotation,
        auxiliaryContentButtonText: args.auxiliaryContentButtonText,
        auxiliaryContentChecked: args.auxiliaryContentChecked,
        auxiliaryContentLabel: args.auxiliaryContentLabel,
        auxiliaryContentOnChange: () => {},
        auxiliaryContentOnClick: () => {},
        auxiliaryContentType: args.auxiliaryContentType,
        cancelText: args.showCancelButton ? (args.cancelText ?? '') : undefined,
        confirmText: args.confirmText || 'Confirm',
        disableCloseOnBackdropClick: args.disableCloseOnBackdropClick,
        disableCloseOnEscapeKeyDown: args.disableCloseOnEscapeKeyDown,
        extendedSplitLeftSideContent: h(
          'div',
          {
            style: {
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
          [h('span', null, 'Left Side Content')],
        ),
        extendedSplitRightSideContent: h(
          'div',
          {
            style: {
              minHeight: '200px',
              width: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
          [h('span', null, 'Right Side Content')],
        ),
        fullScreen: args.fullScreen,
        loading: args.loading,
        modalStatusType: args.modalStatusType,
        modalType: args.modalType,
        passwordButtonText: args.passwordButtonText,
        passwordChecked: args.passwordChecked,
        passwordCheckedLabel: args.passwordCheckedLabel,
        passwordCheckedOnChange: args.passwordCheckedOnChange || (() => {}),
        passwordOnClick: () => {},
        showCancelButton: args.showCancelButton ? undefined : false,
        showDismissButton: args.showDismissButton,
        showModalFooter: args.showModalFooter,
        showModalHeader: args.showModalHeader,
        showStatusTypeIcon: args.showStatusTypeIcon,
        size: isExtendedSplit.value ? 'wide' : args.size,
        statusTypeIconLayout:
          args.statusTypeIconLayout === 'horizontal'
            ? 'horizontal'
            : args.statusTypeIconLayout,
        supportingText: args.supportingText,
        supportingTextAlign:
          args.statusTypeIconLayout === 'horizontal' ||
          args.titleAlign !== 'center'
            ? args.supportingTextAlign === 'center'
              ? undefined
              : args.supportingTextAlign
            : args.supportingTextAlign,
        title: typeof args.title === 'string' ? args.title : 'Title',
        titleAlign:
          args.statusTypeIconLayout === 'horizontal'
            ? args.titleAlign === 'center'
              ? undefined
              : args.titleAlign
            : args.titleAlign,
      }));

      return { args, isExtendedSplit, modalBindings, onClose, open };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">open</MznButton>
      <MznModal
        v-bind="modalBindings"
        :open="open"
        @cancel="onClose"
        @close="onClose"
        @confirm="onClose"
      >
        <template v-if="!isExtendedSplit">{{ args.body }}</template>
      </MznModal>
    `,
  }),
};

export const ModalHeaderStatusTypes: StoryObj = {
  render: () => ({
    components: { MznButton, MznModal },
    setup: () => {
      const openInfo = ref(false);
      const openError = ref(false);
      const openWarning = ref(false);
      const openSuccess = ref(false);
      const openEmail = ref(false);
      const openDelete = ref(false);

      return {
        DESTRUCTIVE_CONFIRM: { variant: 'destructive-primary' },
        openDelete,
        openEmail,
        openError,
        openInfo,
        openSuccess,
        openWarning,
      };
    },
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <MznButton variant="base-primary" @click="openInfo = true">Info</MznButton>
        <MznButton variant="base-primary" @click="openError = true">Error</MznButton>
        <MznButton variant="base-primary" @click="openWarning = true">Warning</MznButton>
        <MznButton variant="base-primary" @click="openSuccess = true">Success</MznButton>
        <MznButton variant="base-primary" @click="openEmail = true">Email</MznButton>
        <MznButton variant="base-primary" @click="openDelete = true">Delete</MznButton>
      </div>
      <MznModal
        modal-type="standard"
        cancel-text="Close"
        confirm-text="OK"
        show-status-type-icon
        supporting-text="This is an informational message"
        title="Information"
        modal-status-type="info"
        :open="openInfo"
        show-modal-footer
        show-modal-header
        @cancel="openInfo = false"
        @close="openInfo = false"
        @confirm="openInfo = false"
      />
      <MznModal
        modal-type="standard"
        cancel-text="Close"
        confirm-text="OK"
        show-status-type-icon
        supporting-text="An error has occurred during the operation"
        title="Error"
        modal-status-type="error"
        :open="openError"
        show-modal-footer
        show-modal-header
        @cancel="openError = false"
        @close="openError = false"
        @confirm="openError = false"
      />
      <MznModal
        modal-type="standard"
        cancel-text="Close"
        confirm-text="OK"
        show-status-type-icon
        supporting-text="Please proceed with caution"
        title="Warning"
        modal-status-type="warning"
        :open="openWarning"
        show-modal-footer
        show-modal-header
        @cancel="openWarning = false"
        @close="openWarning = false"
        @confirm="openWarning = false"
      />
      <MznModal
        modal-type="standard"
        cancel-text="Close"
        confirm-text="OK"
        show-status-type-icon
        supporting-text="Operation completed successfully"
        title="Success"
        modal-status-type="success"
        :open="openSuccess"
        show-modal-footer
        show-modal-header
        @cancel="openSuccess = false"
        @close="openSuccess = false"
        @confirm="openSuccess = false"
      />
      <MznModal
        modal-type="standard"
        cancel-text="Close"
        confirm-text="OK"
        show-status-type-icon
        supporting-text="You have new messages in your inbox"
        title="Email Notification"
        modal-status-type="email"
        :open="openEmail"
        show-modal-footer
        show-modal-header
        @cancel="openEmail = false"
        @close="openEmail = false"
        @confirm="openEmail = false"
      />
      <MznModal
        modal-type="standard"
        cancel-text="Cancel"
        confirm-text="Delete"
        :confirm-button-props="DESTRUCTIVE_CONFIRM"
        show-status-type-icon
        supporting-text="This action cannot be undone"
        title="Delete Confirmation"
        modal-status-type="delete"
        :open="openDelete"
        show-modal-footer
        show-modal-header
        @cancel="openDelete = false"
        @close="openDelete = false"
        @confirm="openDelete = false"
      />
    `,
  }),
};

export const ModalHeaderCombinations: StoryObj = {
  render: () => ({
    components: { MznButton, MznModal, MznTypography },
    setup: () => {
      const openIndex = ref<number | null>(null);
      const onClose = (): void => {
        openIndex.value = null;
      };

      return {
        baseProps: {
          confirmText: 'OK',
          modalType: 'standard' as const,
          showCancelButton: false as const,
          showModalFooter: true as const,
          showModalHeader: true as const,
        },
        onClose,
        openIndex,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px">
        <div>
          <MznTypography color="text-neutral-strong" variant="body">No Icon</MznTypography>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px">
            <MznButton variant="base-primary" @click="openIndex = 0">Title</MznButton>
            <MznButton variant="base-primary" @click="openIndex = 1">Title (Center)</MznButton>
            <MznButton variant="base-primary" @click="openIndex = 2">Title + Supporting</MznButton>
            <MznButton variant="base-primary" @click="openIndex = 3">Both Center</MznButton>
          </div>
        </div>
        <div>
          <MznTypography color="text-neutral-strong" variant="body">Vertical Icon</MznTypography>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px">
            <MznButton variant="base-primary" @click="openIndex = 4">Title</MznButton>
            <MznButton variant="base-primary" @click="openIndex = 5">Title (Center)</MznButton>
            <MznButton variant="base-primary" @click="openIndex = 6">Title + Supporting</MznButton>
            <MznButton variant="base-primary" @click="openIndex = 7">Both Center</MznButton>
          </div>
        </div>
        <div>
          <MznTypography color="text-neutral-strong" variant="body">Horizontal Icon</MznTypography>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px">
            <MznButton variant="base-primary" @click="openIndex = 8">Title</MznButton>
            <MznButton variant="base-primary" @click="openIndex = 9">Title + Supporting</MznButton>
          </div>
        </div>
      </div>

      <!-- No Icon -->
      <MznModal v-bind="baseProps" :open="openIndex === 0" title="Title Only" @close="onClose" @confirm="onClose">
        Modal body content.
      </MznModal>
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 1"
        title="Title Only (Center)"
        title-align="center"
        @close="onClose"
        @confirm="onClose"
      >
        Modal body content.
      </MznModal>
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 2"
        supporting-text="Supporting text displayed below the title."
        title="Title + Supporting"
        @close="onClose"
        @confirm="onClose"
      >
        Modal body content.
      </MznModal>
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 3"
        supporting-text="Supporting text aligned center."
        supporting-text-align="center"
        title="Both Center"
        title-align="center"
        @close="onClose"
        @confirm="onClose"
      >
        Modal body content.
      </MznModal>

      <!-- Vertical Icon -->
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 4"
        show-status-type-icon
        title="Vertical Icon"
        @close="onClose"
        @confirm="onClose"
      />
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 5"
        show-status-type-icon
        title="Vertical Icon (Center)"
        title-align="center"
        @close="onClose"
        @confirm="onClose"
      />
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 6"
        show-status-type-icon
        supporting-text="Supporting text displayed below the title."
        title="Vertical Icon + Supporting"
        @close="onClose"
        @confirm="onClose"
      />
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 7"
        show-status-type-icon
        supporting-text="Supporting text aligned center."
        supporting-text-align="center"
        title="Vertical Icon + Both Center"
        title-align="center"
        @close="onClose"
        @confirm="onClose"
      />

      <!-- Horizontal Icon -->
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 8"
        show-status-type-icon
        status-type-icon-layout="horizontal"
        title="Horizontal Icon"
        @close="onClose"
        @confirm="onClose"
      />
      <MznModal
        v-bind="baseProps"
        :open="openIndex === 9"
        show-status-type-icon
        status-type-icon-layout="horizontal"
        supporting-text="Supporting text displayed below the title."
        title="Horizontal Icon + Supporting"
        @close="onClose"
        @confirm="onClose"
      />
    `,
  }),
};

export const ModalFooterButtonLayout: StoryObj = {
  render: () => ({
    components: { MznButton, MznModal },
    setup: () => {
      const openFixed = ref(false);
      const openFill = ref(false);

      return {
        onCloseFill: (): void => {
          openFill.value = false;
        },
        onCloseFixed: (): void => {
          openFixed.value = false;
        },
        openFill,
        openFixed,
      };
    },
    template: `
      <div style="display: flex; gap: 8px">
        <MznButton variant="base-primary" @click="openFixed = true">Fixed Layout (Default)</MznButton>
        <MznButton variant="base-primary" @click="openFill = true">Fill Layout</MznButton>
      </div>
      <MznModal
        actions-button-layout="fixed"
        cancel-text="Cancel"
        confirm-text="Confirm"
        modal-type="standard"
        :open="openFixed"
        show-modal-footer
        show-modal-header
        title="Fixed Layout"
        @cancel="onCloseFixed"
        @close="onCloseFixed"
        @confirm="onCloseFixed"
      >
        This modal uses fixed width buttons (default behavior). The buttons
        maintain a consistent width.
      </MznModal>
      <MznModal
        actions-button-layout="fill"
        cancel-text="Cancel"
        confirm-text="Confirm"
        modal-type="standard"
        :open="openFill"
        show-modal-footer
        show-modal-header
        title="Fill Layout"
        @cancel="onCloseFill"
        @close="onCloseFill"
        @confirm="onCloseFill"
      >
        This modal uses fill layout. The buttons expand to fill the
        available space equally. Note: This only works when there is no
        control on the left side.
      </MznModal>
    `,
  }),
};

export const ModalFooterWithPassword: StoryObj = {
  render: () => ({
    components: { MznButton, MznModal },
    setup: () => {
      const open = ref(false);
      const rememberMe = ref(false);
      const onClose = (): void => {
        open.value = false;
      };

      return {
        handleForgotPassword: (): void => {
          alert('Forgot password clicked!');
        },
        handleLogin: (): void => {
          if (rememberMe.value) {
            // User chose to remember credentials
          }

          onClose();
        },
        onClose,
        open,
        rememberMe,
        setRememberMe: (checked: boolean): void => {
          rememberMe.value = checked;
        },
      };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">Login Modal</MznButton>
      <MznModal
        auxiliary-content-type="password"
        cancel-text="Cancel"
        confirm-text="Login"
        password-button-text="Forgot password?"
        :password-checked="rememberMe"
        password-checked-label="Remember me"
        :password-checked-on-change="setRememberMe"
        :password-on-click="handleForgotPassword"
        title="Login"
        modal-type="standard"
        :open="open"
        show-modal-footer
        show-modal-header
        @cancel="onClose"
        @close="onClose"
        @confirm="handleLogin"
      >
        This modal uses the password type auxiliary content. It displays a
        checkbox for "Remember me" and a link button for
        "Forgot password?" in a special password mode layout.
      </MznModal>
    `,
  }),
};

export const ExtendedSplit: StoryObj = {
  render: () => ({
    components: { MznButton, MznModal },
    setup: () => {
      const open = ref(false);
      const sidebarPosition = ref<'left' | 'right'>('right');

      return {
        extendedSplitLeftSideContent: h(
          'div',
          {
            style: {
              alignItems: 'center',
              backgroundColor: 'rgba(147, 127, 199, 0.1)',
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
              width: '100%',
            },
          },
          [
            h(
              MznTypography,
              { color: 'text-neutral', variant: 'body' },
              () => 'Left Side Content (Slot)',
            ),
          ],
        ),
        extendedSplitRightSideContent: h(
          'div',
          {
            style: {
              alignItems: 'center',
              backgroundColor: 'rgba(147, 127, 199, 0.1)',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
            },
          },
          [
            h(
              MznTypography,
              { color: 'text-neutral', variant: 'body' },
              () =>
                'Right Side Content (Slot) Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio id quibusdam quis similique vitae? A ab alias aperiam assumenda deleniti ducimus eligendi impedit magni obcaecati rerum? Ad aliquid amet blanditiis cum cumque dolor, ea eveniet exercitationem fugit hic id incidunt ipsam mollitia nemo porro qui quibusdam quisquam similique temporibus ullam, veniam voluptas voluptates voluptatum?',
            ),
          ],
        ),
        onClose: (): void => {
          open.value = false;
        },
        open,
        openWith: (position: 'left' | 'right'): void => {
          sidebarPosition.value = position;
          open.value = true;
        },
        sidebarPosition,
      };
    },
    template: `
      <div style="display: flex; gap: 8px">
        <MznButton variant="base-primary" @click="openWith('right')">Sidebar Right</MznButton>
        <MznButton variant="base-primary" @click="openWith('left')">Sidebar Left</MznButton>
      </div>
      <MznModal
        cancel-text="匯出 CSV"
        confirm-text="開始資料校正"
        :extended-split-left-side-content="extendedSplitLeftSideContent"
        :extended-split-right-side-content="extendedSplitRightSideContent"
        :extended-split-sidebar-position="sidebarPosition"
        modal-type="extendedSplit"
        :open="open"
        show-dismiss-button
        show-modal-footer
        show-modal-header
        size="wide"
        title="檢視專案"
        @cancel="onClose"
        @close="onClose"
        @confirm="onClose"
      />
    `,
  }),
};

export const BodySeparator: StoryObj = {
  render: () => ({
    components: { MznButton, MznModal },
    setup: () => {
      const openStandard = ref(false);
      const openExtended = ref(false);

      return {
        longBodyParagraphs: Array.from({ length: 12 }, (_, index) => index + 1),
        onCloseExtended: (): void => {
          openExtended.value = false;
        },
        onCloseStandard: (): void => {
          openStandard.value = false;
        },
        openExtended,
        openStandard,
      };
    },
    template: `
      <div style="display: flex; gap: 8px">
        <MznButton variant="base-primary" @click="openStandard = true">Scroll-based Separator</MznButton>
        <MznButton variant="base-primary" @click="openExtended = true">Extended (Always Visible)</MznButton>
      </div>

      <MznModal
        cancel-text="Cancel"
        confirm-text="Confirm"
        modal-type="standard"
        :open="openStandard"
        show-modal-footer
        show-modal-header
        size="regular"
        title="Scroll-based Separator"
        @cancel="onCloseStandard"
        @close="onCloseStandard"
        @confirm="onCloseStandard"
      >
        <p
          v-for="paragraph in longBodyParagraphs"
          :key="paragraph"
          style="margin: 0 0 12px"
        >Paragraph {{ paragraph }} — Lorem ipsum dolor sit amet, consectetur adipisicing
    elit. Dolorum illum neque soluta atque eum dolores placeat unde molestias
    exercitationem tempore perspiciatis quia porro sapiente vero impedit
    consequatur recusandae excepturi cumque.</p>
      </MznModal>

      <MznModal
        cancel-text="Cancel"
        confirm-text="Confirm"
        modal-type="extended"
        :open="openExtended"
        show-modal-footer
        show-modal-header
        size="regular"
        title="Extended (Always Visible)"
        @cancel="onCloseExtended"
        @close="onCloseExtended"
        @confirm="onCloseExtended"
      >
        Both separators are always visible in Extended Modal.
      </MznModal>
    `,
  }),
};

export const VerificationCodeInput: StoryObj = {
  render: () => ({
    components: { MznButton, MznModal, MznModalBodyForVerification },
    setup: () => {
      const open4Digit = ref(false);
      const open6Digit = ref(false);
      const code4 = ref('');
      const code6 = ref('');

      const onClose4Digit = (): void => {
        open4Digit.value = false;
        code4.value = '';
      };

      const onClose6Digit = (): void => {
        open6Digit.value = false;
        code6.value = '';
      };

      return {
        code4,
        code6,
        confirm4Digit: (): void => {
          if (code4.value.length === 4) {
            alert(`Verifying code: ${code4.value}`);
            onClose4Digit();
          } else {
            alert('Please enter the complete verification code');
          }
        },
        confirm6Digit: (): void => {
          if (code6.value.length === 6) {
            alert(`Verifying code: ${code6.value}`);
            onClose6Digit();
          } else {
            alert('Please enter the complete verification code');
          }
        },
        handleComplete: (value: string): void => {
          alert(`Verification code entered: ${value}`);
        },
        handleResend: (): void => {
          alert('Verification code has been resent to your email!');
        },
        onClose4Digit,
        onClose6Digit,
        open4Digit,
        open6Digit,
      };
    },
    template: `
      <div style="display: flex; gap: 8px">
        <MznButton variant="base-primary" @click="open4Digit = true">4-Digit Verification</MznButton>
        <MznButton variant="base-primary" @click="open6Digit = true">6-Digit Verification</MznButton>
      </div>

      <MznModal
        cancel-text="取消"
        confirm-text="驗證"
        show-status-type-icon
        supporting-text="請輸入我們寄送至您信箱的驗證碼"
        supporting-text-align="center"
        title="電子郵件驗證"
        title-align="center"
        modal-status-type="email"
        modal-type="verification"
        :open="open4Digit"
        show-modal-footer
        show-modal-header
        size="tight"
        @cancel="onClose4Digit"
        @close="onClose4Digit"
        @confirm="confirm4Digit"
      >
        <MznModalBodyForVerification
          :length="4"
          resend-prompt="收不到驗證碼？"
          resend-text="點此重新寄送"
          :value="code4"
          @change="code4 = $event"
          @complete="handleComplete"
          @resend="handleResend"
        />
      </MznModal>

      <MznModal
        cancel-text="取消"
        confirm-text="驗證"
        show-status-type-icon
        supporting-text="請輸入6位數驗證碼以完成雙重驗證"
        supporting-text-align="center"
        title="雙重驗證 (2FA)"
        title-align="center"
        modal-status-type="info"
        modal-type="verification"
        :open="open6Digit"
        show-modal-footer
        show-modal-header
        size="tight"
        @cancel="onClose6Digit"
        @close="onClose6Digit"
        @confirm="confirm6Digit"
      >
        <MznModalBodyForVerification
          :length="6"
          resend-prompt="沒收到驗證碼？"
          resend-text="重新傳送"
          :value="code6"
          @change="code6 = $event"
          @complete="handleComplete"
          @resend="handleResend"
        />
      </MznModal>
    `,
  }),
};

export const SaveSuccessWithCheckbox: StoryObj = {
  render: () => ({
    components: { MznButton, MznModal },
    setup: () => {
      const open = ref(false);
      const checked = ref(false);

      return {
        checked,
        onClose: (): void => {
          open.value = false;
        },
        open,
        setChecked: (next: boolean): void => {
          checked.value = next;
        },
      };
    },
    template: `
      <MznButton variant="base-primary" @click="open = true">open</MznButton>
      <MznModal
        :auxiliary-content-checked="checked"
        auxiliary-content-label="不再顯示此訊息"
        :auxiliary-content-on-change="setChecked"
        auxiliary-content-type="checkbox"
        cancel-text="繼續編輯"
        confirm-text="返回列表"
        modal-status-type="success"
        modal-type="standard"
        :open="open"
        show-dismiss-button
        show-modal-footer
        show-modal-header
        show-status-type-icon
        status-type-icon-layout="horizontal"
        supporting-text="變更已成功儲存，您可以繼續編輯或返回列表頁面。"
        title="儲存完成"
        @cancel="onClose"
        @close="onClose"
        @confirm="onClose"
      />
    `,
  }),
};
