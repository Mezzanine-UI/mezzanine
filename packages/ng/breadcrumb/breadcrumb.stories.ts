import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznBreadcrumb } from './breadcrumb.component';
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

export const Playground: Story = {
  name: 'Playground',
  argTypes: {
    condensed: {
      control: 'boolean',
      description:
        'Show only the last two items (condensed mode). Overflow dropdown is planned for a future release.',
    },
    items: {
      control: 'object',
      description: 'Array of breadcrumb items.',
    },
  },
  args: {
    condensed: false,
    items: [
      { id: 'home', name: 'Home', href: '/' },
      { id: 'category', name: 'Category', href: '/category' },
      { id: 'subcategory', name: 'Subcategory', href: '/category/subcategory' },
      { id: 'current', name: 'Current Page' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<nav mznBreadcrumb [condensed]="condensed" [items]="items" ></nav>`,
  }),
};

export const Basic: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="display: grid; gap: 64px; padding-bottom: 160px;">
        <div style="display: grid; gap: 40px;">
          <h2 mznTypography variant="h2">Default</h2>

          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">3 items</span>
            <nav mznBreadcrumb [items]="[
              { id: 'home', name: 'Home', href: '/' },
              { id: 'category', name: 'Category', href: '/Category', target: '_blank' },
              { id: 'subcategory', name: 'Subcategory', href: '/Category/Subcategory', target: '_blank' }
            ]" ></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">4 items</span>
            <nav mznBreadcrumb [items]="[
              { id: 'home', name: 'Home', href: '/' },
              { id: 'category', name: 'Category', href: '/Category', target: '_blank' },
              { id: 'subcategory', name: 'Subcategory', href: '/Category/Subcategory', target: '_blank' },
              { id: 'tab', name: 'Tab', href: '/Category/Subcategory/Tab' }
            ]" ></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">5 items</span>
            <nav mznBreadcrumb [items]="[
              { id: 'home', name: 'Home', href: '/' },
              { id: 'category', name: 'Category', href: '/Category', target: '_blank' },
              { id: 'subcategory', name: 'Subcategory', href: '/Category/Subcategory', target: '_blank' },
              { id: 'tab', name: 'Tab', href: '/Category/Subcategory/Tab' },
              { id: 'detail', name: 'Detail', href: '/Category/Subcategory/Tab/Detail' }
            ]" ></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">6 items</span>
            <nav mznBreadcrumb [items]="[
              { id: 'home', name: 'Home', href: '/' },
              { id: 'category', name: 'Category', href: '/Category', target: '_blank' },
              { id: 'subcategory', name: 'Subcategory', href: '/Category/Subcategory', target: '_blank' },
              { id: 'tab', name: 'Tab', href: '/Category/Subcategory/Tab' },
              { id: 'detail', name: 'Detail', href: '/Category/Subcategory/Tab/Detail' },
              { id: 'history', name: 'History', href: '/Category/Subcategory/Tab/Detail/History' }
            ]" ></nav>
          </div>
        </div>

        <div style="display: grid; gap: 40px;">
          <h2 mznTypography variant="h2">Condensed</h2>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">condensed (5 items → shows last 2)</span>
            <nav mznBreadcrumb [condensed]="true" [items]="[
              { id: 'home', name: 'Home', href: '/' },
              { id: 'category', name: 'Category', href: '/Category' },
              { id: 'subcategory', name: 'Subcategory', href: '/Category/Subcategory' },
              { id: 'tab', name: 'Tab', href: '/Category/Subcategory/Tab' },
              { id: 'detail', name: 'Detail' }
            ]" ></nav>
          </div>
          <div style="display: grid; gap: 8px;">
            <span mznTypography variant="caption-highlight">condensed (3 items → shows last 2)</span>
            <nav mznBreadcrumb [condensed]="true" [items]="[
              { id: 'home', name: 'Home', href: '/' },
              { id: 'category', name: 'Category', href: '/Category' },
              { id: 'current', name: 'Current Page' }
            ]" ></nav>
          </div>
          <!-- NOTE: Overflow dropdown for collapsed middle items is planned for a future release. -->
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
