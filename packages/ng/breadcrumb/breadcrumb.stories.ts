import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { BreadcrumbItemData, MznBreadcrumb } from './breadcrumb.component';
import { MznBreadcrumbItem } from './breadcrumb-item.component';

export default {
  title: 'Navigation/Breadcrumb',
  component: MznBreadcrumb,
  decorators: [
    moduleMetadata({
      imports: [MznBreadcrumb, MznBreadcrumbItem, MznTypography],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

const breadcrumbItem: BreadcrumbItemData[] = [
  { id: 'home', name: 'Home', href: '/' },
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
    props: {
      items3: breadcrumbItem.slice(0, 3),
      items4: breadcrumbItem.slice(0, 4),
      items5: breadcrumbItem.slice(0, 5),
      items6: breadcrumbItem,
      condensed2: breadcrumbItem.slice(0, 2),
      condensed3: breadcrumbItem.slice(0, 3),
      condensed4: breadcrumbItem.slice(0, 4),
    },
    template: `
      <div style="display: grid; gap: 64px; padding-bottom: 160px;">
        <div style="display: grid; gap: 40px;">
          <h2 mznTypography variant="h2">Default</h2>

          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">3 items</span>
            <nav mznBreadcrumb [items]="items3"></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">4 items</span>
            <nav mznBreadcrumb [items]="items4"></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">5 items</span>
            <nav mznBreadcrumb [items]="items5"></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">6 items</span>
            <nav mznBreadcrumb [items]="items6"></nav>
          </div>
        </div>

        <div style="display: grid; gap: 24px;">
          <h2 mznTypography variant="h2">Condensed Mode</h2>

          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">2 items</span>
            <nav mznBreadcrumb [condensed]="true" [items]="condensed2"></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">3 items</span>
            <nav mznBreadcrumb [condensed]="true" [items]="condensed3"></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">4 items</span>
            <nav mznBreadcrumb [condensed]="true" [items]="condensed4"></nav>
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
    props: { withDropdownHref },
    template: `
      <div style="display: grid; gap: 64px; padding-bottom: 160px;">
        <div style="display: grid; gap: 40px;">
          <h2 mznTypography variant="h2">Item With Dropdown</h2>

          <!-- NOTE: Per-item dropdown menus (BreadcrumbItem options prop) from React
               are not yet supported in Angular MznBreadcrumb. Items with options
               are shown as plain non-linked breadcrumb items below. -->

          <nav mznBreadcrumb [items]="[
            { id: 'home', name: 'Home', href: '/' },
            { id: 'list', name: 'List', href: '/' },
            { id: 'history', name: 'History', href: '/' },
            { id: '01', name: '01' }
          ]" ></nav>

          <nav mznBreadcrumb [items]="[
            { id: 'home', name: 'Home', href: '/' },
            { id: 'list', name: 'List', href: '/' },
            { id: 'tab', name: 'Tab' },
            { id: 'history', name: 'History' },
            { id: '01', name: '01' }
          ]" ></nav>

          <nav mznBreadcrumb [items]="[
            { id: 'home', name: '首頁', href: withDropdownHref },
            { id: 'cms', name: '內容管理' },
            { id: 'arch', name: '建築', href: withDropdownHref }
          ]" ></nav>

          <nav mznBreadcrumb [items]="[
            { id: 'home', name: '首頁', href: withDropdownHref },
            { id: 'cms', name: '內容管理', href: withDropdownHref },
            { id: 'news', name: '相關新聞', href: withDropdownHref },
            { id: 'project', name: '建案資訊', href: withDropdownHref },
            { id: 'event', name: '活動新訊', href: withDropdownHref },
            { id: 'article', name: '文章列表', href: withDropdownHref },
            { id: 'arch', name: '建築', href: withDropdownHref }
          ]" ></nav>

          <h2 mznTypography variant="h2">Condensed</h2>
          <!-- NOTE: condensed=true shows last 2 items; overflow dropdown planned for future release. -->
          <nav mznBreadcrumb [condensed]="true" [items]="[
            { id: 'home', name: '首頁', href: withDropdownHref },
            { id: 'project', name: '建案管理' },
            { id: 'category', name: '分類管理' },
            { id: 'article', name: '文章列表', href: withDropdownHref }
          ]" ></nav>
        </div>
      </div>
    `,
  }),
};
