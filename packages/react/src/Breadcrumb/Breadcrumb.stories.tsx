import { StoryObj, Meta } from '@storybook/react-webpack5';
import Breadcrumb, { BreadcrumbProps } from '.';
import Typography from '../Typography';
import BreadcrumbItem from './BreadcrumbItem';

export default {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>;

type Story = StoryObj<BreadcrumbProps>;

const breadcrumbItem: BreadcrumbProps['items'] = [
  {
    id: 'home',
    name: 'Home',
    href: '/',
  },
  { id: 'category', name: 'Category', href: '/Category', target: '_blank' },
  {
    id: 'subcategory',
    name: 'Subcategory',
    href: '/Category/Subcategory',
    target: '_blank',
  },
  { id: 'tab', name: 'Tab', href: '/Category/Subcategory/Tab' },
  { id: 'detail', name: 'Detail', href: '/Category/Subcategory/Tab/Detail' },
  {
    id: 'history',
    name: 'History',
    href: '/Category/Subcategory/Tab/Detail/History',
  },
];

export const Basic: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '64px',
        paddingBottom: '160px',
      }}
    >
      <div style={{ display: 'grid', gap: '40px' }}>
        <Typography variant="h2">Default</Typography>

        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">3 items</Typography>
          <Breadcrumb items={breadcrumbItem.slice(0, 3)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">4 items</Typography>
          <Breadcrumb items={breadcrumbItem.slice(0, 4)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">5 items</Typography>
          <Breadcrumb items={breadcrumbItem.slice(0, 5)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">6 items</Typography>
          <Breadcrumb items={breadcrumbItem} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        <Typography variant="h2">Condensed Mode</Typography>

        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">2 items</Typography>
          <Breadcrumb condensed items={breadcrumbItem.slice(0, 2)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">3 items</Typography>
          <Breadcrumb condensed items={breadcrumbItem.slice(0, 3)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">4 items</Typography>
          <Breadcrumb condensed items={breadcrumbItem.slice(0, 4)} />
        </div>
      </div>
    </div>
  ),
};

const withDropdownHref = '/?path=/story/navigation-breadcrumb--with-dropdown';
export const WithDropdown: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '64px',
        paddingBottom: '160px',
      }}
    >
      <div style={{ display: 'grid', gap: '40px' }}>
        <Typography variant="h2">Item With Dropdown</Typography>
        <Breadcrumb>
          <BreadcrumbItem name="Home" href="/" />
          <BreadcrumbItem name="List" href="/" />
          <BreadcrumbItem name="History" href="/" />
          <BreadcrumbItem
            name="01"
            onSelect={(v) => alert(v.name)}
            options={[
              { id: '01', name: '01' },
              { id: '02', name: '02' },
              { id: '03', name: '03' },
            ]}
          />
        </Breadcrumb>

        <Breadcrumb
          items={[
            { id: 'Home', name: 'Home', href: '/' },
            { id: 'List', name: 'List', href: '/' },
            {
              id: 'Tab',
              name: 'Tab',
              options: [
                { id: 'tab1', name: 'tab1' },
                { id: 'tab2', name: 'tab2' },
                { id: 'tab3', name: 'tab3' },
              ],
            },
            {
              name: 'History',
              options: [
                { id: 'history', name: 'History' },
                { id: 'detail', name: 'Detail' },
                { id: 'order', name: 'Order' },
              ],
            },
            {
              name: '01',
              options: [
                { id: '01', name: '01' },
                { id: '02', name: '02' },
                { id: '03', name: '03' },
              ],
            },
          ]}
        />

        <Breadcrumb>
          <BreadcrumbItem name="首頁" href={withDropdownHref} />
          <BreadcrumbItem
            name="內容管理"
            options={[
              { id: '建案管理', name: '建案管理' },
              { id: '分類管理', name: '分類管理' },
            ]}
          />
          <BreadcrumbItem name="建築" href={withDropdownHref} />
        </Breadcrumb>

        <Breadcrumb>
          <BreadcrumbItem name="首頁" href={withDropdownHref} />
          <BreadcrumbItem name="內容管理" href={withDropdownHref} />
          <BreadcrumbItem name="相關新聞" href={withDropdownHref} />
          <BreadcrumbItem name="建案資訊" href={withDropdownHref} />
          <BreadcrumbItem name="活動新訊" href={withDropdownHref} />
          <BreadcrumbItem name="文章列表" href={withDropdownHref} />
          <BreadcrumbItem name="建築" href={withDropdownHref} />
        </Breadcrumb>

        <Typography variant="h2">Condensed</Typography>
        <Breadcrumb condensed>
          <BreadcrumbItem name="首頁" href={withDropdownHref} />
          <BreadcrumbItem
            name="建案管理"
            options={[
              { id: '建案基本資料', name: '建案基本資料' },
              { id: '戶型設定', name: '戶型設定' },
              { id: '預約參觀名單', name: '預約參觀名單' },
            ]}
          />
          <BreadcrumbItem
            name="分類管理"
            options={[
              { id: '分類清單', name: '分類清單' },
              { id: '新增分類', name: '新增分類' },
              { id: '分類排序', name: '分類排序' },
            ]}
          />
          <BreadcrumbItem name="文章列表" href={withDropdownHref} />
        </Breadcrumb>
      </div>
    </div>
  ),
};
