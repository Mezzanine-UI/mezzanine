import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  selector: 'story-backdrop-dark-variant',
  standalone: true,
  imports: [MznBackdrop, MznButton],
  template: `
    <div>
      <div style="margin-bottom: 16px;">
        Try scrolling the page before and after opening the backdrop to see the
        scroll lock in action!
      </div>
      <button mznButton variant="base-primary" (click)="open.set(true)"
        >Open Dark Backdrop</button
      >
      <div
        style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;"
      >
        @for (item of scrollItems; track $index) {
          <div
            style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px;"
          >
            Scrollable content item {{ $index + 1 }} - This page has enough
            content to scroll. When the backdrop opens, scrolling will be
            locked.
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
            <h3 style="color: var(--mzn-color-text-brand);"
              >Dark Variant Modal</h3
            >
            <p
              >This is a modal with dark backdrop. Notice the background page
              cannot be scrolled while this is open. Click outside or the button
              to close.</p
            >
            <button mznButton variant="base-primary" (click)="open.set(false)"
              >Close</button
            >
          </div>
        }
      </div>
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
    template: `<story-backdrop-dark-variant />`,
  }),
};

@Component({
  selector: 'story-backdrop-light-variant',
  standalone: true,
  imports: [MznBackdrop, MznButton],
  template: `
    <div>
      <div style="margin-bottom: 16px;">
        Light variant is commonly used for loading states (like Spin component)
      </div>
      <button mznButton variant="base-primary" (click)="open.set(true)"
        >Open Light Backdrop</button
      >
      <div
        style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;"
      >
        @for (item of scrollItems; track $index) {
          <div
            style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px;"
          >
            Scrollable content item {{ $index + 1 }} - Background scroll is
            locked when backdrop is open.
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
            <div
              style="background: var(--mzn-color-background-base); border-radius: 8px; padding: 24px; text-align: center;"
            >
              <h3 style="color: var(--mzn-color-text-brand);"
                >Light Variant Loading</h3
              >
              <p style="margin-top: 8px;"
                >Perfect for loading overlays and component-level blocking
                states</p
              >
            </div>
            <button mznButton variant="base-primary" (click)="open.set(false)"
              >Close</button
            >
          </div>
        }
      </div>
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
    template: `<story-backdrop-light-variant />`,
  }),
};

@Component({
  selector: 'story-backdrop-custom-container',
  standalone: true,
  imports: [MznBackdrop, MznButton],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <button mznButton variant="base-primary" (click)="open.set(true)"
        >Open Backdrop in Container</button
      >
      <div
        #container
        style="background: var(--mzn-color-background-base); border: 2px dashed var(--mzn-color-border-neutral); border-radius: 8px; min-height: 300px; padding: 16px; position: relative; width: 100%;"
      >
        <div style="padding: 24px;">
          Container Element (Backdrop will be rendered inside this)
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
                <h3 style="color: var(--mzn-color-text-brand);"
                  >Container Backdrop</h3
                >
                <p style="margin-top: 8px;"
                  >This overlay is scoped to the container element above</p
                >
              </div>
              <button mznButton variant="base-primary" (click)="open.set(false)"
                >Close</button
              >
            </div>
          }
        </div>
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
    template: `<story-backdrop-custom-container />`,
  }),
};

@Component({
  selector: 'story-backdrop-disable-scroll-lock',
  standalone: true,
  imports: [MznBackdrop, MznButton],
  template: `
    <div>
      <div style="margin-bottom: 16px;">
        With disableScrollLock=true, you can still scroll the background page
      </div>
      <button mznButton variant="base-primary" (click)="open.set(true)"
        >Open Without Scroll Lock</button
      >
      <div
        style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;"
      >
        @for (item of scrollItems; track $index) {
          <div
            style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px;"
          >
            Scrollable content item {{ $index + 1 }} - You can scroll this even
            when backdrop is open!
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
            <h3 style="color: var(--mzn-color-text-brand);"
              >Scroll Lock Disabled</h3
            >
            <p
              >Try scrolling the page - it still works! This is useful for
              scenarios where you want to allow background interaction.</p
            >
            <button mznButton variant="base-primary" (click)="open.set(false)"
              >Close</button
            >
          </div>
        }
      </div>
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
    template: `<story-backdrop-disable-scroll-lock />`,
  }),
};

@Component({
  selector: 'story-backdrop-disable-portal',
  standalone: true,
  imports: [MznBackdrop, MznButton],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <button mznButton variant="base-primary" (click)="open.set(!open())"
        >Toggle Backdrop (No Portal)</button
      >
      <div
        style="background: var(--mzn-color-background-base); border: 2px dashed var(--mzn-color-border-neutral); border-radius: 8px; height: 300px; overflow: hidden; padding: 16px; position: relative; width: 100%;"
      >
        <p>Parent Element (overflow: hidden)</p>
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
                <h3 style="color: var(--mzn-color-text-brand);">No Portal</h3>
                <p style="margin-top: 8px;"
                  >Rendered in normal DOM flow, respects parent overflow</p
                >
              </div>
              <button mznButton variant="base-primary" (click)="open.set(false)"
                >Close</button
              >
            </div>
          }
        </div>
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
    template: `<story-backdrop-disable-portal />`,
  }),
};

@Component({
  selector: 'story-backdrop-drawer-modal-select',
  standalone: true,
  imports: [MznBackdrop, MznButton],
  template: `
    <div>
      <button mznButton variant="base-primary" (click)="drawerOpen.set(true)"
        >Open Drawer</button
      >
      <div
        mznBackdrop
        [open]="drawerOpen()"
        variant="dark"
        (closed)="drawerOpen.set(false); modalOpen.set(false)"
      >
        @if (drawerOpen()) {
          <div
            style="position: fixed; right: 0; top: 0; height: 100%; width: 400px; background: var(--mzn-color-background-base); padding: 24px; display: flex; flex-direction: column; gap: 16px; pointer-events: auto;"
          >
            <h3>Drawer</h3>
            <button
              mznButton
              variant="base-primary"
              (click)="modalOpen.set(true)"
              >Open Modal</button
            >
          </div>
        }
      </div>
      <div
        mznBackdrop
        [open]="modalOpen()"
        variant="dark"
        (closed)="modalOpen.set(false)"
      >
        @if (modalOpen()) {
          <div
            style="background: var(--mzn-color-background-base); border-radius: 8px; margin: auto; max-width: 480px; padding: 24px; display: flex; flex-direction: column; gap: 16px; pointer-events: auto; position: relative; top: 50%; transform: translateY(-50%);"
          >
            <h3>Modal with Select</h3>
            <select style="width: 100%; padding: 8px;">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
              <option value="4">Option 4</option>
              <option value="5">Option 5</option>
            </select>
            <div style="display: flex; gap: 8px;">
              <button mznButton (click)="modalOpen.set(false)">Cancel</button>
              <button
                mznButton
                variant="base-primary"
                (click)="modalOpen.set(false)"
                >OK</button
              >
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class BackdropDrawerModalSelectComponent {
  readonly drawerOpen = signal(false);
  readonly modalOpen = signal(false);
}

export const DrawerModalSelectLayering: Story = {
  decorators: [
    moduleMetadata({ imports: [BackdropDrawerModalSelectComponent] }),
  ],
  render: () => ({
    template: `<story-backdrop-drawer-modal-select />`,
  }),
};

@Component({
  selector: 'story-backdrop-disable-backdrop-click',
  standalone: true,
  imports: [MznBackdrop, MznButton],
  template: `
    <div>
      <div style="margin-bottom: 16px;">
        Clicking outside will not close the modal - use the button
      </div>
      <button mznButton variant="base-primary" (click)="open.set(true)"
        >Open Modal (Must Use Button)</button
      >
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
              >Clicking the backdrop will not close this modal. You must use the
              button below.</p
            >
            <button mznButton variant="base-primary" (click)="open.set(false)"
              >Close Modal</button
            >
          </div>
        }
      </div>
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
    template: `<story-backdrop-disable-backdrop-click />`,
  }),
};
