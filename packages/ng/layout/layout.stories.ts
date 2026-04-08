import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { HomeIcon, FileIcon, UserIcon, PlusIcon } from '@mezzanine-ui/icons';
import { MznLayout } from './layout.component';
import { MznLayoutMain } from './layout-main.component';
import { MznLayoutLeftPanel } from './layout-left-panel.component';
import { MznLayoutRightPanel } from './layout-right-panel.component';
import { MznNavigation } from '../navigation/navigation.component';
import { MznNavigationHeader } from '../navigation/navigation-header.component';
import { MznNavigationOption } from '../navigation/navigation-option.component';
import { MznNavigationFooter } from '../navigation/navigation-footer.component';
import { MznFloatingButton } from '../floating-button/floating-button.component';
import { MznButton } from '../button/button.directive';
import { MznIcon } from '../icon/icon.component';

@Component({
  selector: 'story-layout-playground',
  standalone: true,
  imports: [
    MznLayout,
    MznLayoutMain,
    MznLayoutRightPanel,
    MznNavigation,
    MznNavigationHeader,
    MznNavigationOption,
    MznNavigationFooter,
    MznFloatingButton,
    MznButton,
    MznIcon,
  ],
  template: `
    <div mznLayout navigationClassName="foo" contentWrapperClassName="bar">
      <nav mznNavigation
        [activatedPath]="activatedPath()"
        (optionClick)="onOptionClick($event)"
      >
        <header mznNavigationHeader>
          <span title>Mezzanine</span>
        </header>
        <li mznNavigationOption [icon]="HomeIcon" title="首頁" ></li>
        <li mznNavigationOption [icon]="FileIcon" title="數據分析">
          <li mznNavigationOption title="流量報表" ></li>
          <li mznNavigationOption title="轉換率分析" ></li>
        </li>
        <li mznNavigationOption [icon]="UserIcon" title="會員管理" ></li>
        <footer mznNavigationFooter ></footer>
      </nav>
      <div mznLayoutMain>
        <div style="height: 100vh; padding: var(--mzn-spacing-primitive-24);">
          <h1>Main Content</h1>
          <p
            >Click the floating button to open the right panel, and drag the
            separator line to resize it.</p
          >
        </div>
        <mzn-floating-button [autoHideWhenOpen]="true" [open]="rightOpen()">
          <button
            mznButton
            variant="base-primary"
            size="main"
            iconType="icon-only"
            [icon]="PlusIcon"
            tooltipText="Open Panel"
            (click)="rightOpen.set(true)"
          >
            <i mznIcon [icon]="PlusIcon" [size]="16"></i>
          </button>
        </mzn-floating-button>
      </div>
      <aside mznLayoutRightPanel [defaultWidth]="320" [open]="rightOpen()">
        <div style="padding: var(--mzn-spacing-primitive-24);">
          <h2>Right Panel</h2>
          <p>This panel is in-flow and scrolls independently.</p>
          <button (click)="rightOpen.set(false)">Close</button>
        </div>
      </aside>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 600px;
        border: 1px solid rgba(128, 128, 128, 0.3);
        border-radius: 4px;
        overflow: hidden;
      }
    `,
  ],
})
class LayoutPlaygroundComponent {
  readonly HomeIcon = HomeIcon;
  readonly FileIcon = FileIcon;
  readonly UserIcon = UserIcon;
  readonly PlusIcon = PlusIcon;
  readonly activatedPath = signal(['首頁']);
  readonly rightOpen = signal(false);

  onOptionClick(path: string[]): void {
    if (path) {
      this.activatedPath.set(path);
    }
  }
}

@Component({
  selector: 'story-layout-dual-panels',
  standalone: true,
  imports: [
    MznLayout,
    MznLayoutMain,
    MznLayoutLeftPanel,
    MznLayoutRightPanel,
    MznNavigation,
    MznNavigationHeader,
    MznNavigationOption,
    MznNavigationFooter,
  ],
  template: `
    <div mznLayout>
      <nav mznNavigation
        [activatedPath]="activatedPath()"
        (optionClick)="onOptionClick($event)"
      >
        <header mznNavigationHeader>
          <span title>Mezzanine</span>
        </header>
        <li mznNavigationOption [icon]="HomeIcon" title="首頁" ></li>
        <li mznNavigationOption [icon]="FileIcon" title="數據分析">
          <li mznNavigationOption title="流量報表" ></li>
          <li mznNavigationOption title="轉換率分析" ></li>
        </li>
        <li mznNavigationOption [icon]="UserIcon" title="會員管理" ></li>
        <footer mznNavigationFooter ></footer>
      </nav>
      <aside mznLayoutLeftPanel [defaultWidth]="240" [open]="leftOpen()">
        <div style="padding: var(--mzn-spacing-primitive-24);">
          <h2>Left Panel</h2>
          <p>Sidebar content, navigation trees, filters, etc.</p>
          <button (click)="leftOpen.set(false)">Close</button>
        </div>
      </aside>
      <div mznLayoutMain>
        <div style="height: 100vh; padding: var(--mzn-spacing-primitive-24);">
          <h1>Main Content</h1>
          <p>The main area fills remaining space and scrolls independently.</p>
          <div style="display: flex; gap: var(--mzn-spacing-primitive-8);">
            @if (!leftOpen()) {
              <button (click)="leftOpen.set(true)">Open Left</button>
            }
            @if (!rightOpen()) {
              <button (click)="rightOpen.set(true)">Open Right</button>
            }
          </div>
        </div>
      </div>
      <aside mznLayoutRightPanel [defaultWidth]="320" [open]="rightOpen()">
        <div style="padding: var(--mzn-spacing-primitive-24);">
          <h2>Right Panel</h2>
          <p>Detail view, preview, contextual actions, etc.</p>
          <button (click)="rightOpen.set(false)">Close</button>
        </div>
      </aside>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 600px;
        border: 1px solid rgba(128, 128, 128, 0.3);
        border-radius: 4px;
        overflow: hidden;
      }
    `,
  ],
})
class LayoutDualPanelsComponent {
  readonly HomeIcon = HomeIcon;
  readonly FileIcon = FileIcon;
  readonly UserIcon = UserIcon;
  readonly activatedPath = signal(['首頁']);
  readonly leftOpen = signal(true);
  readonly rightOpen = signal(false);

  onOptionClick(path: string[]): void {
    if (path) {
      this.activatedPath.set(path);
    }
  }
}

export default {
  title: 'Foundation/Layout',
  decorators: [
    moduleMetadata({
      imports: [LayoutPlaygroundComponent, LayoutDualPanelsComponent],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  render: () => ({
    template: `<story-layout-playground />`,
  }),
};

export const WithDualPanels: Story = {
  name: 'With Dual Panels (Left + Right)',
  render: () => ({
    template: `<story-layout-dual-panels />`,
  }),
};
