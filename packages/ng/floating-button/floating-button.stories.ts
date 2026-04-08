import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CloseIcon, PlusIcon } from '@mezzanine-ui/icons';

import { MznButton } from '../button/button.directive';
import { MznModal } from '../modal/modal.component';
import { MznModalHeader } from '../modal/modal-header.component';
import { MznFloatingButton } from './floating-button.component';

const meta: Meta<MznFloatingButton> = {
  title: 'Others/Floating Button',
  component: MznFloatingButton,
  decorators: [moduleMetadata({ imports: [MznFloatingButton] })],
};

export default meta;
type Story = StoryObj<MznFloatingButton>;

export const Basic: Story = {
  render: () => ({
    props: { icon: PlusIcon },
    template: `
      <div style="width: 100%; height: 200vh;">
        Scroll down
        <div mznFloatingButton [icon]="icon" iconType="leading">Button</div>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    props: { icon: PlusIcon },
    template: `
      <div style="width: 100%; height: 200vh;">
        Scroll down
        <div mznFloatingButton [icon]="icon" iconType="icon-only">加入清單</div>
      </div>
    `,
  }),
};

@Component({
  selector: '[storyAutoHideWhenOpen]',
  standalone: true,
  imports: [MznFloatingButton, MznButton],
  host: {
    style: 'width: 100%; height: 200vh; display: flex; flex-flow: row;',
  },
  template: `
    <div style="flex: 1;">
      Scroll down
      <div
        mznFloatingButton
        [autoHideWhenOpen]="true"
        [open]="open()"
        (click)="toggle()"
      >
        Open
      </div>
    </div>
    @if (open()) {
      <div
        style="width: 250px; height: 100%; background-color: rgba(0,0,0,0.1);"
      >
        <button
          mznButton
          iconType="icon-only"
          [icon]="closeIcon"
          (click)="open.set(false)"
        ></button>
      </div>
    }
  `,
})
class AutoHideWhenOpenComponent {
  readonly closeIcon = CloseIcon;
  readonly open = signal(false);

  toggle(): void {
    this.open.update((prev) => !prev);
  }
}

export const AutoHideWhenOpen: Story = {
  decorators: [
    moduleMetadata({
      imports: [AutoHideWhenOpenComponent],
    }),
  ],
  render: () => ({
    template: `<div storyAutoHideWhenOpen></div>`,
  }),
};

@Component({
  selector: '[storyWithModal]',
  standalone: true,
  imports: [MznFloatingButton, MznModal, MznModalHeader],
  host: {
    style: 'width: 100%; height: 200vh;',
  },
  template: `
    Scroll down
    <div mznFloatingButton [open]="open()" (click)="open.set(true)">
      Open Modal
    </div>
    <div
      mznModal
      [open]="open()"
      modalType="standard"
      (closed)="open.set(false)"
    >
      <div mznModalHeader title="Modal Title"></div>
      <div class="mzn-modal__body-container">
        <p>Modal Content</p>
      </div>
    </div>
  `,
})
class WithModalComponent {
  readonly open = signal(false);
}

export const WithModal: Story = {
  decorators: [
    moduleMetadata({
      imports: [WithModalComponent],
    }),
  ],
  render: () => ({
    template: `<div storyWithModal></div>`,
  }),
};
