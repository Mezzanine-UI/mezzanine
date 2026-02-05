import { Meta, StoryObj } from '@storybook/react-webpack5';
import ContentHeader from '.';
import { DotHorizontalIcon, MenuIcon, PlusIcon } from '@mezzanine-ui/icons';
import Button from '../Button';
import Input from '../Input';
import Dropdown from '../Dropdown';
import Typography from '../Typography';
import Toggle from '../Toggle';
import ContentHeaderResponsive from './ContentHeaderResponsive';

export default {
  component: ContentHeader,
  title: 'Navigation/ContentHeader',
} as Meta<typeof ContentHeader>;

type Story = StoryObj<typeof ContentHeader>;

export const MainSize: Story = {
  render: () => (
    <>
      <div style={{ display: 'grid', gap: '24px', maxWidth: '1280px' }}>
        <Typography variant="h3">Main Size</Typography>
        <ContentHeader
          description="檢視並編輯商品的基本資訊、價格與庫存設定"
          size="main"
          title="商品詳細資料"
        >
          <a
            href="/?path=/story/navigation-contentheader--default&clickBack=main"
            title="back"
          />
          <Input placeholder="搜尋商品名稱或 SKU..." variant="search" />
          <Button variant="destructive-secondary">刪除</Button>
          <Button variant="base-secondary">儲存草稿</Button>
          <Button>發布商品</Button>
          <>
            <Button icon={PlusIcon} />
            <Dropdown
              options={[
                { id: '1', name: '編輯記錄' },
                { id: '2', name: '查看訂單' },
              ]}
              placement="bottom-end"
            >
              <Button icon={DotHorizontalIcon} />
            </Dropdown>
          </>
        </ContentHeader>

        <ContentHeader size="main" title="料號管理">
          <a
            href="/?path=/story/navigation-contentheader--default&clickBack=main"
            title="back"
          />
          <Input placeholder="請輸入料號或產品名稱..." variant="search" />
          <Button>查詢料號</Button>
          <>
            <Button icon={PlusIcon} />
            <Dropdown
              options={[
                { id: '1', name: '重新整理' },
                { id: '2', name: '批次移除', validate: 'danger' },
              ]}
              placement="bottom-end"
            >
              <Button icon={DotHorizontalIcon} />
            </Dropdown>
          </>
        </ContentHeader>

        <ContentHeader size="main" title="料號管理" description="響應式">
          <a
            href="/?path=/story/navigation-contentheader--default&clickBack=main"
            title="back"
          />
          <Input placeholder="請輸入料號或產品名稱..." variant="search" />
          <ContentHeaderResponsive breakpoint="above1080px">
            <Button variant="destructive-primary">批次刪除</Button>
          </ContentHeaderResponsive>
          <Button>查詢料號</Button>
          <>
            <Button icon={PlusIcon} />
            <Dropdown
              options={[
                { id: '1', name: '重新整理' },
                { id: '2', name: '批次移除' },
              ]}
              placement="bottom-end"
            >
              <Button icon={DotHorizontalIcon} />
            </Dropdown>
          </>
        </ContentHeader>

        <ContentHeader
          actions={[
            { children: '新增商品', variant: 'base-primary' },
            { children: '批次刪除', variant: 'destructive-secondary' },
          ]}
          description="管理所有商品的上架狀態與庫存數量"
          filter={{
            placeholder: '搜尋商品名稱...',
            variant: 'search',
          }}
          onBackClick={() => alert('返回商品列表')}
          size="main"
          title="商品庫存總覽"
          utilities={[
            {
              icon: PlusIcon,
              onClick: () => {},
            },
            {
              icon: MenuIcon,
              onClick: () => {},
            },
            {
              children: <Button icon={DotHorizontalIcon} />,
              options: [
                { id: '1', name: '匯出報表' },
                { id: '2', name: '列印清單' },
              ],
              placement: 'bottom-end',
            },
          ]}
        />
      </div>
    </>
  ),
};

export const SubSize: Story = {
  render: () => (
    <>
      <div style={{ display: 'grid', gap: '24px', maxWidth: '720px' }}>
        <Typography variant="h3">Sub Size</Typography>
        <ContentHeader size="sub" title="文章編輯">
          <Toggle label="預覽模式" />
          <Button variant="destructive-secondary">刪除文章</Button>
          <Button variant="base-secondary">儲存草稿</Button>
          <Button>發布文章</Button>
          <Dropdown
            options={[
              { id: '1', name: '版本歷史' },
              { id: '2', name: '下架文章' },
            ]}
            placement="bottom-end"
          >
            <Button icon={DotHorizontalIcon} />
          </Dropdown>
        </ContentHeader>

        <ContentHeader
          description="最後更新的資料會顯示在最上方"
          size="sub"
          title="待辦事項清單"
        >
          <Input placeholder="搜尋待辦事項..." variant="search" />
          <Button>篩選查詢</Button>
          <>
            <Button icon={PlusIcon} />
            <Dropdown
              options={[
                { id: '1', name: '全部標為完成' },
                { id: '2', name: '清除已完成' },
              ]}
              placement="bottom-end"
            >
              <Button icon={DotHorizontalIcon} />
            </Dropdown>
          </>
        </ContentHeader>

        <ContentHeader
          description="最後更新的資料會顯示在最上方"
          size="sub"
          title="待辦事項清單"
        >
          <ContentHeaderResponsive breakpoint="above1080px">
            <Input placeholder="搜尋待辦事項..." variant="search" />
          </ContentHeaderResponsive>
          <Button>篩選查詢</Button>
          <>
            <Button icon={PlusIcon} />
            <Dropdown
              options={[
                { id: '1', name: '全部標為完成' },
                { id: '2', name: '清除已完成' },
              ]}
              placement="bottom-end"
            >
              <Button icon={DotHorizontalIcon} />
            </Dropdown>
          </>
        </ContentHeader>
      </div>
    </>
  ),
};
