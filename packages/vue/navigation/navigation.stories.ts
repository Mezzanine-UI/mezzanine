import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import type { FunctionalComponent } from 'vue';
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
import MznBadge from '../badge/badge.vue';
import MznNavigationFooter from './navigation-footer.vue';
import MznNavigationHeader from './navigation-header.vue';
import MznNavigationIconButton from './navigation-icon-button.vue';
import MznNavigationOptionCategory from './navigation-option-category.vue';
import MznNavigationOption from './navigation-option.vue';
import MznNavigationUserMenu from './navigation-user-menu.vue';
import MznNavigation from './navigation.vue';

export default {
  title: 'Navigation/Navigation',
} as Meta;

const userMenuOptions = [
  { id: 'member', name: '帳號設定' },
  { id: 'logout', name: '登出' },
];

const STORY_COMPONENTS = {
  MznBadge,
  MznNavigation,
  MznNavigationFooter,
  MznNavigationHeader,
  MznNavigationIconButton,
  MznNavigationOption,
  MznNavigationOptionCategory,
  MznNavigationUserMenu,
};

type Story = StoryObj;

export const Basic: Story = {
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const activatedPath = ref(['首頁']);

      return {
        FileIcon,
        FolderIcon,
        HomeIcon,
        ListIcon,
        NotificationIcon,
        QuestionOutlineIcon,
        UserIcon,
        activatedPath,
        args,
        onOptionClick: (activePath?: string[]): void => {
          if (activePath) activatedPath.value = activePath;
        },
        userMenuOptions,
      };
    },
    template: `
      <div style="display: grid; height: calc(100vh - 32px)">
        <MznNavigation
          :activatedPath="activatedPath"
          v-bind="args"
          @option-click="onOptionClick"
        >
          <MznNavigationHeader title="Mezzanine">
            <span
              aria-label="logo"
              style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px"
            />
          </MznNavigationHeader>
          <MznNavigationOption :icon="HomeIcon" title="首頁" />
          <MznNavigationOption :icon="FileIcon" title="數據分析">
            <MznNavigationOption title="流量報表" />
            <MznNavigationOption title="轉換率分析" />
          </MznNavigationOption>
          <MznNavigationOption :icon="ListIcon" title="訂單管理">
            <MznBadge :count="5" variant="count-brand" />
            <MznNavigationOption title="待處理訂單" />
            <MznNavigationOption title="已完成訂單" />
          </MznNavigationOption>
          <MznNavigationOption
            :icon="NotificationIcon"
            title="通知中心"
            href="/notifications"
          >
            <MznBadge :count="8" variant="count-alert" />
          </MznNavigationOption>
          <MznNavigationOption :icon="UserIcon" title="會員管理" />
          <MznNavigationOption
            v-for="index in 5"
            :key="index"
            :icon="FolderIcon"
            :title="'專案 ' + index"
          >
            <MznNavigationOption :title="'專案設定 ' + index" />
            <MznNavigationOption :title="'成員管理 ' + index" />
          </MznNavigationOption>
          <MznNavigationFooter>
            <MznNavigationUserMenu
              imgSrc="https://i.pravatar.cc/150?u=admin"
              :options="userMenuOptions"
            >
              王小明
            </MznNavigationUserMenu>
            <MznNavigationIconButton aria-label="說明" :icon="QuestionOutlineIcon" />
            <MznBadge variant="dot-error">
              <MznNavigationIconButton aria-label="通知" :icon="NotificationIcon" />
            </MznBadge>
          </MznNavigationFooter>
        </MznNavigation>
      </div>
    `,
  }),
};

export const LeafWithBadge: Story = {
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const activatedPath = ref(['通知中心']);

      return {
        FileIcon,
        ListIcon,
        NotificationIcon,
        activatedPath,
        args,
        onOptionClick: (activePath?: string[]): void => {
          if (activePath) activatedPath.value = activePath;
        },
      };
    },
    template: `
      <div style="display: grid; height: calc(100vh - 32px)">
        <MznNavigation
          :activatedPath="activatedPath"
          v-bind="args"
          @option-click="onOptionClick"
        >
          <MznNavigationHeader title="Mezzanine">
            <span
              aria-label="logo"
              style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px"
            />
          </MznNavigationHeader>
          <MznNavigationOption
            :icon="NotificationIcon"
            title="通知中心"
            href="/notifications"
          >
            <MznBadge :count="8" variant="count-alert" />
          </MznNavigationOption>
          <MznNavigationOption :icon="ListIcon" title="訂單管理" href="/orders">
            <MznBadge :count="5" variant="count-brand" />
          </MznNavigationOption>
          <MznNavigationOption :icon="FileIcon" title="數據分析">
            <MznBadge :count="2" variant="count-brand" />
            <MznNavigationOption title="流量報表" />
            <MznNavigationOption title="轉換率分析" />
          </MznNavigationOption>
        </MznNavigation>
      </div>
    `,
  }),
};

/**
 * React's story renders `<a data-message="MyComponent" href {...rest}>`; here
 * everything the option hands the anchor arrives as attributes, so they are
 * spread rather than destructured.
 */
const MyComponent: FunctionalComponent = (_props, { attrs, slots }) =>
  h('a', { 'data-message': 'MyComponent', ...attrs }, slots.default?.());

MyComponent.inheritAttrs = false;

export const CustomAnchorComponent: Story = {
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const activatedPath = ref(['數據分析', '流量報表']);

      return {
        FileIcon,
        FolderIcon,
        HomeIcon,
        ListIcon,
        MyComponent,
        NotificationIcon,
        QuestionOutlineIcon,
        UserIcon,
        activatedPath,
        args,
        onOptionClick: (activePath?: string[]): void => {
          if (activePath) activatedPath.value = activePath;
        },
        userMenuOptions,
      };
    },
    template: `
      <div style="display: grid; height: calc(100vh - 32px)">
        <MznNavigation
          :activatedPath="activatedPath"
          :optionsAnchorComponent="MyComponent"
          v-bind="args"
          @option-click="onOptionClick"
        >
          <MznNavigationHeader title="Mezzanine">
            <span
              aria-label="logo"
              style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px"
            />
          </MznNavigationHeader>
          <MznNavigationOption
            :icon="HomeIcon"
            title="首頁"
            href="http://localhost:6006/?path=/story/navigation-navigation--basic"
          />
          <MznNavigationOption :defaultOpen="true" :icon="FileIcon" title="數據分析">
            <MznNavigationOption
              title="流量報表"
              href="http://localhost:6006/?path=/story/navigation-navigation--custom-anchor-component#report1"
            />
            <MznNavigationOption
              title="轉換率分析"
              href="http://localhost:6006/?path=/story/navigation-navigation--custom-anchor-component#report2"
            />
          </MznNavigationOption>
          <MznNavigationOption :icon="ListIcon" title="訂單管理">
            <MznBadge :count="5" variant="count-brand" />
            <MznNavigationOption title="待處理訂單" />
            <MznNavigationOption title="已完成訂單" />
          </MznNavigationOption>
          <MznNavigationOption :icon="UserIcon" title="會員管理" />
          <MznNavigationOption
            v-for="index in 5"
            :key="index"
            :icon="FolderIcon"
            :title="'專案 ' + index"
          >
            <MznNavigationOption :title="'專案設定 ' + index" />
            <MznNavigationOption :title="'成員管理 ' + index" />
          </MznNavigationOption>
          <MznNavigationFooter>
            <MznNavigationUserMenu
              imgSrc="https://i.pravatar.cc/150?u=admin"
              :options="userMenuOptions"
            >
              王小明
            </MznNavigationUserMenu>
            <MznNavigationIconButton aria-label="說明" :icon="QuestionOutlineIcon" />
            <MznBadge variant="dot-error">
              <MznNavigationIconButton aria-label="通知" :icon="NotificationIcon" />
            </MznBadge>
          </MznNavigationFooter>
        </MznNavigation>
      </div>
    `,
  }),
};

export const Overflow: Story = {
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      FileIcon,
      FolderIcon,
      HomeIcon,
      NotificationIcon,
      QuestionOutlineIcon,
      args,
      userMenuOptions,
    }),
    template: `
      <div style="display: grid; height: calc(100vh - 32px)">
        <MznNavigation v-bind="args">
          <MznNavigationHeader title="Mezzanine">
            <span
              aria-label="logo"
              style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px"
            />
          </MznNavigationHeader>
          <MznNavigationOption
            :icon="HomeIcon"
            title="首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁首頁"
          />
          <MznNavigationOption :icon="FileIcon" title="數據分析">
            <MznNavigationOption
              title="流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表流量報表"
            />
            <MznNavigationOption
              title="轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析轉換率分析"
            />
          </MznNavigationOption>
          <MznNavigationOption
            v-for="index in 20"
            :key="index"
            :icon="FolderIcon"
            :title="'專案 ' + index"
          >
            <MznNavigationOption :title="'專案設定 ' + index" />
            <MznNavigationOption :title="'成員管理 ' + index" />
          </MznNavigationOption>
          <MznNavigationFooter>
            <MznNavigationUserMenu
              imgSrc="https://i.pravatar.cc/150?u=admin"
              :options="userMenuOptions"
            >
              Very long username Very long username Very long username
            </MznNavigationUserMenu>
            <MznNavigationIconButton aria-label="說明" :icon="QuestionOutlineIcon" />
            <MznBadge variant="dot-error">
              <MznNavigationIconButton aria-label="通知" :icon="NotificationIcon" />
            </MznBadge>
          </MznNavigationFooter>
        </MznNavigation>
      </div>
    `,
  }),
};

export const All: Story = {
  args: {},
  argTypes: {},
  parameters: {
    // 移除預設padding
    layout: 'fullscreen',
  },
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const active = ref<string[] | undefined>(undefined);
      const collapsed = ref(true);

      return {
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
        active,
        collapsed,
        onBrandClick: (): void => {
          alert('返回首頁');
        },
        onCollapseChange: (next: boolean): void => {
          collapsed.value = next;
        },
        onImport: (path: string[], currentKey: string): void => {
          alert(`匯入資料：${path.join(' > ')}，目前項目：${currentKey}`);
        },
        onOptionClick: (activePath?: string[]): void => {
          active.value = activePath;
        },
        onUserSelect: (option: { name: string }): void => {
          alert(option.name);
        },
        userMenuOptions,
      };
    },
    template: `
      <div style="display: flex; gap: 48px; height: calc(100vh - 32px)">
        <MznNavigation :activatedPath="active" filter @option-click="onOptionClick">
          <MznNavigationHeader title="企業管理平台" @brand-click="onBrandClick">
            <span
              aria-label="logo"
              style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px"
            />
          </MznNavigationHeader>
          <MznNavigationOptionCategory title="主要功能">
            <MznNavigationOption :icon="HomeIcon" title="儀表板" />
            <MznNavigationOption :icon="FileIcon" title="數據分析">
              <MznNavigationOption title="銷售報表" href="/iframe.html" />
              <MznNavigationOption title="流量分析" />
              <MznNavigationOption title="用戶行為" />
            </MznNavigationOption>
            <MznNavigationOption :icon="ListIcon" title="訂單管理">
              <MznNavigationOption title="全部訂單" />
              <MznNavigationOption title="待出貨" />
              <MznNavigationOption title="退換貨處理" />
            </MznNavigationOption>
          </MznNavigationOptionCategory>
          <MznNavigationOptionCategory title="內容管理">
            <MznNavigationOption :icon="FileIcon" title="文章管理">
              <MznNavigationOption title="文章列表">
                <MznNavigationOption title="已發布" />
                <MznNavigationOption title="草稿" />
              </MznNavigationOption>
              <MznNavigationOption title="分類設定" />
            </MznNavigationOption>
            <MznNavigationOption :icon="FolderIcon" title="媒體庫">
              <MznNavigationOption title="圖片" />
              <MznNavigationOption title="影片" />
              <MznNavigationOption title="文件" />
            </MznNavigationOption>
          </MznNavigationOptionCategory>
          <MznNavigationOptionCategory title="系統設定">
            <MznNavigationOption :icon="UserIcon" title="用戶管理">
              <MznNavigationOption title="用戶列表">
                <MznNavigationOption title="活躍用戶" />
                <MznNavigationOption title="停用帳號" />
              </MznNavigationOption>
              <MznNavigationOption title="角色權限" />
            </MznNavigationOption>
            <MznNavigationOption :icon="CalendarIcon" title="排程任務">
              <MznNavigationOption title="定時任務">
                <MznNavigationOption title="資料備份" />
                <MznNavigationOption title="報表寄送" />
              </MznNavigationOption>
              <MznNavigationOption title="執行紀錄" />
            </MznNavigationOption>
            <MznNavigationOption :icon="SystemIcon" title="系統設定">
              <MznNavigationOption title="基本設定">
                <MznNavigationOption title="網站資訊" />
                <MznNavigationOption title="SEO 設定" />
              </MznNavigationOption>
              <MznNavigationOption title="安全性設定" />
            </MznNavigationOption>
            <MznNavigationOption
              href="#download-center"
              :icon="DownloadIcon"
              title="下載中心"
            />
            <MznNavigationOption
              :icon="UploadIcon"
              title="匯入資料"
              @trigger-click="onImport"
            />
          </MznNavigationOptionCategory>
          <MznNavigationFooter>
            <MznNavigationUserMenu
              imgSrc="https://i.pravatar.cc/150?u=manager"
              :options="userMenuOptions"
              @select="onUserSelect"
            >
              李經理
            </MznNavigationUserMenu>
            <MznNavigationIconButton aria-label="說明" :icon="QuestionOutlineIcon" />
            <MznBadge variant="dot-error">
              <MznNavigationIconButton aria-label="通知" :icon="NotificationIcon" />
            </MznBadge>
          </MznNavigationFooter>
        </MznNavigation>
        <MznNavigation :activatedPath="active" filter @option-click="onOptionClick">
          <MznNavigationHeader title="企業管理平台" @brand-click="onBrandClick" />
          <MznNavigationOptionCategory title="主要功能">
            <MznNavigationOption :icon="HomeIcon" title="儀表板" />
            <MznNavigationOption :icon="FileIcon" title="數據分析">
              <MznNavigationOption title="銷售報表" href="/iframe.html" />
              <MznNavigationOption title="流量分析" />
              <MznNavigationOption title="用戶行為" />
            </MznNavigationOption>
            <MznNavigationOption :icon="ListIcon" title="訂單管理">
              <MznNavigationOption title="全部訂單" />
              <MznNavigationOption title="待出貨" />
              <MznNavigationOption title="退換貨處理" />
            </MznNavigationOption>
          </MznNavigationOptionCategory>
          <MznNavigationOptionCategory title="內容管理">
            <MznNavigationOption :icon="FileIcon" title="文章管理">
              <MznNavigationOption title="文章列表">
                <MznNavigationOption title="已發布" />
                <MznNavigationOption title="草稿" />
              </MznNavigationOption>
              <MznNavigationOption title="分類設定" />
            </MznNavigationOption>
            <MznNavigationOption :icon="FolderIcon" title="媒體庫">
              <MznNavigationOption title="圖片" />
              <MznNavigationOption title="影片" />
              <MznNavigationOption title="文件" />
            </MznNavigationOption>
          </MznNavigationOptionCategory>
          <MznNavigationOptionCategory title="系統設定">
            <MznNavigationOption :icon="UserIcon" title="用戶管理">
              <MznNavigationOption title="用戶列表">
                <MznNavigationOption title="活躍用戶" />
                <MznNavigationOption title="停用帳號" />
              </MznNavigationOption>
              <MznNavigationOption title="角色權限" />
            </MznNavigationOption>
            <MznNavigationOption :icon="CalendarIcon" title="排程任務">
              <MznNavigationOption title="定時任務">
                <MznNavigationOption title="資料備份" />
                <MznNavigationOption title="報表寄送" />
              </MznNavigationOption>
              <MznNavigationOption title="執行紀錄" />
            </MznNavigationOption>
            <MznNavigationOption :icon="SystemIcon" title="系統設定">
              <MznNavigationOption title="基本設定">
                <MznNavigationOption title="網站資訊" />
                <MznNavigationOption title="SEO 設定" />
              </MznNavigationOption>
              <MznNavigationOption title="安全性設定" />
            </MznNavigationOption>
            <MznNavigationOption
              href="#download-center"
              :icon="DownloadIcon"
              title="下載中心"
            />
            <MznNavigationOption
              :icon="UploadIcon"
              title="匯入資料"
              @trigger-click="onImport"
            />
          </MznNavigationOptionCategory>
          <MznNavigationFooter>
            <MznNavigationUserMenu
              imgSrc="https://i.pravatar.cc/150?u=manager"
              :options="userMenuOptions"
              @select="onUserSelect"
            >
              李經理
            </MznNavigationUserMenu>
            <MznNavigationIconButton aria-label="說明" :icon="QuestionOutlineIcon" />
            <MznBadge variant="dot-error">
              <MznNavigationIconButton aria-label="通知" :icon="NotificationIcon" />
            </MznBadge>
          </MznNavigationFooter>
        </MznNavigation>
        <MznNavigation
          :activatedPath="active"
          :collapsed="collapsed"
          @collapse-change="onCollapseChange"
          @option-click="onOptionClick"
        >
          <MznNavigationHeader title="企業管理平台" @brand-click="onBrandClick">
            <span
              aria-label="logo"
              style="background-color: #5D74E9; border-radius: 4px; height: 28px; width: 28px"
            />
          </MznNavigationHeader>
          <MznNavigationOptionCategory title="主要功能">
            <MznNavigationOption title="儀表板" />
            <MznNavigationOption title="數據分析">
              <MznNavigationOption title="銷售報表" href="/iframe.html" />
              <MznNavigationOption title="流量分析" />
              <MznNavigationOption title="用戶行為" />
            </MznNavigationOption>
            <MznNavigationOption title="訂單管理">
              <MznNavigationOption title="全部訂單" />
              <MznNavigationOption title="待出貨" />
              <MznNavigationOption title="退換貨處理" />
            </MznNavigationOption>
          </MznNavigationOptionCategory>
          <MznNavigationOptionCategory title="內容管理">
            <MznNavigationOption title="文章管理">
              <MznNavigationOption title="文章列表">
                <MznNavigationOption title="已發布" />
                <MznNavigationOption title="草稿" />
              </MznNavigationOption>
              <MznNavigationOption title="分類設定" />
            </MznNavigationOption>
            <MznNavigationOption title="媒體庫">
              <MznNavigationOption title="圖片" />
              <MznNavigationOption title="影片" />
              <MznNavigationOption title="文件" />
            </MznNavigationOption>
          </MznNavigationOptionCategory>
          <MznNavigationOptionCategory title="系統設定">
            <MznNavigationOption title="用戶管理">
              <MznNavigationOption title="用戶列表">
                <MznNavigationOption title="活躍用戶" />
                <MznNavigationOption title="停用帳號" />
              </MznNavigationOption>
              <MznNavigationOption title="角色權限" />
            </MznNavigationOption>
            <MznNavigationOption title="排程任務">
              <MznNavigationOption title="定時任務">
                <MznNavigationOption title="資料備份" />
                <MznNavigationOption title="報表寄送" />
              </MznNavigationOption>
              <MznNavigationOption title="執行紀錄" />
            </MznNavigationOption>
            <MznNavigationOption title="系統設定">
              <MznNavigationOption title="基本設定">
                <MznNavigationOption title="網站資訊" />
                <MznNavigationOption title="SEO 設定" />
              </MznNavigationOption>
              <MznNavigationOption title="安全性設定" />
            </MznNavigationOption>
            <MznNavigationOption href="#download-center" title="下載中心" />
            <MznNavigationOption title="匯入資料" @trigger-click="onImport" />
          </MznNavigationOptionCategory>
          <MznNavigationFooter>
            <MznNavigationUserMenu
              imgSrc="https://i.pravatar.cc/150?u=manager"
              :options="userMenuOptions"
              @select="onUserSelect"
            >
              李經理
            </MznNavigationUserMenu>
            <MznNavigationIconButton aria-label="說明" :icon="QuestionOutlineIcon" />
            <MznBadge variant="dot-error">
              <MznNavigationIconButton aria-label="通知" :icon="NotificationIcon" />
            </MznBadge>
          </MznNavigationFooter>
        </MznNavigation>
        <p style="height: 20px">{{ active?.join(' , ') }}</p>
      </div>
    `,
  }),
};
