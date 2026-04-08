import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznContentHeader } from './content-header.component';
import { MznContentHeaderResponsive } from './content-header-responsive.component';
import { MznButton } from '../button/button.directive';
import { MznButtonGroup } from '../button/button-group.component';
import { MznIcon } from '../icon/icon.component';
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
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const MainSize: Story = {
  render: () => ({
    props: { ChevronLeftIcon, DotHorizontalIcon, MenuIcon, PlusIcon },
    template: `
      <div style="display: grid; gap: 24px; max-width: 1280px;">

        <header mznContentHeader
          title="商品詳細資料"
          description="檢視並編輯商品的基本資訊、價格與庫存設定"
          size="main"
        >
          <a contentHeaderBackButton href="/?path=/story/navigation-contentheader--main-size" title="back">
            <button mznButton variant="base-tertiary" iconType="icon-only">
              <i mznIcon [icon]="ChevronLeftIcon" ></i>
            </button>
          </a>
          <div contentHeaderFilter>
            <input placeholder="搜尋商品名稱或 SKU..." style="border: 1px solid #ccc; padding: 4px 8px;" />
          </div>
          <mzn-button-group contentHeaderActions>
            <button mznButton variant="destructive-secondary">刪除</button>
            <button mznButton variant="base-secondary">儲存草稿</button>
            <button mznButton>發布商品</button>
          </mzn-button-group>
          <div contentHeaderUtilities>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="PlusIcon" ></i>
            </button>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="DotHorizontalIcon" ></i>
            </button>
          </div>
        </header>

        <header mznContentHeader title="料號管理" size="main">
          <a contentHeaderBackButton href="/?path=/story/navigation-contentheader--main-size" title="back">
            <button mznButton variant="base-tertiary" iconType="icon-only">
              <i mznIcon [icon]="ChevronLeftIcon" ></i>
            </button>
          </a>
          <div contentHeaderFilter>
            <input placeholder="請輸入料號或產品名稱..." style="border: 1px solid #ccc; padding: 4px 8px;" />
          </div>
          <mzn-button-group contentHeaderActions>
            <button mznButton>查詢料號</button>
          </mzn-button-group>
          <div contentHeaderUtilities>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="PlusIcon" ></i>
            </button>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="DotHorizontalIcon" ></i>
            </button>
          </div>
        </header>

        <header mznContentHeader title="料號管理" description="響應式" size="main">
          <a contentHeaderBackButton href="/?path=/story/navigation-contentheader--main-size" title="back">
            <button mznButton variant="base-tertiary" iconType="icon-only">
              <i mznIcon [icon]="ChevronLeftIcon" ></i>
            </button>
          </a>
          <div contentHeaderFilter>
            <input placeholder="請輸入料號或產品名稱..." style="border: 1px solid #ccc; padding: 4px 8px;" />
          </div>
          <mzn-button-group contentHeaderActions>
            <mzn-content-header-responsive breakpoint="above1080px">
              <button mznButton variant="destructive-secondary">批次刪除</button>
            </mzn-content-header-responsive>
            <button mznButton>查詢料號</button>
          </mzn-button-group>
          <div contentHeaderUtilities>
            <mzn-content-header-responsive breakpoint="above680px">
              <button mznButton variant="base-secondary" iconType="icon-only">
                <i mznIcon [icon]="PlusIcon" ></i>
              </button>
            </mzn-content-header-responsive>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="DotHorizontalIcon" ></i>
            </button>
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

        <header mznContentHeader title="文章編輯" size="sub">
          <div contentHeaderFilter>
            <label style="display: flex; align-items: center; gap: 4px;">
              <input type="checkbox" /> 預覽模式
            </label>
          </div>
          <mzn-button-group contentHeaderActions>
            <button mznButton variant="destructive-secondary">刪除文章</button>
            <button mznButton variant="base-secondary">儲存草稿</button>
            <button mznButton>發布文章</button>
          </mzn-button-group>
          <div contentHeaderUtilities>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="DotHorizontalIcon" ></i>
            </button>
          </div>
        </header>

        <header mznContentHeader
          title="待辦事項清單"
          description="最後更新的資料會顯示在最上方"
          size="sub"
        >
          <div contentHeaderFilter>
            <input placeholder="搜尋待辦事項..." style="border: 1px solid #ccc; padding: 4px 8px;" />
          </div>
          <mzn-button-group contentHeaderActions>
            <button mznButton>篩選查詢</button>
          </mzn-button-group>
          <div contentHeaderUtilities>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="PlusIcon" ></i>
            </button>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="DotHorizontalIcon" ></i>
            </button>
          </div>
        </header>

        <header mznContentHeader
          title="待辦事項清單"
          description="最後更新的資料會顯示在最上方"
          size="sub"
        >
          <div contentHeaderFilter>
            <mzn-content-header-responsive breakpoint="above1080px">
              <input placeholder="搜尋待辦事項..." style="border: 1px solid #ccc; padding: 4px 8px;" />
            </mzn-content-header-responsive>
          </div>
          <mzn-button-group contentHeaderActions>
            <button mznButton>篩選查詢</button>
          </mzn-button-group>
          <div contentHeaderUtilities>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="PlusIcon" ></i>
            </button>
            <button mznButton variant="base-secondary" iconType="icon-only">
              <i mznIcon [icon]="DotHorizontalIcon" ></i>
            </button>
          </div>
        </header>

      </div>
    `,
  }),
};
