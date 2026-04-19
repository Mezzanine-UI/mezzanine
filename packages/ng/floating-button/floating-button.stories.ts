import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CloseIcon, PlusIcon } from '@mezzanine-ui/icons';

import { MznButton } from '../button/button.directive';
import { MznIcon } from '../icon/icon.component';
import { MznModal } from '../modal/modal.component';
import { MznModalBodyContainer } from '../modal/modal-body-container.directive';
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
  imports: [MznFloatingButton, MznButton, MznIcon],
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
        <!--
          MznButton 是 directive，[icon] input 只用於 CSS class 計算，不會自動
          渲染 icon element（不像 React Button 是 component 會 render children）。
          icon-only 模式必須手動放 <i mznIcon> 作為 button 的 child content。
        -->
        <button
          mznButton
          iconType="icon-only"
          [icon]="closeIcon"
          (click)="open.set(false)"
        >
          <i mznIcon [icon]="closeIcon"></i>
        </button>
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
  imports: [MznFloatingButton, MznModal, MznModalBodyContainer, MznModalHeader],
  host: {
    style: 'width: 100%; height: 200vh;',
  },
  template: `
    Scroll down
    <div mznFloatingButton [open]="open()" (click)="open.set(true)">
      Open Modal
    </div>
    <!--
      MznModal 的 showModalHeader input 沒加 booleanAttribute transform,
      bare attribute 會以空字串存入 signal 讓 @if 判定 falsy 不 render header
      slot。顯式 [showModalHeader]="true" 對齊 React <Modal showModalHeader>。
    -->
    <div
      mznModal
      [open]="open()"
      modalType="standard"
      [showModalHeader]="true"
      (closed)="open.set(false)"
    >
      <div mznModalHeader title="Modal Title"></div>
      <div mznModalBodyContainer>
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
