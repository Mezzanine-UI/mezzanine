import { Component, computed, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznModal } from './modal.component';
import { MznModalBodyForVerification } from './modal-body-for-verification.component';
import { MznModalFooter } from './modal-footer.component';
import { MznModalHeader } from './modal-header.component';

const meta: Meta = {
  title: 'Feedback/Modal',
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MznButton,
        MznButtonGroup,
        MznModal,
        MznModalBodyForVerification,
        MznModalFooter,
        MznModalHeader,
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj;

@Component({
  selector: 'story-modal-playground',
  standalone: true,
  imports: [MznButton, MznModal, MznModalFooter, MznModalHeader],
  template: `
    <button mznButton variant="base-primary" (click)="open.set(true)"
      >open</button
    >
    <div
      mznModal
      [open]="open()"
      [disableCloseOnBackdropClick]="disableCloseOnBackdropClick"
      [disableCloseOnEscapeKeyDown]="disableCloseOnEscapeKeyDown"
      [fullScreen]="fullScreen"
      [loading]="loading"
      [modalStatusType]="modalStatusType"
      [modalType]="modalType"
      [showDismissButton]="showDismissButton"
      [showModalHeader]="showModalHeader"
      [showModalFooter]="showModalFooter"
      [size]="size"
      (closed)="open.set(false)"
    >
      <div
        mznModalHeader
        [title]="title"
        [supportingText]="supportingText"
        [showStatusTypeIcon]="showStatusTypeIcon"
        [statusTypeIconLayout]="statusTypeIconLayout"
        [titleAlign]="titleAlign"
        [supportingTextAlign]="supportingTextAlign"
      ></div>
      <div class="mzn-modal__body-container">
        <p>{{ body }}</p>
      </div>
      <div
        mznModalFooter
        [confirmText]="confirmText"
        [cancelText]="cancelText"
        [showCancelButton]="showCancelButton"
        [actionsButtonLayout]="actionsButtonLayout"
        [auxiliaryContentType]="auxiliaryContentType"
        [annotation]="annotation"
        [auxiliaryContentButtonText]="auxiliaryContentButtonText"
        [auxiliaryContentChecked]="auxiliaryContentChecked"
        [auxiliaryContentLabel]="auxiliaryContentLabel"
        [passwordButtonText]="passwordButtonText"
        [passwordChecked]="passwordChecked"
        [passwordCheckedLabel]="passwordCheckedLabel"
        (confirmed)="open.set(false)"
        (cancelled)="open.set(false)"
      ></div>
    </div>
  `,
})
class ModalPlaygroundComponent {
  readonly open = signal(false);
  @Input() actionsButtonLayout: 'fill' | 'fixed' = 'fixed';
  @Input() annotation = 'Annotation text';
  @Input() auxiliaryContentButtonText = 'Reset';
  @Input() auxiliaryContentChecked = false;
  @Input() auxiliaryContentLabel = 'Control label';
  @Input() auxiliaryContentType:
    | 'annotation'
    | 'button'
    | 'checkbox'
    | 'password'
    | 'toggle'
    | undefined;
  @Input() body =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum illum neque soluta atque. Eum dolores placeat unde, molestias exercitationem tempore perspiciatis quia porro sapiente vero impedit consequatur recusandae excepturi cumque.';
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() disableCloseOnBackdropClick = false;
  @Input() disableCloseOnEscapeKeyDown = false;
  @Input() fullScreen = false;
  @Input() loading = false;
  @Input() modalStatusType:
    | 'info'
    | 'error'
    | 'warning'
    | 'success'
    | 'email'
    | 'delete' = 'info';
  @Input() modalType:
    | 'standard'
    | 'extended'
    | 'extendedSplit'
    | 'verification' = 'standard';
  @Input() passwordButtonText = 'Forgot password?';
  @Input() passwordChecked = false;
  @Input() passwordCheckedLabel = 'Remember me';
  @Input() showCancelButton = true;
  @Input() showDismissButton = true;
  @Input() showModalFooter = true;
  @Input() showModalHeader = true;
  @Input() showStatusTypeIcon = false;
  @Input() size: 'tight' | 'narrow' | 'regular' | 'wide' = 'regular';
  @Input() statusTypeIconLayout: 'vertical' | 'horizontal' = 'vertical';
  @Input() supportingText = 'This is a supporting text';
  @Input() supportingTextAlign: 'left' | 'center' = 'left';
  @Input() title = 'Title';
  @Input() titleAlign: 'left' | 'center' = 'left';
}

export const Playground: Story = {
  argTypes: {
    actionsButtonLayout: {
      control: { type: 'select' },
      options: ['fixed', 'fill'],
      description: 'Layout of action buttons.',
      table: {
        type: { summary: "'fixed' | 'fill'" },
        defaultValue: { summary: "'fixed'" },
      },
    },
    auxiliaryContentType: {
      control: { type: 'select' },
      options: [
        undefined,
        'annotation',
        'button',
        'checkbox',
        'toggle',
        'password',
      ],
      description: 'Type of auxiliary content in footer.',
      table: {
        type: {
          summary:
            "'annotation' | 'button' | 'checkbox' | 'toggle' | 'password'",
        },
        defaultValue: { summary: '-' },
      },
    },
    disableCloseOnBackdropClick: {
      control: { type: 'boolean' },
      description: 'Whether to disable closing on backdrop click.',
      table: { defaultValue: { summary: 'false' } },
    },
    disableCloseOnEscapeKeyDown: {
      control: { type: 'boolean' },
      description: 'Whether to disable closing on Escape key.',
      table: { defaultValue: { summary: 'false' } },
    },
    fullScreen: {
      control: { type: 'boolean' },
      description: 'Whether to force full screen.',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the modal is loading.',
      table: { defaultValue: { summary: 'false' } },
    },
    modalStatusType: {
      control: { type: 'select' },
      options: ['info', 'error', 'warning', 'success', 'email', 'delete'],
      description: 'Modal status type for icon display.',
      table: {
        type: {
          summary:
            "'info' | 'error' | 'warning' | 'success' | 'email' | 'delete'",
        },
        defaultValue: { summary: "'info'" },
      },
    },
    modalType: {
      control: { type: 'select' },
      options: ['standard', 'extended', 'extendedSplit', 'verification'],
      description: 'Modal layout type.',
      table: {
        type: {
          summary: "'standard' | 'extended' | 'extendedSplit' | 'verification'",
        },
        defaultValue: { summary: "'standard'" },
      },
    },
    showCancelButton: {
      control: { type: 'boolean' },
      description: 'Whether to show cancel button.',
      table: { defaultValue: { summary: 'true' } },
    },
    showDismissButton: {
      control: { type: 'boolean' },
      description: 'Whether to show dismiss (X) button.',
      table: { defaultValue: { summary: 'true' } },
    },
    showModalFooter: {
      control: { type: 'boolean' },
      description: 'Whether to show modal footer.',
      table: { defaultValue: { summary: 'false' } },
    },
    showModalHeader: {
      control: { type: 'boolean' },
      description: 'Whether to show modal header.',
      table: { defaultValue: { summary: 'false' } },
    },
    showStatusTypeIcon: {
      control: { type: 'boolean' },
      description: 'Whether to show status type icon.',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['tight', 'narrow', 'regular', 'wide'],
      description: 'Modal size.',
      table: {
        type: { summary: "'tight' | 'narrow' | 'regular' | 'wide'" },
        defaultValue: { summary: "'regular'" },
      },
    },
    statusTypeIconLayout: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Icon layout direction.',
      table: {
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: "'vertical'" },
      },
    },
    supportingTextAlign: {
      control: { type: 'select' },
      options: ['left', 'center'],
      description: 'Supporting text alignment.',
      table: {
        type: { summary: "'left' | 'center'" },
        defaultValue: { summary: "'left'" },
      },
    },
    titleAlign: {
      control: { type: 'select' },
      options: ['left', 'center'],
      description: 'Title alignment.',
      table: {
        type: { summary: "'left' | 'center'" },
        defaultValue: { summary: "'left'" },
      },
    },
  },
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
  decorators: [moduleMetadata({ imports: [ModalPlaygroundComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <story-modal-playground
        [actionsButtonLayout]="actionsButtonLayout"
        [annotation]="annotation"
        [auxiliaryContentButtonText]="auxiliaryContentButtonText"
        [auxiliaryContentChecked]="auxiliaryContentChecked"
        [auxiliaryContentLabel]="auxiliaryContentLabel"
        [auxiliaryContentType]="auxiliaryContentType"
        [body]="body"
        [cancelText]="cancelText"
        [confirmText]="confirmText"
        [disableCloseOnBackdropClick]="disableCloseOnBackdropClick"
        [disableCloseOnEscapeKeyDown]="disableCloseOnEscapeKeyDown"
        [fullScreen]="fullScreen"
        [loading]="loading"
        [modalStatusType]="modalStatusType"
        [modalType]="modalType"
        [passwordButtonText]="passwordButtonText"
        [passwordChecked]="passwordChecked"
        [passwordCheckedLabel]="passwordCheckedLabel"
        [showCancelButton]="showCancelButton"
        [showDismissButton]="showDismissButton"
        [showModalFooter]="showModalFooter"
        [showModalHeader]="showModalHeader"
        [showStatusTypeIcon]="showStatusTypeIcon"
        [size]="size"
        [statusTypeIconLayout]="statusTypeIconLayout"
        [supportingText]="supportingText"
        [supportingTextAlign]="supportingTextAlign"
        [title]="title"
        [titleAlign]="titleAlign"
      />
    `,
  }),
};

export const ModalHeaderStatusTypes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      openInfo: signal(false),
      openError: signal(false),
      openWarning: signal(false),
      openSuccess: signal(false),
      openEmail: signal(false),
      openDelete: signal(false),
    },
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button mznButton variant="base-primary" (click)="openInfo.set(true)">Info</button>
        <button mznButton variant="base-primary" (click)="openError.set(true)">Error</button>
        <button mznButton variant="base-primary" (click)="openWarning.set(true)">Warning</button>
        <button mznButton variant="base-primary" (click)="openSuccess.set(true)">Success</button>
        <button mznButton variant="base-primary" (click)="openEmail.set(true)">Email</button>
        <button mznButton variant="base-primary" (click)="openDelete.set(true)">Delete</button>
      </div>

      <div mznModal
        [open]="openInfo()"
        modalStatusType="info"
        modalType="standard"
        [showModalHeader]="true"
        [showModalFooter]="true"
        (closed)="openInfo.set(false)"
      >
        <div mznModalHeader
          title="Information"
          supportingText="This is an informational message"
          [showStatusTypeIcon]="true"
        ></div>
        <div mznModalFooter
          confirmText="OK"
          cancelText="Close"
          (confirmed)="openInfo.set(false)"
          (cancelled)="openInfo.set(false)"
        ></div>
      </div>

      <div mznModal
        [open]="openError()"
        modalStatusType="error"
        modalType="standard"
        [showModalHeader]="true"
        [showModalFooter]="true"
        (closed)="openError.set(false)"
      >
        <div mznModalHeader
          title="Error"
          supportingText="An error has occurred during the operation"
          [showStatusTypeIcon]="true"
        ></div>
        <div mznModalFooter
          confirmText="OK"
          cancelText="Close"
          (confirmed)="openError.set(false)"
          (cancelled)="openError.set(false)"
        ></div>
      </div>

      <div mznModal
        [open]="openWarning()"
        modalStatusType="warning"
        modalType="standard"
        [showModalHeader]="true"
        [showModalFooter]="true"
        (closed)="openWarning.set(false)"
      >
        <div mznModalHeader
          title="Warning"
          supportingText="Please proceed with caution"
          [showStatusTypeIcon]="true"
        ></div>
        <div mznModalFooter
          confirmText="OK"
          cancelText="Close"
          (confirmed)="openWarning.set(false)"
          (cancelled)="openWarning.set(false)"
        ></div>
      </div>

      <div mznModal
        [open]="openSuccess()"
        modalStatusType="success"
        modalType="standard"
        [showModalHeader]="true"
        [showModalFooter]="true"
        (closed)="openSuccess.set(false)"
      >
        <div mznModalHeader
          title="Success"
          supportingText="Operation completed successfully"
          [showStatusTypeIcon]="true"
        ></div>
        <div mznModalFooter
          confirmText="OK"
          cancelText="Close"
          (confirmed)="openSuccess.set(false)"
          (cancelled)="openSuccess.set(false)"
        ></div>
      </div>

      <div mznModal
        [open]="openEmail()"
        modalStatusType="email"
        modalType="standard"
        [showModalHeader]="true"
        [showModalFooter]="true"
        (closed)="openEmail.set(false)"
      >
        <div mznModalHeader
          title="Email Notification"
          supportingText="You have new messages in your inbox"
          [showStatusTypeIcon]="true"
        ></div>
        <div mznModalFooter
          confirmText="OK"
          cancelText="Close"
          (confirmed)="openEmail.set(false)"
          (cancelled)="openEmail.set(false)"
        ></div>
      </div>

      <div mznModal
        [open]="openDelete()"
        modalStatusType="delete"
        modalType="standard"
        [showModalHeader]="true"
        [showModalFooter]="true"
        (closed)="openDelete.set(false)"
      >
        <div mznModalHeader
          title="Delete Confirmation"
          supportingText="This action cannot be undone"
          [showStatusTypeIcon]="true"
        ></div>
        <div mznModalFooter
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonVariant="destructive-primary"
          (confirmed)="openDelete.set(false)"
          (cancelled)="openDelete.set(false)"
        ></div>
      </div>
    `,
  }),
};

export const ModalHeaderCombinations: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      openIndex: signal<number | null>(null),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <p style="margin: 0 0 8px;">No Icon</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button mznButton variant="base-primary" (click)="openIndex.set(0)">Title</button>
            <button mznButton variant="base-primary" (click)="openIndex.set(1)">Title (Center)</button>
            <button mznButton variant="base-primary" (click)="openIndex.set(2)">Title + Supporting</button>
            <button mznButton variant="base-primary" (click)="openIndex.set(3)">Both Center</button>
          </div>
        </div>
        <div>
          <p style="margin: 0 0 8px;">Vertical Icon</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button mznButton variant="base-primary" (click)="openIndex.set(4)">Title</button>
            <button mznButton variant="base-primary" (click)="openIndex.set(5)">Title (Center)</button>
            <button mznButton variant="base-primary" (click)="openIndex.set(6)">Title + Supporting</button>
            <button mznButton variant="base-primary" (click)="openIndex.set(7)">Both Center</button>
          </div>
        </div>
        <div>
          <p style="margin: 0 0 8px;">Horizontal Icon</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button mznButton variant="base-primary" (click)="openIndex.set(8)">Title</button>
            <button mznButton variant="base-primary" (click)="openIndex.set(9)">Title + Supporting</button>
          </div>
        </div>
      </div>

      <!-- No Icon -->
      <div mznModal [open]="openIndex() === 0" modalType="standard" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Title Only" ></div>
        <div class="mzn-modal__body-container"><p>Modal body content.</p></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <div mznModal [open]="openIndex() === 1" modalType="standard" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Title Only (Center)" titleAlign="center" ></div>
        <div class="mzn-modal__body-container"><p>Modal body content.</p></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <div mznModal [open]="openIndex() === 2" modalType="standard" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Title + Supporting" supportingText="Supporting text displayed below the title." ></div>
        <div class="mzn-modal__body-container"><p>Modal body content.</p></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <div mznModal [open]="openIndex() === 3" modalType="standard" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Both Center" titleAlign="center" supportingText="Supporting text aligned center." supportingTextAlign="center" ></div>
        <div class="mzn-modal__body-container"><p>Modal body content.</p></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <!-- Vertical Icon -->
      <div mznModal [open]="openIndex() === 4" modalType="standard" modalStatusType="info" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Vertical Icon" [showStatusTypeIcon]="true" ></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <div mznModal [open]="openIndex() === 5" modalType="standard" modalStatusType="info" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Vertical Icon (Center)" titleAlign="center" [showStatusTypeIcon]="true" ></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <div mznModal [open]="openIndex() === 6" modalType="standard" modalStatusType="info" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Vertical Icon + Supporting" supportingText="Supporting text displayed below the title." [showStatusTypeIcon]="true" ></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <div mznModal [open]="openIndex() === 7" modalType="standard" modalStatusType="info" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Vertical Icon + Both Center" titleAlign="center" supportingText="Supporting text aligned center." supportingTextAlign="center" [showStatusTypeIcon]="true" ></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <!-- Horizontal Icon -->
      <div mznModal [open]="openIndex() === 8" modalType="standard" modalStatusType="info" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Horizontal Icon" [showStatusTypeIcon]="true" statusTypeIconLayout="horizontal" ></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>

      <div mznModal [open]="openIndex() === 9" modalType="standard" modalStatusType="info" [showModalHeader]="true" [showModalFooter]="true" (closed)="openIndex.set(null)">
        <div mznModalHeader title="Horizontal Icon + Supporting" supportingText="Supporting text displayed below the title." [showStatusTypeIcon]="true" statusTypeIconLayout="horizontal" ></div>
        <div mznModalFooter
          confirmText="OK"
          [showCancelButton]="false"
          (confirmed)="openIndex.set(null)"
        ></div>
      </div>
    `,
  }),
};

export const ModalFooterButtonLayout: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      openFixed: signal(false),
      openFill: signal(false),
    },
    template: `
      <div style="display: flex; gap: 8px;">
        <button mznButton variant="base-primary" (click)="openFixed.set(true)">Fixed Layout (Default)</button>
        <button mznButton variant="base-primary" (click)="openFill.set(true)">Fill Layout</button>
      </div>

      <div mznModal [open]="openFixed()" modalType="standard" size="regular" [showModalHeader]="true" [showModalFooter]="true" (closed)="openFixed.set(false)">
        <div mznModalHeader title="Fixed Layout" ></div>
        <div class="mzn-modal__body-container">
          <p>This modal uses fixed width buttons (default behavior). The buttons maintain a consistent width.</p>
        </div>
        <div mznModalFooter
          actionsButtonLayout="fixed"
          confirmText="Confirm"
          cancelText="Cancel"
          (confirmed)="openFixed.set(false)"
          (cancelled)="openFixed.set(false)"
        ></div>
      </div>

      <div mznModal [open]="openFill()" modalType="standard" size="regular" [showModalHeader]="true" [showModalFooter]="true" (closed)="openFill.set(false)">
        <div mznModalHeader title="Fill Layout" ></div>
        <div class="mzn-modal__body-container">
          <p>This modal uses fill layout. The buttons expand to fill the available space equally. Note: This only works when there is no control on the left side.</p>
        </div>
        <div mznModalFooter
          actionsButtonLayout="fill"
          confirmText="Confirm"
          cancelText="Cancel"
          (confirmed)="openFill.set(false)"
          (cancelled)="openFill.set(false)"
        ></div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-modal-footer-with-password',
  standalone: true,
  imports: [MznButton, MznModal, MznModalFooter, MznModalHeader],
  template: `
    <button mznButton variant="base-primary" (click)="open.set(true)"
      >Login Modal</button
    >
    <div
      mznModal
      [open]="open()"
      modalType="standard"
      [showModalHeader]="true"
      [showModalFooter]="true"
      (closed)="open.set(false)"
    >
      <div mznModalHeader title="Login"></div>
      <div class="mzn-modal__body-container">
        <p
          >This modal uses the password type auxiliary content. It displays a
          checkbox for "Remember me" and a link button for "Forgot password?" in
          a special password mode layout.</p
        >
      </div>
      <div
        mznModalFooter
        auxiliaryContentType="password"
        confirmText="Login"
        cancelText="Cancel"
        [passwordChecked]="rememberMe()"
        passwordCheckedLabel="Remember me"
        passwordButtonText="Forgot password?"
        (passwordCheckedChanged)="rememberMe.set($event)"
        (passwordClicked)="onForgotPassword()"
        (confirmed)="onLogin()"
        (cancelled)="open.set(false)"
      ></div>
    </div>
  `,
})
class ModalFooterWithPasswordComponent {
  readonly open = signal(false);
  readonly rememberMe = signal(false);

  onForgotPassword(): void {
    alert('Forgot password clicked!');
  }

  onLogin(): void {
    this.open.set(false);
  }
}

export const ModalFooterWithPassword: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [ModalFooterWithPasswordComponent],
    }),
  ],
  render: () => ({
    template: `<story-modal-footer-with-password />`,
  }),
};

@Component({
  selector: 'story-extended-split',
  standalone: true,
  imports: [MznButton, MznModal, MznModalFooter, MznModalHeader],
  template: `
    <div style="display: flex; gap: 8px;">
      <button mznButton variant="base-primary" (click)="openRight()"
        >Sidebar Right</button
      >
      <button mznButton variant="base-primary" (click)="openLeft()"
        >Sidebar Left</button
      >
    </div>
    <div
      mznModal
      [open]="open()"
      modalType="extendedSplit"
      size="wide"
      [showDismissButton]="true"
      [showModalHeader]="true"
      [showModalFooter]="true"
      (closed)="open.set(false)"
    >
      <div mznModalHeader title="檢視專案"></div>
      <div [class]="splitContainerClasses()">
        <div class="mzn-modal__body-container__extended-split-right">
          <div
            style="align-items: center; display: flex; justify-content: center; min-height: 200px; width: 150px;"
          >
            <span>Right Side Content (Slot)</span>
          </div>
        </div>
        <div class="mzn-modal__body-container__extended-split-left">
          <div class="mzn-modal__body-container__extended-split-left__content">
            <div
              style="align-items: center; display: flex; justify-content: center; min-height: 200px;"
            >
              <span>Left Side Content (Slot)</span>
            </div>
          </div>
          <div
            mznModalFooter
            confirmText="開始資料校正"
            cancelText="匯出 CSV"
            (confirmed)="open.set(false)"
            (cancelled)="open.set(false)"
          ></div>
        </div>
      </div>
    </div>
  `,
})
class ExtendedSplitComponent {
  readonly open = signal(false);
  readonly sidebarPosition = signal<'left' | 'right'>('right');

  readonly splitContainerClasses = computed((): string => {
    const base = 'mzn-modal__body-container__extended-split';

    return this.sidebarPosition() === 'left'
      ? `${base} ${base}--sidebar-left`
      : base;
  });

  openRight(): void {
    this.sidebarPosition.set('right');
    this.open.set(true);
  }

  openLeft(): void {
    this.sidebarPosition.set('left');
    this.open.set(true);
  }
}

export const ExtendedSplit: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [ExtendedSplitComponent],
    }),
  ],
  render: () => ({
    template: `<story-extended-split />`,
  }),
};

export const BodySeparator: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      openStandard: signal(false),
      openExtended: signal(false),
      longBodyParagraphs: Array.from(
        { length: 12 },
        (_, i) =>
          `Paragraph ${i + 1} — Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum illum neque soluta atque eum dolores placeat unde molestias exercitationem tempore perspiciatis quia porro sapiente vero impedit consequatur recusandae excepturi cumque.`,
      ),
    },
    template: `
      <div style="display: flex; gap: 8px;">
        <button mznButton variant="base-primary" (click)="openStandard.set(true)">Scroll-based Separator</button>
        <button mznButton variant="base-primary" (click)="openExtended.set(true)">Extended (Always Visible)</button>
      </div>

      <div mznModal [open]="openStandard()" modalType="standard" size="regular" [showModalHeader]="true" [showModalFooter]="true" (closed)="openStandard.set(false)">
        <div mznModalHeader title="Scroll-based Separator" ></div>
        <div class="mzn-modal__body-container">
          @for (p of longBodyParagraphs; track $index) {
            <p style="margin: 0 0 12px;">{{ p }}</p>
          }
        </div>
        <div mznModalFooter
          confirmText="Confirm"
          cancelText="Cancel"
          (confirmed)="openStandard.set(false)"
          (cancelled)="openStandard.set(false)"
        ></div>
      </div>

      <div mznModal [open]="openExtended()" modalType="extended" size="regular" [showModalHeader]="true" [showModalFooter]="true" (closed)="openExtended.set(false)">
        <div mznModalHeader title="Extended (Always Visible)" ></div>
        <div class="mzn-modal__body-container">
          <p>Both separators are always visible in Extended Modal.</p>
        </div>
        <div mznModalFooter
          confirmText="Confirm"
          cancelText="Cancel"
          (confirmed)="openExtended.set(false)"
          (cancelled)="openExtended.set(false)"
        ></div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-verification-code-input',
  standalone: true,
  imports: [
    MznButton,
    MznModal,
    MznModalBodyForVerification,
    MznModalFooter,
    MznModalHeader,
  ],
  template: `
    <div style="display: flex; gap: 8px;">
      <button mznButton variant="base-primary" (click)="open4Digit.set(true)"
        >4-Digit Verification</button
      >
      <button mznButton variant="base-primary" (click)="open6Digit.set(true)"
        >6-Digit Verification</button
      >
    </div>

    <div
      mznModal
      [open]="open4Digit()"
      modalType="verification"
      modalStatusType="email"
      size="tight"
      [showModalHeader]="true"
      [showModalFooter]="true"
      (closed)="onClose4()"
    >
      <div
        mznModalHeader
        title="電子郵件驗證"
        titleAlign="center"
        supportingText="請輸入我們寄送至您信箱的驗證碼"
        supportingTextAlign="center"
        [showStatusTypeIcon]="true"
      ></div>
      <div
        mznModalBodyForVerification
        [length]="4"
        [value]="code4()"
        resendPrompt="收不到驗證碼？"
        resendText="點此重新寄送"
        (valueChange)="code4.set($event)"
        (completed)="onComplete4($event)"
        (resent)="onResend()"
      ></div>
      <div
        mznModalFooter
        confirmText="驗證"
        cancelText="取消"
        (confirmed)="onVerify4()"
        (cancelled)="onClose4()"
      ></div>
    </div>

    <div
      mznModal
      [open]="open6Digit()"
      modalType="verification"
      modalStatusType="info"
      size="tight"
      [showModalHeader]="true"
      [showModalFooter]="true"
      (closed)="onClose6()"
    >
      <div
        mznModalHeader
        title="雙重驗證 (2FA)"
        titleAlign="center"
        supportingText="請輸入6位數驗證碼以完成雙重驗證"
        supportingTextAlign="center"
        [showStatusTypeIcon]="true"
      ></div>
      <div
        mznModalBodyForVerification
        [length]="6"
        [value]="code6()"
        resendPrompt="沒收到驗證碼？"
        resendText="重新傳送"
        (valueChange)="code6.set($event)"
        (completed)="onComplete6($event)"
        (resent)="onResend()"
      ></div>
      <div
        mznModalFooter
        confirmText="驗證"
        cancelText="取消"
        (confirmed)="onVerify6()"
        (cancelled)="onClose6()"
      ></div>
    </div>
  `,
})
class VerificationCodeInputComponent {
  readonly open4Digit = signal(false);
  readonly open6Digit = signal(false);
  readonly code4 = signal('');
  readonly code6 = signal('');

  onClose4(): void {
    this.open4Digit.set(false);
    this.code4.set('');
  }

  onClose6(): void {
    this.open6Digit.set(false);
    this.code6.set('');
  }

  onComplete4(value: string): void {
    alert(`Verification code entered: ${value}`);
  }

  onComplete6(value: string): void {
    alert(`Verification code entered: ${value}`);
  }

  onVerify4(): void {
    if (this.code4().length === 4) {
      alert(`Verifying code: ${this.code4()}`);
      this.onClose4();
    } else {
      alert('Please enter the complete verification code');
    }
  }

  onVerify6(): void {
    if (this.code6().length === 6) {
      alert(`Verifying code: ${this.code6()}`);
      this.onClose6();
    } else {
      alert('Please enter the complete verification code');
    }
  }

  onResend(): void {
    alert('Verification code has been resent to your email!');
  }
}

export const VerificationCodeInput: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [VerificationCodeInputComponent],
    }),
  ],
  render: () => ({
    template: `<story-verification-code-input />`,
  }),
};

@Component({
  selector: 'story-save-success-with-checkbox',
  standalone: true,
  imports: [MznButton, MznModal, MznModalFooter, MznModalHeader],
  template: `
    <button mznButton variant="base-primary" (click)="open.set(true)"
      >open</button
    >
    <div
      mznModal
      [open]="open()"
      modalType="standard"
      modalStatusType="success"
      [showDismissButton]="true"
      [showModalHeader]="true"
      [showModalFooter]="true"
      (closed)="open.set(false)"
    >
      <div
        mznModalHeader
        title="儲存完成"
        supportingText="變更已成功儲存，您可以繼續編輯或返回列表頁面。"
        [showStatusTypeIcon]="true"
        statusTypeIconLayout="horizontal"
      ></div>
      <div
        mznModalFooter
        auxiliaryContentType="checkbox"
        [auxiliaryContentChecked]="checked()"
        auxiliaryContentLabel="不再顯示此訊息"
        confirmText="返回列表"
        cancelText="繼續編輯"
        (auxiliaryContentChanged)="checked.set($event)"
        (confirmed)="open.set(false)"
        (cancelled)="open.set(false)"
      ></div>
    </div>
  `,
})
class SaveSuccessWithCheckboxComponent {
  readonly open = signal(false);
  readonly checked = signal(false);
}

export const SaveSuccessWithCheckbox: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [SaveSuccessWithCheckboxComponent],
    }),
  ],
  render: () => ({
    template: `<story-save-success-with-checkbox />`,
  }),
};
