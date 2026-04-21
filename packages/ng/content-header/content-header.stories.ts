import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznContentHeader } from './content-header.component';
import { MznContentHeaderResponsive } from './content-header-responsive.component';
import { MznButton } from '../button/button.directive';
import { MznButtonGroup } from '../button/button-group.component';
import { MznIcon } from '../icon/icon.component';
import { MznInput } from '../input/input.component';
import { MznToggle } from '../toggle/toggle.component';
import { MznTypography } from '../typography/typography.directive';
import {
  ChevronLeftIcon,
  DotHorizontalIcon,
  MenuIcon,
  PlusIcon,
} from '@mezzanine-ui/icons';

export default {
  title: 'Navigation/ContentHeader',
  decorators: [
    moduleMetadata({
      imports: [
        MznContentHeader,
        MznContentHeaderResponsive,
        MznButton,
        MznButtonGroup,
        MznIcon,
        MznInput,
        MznToggle,
        MznTypography,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const MainSize: Story = {
  render: () => ({
    props: {
      ChevronLeftIcon,
      DotHorizontalIcon,
      MenuIcon,
      PlusIcon,
      onBackClick: (): void => {
        alert('返回商品列表');
      },
    },
    template: `
      <div style="display: grid; gap: 24px; max-width: 1280px;">
        <h3 mznTypography variant="h3">Main Size</h3>

        <header mznContentHeader
          title="商品詳細資料"
          description="檢視並編輯商品的基本資訊、價格與庫存設定"
          size="main"
        >
          <a contentHeaderBackButton href="/?path=/story/navigation-contentheader--main-size" title="back">
            <span mznButton variant="base-tertiary" size="sub" iconType="icon-only" aria-label="Back"><i mznIcon [icon]="ChevronLeftIcon" [size]="16"></i></span>
          </a>
          <div mznInput contentHeaderFilter variant="search" placeholder="搜尋商品名稱或 SKU..."></div>
          <div mznButtonGroup contentHeaderActions>
            <button mznButton variant="destructive-secondary">刪除</button>
            <button mznButton variant="base-secondary">儲存草稿</button>
            <button mznButton>發布商品</button>
          </div>
          <div contentHeaderUtilities style="display: contents">
            <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16"></i></button>
            <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="DotHorizontalIcon" [size]="16"></i></button>
          </div>
        </header>

        <header mznContentHeader title="料號管理" size="main">
          <a contentHeaderBackButton href="/?path=/story/navigation-contentheader--main-size" title="back">
            <span mznButton variant="base-tertiary" size="sub" iconType="icon-only" aria-label="Back"><i mznIcon [icon]="ChevronLeftIcon" [size]="16"></i></span>
          </a>
          <div mznInput contentHeaderFilter variant="search" placeholder="請輸入料號或產品名稱..."></div>
          <div mznButtonGroup contentHeaderActions>
            <button mznButton>查詢料號</button>
          </div>
          <div contentHeaderUtilities style="display: contents">
            <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16"></i></button>
            <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="DotHorizontalIcon" [size]="16"></i></button>
          </div>
        </header>

        <header mznContentHeader title="料號管理" description="響應式" size="main">
          <a contentHeaderBackButton href="/?path=/story/navigation-contentheader--main-size" title="back">
            <span mznButton variant="base-tertiary" size="sub" iconType="icon-only" aria-label="Back"><i mznIcon [icon]="ChevronLeftIcon" [size]="16"></i></span>
          </a>
          <div mznInput contentHeaderFilter variant="search" placeholder="請輸入料號或產品名稱..."></div>
          <div mznButtonGroup contentHeaderActions>
            <div mznContentHeaderResponsive breakpoint="above1080px">
              <button mznButton variant="destructive-secondary">批次刪除</button>
            </div>
            <button mznButton>查詢料號</button>
          </div>
          <div contentHeaderUtilities style="display: contents">
            <div mznContentHeaderResponsive breakpoint="above680px">
              <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16"></i></button>
            </div>
            <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="DotHorizontalIcon" [size]="16"></i></button>
          </div>
        </header>

        <header mznContentHeader
          title="商品庫存總覽"
          description="管理所有商品的上架狀態與庫存數量"
          size="main"
          [showBackButton]="true"
          (backClick)="onBackClick()"
        >
          <div mznInput contentHeaderFilter variant="search" placeholder="搜尋商品名稱..."></div>
          <div mznButtonGroup contentHeaderActions>
            <button mznButton variant="destructive-secondary">批次刪除</button>
            <button mznButton>新增商品</button>
          </div>
          <div contentHeaderUtilities style="display: contents">
            <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16"></i></button>
            <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="MenuIcon" [size]="16"></i></button>
            <button mznButton variant="base-secondary" iconType="icon-only"><i mznIcon [icon]="DotHorizontalIcon" [size]="16"></i></button>
          </div>
        </header>
      </div>
    `,
  }),
};

export const SubSize: Story = {
  render: () => ({
    props: { DotHorizontalIcon, PlusIcon },
    template: `
      <div style="display: grid; gap: 24px; max-width: 720px;">
        <h3 mznTypography variant="h3">Sub Size</h3>

        <header mznContentHeader title="文章編輯" size="sub">
          <div mznToggle contentHeaderFilter label="預覽模式" size="sub"></div>
          <div mznButtonGroup contentHeaderActions size="sub">
            <button mznButton variant="destructive-secondary">刪除文章</button>
            <button mznButton variant="base-secondary">儲存草稿</button>
            <button mznButton>發布文章</button>
          </div>
          <div contentHeaderUtilities style="display: contents">
            <button mznButton variant="base-secondary" size="sub" iconType="icon-only"><i mznIcon [icon]="DotHorizontalIcon" [size]="16"></i></button>
          </div>
        </header>

        <header mznContentHeader
          title="待辦事項清單"
          description="最後更新的資料會顯示在最上方"
          size="sub"
        >
          <div mznInput contentHeaderFilter variant="search" size="sub" placeholder="搜尋待辦事項..."></div>
          <div mznButtonGroup contentHeaderActions size="sub">
            <button mznButton>篩選查詢</button>
          </div>
          <div contentHeaderUtilities style="display: contents">
            <button mznButton variant="base-secondary" size="sub" iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16"></i></button>
            <button mznButton variant="base-secondary" size="sub" iconType="icon-only"><i mznIcon [icon]="DotHorizontalIcon" [size]="16"></i></button>
          </div>
        </header>

        <header mznContentHeader
          title="待辦事項清單"
          description="最後更新的資料會顯示在最上方"
          size="sub"
        >
          <div mznContentHeaderResponsive contentHeaderFilter breakpoint="above1080px" style="display: contents">
            <div mznInput variant="search" size="sub" placeholder="搜尋待辦事項..."></div>
          </div>
          <div mznButtonGroup contentHeaderActions size="sub">
            <button mznButton>篩選查詢</button>
          </div>
          <div contentHeaderUtilities style="display: contents">
            <button mznButton variant="base-secondary" size="sub" iconType="icon-only"><i mznIcon [icon]="PlusIcon" [size]="16"></i></button>
            <button mznButton variant="base-secondary" size="sub" iconType="icon-only"><i mznIcon [icon]="DotHorizontalIcon" [size]="16"></i></button>
          </div>
        </header>
      </div>
    `,
  }),
};
