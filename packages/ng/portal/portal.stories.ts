import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznPortal } from './portal.component';
import { MznButton } from '../button/button.directive';

export default {
  title: 'Others/Portal',
  decorators: [
    moduleMetadata({
      imports: [MznPortal, MznButton],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

const demoElementTemplate = `
  <div style="width: 100px; height: 100px; background-image: radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a); border-radius: 100%;"></div>
`;

export const CustomContainer: Story = {
  name: 'Custom Container (Using Ref)',
  render: () => ({
    template: `
      <div style="width: 100%; height: 100px; background-color: #d9d9d9;">
        <p>The container wrapping portal.</p>
        <div mznPortal [container]="dest">
          ${demoElementTemplate}
        </div>
      </div>
      <div #dest style="width: 100%; height: 100px; background-color: #e5e5e5;">
        <p>The portal destination.</p>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-portal-default-layer',
  standalone: true,
  imports: [MznPortal, MznButton],
  template: `
    <div style="padding: 20px;">
      <h1 style="margin-bottom: 16px;">Default Portal Layer</h1>
      <p style="margin-bottom: 16px;">
        Click the button to show a portal element in the default layer. The
        element will be rendered in <code>#mzn-portal-container</code>.
      </p>
      <button mznButton (click)="show.set(!show())"
        >{{ show() ? 'Hide' : 'Show' }} Portal</button
      >
      <div mznPortal layer="default">
        @if (show()) {
          <div
            style="place-self: center; padding: 24px; background-color: #fff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 8px; pointer-events: auto;"
          >
            <h2 style="margin-bottom: 8px;">Portal Content</h2>
            <p>This is rendered in the default portal layer.</p>
            ${demoElementTemplate}
          </div>
        }
      </div>
    </div>
  `,
})
class PortalDefaultLayerComponent {
  readonly show = signal(false);
}

export const DefaultLayer: Story = {
  name: 'Default Layer (Auto Portal)',
  decorators: [moduleMetadata({ imports: [PortalDefaultLayerComponent] })],
  render: () => ({
    template: `<story-portal-default-layer />`,
  }),
};

@Component({
  selector: 'story-portal-alert-layer',
  standalone: true,
  imports: [MznPortal, MznButton],
  template: `
    <div style="padding: 20px;">
      <h1 style="margin-bottom: 16px;">Alert Portal Layer</h1>
      <p style="margin-bottom: 16px;">
        Alert layer renders at the top of the page, outside the root element. It
        uses <code>position: sticky</code> and automatically adjusts the default
        portal layer position.
      </p>
      <button mznButton (click)="addAlert()">Add Alert Banner</button>
      <div style="margin-top: 24px; height: 400px; overflow-y: auto;">
        <h2 style="margin-bottom: 16px;">Scrollable Content</h2>
        @for (i of contentItems; track i) {
          <p style="margin-bottom: 8px;">Content line {{ i + 1 }}</p>
        }
      </div>
      @for (alert of alerts(); track $index) {
        <div mznPortal layer="alert">
          <div
            [style.background-color]="$index % 2 === 0 ? '#4caf50' : '#2196f3'"
            style="padding: 16px 24px; color: #fff; display: flex; justify-content: space-between; align-items: center; pointer-events: auto;"
          >
            <span>{{ alert }}</span>
            <button
              (click)="removeAlert($index)"
              style="background: none; border: none; color: #fff; cursor: pointer; font-size: 20px; padding: 0 8px;"
              type="button"
              >×</button
            >
          </div>
        </div>
      }
    </div>
  `,
})
class PortalAlertLayerComponent {
  readonly alerts = signal<string[]>([]);
  readonly contentItems = Array.from({ length: 20 }, (_, i) => i);

  addAlert(): void {
    this.alerts.update((prev) => [...prev, `Alert ${prev.length + 1}`]);
  }

  removeAlert(index: number): void {
    this.alerts.update((prev) => prev.filter((_, i) => i !== index));
  }
}

export const AlertLayer: Story = {
  name: 'Alert Layer (Above Root)',
  decorators: [moduleMetadata({ imports: [PortalAlertLayerComponent] })],
  render: () => ({
    template: `<story-portal-alert-layer />`,
  }),
};

export const DisablePortal: Story = {
  name: 'Disable Portal',
  render: () => ({
    template: `
      <div style="padding: 20px;">
        <h2 style="margin-bottom: 16px;">Disabled Portal</h2>
        <p style="margin-bottom: 16px;">
          When <code>disablePortal</code> is true, the content renders in normal
          DOM flow instead of being portaled.
        </p>
        <div style="padding: 16px; background-color: #f5f5f5; border-radius: 8px;">
          <p style="margin-bottom: 16px;">Parent Container</p>
          <div mznPortal [disablePortal]="true">
            <div style="padding: 16px; background-color: #e0e0e0; border-radius: 4px;">
              <p>This content is NOT portaled</p>
              <div style="width: 100px; height: 100px; background-image: radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a); border-radius: 100%;"></div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-portal-layer-comparison',
  standalone: true,
  imports: [MznPortal, MznButton],
  template: `
    <div style="padding: 20px;">
      <h2 style="margin-bottom: 16px;">Portal Layers Comparison</h2>
      <p style="margin-bottom: 16px;"
        >Compare the difference between alert and default layers:</p
      >
      <div style="display: flex; gap: 12px; margin-bottom: 24px;">
        <button
          mznButton
          variant="base-primary"
          (click)="showAlert.set(!showAlert())"
        >
          {{ showAlert() ? 'Hide' : 'Show' }} Alert Layer
        </button>
        <button
          mznButton
          variant="base-secondary"
          (click)="showDefault.set(!showDefault())"
        >
          {{ showDefault() ? 'Hide' : 'Show' }} Default Layer
        </button>
      </div>
      <div
        style="height: 200vh; padding: 16px; background-color: #f5f5f5; border-radius: 8px;"
      >
        <h3>Page Content</h3>
        <p>
          The alert layer appears above this content with sticky positioning.
          The default layer uses fixed positioning inside the root.
        </p>
      </div>
      @if (showAlert()) {
        <div mznPortal layer="alert">
          <div
            style="padding: 16px 24px; background-color: #ff9800; color: #fff; pointer-events: auto;"
          >
            Alert Layer
          </div>
        </div>
      }
      @if (showDefault()) {
        <div mznPortal layer="default">
          <div
            style="width: 200px; height: 100%; justify-self: flex-end; padding: 24px; background-color: rgba(33, 150, 243, 0.95); color: #fff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); pointer-events: auto;"
          >
            Default Layer
          </div>
        </div>
      }
    </div>
  `,
})
class PortalLayerComparisonComponent {
  readonly showAlert = signal(false);
  readonly showDefault = signal(false);
}

export const LayerComparison: Story = {
  name: 'Layer Comparison',
  decorators: [moduleMetadata({ imports: [PortalLayerComparisonComponent] })],
  render: () => ({
    template: `<story-portal-layer-comparison />`,
  }),
};
