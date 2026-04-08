import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MznSpin } from './spin.component';
import { MznModal } from '../modal/modal.component';
import { MznModalHeader } from '../modal/modal-header.component';
import { MznButton } from '../button/button.directive';

export default {
  title: 'Feedback/Spin',
  decorators: [
    moduleMetadata({
      imports: [MznSpin],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    color: { control: { type: 'color' } },
    description: { control: { type: 'text' } },
    descriptionClassName: { control: { type: 'text' } },
    loading: { control: { type: 'boolean' } },
    size: {
      options: ['main', 'sub', 'minor'],
      control: { type: 'select' },
    },
    stretch: { control: { type: 'boolean' } },
    trackColor: { control: { type: 'color' } },
  },
  args: {
    color: '',
    description: 'Loading...',
    descriptionClassName: '',
    loading: true,
    size: 'main',
    stretch: false,
    trackColor: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznSpin
        [loading]="loading"
        [size]="size"
        [stretch]="stretch"
        [description]="description || undefined"
        [descriptionClassName]="descriptionClassName || undefined"
        [color]="color || undefined"
        [trackColor]="trackColor || undefined"
      ></div>
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    template: `
      <div style="display: inline-grid; gap: 60px; grid-template-columns: repeat(3, 140px);">
        <div mznSpin [loading]="true" ></div>
        <div mznSpin [loading]="true" description="Loading..." ></div>
      </div>
    `,
  }),
};

export const Nested: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 16px;">
        <div mznSpin description="Loading..." [loading]="true">
          <div style="width: 300px; height: 300px; padding: 16px; border: 1px solid #eee;">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'mzn-spin-on-modal-demo',
  standalone: true,
  imports: [MznSpin, MznModal, MznModalHeader, MznButton],
  template: `
    <button mznButton variant="base-primary" (click)="open.set(true)"
      >OPEN</button
    >
    <mzn-modal [open]="open()" (closed)="open.set(false)">
      <mzn-modal-header title="Hi" />
      <div class="mzn-modal__body-container">
        <div
          mznSpin
          description="內容加載中..."
          [loading]="true"
          [stretch]="true"
          size="sub"
        >
          <div style="width: 100%; height: 200px;"></div>
        </div>
      </div>
    </mzn-modal>
  `,
})
class SpinOnModalDemoComponent {
  readonly open = signal(false);
}

export const OnModal: Story = {
  decorators: [
    moduleMetadata({
      imports: [SpinOnModalDemoComponent, BrowserAnimationsModule],
    }),
  ],
  render: () => ({
    template: `<mzn-spin-on-modal-demo />`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 24px;">
        <div mznSpin description="Main size" [loading]="true" size="main" ></div>
        <div mznSpin description="Sub size" [loading]="true" size="sub" ></div>
        <div mznSpin description="Minor size" [loading]="true" size="minor" ></div>
      </div>
    `,
  }),
};

export const CustomColors: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 24px;">
        <div style="background: #1976d2; padding: 24px; border-radius: 8px; display: inline-flex; gap: 24px; align-items: center;">
          <div mznSpin
            [loading]="true"
            color="white"
            trackColor="rgba(255,255,255,0.3)"
            description="On dark background"
          ></div>
        </div>
        <div style="background: #f5f5f5; padding: 24px; border-radius: 8px; display: inline-flex; gap: 24px; align-items: center;">
          <div mznSpin
            [loading]="true"
            color="#e53935"
            trackColor="rgba(229,57,53,0.15)"
            description="Custom brand color"
          ></div>
        </div>
        <div style="background: #212121; padding: 24px; border-radius: 8px; display: inline-flex; gap: 24px; align-items: center;">
          <div mznSpin
            [loading]="true"
            color="#69f0ae"
            trackColor="rgba(105,240,174,0.2)"
            description="On black background"
          ></div>
        </div>
      </div>
    `,
  }),
};
