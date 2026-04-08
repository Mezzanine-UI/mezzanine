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
          <li mznNavigationOption title="首頁" href="/" [icon]="HomeIcon" ></li>
          <li mznNavigationOption title="數據分析" [icon]="FileIcon" [hasChildren]="true">
            <li mznNavigationOption title="流量報表" ></li>
            <li mznNavigationOption title="轉換率分析" ></li>
          </li>
          <li mznNavigationOption title="訂單管理" [icon]="ListIcon" [hasChildren]="true">
            <li mznNavigationOption title="待處理訂單" ></li>
            <li mznNavigationOption title="已完成訂單" ></li>
          </li>
          <li mznNavigationOption title="會員管理" href="/members" [icon]="UserIcon" ></li>
          @for (i of items; track i) {
            <li mznNavigationOption [title]="'專案 ' + i" [icon]="FolderIcon" [hasChildren]="true">
              <li mznNavigationOption [title]="'專案設定 ' + i" ></li>
              <li mznNavigationOption [title]="'成員管理 ' + i" ></li>
            </li>
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
      <nav mznNavigation
        [activatedPath]="activatedPath()"
        (optionClick)="activatedPath.set($event)"
      >
        <header mznNavigationHeader title="Mezzanine">
          <span
            aria-label="logo"
            style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px; display: block;"
          ></span>
        </header>
        <li mznNavigationOption
          title="首頁"
          [icon]="HomeIcon"
          href="http://localhost:6006/?path=/story/navigation-navigation--basic"
        ></li>
        <li mznNavigationOption
          title="數據分析"
          [icon]="FileIcon"
          [hasChildren]="true"
          [defaultOpen]="true"
        >
          <li mznNavigationOption
            title="流量報表"
            href="http://localhost:6006/?path=/story/navigation-navigation--custom-anchor-component#report1"
          ></li>
          <li mznNavigationOption
            title="轉換率分析"
            href="http://localhost:6006/?path=/story/navigation-navigation--custom-anchor-component#report2"
          ></li>
        </li>
        <li mznNavigationOption
          title="訂單管理"
          [icon]="ListIcon"
          [hasChildren]="true"
        >
          <li mznNavigationOption title="待處理訂單" ></li>
          <li mznNavigationOption title="已完成訂單" ></li>
        </li>
        <li mznNavigationOption
          title="會員管理"
          href="/members"
          [icon]="UserIcon"
        ></li>
        <footer mznNavigationFooter>
          <span>王小明</span>
          <button mznNavigationIconButton [icon]="QuestionOutlineIcon" ></button>
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
          <li mznNavigationOption title="首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁" ></li>
          <li mznNavigationOption title="數據分析" [hasChildren]="true">
            <li mznNavigationOption title="流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表" ></li>
            <li mznNavigationOption title="轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析" ></li>
          </li>
          @for (i of items; track i) {
            <li mznNavigationOption [title]="'專案 ' + i" [hasChildren]="true">
              <li mznNavigationOption [title]="'專案設定 ' + i" ></li>
              <li mznNavigationOption [title]="'成員管理 ' + i" ></li>
            </li>
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
      <nav mznNavigation
        [activatedPath]="activatedPath()"
        (optionClick)="activatedPath.set($event)"
      >
        <header mznNavigationHeader title="企業管理平台">
          <span
            aria-label="logo"
            style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px; display: block;"
          ></span>
        </header>
        <li mznNavigationOptionCategory title="主要功能">
          <li mznNavigationOption title="儀表板" ></li>
          <li mznNavigationOption title="數據分析" [hasChildren]="true">
            <li mznNavigationOption title="銷售報表" href="/iframe.html" ></li>
            <li mznNavigationOption title="流量分析" ></li>
            <li mznNavigationOption title="用戶行為" ></li>
          </li>
          <li mznNavigationOption title="訂單管理" [hasChildren]="true">
            <li mznNavigationOption title="全部訂單" ></li>
            <li mznNavigationOption title="待出貨" ></li>
            <li mznNavigationOption title="退換貨處理" ></li>
          </li>
        </li>
        <li mznNavigationOptionCategory title="內容管理">
          <li mznNavigationOption title="文章管理" [hasChildren]="true">
            <li mznNavigationOption title="文章列表" [hasChildren]="true">
              <li mznNavigationOption title="已發布" ></li>
              <li mznNavigationOption title="草稿" ></li>
            </li>
            <li mznNavigationOption title="分類設定" ></li>
          </li>
          <li mznNavigationOption title="媒體庫" [hasChildren]="true">
            <li mznNavigationOption title="圖片" ></li>
            <li mznNavigationOption title="影片" ></li>
            <li mznNavigationOption title="文件" ></li>
          </li>
        </li>
        <li mznNavigationOptionCategory title="系統設定">
          <li mznNavigationOption title="用戶管理" [hasChildren]="true">
            <li mznNavigationOption title="用戶列表" [hasChildren]="true">
              <li mznNavigationOption title="活躍用戶" ></li>
              <li mznNavigationOption title="停用帳號" ></li>
            </li>
            <li mznNavigationOption title="角色權限" ></li>
          </li>
          <li mznNavigationOption title="系統設定" [hasChildren]="true">
            <li mznNavigationOption title="基本設定" [hasChildren]="true">
              <li mznNavigationOption title="網站資訊" ></li>
              <li mznNavigationOption title="SEO 設定" ></li>
            </li>
            <li mznNavigationOption title="安全性設定" ></li>
          </li>
          <li mznNavigationOption title="下載中心" href="#download-center" ></li>
        </li>
        <footer mznNavigationFooter>
          <span>李經理</span>
          <!-- NOTE: NavigationUserMenu (avatar with dropdown) from React is not available in Angular. -->
          <button mznNavigationIconButton [icon]="QuestionOutlineIcon" ></button>
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
