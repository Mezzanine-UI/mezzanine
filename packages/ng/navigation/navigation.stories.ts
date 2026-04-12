import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  CalendarIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
  HomeIcon,
  ListIcon,
  NotificationIcon,
  QuestionOutlineIcon,
  SystemIcon,
  UploadIcon,
  UserIcon,
} from '@mezzanine-ui/icons';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { MznNavigation } from './navigation.component';
import { MznNavigationOption } from './navigation-option.component';
import { MznNavigationHeader } from './navigation-header.component';
import { MznNavigationFooter } from './navigation-footer.component';
import { MznNavigationIconButton } from './navigation-icon-button.component';
import { MznNavigationOptionCategory } from './navigation-option-category.component';
import { MznNavigationUserMenu } from './navigation-user-menu.component';

const userMenuOptions = [
  { id: 'member', name: '帳號設定' },
  { id: 'logout', name: '登出' },
];

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
        MznNavigationUserMenu,
        MznBadge,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Basic: Story = {
  parameters: { controls: { disable: true } },
  argTypes: {
    activatedPath: {
      control: false,
      description:
        '目前啟用的選項路徑(由選項標題組成的陣列)。未提供時使用內部狀態,提供後進入 controlled mode。',
      table: { type: { summary: 'readonly string[]' } },
    },
    collapsed: {
      control: 'boolean',
      description:
        '是否收合側邊欄。未提供時使用內部狀態,提供後進入 controlled mode。',
      table: { type: { summary: 'boolean' } },
    },
    collapsedPlacement: {
      control: 'select',
      options: ['right', 'left', 'top', 'bottom'],
      description: '收合時子選單 popper 的展開方向。',
      table: {
        type: { summary: "'right' | 'left' | 'top' | 'bottom'" },
        defaultValue: { summary: "'right'" },
      },
    },
    exactActivatedMatch: {
      control: 'boolean',
      description:
        '啟用路徑比對是否需要完全相符。預設為前綴比對(父層 active 時子層也會高亮)。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    filter: {
      control: 'boolean',
      description: '是否在側邊欄頂端顯示搜尋輸入框以過濾選項。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    items: {
      control: false,
      description:
        '資料驅動 API。接受 `NavigationItemConfig[]`,支援 `navigation-option-category` 分類群組與巢狀子選項。與 content projection 宣告式寫法二擇一。',
      table: { type: { summary: 'readonly NavigationItemConfig[]' } },
    },
    collapseChange: {
      control: false,
      description: '當收合狀態由使用者點擊切換時發出的事件。',
      table: { type: { summary: 'EventEmitter<boolean>' } },
    },
    optionClick: {
      control: false,
      description: '點擊選項時發出的事件,payload 為由根到葉的標題路徑陣列。',
      table: { type: { summary: 'EventEmitter<readonly string[]>' } },
    },
  },
  render: () => ({
    props: {
      HomeIcon,
      FileIcon,
      ListIcon,
      UserIcon,
      FolderIcon,
      QuestionOutlineIcon,
      NotificationIcon,
      items: Array.from({ length: 5 }, (_, i) => i + 1),
      activatedPath: signal<readonly string[]>(['數據分析', '流量報表']),
      userMenuOptions,
    },
    template: `
      <div style="height: calc(100vh - 32px); display: grid;">
        <nav
          mznNavigation
          [activatedPath]="activatedPath()"
          (optionClick)="activatedPath.set($event)"
        >
          <header mznNavigationHeader title="Mezzanine">
            <span aria-label="logo" style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px; display: block;"></span>
          </header>
          <mzn-navigation-option title="首頁" [icon]="HomeIcon"></mzn-navigation-option>
          <mzn-navigation-option title="數據分析" [icon]="FileIcon" [hasChildren]="true">
            <mzn-navigation-option title="流量報表"></mzn-navigation-option>
            <mzn-navigation-option title="轉換率分析"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option title="訂單管理" [icon]="ListIcon" [hasChildren]="true">
            <span navBadge mznBadge variant="count-brand" [count]="5"></span>
            <mzn-navigation-option title="待處理訂單"></mzn-navigation-option>
            <mzn-navigation-option title="已完成訂單"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option title="會員管理" [icon]="UserIcon"></mzn-navigation-option>
          @for (i of items; track i) {
            <mzn-navigation-option [title]="'專案 ' + i" [icon]="FolderIcon" [hasChildren]="true">
              <mzn-navigation-option [title]="'專案設定 ' + i"></mzn-navigation-option>
              <mzn-navigation-option [title]="'成員管理 ' + i"></mzn-navigation-option>
            </mzn-navigation-option>
          }
          <footer mznNavigationFooter>
            <div mznNavigationUserMenu
              imgSrc="https://i.pravatar.cc/150?u=admin"
              [options]="userMenuOptions"
            >王小明</div>
            <button icons mznNavigationIconButton [icon]="QuestionOutlineIcon"></button>
            <span icons mznBadge variant="dot-error">
              <button mznNavigationIconButton [icon]="NotificationIcon"></button>
            </span>
          </footer>
        </nav>
      </div>
    `,
  }),
};

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
          <mzn-navigation-option title="首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁" [icon]="HomeIcon"></mzn-navigation-option>
          <mzn-navigation-option title="數據分析" [icon]="FileIcon" [hasChildren]="true">
            <mzn-navigation-option title="流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表"></mzn-navigation-option>
            <mzn-navigation-option title="轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析"></mzn-navigation-option>
          </mzn-navigation-option>
          @for (i of items; track i) {
            <mzn-navigation-option [title]="'專案 ' + i" [icon]="FolderIcon" [hasChildren]="true">
              <mzn-navigation-option [title]="'專案設定 ' + i"></mzn-navigation-option>
              <mzn-navigation-option [title]="'成員管理 ' + i"></mzn-navigation-option>
            </mzn-navigation-option>
          }
          <footer mznNavigationFooter>
            <div mznNavigationUserMenu
              imgSrc="https://i.pravatar.cc/150?u=admin"
              [options]="userMenuOptions"
            >Very long username Very long username Very long username</div>
            <button icons mznNavigationIconButton [icon]="QuestionOutlineIcon"></button>
            <span icons mznBadge variant="dot-error">
              <button mznNavigationIconButton [icon]="NotificationIcon"></button>
            </span>
          </footer>
        </nav>
      </div>
    `,
    props: {
      items: Array.from({ length: 20 }, (_, i) => i + 1),
      HomeIcon,
      FileIcon,
      FolderIcon,
      QuestionOutlineIcon,
      NotificationIcon,
      userMenuOptions,
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
    MznNavigationUserMenu,
    MznBadge,
  ],
  template: `
    <div style="display: flex; gap: 48px; height: calc(100vh - 32px);">
      <!-- Nav 1: filter + hasIcon + hasLogo -->
      <nav
        mznNavigation
        [filter]="true"
        [activatedPath]="activatedPath()"
        (optionClick)="activatedPath.set($event)"
      >
        <header
          mznNavigationHeader
          title="企業管理平台"
          (brandClick)="onBrandClick()"
        >
          <span
            aria-label="logo"
            style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px; display: block;"
          ></span>
        </header>
        <mzn-navigation-option-category title="主要功能">
          <mzn-navigation-option
            title="儀表板"
            [icon]="HomeIcon"
          ></mzn-navigation-option>
          <mzn-navigation-option
            title="數據分析"
            [icon]="FileIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option
              title="銷售報表"
              href="/iframe.html"
            ></mzn-navigation-option>
            <mzn-navigation-option title="流量分析"></mzn-navigation-option>
            <mzn-navigation-option title="用戶行為"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="訂單管理"
            [icon]="ListIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="全部訂單"></mzn-navigation-option>
            <mzn-navigation-option title="待出貨"></mzn-navigation-option>
            <mzn-navigation-option title="退換貨處理"></mzn-navigation-option>
          </mzn-navigation-option>
        </mzn-navigation-option-category>
        <mzn-navigation-option-category title="內容管理">
          <mzn-navigation-option
            title="文章管理"
            [icon]="FileIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="文章列表" [hasChildren]="true">
              <mzn-navigation-option title="已發布"></mzn-navigation-option>
              <mzn-navigation-option title="草稿"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="分類設定"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="媒體庫"
            [icon]="FolderIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="圖片"></mzn-navigation-option>
            <mzn-navigation-option title="影片"></mzn-navigation-option>
            <mzn-navigation-option title="文件"></mzn-navigation-option>
          </mzn-navigation-option>
        </mzn-navigation-option-category>
        <mzn-navigation-option-category title="系統設定">
          <mzn-navigation-option
            title="用戶管理"
            [icon]="UserIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="用戶列表" [hasChildren]="true">
              <mzn-navigation-option title="活躍用戶"></mzn-navigation-option>
              <mzn-navigation-option title="停用帳號"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="角色權限"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="排程任務"
            [icon]="CalendarIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="定時任務" [hasChildren]="true">
              <mzn-navigation-option title="資料備份"></mzn-navigation-option>
              <mzn-navigation-option title="報表寄送"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="執行紀錄"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="系統設定"
            [icon]="SystemIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="基本設定" [hasChildren]="true">
              <mzn-navigation-option title="網站資訊"></mzn-navigation-option>
              <mzn-navigation-option title="SEO 設定"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="安全性設定"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="下載中心"
            href="#download-center"
            [icon]="DownloadIcon"
          ></mzn-navigation-option>
          <mzn-navigation-option
            title="匯入資料"
            [icon]="UploadIcon"
            (triggerClick)="onImportClick($event)"
          ></mzn-navigation-option>
        </mzn-navigation-option-category>
        <footer mznNavigationFooter>
          <div
            mznNavigationUserMenu
            imgSrc="https://i.pravatar.cc/150?u=manager"
            [options]="userMenuOptions"
            (optionSelected)="onUserMenuSelect($event)"
            >李經理</div
          >
          <button
            icons
            mznNavigationIconButton
            [icon]="QuestionOutlineIcon"
          ></button>
          <span icons mznBadge variant="dot-error">
            <button mznNavigationIconButton [icon]="NotificationIcon"></button>
          </span>
        </footer>
      </nav>

      <!-- Nav 2: filter + hasIcon + no logo -->
      <nav
        mznNavigation
        [filter]="true"
        [activatedPath]="activatedPath()"
        (optionClick)="activatedPath.set($event)"
      >
        <header
          mznNavigationHeader
          title="企業管理平台"
          (brandClick)="onBrandClick()"
        ></header>
        <mzn-navigation-option-category title="主要功能">
          <mzn-navigation-option
            title="儀表板"
            [icon]="HomeIcon"
          ></mzn-navigation-option>
          <mzn-navigation-option
            title="數據分析"
            [icon]="FileIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option
              title="銷售報表"
              href="/iframe.html"
            ></mzn-navigation-option>
            <mzn-navigation-option title="流量分析"></mzn-navigation-option>
            <mzn-navigation-option title="用戶行為"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="訂單管理"
            [icon]="ListIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="全部訂單"></mzn-navigation-option>
            <mzn-navigation-option title="待出貨"></mzn-navigation-option>
            <mzn-navigation-option title="退換貨處理"></mzn-navigation-option>
          </mzn-navigation-option>
        </mzn-navigation-option-category>
        <mzn-navigation-option-category title="內容管理">
          <mzn-navigation-option
            title="文章管理"
            [icon]="FileIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="文章列表" [hasChildren]="true">
              <mzn-navigation-option title="已發布"></mzn-navigation-option>
              <mzn-navigation-option title="草稿"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="分類設定"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="媒體庫"
            [icon]="FolderIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="圖片"></mzn-navigation-option>
            <mzn-navigation-option title="影片"></mzn-navigation-option>
            <mzn-navigation-option title="文件"></mzn-navigation-option>
          </mzn-navigation-option>
        </mzn-navigation-option-category>
        <mzn-navigation-option-category title="系統設定">
          <mzn-navigation-option
            title="用戶管理"
            [icon]="UserIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="用戶列表" [hasChildren]="true">
              <mzn-navigation-option title="活躍用戶"></mzn-navigation-option>
              <mzn-navigation-option title="停用帳號"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="角色權限"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="排程任務"
            [icon]="CalendarIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="定時任務" [hasChildren]="true">
              <mzn-navigation-option title="資料備份"></mzn-navigation-option>
              <mzn-navigation-option title="報表寄送"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="執行紀錄"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="系統設定"
            [icon]="SystemIcon"
            [hasChildren]="true"
          >
            <mzn-navigation-option title="基本設定" [hasChildren]="true">
              <mzn-navigation-option title="網站資訊"></mzn-navigation-option>
              <mzn-navigation-option title="SEO 設定"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="安全性設定"></mzn-navigation-option>
          </mzn-navigation-option>
          <mzn-navigation-option
            title="下載中心"
            href="#download-center"
            [icon]="DownloadIcon"
          ></mzn-navigation-option>
          <mzn-navigation-option
            title="匯入資料"
            [icon]="UploadIcon"
            (triggerClick)="onImportClick($event)"
          ></mzn-navigation-option>
        </mzn-navigation-option-category>
        <footer mznNavigationFooter>
          <div
            mznNavigationUserMenu
            imgSrc="https://i.pravatar.cc/150?u=manager"
            [options]="userMenuOptions"
            (optionSelected)="onUserMenuSelect($event)"
            >李經理</div
          >
          <button
            icons
            mznNavigationIconButton
            [icon]="QuestionOutlineIcon"
          ></button>
          <span icons mznBadge variant="dot-error">
            <button mznNavigationIconButton [icon]="NotificationIcon"></button>
          </span>
        </footer>
      </nav>

      <!-- Nav 3: collapsed + no icons + hasLogo -->
      <nav
        mznNavigation
        [collapsed]="collapsed()"
        [activatedPath]="activatedPath()"
        (collapseChange)="collapsed.set($event)"
        (optionClick)="activatedPath.set($event)"
      >
        <header
          mznNavigationHeader
          title="企業管理平台"
          (brandClick)="onBrandClick()"
        >
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
          <mzn-navigation-option title="排程任務" [hasChildren]="true">
            <mzn-navigation-option title="定時任務" [hasChildren]="true">
              <mzn-navigation-option title="資料備份"></mzn-navigation-option>
              <mzn-navigation-option title="報表寄送"></mzn-navigation-option>
            </mzn-navigation-option>
            <mzn-navigation-option title="執行紀錄"></mzn-navigation-option>
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
          <mzn-navigation-option
            title="匯入資料"
            (triggerClick)="onImportClick($event)"
          ></mzn-navigation-option>
        </mzn-navigation-option-category>
        <footer mznNavigationFooter>
          <div
            mznNavigationUserMenu
            imgSrc="https://i.pravatar.cc/150?u=manager"
            [options]="userMenuOptions"
            (optionSelected)="onUserMenuSelect($event)"
            >李經理</div
          >
          <button
            icons
            mznNavigationIconButton
            [icon]="QuestionOutlineIcon"
          ></button>
          <span icons mznBadge variant="dot-error">
            <button mznNavigationIconButton [icon]="NotificationIcon"></button>
          </span>
        </footer>
      </nav>

      <p style="height: 20px;">{{ activatedPath()?.join(' , ') }}</p>
    </div>
  `,
})
class NavigationAllStoryComponent {
  readonly HomeIcon = HomeIcon;
  readonly FileIcon = FileIcon;
  readonly ListIcon = ListIcon;
  readonly FolderIcon = FolderIcon;
  readonly UserIcon = UserIcon;
  readonly CalendarIcon = CalendarIcon;
  readonly SystemIcon = SystemIcon;
  readonly DownloadIcon = DownloadIcon;
  readonly UploadIcon = UploadIcon;
  readonly QuestionOutlineIcon = QuestionOutlineIcon;
  readonly NotificationIcon = NotificationIcon;
  readonly userMenuOptions = userMenuOptions;

  readonly activatedPath = signal<string[] | undefined>([
    '用戶管理',
    '用戶列表',
    '活躍用戶',
  ]);
  readonly collapsed = signal(true);

  protected onBrandClick(): void {
    alert('返回首頁');
  }

  protected onImportClick(event: {
    path: readonly string[];
    key: string;
    href?: string;
  }): void {
    alert(`匯入資料:${event.path.join(' > ')},目前項目:${event.key}`);
  }

  protected onUserMenuSelect(option: { id: string; name: string }): void {
    alert(option.name);
  }
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
