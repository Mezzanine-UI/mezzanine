import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { DotHorizontalIcon, MenuIcon, PlusIcon } from '@mezzanine-ui/icons';
import MznButton from '../button/button.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznInput from '../input/input.vue';
import MznToggle from '../toggle/toggle.vue';
import MznTypography from '../typography/typography.vue';
import MznContentHeaderResponsive from './content-header-responsive.vue';
import MznContentHeader from './content-header.vue';

export default {
  component: MznContentHeader,
  title: 'Navigation/ContentHeader',
} as Meta<typeof MznContentHeader>;

type Story = StoryObj<typeof MznContentHeader>;

const backHref =
  '/?path=/story/navigation-contentheader--default&clickBack=main';

const STORY_COMPONENTS = {
  MznButton,
  MznContentHeader,
  MznContentHeaderResponsive,
  MznDropdown,
  MznInput,
  MznToggle,
  MznTypography,
};

export const MainSize: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      DotHorizontalIcon,
      PlusIcon,
      backHref,
      inventoryActions: [
        { children: '新增商品', variant: 'base-primary' as const },
        { children: '批次刪除', variant: 'destructive-secondary' as const },
      ],
      inventoryFilter: {
        placeholder: '搜尋商品名稱...',
        variant: 'search' as const,
      },
      inventoryUtilities: [
        { icon: PlusIcon, onClick: () => {} },
        { icon: MenuIcon, onClick: () => {} },
        {
          children: h(MznButton, { icon: DotHorizontalIcon }),
          options: [
            { id: '1', name: '匯出報表' },
            { id: '2', name: '列印清單' },
          ],
          placement: 'bottom-end' as const,
        },
      ],
      onBackClick: (): void => {
        alert('返回商品列表');
      },
      productOptions: [
        { id: '1', name: '編輯記錄' },
        { id: '2', name: '查看訂單' },
      ],
      refreshOptions: [
        { id: '1', name: '重新整理' },
        { id: '2', name: '批次移除', validate: 'danger' },
      ],
      responsiveOptions: [
        { id: '1', name: '重新整理' },
        { id: '2', name: '批次移除' },
      ],
    }),
    template: `
      <div style="display: grid; gap: 24px; max-width: 1280px">
        <MznTypography variant="h3">Main Size</MznTypography>
        <MznContentHeader
          description="檢視並編輯商品的基本資訊、價格與庫存設定"
          size="main"
          title="商品詳細資料"
        >
          <a :href="backHref" title="back" />
          <MznInput placeholder="搜尋商品名稱或 SKU..." variant="search" />
          <MznButton variant="destructive-secondary">刪除</MznButton>
          <MznButton variant="base-secondary">儲存草稿</MznButton>
          <MznButton>發布商品</MznButton>
          <MznButton :icon="PlusIcon" />
          <MznDropdown :options="productOptions" placement="bottom-end">
            <MznButton :icon="DotHorizontalIcon" />
          </MznDropdown>
        </MznContentHeader>

        <MznContentHeader size="main" title="料號管理">
          <a :href="backHref" title="back" />
          <MznInput placeholder="請輸入料號或產品名稱..." variant="search" />
          <MznButton>查詢料號</MznButton>
          <MznButton :icon="PlusIcon" />
          <MznDropdown :options="refreshOptions" placement="bottom-end">
            <MznButton :icon="DotHorizontalIcon" />
          </MznDropdown>
        </MznContentHeader>

        <MznContentHeader size="main" title="料號管理" description="響應式">
          <a :href="backHref" title="back" />
          <MznInput placeholder="請輸入料號或產品名稱..." variant="search" />
          <MznContentHeaderResponsive breakpoint="above1080px">
            <MznButton variant="destructive-secondary">批次刪除</MznButton>
          </MznContentHeaderResponsive>
          <MznButton>查詢料號</MznButton>
          <MznContentHeaderResponsive breakpoint="above680px">
            <MznButton :icon="PlusIcon" />
          </MznContentHeaderResponsive>
          <MznDropdown :options="responsiveOptions" placement="bottom-end">
            <MznButton :icon="DotHorizontalIcon" />
          </MznDropdown>
        </MznContentHeader>

        <MznContentHeader
          :actions="inventoryActions"
          description="管理所有商品的上架狀態與庫存數量"
          :filter="inventoryFilter"
          size="main"
          title="商品庫存總覽"
          :utilities="inventoryUtilities"
          @back-click="onBackClick"
        />
      </div>
    `,
  }),
};

export const SubSize: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      DotHorizontalIcon,
      PlusIcon,
      articleOptions: [
        { id: '1', name: '版本歷史' },
        { id: '2', name: '下架文章' },
      ],
      todoOptions: [
        { id: '1', name: '全部標為完成' },
        { id: '2', name: '清除已完成' },
      ],
    }),
    template: `
      <div style="display: grid; gap: 24px; max-width: 720px">
        <MznTypography variant="h3">Sub Size</MznTypography>
        <MznContentHeader size="sub" title="文章編輯">
          <MznToggle label="預覽模式" />
          <MznButton variant="destructive-secondary">刪除文章</MznButton>
          <MznButton variant="base-secondary">儲存草稿</MznButton>
          <MznButton>發布文章</MznButton>
          <MznDropdown :options="articleOptions" placement="bottom-end">
            <MznButton :icon="DotHorizontalIcon" />
          </MznDropdown>
        </MznContentHeader>

        <MznContentHeader
          description="最後更新的資料會顯示在最上方"
          size="sub"
          title="待辦事項清單"
        >
          <MznInput placeholder="搜尋待辦事項..." variant="search" />
          <MznButton>篩選查詢</MznButton>
          <MznButton :icon="PlusIcon" />
          <MznDropdown :options="todoOptions" placement="bottom-end">
            <MznButton :icon="DotHorizontalIcon" />
          </MznDropdown>
        </MznContentHeader>

        <MznContentHeader
          description="最後更新的資料會顯示在最上方"
          size="sub"
          title="待辦事項清單"
        >
          <MznContentHeaderResponsive breakpoint="above1080px">
            <MznInput placeholder="搜尋待辦事項..." variant="search" />
          </MznContentHeaderResponsive>
          <MznButton>篩選查詢</MznButton>
          <MznButton :icon="PlusIcon" />
          <MznDropdown :options="todoOptions" placement="bottom-end">
            <MznButton :icon="DotHorizontalIcon" />
          </MznDropdown>
        </MznContentHeader>
      </div>
    `,
  }),
};
