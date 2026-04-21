import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznDrawer } from '@mezzanine-ui/ng/drawer';
import {
  MznModal,
  MznModalBodyContainer,
  MznModalFooter,
  MznModalHeader,
} from '@mezzanine-ui/ng/modal';
import { MznSelect } from '@mezzanine-ui/ng/select';
import { MznSpin } from '@mezzanine-ui/ng/spin';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznBackdrop } from './backdrop.component';
import { MznButton } from '../button/button.directive';

export default {
  title: 'Others/Backdrop',
  decorators: [
    moduleMetadata({
      imports: [MznBackdrop, MznButton, BrowserAnimationsModule],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

@Component({
  selector: '[storyBackdropDarkVariant]',
  standalone: true,
  imports: [MznBackdrop, MznButton, MznTypography],
  host: { style: 'display: block;' },
  template: `
    <div style="margin-bottom: 16px;">
      <p mznTypography color="text-neutral" variant="body">
        📌 Try scrolling the page before and after opening the backdrop to see
        the scroll lock in action!
      </p>
    </div>
    <button mznButton variant="base-primary" (click)="open.set(true)">
      Open Dark Backdrop
    </button>
    <!-- Scrollable content to demonstrate scroll lock -->
    <div
      style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;"
    >
      @for (item of scrollItems; track $index) {
        <div
          style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px;"
        >
          <p mznTypography variant="body">
            Scrollable content item {{ $index + 1 }} - This page has enough
            content to scroll. When the backdrop opens, scrolling will be
            locked.
          </p>
        </div>
      }
    </div>
    <div
      mznBackdrop
      [open]="open()"
      variant="dark"
      (backdropClick)="open.set(false)"
      (closed)="open.set(false)"
    >
      @if (open()) {
        <div
          style="background: var(--mzn-color-background-base); border-radius: 8px; display: flex; flex-direction: column; gap: 16px; margin: auto; max-width: 400px; padding: 24px; position: relative; top: 50%; transform: translateY(-50%);"
        >
          <h3 mznTypography color="text-brand" variant="h3">
            Dark Variant Modal
          </h3>
          <p mznTypography variant="body">
            This is a modal with dark backdrop. Notice the background page
            cannot be scrolled while this is open. Click outside or the button
            to close.
          </p>
          <button mznButton variant="base-primary" (click)="open.set(false)">
            Close
          </button>
        </div>
      }
    </div>
  `,
})
class BackdropDarkVariantComponent {
  readonly open = signal(false);
  readonly scrollItems = Array.from({ length: 20 });
}

export const DarkVariant: Story = {
  decorators: [moduleMetadata({ imports: [BackdropDarkVariantComponent] })],
  render: () => ({
    template: `<div storyBackdropDarkVariant></div>`,
  }),
};

@Component({
  selector: '[storyBackdropLightVariant]',
  standalone: true,
  imports: [MznBackdrop, MznButton, MznSpin, MznTypography],
  host: { style: 'display: block;' },
  template: `
    <div style="margin-bottom: 16px;">
      <p mznTypography color="text-neutral" variant="body">
        💡 Light variant is commonly used for loading states (like Spin
        component)
      </p>
    </div>
    <button mznButton variant="base-primary" (click)="open.set(true)">
      Open Light Backdrop
    </button>
    <!-- Scrollable content to demonstrate scroll lock -->
    <div
      style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;"
    >
      @for (item of scrollItems; track $index) {
        <div
          style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px;"
        >
          <p mznTypography variant="body">
            Scrollable content item {{ $index + 1 }} - Background scroll is
            locked when backdrop is open.
          </p>
        </div>
      }
    </div>
    <div
      mznBackdrop
      [open]="open()"
      variant="light"
      (backdropClick)="open.set(false)"
      (closed)="open.set(false)"
    >
      @if (open()) {
        <div
          style="align-items: center; display: flex; flex-direction: column; gap: 24px; justify-content: center;"
        >
          <div mznSpin [loading]="true"></div>
          <div
            style="background: var(--mzn-color-background-base); border-radius: 8px; padding: 24px; text-align: center;"
          >
            <h3 mznTypography color="text-brand" variant="h3">
              Light Variant Loading
            </h3>
            <p
              mznTypography
              color="text-neutral"
              variant="body"
              style="margin-top: 8px;"
            >
              Perfect for loading overlays and component-level blocking states
            </p>
          </div>
          <button mznButton variant="base-primary" (click)="open.set(false)">
            Close
          </button>
        </div>
      }
    </div>
  `,
})
class BackdropLightVariantComponent {
  readonly open = signal(false);
  readonly scrollItems = Array.from({ length: 15 });
}

export const LightVariant: Story = {
  decorators: [moduleMetadata({ imports: [BackdropLightVariantComponent] })],
  render: () => ({
    template: `<div storyBackdropLightVariant></div>`,
  }),
};

@Component({
  selector: '[storyBackdropCustomContainer]',
  standalone: true,
  imports: [MznBackdrop, MznButton, MznTypography],
  host: { style: 'display: flex; flex-direction: column; gap: 16px;' },
  template: `
    <button mznButton variant="base-primary" (click)="open.set(true)">
      Open Backdrop in Container
    </button>
    <div
      #container
      style="background: var(--mzn-color-background-base); border: 2px dashed var(--mzn-color-border-neutral); border-radius: 8px; min-height: 300px; padding: 16px; position: relative; width: 100%;"
    >
      <div style="padding: 24px;">
        <p mznTypography variant="body">
          Container Element (Backdrop will be rendered inside this)
        </p>
      </div>
      <div
        mznBackdrop
        [container]="container"
        [open]="open()"
        variant="dark"
        (backdropClick)="open.set(false)"
      >
        @if (open()) {
          <div
            style="align-items: center; display: flex; flex-direction: column; gap: 16px; justify-content: center;"
          >
            <div
              style="background: var(--mzn-color-background-base); border-radius: 8px; padding: 24px; text-align: center;"
            >
              <h3 mznTypography color="text-brand" variant="h3">
                Container Backdrop
              </h3>
              <p
                mznTypography
                color="text-neutral"
                variant="body"
                style="margin-top: 8px;"
              >
                This overlay is scoped to the container element above
              </p>
            </div>
            <button mznButton variant="base-primary" (click)="open.set(false)">
              Close
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
class BackdropCustomContainerComponent {
  readonly open = signal(false);
}

export const CustomContainer: Story = {
  decorators: [moduleMetadata({ imports: [BackdropCustomContainerComponent] })],
  render: () => ({
    template: `<div storyBackdropCustomContainer></div>`,
  }),
};

@Component({
  selector: '[storyBackdropDisableScrollLock]',
  standalone: true,
  imports: [MznBackdrop, MznButton, MznTypography],
  host: { style: 'display: block;' },
  template: `
    <div style="margin-bottom: 16px;">
      <p mznTypography color="text-neutral" variant="body">
        ⚠️ With disableScrollLock=true, you can still scroll the background page
      </p>
    </div>
    <button mznButton variant="base-primary" (click)="open.set(true)">
      Open Without Scroll Lock
    </button>
    <!-- Scrollable content to demonstrate scroll lock is disabled -->
    <div
      style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;"
    >
      @for (item of scrollItems; track $index) {
        <div
          style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px;"
        >
          <p mznTypography variant="body">
            Scrollable content item {{ $index + 1 }} - You can scroll this even
            when backdrop is open!
          </p>
        </div>
      }
    </div>
    <div
      mznBackdrop
      [open]="open()"
      variant="dark"
      [disableScrollLock]="true"
      (backdropClick)="open.set(false)"
      (closed)="open.set(false)"
    >
      @if (open()) {
        <div
          style="background: var(--mzn-color-background-base); border-radius: 8px; display: flex; flex-direction: column; gap: 16px; margin: auto; max-width: 400px; padding: 24px; position: relative; top: 50%; transform: translateY(-50%);"
        >
          <h3 mznTypography color="text-brand" variant="h3">
            Scroll Lock Disabled
          </h3>
          <p mznTypography variant="body">
            Try scrolling the page - it still works! This is useful for
            scenarios where you want to allow background interaction.
          </p>
          <button mznButton variant="base-primary" (click)="open.set(false)">
            Close
          </button>
        </div>
      }
    </div>
  `,
})
class BackdropDisableScrollLockComponent {
  readonly open = signal(false);
  readonly scrollItems = Array.from({ length: 20 });
}

export const DisableScrollLock: Story = {
  decorators: [
    moduleMetadata({ imports: [BackdropDisableScrollLockComponent] }),
  ],
  render: () => ({
    template: `<div storyBackdropDisableScrollLock></div>`,
  }),
};

@Component({
  selector: '[storyBackdropDisablePortal]',
  standalone: true,
  imports: [MznBackdrop, MznButton, MznTypography],
  host: { style: 'display: flex; flex-direction: column; gap: 16px;' },
  template: `
    <button mznButton variant="base-primary" (click)="open.set(!open())">
      Toggle Backdrop (No Portal)
    </button>
    <div
      style="background: var(--mzn-color-background-base); border: 2px dashed var(--mzn-color-border-neutral); border-radius: 8px; height: 300px; overflow: hidden; padding: 16px; position: relative; width: 100%;"
    >
      <p mznTypography variant="body">Parent Element (overflow: hidden)</p>
      <div
        mznBackdrop
        [open]="open()"
        variant="dark"
        [disablePortal]="true"
        (backdropClick)="open.set(false)"
      >
        @if (open()) {
          <div
            style="align-items: center; display: flex; flex-direction: column; gap: 16px; justify-content: center;"
          >
            <div
              style="background: var(--mzn-color-background-base); border-radius: 8px; padding: 24px; text-align: center;"
            >
              <h3 mznTypography color="text-brand" variant="h3">No Portal</h3>
              <p
                mznTypography
                color="text-neutral"
                variant="body"
                style="margin-top: 8px;"
              >
                Rendered in normal DOM flow, respects parent overflow
              </p>
            </div>
            <button mznButton variant="base-primary" (click)="open.set(false)">
              Close
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
class BackdropDisablePortalComponent {
  readonly open = signal(false);
}

export const DisablePortal: Story = {
  decorators: [moduleMetadata({ imports: [BackdropDisablePortalComponent] })],
  render: () => ({
    template: `<div storyBackdropDisablePortal></div>`,
  }),
};

@Component({
  selector: '[storyBackdropDrawerModalSelect]',
  standalone: true,
  imports: [
    FormsModule,
    MznButton,
    MznDrawer,
    MznModal,
    MznModalBodyContainer,
    MznModalFooter,
    MznModalHeader,
    MznSelect,
  ],
  host: { style: 'display: block;' },
  template: `
    <button mznButton variant="base-primary" (click)="drawerOpen.set(true)">
      Open Drawer
    </button>
    <div
      mznDrawer
      [open]="drawerOpen()"
      headerTitle="Drawer"
      [isHeaderDisplay]="true"
      size="medium"
      (closed)="drawerOpen.set(false); modalOpen.set(false)"
    >
      <div style="padding: 16px;">
        <button mznButton variant="base-primary" (click)="modalOpen.set(true)">
          Open Modal
        </button>
      </div>
    </div>
    <div
      mznModal
      [open]="modalOpen()"
      modalType="standard"
      size="regular"
      [showDismissButton]="true"
      [showModalFooter]="true"
      [showModalHeader]="true"
      (closed)="modalOpen.set(false)"
    >
      <div mznModalHeader title="Modal with Select"></div>
      <!--
        Modal children 需要用 mznModalBodyContainer 包起來取得 React Modal 內建
        的 body container padding + 捲動時的上下分隔線。React 版是 Modal 自動
        注入這層，Angular 採顯式 directive 的方式讓使用者可控制 body 配置。
      -->
      <div mznModalBodyContainer>
        <div
          mznSelect
          fullWidth
          placeholder="Select an option"
          [options]="selectOptions"
          [(ngModel)]="selectValue"
        ></div>
      </div>
      <div
        mznModalFooter
        confirmText="OK"
        cancelText="Cancel"
        (confirmed)="modalOpen.set(false)"
        (cancelled)="modalOpen.set(false)"
      ></div>
    </div>
  `,
})
class BackdropDrawerModalSelectComponent {
  readonly drawerOpen = signal(false);
  readonly modalOpen = signal(false);
  selectValue: DropdownOption | null = null;
  readonly selectOptions: DropdownOption[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
    { id: '4', name: 'Option 4' },
    { id: '5', name: 'Option 5' },
  ];
}

export const DrawerModalSelectLayering: Story = {
  decorators: [
    moduleMetadata({ imports: [BackdropDrawerModalSelectComponent] }),
  ],
  render: () => ({
    template: `<div storyBackdropDrawerModalSelect></div>`,
  }),
};

@Component({
  selector: '[storyBackdropDisableBackdropClick]',
  standalone: true,
  imports: [MznBackdrop, MznButton, MznTypography],
  host: { style: 'display: block;' },
  template: `
    <div style="margin-bottom: 16px;">
      <p mznTypography color="text-neutral" variant="body">
        🔒 Clicking outside will not close the modal - use the button
      </p>
    </div>
    <button mznButton variant="base-primary" (click)="open.set(true)">
      Open Modal (Must Use Button)
    </button>
    <div
      mznBackdrop
      [open]="open()"
      variant="dark"
      [disableCloseOnBackdropClick]="true"
    >
      @if (open()) {
        <div
          style="background: var(--mzn-color-background-base); border-radius: 8px; display: flex; flex-direction: column; gap: 16px; margin: auto; max-width: 400px; padding: 24px; position: relative; top: 50%; transform: translateY(-50%);"
        >
          <p
            mznTypography
            variant="body"
            color="text-neutral"
            style="margin-bottom: 16px;"
          >
            Clicking the backdrop will not close this modal. You must use the
            button below.
          </p>
          <button mznButton variant="base-primary" (click)="open.set(false)">
            Close Modal
          </button>
        </div>
      }
    </div>
  `,
})
class BackdropDisableBackdropClickComponent {
  readonly open = signal(false);
}

export const DisableBackdropClick: Story = {
  decorators: [
    moduleMetadata({ imports: [BackdropDisableBackdropClickComponent] }),
  ],
  render: () => ({
    template: `<div storyBackdropDisableBackdropClick></div>`,
  }),
};
