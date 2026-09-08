import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznTypography from '../typography/typography.vue';
import MznBreadcrumbItem from './breadcrumb-item.vue';
import MznBreadcrumb from './breadcrumb.vue';
import type { BreadcrumbProps } from './breadcrumb.types';

export default {
  title: 'Navigation/Breadcrumb',
  component: MznBreadcrumb,
} satisfies Meta<typeof MznBreadcrumb>;

type Story = StoryObj<BreadcrumbProps>;

const breadcrumbItem: NonNullable<BreadcrumbProps['items']> = [
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
  render: () => ({
    components: { MznBreadcrumb, MznTypography },
    setup: () => ({
      items: breadcrumbItem,
      items2: breadcrumbItem.slice(0, 2),
      items3: breadcrumbItem.slice(0, 3),
      items4: breadcrumbItem.slice(0, 4),
      items5: breadcrumbItem.slice(0, 5),
    }),
    template: `
      <div style="display: grid; gap: 64px; padding-bottom: 160px">
        <div style="display: grid; gap: 40px">
          <MznTypography variant="h2">Default</MznTypography>

          <div style="display: grid; gap: 8px">
            <MznTypography variant="caption-highlight">3 items</MznTypography>
            <MznBreadcrumb :items="items3" />
          </div>
          <div style="display: grid; gap: 8px">
            <MznTypography variant="caption-highlight">4 items</MznTypography>
            <MznBreadcrumb :items="items4" />
          </div>
          <div style="display: grid; gap: 8px">
            <MznTypography variant="caption-highlight">5 items</MznTypography>
            <MznBreadcrumb :items="items5" />
          </div>
          <div style="display: grid; gap: 8px">
            <MznTypography variant="caption-highlight">6 items</MznTypography>
            <MznBreadcrumb :items="items" />
          </div>
        </div>

        <div style="display: grid; gap: 24px">
          <MznTypography variant="h2">Condensed Mode</MznTypography>

          <div style="display: grid; gap: 8px">
            <MznTypography variant="caption-highlight">2 items</MznTypography>
            <MznBreadcrumb condensed :items="items2" />
          </div>
          <div style="display: grid; gap: 8px">
            <MznTypography variant="caption-highlight">3 items</MznTypography>
            <MznBreadcrumb condensed :items="items3" />
          </div>
          <div style="display: grid; gap: 8px">
            <MznTypography variant="caption-highlight">4 items</MznTypography>
            <MznBreadcrumb condensed :items="items4" />
          </div>
        </div>
      </div>
    `,
  }),
};

const withDropdownHref = '/?path=/story/navigation-breadcrumb--with-dropdown';

export const WithDropdown: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    components: { MznBreadcrumb, MznBreadcrumbItem, MznTypography },
    setup: () => ({
      contentOptions: [
        { id: '建案管理', name: '建案管理' },
        { id: '分類管理', name: '分類管理' },
      ],
      itemsWithDropdown: [
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
      ],
      numberOptions: [
        { id: '01', name: '01' },
        { id: '02', name: '02' },
        { id: '03', name: '03' },
      ],
      onSelect: (option: { name: string }): void => {
        alert(option.name);
      },
      projectOptions: [
        { id: '建案基本資料', name: '建案基本資料' },
        { id: '戶型設定', name: '戶型設定' },
        { id: '預約參觀名單', name: '預約參觀名單' },
      ],
      categoryOptions: [
        { id: '分類清單', name: '分類清單' },
        { id: '新增分類', name: '新增分類' },
        { id: '分類排序', name: '分類排序' },
      ],
      withDropdownHref,
    }),
    template: `
      <div style="display: grid; gap: 64px; padding-bottom: 160px">
        <div style="display: grid; gap: 40px">
          <MznTypography variant="h2">Item With Dropdown</MznTypography>
          <MznBreadcrumb>
            <MznBreadcrumbItem name="Home" href="/" />
            <MznBreadcrumbItem name="List" href="/" />
            <MznBreadcrumbItem name="History" href="/" />
            <MznBreadcrumbItem name="01" :options="numberOptions" @select="onSelect" />
          </MznBreadcrumb>

          <MznBreadcrumb :items="itemsWithDropdown" />

          <MznBreadcrumb>
            <MznBreadcrumbItem name="首頁" :href="withDropdownHref" />
            <MznBreadcrumbItem name="內容管理" :options="contentOptions" />
            <MznBreadcrumbItem name="建築" :href="withDropdownHref" />
          </MznBreadcrumb>

          <MznBreadcrumb>
            <MznBreadcrumbItem name="首頁" :href="withDropdownHref" />
            <MznBreadcrumbItem name="內容管理" :href="withDropdownHref" />
            <MznBreadcrumbItem name="相關新聞" :href="withDropdownHref" />
            <MznBreadcrumbItem name="建案資訊" :href="withDropdownHref" />
            <MznBreadcrumbItem name="活動新訊" :href="withDropdownHref" />
            <MznBreadcrumbItem name="文章列表" :href="withDropdownHref" />
            <MznBreadcrumbItem name="建築" :href="withDropdownHref" />
          </MznBreadcrumb>

          <MznTypography variant="h2">Condensed</MznTypography>
          <MznBreadcrumb condensed>
            <MznBreadcrumbItem name="首頁" :href="withDropdownHref" />
            <MznBreadcrumbItem name="建案管理" :options="projectOptions" />
            <MznBreadcrumbItem name="分類管理" :options="categoryOptions" />
            <MznBreadcrumbItem name="文章列表" :href="withDropdownHref" />
          </MznBreadcrumb>
        </div>
      </div>
    `,
  }),
};
