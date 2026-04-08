import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  FileIcon,
  FolderIcon,
  HomeIcon,
  ListIcon,
  QuestionOutlineIcon,
  UserIcon,
} from '@mezzanine-ui/icons';
import { MznNavigation } from './navigation.component';
import { MznNavigationOption } from './navigation-option.component';
import { MznNavigationHeader } from './navigation-header.component';
import { MznNavigationFooter } from './navigation-footer.component';
import { MznNavigationIconButton } from './navigation-icon-button.component';
import { MznNavigationOptionCategory } from './navigation-option-category.component';

export default {
  title: 'Navigation/Navigation',
  decorators: [
    moduleMetadata({
      imports: [
        MznNavigation,
        MznNavigationOption,
        MznNavigationHeader,
        MznNavigationFooter,
        MznNavigationIconButton,
        MznNavigationOptionCategory,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Basic: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      HomeIcon,
      FileIcon,
      ListIcon,
      UserIcon,
      FolderIcon,
      QuestionOutlineIcon,
      items: Array.from({ length: 5 }, (_, i) => i + 1),
    },
    template: `
      <div style="height: calc(100vh - 32px); display: grid;">
        <nav mznNavigation>
          <header mznNavigationHeader title="Mezzanine">
            <span aria-label="logo" style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px; display: block;"></span>
          </header>
          <mzn-navigation-option title="首頁" href="/" [icon]="HomeIcon" ></mzn-navigation-option>
          <mzn-navigation-option title="數據分析" [icon]="FileIcon" [hasChildren]="true">
            <mzn-navigation-option title="流量報表" ></mzn-navigation-option>
            <mzn-navigation-option title="轉換率分析" ></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option title="訂單管理" [icon]="ListIcon" [hasChildren]="true">
            <mzn-navigation-option title="待處理訂單" ></mzn-navigation-option>
            <mzn-navigation-option title="已完成訂單" ></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option title="會員管理" href="/members" [icon]="UserIcon" ></mzn-navigation-option>
          @for (i of items; track i) {
            <mzn-navigation-option [title]="'專案 ' + i" [icon]="FolderIcon" [hasChildren]="true">
              <mzn-navigation-option [title]="'專案設定 ' + i" ></mzn-navigation-option>
              <mzn-navigation-option [title]="'成員管理 ' + i" ></mzn-navigation-option>
            </mzn-navigation-option>
          }
          <footer mznNavigationFooter>
            <span>王小明</span>
            <button mznNavigationIconButton [icon]="QuestionOutlineIcon" ></button>
          </footer>
        </nav>
      </div>
    `,
  }),
};

// NOTE: NavigationUserMenu (avatar + dropdown menu in footer) from React is not available in Angular.
// Angular NavigationFooter accepts arbitrary content; use plain text or icon buttons instead.

@Component({
  selector: 'story-custom-anchor',
  standalone: true,
  imports: [
    MznNavigation,
    MznNavigationOption,
    MznNavigationHeader,
    MznNavigationFooter,
    MznNavigationIconButton,
  ],
  template: `
    <div style="height: calc(100vh - 32px); display: grid;">
      <nav
        mznNavigation
        [activatedPath]="activatedPath()"
        (optionClick)="activatedPath.set($event)"
      >
        <header mznNavigationHeader title="Mezzanine">
          <span
            aria-label="logo"
            style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px; display: block;"
          ></span>
        </header>
        <mzn-navigation-option
          title="首頁"
          [icon]="HomeIcon"
          href="http://localhost:6006/?path=/story/navigation-navigation--basic"
        ></mzn-navigation-option>
        <mzn-navigation-option
          title="數據分析"
          [icon]="FileIcon"
          [hasChildren]="true"
          [defaultOpen]="true"
        >
          <mzn-navigation-option
            title="流量報表"
            href="http://localhost:6006/?path=/story/navigation-navigation--custom-anchor-component#report1"
          ></mzn-navigation-option>
          <mzn-navigation-option
            title="轉換率分析"
            href="http://localhost:6006/?path=/story/navigation-navigation--custom-anchor-component#report2"
          ></mzn-navigation-option>
        </mzn-navigation-option>
        <mzn-navigation-option
          title="訂單管理"
          [icon]="ListIcon"
          [hasChildren]="true"
        >
          <mzn-navigation-option title="待處理訂單"></mzn-navigation-option>
          <mzn-navigation-option title="已完成訂單"></mzn-navigation-option>
        </mzn-navigation-option>
        <mzn-navigation-option
          title="會員管理"
          href="/members"
          [icon]="UserIcon"
        ></mzn-navigation-option>
        <footer mznNavigationFooter>
          <span>王小明</span>
          <button mznNavigationIconButton [icon]="QuestionOutlineIcon"></button>
        </footer>
      </nav>
    </div>
  `,
})
class CustomAnchorStoryComponent {
  readonly HomeIcon = HomeIcon;
  readonly FileIcon = FileIcon;
  readonly ListIcon = ListIcon;
  readonly UserIcon = UserIcon;
  readonly QuestionOutlineIcon = QuestionOutlineIcon;
  readonly activatedPath = signal<string[]>(['數據分析', '流量報表']);
}

export const CustomAnchorComponent: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [CustomAnchorStoryComponent] })],
  render: () => ({
    template: `<story-custom-anchor />`,
  }),
};

export const Overflow: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => ({
    template: `
      <div style="height: calc(100vh - 32px); display: grid;">
        <nav mznNavigation>
          <header mznNavigationHeader title="Mezzanine">
            <span aria-label="logo" style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px; display: block;"></span>
          </header>
          <mzn-navigation-option title="首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁" ></mzn-navigation-option>
          <mzn-navigation-option title="數據分析" [hasChildren]="true">
            <mzn-navigation-option title="流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表" ></mzn-navigation-option>
            <mzn-navigation-option title="轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析" ></mzn-navigation-option>
          </mzn-navigation-option>
          @for (i of items; track i) {
            <mzn-navigation-option [title]="'專案 ' + i" [hasChildren]="true">
              <mzn-navigation-option [title]="'專案設定 ' + i" ></mzn-navigation-option>
              <mzn-navigation-option [title]="'成員管理 ' + i" ></mzn-navigation-option>
            </mzn-navigation-option>
          }
          <footer mznNavigationFooter>
            <span>Very long username Very long username Very long username</span>
          </footer>
        </nav>
      </div>
    `,
    props: {
      items: Array.from({ length: 20 }, (_, i) => i + 1),
    },
  }),
};

@Component({
  selector: 'story-navigation-all',
  standalone: true,
  imports: [
    MznNavigation,
    MznNavigationOption,
    MznNavigationHeader,
    MznNavigationFooter,
    MznNavigationIconButton,
    MznNavigationOptionCategory,
  ],
  template: `
    <div style="display: flex; gap: 48px; height: calc(100vh - 32px);">
      <nav
        mznNavigation
        [activatedPath]="activatedPath()"
        (optionClick)="activatedPath.set($event)"
      >
        <header mznNavigationHeader title="企業管理平台">
          <span
            aria-label="logo"
            style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px; display: block;"
          ></span>
        </header>
        <mzn-navigation-option-category title="主要功能">
          <mzn-navigation-option title="儀表板"></mzn-navigation-option>
          <mzn-navigation-option title="數據分析" [hasChildren]="true">
            <mzn-navigation-option
              title="銷售報表"
              href="/iframe.html"
            ></mzn-navigation-option>
            <mzn-navigation-option title="流量分析"></mzn-navigation-option>
            <mzn-navigation-option title="用戶行為"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option title="訂單管理" [hasChildren]="true">
            <mzn-navigation-option title="全部訂單"></mzn-navigation-option>
            <mzn-navigation-option title="待出貨"></mzn-navigation-option>
            <mzn-navigation-option title="退換貨處理"></mzn-navigation-option>
          </mzn-navigation-option>
        </mzn-navigation-option-category>
        <mzn-navigation-option-category title="內容管理">
          <mzn-navigation-option title="文章管理" [hasChildren]="true">
            <mzn-navigation-option title="文章列表" [hasChildren]="true">
              <mzn-navigation-option title="已發布"></mzn-navigation-option>
              <mzn-navigation-option title="草稿"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="分類設定"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option title="媒體庫" [hasChildren]="true">
            <mzn-navigation-option title="圖片"></mzn-navigation-option>
            <mzn-navigation-option title="影片"></mzn-navigation-option>
            <mzn-navigation-option title="文件"></mzn-navigation-option>
          </mzn-navigation-option>
        </mzn-navigation-option-category>
        <mzn-navigation-option-category title="系統設定">
          <mzn-navigation-option title="用戶管理" [hasChildren]="true">
            <mzn-navigation-option title="用戶列表" [hasChildren]="true">
              <mzn-navigation-option title="活躍用戶"></mzn-navigation-option>
              <mzn-navigation-option title="停用帳號"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="角色權限"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option title="系統設定" [hasChildren]="true">
            <mzn-navigation-option title="基本設定" [hasChildren]="true">
              <mzn-navigation-option title="網站資訊"></mzn-navigation-option>
              <mzn-navigation-option title="SEO 設定"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="安全性設定"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="下載中心"
            href="#download-center"
          ></mzn-navigation-option>
        </mzn-navigation-option-category>
        <footer mznNavigationFooter>
          <span>李經理</span>
          <!-- NOTE: NavigationUserMenu (avatar with dropdown) from React is not available in Angular. -->
          <button mznNavigationIconButton [icon]="QuestionOutlineIcon"></button>
        </footer>
      </nav>
      <p style="height: 20px;">{{ activatedPath()?.join(' , ') }}</p>
    </div>
  `,
})
class NavigationAllStoryComponent {
  readonly QuestionOutlineIcon = QuestionOutlineIcon;
  readonly activatedPath = signal<string[] | undefined>(undefined);
}

export const All: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  decorators: [moduleMetadata({ imports: [NavigationAllStoryComponent] })],
  render: () => ({
    template: `<story-navigation-all />`,
  }),
};
